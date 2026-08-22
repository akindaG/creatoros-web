"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";

const defaults = [
  "I used to start every day reacting instead of creating. Then I rebuilt my morning around five simple habits that protect focus, energy and deep work. Save this for your next reset and tell me which habit you are trying first.",
  "Building consistently is easier when your system does the heavy lifting. These five morning habits helped me move from chaotic starts to focused execution, without adding more hours to the day.",
  "Stop checking your notifications first thing. If you want better output, build a better opening routine. Here are five non-negotiable habits for a focused creator morning."
];

type CaptionResponse = { caption: string; cta?: string; hashtags?: string[] };
type AnalyzeResponse = { score:number; strengths:string[]; suggestions:string[]; source?:string };

export default function AIAssistantPage() {
  const [topic,setTopic] = useState("5 morning habits that improve creator productivity");
  const [tone,setTone] = useState("Professional");
  const [loading,setLoading] = useState(false);
  const [analyzing,setAnalyzing] = useState(false);
  const [error,setError] = useState("");
  const [variants,setVariants] = useState(defaults);
  const [hashtags,setHashtags] = useState(["#CreatorProductivity","#ContentStrategy","#MorningRoutine","#CreatorEconomy","#DeepWork"]);
  const [analysis,setAnalysis] = useState<AnalyzeResponse | null>({score:82,strengths:["Clear opening hook","Strong creator relevance"],suggestions:["Make the CTA more specific","Shorten the middle section","Add one concrete outcome"]});
  async function generate() {
    setLoading(true); setError("");
    try {
      const result = await apiFetch<CaptionResponse>("/api/v1/ai/caption", {method:"POST",body:JSON.stringify({topic,description:topic,tone:tone.toLowerCase(),platform:"instagram"})});
      if (result.caption) setVariants([result.caption,...defaults.slice(1)]);
      if (result.hashtags?.length) setHashtags(result.hashtags);
    } catch (e) { setError(e instanceof Error ? e.message : "AI generation failed"); }
    finally { setLoading(false); }
  }
  async function analyze(){setAnalyzing(true);setError("");try{const result=await apiFetch<AnalyzeResponse>("/api/v1/ai/analyze",{method:"POST",body:JSON.stringify({caption:variants[0],platform:"instagram"})});setAnalysis(result);}catch(e){setError(e instanceof Error?e.message:"Content analysis failed");}finally{setAnalyzing(false);}}
  return (
    <AppShell title="AI Content Assistant" subtitle="Turn an idea into stronger platform-ready copy" actions={<Link href="/content-studio" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</Link>}>
      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <div className="space-y-4"><Card className="p-5"><div className="flex items-center gap-2"><span className="text-violet-300">✦</span><h2 className="font-semibold text-white">Draft concept</h2></div><label className="mt-5 block"><span className="label mb-2 block">What is your post about?</span><textarea className="field min-h-32 resize-none text-sm leading-6" value={topic} onChange={e=>setTopic(e.target.value)} /></label><div className="mt-4"><div className="label mb-2">Tone of voice</div><div className="flex flex-wrap gap-2">{["Professional","Playful","Bold"].map(t=><button key={t} onClick={()=>setTone(t)} className={`pill ${tone===t?"border-violet-300/40 bg-violet-500/12 text-violet-100":""}`}>{t}</button>)}</div></div>{error&&<div className="mt-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}<button onClick={generate} className="primary-btn mt-5 w-full" disabled={loading}>{loading?"✦ Generating...":"✦ Generate content"}</button></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Suggested hashtags</h2><span className="text-xs text-[#6c7890]">{hashtags.length} tags</span></div><div className="mt-4 space-y-2">{hashtags.slice(0,8).map((h,i)=><div key={h} className="flex items-center justify-between rounded-lg border border-white/[.045] px-3 py-2.5"><code className="text-xs text-violet-200">{h}</code><span className={`text-[9px] ${i===2?"text-[#ffb95f]":"text-[#4edea3]"}`}>{i===2?"Medium":"High"}</span></div>)}</div><button className="secondary-btn mt-4 w-full" onClick={()=>navigator.clipboard?.writeText(hashtags.join(" "))}>Copy all tags</button></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><div><div className="kicker">Content analyzer</div><h2 className="mt-1 font-semibold text-white">Quality score</h2></div><div className="grid h-14 w-14 place-items-center rounded-full border border-violet-300/20 bg-violet-500/10 text-lg font-semibold text-white">{analysis?.score ?? "—"}</div></div>{analysis&&<><div className="mt-4"><div className="label mb-2">Strengths</div>{analysis.strengths.slice(0,2).map(s=><div key={s} className="mt-2 flex gap-2 text-xs text-[#9bcdb9]"><span>✓</span><span>{s}</span></div>)}</div><div className="mt-4"><div className="label mb-2">Improve next</div>{analysis.suggestions.slice(0,3).map(s=><div key={s} className="mt-2 flex gap-2 text-xs leading-5 text-[#9ca8be]"><span className="text-[#ffb95f]">•</span><span>{s}</span></div>)}</div></>}<button onClick={analyze} className="secondary-btn mt-5 w-full" disabled={analyzing}>{analyzing?"Analyzing...":"Analyze best variant"}</button></Card></div>
        <div><div className="mb-4 flex items-center justify-between"><div><div className="kicker">AI output</div><h1 className="mt-1 text-2xl font-semibold tracking-[-.04em] text-white">Generated variants <span className="text-violet-300">3</span></h1></div><button className="secondary-btn" onClick={generate}>↻ Refine</button></div><div className="space-y-4">{variants.map((v,i)=><Card key={i} className={`relative overflow-hidden p-5 ${i===0?"neon-border":""}`}><div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-300 opacity-50"/><div className="flex items-center justify-between"><span className="rounded-md bg-white/[.055] px-2 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#9ba7bd]">Option {String.fromCharCode(65+i)} · {i===0?"Engaging hook":i===1?"Story-driven":"Action-oriented"}</span><button className="text-xs text-[#748098] hover:text-white" onClick={()=>navigator.clipboard?.writeText(v)}>Copy</button></div><p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-[#dce4f6]">{v}</p><div className="mt-5 flex justify-end gap-2 border-t border-white/[.055] pt-4"><button className="secondary-btn">Edit</button><Link href="/calendar" className="primary-btn">Use & schedule</Link></div></Card>)}</div></div>
      </div>
    </AppShell>
  );
}
