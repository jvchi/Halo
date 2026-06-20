// Faithful conversion of the reference hero section: same original styles_* classes
// (so it matches pixel-for-pixel under the loaded reference CSS), with editable
// testimonial copy and Halo illustration art in place of the DeFi phone imagery.

function HeroPreview() {
  return (
    <img
      src="/illustrations/landing-hero-widgets.png"
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
      style={{
        display: "block",
        width: "min(100%, 620px)",
        height: "auto",
        margin: "32px auto 0",
      }}
    />
  );
}

export function Hero() {
  return (
    <div className="styles_container__KfcyI" data-theme="purple">
      <section className="styles_section__ZlvVq styles_section__DYAms styles_flushBottom__CxTdt">
        <div className="styles_inner__mnNbL">
          <div className="styles_content__aHSjq">
            <div className="styles_product__Ntvbx">
              <img src="/aave/684683d505724263.png" alt="" width="28" height="28" />
              Testimonial widgets
            </div>
            <h1 className="styles_heading__VB3wz styles_level1Large__bDeUm styles_title__G9AAz">
              Testimonials That Match Your Brand
            </h1>
            <p className="styles_description__5Hvnp">
              Collect, approve, and embed premium testimonial widgets that look native to your
              site — in minutes.
            </p>
            <div className="styles_buttons__I2eai">
              <button className="styles_container__At_jz" data-variant="primary">
                Get started
              </button>
              <a className="styles_container__At_jz" data-variant="secondary" href="#">
                Learn more
              </a>
            </div>
            <div className="styles_heroImagesSection__b7UJZ">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
