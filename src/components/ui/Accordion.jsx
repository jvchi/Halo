import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// .aave-accordion — FAQ rows with a plus→minus toggle and animated height,
// reproducing the clone's setupFaq behaviour with Motion.

function ToggleIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <motion.line
        x1="10"
        y1="3"
        x2="10"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "10px", originY: "10px" }}
        animate={{ scaleY: open ? 0 : 1 }}
        transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
      />
    </svg>
  );
}

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="border-t border-halo-border-2">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question} className="border-b border-halo-border-2">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left text-halo-fg-1"
            >
              <span className="text-[18px] font-[450] leading-[1.35] tracking-[-0.018em]">
                {item.question}
              </span>
              <ToggleIcon open={open} />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.19, 1, 0.22, 1] }}
                  className="overflow-hidden"
                >
                  <p className="m-0 max-w-[760px] pb-6 text-[16px] leading-[1.5] text-halo-fg-2">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
