"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card, Gauge, Heatmap } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type BestTime={best_day:string|null;best_hour:number|null;formatted_time:string|null;confidence:number;sample_size:number;reason:string};
type Rec={type:string;title:string;message:string};
type Growth={best_time:BestTime;recommendations:Rec[]};
const fallback:Rec[]=[{type:"content",title:"Prioritize educational saves",message:"Carousel and checklist posts are producing stronger saves. Increase this mix next week."},{type:"timing",title:"Protect your peak window",message:"Schedule your strongest posts in the evening instead of midday for better initial velocity."},{type:"cta",title:"Strengthen CTA clarity",message:"Recent captions have strong hooks. Make the final CTA outcome-specific."}];

export default function GrowthInsightsPage() {
  const [best,setBest]=useState<BestTime>({best_day:"Tuesday",best_hour:19,formatted_time:"7:00 PM",confidence:.85,sample_size:24,reason:"Highest recent engagement window"});
  const [recs,setRecs]=useState<Rec[]>(fallback);
  const [live,setLive]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  useEffect(()=>{apiFetch<BestTime>("/api/v1/recommendations/best-time").then(v=>{setBest(v);setLive(true);}).catch(()=>{});},[]);
  async function refresh(){setLoading(true);setError("");try{const g=await apiFetch<Growth>("/api/v1/recommendations/growth",{method:"POST"});setBest(g.best_time);setRecs(g.recommendations.length?g.recommendations:fallback);setLive(true);}catch(e){setLive(false);setError(e instanceof Error?e.message:"Could not refresh insights");}finally{setLoading(false);}}
  const score=Math.max(0,Math.min(100,Math.round(best.confidence*100)));
  return (
    <AppShell title="Growth Insights" subtitle="AI-powered recommendations for audience growth" actions={<button onClick={refresh} disabled={loading} className="primary-btn !min-h-9 !px-4 !py-2 text-xs">{loading?"Refreshing...":"✦ Refresh insights"}</button>}>
      <div className="mb-6 flex items-end justify-between gap-4"><div><div className="kicker">Recommendation engine</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Growth Insights</h1><p className="muted mt-2 text-sm">Turn historical engagement into simple, explainable next actions.</p></div><span className={`pill ${live?"text-[#4edea3]":"text-[#ffb95f]"}`}>{live?"Live recommendations":"Demo fallback"}</span></div>
      {error&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}
      <div className="grid gap-4 xl:grid-cols-[340px_1fr]"><Card className="neon-border p-6"><h2 className="font-semibold text-white">Overall health</h2><div className="mt-3"><Gauge score={score}/></div><p className="muted text-center text-sm leading-6">Recommendation confidence is based on {best.sample_size || 0} engagement samples.</p></Card><Card className="p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-white">Optimal posting schedule</h2><p className="muted mt-1 text-xs">Based on your highest engagement windows</p></div><div className="pill">{Math.round((best.confidence||0)*100)}% confidence</div></div><div className="mt-6"><Heatmap/></div><div className="mt-5 rounded-xl border border-emerald-300/10 bg-emerald-300/[.035] p-4"><div className="text-sm font-semibold text-[#bfead5]">Best window: {best.best_day || "Not enough data"}{best.formatted_time?` at ${best.formatted_time}`:""}</div><div className="mt-1 text-xs leading-5 text-[#79a391]">{best.reason || "Add more analytics snapshots to improve this recommendation."}</div></div></Card></div>
      <Card className="mt-4 p-6"><div className="flex items-center gap-2"><span className="text-violet-300">✦</span><h2 className="font-semibold text-white">AI recommended actions</h2></div><div className="mt-5 grid gap-4 md:grid-cols-3">{recs.slice(0,3).map((r,i)=><div key={`${r.title}-${i}`} className="relative overflow-hidden rounded-2xl border border-white/[.055] bg-white/[.018] p-5"><div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-400 to-emerald-300" style={{opacity:.3+i*.13}}/><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 text-violet-200">{i===0?"◇":i===1?"◷":"✦"}</div><div className="mt-4 text-[9px] font-bold uppercase tracking-[.14em] text-[#6f7b92]">{r.type}</div><h3 className="mt-2 font-semibold text-white">{r.title}</h3><p className="muted mt-2 text-sm leading-6">{r.message}</p></div>)}</div></Card>
    </AppShell>
  );
}
