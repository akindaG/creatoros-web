import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`glass rounded-2xl ${className}`}>{children}</section>;
}

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="kicker mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-[-.035em] text-[#eef2ff] sm:text-3xl">{title}</h1>
        {description && <p className="muted mt-2 max-w-2xl text-sm leading-6">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, delta, hint }: { label: string; value: string; delta?: string; hint?: string }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold tracking-wide text-[#97a4bd]">{label}</span>
        <span className="h-2 w-2 rounded-full bg-[#4edea3] shadow-[0_0_16px_rgba(78,222,163,.55)]" />
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-[-.04em] text-[#edf2ff]">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta && <span className="font-semibold text-[#4edea3]">↗ {delta}</span>}
        {hint && <span className="text-[#707c94]">{hint}</span>}
      </div>
    </Card>
  );
}

export function SparkChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/[.055] bg-[#050a19]/60 ${compact ? "h-44" : "h-72"}`}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "100% 25%, 14.285% 100%" }} />
      <svg viewBox="0 0 700 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7c3aed"/><stop offset=".52" stopColor="#d2bbff"/><stop offset="1" stopColor="#4edea3"/></linearGradient>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b5cf6" stopOpacity=".28"/><stop offset="1" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient>
        </defs>
        <path d="M0 214 C70 190 83 132 145 151 C204 168 223 92 292 111 C349 128 392 32 443 71 C507 118 521 70 574 92 C625 113 655 50 700 57 L700 260 L0 260 Z" fill="url(#chartArea)" />
        <path d="M0 214 C70 190 83 132 145 151 C204 168 223 92 292 111 C349 128 392 32 443 71 C507 118 521 70 574 92 C625 113 655 50 700 57" fill="none" stroke="url(#chartLine)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Donut({ value = "8.2M", label = "Reach" }: { value?: string; label?: string }) {
  return (
    <div className="relative mx-auto grid h-44 w-44 place-items-center rounded-full" style={{ background: "conic-gradient(#a855f7 0 57%, #4edea3 57% 82%, #263149 82% 100%)" }}>
      <div className="grid h-[126px] w-[126px] place-items-center rounded-full border border-white/[.05] bg-[#07101f] text-center shadow-[inset_0_0_30px_rgba(0,0,0,.4)]">
        <div><div className="text-2xl font-semibold text-white">{value}</div><div className="mt-1 text-[11px] uppercase tracking-[.14em] text-[#7f8ba3]">{label}</div></div>
      </div>
    </div>
  );
}

export function Gauge({ score = 85 }: { score?: number }) {
  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#182137" strokeWidth="8" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="url(#gaugeGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${score * 3.015} 302`} />
        <defs><linearGradient id="gaugeGradient"><stop stopColor="#a855f7"/><stop offset="1" stopColor="#4edea3"/></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-4xl font-semibold tracking-[-.05em] text-white">{score}</div><div className="mt-1 text-[10px] font-semibold uppercase tracking-[.16em] text-[#4edea3]">Excellent</div></div></div>
    </div>
  );
}

export function Heatmap() {
  const levels = [1,2,1,2,2,4, 1,2,3,2,4,3, 1,1,2,3,3,3, 2,1,2,3,4,3, 1,1,2,3,4,4];
  return (
    <div className="grid grid-cols-[38px_repeat(6,minmax(0,1fr))] gap-2 text-[10px] text-[#7f8ba3]">
      <div />{["8a","11a","2p","5p","7p","9p"].map(t => <div key={t} className="text-center">{t}</div>)}
      {["Mon","Tue","Wed","Thu","Fri"].flatMap((d, row) => [<div key={`${d}-l`} className="self-center">{d}</div>, ...levels.slice(row*6,row*6+6).map((v,i) => <div key={`${d}-${i}`} className="h-9 rounded-lg border border-white/[.04]" style={{ background: `rgba(168,85,247,${.07 + v*.11})`, boxShadow: v === 4 ? "0 0 18px rgba(168,85,247,.18)" : "none" }} />)])}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[.015] p-8 text-center"><div><div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-violet-200">✦</div><h3 className="font-semibold text-white">{title}</h3><p className="muted mt-2 max-w-sm text-sm">{description}</p></div></div>;
}
