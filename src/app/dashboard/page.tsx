import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card, MetricCard, SparkChart } from "@/components/ui";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Your social growth command center" actions={<Link href="/content-studio" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</Link>}>
      <div className="mb-6 flex flex-col gap-2"><div className="kicker">Overview</div><h1 className="text-3xl font-semibold tracking-[-.045em] text-white">Good morning. Your momentum is rising.</h1><p className="muted text-sm">Here is what changed across your connected Facebook and Instagram accounts.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Reach" value="8.2M" delta="18.4%" hint="vs. previous period"/><MetricCard label="Engagements" value="432K" delta="8.1%" hint="healthy momentum"/><MetricCard label="New Followers" value="12.5K" delta="12.1%" hint="net growth"/><MetricCard label="Profile Visits" value="98.3K" delta="8.7%" hint="high intent"/></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="p-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-white">Performance overview</h2><p className="muted mt-1 text-xs">Reach trend with engagement momentum</p></div><div className="pill">Last 30 days</div></div><SparkChart /></Card>
        <Card className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-white">Top content</h2><p className="muted mt-1 text-xs">By engagement rate</p></div><Link className="text-xs text-violet-300" href="/analytics">View all</Link></div><div className="space-y-2">{[["5 Content Pillars","Instagram","9.8%"],["The Future of AI","Facebook","8.6%"],["Productivity Reset","Instagram","7.9%"]].map(([t,p,v],i) => <div key={t} className="flex items-center gap-3 rounded-xl border border-white/[.045] bg-white/[.015] p-3"><div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-violet-500/20 to-emerald-400/5 text-sm text-violet-200">0{i+1}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-[#e8edfb]">{t}</div><div className="mt-1 text-[10px] uppercase tracking-wide text-[#66738c]">{p}</div></div><div className="text-sm font-semibold text-[#4edea3]">{v}</div></div>)}</div></Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[["Best posting window","7:00 PM – 9:00 PM","Audience activity peaks tonight. Schedule educational content inside this window.","/calendar"],["Content opportunity","Educational carousel","Your audience saves structured how-to posts 31% more often than other formats.","/growth-insights"],["AI quality signal","Strong CTA potential","Three recent drafts can improve with a clearer outcome-driven CTA.","/ai-assistant"]].map(([t,v,d,href]) => <Card key={t} className="relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-24 w-24 bg-violet-500/10 blur-3xl"/><div className="kicker">AI Insight</div><h3 className="mt-3 text-sm font-semibold text-white">{t}</h3><div className="mt-2 text-xl font-semibold tracking-[-.03em] text-violet-100">{v}</div><p className="muted mt-3 text-xs leading-5">{d}</p><Link href={href} className="mt-5 inline-block text-xs font-semibold text-violet-300">Explore insight ↗</Link></Card>)}
      </div>
    </AppShell>
  );
}
