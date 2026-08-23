"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { Card, EmptyState } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type CalendarItem = { schedule_id:string; post_id:string; title:string; platform:string; status:string; schedule_time:string };
type Post = { id:string; title:string; platform:string; status:string; scheduled_time?:string|null };
const slots=[8,10,12,14,16,18,20];

function startOfWeek(date:Date){const start=new Date(date);const weekday=start.getDay()||7;start.setDate(start.getDate()-weekday+1);start.setHours(0,0,0,0);return start;}
function sameDay(left:Date,right:Date){return left.getFullYear()===right.getFullYear()&&left.getMonth()===right.getMonth()&&left.getDate()===right.getDate();}
function formatHour(hour:number){return `${hour%12||12} ${hour>=12?"PM":"AM"}`;}

export default function CalendarClient({initialDate,postId}:{initialDate:string;postId:string}){
  const router=useRouter();
  const [anchorDate,setAnchorDate]=useState(()=>new Date(initialDate));
  const [items,setItems]=useState<CalendarItem[]>([]);
  const [drafts,setDrafts]=useState<Post[]>([]);
  const [selectedPost,setSelectedPost]=useState<Post|null>(null);
  const [loading,setLoading]=useState(true);
  const [refreshKey,setRefreshKey]=useState(0);
  const [platform,setPlatform]=useState("instagram");
  const [scheduling,setScheduling]=useState(false);
  const [scheduleError,setScheduleError]=useState("");
  const [scheduleMessage,setScheduleMessage]=useState("");
  const [pageError,setPageError]=useState("");

  const weekStart=useMemo(()=>startOfWeek(anchorDate),[anchorDate]);
  const days=useMemo(()=>Array.from({length:7},(_,index)=>{const date=new Date(weekStart);date.setDate(date.getDate()+index);return date;}),[weekStart]);
  const weekEnd=useMemo(()=>{const date=new Date(weekStart);date.setDate(date.getDate()+7);return date;},[weekStart]);

  useEffect(()=>{
    const controller=new AbortController();setLoading(true);setPageError("");
    const query=new URLSearchParams({start:weekStart.toISOString(),end:weekEnd.toISOString()});
    const requests:Promise<unknown>[]=[
      apiFetch<CalendarItem[]>(`/api/v1/calendar?${query}`,{signal:controller.signal}).then(setItems),
      apiFetch<Post[]>("/api/v1/posts?status=draft",{signal:controller.signal}).then(setDrafts),
    ];
    if(postId){requests.push(apiFetch<Post>(`/api/v1/posts/${encodeURIComponent(postId)}`,{signal:controller.signal}).then(post=>{setSelectedPost(post);setPlatform(post.platform);}));}else{setSelectedPost(null);}
    Promise.all(requests).catch(requestError=>{if(!(requestError instanceof DOMException&&requestError.name==="AbortError"))setPageError(requestError instanceof Error?requestError.message:"Could not load calendar");}).finally(()=>setLoading(false));
    return()=>controller.abort();
  },[weekStart,weekEnd,refreshKey,postId]);

  async function schedulePost(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(!postId)return;
    const form=new FormData(event.currentTarget);const scheduleTime=new Date(String(form.get("schedule_time")??""));
    if(Number.isNaN(scheduleTime.getTime())||scheduleTime<=new Date()){setScheduleError("Choose a valid future date and time.");return;}
    setScheduling(true);setScheduleError("");setScheduleMessage("");
    try{await apiFetch(`/api/v1/posts/${encodeURIComponent(postId)}/schedule`,{method:"POST",body:JSON.stringify({schedule_time:scheduleTime.toISOString(),platform})});setScheduleMessage("Post scheduled successfully.");setRefreshKey(value=>value+1);setTimeout(()=>router.replace("/calendar"),650);}
    catch(requestError){setScheduleError(requestError instanceof Error?requestError.message:"Could not schedule post");}
    finally{setScheduling(false);}
  }

  async function cancelSchedule(item:CalendarItem){
    if(!window.confirm(`Cancel the schedule for “${item.title}”?`))return;
    setPageError("");
    try{await apiFetch(`/api/v1/posts/${item.post_id}/schedule`,{method:"DELETE"});setRefreshKey(value=>value+1);}
    catch(requestError){setPageError(requestError instanceof Error?requestError.message:"Could not cancel schedule");}
  }

  function shiftWeek(amount:number){setAnchorDate(current=>{const next=new Date(current);next.setDate(next.getDate()+amount*7);return next;});}

  return (
    <AppShell title="Content Calendar" subtitle="Plan and manage your publishing schedule" actions={<Link href="/content-studio" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</Link>}>
      {postId&&<Card className="mb-4 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="kicker">{selectedPost?.status==="scheduled"?"Reschedule post":"Schedule draft"}</div><h1 className="mt-2 font-semibold text-white">{selectedPost?.title??"Loading post..."}</h1><p className="muted mt-1 text-xs">Choose a future publish time and a connected Facebook or Instagram account.</p></div><Link href="/calendar" className="text-xs font-semibold text-violet-300">Cancel</Link></div><form onSubmit={schedulePost} className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px_auto]"><label><span className="label mb-2 block">Publish date and time</span><input name="schedule_time" type="datetime-local" className="field" defaultValue={selectedPost?.scheduled_time?new Date(new Date(selectedPost.scheduled_time).getTime()-new Date(selectedPost.scheduled_time).getTimezoneOffset()*60000).toISOString().slice(0,16):undefined} required/></label><label><span className="label mb-2 block">Platform</span><select className="field" value={platform} onChange={event=>setPlatform(event.target.value)}><option value="instagram">Instagram</option><option value="facebook">Facebook</option></select></label><button className="primary-btn self-end" disabled={scheduling||!selectedPost}>{scheduling?"Scheduling...":selectedPost?.status==="scheduled"?"Update schedule":"Schedule"}</button></form>{scheduleError&&<div role="alert" className="mt-3 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{scheduleError}</div>}{scheduleMessage&&<div role="status" className="mt-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[.06] p-3 text-xs text-emerald-100">{scheduleMessage}</div>}</Card>}
      {pageError&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{pageError}</div>}
      <div className="grid gap-4 xl:grid-cols-[1fr_290px]">
        <Card className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.055] p-4"><div className="flex items-center gap-2"><button onClick={()=>shiftWeek(-1)} aria-label="Previous week" className="secondary-btn !min-h-8 !px-3">‹</button><h2 className="min-w-40 text-center font-semibold text-white">{weekStart.toLocaleDateString(undefined,{month:"long",year:"numeric"})}</h2><button onClick={()=>shiftWeek(1)} aria-label="Next week" className="secondary-btn !min-h-8 !px-3">›</button><button onClick={()=>setAnchorDate(new Date())} className="secondary-btn !min-h-8">Today</button></div><div className="flex items-center gap-2"><span className="pill border-violet-300/20 text-violet-100">Week view</span><span className="pill text-[#4edea3]"><span className="status-dot"/>{loading?"Syncing":"Live schedule"}</span></div></div>
        <div className="overflow-x-auto"><div className="min-w-[720px]"><div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-white/[.055]"><div/>{days.map(date=><div key={date.toISOString()} className="border-l border-white/[.045] p-3 text-center text-xs font-semibold text-[#aeb8ca]">{date.toLocaleDateString(undefined,{weekday:"short",day:"numeric"})}</div>)}</div><div className="relative grid grid-cols-[64px_repeat(7,1fr)]">{slots.map((slot,row)=><div key={slot} className="contents"><div className="h-24 border-b border-white/[.045] p-2 text-right text-[10px] text-[#59667d]">{formatHour(slot)}</div>{days.map(day=>{const events=items.filter(item=>{const date=new Date(item.schedule_time);const nextSlot=slots[row+1]??24;return sameDay(date,day)&&date.getHours()>=slot&&date.getHours()<nextSlot;});return <div key={`${day.toISOString()}-${slot}`} className="relative h-24 border-b border-l border-white/[.045] bg-white/[.005]">{events.slice(0,1).map(event=><div key={event.schedule_id} className={`absolute inset-x-2 top-2 rounded-xl border p-2 ${event.platform.toLowerCase()==="facebook"?"border-emerald-300/15 bg-emerald-300/[.07]":"border-violet-300/20 bg-violet-500/14"}`}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className={`text-[9px] capitalize ${event.platform.toLowerCase()==="facebook"?"text-[#4edea3]":"text-violet-200"}`}>{event.platform}</div><div className="mt-1 truncate text-[11px] font-semibold text-white">{event.title}</div><div className="mt-1 text-[9px] text-[#8591aa]">{new Date(event.schedule_time).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}</div></div><div className="flex flex-col gap-1 text-right"><Link href={`/calendar?post=${event.post_id}`} className="text-[8px] font-semibold text-violet-200">Edit</Link><button onClick={()=>cancelSchedule(event)} className="text-[8px] font-semibold text-rose-200">Cancel</button></div></div></div>)}</div>})}</div>)}</div></div></div></Card>
        <Card className="h-fit overflow-hidden"><div className="border-b border-white/[.055] p-4"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Draft queue</h2><span className="pill">{drafts.length} drafts</span></div><p className="muted mt-1 text-xs">Choose a saved draft to schedule it.</p></div><div className="space-y-3 p-4">{drafts.length?drafts.map(draft=><div key={draft.id} className="rounded-xl border border-white/[.055] bg-white/[.018] p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold capitalize text-violet-300">{draft.platform}</span><span className="pill !py-1 text-[9px]">{draft.status}</span></div><div className="mt-2 text-sm font-semibold leading-5 text-white">{draft.title}</div><Link href={`/calendar?post=${encodeURIComponent(draft.id)}`} className="mt-3 inline-block text-xs font-semibold text-violet-300">Schedule ↗</Link></div>):<EmptyState title="No drafts ready" description="Create and save a draft in Content Studio before scheduling."/>}</div><div className="border-t border-white/[.055] p-4"><Link href="/content-studio" className="secondary-btn w-full">＋ New draft</Link></div></Card>
      </div>
    </AppShell>
  );
}
