"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card, EmptyState } from "@/components/ui";
import { SocialLogo } from "@/components/social-logo";
import { apiFetch, mediaUrl } from "@/lib/api";

type Asset = { id:string; name:string; kind:"IMAGE"|"VIDEO"; size:string; url:string };
type UploadResponse = { url:string; object_name:string; storage:string };
type PublishResponse = { status:string; mode:string; external_id?:string|null; message?:string; published?:number; failed?:number; results?:Array<{platform:string;status:string;external_id?:string|null;detail?:string}> };
type PublishingReadiness = { live:boolean; mode:string; instagram_connected:boolean; facebook_connected:boolean };
type AutoPlatform = "instagram" | "facebook";
type Post = { id:string; title:string; caption:string|null; media_url:string|null; platform:string; status:string; scheduled_time:string|null; created_at:string };
type Filter = "All media" | "Images" | "Videos";
type PlatformLabel = "Instagram" | "Facebook Page" | "Facebook Profile";

function platformValue(platform:PlatformLabel):"instagram"|"facebook"|"facebook_profile" { return platform==="Facebook Page"?"facebook":platform==="Facebook Profile"?"facebook_profile":"instagram"; }
function platformLabel(platform:string):PlatformLabel { return platform==="facebook"?"Facebook Page":platform==="facebook_profile"?"Facebook Profile":"Instagram"; }
function kindFromUrl(url:string):"IMAGE"|"VIDEO" { return /\.mp4(?:$|\?)/i.test(url)?"VIDEO":"IMAGE"; }
function autoPlatformLabel(platform:AutoPlatform){return platform==="facebook"?"Facebook Page":"Instagram";}

export default function ContentStudioPage() {
  const [title,setTitle] = useState("Untitled creator post");
  const [caption,setCaption] = useState("");
  const [platform,setPlatform] = useState<PlatformLabel>("Instagram");
  const [publishTargets,setPublishTargets] = useState<AutoPlatform[]>(["instagram"]);
  const [publishingReadiness,setPublishingReadiness] = useState<PublishingReadiness|null>(null);
  const [uploadedAssets,setUploadedAssets] = useState<Asset[]>([]);
  const [drafts,setDrafts] = useState<Post[]>([]);
  const [selectedAssetId,setSelectedAssetId] = useState("");
  const [editingPostId,setEditingPostId] = useState("");
  const [filter,setFilter] = useState<Filter>("All media");
  const [saving,setSaving] = useState(false);
  const [publishing,setPublishing] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [loadingDrafts,setLoadingDrafts] = useState(true);
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");
  const [manualSharePostId,setManualSharePostId] = useState("");

  const loadDrafts=useCallback(async()=>{
    try{const data=await apiFetch<Post[]>("/api/v1/posts?status=draft");setDrafts(data);}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not load drafts");}
    finally{setLoadingDrafts(false);}
  },[]);

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      const draft=sessionStorage.getItem("creatoros_draft_caption");
      const draftPlatform=sessionStorage.getItem("creatoros_draft_platform");
      if(draft){setCaption(draft);sessionStorage.removeItem("creatoros_draft_caption");}
      if(draftPlatform==="facebook"||draftPlatform==="instagram"||draftPlatform==="facebook_profile"){setPlatform(platformLabel(draftPlatform));sessionStorage.removeItem("creatoros_draft_platform");}
      void loadDrafts();
      void apiFetch<PublishingReadiness>("/api/v1/publishing/readiness").then(setPublishingReadiness).catch(()=>undefined);
    });
    return()=>cancelAnimationFrame(frame);
  },[loadDrafts]);

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
  const activeAutoTargets:AutoPlatform[]=publishTargets.length?publishTargets:[platform==="Facebook Page"?"facebook":"instagram"];
  const publishTargetText=activeAutoTargets.map(autoPlatformLabel).join(" + ");
  const filterOptions:{label:Filter;count:number}[]=[
    {label:"All media",count:assets.length},
    {label:"Images",count:assets.filter(asset=>asset.kind==="IMAGE").length},
    {label:"Videos",count:assets.filter(asset=>asset.kind==="VIDEO").length},
  ];

  function resetEditor(){setEditingPostId("");setTitle("Untitled creator post");setCaption("");setPlatform("Instagram");setPublishTargets(["instagram"]);setSelectedAssetId("");setManualSharePostId("");setMessage("");setError("");}

  function choosePlatform(item:PlatformLabel){
    setPlatform(item);
    if(item==="Facebook Profile"){setPublishTargets([]);return;}
    const target:AutoPlatform=item==="Facebook Page"?"facebook":"instagram";
    setPublishTargets(current=>current.includes(target)?current:[...current,target]);
  }

  function togglePublishTarget(target:AutoPlatform){
    const connected=target==="instagram"?publishingReadiness?.instagram_connected:publishingReadiness?.facebook_connected;
    if(connected===false){setError(`Connect ${autoPlatformLabel(target)} first from Social Accounts.`);return;}
    setError("");
    setPublishTargets(current=>{
      if(current.includes(target)){
        if(current.length===1)return current;
        return current.filter(item=>item!==target);
      }
      return [...current,target];
    });
  }

  function editDraft(post:Post){
    setEditingPostId(post.id);setTitle(post.title);setCaption(post.caption??"");setPlatform(platformLabel(post.platform));setPublishTargets(post.platform==="facebook"?["facebook"]:post.platform==="instagram"?["instagram"]:[]);setManualSharePostId("");
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
    const payload={title:title.trim(),caption:caption.trim()||null,media_url:selectedAsset?.url??null,platform:platformValue(platform),status:"draft",scheduled_time:null};
    try{
      const post=editingPostId
        ? await apiFetch<Post>(`/api/v1/posts/${editingPostId}`,{method:"PUT",body:JSON.stringify(payload)})
        : await apiFetch<Post>("/api/v1/posts",{method:"POST",body:JSON.stringify(payload)});
      setEditingPostId(post.id);setMessage(editingPostId?"Draft updated successfully.":"Draft saved successfully.");
      await loadDrafts();
    }catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not save draft");}
    finally{setSaving(false);}
  }

  async function publishNow(){
    if(!title.trim()){setError("Add a post title before publishing.");return;}
    const targetPlatform=platform;
    const isProfileShare=targetPlatform==="Facebook Profile";
    const targets:AutoPlatform[]=isProfileShare?[]:activeAutoTargets;
    if(!isProfileShare&&targets.includes("instagram")&&!selectedAsset){setError("Instagram requires an image or video before publishing.");return;}
    const confirmText=isProfileShare
      ?"Prepare this post for your personal Facebook profile now? CreatorOS will copy the caption and open Facebook for you to finish the post."
      :targets.length>1
        ?`Publish this post to ${publishTargetText} with one action?`
        :`Publish this post to ${publishTargetText} now?`;
    if(!window.confirm(confirmText))return;

    const facebookWindow=isProfileShare?window.open("about:blank","creatoros-facebook-profile"):null;
    if(isProfileShare&&facebookWindow)facebookWindow.opener=null;

    setPublishing(true);setError("");setMessage("");
    const primaryPlatform=isProfileShare?"facebook_profile":targets[0];
    const payload={title:title.trim(),caption:caption.trim()||null,media_url:selectedAsset?.url??null,platform:primaryPlatform,status:"draft",scheduled_time:null};

    try{
      let copied=false;
      if(isProfileShare){
        const shareText=caption.trim()||title.trim();
        try{await navigator.clipboard.writeText(shareText);copied=true;}catch{}
      }

      const post=editingPostId
        ? await apiFetch<Post>(`/api/v1/posts/${editingPostId}`,{method:"PUT",body:JSON.stringify(payload)})
        : await apiFetch<Post>("/api/v1/posts",{method:"POST",body:JSON.stringify(payload)});

      setEditingPostId(post.id);

      if(isProfileShare){
        setManualSharePostId(post.id);
        let opened=facebookWindow;
        if(facebookWindow)facebookWindow.location.href="https://www.facebook.com/";
        else opened=window.open("https://www.facebook.com/","_blank","noopener,noreferrer");
        await loadDrafts();
        if(!opened)setError(`Your browser blocked the Facebook window. ${copied?"The caption is copied, so open Facebook manually and paste it.":"Open Facebook manually and copy the caption from CreatorOS."}`);
        else setMessage(`Facebook opened for manual profile sharing. ${copied?"Your caption is copied to the clipboard.":"Copy your caption from CreatorOS."}${selectedAsset?" Add the selected media manually in Facebook.":""} After you post it, return here and click “I've shared it”.`);
        return;
      }

      const publishResult=targets.length>1
        ?await apiFetch<PublishResponse>(`/api/v1/publishing/posts/${post.id}/multi`,{method:"POST",body:JSON.stringify({platforms:targets})})
        :await apiFetch<PublishResponse>(`/api/v1/publishing/posts/${post.id}`,{method:"POST"});

      await loadDrafts();
      if(publishResult.mode!=="live"){
        setError(`CreatorOS simulated this publish. Nothing was sent to ${publishTargetText}. Set SOCIAL_PUBLISH_MODE=live on the deployed backend and redeploy it.`);
        return;
      }
      if(targets.length>1&&publishResult.failed){
        const failedNames=(publishResult.results??[]).filter(item=>item.status!=="published").map(item=>autoPlatformLabel(item.platform as AutoPlatform));
        setError(`Published to ${publishResult.published??0} platform(s), but ${failedNames.join(", ")||"one platform"} failed. The failed copy remains retryable as a draft.`);
        await loadDrafts();
        return;
      }
      resetEditor();
      setMessage(targets.length>1?`Published to ${publishTargetText} successfully.`:`Post published to ${publishTargetText} successfully${publishResult.external_id?` · ${publishResult.external_id}`:""}.`);
    }catch(requestError){
      if(facebookWindow&&!facebookWindow.closed)facebookWindow.close();
      await loadDrafts();
      setError(requestError instanceof Error?requestError.message:`Could not publish to ${isProfileShare?"Facebook Profile":publishTargetText}`);
    }finally{
      setPublishing(false);
    }
  }

  async function markManualShared(){
    if(!manualSharePostId)return;
    setPublishing(true);setError("");
    try{
      await apiFetch(`/api/v1/publishing/posts/${manualSharePostId}/mark-shared`,{method:"POST"});
      await loadDrafts();
      resetEditor();
      setMessage("Facebook profile post marked as shared.");
    }catch(requestError){
      setError(requestError instanceof Error?requestError.message:"Could not mark the profile post as shared");
    }finally{
      setPublishing(false);
    }
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
          <Card className="h-fit p-4"><div className="flex items-center justify-between"><div className="kicker">Saved drafts</div><span className="pill !py-1">{drafts.length}</span></div><div className="mt-3 max-h-80 space-y-2 overflow-y-auto">{loadingDrafts?<div className="p-3 text-xs text-[#77839a]">Loading drafts...</div>:drafts.length?drafts.map(post=><div key={post.id} className={`rounded-xl border p-3 ${editingPostId===post.id?"border-violet-300/25 bg-violet-500/[.07]":"border-white/[.05] bg-white/[.015]"}`}><button onClick={()=>editDraft(post)} className="w-full text-left"><div className="truncate text-xs font-semibold text-white">{post.title}</div><div className="mt-1 flex items-center gap-1.5 text-[9px] uppercase tracking-wide text-[#68758f]"><SocialLogo platform={post.platform} className="h-4 w-4 rounded-[5px]" />{platformLabel(post.platform)}</div></button><div className="mt-2 flex gap-3"><button onClick={()=>editDraft(post)} className="text-[10px] font-semibold text-violet-300">Edit</button><button onClick={()=>deleteDraft(post.id)} className="text-[10px] font-semibold text-rose-300">Delete</button></div></div>):<div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-[10px] leading-5 text-[#77839a]">No saved drafts yet.</div>}</div></Card>
        </div>

        <Card className="p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Media assets</h2><p className="muted mt-1 text-xs">Uploaded media and media attached to saved drafts</p></div><div className="pill">{filteredAssets.length} assets</div></div>{filteredAssets.length?<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{filteredAssets.map((item,index)=><button key={item.id} onClick={()=>setSelectedAssetId(item.id)} aria-pressed={selectedAssetId===item.id} className={`group relative aspect-square overflow-hidden rounded-xl border text-left ${selectedAssetId===item.id?"border-violet-300/50 shadow-[0_0_22px_rgba(124,58,237,.12)]":"border-white/[.055]"}`}><div className={`absolute inset-0 bg-gradient-to-br ${index%3===0?"from-violet-500/35 via-[#101a31] to-emerald-400/10":index%3===1?"from-fuchsia-400/20 via-[#0e1427] to-cyan-400/10":"from-indigo-400/20 via-[#10162a] to-rose-400/10"}`} style={item.kind==="IMAGE"?{backgroundImage:`linear-gradient(to top, rgba(2,6,23,.88), rgba(2,6,23,.08)), url(${mediaUrl(item.url)})`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}/><div className="premium-grid absolute inset-0 opacity-30"/><div className="absolute inset-x-0 bottom-0 p-3"><div className="truncate text-xs font-semibold text-white">{item.name}</div><div className="mt-1 text-[9px] text-[#a2acc0]">{item.kind} · {item.size}</div></div></button>)}</div>:<EmptyState title="Your media library is empty" description="Upload an image or MP4. CreatorOS will store it through the backend and attach its URL to your draft."/>}</Card>

        <Card className="h-fit p-5"><div className="flex items-center justify-between border-b border-white/[.055] pb-4"><h2 className="font-semibold text-white">Post editor</h2><span className="pill">{editingPostId?"Editing draft":"New draft"}</span></div><label className="mt-5 block"><span className="label mb-2 block">Post title</span><input className="field" value={title} onChange={event=>setTitle(event.target.value)} maxLength={200}/></label><div className="mt-5"><div className="label mb-2">Publishing mode</div><div className="flex flex-wrap gap-2">{(["Instagram","Facebook Page","Facebook Profile"] as PlatformLabel[]).map(item=><button key={item} onClick={()=>choosePlatform(item)} aria-pressed={platform===item} className={`pill ${platform===item?"border-violet-300/35 bg-violet-500/10 text-violet-100":""}`}><SocialLogo platform={platformValue(item)} className="h-5 w-5 rounded-md" />{item}</button>)}</div></div>{platform!=="Facebook Profile"&&<div className="mt-4 rounded-xl border border-white/[.055] bg-white/[.018] p-3"><div className="flex items-center justify-between gap-3"><div><div className="label">Publish simultaneously</div><div className="mt-1 text-[10px] leading-5 text-[#77839a]">Select every connected channel that should receive this content from one Post Now action.</div></div><span className="pill !py-1">{activeAutoTargets.length} selected</span></div><div className="mt-3 grid grid-cols-2 gap-2">{(["instagram","facebook"] as AutoPlatform[]).map(target=>{const connected=target==="instagram"?publishingReadiness?.instagram_connected:publishingReadiness?.facebook_connected;const selected=activeAutoTargets.includes(target);return <button key={target} type="button" disabled={connected===false} onClick={()=>togglePublishTarget(target)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[10px] font-semibold ${selected?"border-violet-300/30 bg-violet-500/10 text-violet-100":"border-white/[.06] text-[#8290a8]"} ${connected===false?"cursor-not-allowed opacity-45":""}`}><SocialLogo platform={target} className="h-5 w-5 rounded-md"/><span>{autoPlatformLabel(target)}<span className="mt-0.5 block text-[8px] font-normal text-[#66738b]">{connected===false?"Not connected":selected?"Selected":"Available"}</span></span></button>})}</div></div>}{platform==="Facebook Profile"&&<div className="mt-4 rounded-xl border border-blue-300/10 bg-blue-300/[.04] p-3 text-[10px] leading-5 text-blue-100"><strong>Personal profile mode:</strong> Meta does not allow CreatorOS to silently publish to personal timelines. CreatorOS saves the post, copies the caption, opens Facebook, and lets you complete the share yourself. Scheduled profile posts become “Ready to share” in Calendar at the selected time.</div>}<div className="mt-5"><label className="label mb-2 block">Caption</label><textarea className="field min-h-44 resize-none text-sm leading-6" value={caption} onChange={event=>setCaption(event.target.value)} maxLength={2200}/><div className="mt-2 flex justify-between text-[10px] text-[#66738b]"><span>{count} / 2200 characters</span><Link href="/ai-assistant" className="text-violet-300">✦ Improve with AI</Link></div></div><div className="mt-5 rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="flex items-center justify-between"><div className="label">Attached media</div>{selectedAsset&&<button onClick={()=>setSelectedAssetId("")} className="text-[10px] text-[#7d899f]">Remove</button>}</div><div className="premium-grid mt-2 flex h-24 items-end rounded-lg bg-gradient-to-br from-violet-500/20 to-emerald-300/[.05] p-3" style={selectedAsset?.kind==="IMAGE"?{backgroundImage:`linear-gradient(to top, rgba(2,6,23,.9), rgba(2,6,23,.08)), url(${mediaUrl(selectedAsset.url)})`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}><span className="rounded-md bg-[#020617]/70 px-2 py-1 text-[10px] text-violet-100">{selectedAsset?.name??"No media selected"}</span></div></div><div className="mt-5 grid gap-2"><button onClick={saveDraft} disabled={saving||publishing} className="primary-btn">{saving?"Saving...":editingPostId?"Save changes":"Save draft"}</button><button onClick={publishNow} disabled={saving||publishing||uploading} className="secondary-btn">{publishing?"Working...":platform==="Facebook Profile"?"Share to Facebook Profile":activeAutoTargets.length>1?`Post now to ${activeAutoTargets.length} platforms`:`Post to ${publishTargetText} now`}</button>{manualSharePostId&&<button onClick={markManualShared} disabled={publishing} className="secondary-btn">✓ I&apos;ve shared it on Facebook</button>}{editingPostId?<Link href={`/calendar?post=${encodeURIComponent(editingPostId)}&targets=${encodeURIComponent(activeAutoTargets.join(","))}`} className="secondary-btn">{activeAutoTargets.length>1?`Schedule ${activeAutoTargets.length} platforms`:"Schedule post"}</Link>:<button className="secondary-btn" disabled title="Save the draft before scheduling">Save before scheduling</button>}</div></Card>
      </div>
    </AppShell>
  );
}
