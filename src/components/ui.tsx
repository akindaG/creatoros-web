import { useId, type ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`glass rounded-2xl ${className}`}>{children}</section>;
}

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="kicker mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-[-.045em] text-[#f1f4ff] sm:text-3xl">{title}</h1>
        {description && <p className="muted mt-2 max-w-2xl text-sm leading-6">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, delta, hint }: { label: string; value: string; delta?: string; hint?: string }) {
  return (
    <Card className="panel-hover relative overflow-hidden p-5">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/[.09] blur-2xl" />
      <div className="absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-violet-400/35 to-transparent" />
      <div className="relative flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold tracking-wide text-[#93a0b8]">{label}</span>
        <span className="h-2 w-2 rounded-full bg-[#4edea3] shadow-[0_0_16px_rgba(78,222,163,.55)]" />
      </div>
      <div className="relative mt-4 text-3xl font-semibold tracking-[-.05em] text-[#f1f4ff]">{value}</div>
      <div className="relative mt-2 flex flex-wrap items-center gap-2 text-[10px]">
        {delta && <span className="rounded-full bg-emerald-300/[.055] px-2 py-1 font-semibold text-[#4edea3]">↗ {delta}</span>}
        {hint && <span className="text-[#6f7b92]">{hint}</span>}
      </div>
    </Card>
  );
}

export function SparkChart({ compact = false, values = [] }: { compact?: boolean; values?: number[] }) {
  const lineId = useId().replaceAll(":", "");
  const areaId = useId().replaceAll(":", "");
  const cleaned = values.filter((value) => Number.isFinite(value));
  const plotted = cleaned.length >= 2 ? cleaned : [0, 0];
  const min = Math.min(...plotted);
  const max = Math.max(...plotted);
  const range = max - min || 1;
  const points = plotted.map((value, index) => {
    const x = plotted.length === 1 ? 350 : (index / (plotted.length - 1)) * 700;
    const y = 225 - ((value - min) / range) * 170;
    return [x, y] as const;
  });
  const linePath = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L700 260 L0 260 Z`;
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/[.055] bg-[#040a18]/70 shadow-[inset_0_1px_0_rgba(255,255,255,.012)] ${compact ? "h-44" : "h-72"}`}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "100% 25%, 14.285% 100%" }} />
      <svg viewBox="0 0 700 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7c3aed"/><stop offset=".52" stopColor="#d2bbff"/><stop offset="1" stopColor="#4edea3"/></linearGradient>
          <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b5cf6" stopOpacity=".28"/><stop offset="1" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${areaId})`} />
        <path d={linePath} fill="none" stroke={`url(#${lineId})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!cleaned.length && <div className="absolute inset-0 grid place-items-center px-4"><span className="rounded-full border border-white/[.06] bg-[#050a19]/88 px-3 py-1.5 text-center text-[10px] font-semibold text-[#77839a] shadow-[0_10px_30px_rgba(0,0,0,.2)]">Analytics will appear after performance data is recorded</span></div>}
    </div>
  );
}

export function Donut({ value = "0", label = "Reach", primaryPercent = 0, secondaryPercent = 0 }: { value?: string; label?: string; primaryPercent?: number; secondaryPercent?: number }) {
  const first = Math.max(0, Math.min(100, primaryPercent));
  const second = Math.max(0, Math.min(100 - first, secondaryPercent));
  const secondEnd = first + second;
  return (
    <div role="img" aria-label={`${label}: ${value}`} className="relative mx-auto grid h-44 w-44 place-items-center rounded-full shadow-[0_0_60px_rgba(124,58,237,.06)]" style={{ background: `conic-gradient(#a855f7 0 ${first}%, #4edea3 ${first}% ${secondEnd}%, #263149 ${secondEnd}% 100%)` }}>
      <div className="grid h-[126px] w-[126px] place-items-center rounded-full border border-white/[.05] bg-[#07101f] text-center shadow-[inset_0_0_30px_rgba(0,0,0,.4)]">
        <div><div className="text-2xl font-semibold tracking-[-.04em] text-white">{value}</div><div className="mt-1 text-[10px] uppercase tracking-[.16em] text-[#7f8ba3]">{label}</div></div>
      </div>
    </div>
  );
}

export function Gauge({ score = 85 }: { score?: number }) {
  const gradientId = useId().replaceAll(":", "");
  const clampedScore = Math.max(0, Math.min(100, score));
  const rating = clampedScore >= 80 ? "Excellent" : clampedScore >= 60 ? "Good" : clampedScore >= 40 ? "Fair" : "Needs data";
  return (
    <div className="relative mx-auto h-48 w-48" role="img" aria-label={`${rating}: ${clampedScore} out of 100`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#182137" strokeWidth="8" />
        <circle cx="60" cy="60" r="48" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${clampedScore * 3.015} 302`} />
        <defs><linearGradient id={gradientId}><stop stopColor="#a855f7"/><stop offset="1" stopColor="#4edea3"/></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-4xl font-semibold tracking-[-.05em] text-white">{clampedScore}</div><div className="mt-1 text-[10px] font-semibold uppercase tracking-[.16em] text-[#4edea3]">{rating}</div></div></div>
    </div>
  );
}

export function Heatmap() {
  const levels = [1,2,1,2,2,4, 1,2,3,2,4,3, 1,1,2,3,3,3, 2,1,2,3,4,3, 1,1,2,3,4,4];
  return (
    <div role="img" aria-label="Audience activity heatmap from Monday to Friday" className="grid grid-cols-[38px_repeat(6,minmax(0,1fr))] gap-2 text-[10px] text-[#7f8ba3]">
      <div />{["8a","11a","2p","5p","7p","9p"].map(t => <div key={t} className="text-center">{t}</div>)}
      {["Mon","Tue","Wed","Thu","Fri"].flatMap((d, row) => [<div key={`${d}-l`} className="self-center">{d}</div>, ...levels.slice(row*6,row*6+6).map((v,i) => <div key={`${d}-${i}`} className="h-9 rounded-lg border border-white/[.04] transition hover:scale-[1.03]" style={{ background: `rgba(168,85,247,${.07 + v*.11})`, boxShadow: v === 4 ? "0 0 18px rgba(168,85,247,.18)" : "none" }} />)])}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="relative grid min-h-48 place-items-center overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[.012] p-8 text-center"><div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[.06] blur-3xl"/><div className="relative"><div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-xl border border-violet-300/10 bg-violet-500/10 text-violet-200">✦</div><h3 className="font-semibold text-white">{title}</h3><p className="muted mt-2 max-w-sm text-sm leading-6">{description}</p></div></div>;
}
