import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { HaloIcon, HaloIconChip } from "@/components/dashboard/HaloIcon.jsx";
import { useTestimonials } from "@/lib/testimonialsStore.jsx";

const analysisOptions = [
  {
    id: "love",
    icon: "star",
    title: "What your customers love about you",
    resultTitle: "Customers consistently praise",
    getPoints: (items) => [
      `${items.length || 0} approved testimonials mention speed, polish, or trust.`,
      "Most positive quotes are specific enough to reuse on landing pages.",
      "The strongest proof comes from founder and growth roles.",
    ],
  },
  {
    id: "pain",
    icon: "feedback",
    title: "Custom pain points",
    resultTitle: "Pain points to address",
    getPoints: () => [
      "Collection friction shows up when customers need to upload media.",
      "Manual proof migration is a recurring operational task.",
      "Publishing workflows should make approval state obvious before embed.",
    ],
  },
  {
    id: "phrases",
    icon: "code",
    title: "Common phrases",
    resultTitle: "Repeated language",
    getPoints: (items) =>
      ["saved time", "looks professional", "easy to share", "trust on pricing pages"].map(
        (phrase) => `${phrase} / seen across ${Math.max(2, Math.ceil((items.length || 4) / 2))} proof items`
      ),
  },
  {
    id: "improve",
    icon: "wand",
    title: "What can be improved",
    resultTitle: "Improvement themes",
    getPoints: () => [
      "Add more source variety so proof does not feel like one channel.",
      "Tag proof by page and objection before publishing widgets.",
      "Turn long testimonials into shorter hero-ready highlights.",
    ],
  },
  {
    id: "prompt",
    icon: "studio",
    title: "Custom Prompt",
    resultTitle: "Custom analysis",
    getPoints: () => [
      "Ask a focused question, then use the selected testimonials as the source set.",
      "Halo will return a concise summary, proof examples, and suggested tags.",
      "Use this for campaign-specific research or conversion-page copy.",
    ],
  },
];

export default function Analyze() {
  const { approved } = useTestimonials();
  const [selectedId, setSelectedId] = useState(null);
  const [prompt, setPrompt] = useState("");
  const selected = analysisOptions.find((item) => item.id === selectedId);
  const points = useMemo(() => (selected ? selected.getPoints(approved, prompt) : []), [approved, prompt, selected]);

  return (
    <div className="halo-page halo-analyze-page">
      <section className="halo-analyze-picker">
        <header>
          <h1>Analysis</h1>
          <button type="button" className="halo-copy-button is-primary" onClick={() => setSelectedId("love")}>
            <HaloIcon name="search" size={15} />
            Select Testimonials
          </button>
        </header>

        <div className="halo-analyze-loading" aria-hidden="true">
          <span />
          <span />
        </div>

        <div className="halo-analyze-options">
          {analysisOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(selectedId === item.id && "is-active")}
            >
              <HaloIconChip name={item.icon} size={18} />
              {item.title}
            </button>
          ))}
        </div>
      </section>

      <section className="halo-analyze-output" aria-label="Analysis output">
        <header>
          <span>{selected ? selected.resultTitle : "---"}</span>
          <button
            type="button"
            aria-label="Copy analysis"
            onClick={() => selected && navigator.clipboard?.writeText(points.join("\n"))}
          >
            <HaloIcon name="copy" size={18} />
          </button>
        </header>

        {selected ? (
          <div className="halo-analyze-result">
            {selected.id === "prompt" ? (
              <label>
                Prompt
                <textarea
                  className="halo-field min-h-[120px] resize-y"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="What should Halo look for in my testimonials?"
                />
              </label>
            ) : null}
            <div className="halo-check-list">
              {points.map((point) => (
                <p key={point}>
                  <HaloIcon name="check" size={16} />
                  {point}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p>Select an option to get started.</p>
        )}
      </section>
    </div>
  );
}
