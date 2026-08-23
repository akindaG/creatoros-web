"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card, EmptyState, Gauge } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type BestTime={best_day:string|null;best_hour:number|null;formatted_time:string|null;confidence:number;sample_size:number;reason:string};
type Rec={type:string;title:string;message:string};
type StoredRec={id:string;recommendation_text:string;type:string;created_at:string};
type Growth={best_time:BestTime;recommendations:Rec[]};
const emptyBest:BestTime={best_day:null,best_hour:null,formatted_time:null,confidence:0,sample_size:0,reason:"Not enough analytics data yet."};

export default function GrowthInsightsPage() {
  const [best,setBest]=useState<BestTime>(emptyBest);
  const [recs,setRecs]=useState<Rec[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    const controller=new AbortController();
    Promise.all([
      apiFetch<BestTime>("/api/v1/recommendations/best-time",{signal:controller.signal}),
      apiFetch<StoredRec[]>("/api/v1/recommendations",{signal:controller.signal}),
    ]).then(([bestTime,stored])=>{setBest(bestTime);setRecs(stored.slice(0,3).map(item=>({type:item.type,title:item.type.replaceAll("_"," "),message:item.recommendation_text})));})
      .catch(requestError=>{if(!(requestError instanceof DOMException&&requestError.name==="AbortError"))setError(requestError instanceof Error?requestError.message:"Could not load growth insights");})
      .finally(()=>setLoading(false));
    return()=>controller.abort();
  },[]);

  async function refresh(){setRefreshing(true);setError("");try{const growth=await apiFetch<Growth>("/api/v1/recommendations/growth",{method:"POST"});setBest(growth.best_time);setRecs(growth.recommendations);}catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not refresh insights");}finally{setRefreshing(false);}}
  const score=Math.max(0,Math.min(100,Math.round(best.confidence*100)));

  return (
    <AppShell title="Growth Insights" subtitle="Data-powered recommendations for audience growth" actions={<button onClick={refresh} disabled={refreshing} className="primary-btn !min-h-9 !px-4 !py-2 text-xs">{refreshing?"Refreshing...":"✦ Generate insights"}</button>}>
      <div className="mb-6"><div className="kicker">Recommendation engine</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Growth Insights</h1><p className="muted mt-2 text-sm">CreatorOS turns your stored engagement history into explainable next actions without inventing performance data.</p></div>
      {error&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}
      <div className="grid gap-4 xl:grid-cols-[340px_1fr]"><Card className="neon-border p-6"><h2 className="font-semibold text-white">Recommendation confidence</h2><div className="mt-3"><Gauge score={score}/></div><p className="muted text-center text-sm leading-6">Based on {best.sample_size} stored analytics {best.sample_size===1?"sample":"samples"}.</p></Card><Card className="p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-white">Optimal posting window</h2><p className="muted mt-1 text-xs">Calculated from weighted likes, comments and shares</p></div><div className="pill">{score}% confidence</div></div>{best.best_day?<div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="kicker">Best day</div><div className="mt-3 text-2xl font-semibold text-white">{best.best_day}</div></div><div className="rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="kicker">Best time</div><div className="mt-3 text-2xl font-semibold text-white">{best.formatted_time}</div></div><div className="rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="kicker">Evidence</div><div className="mt-3 text-2xl font-semibold text-white">{best.sample_size}</div><div className="muted mt-1 text-xs">analytics samples</div></div></div>:<div className="mt-6"><EmptyState title="More performance data needed" description="Publish content and add analytics snapshots. CreatorOS will calculate your strongest day and time as soon as evidence exists."/></div>}<div className="mt-5 rounded-xl border border-emerald-300/10 bg-emerald-300/[.035] p-4 text-xs leading-5 text-[#9bcdb9]">{best.reason}</div></Card></div>
      <Card className="mt-4 p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="text-violet-300">✦</span><h2 className="font-semibold text-white">Recommended actions</h2></div><Link href="/analytics" className="text-xs font-semibold text-violet-300">View evidence ↗</Link></div>{loading?<div className="mt-5 text-sm text-[#77839a]">Loading recommendation history...</div>:recs.length?<div className="mt-5 grid gap-4 md:grid-cols-3">{recs.slice(0,3).map((rec,index)=><div key={`${rec.title}-${index}`} className="relative overflow-hidden rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-400 to-emerald-300" style={{opacity:.3+index*.13}}/><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-200">{index===0?"◇":index===1?"◷":"✦"}</div><div className="mt-4 text-[9px] font-bold uppercase tracking-[.14em] text-[#6f7b92]">{rec.type}</div><h3 className="mt-2 font-semibold capitalize text-white">{rec.title}</h3><p className="muted mt-2 text-sm leading-6">{rec.message}</p></div>)}</div>:<div className="mt-5"><EmptyState title="Generate your first growth plan" description="Use Generate insights to calculate and save recommendations from your current analytics."/></div>}</Card>
    </AppShell>
  );
}
