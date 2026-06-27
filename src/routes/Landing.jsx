import { useEffect } from "react";
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
export default function Landing() {
  useEffect(() => {
    const cleanupClone = setupClone();
    return () => cleanupClone?.();
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
