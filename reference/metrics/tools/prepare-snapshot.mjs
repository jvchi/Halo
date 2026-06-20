import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const referencesDir = path.join(root, "references");
const assetsDir = path.join(root, "assets", "source");
const scriptsDir = path.join(root, "scripts");
const stylesDir = path.join(root, "styles");
const rawHtmlPath = path.join(referencesDir, "aave-rendered.raw.html");
const bundleJsonPath = path.join(referencesDir, "aave-assets-bundle.json");

const bundle = JSON.parse(await fs.readFile(bundleJsonPath, "utf8"));
await fs.rm(assetsDir, { recursive: true, force: true });
await fs.mkdir(assetsDir, { recursive: true });
await fs.mkdir(scriptsDir, { recursive: true });
await fs.mkdir(stylesDir, { recursive: true });

const urlToFile = new Map();
const copyTasks = [];
const stylesheetFiles = new Set();

for (const asset of bundle.assets) {
  const fileName = path.basename(asset.path);
  const dest = path.join(assetsDir, fileName);
  copyTasks.push(fs.copyFile(asset.path, dest));
  urlToFile.set(asset.url, fileName);
  if (asset.kind === "stylesheet") {
    stylesheetFiles.add(fileName);
  }

  if (asset.url.startsWith("https://aave.com/")) {
    const pathname = new URL(asset.url).pathname;
    urlToFile.set(pathname, fileName);
    urlToFile.set(`https://aave.com${pathname}`, fileName);
  }
}

await Promise.all(copyTasks);

function assetRefForHtml(url) {
  const fileName = urlToFile.get(url);
  return fileName ? `./assets/source/${fileName}` : null;
}

function assetRefForCss(url) {
  const fileName = urlToFile.get(url);
  return fileName || null;
}

async function downloadFont(url) {
  if (urlToFile.has(url)) return urlToFile.get(url);

  const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 12);
  const ext = path.extname(new URL(url).pathname) || ".woff2";
  const fileName = `inter-${hash}${ext}`;
  const dest = path.join(assetsDir, fileName);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(dest, bytes);
  urlToFile.set(url, fileName);
  return fileName;
}

const maybeCssFiles = await fs.readdir(assetsDir);
for (const fileName of maybeCssFiles) {
  if (!stylesheetFiles.has(fileName)) continue;
  const filePath = path.join(assetsDir, fileName);
  const text = await fs.readFile(filePath, "utf8");

  const fontUrls = [...text.matchAll(/https:\/\/fonts\.gstatic\.com\/[^"')\s]+/g)].map((match) => match[0]);
  for (const fontUrl of fontUrls) {
    await downloadFont(fontUrl);
  }
}

function rewriteCssUrls(css, htmlMode = false) {
  return css.replace(/url\((["']?)([^"')]+)\1\)/g, (full, quote, rawUrl) => {
    const url = rawUrl.trim();
    if (!url || url.startsWith("data:") || url.startsWith("#")) return full;

    const normalized = url.startsWith("https://aave.com/")
      ? new URL(url).pathname
      : url;

    const ref = htmlMode
      ? assetRefForHtml(url) || assetRefForHtml(normalized)
      : assetRefForCss(url) || assetRefForCss(normalized);

    if (!ref) return full;
    return `url("${ref}")`;
  });
}

for (const fileName of await fs.readdir(assetsDir)) {
  if (!stylesheetFiles.has(fileName)) continue;
  const filePath = path.join(assetsDir, fileName);
  const text = await fs.readFile(filePath, "utf8");
  await fs.writeFile(filePath, rewriteCssUrls(text));
}

let html = await fs.readFile(rawHtmlPath, "utf8");
const nextDataIndex = html.indexOf('<script id="__NEXT_DATA__"');
if (nextDataIndex !== -1) {
  html = `${html.slice(0, nextDataIndex)}</body></html>`;
}

html = html.replace(/<script\b[\s\S]*?<\/script>/g, "");
html = html.replace(/<link\b[^>]+rel=["'](?:preload|prefetch|modulepreload)["'][^>]*>/g, "");
html = html.replace(/<link\b[^>]+rel=["']preconnect["'][^>]*>/g, "");
html = html.replace(/<link\b[^>]+data-codex-favicon-badge[^>]*>/g, "");
html = html.replace(/<plasmo-csui\b[\s\S]*?<\/plasmo-csui>/g, "");
html = html.replace(/\sdata-n-[a-z]+="[^"]*"/g, "");
html = html.replace(/\sdata-next-hide-fouc="[^"]*"/g, "");
html = html.replace(/\sstyle="color:transparent"/g, ' style="color:transparent"');

for (const [url, fileName] of urlToFile.entries()) {
  if (url.startsWith("inline-svg:")) continue;
  const htmlRef = `./assets/source/${fileName}`;
  html = html.split(url).join(htmlRef);
  html = html.split(url.replaceAll("&", "&amp;")).join(htmlRef);
}

html = rewriteCssUrls(html, true);
html = html.replace(/href="\/(?!\/|#)([^"]*)"/g, (match, href) => {
  if (
    href.startsWith("images/") ||
    href.startsWith("fonts/") ||
    href.startsWith("_next/") ||
    href.startsWith("assets/")
  ) {
    return match;
  }
  return `href="https://aave.com/${href}"`;
});
html = html.replace(/href="\/"/g, 'href="./"');
html = html.replace(/href="\/#"/g, 'href="#"');
html = html.replace(/<title\b[^>]*>.*?<\/title>/, "<title>Aave Clone</title>");

const injectedHead = [
  '<link rel="icon" href="./assets/source/691e3f08f923b735.png">',
  '<link rel="stylesheet" href="./styles/clone-overrides.css">',
  '<script defer src="./scripts/clone.js"></script>'
].join("");
html = html.replace("</head>", `${injectedHead}</head>`);

await fs.writeFile(path.join(root, "index.html"), html);

const summary = {
  generatedAt: new Date().toISOString(),
  assetCount: bundle.assets.length,
  localAssetDirectory: assetsDir,
  source: "https://aave.com/"
};
await fs.writeFile(path.join(referencesDir, "clone-generation-summary.json"), JSON.stringify(summary, null, 2));
