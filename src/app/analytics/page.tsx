"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card, Donut, EmptyState, MetricCard, SparkChart } from "@/components/ui";
import { apiDownload, apiFetch } from "@/lib/api";

type Metrics={followers:number;reach:number;likes:number;comments:number;shares:number;engagement_rate:number;growth_rate:number;posts_count:number};
type SeriesPoint={captured_at:string;reach:number;engagements:number;engagement_rate:number};
type TopPost={post_id:string;title:string;platform:string;reach:number;engagements:number;engagement_rate:number};
type Overview={metrics:Metrics;series:SeriesPoint[];top_posts:TopPost[];platform_reach:Record<string,number>};
const empty:Overview={metrics:{followers:0,reach:0,likes:0,comments:0,shares:0,engagement_rate:0,growth_rate:0,posts_count:0},series:[],top_posts:[],platform_reach:{instagram:0,facebook:0}};
const short=(n:number)=>n>=1_000_000?`${(n/1_000_000).toFixed(1)}M`:n>=1_000?`${(n/1_000).toFixed(1)}K`:String(n);

export default function AnalyticsPage() {
  const [overview,setOverview]=useState<Overview>(empty);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [exporting,setExporting]=useState(false);
  const [exportError,setExportError]=useState("");

  useEffect(()=>{
    const controller=new AbortController();
    apiFetch<Overview>("/api/v1/analytics/overview",{signal:controller.signal})
      .then(setOverview)
      .catch((requestError)=>{if(!(requestError instanceof DOMException&&requestError.name==="AbortError"))setError(requestError instanceof Error?requestError.message:"Could not load analytics");})
      .finally(()=>setLoading(false));
    return()=>controller.abort();
  },[]);

  async function exportReport(){
    setExporting(true);setExportError("");
    try{
      const blob=await apiDownload("/api/v1/analytics/report");
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement("a");anchor.href=url;anchor.download="creatoros-analytics.csv";document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),0);
    }catch(requestError){setExportError(requestError instanceof Error?requestError.message:"Could not export analytics");}
    finally{setExporting(false);}
  }

  const data=overview.metrics;
  const instagramReach=overview.platform_reach.instagram??0;
  const facebookReach=overview.platform_reach.facebook??0;
  const knownReach=instagramReach+facebookReach;
  const instagramPercent=knownReach?Math.round(instagramReach/knownReach*100):0;
  const facebookPercent=knownReach?Math.round(facebookReach/knownReach*100):0;
  const interactions=data.likes+data.comments+data.shares;
  const dataState=overview.series.length>=5?"Healthy history":overview.series.length?"Building history":"Waiting for snapshots";

  return (
    <AppShell title="Analytics Overview" subtitle="Deep insights into your performance" actions={<button onClick={exportReport} disabled={exporting} className="secondary-btn !min-h-9">{exporting?"Exporting...":"Export CSV"}</button>}>
      <section className="relative mb-5 overflow-hidden rounded-[26px] border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] via-[#071025] to-emerald-400/[.02] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-violet-500/[.09] blur-[85px]" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div className="max-w-2xl"><div className="flex flex-wrap items-center gap-2"><div className="kicker">Performance intelligence</div><span className="pill text-[#4edea3]"><span className="status-dot"/>{loading?"Loading":"Backend connected"}</span></div><h1 className="mt-3 text-3xl font-semibold tracking-[-.055em] text-white sm:text-4xl">See what your content is actually doing.</h1><p className="muted mt-3 text-sm leading-6">CreatorOS turns stored post snapshots into reach trends, engagement context and content rankings without replacing the underlying data with demo estimates.</p></div><div className="grid min-w-[330px] grid-cols-3 gap-2"><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">History</div><div className="mt-2 text-xs font-semibold text-white">{dataState}</div></div><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Snapshots</div><div className="mt-2 text-lg font-semibold text-white">{overview.series.length}</div></div><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Interactions</div><div className="mt-2 text-lg font-semibold text-[#4edea3]">{short(interactions)}</div></div></div></div>
      </section>

      {(error||exportError)&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error||exportError}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Reach" value={loading?"…":short(data.reach)} delta={`${data.growth_rate.toFixed(1)}%`} hint="follower growth"/><MetricCard label="Engagement Rate" value={loading?"…":`${data.engagement_rate.toFixed(2)}%`} hint="likes + comments + shares"/><MetricCard label="Followers" value={loading?"…":short(data.followers)} hint="latest snapshot"/><MetricCard label="Posts Tracked" value={loading?"…":String(data.posts_count)} hint="workspace posts"/></div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_.85fr]">
        <Card className="p-5 sm:p-6"><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><div className="kicker">Trend line</div><h2 className="mt-1 font-semibold text-white">Reach over time</h2><p className="muted mt-1 text-xs">Up to the latest 30 analytics snapshots stored by CreatorOS</p></div><div className="flex gap-2"><span className="pill">{overview.series.length} points</span><span className={`pill ${overview.series.length?"text-[#4edea3]":"text-[#7c899f]"}`}>{overview.series.length?"Live history":"No history yet"}</span></div></div><SparkChart values={overview.series.map(point=>point.reach)}/><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3"><div className="text-[9px] uppercase tracking-[.12em] text-[#657189]">Latest reach</div><div className="mt-2 text-lg font-semibold text-white">{short(data.reach)}</div></div><div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3"><div className="text-[9px] uppercase tracking-[.12em] text-[#657189]">Growth</div><div className={`mt-2 text-lg font-semibold ${data.growth_rate>=0?"text-[#4edea3]":"text-rose-300"}`}>{data.growth_rate>=0?"+":""}{data.growth_rate.toFixed(1)}%</div></div><div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3"><div className="text-[9px] uppercase tracking-[.12em] text-[#657189]">Engagement rate</div><div className="mt-2 text-lg font-semibold text-violet-200">{data.engagement_rate.toFixed(2)}%</div></div></div></Card>

        <Card className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="kicker">Channel mix</div><h2 className="mt-1 font-semibold text-white">Reach by platform</h2></div><span className="pill">{short(knownReach)} tracked</span></div><div className="mt-7"><Donut value={short(knownReach)} primaryPercent={instagramPercent} secondaryPercent={facebookPercent}/></div><div className="mt-7 grid gap-2 text-xs"><div className="flex items-center justify-between rounded-lg bg-white/[.015] px-3 py-2"><span className="flex items-center gap-2 text-[#8b98ae]"><span className="h-2 w-2 rounded-full bg-violet-400"/>Instagram</span><b className="text-white">{instagramPercent}%</b></div><div className="flex items-center justify-between rounded-lg bg-white/[.015] px-3 py-2"><span className="flex items-center gap-2 text-[#8b98ae]"><span className="h-2 w-2 rounded-full bg-[#4edea3]"/>Facebook</span><b className="text-white">{facebookPercent}%</b></div></div></Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">{[["Likes",short(data.likes),"Interaction","♡"],["Comments",short(data.comments),"Conversation","◌"],["Shares",short(data.shares),"Amplification","↗"]].map(([label,value,meaning,icon])=><Card key={label} className="panel-hover relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-20 w-20 bg-violet-500/[.06] blur-3xl"/><div className="relative flex items-center justify-between"><div><div className="text-[10px] font-semibold text-[#7f8ba3]">{label}</div><div className="mt-2 text-2xl font-semibold tracking-[-.04em] text-white">{value}</div></div><div className="grid h-10 w-10 place-items-center rounded-xl border border-violet-300/10 bg-violet-500/[.07] text-violet-200">{icon}</div></div><div className="relative mt-3 text-[10px] font-semibold uppercase tracking-[.11em] text-[#4edea3]">{meaning}</div></Card>)}</div>

      <Card className="mt-4 overflow-hidden p-0"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.055] bg-gradient-to-r from-violet-500/[.04] to-transparent px-5 py-5 sm:px-6"><div><div className="kicker">Content leaderboard</div><h2 className="mt-1 font-semibold text-white">Top performing content</h2><p className="muted mt-1 text-xs">Aggregated from stored post analytics and ranked by engagement rate</p></div><span className="pill">{overview.top_posts.length} ranked</span></div>{overview.top_posts.length?<div className="overflow-x-auto p-5 sm:p-6"><table className="w-full min-w-[680px] text-left text-xs"><thead className="text-[#6f7b92]"><tr className="border-b border-white/[.055]"><th className="pb-3 font-semibold">Rank</th><th className="pb-3 font-semibold">Post</th><th className="pb-3 font-semibold">Platform</th><th className="pb-3 font-semibold">Reach</th><th className="pb-3 font-semibold">Engagements</th><th className="pb-3 text-right font-semibold">Rate</th></tr></thead><tbody>{overview.top_posts.map((post,index)=><tr key={post.post_id} className="border-b border-white/[.04] text-[#aeb8ca] transition hover:bg-white/[.012]"><td className="py-3 pr-4"><span className="grid h-8 w-8 place-items-center rounded-lg border border-violet-300/10 bg-violet-500/[.06] text-[10px] font-bold text-violet-200">0{index+1}</span></td><td className="py-3 pr-4 font-semibold text-white">{post.title}</td><td className="py-3 capitalize"><span className="pill !py-1">{post.platform}</span></td><td className="py-3">{short(post.reach)}</td><td className="py-3">{short(post.engagements)}</td><td className="py-3 text-right"><span className="rounded-lg bg-emerald-300/[.05] px-2.5 py-1.5 font-semibold text-[#4edea3]">{post.engagement_rate.toFixed(2)}%</span></td></tr>)}</tbody></table></div>:<div className="p-5 sm:p-6"><EmptyState title="No analytics snapshots yet" description="Once post performance is recorded, your live rankings and trend data will appear here."/></div>}</Card>
    </AppShell>
  );
}
