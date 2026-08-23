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

  return (
    <AppShell title="Analytics Overview" subtitle="Deep insights into your performance" actions={<button onClick={exportReport} disabled={exporting} className="secondary-btn !min-h-9">{exporting?"Exporting...":"Export CSV"}</button>}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="pill border-violet-300/30 bg-violet-500/10 text-violet-100">Live analytics</div><span className="pill text-[#4edea3]"><span className="status-dot"/>{loading?"Loading":"Backend connected"}</span></div>
      {(error||exportError)&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error||exportError}</div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Reach" value={loading?"…":short(data.reach)} delta={`${data.growth_rate.toFixed(1)}%`} hint="follower growth"/><MetricCard label="Engagement Rate" value={loading?"…":`${data.engagement_rate.toFixed(2)}%`} hint="likes + comments + shares"/><MetricCard label="Followers" value={loading?"…":short(data.followers)} hint="latest snapshot"/><MetricCard label="Posts Tracked" value={loading?"…":String(data.posts_count)} hint="workspace posts"/></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]"><Card className="p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Reach over time</h2><p className="muted mt-1 text-xs">Up to the latest 30 analytics snapshots</p></div><div className="pill">{overview.series.length} points</div></div><SparkChart values={overview.series.map(point=>point.reach)}/></Card><Card className="p-5"><h2 className="font-semibold text-white">Reach by platform</h2><div className="mt-8"><Donut value={short(knownReach)} primaryPercent={instagramPercent} secondaryPercent={facebookPercent}/></div><div className="mt-7 grid gap-2 text-xs text-[#7f8ba3]"><div className="flex justify-between"><span>Instagram</span><b className="text-white">{instagramPercent}%</b></div><div className="flex justify-between"><span>Facebook</span><b className="text-white">{facebookPercent}%</b></div><div className="flex justify-between"><span>Tracked reach</span><b className="text-white">{short(knownReach)}</b></div></div></Card></div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">{[["Likes",short(data.likes),"Interaction"],["Comments",short(data.comments),"Conversation"],["Shares",short(data.shares),"Amplification"]].map(([a,b,c])=><Card key={a} className="p-5"><div className="text-xs text-[#7f8ba3]">{a}</div><div className="mt-2 text-2xl font-semibold text-white">{b}</div><div className="mt-2 text-xs font-semibold text-[#4edea3]">{c}</div></Card>)}</div>
      <Card className="mt-4 p-5"><div className="mb-4"><h2 className="font-semibold text-white">Top performing content</h2><p className="muted mt-1 text-xs">Aggregated from stored post analytics</p></div>{overview.top_posts.length?<div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><thead className="text-[#6f7b92]"><tr className="border-b border-white/[.055]"><th className="pb-3 font-semibold">Post</th><th className="pb-3 font-semibold">Platform</th><th className="pb-3 font-semibold">Reach</th><th className="pb-3 font-semibold">Engagements</th><th className="pb-3 text-right font-semibold">Rate</th></tr></thead><tbody>{overview.top_posts.map(post=><tr key={post.post_id} className="border-b border-white/[.04] text-[#aeb8ca]"><td className="py-3 pr-4 font-semibold text-white">{post.title}</td><td className="py-3 capitalize">{post.platform}</td><td className="py-3">{short(post.reach)}</td><td className="py-3">{short(post.engagements)}</td><td className="py-3 text-right font-semibold text-[#4edea3]">{post.engagement_rate.toFixed(2)}%</td></tr>)}</tbody></table></div>:<EmptyState title="No analytics snapshots yet" description="Once post performance is recorded, your live rankings and trend data will appear here."/>}</Card>
    </AppShell>
  );
}
