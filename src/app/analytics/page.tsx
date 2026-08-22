import AppShell from "@/components/app-shell";
import { Card, Donut, MetricCard, SparkChart } from "@/components/ui";

export default function AnalyticsPage() {
  return (
    <AppShell title="Analytics Overview" subtitle="Deep insights into your performance" actions={<button className="secondary-btn !min-h-9">Export</button>}>
      <div className="mb-6 flex flex-wrap gap-2">{["Overview","Audience","Engagement","Performance","Growth"].map((t,i)=><button key={t} className={`pill ${i===0?"border-violet-300/30 bg-violet-500/10 text-violet-100":""}`}>{t}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Reach" value="8.2M" delta="18.4%"/><MetricCard label="Engagement Rate" value="5.26%" delta="1.8%"/><MetricCard label="Impressions" value="12.6M" delta="14.2%"/><MetricCard label="Profile Visits" value="98.3K" delta="8.7%"/></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]"><Card className="p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Reach over time</h2><p className="muted mt-1 text-xs">Current period vs previous period</p></div><div className="flex gap-3 text-[10px]"><span className="text-violet-200">● Current</span><span className="text-[#68758f]">● Previous</span></div></div><SparkChart/></Card><Card className="p-5"><h2 className="font-semibold text-white">Traffic source</h2><div className="mt-8"><Donut /></div><div className="mt-7 grid gap-2 text-xs text-[#7f8ba3]"><div className="flex justify-between"><span>Instagram</span><b className="text-white">57%</b></div><div className="flex justify-between"><span>Facebook</span><b className="text-white">25%</b></div><div className="flex justify-between"><span>Direct / other</span><b className="text-white">18%</b></div></div></Card></div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">{[["Likes","286K","+11.2%"],["Comments","48.7K","+7.3%"],["Shares","97.4K","+19.8%"]].map(([a,b,c])=><Card key={a} className="p-5"><div className="text-xs text-[#7f8ba3]">{a}</div><div className="mt-2 text-2xl font-semibold text-white">{b}</div><div className="mt-2 text-xs font-semibold text-[#4edea3]">↗ {c}</div></Card>)}</div>
    </AppShell>
  );
}
