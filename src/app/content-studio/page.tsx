"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type Asset = { id: string; name: string; kind: "IMAGE" | "VIDEO"; size: string; url?: string };
type UploadResponse = { url: string; object_name: string; storage: string };
type PostResponse = { id: string };
type Filter = "All media" | "Images" | "Videos";

const initialAssets: Asset[] = [
  {id:"desk",name:"Desk setup",kind:"VIDEO",size:"1.2 MB"},
  {id:"portrait",name:"Creator portrait",kind:"IMAGE",size:"1.6 MB"},
  {id:"studio",name:"Neon studio",kind:"IMAGE",size:"2.0 MB"},
  {id:"city",name:"City reel",kind:"VIDEO",size:"2.4 MB"},
  {id:"product",name:"Product shot",kind:"IMAGE",size:"2.8 MB"},
  {id:"workspace",name:"Workspace",kind:"IMAGE",size:"3.2 MB"},
];

export default function ContentStudioPage() {
  const [title,setTitle] = useState("Untitled creator post");
  const [caption,setCaption] = useState("Exploring the new dimensions of digital creativity. Build smarter, publish with intention, and let the data guide the next move. ✦");
  const [platform,setPlatform] = useState("Instagram");
  const [assets,setAssets] = useState(initialAssets);
  const [selectedAssetId,setSelectedAssetId] = useState("portrait");
  const [filter,setFilter] = useState<Filter>("All media");
  const [saving,setSaving] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [savedPostId,setSavedPostId] = useState("");
  const [error,setError] = useState("");

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      const draft=sessionStorage.getItem("creatoros_draft_caption");
      if(draft){setCaption(draft);sessionStorage.removeItem("creatoros_draft_caption");}
    });
    return()=>cancelAnimationFrame(frame);
  },[]);

  const count = caption.length;
  const selectedAsset=assets.find((asset)=>asset.id===selectedAssetId);
  const filteredAssets=useMemo(()=>assets.filter((asset)=>filter==="All media"||(filter==="Images"&&asset.kind==="IMAGE")||(filter==="Videos"&&asset.kind==="VIDEO")),[assets,filter]);
  const filterOptions:{label:Filter;count:number}[]=[
    {label:"All media",count:assets.length},
    {label:"Images",count:assets.filter((asset)=>asset.kind==="IMAGE").length},
    {label:"Videos",count:assets.filter((asset)=>asset.kind==="VIDEO").length},
  ];

  function markDirty(){setSavedPostId("");}

  async function uploadAsset(event:ChangeEvent<HTMLInputElement>){
    const input=event.currentTarget;
    const file=input.files?.[0];
    if(!file)return;
    setUploading(true);
    setError("");
    try{
      const body=new FormData();
      body.append("file",file);
      const uploaded=await apiFetch<UploadResponse>("/api/v1/media/upload",{method:"POST",body});
      const asset:Asset={id:uploaded.object_name,name:file.name,kind:file.type==="video/mp4"?"VIDEO":"IMAGE",size:`${(file.size/1_048_576).toFixed(1)} MB`,url:uploaded.url};
      setAssets((current)=>[asset,...current]);
      setSelectedAssetId(asset.id);
      setFilter("All media");
      markDirty();
    }catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not upload asset");}
    finally{setUploading(false);input.value="";}
  }

  async function saveDraft(){
    if(!title.trim()){setError("Add a post title before saving.");return;}
    setError("");
    setSaving(true);
    try{
      const post=await apiFetch<PostResponse>("/api/v1/posts",{method:"POST",body:JSON.stringify({title:title.trim(),caption:caption.trim(),media_url:selectedAsset?.url??null,platform:platform.toLowerCase(),status:"draft",scheduled_time:null})});
      setSavedPostId(post.id);
    }catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not save draft");}
    finally{setSaving(false);}
  }

  return (
    <AppShell title="Content Studio" subtitle="Create, organize and prepare content" actions={<Link href="/ai-assistant" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">✦ AI Assistant</Link>}>
      <div className="mb-6"><div className="kicker">Creative workspace</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Content Studio</h1><p className="muted mt-2 text-sm">Manage media assets and turn ideas into platform-ready posts.</p></div>
      <div className="grid gap-4 xl:grid-cols-[190px_1fr_310px]">
        <Card className="h-fit p-4">
          <div className="kicker">Library filters</div>
          <div className="mt-4 space-y-1">{filterOptions.map(({label,count:optionCount})=><button key={label} onClick={()=>setFilter(label)} aria-pressed={filter===label} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${filter===label?"bg-violet-500/12 text-violet-100":"text-[#7f8ba3] hover:bg-white/[.03]"}`}><span>{label}</span><span className="text-[10px] text-[#59657d]">{optionCount}</span></button>)}</div>
          <label className="mt-5 grid cursor-pointer place-items-center rounded-xl border border-dashed border-violet-300/15 bg-violet-500/[.035] p-5 text-center"><input type="file" accept="image/jpeg,image/png,image/webp,video/mp4" className="sr-only" onChange={uploadAsset} disabled={uploading}/><span className="text-xl text-violet-200">＋</span><span className="mt-2 text-xs font-semibold text-white">{uploading?"Uploading...":"Upload asset"}</span><span className="mt-1 text-[10px] text-[#68758f]">JPEG, PNG, WebP or MP4</span></label>
        </Card>

        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Media grid</h2><p className="muted mt-1 text-xs">Select an asset to attach</p></div><div className="pill">{filteredAssets.length} assets</div></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{filteredAssets.map((item,index)=><button key={item.id} onClick={()=>{setSelectedAssetId(item.id);markDirty();}} aria-pressed={selectedAssetId===item.id} className={`group relative aspect-square overflow-hidden rounded-xl border text-left ${selectedAssetId===item.id?"border-violet-300/50 shadow-[0_0_22px_rgba(124,58,237,.12)]":"border-white/[.055]"}`}><div className={`absolute inset-0 bg-gradient-to-br ${index%3===0?"from-violet-500/35 via-[#101a31] to-emerald-400/10":index%3===1?"from-fuchsia-400/20 via-[#0e1427] to-cyan-400/10":"from-indigo-400/20 via-[#10162a] to-rose-400/10"}`}/><div className="premium-grid absolute inset-0 opacity-60"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020617] to-transparent p-3"><div className="truncate text-xs font-semibold text-white">{item.name}</div><div className="mt-1 text-[9px] text-[#8390a7]">{item.kind} · {item.size}</div></div></button>)}</div>
          {!filteredAssets.length&&<div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-white/10 text-sm text-[#7f8ba3]">No assets match this filter.</div>}
        </Card>

        <Card className="h-fit p-5">
          <div className="flex items-center justify-between border-b border-white/[.055] pb-4"><h2 className="font-semibold text-white">Post editor</h2><span className="pill">{savedPostId?"Saved":"Draft"}</span></div>
          <label className="mt-5 block"><span className="label mb-2 block">Post title</span><input className="field" value={title} onChange={(event)=>{setTitle(event.target.value);markDirty();}} maxLength={200}/></label>
          <div className="mt-5"><div className="label mb-2">Platforms</div><div className="flex gap-2">{["Instagram","Facebook"].map((item)=><button key={item} onClick={()=>{setPlatform(item);markDirty();}} aria-pressed={platform===item} className={`pill ${platform===item?"border-violet-300/35 bg-violet-500/10 text-violet-100":""}`}><span className="status-dot"/>{item}</button>)}</div></div>
          <div className="mt-5"><label className="label mb-2 block">Caption</label><textarea className="field min-h-44 resize-none text-sm leading-6" value={caption} onChange={(event)=>{setCaption(event.target.value);markDirty();}} maxLength={2200}/><div className="mt-2 flex justify-between text-[10px] text-[#66738b]"><span>{count} / 2200 characters</span><button className="text-violet-300" onClick={()=>{setCaption((current)=>`${current}\n\n#CreatorOS #SocialGrowth #ContentStrategy`);markDirty();}}>＋ hashtags</button></div></div>
          <div className="mt-5 rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="label">Attached media</div><div className="premium-grid mt-2 flex h-24 items-end rounded-lg bg-gradient-to-br from-violet-500/20 to-emerald-300/[.05] p-3"><span className="rounded-md bg-[#020617]/70 px-2 py-1 text-[10px] text-violet-100">{selectedAsset?.name??"No asset selected"}</span></div></div>
          {error&&<div role="alert" className="mt-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}
          <div className="mt-5 grid gap-2"><button onClick={saveDraft} disabled={saving} className="primary-btn">{saving?"Saving...":savedPostId?"✓ Draft saved":"Save draft"}</button>{savedPostId?<Link href={`/calendar?post=${encodeURIComponent(savedPostId)}`} className="secondary-btn">Schedule post</Link>:<button className="secondary-btn" disabled title="Save the draft before scheduling">Save before scheduling</button>}</div>
        </Card>
      </div>
    </AppShell>
  );
}
