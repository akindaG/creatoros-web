"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import { Card, EmptyState } from "@/components/ui";
import { SocialLogo } from "@/components/social-logo";
import { apiFetch } from "@/lib/api";

type CalendarItem = {
  schedule_id:string;
  post_id:string;
  schedule_group_id:string|null;
  title:string;
  platform:string;
  status:string;
  schedule_time:string;
};
type Post = {
  id:string;
  title:string;
  caption?:string|null;
  media_url?:string|null;
  platform:string;
  status:string;
  scheduled_time?:string|null;
};
type PublishingReadiness = {
  mode:string;
  live:boolean;
  scheduler:{running:boolean;mode:string};
  facebook_connected:boolean;
  facebook_page_name:string|null;
  instagram_connected:boolean;
  instagram_username?:string|null;
};
type AutoPlatform = "instagram" | "facebook";
type DisplayEvent = {
  key:string;
  items:CalendarItem[];
  primary:CalendarItem;
  groupId:string|null;
  platforms:string[];
  status:string;
};

const slots=Array.from({length:24},(_,hour)=>hour);

function startOfWeek(date:Date){
  const start=new Date(date);
  const weekday=start.getDay()||7;
  start.setDate(start.getDate()-weekday+1);
  start.setHours(0,0,0,0);
  return start;
}
function sameDay(left:Date,right:Date){
  return left.getFullYear()===right.getFullYear()
    &&left.getMonth()===right.getMonth()
    &&left.getDate()===right.getDate();
}
function formatHour(hour:number){return `${hour%12||12} ${hour>=12?"PM":"AM"}`;}
function platformName(value:string){
  return value==="facebook"?"Facebook Page":value==="facebook_profile"?"Facebook Profile":"Instagram";
}
function parseTargets(value:string):AutoPlatform[]{
  return value
    .split(",")
    .map(item=>item.trim())
    .filter((item):item is AutoPlatform=>item==="instagram"||item==="facebook")
    .filter((item,index,array)=>array.indexOf(item)===index);
}
function autoTargetLabel(value:AutoPlatform){return value==="facebook"?"Facebook Page":"Instagram";}
function statusLabel(value:string){
  return value.replaceAll("_"," ").replace(/\b\w/g,char=>char.toUpperCase());
}
function toLocalInputValue(value:string){
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return "";
  const local=new Date(date.getTime()-date.getTimezoneOffset()*60_000);
  return local.toISOString().slice(0,16);
}
function weekLabel(start:Date){
  const end=new Date(start);
  end.setDate(end.getDate()+6);
  const sameMonth=start.getMonth()===end.getMonth()&&start.getFullYear()===end.getFullYear();
  if(sameMonth){
    return `${start.toLocaleDateString(undefined,{month:"short",day:"numeric"})} – ${end.toLocaleDateString(undefined,{day:"numeric",year:"numeric"})}`;
  }
  return `${start.toLocaleDateString(undefined,{month:"short",day:"numeric"})} – ${end.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}`;
}
function groupEvents(events:CalendarItem[]):DisplayEvent[]{
  const grouped=new Map<string,CalendarItem[]>();
  for(const item of events){
    const key=item.schedule_group_id?`group:${item.schedule_group_id}`:`single:${item.schedule_id}`;
    const current=grouped.get(key)??[];
    current.push(item);
    grouped.set(key,current);
  }
  return Array.from(grouped.entries())
    .map(([key,groupItems])=>{
      const sorted=[...groupItems].sort((a,b)=>a.platform.localeCompare(b.platform));
      const statuses=new Set(sorted.map(item=>item.status));
      return {
        key,
        items:sorted,
        primary:sorted[0],
        groupId:sorted[0].schedule_group_id,
        platforms:sorted.map(item=>item.platform),
        status:statuses.size===1?sorted[0].status:"mixed",
      };
    })
    .sort((a,b)=>{
      const timeDiff=new Date(a.primary.schedule_time).getTime()-new Date(b.primary.schedule_time).getTime();
      return timeDiff||a.primary.title.localeCompare(b.primary.title);
    });
}
function eventTone(event:DisplayEvent){
  if(event.platforms.length>1)return "border-violet-300/20 bg-violet-500/12";
  if(event.primary.platform==="facebook")return "border-emerald-300/15 bg-emerald-300/[.07]";
  if(event.primary.platform==="facebook_profile")return "border-blue-300/15 bg-blue-300/[.07]";
  return "border-fuchsia-300/15 bg-fuchsia-500/[.08]";
}
function eventTextTone(event:DisplayEvent){
  if(event.platforms.length>1)return "text-violet-200";
  if(event.primary.platform==="facebook")return "text-[#4edea3]";
  if(event.primary.platform==="facebook_profile")return "text-blue-200";
  return "text-fuchsia-200";
}

export default function CalendarClient({
  initialDate,
  postId,
  initialTargets,
  groupId,
}:{
  initialDate:string;
  postId:string;
  initialTargets:string;
  groupId:string;
}){
  const router=useRouter();
  const [anchorDate,setAnchorDate]=useState(()=>new Date(initialDate));
  const [items,setItems]=useState<CalendarItem[]>([]);
  const [drafts,setDrafts]=useState<Post[]>([]);
  const [selectedPost,setSelectedPost]=useState<Post|null>(null);
  const [loading,setLoading]=useState(true);
  const [refreshKey,setRefreshKey]=useState(0);
  const [platform,setPlatform]=useState("instagram");
  const [scheduleTargets,setScheduleTargets]=useState<AutoPlatform[]>(()=>parseTargets(initialTargets));
  const [scheduleValue,setScheduleValue]=useState("");
  const [scheduling,setScheduling]=useState(false);
  const [scheduleError,setScheduleError]=useState("");
  const [scheduleMessage,setScheduleMessage]=useState("");
  const [pageError,setPageError]=useState("");
  const [publishingReadiness,setPublishingReadiness]=useState<PublishingReadiness|null>(null);

  const weekStart=useMemo(()=>startOfWeek(anchorDate),[anchorDate]);
  const days=useMemo(
    ()=>Array.from({length:7},(_,index)=>{
      const date=new Date(weekStart);
      date.setDate(date.getDate()+index);
      return date;
    }),
    [weekStart],
  );
  const weekEnd=useMemo(()=>{
    const date=new Date(weekStart);
    date.setDate(date.getDate()+7);
    return date;
  },[weekStart]);

  useEffect(()=>{
    const controller=new AbortController();
    const query=new URLSearchParams({start:weekStart.toISOString(),end:weekEnd.toISOString()});
    const requests:Promise<unknown>[]=[
      apiFetch<CalendarItem[]>(`/api/v1/calendar?${query}`,{signal:controller.signal})
        .then(data=>{setItems(data);setPageError("");}),
      apiFetch<Post[]>("/api/v1/posts?status=draft",{signal:controller.signal}).then(setDrafts),
      apiFetch<PublishingReadiness>("/api/v1/publishing/readiness",{signal:controller.signal})
        .then(setPublishingReadiness)
        .catch(()=>undefined),
    ];

    if(postId){
      requests.push(
        apiFetch<Post>(`/api/v1/posts/${encodeURIComponent(postId)}`,{signal:controller.signal})
          .then(post=>{
            setSelectedPost(post);
            setPlatform(post.platform);
            setScheduleValue(post.scheduled_time?toLocalInputValue(post.scheduled_time):"");
            const fromUrl=parseTargets(initialTargets);
            if(post.platform==="facebook_profile"){
              setScheduleTargets([]);
            }else{
              setScheduleTargets(fromUrl.length?fromUrl:[post.platform==="facebook"?"facebook":"instagram"]);
            }
          }),
      );
    }else{
      requests.push(Promise.resolve().then(()=>{
        setSelectedPost(null);
        setScheduleValue("");
      }));
    }

    Promise.all(requests)
      .catch(requestError=>{
        if(!(requestError instanceof DOMException&&requestError.name==="AbortError")){
          setPageError(requestError instanceof Error?requestError.message:"Could not load calendar");
        }
      })
      .finally(()=>setLoading(false));

    return()=>controller.abort();
  },[weekStart,weekEnd,refreshKey,postId,initialTargets]);

  useEffect(()=>{
    const timer=window.setInterval(()=>setRefreshKey(value=>value+1),30_000);
    return()=>window.clearInterval(timer);
  },[]);

  async function schedulePost(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!postId)return;

    const scheduleTime=new Date(scheduleValue);
    if(Number.isNaN(scheduleTime.getTime())||scheduleTime<=new Date()){
      setScheduleError("Choose a valid future date and time.");
      return;
    }

    const targets:AutoPlatform[]=scheduleTargets.length
      ?scheduleTargets
      :[platform==="facebook"?"facebook":"instagram"];

    setScheduling(true);
    setScheduleError("");
    setScheduleMessage("");

    try{
      if(platform==="facebook_profile"){
        await apiFetch(`/api/v1/posts/${encodeURIComponent(postId)}/schedule`,{
          method:"POST",
          body:JSON.stringify({schedule_time:scheduleTime.toISOString(),platform:"facebook_profile"}),
        });
        setScheduleMessage("Facebook profile reminder scheduled. It will become Ready to share at that time.");
      }else if(groupId){
        await apiFetch(`/api/v1/schedule-groups/${encodeURIComponent(groupId)}`,{
          method:"PUT",
          body:JSON.stringify({schedule_time:scheduleTime.toISOString()}),
        });
        setScheduleMessage(`Updated the shared schedule for ${targets.map(autoTargetLabel).join(" + ")}.`);
      }else if(selectedPost?.status==="scheduled"||targets.length===1){
        await apiFetch(`/api/v1/posts/${encodeURIComponent(postId)}/schedule`,{
          method:"POST",
          body:JSON.stringify({schedule_time:scheduleTime.toISOString(),platform:targets[0]}),
        });
        setScheduleMessage(`Post scheduled to ${autoTargetLabel(targets[0])} successfully.`);
      }else{
        await apiFetch(`/api/v1/posts/${encodeURIComponent(postId)}/schedule-multi`,{
          method:"POST",
          body:JSON.stringify({schedule_time:scheduleTime.toISOString(),platforms:targets}),
        });
        setScheduleMessage(`Scheduled once for ${targets.map(autoTargetLabel).join(" + ")} at the same time.`);
      }

      setRefreshKey(value=>value+1);
      window.setTimeout(()=>router.replace("/calendar"),850);
    }catch(requestError){
      setScheduleError(requestError instanceof Error?requestError.message:"Could not schedule post");
    }finally{
      setScheduling(false);
    }
  }

  function chooseScheduleMode(value:string){
    if(groupId)return;
    setPlatform(value);
    if(value==="facebook_profile"){
      setScheduleTargets([]);
      return;
    }
    const target:AutoPlatform=value==="facebook"?"facebook":"instagram";
    setScheduleTargets(current=>current.includes(target)?current:[...current,target]);
  }

  function toggleScheduleTarget(target:AutoPlatform){
    if(groupId)return;
    const connected=target==="instagram"
      ?publishingReadiness?.instagram_connected
      :publishingReadiness?.facebook_connected;
    if(connected===false){
      setScheduleError(`Connect ${autoTargetLabel(target)} first from Social Accounts.`);
      return;
    }
    setScheduleError("");
    setPlatform(target);
    setScheduleTargets(current=>{
      if(current.includes(target)){
        if(current.length===1)return current;
        return current.filter(item=>item!==target);
      }
      return [...current,target];
    });
  }

  async function cancelSchedule(event:DisplayEvent){
    const targetLabel=event.platforms.map(platformName).join(" + ");
    if(!window.confirm(`Cancel “${event.primary.title}” for ${targetLabel}?`))return;

    setPageError("");
    setScheduleMessage("");
    try{
      if(event.groupId&&event.items.length>1){
        await apiFetch(`/api/v1/schedule-groups/${encodeURIComponent(event.groupId)}`,{method:"DELETE"});
        setScheduleMessage(`Cancelled the shared schedule for ${event.items.length} platforms.`);
      }else{
        await apiFetch(`/api/v1/posts/${event.primary.post_id}/schedule`,{method:"DELETE"});
        setScheduleMessage("Schedule cancelled.");
      }
      setRefreshKey(value=>value+1);
    }catch(requestError){
      setPageError(requestError instanceof Error?requestError.message:"Could not cancel schedule");
    }
  }

  async function shareProfilePost(postId:string){
    const facebookWindow=window.open("about:blank","creatoros-facebook-profile");
    if(facebookWindow)facebookWindow.opener=null;
    setPageError("");
    setScheduleMessage("");
    try{
      const post=await apiFetch<Post>(`/api/v1/posts/${encodeURIComponent(postId)}`);
      const shareText=(post.caption||post.title).trim();
      let copied=false;
      try{await navigator.clipboard.writeText(shareText);copied=true;}catch{}
      let opened=facebookWindow;
      if(facebookWindow)facebookWindow.location.href="https://www.facebook.com/";
      else opened=window.open("https://www.facebook.com/","_blank","noopener,noreferrer");

      if(!opened){
        setPageError(
          `Your browser blocked the Facebook window. ${copied
            ?"The caption is copied, so open Facebook manually and paste it."
            :"Open Facebook manually and copy the caption from CreatorOS."}`,
        );
      }else{
        setScheduleMessage(
          `Facebook opened for your personal profile. ${copied
            ?"The caption is copied; paste it into Facebook."
            :"Copy the caption from CreatorOS and paste it into Facebook."}${post.media_url
            ?" Add the saved media manually before posting."
            :""}`,
        );
      }
    }catch(requestError){
      if(facebookWindow&&!facebookWindow.closed)facebookWindow.close();
      setPageError(requestError instanceof Error?requestError.message:"Could not prepare the Facebook profile share");
    }
  }

  async function markProfileShared(item:CalendarItem){
    if(!window.confirm(`Mark “${item.title}” as shared on your Facebook profile?`))return;
    setPageError("");
    try{
      await apiFetch(`/api/v1/publishing/posts/${item.post_id}/mark-shared`,{method:"POST"});
      setScheduleMessage("Facebook profile post marked as shared.");
      setRefreshKey(value=>value+1);
    }catch(requestError){
      setPageError(requestError instanceof Error?requestError.message:"Could not mark the profile post as shared");
    }
  }

  function shiftWeek(amount:number){
    setLoading(true);
    setAnchorDate(current=>{
      const next=new Date(current);
      next.setDate(next.getDate()+amount*7);
      return next;
    });
  }

  return (
    <AppShell
      title="Content Calendar"
      subtitle="Plan and manage your publishing schedule"
      actions={<Link href="/content-studio" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</Link>}
    >
      {postId&&(
        <Card className="mb-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="kicker">
                {groupId?"Reschedule shared post":selectedPost?.status==="scheduled"?"Reschedule post":"Schedule draft"}
              </div>
              <h1 className="mt-2 font-semibold text-white">{selectedPost?.title??"Loading post..."}</h1>
              <p className="muted mt-1 text-xs">
                {groupId
                  ?"This is one multi-platform schedule. Changing the time updates every channel in the group."
                  :"Choose one future time. Instagram and Facebook Page can be scheduled together; Facebook Profile remains a manual-share reminder."}
              </p>
            </div>
            <Link href="/calendar" className="text-xs font-semibold text-violet-300">Cancel</Link>
          </div>

          <form onSubmit={schedulePost} className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.25fr_auto]">
            <label>
              <span className="label mb-2 block">Publish date and time</span>
              <input
                name="schedule_time"
                type="datetime-local"
                className="field"
                value={scheduleValue}
                onChange={event=>setScheduleValue(event.target.value)}
                required
              />
            </label>

            <div>
              <span className="label mb-2 block">Publish channels</span>
              {platform==="facebook_profile"?(
                <div className="rounded-xl border border-blue-300/15 bg-blue-300/[.04] p-3">
                  {!groupId&&(
                    <button
                      type="button"
                      onClick={()=>chooseScheduleMode("instagram")}
                      className="text-[10px] font-semibold text-violet-200"
                    >
                      ← Back to automatic channels
                    </button>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-blue-100">
                    <SocialLogo platform="facebook_profile" className="h-5 w-5 rounded-md"/>
                    Facebook Profile · manual share
                  </div>
                </div>
              ):(
                <div className="grid grid-cols-2 gap-2">
                  {(["instagram","facebook"] as AutoPlatform[]).map(target=>{
                    const connected=target==="instagram"
                      ?publishingReadiness?.instagram_connected
                      :publishingReadiness?.facebook_connected;
                    const selected=scheduleTargets.includes(target);
                    const locked=Boolean(groupId)||(selectedPost?.status==="scheduled"&&!groupId&&platform!==target);
                    return (
                      <button
                        key={target}
                        type="button"
                        disabled={connected===false||locked}
                        onClick={()=>toggleScheduleTarget(target)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[10px] font-semibold ${selected
                          ?"border-violet-300/30 bg-violet-500/10 text-violet-100"
                          :"border-white/[.06] text-[#8290a8]"} ${connected===false||locked?"cursor-not-allowed opacity-50":""}`}
                      >
                        <SocialLogo platform={target} className="h-5 w-5 rounded-md"/>
                        <span>
                          {autoTargetLabel(target)}
                          <span className="mt-0.5 block text-[8px] font-normal text-[#66738b]">
                            {connected===false?"Not connected":selected?"Selected":locked?"Locked":"Select"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {!groupId&&platform!=="facebook_profile"&&(
                <button
                  type="button"
                  onClick={()=>chooseScheduleMode("facebook_profile")}
                  className="mt-2 text-[9px] font-semibold text-blue-200"
                >
                  Use Facebook Profile manual share instead
                </button>
              )}
              {groupId&&(
                <div className="mt-2 text-[9px] leading-4 text-[#77839a]">
                  Channel selection is locked for an existing multi-platform schedule. Cancel it first if you need a different channel mix.
                </div>
              )}
            </div>

            <button className="primary-btn self-end" disabled={scheduling||!selectedPost||!scheduleValue}>
              {scheduling
                ?"Scheduling..."
                :groupId
                  ?`Update ${scheduleTargets.length||1} platforms`
                  :selectedPost?.status==="scheduled"
                    ?"Update schedule"
                    :platform==="facebook_profile"
                      ?"Schedule reminder"
                      :scheduleTargets.length>1
                        ?`Schedule ${scheduleTargets.length} platforms`
                        :"Schedule"}
            </button>
          </form>

          {platform==="facebook_profile"&&(
            <div className="mt-3 rounded-xl border border-blue-300/10 bg-blue-300/[.04] p-3 text-[10px] leading-5 text-blue-100">
              At the scheduled time CreatorOS changes this item to <strong>Ready to share</strong>. Open Calendar, click <strong>Share</strong>, then mark it shared.
            </div>
          )}
          {scheduleError&&(
            <div role="alert" className="mt-3 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">
              {scheduleError}
            </div>
          )}
          {scheduleMessage&&(
            <div role="status" className="mt-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[.06] p-3 text-xs text-emerald-100">
              {scheduleMessage}
            </div>
          )}
        </Card>
      )}

      {pageError&&(
        <div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">
          {pageError}
        </div>
      )}
      {!postId&&scheduleMessage&&(
        <div role="status" className="mb-4 rounded-xl border border-emerald-300/10 bg-emerald-300/[.06] p-3 text-xs text-emerald-100">
          {scheduleMessage}
        </div>
      )}
      {publishingReadiness&&!publishingReadiness.live&&(
        <div role="alert" className="mb-4 rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-3 text-xs leading-5 text-amber-100">
          <strong>Automatic publishing is not live.</strong> Instagram and Facebook Page posts will not reach Meta while the backend is in <code>{publishingReadiness.mode}</code> mode. Facebook Profile reminders still work.
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_290px]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.055] p-4">
            <div className="flex items-center gap-2">
              <button onClick={()=>shiftWeek(-1)} aria-label="Previous week" className="secondary-btn !min-h-8 !px-3">‹</button>
              <h2 className="min-w-48 text-center font-semibold text-white">{weekLabel(weekStart)}</h2>
              <button onClick={()=>shiftWeek(1)} aria-label="Next week" className="secondary-btn !min-h-8 !px-3">›</button>
              <button onClick={()=>{setLoading(true);setAnchorDate(new Date());}} className="secondary-btn !min-h-8">Today</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="pill border-violet-300/20 text-violet-100">24-hour view</span>
              <span className="pill text-[#4edea3]"><span className="status-dot"/>{loading?"Syncing":"Live schedule"}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-white/[.055]">
                <div/>
                {days.map(date=>{
                  const isToday=sameDay(date,new Date());
                  return (
                    <div
                      key={date.toISOString()}
                      className={`border-l border-white/[.045] p-3 text-center text-xs font-semibold ${isToday?"bg-violet-500/[.06] text-violet-100":"text-[#aeb8ca]"}`}
                    >
                      {date.toLocaleDateString(undefined,{weekday:"short",day:"numeric"})}
                    </div>
                  );
                })}
              </div>

              <div className="max-h-[68vh] overflow-y-auto overscroll-contain">
                <div className="relative grid grid-cols-[64px_repeat(7,1fr)]">
                  {slots.map(slot=>(
                    <div key={slot} className="contents">
                      <div className="h-28 border-b border-white/[.045] p-2 text-right text-[10px] text-[#59667d]">
                        {formatHour(slot)}
                      </div>
                      {days.map(day=>{
                        const cellItems=items.filter(item=>{
                          const date=new Date(item.schedule_time);
                          return sameDay(date,day)&&date.getHours()===slot;
                        });
                        const events=groupEvents(cellItems);
                        return (
                          <div
                            key={`${day.toISOString()}-${slot}`}
                            className="h-28 overflow-y-auto border-b border-l border-white/[.045] bg-white/[.005] p-1.5"
                          >
                            <div className="space-y-1.5">
                              {events.map(event=>{
                                const time=new Date(event.primary.schedule_time).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});
                                const targetValues=event.platforms.filter((value):value is AutoPlatform=>value==="instagram"||value==="facebook");
                                const editable=event.items.every(item=>item.status==="scheduled");
                                const editHref=event.groupId
                                  ?`/calendar?post=${encodeURIComponent(event.primary.post_id)}&targets=${encodeURIComponent(targetValues.join(","))}&group=${encodeURIComponent(event.groupId)}`
                                  :`/calendar?post=${encodeURIComponent(event.primary.post_id)}`;
                                return (
                                  <div
                                    key={event.key}
                                    className={`rounded-lg border p-2 ${eventTone(event)}`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0">
                                        <div className={`flex items-center gap-1.5 text-[9px] ${eventTextTone(event)}`}>
                                          <span className="flex -space-x-1">
                                            {event.platforms.map(value=>(
                                              <SocialLogo
                                                key={value}
                                                platform={value}
                                                className="h-4 w-4 rounded-[5px] ring-1 ring-[#0a1020]"
                                              />
                                            ))}
                                          </span>
                                          <span className="truncate">{event.platforms.map(platformName).join(" + ")}</span>
                                        </div>
                                        <div className="mt-1 truncate text-[11px] font-semibold text-white">{event.primary.title}</div>
                                        <div className="mt-1 text-[9px] text-[#8591aa]">
                                          {time} · {statusLabel(event.status)}
                                        </div>
                                      </div>

                                      <div className="flex shrink-0 flex-col gap-1 text-right">
                                        {event.primary.platform==="facebook_profile"&&event.primary.status!=="shared"?(
                                          <>
                                            <button onClick={()=>shareProfilePost(event.primary.post_id)} className="text-[8px] font-semibold text-blue-200">Share</button>
                                            <button onClick={()=>markProfileShared(event.primary)} className="text-[8px] font-semibold text-emerald-200">Done</button>
                                          </>
                                        ):editable?(
                                          <>
                                            <Link href={editHref} className="text-[8px] font-semibold text-violet-200">Edit</Link>
                                            <button onClick={()=>cancelSchedule(event)} className="text-[8px] font-semibold text-rose-200">Cancel</button>
                                          </>
                                        ):null}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-fit overflow-hidden">
          <div className="border-b border-white/[.055] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Draft queue</h2>
              <span className="pill">{drafts.length} drafts</span>
            </div>
            <p className="muted mt-1 text-xs">Choose a saved draft to schedule it.</p>
          </div>
          <div className="max-h-[58vh] space-y-3 overflow-y-auto p-4">
            {drafts.length?drafts.map(draft=>(
              <div key={draft.id} className="rounded-xl border border-white/[.055] bg-white/[.018] p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-300">
                    <SocialLogo platform={draft.platform} className="h-4 w-4 rounded-[5px]" />
                    {platformName(draft.platform)}
                  </span>
                  <span className="pill !py-1 text-[9px]">{statusLabel(draft.status)}</span>
                </div>
                <div className="mt-2 text-sm font-semibold leading-5 text-white">{draft.title}</div>
                <Link
                  href={`/calendar?post=${encodeURIComponent(draft.id)}&targets=${encodeURIComponent(draft.platform==="facebook"?"facebook":draft.platform==="instagram"?"instagram":"")}`}
                  className="mt-3 inline-block text-xs font-semibold text-violet-300"
                >
                  Schedule ↗
                </Link>
              </div>
            )):(
              <EmptyState
                title="No drafts ready"
                description="Create and save a draft in Content Studio before scheduling."
              />
            )}
          </div>
          <div className="border-t border-white/[.055] p-4">
            <Link href="/content-studio" className="secondary-btn w-full">＋ New draft</Link>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
