"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { SocialLogo } from "@/components/social-logo";
import { apiFetch } from "@/lib/api";

type Platform="Instagram"|"Facebook";
type Account={id:string;platform:string;platform_account_id?:string|null;account_name:string;username?:string|null;status:string;created_at?:string};
type Overview={platform_reach:Record<string,number>};
type PublishingReadiness={mode:string;live:boolean;facebook_connected:boolean;facebook_page_id:string|null;facebook_page_name:string|null;instagram_connected?:boolean;instagram_account_id?:string|null;instagram_username?:string|null;instagram_token_expires_at?:string|null;scheduler:{running:boolean;mode:string};target_type:string};
const short=(value:number)=>value>=1_000_000?`${(value/1_000_000).toFixed(1)}M`:value>=1_000?`${(value/1_000).toFixed(1)}K`:String(value);

export default function SocialAccountsPage(){
  const [accounts,setAccounts]=useState<Account[]>([]);
  const [platformReach,setPlatformReach]=useState<Record<string,number>>({instagram:0,facebook:0});
  const [publishingReadiness,setPublishingReadiness]=useState<PublishingReadiness|null>(null);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const [pending,setPending]=useState<Platform|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{const controller=new AbortController();Promise.all([apiFetch<Account[]>("/api/v1/social-accounts",{signal:controller.signal}),apiFetch<Overview>("/api/v1/analytics/overview",{signal:controller.signal}),apiFetch<PublishingReadiness>("/api/v1/publishing/readiness",{signal:controller.signal}).catch(()=>null)]).then(([connected,analytics,readiness])=>{setAccounts(connected);setPlatformReach(analytics.platform_reach);setPublishingReadiness(readiness);}).catch(requestError=>{if(!(requestError instanceof DOMException&&requestError.name==="AbortError"))setError(requestError instanceof Error?requestError.message:"Could not load social accounts");}).finally(()=>setLoading(false));return()=>controller.abort();},[]);
  useEffect(()=>{if(typeof window==="undefined")return;const params=new URLSearchParams(window.location.search);const facebook=params.get("facebook");const instagram=params.get("instagram");if(!facebook&&!instagram)return;const reason=params.get("reason");window.history.replaceState({},"",window.location.pathname);const timer=window.setTimeout(()=>{if(instagram==="connected")setMessage("Instagram professional account connected successfully. CreatorOS can now use it for publishing, scheduling and approved insights.");if(instagram==="error")setError(reason||"Instagram connection was cancelled or failed.");if(facebook==="connected")setMessage("Facebook Page connected successfully.");if(facebook==="error")setError(reason||"Facebook connection was cancelled or failed.");},0);return()=>window.clearTimeout(timer);},[]);
  function accountFor(platform:Platform){return accounts.find(account=>account.platform.toLowerCase()===platform.toLowerCase());}

  async function beginConnect(platform:Platform){
    setPending(platform);setError("");setMessage("");
    try{
      const provider=platform.toLowerCase();
      const result=await apiFetch<{authorization_url:string}>(`/api/v1/social-accounts/${provider}/connect`);
      if(!result.authorization_url)throw new Error(`CreatorOS did not receive a ${platform} authorization URL.`);
      window.location.assign(result.authorization_url);
    }catch(requestError){
      setError(requestError instanceof Error?requestError.message:`Could not start ${platform} connection`);
      setPending(null);
    }
  }

  async function disconnect(platform:Platform){
    const existing=accountFor(platform);if(!existing)return;if(!window.confirm(`Disconnect ${platform} from CreatorOS?`))return;
    setPending(platform);setError("");setMessage("");
    try{await apiFetch(`/api/v1/social-accounts/${existing.id}`,{method:"DELETE"});setAccounts(current=>current.filter(item=>item.id!==existing.id));setMessage(`${platform} disconnected successfully.`);}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not disconnect account");}
    finally{setPending(null);}
  }

  const firstDisconnected=(["Instagram","Facebook"] as Platform[]).find(platform=>!accountFor(platform));
  const totalReach=(platformReach.instagram??0)+(platformReach.facebook??0);
  const connectionScore=Math.round(accounts.length/2*100);

  return (
    <AppShell title="Connected Accounts" subtitle="Manage supported social integrations" actions={<button onClick={()=>firstDisconnected&&beginConnect(firstDisconnected)} disabled={!firstDisconnected||pending!==null} className="primary-btn !min-h-9 !px-4 !py-2 text-xs">{firstDisconnected?`＋ Connect ${firstDisconnected}`:"All connected"}</button>}>
      <section className="relative mb-5 overflow-hidden rounded-[26px] border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] via-[#071025] to-blue-500/[.025] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-500/[.09] blur-[80px]" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl"><div className="flex flex-wrap items-center gap-2"><div className="kicker">MVP integrations</div><span className="pill text-[#4edea3]"><span className="status-dot"/>{loading?"Syncing":"API connected"}</span></div><h1 className="mt-3 text-3xl font-semibold tracking-[-.055em] text-white sm:text-4xl">One place for your Facebook and Instagram connections.</h1><p className="muted mt-3 text-sm leading-6">CreatorOS uses secure OAuth for Facebook Pages and Instagram professional accounts. Instagram Business and Creator accounts can connect directly with Instagram without manually pasting access tokens.</p></div>
          <div className="grid min-w-[320px] grid-cols-3 gap-2"><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Connected</div><div className="mt-2 text-lg font-semibold text-white">{accounts.length} / 2</div></div><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Tracked reach</div><div className="mt-2 text-lg font-semibold text-white">{short(totalReach)}</div></div><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Ready</div><div className="mt-2 text-lg font-semibold text-[#4edea3]">{connectionScore}%</div></div></div>
        </div>
      </section>

      {(error||message)&&<div role={error?"alert":"status"} className={`mb-4 rounded-xl border p-3 text-xs ${error?"border-rose-300/10 bg-rose-400/[.06] text-rose-200":"border-emerald-300/10 bg-emerald-300/[.06] text-emerald-100"}`}>{error||message}</div>}
      {publishingReadiness&&!publishingReadiness.live&&<div role="alert" className="mb-4 rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-3 text-xs leading-5 text-amber-100"><strong>Live publishing is OFF.</strong> CreatorOS is currently in <code>{publishingReadiness.mode}</code> mode, so posts can appear published inside CreatorOS without being sent to Meta. Set <code>SOCIAL_PUBLISH_MODE=live</code> on the Railway backend and redeploy.</div>}

      <div className="grid gap-4 md:grid-cols-2">{(["Instagram","Facebook"] as Platform[]).map((platform,index)=>{const account=accountFor(platform);const connected=Boolean(account);const reach=platformReach[platform.toLowerCase()]??0;return <Card key={platform} className="panel-hover neon-border relative overflow-hidden p-6"><div className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-[65px] ${index===0?"bg-fuchsia-500/[.07]":"bg-blue-500/[.07]"}`}/><div className="relative flex items-start justify-between gap-4"><div className="flex items-center gap-4"><SocialLogo platform={platform} className="h-13 w-13 rounded-2xl ring-1 ring-white/10" /><div><div className="text-[9px] font-bold uppercase tracking-[.14em] text-[#69768d]">Social channel</div><h2 className="mt-1 text-xl font-semibold tracking-[-.035em] text-white">{platform}</h2><p className="muted mt-1 text-xs">{account?.username?`@${account.username.replace(/^@/,"")}`:account?.account_name??"Not connected"}</p></div></div><span className={`pill ${connected?"border-emerald-300/15 bg-emerald-300/[.035] text-[#4edea3]":"text-[#7b879e]"}`}><span className={connected?"status-dot":"h-2 w-2 rounded-full bg-[#566277]"}/>{connected?"Connected":"Disconnected"}</span></div><div className="relative mt-7 grid grid-cols-2 gap-3 border-y border-white/[.055] py-5"><div><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Tracked reach</div><div className="mt-2 text-2xl font-semibold tracking-[-.04em] text-white">{connected?short(reach):"—"}</div><div className="muted mt-1 text-[10px]">Stored analytics</div></div><div><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">Account identifier</div><div className="mt-2 truncate text-sm font-semibold text-white">{account?.platform_account_id??account?.account_name??"—"}</div><div className="muted mt-1 text-[10px]">{platform==="Instagram"?"Instagram professional account ID":"Meta Page ID"}</div></div></div><div className="relative mt-5 flex items-center justify-between gap-3"><div><div className="text-xs font-semibold text-white">{connected?"Ready for CreatorOS workflows":"Connection required"}</div><p className="mt-1 text-[10px] text-[#6f7c93]">{connected?"Scheduling and publishing can use this channel.":platform==="Instagram"?"Connect an Instagram Business or Creator account securely with Instagram OAuth.":"Connect this platform to enable scheduling."}</p></div><button onClick={()=>connected?disconnect(platform):beginConnect(platform)} disabled={pending!==null} className={connected?"secondary-btn":"primary-btn"}>{pending===platform?"Opening...":connected?"Disconnect":platform==="Instagram"?"Connect with Instagram":"Connect"}</button></div></Card>})}<Card className="panel-hover neon-border relative overflow-hidden p-6"><div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/[.07] blur-[65px]"/><div className="relative flex items-start justify-between gap-4"><div className="flex items-center gap-4"><SocialLogo platform="facebook_profile" className="h-13 w-13 rounded-2xl ring-1 ring-white/10" /><div><div className="text-[9px] font-bold uppercase tracking-[.14em] text-[#69768d]">Assisted channel</div><h2 className="mt-1 text-xl font-semibold tracking-[-.035em] text-white">Facebook Profile</h2><p className="muted mt-1 text-xs">Manual share workflow · no account token required</p></div></div><span className="pill border-blue-300/15 bg-blue-300/[.035] text-blue-200">Available</span></div><div className="relative mt-7 border-y border-white/[.055] py-5"><div className="text-xs font-semibold text-white">Personal-profile sharing without unsupported automation</div><p className="muted mt-2 text-[10px] leading-5">CreatorOS can prepare the caption, keep the media, schedule a reminder, copy the caption, and open Facebook. You complete the final personal-timeline post yourself.</p></div><div className="relative mt-5 flex items-center justify-between gap-3"><div><div className="text-xs font-semibold text-white">No Meta Page connection needed</div><p className="mt-1 text-[10px] text-[#6f7c93]">Choose Facebook Profile in Content Studio or Calendar.</p></div><Link href="/content-studio" className="secondary-btn">Create profile post</Link></div></Card></div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="p-6"><div className="flex items-center justify-between"><div><div className="kicker">Integration health</div><h2 className="mt-1 font-semibold text-white">Connection readiness</h2></div><span className="pill">V1 · 2 platforms</span></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[["API status","Operational","The social-account API is reachable."],["Connected accounts",`${accounts.length} / 2`,"Facebook and Instagram only in V1."],["Publishing",publishingReadiness?.live?"LIVE":publishingReadiness?.mode?.toUpperCase()??"Checking","Live mode is required for real Meta publishing."],["Scheduler",publishingReadiness?.scheduler.running?"Running":"Checking","Exact-time worker must be running for scheduled posts."]].map(([label,value,description],index)=><div key={label} className="rounded-xl border border-white/[.05] bg-white/[.015] p-4"><div className="text-[10px] text-[#718099]">{label}</div><div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white"><span className={`h-2 w-2 rounded-full ${index===1?"bg-violet-300":index>=2&&value!=="LIVE"&&value!=="Running"?"bg-amber-300":"bg-[#4edea3]"}`}/>{value}</div><p className="muted mt-2 text-[10px] leading-4">{description}</p></div>)}</div></Card>
        <Card className="p-6"><div className="kicker">Facebook publishing modes</div><h2 className="mt-2 font-semibold text-white">Page automation + profile assist</h2><p className="muted mt-3 text-xs leading-5"><strong>Facebook Page:</strong> CreatorOS can publish automatically through Meta when live mode is enabled. <strong>Facebook Profile:</strong> CreatorOS prepares and schedules the post, then opens Facebook for the user-confirmed final share.</p><div className="mt-5 rounded-xl border border-blue-300/10 bg-blue-300/[.035] p-3 text-[10px] leading-5 text-blue-100">Automatic Page target: <strong>{publishingReadiness?.facebook_page_name??accountFor("Facebook")?.account_name??"No Facebook Page connected"}</strong>{publishingReadiness?.facebook_page_id?` · ${publishingReadiness.facebook_page_id}`:""}</div></Card>
      </div>
    </AppShell>
  );
}
