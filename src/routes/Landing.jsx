import { useLayoutEffect } from "react";
import headCss from "@/reference-landing/head.css?raw";
import recolorCss from "@/reference-landing/halo-recolor.css?raw";
import headerRegionHtml from "@/reference-landing/header-region.html?raw";
import { setupClone } from "@/reference-landing/cloneScript.js";
import { Hero } from "@/components/landing/Hero.jsx";
import { WidgetStudioSection } from "@/components/landing/WidgetStudioSection.jsx";
import { EmbedsSection } from "@/components/landing/EmbedsSection.jsx";
import { ProofFaqFooter } from "@/components/landing/ProofFaqFooter.jsx";

// The reference homepage, recolored to Halo blue. Converted section-by-section
// into editable components (Hero done); the not-yet-converted sections render as
// a balanced embed of the original markup. The header + remaining sections still
// use the original styles_* CSS, so everything stays pixel-faithful.
const LINK_CSS = [
  "/aave/f0e43dd704f7b0e5.css", // Inter @font-face
  "/aave/87989486595822bb.css", // design tokens
  "/aave/clone-overrides.css", // menu/toast fixes
];

export default function Landing() {
  useLayoutEffect(() => {
    const nodes = [];
    for (const href of LINK_CSS) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.haloRef = "1";
      document.head.appendChild(link);
      nodes.push(link);
    }
    const critical = document.createElement("style");
    critical.dataset.haloRef = "1";
    critical.textContent = headCss;
    document.head.appendChild(critical);
    nodes.push(critical);

    const recolor = document.createElement("style");
    recolor.dataset.haloRef = "1";
    recolor.textContent = recolorCss;
    document.head.appendChild(recolor);
    nodes.push(recolor);

    const cleanupClone = setupClone();
    return () => {
      nodes.forEach((node) => node.remove());
      cleanupClone?.();
    };
  }, []);

  return (
    <div id="__next">
      {/* original header + mobile menu (display:contents keeps it a direct child) */}
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: headerRegionHtml }} />
      <main className="styles_main__XsB95">
        <Hero />
        <WidgetStudioSection />
        <EmbedsSection />
        <ProofFaqFooter />
      </main>
    </div>
  );
}
