"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card, EmptyState } from "@/components/ui";
import { apiFetch, mediaUrl } from "@/lib/api";

type Asset = { id:string; name:string; kind:"IMAGE"|"VIDEO"; size:string; url:string };
type UploadResponse = { url:string; object_name:string; storage:string };
type Post = { id:string; title:string; caption:string|null; media_url:string|null; platform:string; status:string; scheduled_time:string|null; created_at:string };
type Filter = "All media" | "Images" | "Videos";

function kindFromUrl(url:string):"IMAGE"|"VIDEO" { return /\.mp4(?:$|\?)/i.test(url)?"VIDEO":"IMAGE"; }

export default function ContentStudioPage() {
  const [title,setTitle] = useState("Untitled creator post");
  const [caption,setCaption] = useState("");
  const [platform,setPlatform] = useState("Instagram");
  const [uploadedAssets,setUploadedAssets] = useState<Asset[]>([]);
  const [drafts,setDrafts] = useState<Post[]>([]);
  const [selectedAssetId,setSelectedAssetId] = useState("");
  const [editingPostId,setEditingPostId] = useState("");
  const [filter,setFilter] = useState<Filter>("All media");
  const [saving,setSaving] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [loadingDrafts,setLoadingDrafts] = useState(true);
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");

  async function loadDrafts(){
    try{const data=await apiFetch<Post[]>("/api/v1/posts?status=draft");setDrafts(data);}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not load drafts");}
    finally{setLoadingDrafts(false);}
  }

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      const draft=sessionStorage.getItem("creatoros_draft_caption");
      if(draft){setCaption(draft);sessionStorage.removeItem("creatoros_draft_caption");}
    });
    loadDrafts();
    return()=>cancelAnimationFrame(frame);
  },[]);

  const postAssets=useMemo<Asset[]>(()=>{
    const seen=new Set<string>();
    return drafts.flatMap((post)=>{
      if(!post.media_url||seen.has(post.media_url))return [];
      seen.add(post.media_url);
      return [{id:`post-${post.id}`,name:`Media from ${post.title}`,kind:kindFromUrl(post.media_url),size:"Saved",url:post.media_url}];
    });
  },[drafts]);
  const assets=useMemo(()=>[...uploadedAssets,...postAssets.filter(asset=>!uploadedAssets.some(uploaded=>uploaded.url===asset.url))],[uploadedAssets,postAssets]);
  const count = caption.length;
  const selectedAsset=assets.find((asset)=>asset.id===selectedAssetId);
  const filteredAssets=useMemo(()=>assets.filter((asset)=>filter==="All media"||(filter==="Images"&&asset.kind==="IMAGE")||(filter==="Videos"&&asset.kind==="VIDEO")),[assets,filter]);
  const filterOptions:{label:Filter;count:number}[]=[
    {label:"All media",count:assets.length},
    {label:"Images",count:assets.filter(asset=>asset.kind==="IMAGE").length},
    {label:"Videos",count:assets.filter(asset=>asset.kind==="VIDEO").length},
  ];

  function resetEditor(){setEditingPostId("");setTitle("Untitled creator post");setCaption("");setPlatform("Instagram");setSelectedAssetId("");setMessage("");setError("");}

  function editDraft(post:Post){
    setEditingPostId(post.id);setTitle(post.title);setCaption(post.caption??"");setPlatform(post.platform==="facebook"?"Facebook":"Instagram");
    const matching=assets.find(asset=>asset.url===post.media_url);setSelectedAssetId(matching?.id??"");setMessage("");setError("");
  }

  async function uploadAsset(event:ChangeEvent<HTMLInputElement>){
    const input=event.currentTarget;const file=input.files?.[0];if(!file)return;
    setUploading(true);setError("");setMessage("");
    try{
      const body=new FormData();body.append("file",file);
      const uploaded=await apiFetch<UploadResponse>("/api/v1/media/upload",{method:"POST",body});
      const asset:Asset={id:uploaded.object_name,name:file.name,kind:file.type==="video/mp4"?"VIDEO":"IMAGE",size:`${(file.size/1_048_576).toFixed(1)} MB`,url:uploaded.url};
      setUploadedAssets(current=>[asset,...current]);setSelectedAssetId(asset.id);setFilter("All media");setMessage("Media uploaded successfully.");
    }catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not upload asset");}
    finally{setUploading(false);input.value="";}
  }

  async function saveDraft(){
    if(!title.trim()){setError("Add a post title before saving.");return;}
    setError("");setMessage("");setSaving(true);
    const payload={title:title.trim(),caption:caption.trim()||null,media_url:selectedAsset?.url??null,platform:platform.toLowerCase(),status:"draft",scheduled_time:null};
    try{
      const post=editingPostId
        ? await apiFetch<Post>(`/api/v1/posts/${editingPostId}`,{method:"PUT",body:JSON.stringify(payload)})
        : await apiFetch<Post>("/api/v1/posts",{method:"POST",body:JSON.stringify(payload)});
      setEditingPostId(post.id);setMessage(editingPostId?"Draft updated successfully.":"Draft saved successfully.");
      await loadDrafts();
    }catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not save draft");}
    finally{setSaving(false);}
  }

  async function deleteDraft(postId:string){
    if(!window.confirm("Delete this draft permanently?"))return;
    setError("");setMessage("");
    try{await apiFetch(`/api/v1/posts/${postId}`,{method:"DELETE"});if(editingPostId===postId)resetEditor();await loadDrafts();setMessage("Draft deleted.");}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not delete draft");}
  }

  return (
    <AppShell title="Content Studio" subtitle="Create, organize and prepare content" actions={<Link href="/ai-assistant" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">✦ AI Assistant</Link>}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><div className="kicker">Creative workspace</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Content Studio</h1><p className="muted mt-2 text-sm">Upload media, create drafts, edit saved posts and move finished content into the live publishing calendar.</p></div><button onClick={resetEditor} className="secondary-btn">＋ New draft</button></div>
      {(error||message)&&<div role={error?"alert":"status"} className={`mb-4 rounded-xl border p-3 text-xs ${error?"border-rose-300/10 bg-rose-400/[.06] text-rose-200":"border-emerald-300/10 bg-emerald-300/[.06] text-emerald-100"}`}>{error||message}</div>}
      <div className="grid gap-4 xl:grid-cols-[210px_1fr_330px]">
        <div className="space-y-4">
          <Card className="h-fit p-4"><div className="kicker">Media library</div><div className="mt-4 space-y-1">{filterOptions.map(({label,count:optionCount})=><button key={label} onClick={()=>setFilter(label)} aria-pressed={filter===label} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${filter===label?"bg-violet-500/12 text-violet-100":"text-[#7f8ba3] hover:bg-white/[.03]"}`}><span>{label}</span><span className="text-[10px] text-[#59657d]">{optionCount}</span></button>)}</div><label className="mt-5 grid cursor-pointer place-items-center rounded-xl border border-dashed border-violet-300/15 bg-violet-500/[.035] p-5 text-center"><input type="file" accept="image/jpeg,image/png,image/webp,video/mp4" className="sr-only" onChange={uploadAsset} disabled={uploading}/><span className="text-xl text-violet-200">＋</span><span className="mt-2 text-xs font-semibold text-white">{uploading?"Uploading...":"Upload asset"}</span><span className="mt-1 text-[10px] text-[#68758f]">JPEG, PNG, WebP or MP4</span></label></Card>
          <Card className="h-fit p-4"><div className="flex items-center justify-between"><div className="kicker">Saved drafts</div><span className="pill !py-1">{drafts.length}</span></div><div className="mt-3 max-h-80 space-y-2 overflow-y-auto">{loadingDrafts?<div className="p-3 text-xs text-[#77839a]">Loading drafts...</div>:drafts.length?drafts.map(post=><div key={post.id} className={`rounded-xl border p-3 ${editingPostId===post.id?"border-violet-300/25 bg-violet-500/[.07]":"border-white/[.05] bg-white/[.015]"}`}><button onClick={()=>editDraft(post)} className="w-full text-left"><div className="truncate text-xs font-semibold text-white">{post.title}</div><div className="mt-1 text-[9px] uppercase tracking-wide text-[#68758f]">{post.platform}</div></button><div className="mt-2 flex gap-3"><button onClick={()=>editDraft(post)} className="text-[10px] font-semibold text-violet-300">Edit</button><button onClick={()=>deleteDraft(post.id)} className="text-[10px] font-semibold text-rose-300">Delete</button></div></div>):<div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-[10px] leading-5 text-[#77839a]">No saved drafts yet.</div>}</div></Card>
        </div>

        <Card className="p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Media assets</h2><p className="muted mt-1 text-xs">Uploaded media and media attached to saved drafts</p></div><div className="pill">{filteredAssets.length} assets</div></div>{filteredAssets.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{filteredAssets.map((item,index)=><button key={item.id} onClick={()=>setSelectedAssetId(item.id)} aria-pressed={selectedAssetId===item.id} className={`group relative aspect-square overflow-hidden rounded-xl border text-left ${selectedAssetId===item.id?"border-violet-300/50 shadow-[0_0_22px_rgba(124,58,237,.12)]":"border-white/[.055]"}`}><div className={`absolute inset-0 bg-gradient-to-br ${index%3===0?"from-violet-500/35 via-[#101a31] to-emerald-400/10":index%3===1?"from-fuchsia-400/20 via-[#0e1427] to-cyan-400/10":"from-indigo-400/20 via-[#10162a] to-rose-400/10"}`} style={item.kind==="IMAGE"?{backgroundImage:`linear-gradient(to top, rgba(2,6,23,.88), rgba(2,6,23,.08)), url(${mediaUrl(item.url)})`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}/><div className="premium-grid absolute inset-0 opacity-30"/><div className="absolute inset-x-0 bottom-0 p-3"><div className="truncate text-xs font-semibold text-white">{item.name}</div><div className="mt-1 text-[9px] text-[#a2acc0]">{item.kind} · {item.size}</div></div></button>)}</div>:<EmptyState title="Your media library is empty" description="Upload an image or MP4. CreatorOS will store it through the backend and attach its URL to your draft."/>}</Card>

        <Card className="h-fit p-5"><div className="flex items-center justify-between border-b border-white/[.055] pb-4"><h2 className="font-semibold text-white">Post editor</h2><span className="pill">{editingPostId?"Editing draft":"New draft"}</span></div><label className="mt-5 block"><span className="label mb-2 block">Post title</span><input className="field" value={title} onChange={event=>setTitle(event.target.value)} maxLength={200}/></label><div className="mt-5"><div className="label mb-2">Platform</div><div className="flex gap-2">{["Instagram","Facebook"].map(item=><button key={item} onClick={()=>setPlatform(item)} aria-pressed={platform===item} className={`pill ${platform===item?"border-violet-300/35 bg-violet-500/10 text-violet-100":""}`}><span className="status-dot"/>{item}</button>)}</div></div><div className="mt-5"><label className="label mb-2 block">Caption</label><textarea className="field min-h-44 resize-none text-sm leading-6" value={caption} onChange={event=>setCaption(event.target.value)} maxLength={2200}/><div className="mt-2 flex justify-between text-[10px] text-[#66738b]"><span>{count} / 2200 characters</span><Link href="/ai-assistant" className="text-violet-300">✦ Improve with AI</Link></div></div><div className="mt-5 rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="flex items-center justify-between"><div className="label">Attached media</div>{selectedAsset&&<button onClick={()=>setSelectedAssetId("")} className="text-[10px] text-[#7d899f]">Remove</button>}</div><div className="premium-grid mt-2 flex h-24 items-end rounded-lg bg-gradient-to-br from-violet-500/20 to-emerald-300/[.05] p-3" style={selectedAsset?.kind==="IMAGE"?{backgroundImage:`linear-gradient(to top, rgba(2,6,23,.9), rgba(2,6,23,.08)), url(${mediaUrl(selectedAsset.url)})`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}><span className="rounded-md bg-[#020617]/70 px-2 py-1 text-[10px] text-violet-100">{selectedAsset?.name??"No media selected"}</span></div></div><div className="mt-5 grid gap-2"><button onClick={saveDraft} disabled={saving} className="primary-btn">{saving?"Saving...":editingPostId?"Save changes":"Save draft"}</button>{editingPostId?<Link href={`/calendar?post=${encodeURIComponent(editingPostId)}`} className="secondary-btn">Schedule post</Link>:<button className="secondary-btn" disabled title="Save the draft before scheduling">Save before scheduling</button>}</div></Card>
      </div>
    </AppShell>
  );
}
