"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card, Donut, MetricCard, SparkChart } from "@/components/ui";
import { apiFetch, API_BASE, getToken } from "@/lib/api";

type Analytics = { followers:number; reach:number; likes:number; comments:number; shares:number; engagement_rate:number; growth_rate:number; posts_count:number };
const demo:Analytics={followers:12500,reach:8200000,likes:286000,comments:48700,shares:97400,engagement_rate:5.26,growth_rate:18.4,posts_count:42};
const short=(n:number)=>n>=1_000_000?`${(n/1_000_000).toFixed(1)}M`:n>=1_000?`${(n/1_000).toFixed(1)}K`:String(n);

export default function AnalyticsPage() {
  const [data,setData]=useState<Analytics>(demo);
  const [live,setLive]=useState(false);
  useEffect(()=>{apiFetch<Analytics>("/api/v1/analytics/dashboard").then(v=>{setData(v);setLive(true);}).catch(()=>{});},[]);
  async function exportReport(){const token=getToken();const r=await fetch(`${API_BASE}/api/v1/analytics/report`,{headers:token?{Authorization:`Bearer ${token}`}:{}});if(!r.ok)return;const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="creatoros-analytics.csv";a.click();URL.revokeObjectURL(url);}
  return (
    <AppShell title="Analytics Overview" subtitle="Deep insights into your performance" actions={<button onClick={exportReport} className="secondary-btn !min-h-9">Export CSV</button>}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{["Overview","Audience","Engagement","Performance","Growth"].map((t,i)=><button key={t} className={`pill ${i===0?"border-violet-300/30 bg-violet-500/10 text-violet-100":""}`}>{t}</button>)}</div><span className={`pill ${live?"text-[#4edea3]":"text-[#ffb95f]"}`}><span className={live?"status-dot":"h-2 w-2 rounded-full bg-[#ffb95f]"}/>{live?"Live backend data":"Demo fallback"}</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Reach" value={short(data.reach)} delta={`${data.growth_rate.toFixed(1)}%`}/><MetricCard label="Engagement Rate" value={`${data.engagement_rate.toFixed(2)}%`} delta="Current"/><MetricCard label="Followers" value={short(data.followers)} delta="Audience"/><MetricCard label="Posts Tracked" value={String(data.posts_count)} delta="Published + drafts"/></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]"><Card className="p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Reach over time</h2><p className="muted mt-1 text-xs">Visual performance trend for the current analytics window</p></div><div className="flex gap-3 text-[10px]"><span className="text-violet-200">● Current</span><span className="text-[#68758f]">● Previous</span></div></div><SparkChart/></Card><Card className="p-5"><h2 className="font-semibold text-white">Traffic source</h2><div className="mt-8"><Donut value={short(data.reach)} /></div><div className="mt-7 grid gap-2 text-xs text-[#7f8ba3]"><div className="flex justify-between"><span>Instagram</span><b className="text-white">57%</b></div><div className="flex justify-between"><span>Facebook</span><b className="text-white">25%</b></div><div className="flex justify-between"><span>Other / direct</span><b className="text-white">18%</b></div></div></Card></div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">{[["Likes",short(data.likes),"Interaction"],["Comments",short(data.comments),"Conversation"],["Shares",short(data.shares),"Amplification"]].map(([a,b,c])=><Card key={a} className="p-5"><div className="text-xs text-[#7f8ba3]">{a}</div><div className="mt-2 text-2xl font-semibold text-white">{b}</div><div className="mt-2 text-xs font-semibold text-[#4edea3]">↗ {c}</div></Card>)}</div>
    </AppShell>
  );
}
