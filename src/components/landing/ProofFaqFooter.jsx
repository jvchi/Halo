// Faithful conversion of the light container: Trusted-by-Default proof, FAQ,
// newsletter, and footer. Original styles_* classes (the FAQ + newsletter keep
// the classes that cloneScript wires for interactivity). Honest, non-fabricated
// proof points and testimonial-product copy.

const proofs = [
  { stat: "5-min setup", desc: "From collection link to first embed." },
  { stat: "No account to submit", desc: "Customers leave a testimonial in one step." },
  { stat: "Lightweight embeds", desc: "Async, fast, and no layout shift." },
  { stat: "Works anywhere", desc: "Webflow, Framer, WordPress, Shopify, or HTML." },
  { stat: "Consent built-in", desc: "Every testimonial is permissioned." },
  { stat: "Accessible by default", desc: "Reduced-motion aware and keyboard-friendly." },
];

const faqs = [
  {
    q: "Do customers need an account to leave a testimonial?",
    a: "No. They open your collection link and submit in one step — text, a rating, and an optional photo. No login required.",
  },
  {
    q: "How do I show testimonials on my site?",
    a: "Design a widget in the studio, copy one embed snippet, and paste it into your page. It stays in sync automatically.",
  },
  {
    q: "Will an embed slow down or break my site?",
    a: "No. Embeds are lightweight and load asynchronously with no layout shift, and they keep working across deploys.",
  },
  {
    q: "Can I approve testimonials before they go live?",
    a: "Yes. Everything lands in your inbox as pending — nothing is published until you approve it, and you can edit or unpublish anytime.",
  },
];

const footerGroups = [
  { title: "Product", links: ["Widgets", "Walls", "Widget Studio", "Embeds"] },
  { title: "Resources", links: ["Blog", "Docs", "Help & Support", "Changelog"] },
  { title: "Developers", links: ["Documentation", "API", "Web Component", "Status"] },
  { title: "Company", links: ["About", "Careers"] },
  { title: "Legal & Privacy", links: ["Privacy Policy", "Terms of Service", "Consent", "Contact"] },
];

function ProofIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <path d="M6.5 10.2l2.3 2.3 4.7-4.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  // class + two paths so cloneScript can collapse the vertical bar on open
  return (
    <svg className="styles_collapsibleIcon__WuJte" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 4v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ transformBox: "fill-box", transformOrigin: "center", transition: "transform .2s ease" }} />
    </svg>
  );
}

export function ProofFaqFooter() {
  return (
    <div className="styles_container__KfcyI" data-theme="light">
      {/* Trusted by Default */}
      <section className="styles_section__ZlvVq styles_section__DYAms ">
        <div className="styles_inner__mnNbL">
          <div className="styles_content__aHSjq">
            <div className="styles_product__Ntvbx">
              <span className="styles_logo__EKrVz" style={{ display: "inline-flex", alignItems: "center", font: "600 20px/1 var(--font-sans)", letterSpacing: "-0.04em", color: "currentColor" }}>
                Halo
              </span>
            </div>
            <h1 className="styles_heading__VB3wz styles_level1Large__bDeUm styles_title__G9AAz">
              Trusted by Default
            </h1>
            <p className="styles_description__5Hvnp">
              Consent-first, lightweight, and accessible — social proof you can ship with confidence.
            </p>
            <div className="styles_buttons__I2eai" data-theme-light="true">
              <a className="styles_container__At_jz " data-variant="primary" href="#">Learn more</a>
              <a className="styles_container__At_jz " data-variant="secondary" href="/pricing">See pricing</a>
            </div>
            <div className="styles_container__XI72A">
              <div className="styles_cards__5bzjP">
                {proofs.map((p) => (
                  <div className="styles_card__I5aZM" key={p.stat}>
                    <div className="styles_cardIcon___kTG9">
                      <ProofIcon />
                    </div>
                    <h3 className="styles_cardHeading__rZEOs">{p.stat}</h3>
                    <p className="styles_cardDescription__fW4OO">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="styles_section__ZlvVq styles_section__SyNeT">
        <div className="styles_inner__mnNbL">
          <div className="styles_container__0_cJE">
            <h2 className="styles_heading__VB3wz styles_level2__ilE9d ">FAQs</h2>
            <div>
              <div className="">
                {faqs.map((f) => (
                  <div className="styles_collapsibleContainer__6ElmP" key={f.q}>
                    <div className="styles_collapsible__aqKSz" data-show-number="false">
                      <button className="styles_collapsibleButton__MlK3f" type="button">
                        <h3 className="styles_collapsibleTitle__nQ5wa">{f.q}</h3>
                        <PlusIcon />
                      </button>
                      <div className="styles_collapsibleContentWrapper__gWHrn" tabIndex={-1} style={{ height: "0px" }}>
                        <div className="styles_collapsibleContent__g9P4z" style={{ opacity: 0 }}>
                          <p>{f.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="styles_link__Zyfah" data-theme-light="true">
                <a className="styles_container__At_jz " data-variant="secondary" href="#">
                  More questions? Read the docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="styles_divider__Q0Hcm" data-variant="primary" data-full-width="false" />

      {/* Newsletter */}
      <section className="styles_section__ZlvVq styles_section__7zEIffalse">
        <div className="styles_inner__mnNbL">
          <div className="styles_newsletter__Q_ryO">
            <div className="styles_left__yMP_V">
              <h2 className="styles_title__KN_hu">Be the first to hear about new Halo features.</h2>
            </div>
            <div className="styles_right__04dLI">
              <div className="styles_inputAndLabel__MSBVS">
                <label htmlFor="email" className="styles_label__SdZuI">
                  <div className="styles_labelGroup__3ZHca">
                    <span>Email</span>
                    <div className="styles_dot__q9sFn" data-error="false" />
                  </div>
                  <div className="styles_status__waBZd" />
                </label>
                <div className="styles_inputRow__GGJO8">
                  <input type="email" id="email" placeholder="you@company.com" defaultValue="" />
                  <button type="button">
                    <span className="styles_buttonText__XzuT1">Sign Up</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="styles_divider__Q0Hcm" data-variant="primary" data-full-width="false" />

      {/* Footer */}
      <section className="styles_section__UnXri">
        <footer>
          <div className="styles_footerBody__uG7Oo">
            <nav>
              <ul className="styles_navLists__ag4hz">
                {footerGroups.map((group) => (
                  <li key={group.title}>
                    <p className="styles_navTitle__vbCUj">{group.title}</p>
                    <ul className="styles_navList__2u0oo">
                      {group.links.map((link) => (
                        <li className="styles_navListItem__7RBIL" key={link}>
                          <a className="styles_navLink__Of9Og" href="#">{link}</a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <span style={{ font: "600 19px/1 var(--font-sans)", letterSpacing: "-0.03em", color: "var(--fg-1)" }}>Halo</span>
              <span style={{ fontSize: 13, color: "var(--fg-3)" }}>© {new Date().getFullYear()} Halo. Built on a cloned reference, recolored and rewritten.</span>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
