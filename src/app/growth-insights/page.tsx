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
  const evidenceLabel=best.sample_size>=5?"Strong evidence":best.sample_size?"Building evidence":"Waiting for data";

  return (
    <AppShell title="Growth Insights" subtitle="Data-powered recommendations for audience growth" actions={<button onClick={refresh} disabled={refreshing} className="primary-btn !min-h-9 !px-4 !py-2 text-xs">{refreshing?"Refreshing...":"✦ Generate insights"}</button>}>
      <section className="relative mb-5 overflow-hidden rounded-[26px] border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] via-[#071025] to-emerald-400/[.025] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full bg-violet-500/[.10] blur-[85px]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl"><div className="flex flex-wrap items-center gap-2"><div className="kicker">Recommendation engine</div><span className="pill text-[#4edea3]"><span className="status-dot" /> Live intelligence</span></div><h1 className="mt-3 text-3xl font-semibold tracking-[-.055em] text-white sm:text-4xl">Turn performance history into your next growth action.</h1><p className="muted mt-3 text-sm leading-6">CreatorOS uses stored engagement evidence to recommend posting windows and practical actions without inventing performance data.</p></div>
          <div className="grid min-w-[250px] grid-cols-2 gap-2"><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Evidence</div><div className="mt-2 text-sm font-semibold text-white">{evidenceLabel}</div></div><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Confidence</div><div className="mt-2 text-sm font-semibold text-[#4edea3]">{score}%</div></div></div>
        </div>
      </section>

      {error&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <Card className="neon-border p-6"><div className="flex items-center justify-between"><div><div className="kicker">Signal confidence</div><h2 className="mt-1 font-semibold text-white">Recommendation strength</h2></div><span className="pill">{best.sample_size} samples</span></div><div className="mt-3"><Gauge score={score}/></div><p className="muted text-center text-sm leading-6">Confidence rises as CreatorOS receives more real analytics snapshots from your posts.</p><div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-lg border border-white/[.045] bg-white/[.015] p-2"><div className="text-sm font-semibold text-white">{best.sample_size}</div><div className="mt-1 text-[8px] uppercase tracking-[.1em] text-[#65728a]">Samples</div></div><div className="rounded-lg border border-white/[.045] bg-white/[.015] p-2"><div className="text-sm font-semibold text-white">{best.best_day??"—"}</div><div className="mt-1 text-[8px] uppercase tracking-[.1em] text-[#65728a]">Best day</div></div><div className="rounded-lg border border-white/[.045] bg-white/[.015] p-2"><div className="truncate text-sm font-semibold text-white">{best.formatted_time??"—"}</div><div className="mt-1 text-[8px] uppercase tracking-[.1em] text-[#65728a]">Best time</div></div></div></Card>

        <Card className="p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="kicker">Posting intelligence</div><h2 className="mt-1 font-semibold text-white">Optimal posting window</h2><p className="muted mt-1 text-xs">Calculated from weighted likes, comments and shares</p></div><div className="pill">{score}% confidence</div></div>{best.best_day?<div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="panel-hover rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="kicker">Best day</div><div className="mt-3 text-2xl font-semibold tracking-[-.04em] text-white">{best.best_day}</div><div className="muted mt-2 text-[10px]">Highest weighted engagement</div></div><div className="panel-hover rounded-2xl border border-violet-300/10 bg-violet-500/[.045] p-5"><div className="kicker">Best time</div><div className="mt-3 text-2xl font-semibold tracking-[-.04em] text-violet-100">{best.formatted_time}</div><div className="muted mt-2 text-[10px]">Recommended publishing window</div></div><div className="panel-hover rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="kicker">Evidence</div><div className="mt-3 text-2xl font-semibold tracking-[-.04em] text-white">{best.sample_size}</div><div className="muted mt-2 text-[10px]">Analytics samples analyzed</div></div></div>:<div className="mt-6"><EmptyState title="More performance data needed" description="Publish content and add analytics snapshots. CreatorOS will calculate your strongest day and time as soon as evidence exists."/></div>}<div className="mt-5 flex gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[.035] p-4"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-300/[.06] text-[#4edea3]">↗</div><div><div className="text-[10px] font-semibold uppercase tracking-[.11em] text-[#4edea3]">Why this recommendation</div><p className="mt-1 text-xs leading-5 text-[#9bcdb9]">{best.reason}</p></div></div></Card>
      </div>

      <Card className="mt-4 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="kicker">Action layer</div><h2 className="mt-1 font-semibold text-white">Recommended next moves</h2><p className="muted mt-1 text-xs">Explainable actions generated from the performance currently available.</p></div><div className="flex gap-2"><Link href="/analytics" className="secondary-btn !min-h-9 text-xs">View evidence</Link><button onClick={refresh} disabled={refreshing} className="secondary-btn !min-h-9 text-xs">{refreshing?"Refreshing...":"Refresh plan"}</button></div></div>{loading?<div className="mt-5 grid gap-4 md:grid-cols-3">{[1,2,3].map(item=><div key={item} className="skeleton h-44 rounded-2xl border border-white/[.04]"/>)}</div>:recs.length?<div className="mt-5 grid gap-4 md:grid-cols-3">{recs.slice(0,3).map((rec,index)=><div key={`${rec.title}-${index}`} className="panel-hover relative overflow-hidden rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-400 to-emerald-300" style={{opacity:.35+index*.14}}/><div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl border border-violet-300/10 bg-violet-500/10 text-violet-200">{index===0?"◇":index===1?"◷":"✦"}</div><span className="rounded-full bg-white/[.025] px-2 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-[#69768e]">0{index+1}</span></div><div className="mt-4 text-[9px] font-bold uppercase tracking-[.14em] text-[#6f7b92]">{rec.type}</div><h3 className="mt-2 font-semibold capitalize text-white">{rec.title}</h3><p className="muted mt-2 text-sm leading-6">{rec.message}</p></div>)}</div>:<div className="mt-5"><EmptyState title="Generate your first growth plan" description="Use Generate insights to calculate and save recommendations from your current analytics."/></div>}</Card>
    </AppShell>
  );
}
