// Faithful conversion of the reference hero section: same original styles_* classes
// (so it matches pixel-for-pixel under the loaded reference CSS), with editable
// testimonial copy and restored reference mockup assets.

function HeroPreview() {
  const carouselImages = [
    "/aave/0689a00f4fd5617e.png",
    "/aave/8a2f243a45cdcc0b.png",
    "/aave/e620388c8ca8c276.png",
    "/aave/d2c11cadd22b2f79.png",
  ];

  return (
    <>
      <div className="styles_heroImagesSection__b7UJZ">
        <div className="styles_heroImagesWrapper__tIcFe" style={{ opacity: 1 }}>
          <img
            src="/aave/eeaf9719fae09813.png"
            alt=""
            aria-hidden="true"
            width="323.34096"
            height="512.954485926"
            loading="eager"
            decoding="async"
          />
          <img
            src="/aave/605f6debf27cc7f6.png"
            alt=""
            aria-hidden="true"
            width="323.34096"
            height="552.873122963"
            loading="eager"
            decoding="async"
          />
          <img
            src="/aave/e00249ba9aa04e5a.png"
            alt=""
            aria-hidden="true"
            width="323.34096"
            height="512.954485926"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
      <div className="styles_carouselSection__WCwWA">
        <div className="styles_carousel__PBax4">
          {carouselImages.map((src) => (
            <div className="styles_carouselItem__SYjIv" key={src}>
              <img
                className="styles_carouselItemImage__OIh_s"
                src={src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        <div className="styles_carouselDots__Zw1Q6" aria-hidden="true">
          {carouselImages.map((src, index) => (
            <button
              className={`styles_carouselDot__q4ZlO${index === 0 ? " styles_active__c9ug_" : ""}`}
              type="button"
              tabIndex="-1"
              key={src}
            />
          ))}
        </div>
      </div>
    </>
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
              <a className="styles_container__At_jz" data-snappy-fill data-variant="secondary" href="#">
                Learn more
              </a>
            </div>
            <HeroPreview />
          </div>
        </div>
      </section>
    </div>
  );
}
