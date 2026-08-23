"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card, EmptyState } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type CaptionResponse={caption:string;cta:string;hashtags:string[];source:string};
type HashtagResponse={hashtags:string[];source:string};
type AnalyzeResponse={score:number;strengths:string[];suggestions:string[];source:string};

export default function AIAssistantPage(){
  const [topic,setTopic]=useState("");
  const [description,setDescription]=useState("");
  const [tone,setTone]=useState("Professional");
  const [platform,setPlatform]=useState("instagram");
  const [loading,setLoading]=useState(false);
  const [tagLoading,setTagLoading]=useState(false);
  const [analyzing,setAnalyzing]=useState(false);
  const [error,setError]=useState("");
  const [caption,setCaption]=useState("");
  const [cta,setCta]=useState("");
  const [hashtags,setHashtags]=useState<string[]>([]);
  const [source,setSource]=useState("");
  const [analysis,setAnalysis]=useState<AnalyzeResponse|null>(null);
  const [editing,setEditing]=useState(false);
  const [copied,setCopied]=useState("");

  async function generate(){
    if(!topic.trim()){setError("Add a topic before generating content.");return;}
    setLoading(true);setError("");setAnalysis(null);setEditing(false);
    try{const result=await apiFetch<CaptionResponse>("/api/v1/ai/caption",{method:"POST",body:JSON.stringify({topic:topic.trim(),description:description.trim()||null,tone:tone.toLowerCase(),platform})});setCaption(result.caption);setCta(result.cta);setHashtags(result.hashtags);setSource(result.source);}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"AI generation failed");}
    finally{setLoading(false);}
  }

  async function generateTags(){
    if(!topic.trim()){setError("Add a topic first.");return;}
    setTagLoading(true);setError("");
    try{const result=await apiFetch<HashtagResponse>("/api/v1/ai/hashtags",{method:"POST",body:JSON.stringify({topic:topic.trim(),caption:caption||null,platform})});setHashtags(result.hashtags);setSource(result.source);}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Hashtag generation failed");}
    finally{setTagLoading(false);}
  }

  async function analyze(){
    if(!caption.trim()){setError("Generate or write a caption before analyzing it.");return;}
    setAnalyzing(true);setError("");
    try{setAnalysis(await apiFetch<AnalyzeResponse>("/api/v1/ai/analyze",{method:"POST",body:JSON.stringify({caption,platform})}));}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Content analysis failed");}
    finally{setAnalyzing(false);}
  }

  async function copyText(value:string,key:string){try{await navigator.clipboard.writeText(value);setCopied(key);setTimeout(()=>setCopied(""),1500);}catch{setError("Clipboard access was blocked by the browser.");}}
  const studioCaption=[caption,cta,hashtags.join(" ")].filter(Boolean).join("\n\n");

  return (
    <AppShell title="AI Content Assistant" subtitle="Generate and analyze platform-ready copy with CreatorOS AI" actions={<Link href="/content-studio" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</Link>}>
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Card className="p-5"><div className="flex items-center gap-2"><span className="text-violet-300">✦</span><h2 className="font-semibold text-white">Content brief</h2></div><label className="mt-5 block"><span className="label mb-2 block">Topic</span><input className="field" value={topic} onChange={event=>setTopic(event.target.value)} placeholder="e.g. 5 habits for creator productivity" maxLength={300}/></label><label className="mt-4 block"><span className="label mb-2 block">Description</span><textarea className="field min-h-28 resize-none text-sm leading-6" value={description} onChange={event=>setDescription(event.target.value)} placeholder="Add context, key points or the outcome you want the post to communicate." maxLength={800}/></label><div className="mt-4"><div className="label mb-2">Tone of voice</div><div className="flex flex-wrap gap-2">{["Professional","Playful","Bold"].map(item=><button key={item} onClick={()=>setTone(item)} aria-pressed={tone===item} className={`pill ${tone===item?"border-violet-300/40 bg-violet-500/12 text-violet-100":""}`}>{item}</button>)}</div></div><div className="mt-4"><div className="label mb-2">Platform</div><div className="flex gap-2">{[["instagram","Instagram"],["facebook","Facebook"]].map(([value,label])=><button key={value} onClick={()=>setPlatform(value)} aria-pressed={platform===value} className={`pill ${platform===value?"border-violet-300/40 bg-violet-500/12 text-violet-100":""}`}>{label}</button>)}</div></div>{error&&<div role="alert" className="mt-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}<button onClick={generate} className="primary-btn mt-5 w-full" disabled={loading}>{loading?"✦ Generating with CreatorOS AI...":"✦ Generate content"}</button></Card>

          <Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Suggested hashtags</h2><span className="text-xs text-[#6c7890]">{hashtags.length} tags</span></div>{hashtags.length?<div className="mt-4 flex flex-wrap gap-2">{hashtags.map((hashtag,index)=><code key={`${hashtag}-${index}`} className="rounded-lg border border-violet-300/10 bg-violet-500/[.05] px-2.5 py-2 text-[11px] text-violet-200">{hashtag}</code>)}</div>:<p className="muted mt-4 text-xs leading-5">Generate a caption or request hashtags separately.</p>}<div className="mt-4 grid grid-cols-2 gap-2"><button className="secondary-btn" onClick={generateTags} disabled={tagLoading}>{tagLoading?"Generating...":"Generate tags"}</button><button className="secondary-btn" disabled={!hashtags.length} onClick={()=>copyText(hashtags.join(" "),"hashtags")}>{copied==="hashtags"?"✓ Copied":"Copy all"}</button></div></Card>

          <Card className="p-5"><div className="flex items-center justify-between"><div><div className="kicker">Content analyzer</div><h2 className="mt-1 font-semibold text-white">Quality score</h2></div><div className="grid h-14 w-14 place-items-center rounded-full border border-violet-300/20 bg-violet-500/10 text-lg font-semibold text-white">{analysis?.score??"—"}</div></div>{analysis?<><div className="mt-4"><div className="label mb-2">Strengths</div>{analysis.strengths.map(strength=><div key={strength} className="mt-2 flex gap-2 text-xs text-[#9bcdb9]"><span>✓</span><span>{strength}</span></div>)}</div><div className="mt-4"><div className="label mb-2">Improve next</div>{analysis.suggestions.map(suggestion=><div key={suggestion} className="mt-2 flex gap-2 text-xs leading-5 text-[#9ca8be]"><span className="text-[#ffb95f]">•</span><span>{suggestion}</span></div>)}</div></>:<p className="muted mt-4 text-xs leading-5">Analyze the generated caption to get a score, strengths and improvement suggestions.</p>}<button onClick={analyze} className="secondary-btn mt-5 w-full" disabled={analyzing||!caption}>{analyzing?"Analyzing...":"Analyze caption"}</button></Card>
        </div>

        <div><div className="mb-4 flex items-center justify-between gap-3"><div><div className="kicker">AI output</div><h1 className="mt-1 text-2xl font-semibold tracking-[-.04em] text-white">Platform-ready content</h1></div>{source&&<span className={`pill ${source==="ollama"?"text-[#4edea3]":"text-[#ffb95f]"}`}>Source · {source}</span>}</div>{caption?<Card className="neon-border relative overflow-hidden p-6"><div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-300 opacity-60"/><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-md bg-white/[.055] px-2 py-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#9ba7bd]">{platform} · {tone}</span><div className="flex gap-2"><button className="text-xs text-[#748098] hover:text-white" onClick={()=>copyText(studioCaption,"caption")}>{copied==="caption"?"Copied":"Copy all"}</button><button className="text-xs text-[#748098] hover:text-white" onClick={()=>setEditing(value=>!value)}>{editing?"Done editing":"Edit"}</button></div></div>{editing?<textarea className="field mt-5 min-h-56 resize-y text-[15px] leading-7" value={caption} onChange={event=>setCaption(event.target.value)}/>:<p className="mt-5 whitespace-pre-wrap text-[15px] leading-7 text-[#dce4f6]">{caption}</p>}<div className="mt-6 rounded-xl border border-white/[.055] bg-white/[.02] p-4"><div className="label">Call to action</div><p className="mt-2 text-sm leading-6 text-[#b9c4d9]">{cta||"No CTA returned."}</p></div><div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-white/[.055] pt-5"><button className="secondary-btn" onClick={generate} disabled={loading}>↻ Refine</button><Link href="/content-studio" onClick={()=>sessionStorage.setItem("creatoros_draft_caption",studioCaption)} className="primary-btn">Use in Content Studio</Link></div></Card>:<EmptyState title="Your AI output will appear here" description="Add a topic, optional description, tone and platform. CreatorOS will call the configured Ollama/Qwen service and return a caption, CTA and hashtags."/>}</div>
      </div>
    </AppShell>
  );
}
