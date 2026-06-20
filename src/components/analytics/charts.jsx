import { useId, useRef, useState } from "react";

// Apple-style data viz, grounded in the Halo design system: smooth curves over
// low-opacity accent gradient fills (Stocks/Health), concentric rounded-cap
// rings with hue-to-hue gradient strokes (Fitness), tabular figures, and
// green/red deltas. No gridlines, no shadows — flat per design/design.md.

export const fmt = (n) => n.toLocaleString("en-US");

// Catmull-Rom → cubic bézier: the gentle, monotone-ish smoothing Apple uses,
// without overshoot spikes between points.
function buildSmoothPath(pts) {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x} ${pts[0].y}` : "";
  const d = [`M ${pts[0].x} ${pts[0].y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

export function Delta({ value }) {
  const up = value >= 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        color: up ? "var(--halo-green)" : "var(--halo-red)",
        fontSize: 12,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
        <path d={up ? "M5 1l4 7H1z" : "M5 9 1 2h8z"} fill="currentColor" />
      </svg>
      {Math.abs(value)}%
    </span>
  );
}

export function Sparkline({ data, accent = "var(--halo-primary)", height = 40 }) {
  const id = useId();
  const W = 120;
  const H = height;
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const xs = (i) => pad + i * ((W - 2 * pad) / Math.max(1, data.length - 1));
  const ys = (v) => pad + (H - 2 * pad) * (1 - (v - min) / (max - min || 1));
  const pts = data.map((v, i) => ({ x: xs(i), y: ys(v) }));
  const line = buildSmoothPath(pts);
  const area = `${line} L ${xs(data.length - 1)} ${H} L ${xs(0)} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function AreaChart({ series, ticks = [], accent = "var(--halo-primary)" }) {
  const id = useId();
  const W = 680;
  const H = 256;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const xs = (i) => padL + i * (innerW / Math.max(1, series.length - 1));
  const ys = (v) => padT + innerH * (1 - (v - min) / (max - min || 1));
  const pts = series.map((v, i) => ({ x: xs(i), y: ys(v) }));
  const line = buildSmoothPath(pts);
  const baseY = padT + innerH;
  const area = `${line} L ${xs(series.length - 1)} ${baseY} L ${xs(0)} ${baseY} Z`;
  const last = pts[pts.length - 1];

  const ref = useRef(null);
  const [hi, setHi] = useState(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((x - padL) / innerW) * (series.length - 1));
    setHi(Math.max(0, Math.min(series.length - 1, i)));
  }
  const hp = hi != null ? pts[hi] : null;
  const calloutX = hp ? Math.min(Math.max(hp.x, 30), W - 30) : 0;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: "block" }}
      onMouseMove={onMove}
      onMouseLeave={() => setHi(null)}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.24" />
          <stop offset="78%" stopColor={accent} stopOpacity="0.03" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={padL} y1={baseY} x2={W - padR} y2={baseY} stroke="var(--halo-border-1)" strokeWidth="1" />
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      {ticks.map((t) => (
        <text key={t.i} x={xs(t.i)} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--halo-fg-3)">
          {t.label}
        </text>
      ))}

      {hp ? (
        <g>
          <line x1={hp.x} y1={padT} x2={hp.x} y2={baseY} stroke="var(--halo-border-2)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={hp.x} cy={hp.y} r="4.5" fill={accent} />
          <circle cx={hp.x} cy={hp.y} r="2" fill="#fff" />
          <g transform={`translate(${calloutX}, ${Math.max(hp.y - 14, 12)})`}>
            <rect x="-28" y="-16" width="56" height="20" rx="6" fill="var(--halo-fg-1)" />
            <text x="0" y="-2" textAnchor="middle" fontSize="11" fontWeight="600" fill="#fff">
              {fmt(series[hi])}
            </text>
          </g>
        </g>
      ) : (
        <>
          <circle cx={last.x} cy={last.y} r="4.5" fill={accent} />
          <circle cx={last.x} cy={last.y} r="2" fill="#fff" />
        </>
      )}
    </svg>
  );
}

export function ActivityRings({ rings, size = 196 }) {
  const stroke = 14;
  const gap = 6;
  const cx = size / 2;
  const cy = size / 2;
  const baseId = useId();
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ maxWidth: "100%" }}>
      <defs>
        {rings.map((r, k) => (
          <linearGradient key={k} id={`${baseId}-${k}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={r.color2 || r.color} />
            <stop offset="100%" stopColor={r.color} />
          </linearGradient>
        ))}
      </defs>
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {rings.map((r, k) => {
          const radius = size / 2 - stroke / 2 - k * (stroke + gap);
          const circ = 2 * Math.PI * radius;
          const frac = Math.max(0, Math.min(1, r.value / r.goal));
          return (
            <g key={k}>
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke={r.color} strokeOpacity="0.14" strokeWidth={stroke} />
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={`url(#${baseId}-${k})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - frac)}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Bars({ items, accent = "var(--halo-primary)" }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  if (items.length === 0) {
    return <p className="m-0 py-6 text-center text-[13px] text-halo-fg-3">No data for this range yet.</p>;
  }
  return (
    <div className="grid gap-3">
      {items.map((it) => (
        <div key={it.id || it.label} className="grid gap-1.5">
          <div className="flex items-center justify-between gap-3 text-[13px]">
            <span className="truncate text-halo-fg-1">
              {it.label}
              {it.sub ? <span className="text-halo-fg-3"> · {it.sub}</span> : null}
            </span>
            <span className="shrink-0 tabular-nums text-halo-fg-2">{fmt(it.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-pill bg-halo-bg-4">
            <div
              className="h-full rounded-pill"
              style={{
                width: `${Math.max(4, (it.value / max) * 100)}%`,
                background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 55%, #fff))`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
