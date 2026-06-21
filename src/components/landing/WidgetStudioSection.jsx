// Faithful conversion of the dark product section -> Halo "Widget Studio".
// Same original styles_* classes; testimonial copy + restored reference mockup.

const studioCards = [
  { label: "Layouts", heading: "Wall", sub: "Grid", desc: "Masonry walls and tidy grids for testimonial-heavy pages." },
  { label: "Motion", heading: "Carousel", sub: "Marquee", desc: "Auto-playing, reduced-motion-aware sliders and marquees." },
  { label: "Compact", heading: "Toast", sub: "Single", desc: "A floating toast or one hero quote for tight spaces." },
];

function StudioPreview() {
  return (
    <object
      data="/aave/a69524f00e279335.svg"
      type="image/svg+xml"
      aria-label="Widget Studio interface mockup"
    />
  );
}

export function WidgetStudioSection() {
  return (
    <div className="styles_container__KfcyI" data-theme="dark" data-theme-dark="true">
      <section className="styles_section__ZlvVq styles_section__DYAms ">
        <div className="styles_inner__mnNbL">
          <div className="styles_content__aHSjq">
            <div className="styles_product__Ntvbx">
              <img src="/aave/328b53a258ffceaa.png" alt="" width="28" height="28" />
              Widget Studio
            </div>
            <h1 className="styles_heading__VB3wz styles_level1Large__bDeUm styles_title__G9AAz">
              Design Widgets Visually
            </h1>
            <p className="styles_description__5Hvnp">
              Layout, theme, motion, and presets — preview live, then embed.
            </p>
            <div className="styles_buttons__I2eai">
              <a className="styles_container__At_jz " data-variant="primary" href="#">
                Open the studio
              </a>
              <a className="styles_container__At_jz " data-variant="secondary" href="#">
                See presets
              </a>
            </div>
            <div className="styles_illustration__G7Sbg">
              <div className="styles_illustrationFrame__g2Zal">
                <StudioPreview />
              </div>
            </div>
            <div className="styles_subsection__hAbWi">
              <div className="section-heading_sectionHeading__nt8p8">
                <div className="section-heading_sectionTitleBlock__JY3cm">
                  <h2>A widget for every page.</h2>
                </div>
                <p>
                  From a single quote to a full Wall of Love, pick a layout and theme that fits where
                  it lives.
                </p>
              </div>
              <a className="styles_container__At_jz " data-variant="secondary" href="#">
                See widget types
              </a>
            </div>
            <div className="styles_cards__yrfVG">
              {studioCards.map((c) => (
                <div className="styles_card__OmWCN" key={c.heading}>
                  <span className="styles_cardLabel__RC5Sa">{c.label}</span>
                  <h2 className="styles_cardHeading__pozGi">
                    {c.heading} <span className="styles_cardSubheading__kcurR">• {c.sub}</span>
                  </h2>
                  <p className="styles_cardDescription__x__y5">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
