/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Colors resolve to CSS variables defined in src/styles/tokens.css so the
      // Display-P3 @supports overrides apply automatically on wide-gamut displays.
      colors: {
        halo: {
          "bg-1": "var(--halo-bg-1)",
          "bg-2": "var(--halo-bg-2)",
          "bg-3": "var(--halo-bg-3)",
          "bg-4": "var(--halo-bg-4)",
          "border-1": "var(--halo-border-1)",
          "border-2": "var(--halo-border-2)",
          "fg-1": "var(--halo-fg-1)",
          "fg-2": "var(--halo-fg-2)",
          "fg-3": "var(--halo-fg-3)",
          "fg-4": "var(--halo-fg-4)",
          primary: {
            DEFAULT: "var(--halo-primary)",
            soft: "var(--halo-primary-soft)",
            wash: "var(--halo-primary-wash)",
            tint: "var(--halo-primary-tint)",
          },
          blue: {
            1: "var(--halo-blue-1)",
            2: "var(--halo-blue-2)",
            3: "var(--halo-blue-3)",
            4: "var(--halo-blue-4)",
          },
          yellow: {
            1: "var(--halo-yellow-1)",
            2: "var(--halo-yellow-2)",
            3: "var(--halo-yellow-3)",
          },
          green: "var(--halo-green)",
          gho: "var(--halo-gho)",
          red: "var(--halo-red)",
          pink: "var(--halo-pink)",
          purple: "var(--halo-purple)",
          indigo: "var(--halo-indigo)",
          teal: "var(--halo-teal)",
          orange: "var(--halo-orange)",
          focus: "var(--halo-focus)",
          wallet: "var(--halo-wallet)",
          account: "var(--halo-account)",
          "stat-card": "var(--halo-stat-card)",
          "newsletter-card": "var(--halo-newsletter-card)",
          "dark-surface": "var(--halo-dark-surface)",
          "dark-card": "var(--halo-dark-card)",
          glass: "var(--halo-glass-card)",
          "glass-hover": "var(--halo-glass-card-hover)",
        },
      },
      fontFamily: {
        sans: [
          "Halo Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "Halo Mono",
          "SFMono-Regular",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      // Named type scale lifted verbatim from design/design.md (size / line-height /
      // letter-spacing / weight). Use e.g. text-display-72, text-body-16.
      fontSize: {
        "display-72": ["72px", { lineHeight: "79.2px", letterSpacing: "-3.6px", fontWeight: "500" }],
        "display-48": ["48px", { lineHeight: "52.8px", letterSpacing: "-1.44px", fontWeight: "500" }],
        "heading-40": ["40px", { lineHeight: "48px", letterSpacing: "-1.2px", fontWeight: "500" }],
        "heading-40-tall": ["40px", { lineHeight: "54px", letterSpacing: "-0.8px", fontWeight: "500" }],
        "heading-32": ["32px", { lineHeight: "35.2px", letterSpacing: "-1px", fontWeight: "500" }],
        "heading-24": ["24px", { lineHeight: "32.4px", letterSpacing: "-0.72px", fontWeight: "500" }],
        "heading-24-loose": ["24px", { lineHeight: "36px", letterSpacing: "-0.47px", fontWeight: "450" }],
        "heading-18": ["18px", { lineHeight: "24.48px", letterSpacing: "-0.18px", fontWeight: "500" }],
        "question-18": ["18px", { lineHeight: "24.3px", letterSpacing: "-0.33px", fontWeight: "450" }],
        "lead-20": ["20px", { lineHeight: "27.2px", letterSpacing: "-0.2px", fontWeight: "400" }],
        "body-16": ["16px", { lineHeight: "24px", letterSpacing: "-0.16px", fontWeight: "400" }],
        "body-14": ["14px", { lineHeight: "19.6px", letterSpacing: "-0.14px", fontWeight: "400" }],
        "label-14": ["14px", { lineHeight: "14.7px", letterSpacing: "-0.09px", fontWeight: "500" }],
        "nav-14": ["14px", { lineHeight: "14.7px", letterSpacing: "-0.09px", fontWeight: "450" }],
        "button-17": ["17px", { lineHeight: "17px", letterSpacing: "-0.17px", fontWeight: "500" }],
      },
      fontWeight: {
        book: "450",
      },
      spacing: {
        18: "72px",
        25: "100px",
        30: "120px",
      },
      borderRadius: {
        xs: "6px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        pill: "99rem",
      },
      maxWidth: {
        content: "986px",
        wide: "1082px",
        newsletter: "493px",
      },
      // No boxShadow tokens by design — Halo is flat (see design/design.md
      // "Elevation & Depth"). Use borders and background shifts, never shadows.
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
        swift: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      transitionDuration: {
        snappy: "750ms",
        swift: "1800ms",
      },
    },
  },
  plugins: [],
};
