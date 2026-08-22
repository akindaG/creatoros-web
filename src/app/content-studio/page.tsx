"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";

const media = ["Desk setup","Creator portrait","Neon studio","City reel","Product shot","Workspace"];

export default function ContentStudioPage() {
  const [title,setTitle] = useState("Untitled creator post");
  const [caption,setCaption] = useState("Exploring the new dimensions of digital creativity. Build smarter, publish with intention, and let the data guide the next move. ✦");
  const [platform,setPlatform] = useState("Instagram");
  const [saved,setSaved] = useState(false);
  const [error,setError] = useState("");
  const count = useMemo(() => caption.length,[caption]);
  async function saveDraft(){setError("");setSaved(false);try{await apiFetch("/api/v1/posts",{method:"POST",body:JSON.stringify({title,caption,media_url:null,platform:platform.toLowerCase(),status:"draft",scheduled_time:null})});setSaved(true);}catch(e){setError(e instanceof Error?e.message:"Could not save draft");}}
  return (
    <AppShell title="Content Studio" subtitle="Create, organize and prepare content" actions={<Link href="/ai-assistant" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">✦ AI Assistant</Link>}>
      <div className="mb-6"><div className="kicker">Creative workspace</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Content Studio</h1><p className="muted mt-2 text-sm">Manage media assets and turn ideas into platform-ready posts.</p></div>
      <div className="grid gap-4 xl:grid-cols-[190px_1fr_310px]">
        <Card className="h-fit p-4"><div className="kicker">Library filters</div><div className="mt-4 space-y-1">{[["All media","12"],["Images","8"],["Videos","4"],["Drafts","5"],["Scheduled","3"]].map(([a,b],i) => <button key={a} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${i===0?"bg-violet-500/12 text-violet-100":"text-[#7f8ba3] hover:bg-white/[.03]"}`}><span>{a}</span><span className="text-[10px] text-[#59657d]">{b}</span></button>)}</div><label className="mt-5 grid cursor-pointer place-items-center rounded-xl border border-dashed border-violet-300/15 bg-violet-500/[.035] p-5 text-center"><input type="file" accept="image/*,video/*" className="hidden"/><span className="text-xl text-violet-200">＋</span><span className="mt-2 text-xs font-semibold text-white">Upload asset</span><span className="mt-1 text-[10px] text-[#68758f]">Image or video</span></label></Card>
        <Card className="p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Media grid</h2><p className="muted mt-1 text-xs">Select an asset to attach</p></div><div className="pill">Grid view</div></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{media.map((item,i)=><button key={item} className={`group relative aspect-square overflow-hidden rounded-xl border text-left ${i===1?"border-violet-300/50 shadow-[0_0_22px_rgba(124,58,237,.12)]":"border-white/[.055]"}`}><div className={`absolute inset-0 bg-gradient-to-br ${i%3===0?"from-violet-500/35 via-[#101a31] to-emerald-400/10":i%3===1?"from-fuchsia-400/20 via-[#0e1427] to-cyan-400/10":"from-indigo-400/20 via-[#10162a] to-rose-400/10"}`}/><div className="absolute inset-0 opacity-60 premium-grid"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020617] to-transparent p-3"><div className="truncate text-xs font-semibold text-white">{item}</div><div className="mt-1 text-[9px] text-[#8390a7]">{i%3===0?"VIDEO":"IMAGE"} · {(1.2+i*.4).toFixed(1)} MB</div></div></button>)}</div></Card>
        <Card className="h-fit p-5"><div className="flex items-center justify-between border-b border-white/[.055] pb-4"><h2 className="font-semibold text-white">Post editor</h2><span className="pill">Draft</span></div><label className="mt-5 block"><span className="label mb-2 block">Post title</span><input className="field" value={title} onChange={e=>setTitle(e.target.value)}/></label><div className="mt-5"><div className="label mb-2">Platforms</div><div className="flex gap-2">{["Instagram","Facebook"].map(p=><button key={p} onClick={()=>setPlatform(p)} className={`pill ${platform===p?"border-violet-300/35 bg-violet-500/10 text-violet-100":""}`}><span className="status-dot"/>{p}</button>)}</div></div><div className="mt-5"><label className="label mb-2 block">Caption</label><textarea className="field min-h-44 resize-none text-sm leading-6" value={caption} onChange={e=>setCaption(e.target.value)}/><div className="mt-2 flex justify-between text-[10px] text-[#66738b]"><span>{count} characters</span><button className="text-violet-300" onClick={()=>setCaption(c=>c+"\n\n#CreatorOS #SocialGrowth #ContentStrategy")}>＋ hashtags</button></div></div><div className="mt-5 rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="label">Attached media</div><div className="mt-2 h-24 rounded-lg bg-gradient-to-br from-violet-500/20 to-emerald-300/[.05] premium-grid"/></div>{error&&<div className="mt-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}<div className="mt-5 grid gap-2"><button onClick={saveDraft} className="primary-btn">{saved?"✓ Draft saved":"Save draft"}</button><Link href="/calendar" className="secondary-btn">Schedule post</Link></div></Card>
      </div>
    </AppShell>
  );
}
