// Faithful conversion of the purple "Build with Aave" section -> Halo "Embeds".
// Original styles_* classes; partner cards become integration platforms.

const integrations = [
  { name: "Webflow", icon: "https://cdn.simpleicons.org/webflow?viewbox=auto", stat: "Copy-paste embed", desc: "Native to your Webflow site." },
  { name: "Framer", icon: "https://cdn.simpleicons.org/framer?viewbox=auto", stat: "Component ready", desc: "Drop into any Framer page." },
  { name: "WordPress", icon: "wordpress", stat: "Plugin + shortcode", desc: "Works in the block editor." },
  { name: "Shopify", icon: "shopify", stat: "App block", desc: "Add to product or home pages." },
  { name: "Plain HTML", icon: "https://cdn.simpleicons.org/html5?viewbox=auto", stat: "One script tag", desc: "Or a simple iframe." },
  { name: "React", icon: "https://cdn.simpleicons.org/react?viewbox=auto", stat: "npm package", desc: "A <TestimonialWidget/> for your app." },
];

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoBox({ name, icon }) {
  const isBrandSvg = icon.startsWith("https://cdn.simpleicons.org");
  const src = icon.startsWith("https://")
    ? icon
    : `https://iconsclub.xyz/logo/${icon}/96.png?radius=28`;
  const iconPadding = isBrandSvg ? (name === "Framer" ? 12 : 10) : 0;

  return (
    <div
      className="styles_cardLogo__v7QcU"
      style={{
        display: "grid",
        placeItems: "center",
        fontWeight: 600,
        fontSize: 18,
        color: "var(--fg-2)",
        background: "var(--bg-3)",
        overflow: "hidden",
      }}
    >
      <span
        className="halo-integration-logo-bg"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--bg-3)",
          filter: "grayscale(1)",
          transition: "filter .32s ease, opacity .32s ease",
        }}
      />
      <img
        className="halo-integration-logo"
        src={src}
        alt=""
        width="48"
        height="48"
        loading="lazy"
        decoding="async"
        onError={(event) => {
          event.currentTarget.replaceWith(document.createTextNode(name[0]));
        }}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: isBrandSvg ? "contain" : "cover",
          padding: iconPadding,
          boxSizing: "border-box",
          filter: "grayscale(1)",
          transition: "filter .32s ease",
          position: "relative",
          zIndex: 1,
        }}
      />
    </div>
  );
}

function EmbedPreview() {
  return (
    <img
      src="/aave/3e2aebac56853d99.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      style={{
        display: "block",
        width: "100%",
        maxWidth: 570,
        height: "auto",
        margin: "0 auto",
      }}
    />
  );
}

export function EmbedsSection() {
  return (
    <div className="styles_container__KfcyI" data-theme="purple">
      <section className="styles_section__ZlvVq styles_section__DYAms ">
        <div className="styles_inner__mnNbL">
          <div className="styles_content__aHSjq">
            <div className="styles_product__Ntvbx">
              <img src="/aave/b504d8e0754c5b8b.png" alt="" width="28" height="28" />
              Embeds
            </div>
            <h1 className="styles_heading__VB3wz styles_level1Large__bDeUm styles_title__G9AAz">
              Embed Anywhere
            </h1>
            <p className="styles_description__5Hvnp">
              One line of code on Webflow, Framer, WordPress, Shopify, or plain HTML.
            </p>
            <div className="styles_buttons__I2eai">
              <a className="styles_container__At_jz " data-variant="primary" href="#">
                Get the embed
              </a>
              <a className="styles_container__At_jz " data-variant="secondary" href="#">
                Read the docs
              </a>
            </div>
            <div className="styles_illustration__6o5HA">
              <EmbedPreview />
            </div>
            <div className="styles_partnerQuotesSurface__TYXv_">
              <div className="styles_section__IdrL0">
                <div className="styles_subsection__OsngC">
                  <div className="styles_headingColumn__TdxjJ">
                    <div className="section-heading_sectionHeading__nt8p8">
                      <div className="section-heading_sectionTitleBlock__JY3cm">
                        <h2>Ships with your stack.</h2>
                      </div>
                      <p>Copy one snippet. Your widget stays in sync, loads fast, and respects reduced motion.</p>
                    </div>
                  </div>
                  <a className="styles_container__At_jz " data-variant="white" href="#">
                    Read the docs
                  </a>
                </div>
                <div className="styles_grid__wOhjp">
                  {integrations.map((it) => (
                    <a
                      className="styles_card__TUPXy"
                      href="#"
                      key={it.name}
                    >
                      <div className="styles_cardHeader__ROlZJ">
                        <LogoBox name={it.name} icon={it.icon} />
                        <span className="styles_cardName__2UQB0">{it.name}</span>
                        <span className="styles_cardArrow__PQ4oi" aria-hidden="true">
                          <Arrow />
                        </span>
                      </div>
                      <div className="styles_cardBody__NbxoY">
                        <p className="styles_cardStat__GZJGI">{it.stat}</p>
                        <p className="styles_cardDescription__aXDgw">{it.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
