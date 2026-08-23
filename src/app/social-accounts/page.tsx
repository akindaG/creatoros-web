"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type Platform="Instagram"|"Facebook";
type Account={id:string;platform:string;account_name:string;username?:string|null;status:string;created_at?:string};
type Overview={platform_reach:Record<string,number>};
const short=(value:number)=>value>=1_000_000?`${(value/1_000_000).toFixed(1)}M`:value>=1_000?`${(value/1_000).toFixed(1)}K`:String(value);

export default function SocialAccountsPage(){
  const [accounts,setAccounts]=useState<Account[]>([]);
  const [platformReach,setPlatformReach]=useState<Record<string,number>>({instagram:0,facebook:0});
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const [pending,setPending]=useState<Platform|null>(null);
  const [connectPlatform,setConnectPlatform]=useState<Platform|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{const controller=new AbortController();Promise.all([apiFetch<Account[]>("/api/v1/social-accounts",{signal:controller.signal}),apiFetch<Overview>("/api/v1/analytics/overview",{signal:controller.signal})]).then(([connected,analytics])=>{setAccounts(connected);setPlatformReach(analytics.platform_reach);}).catch(requestError=>{if(!(requestError instanceof DOMException&&requestError.name==="AbortError"))setError(requestError instanceof Error?requestError.message:"Could not load social accounts");}).finally(()=>setLoading(false));return()=>controller.abort();},[]);
  function accountFor(platform:Platform){return accounts.find(account=>account.platform.toLowerCase()===platform.toLowerCase());}

  async function disconnect(platform:Platform){
    const existing=accountFor(platform);if(!existing)return;if(!window.confirm(`Disconnect ${platform} from CreatorOS?`))return;
    setPending(platform);setError("");setMessage("");
    try{await apiFetch(`/api/v1/social-accounts/${existing.id}`,{method:"DELETE"});setAccounts(current=>current.filter(item=>item.id!==existing.id));setMessage(`${platform} disconnected successfully.`);}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not disconnect account");}
    finally{setPending(null);}
  }

  async function connect(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(!connectPlatform)return;
    const form=new FormData(event.currentTarget);const accountName=String(form.get("account_name")??"").trim();const username=String(form.get("username")??"").trim();const accessToken=String(form.get("access_token")??"").trim();
    setPending(connectPlatform);setError("");setMessage("");
    try{const created=await apiFetch<Account>("/api/v1/social-accounts",{method:"POST",body:JSON.stringify({platform:connectPlatform.toLowerCase(),account_name:accountName,username:username||null,access_token:accessToken})});setAccounts(current=>[...current,created]);setMessage(`${connectPlatform} connected. The credential is encrypted by the CreatorOS backend before database storage.`);setConnectPlatform(null);}
    catch(requestError){setError(requestError instanceof Error?requestError.message:"Could not connect account");}
    finally{setPending(null);}
  }

  const firstDisconnected=(["Instagram","Facebook"] as Platform[]).find(platform=>!accountFor(platform));
  return (
    <AppShell title="Connected Accounts" subtitle="Manage supported social integrations" actions={<button onClick={()=>firstDisconnected&&setConnectPlatform(firstDisconnected)} disabled={!firstDisconnected||pending!==null} className="primary-btn !min-h-9 !px-4 !py-2 text-xs">{firstDisconnected?`＋ Connect ${firstDisconnected}`:"All connected"}</button>}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><div className="kicker">MVP integrations</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Social accounts</h1><p className="muted mt-2 max-w-2xl text-sm">CreatorOS AI Version 1.0 supports Facebook and Instagram. Credentials sent here are protected by the backend before they are persisted.</p></div><span className="pill text-[#4edea3]"><span className="status-dot"/>{loading?"Syncing":"API connected"}</span></div>
      {(error||message)&&<div role={error?"alert":"status"} className={`mb-4 rounded-xl border p-3 text-xs ${error?"border-rose-300/10 bg-rose-400/[.06] text-rose-200":"border-emerald-300/10 bg-emerald-300/[.06] text-emerald-100"}`}>{error||message}</div>}
      <div className="grid gap-4 md:grid-cols-2">{(["Instagram","Facebook"] as Platform[]).map((platform,index)=>{const account=accountFor(platform);const connected=Boolean(account);const reach=platformReach[platform.toLowerCase()]??0;return <Card key={platform} className="neon-border overflow-hidden p-6"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4"><div className={`grid h-12 w-12 place-items-center rounded-2xl border ${index===0?"border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/20 to-amber-300/10":"border-blue-300/15 bg-blue-500/10"} text-lg font-bold text-white`}>{platform[0]}</div><div><h2 className="text-lg font-semibold text-white">{platform}</h2><p className="muted mt-1 text-xs">{account?.username?`@${account.username.replace(/^@/,"")}`:account?.account_name??"Not connected"}</p></div></div><span className={`pill ${connected?"border-emerald-300/15 text-[#4edea3]":"text-[#7b879e]"}`}><span className={connected?"status-dot":"h-2 w-2 rounded-full bg-[#566277]"}/>{connected?"Connected":"Disconnected"}</span></div><div className="mt-7 grid grid-cols-2 gap-3 border-y border-white/[.055] py-5"><div><div className="text-[10px] uppercase tracking-[.12em] text-[#657189]">Tracked reach</div><div className="mt-1 text-xl font-semibold text-white">{connected?short(reach):"—"}</div></div><div><div className="text-[10px] uppercase tracking-[.12em] text-[#657189]">Account ID</div><div className="mt-1 truncate text-sm font-semibold text-white">{account?.account_name??"—"}</div></div></div><div className="mt-5 flex items-center justify-between gap-3"><p className="text-xs text-[#728098]">{connected?"Ready for scheduling and publishing":"Connect to enable this platform"}</p><button onClick={()=>connected?disconnect(platform):setConnectPlatform(platform)} disabled={pending!==null} className={connected?"secondary-btn":"primary-btn"}>{pending===platform?"Working...":connected?"Disconnect":"Connect"}</button></div></Card>})}</div>
      <Card className="mt-4 p-6"><div className="kicker">Integration health</div><div className="mt-4 grid gap-4 md:grid-cols-3">{[["API status","Operational"],["Connected accounts",`${accounts.length} / 2`],["Credential storage","Encrypted at rest"]].map(([label,value],index)=><div key={label} className="rounded-xl border border-white/[.05] bg-white/[.015] p-4"><div className="text-xs text-[#718099]">{label}</div><div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white"><span className={`h-2 w-2 rounded-full ${index===1?"bg-violet-300":"bg-[#4edea3]"}`}/>{value}</div></div>)}</div></Card>

      {connectPlatform&&<div className="fixed inset-0 z-[80] grid place-items-center bg-[#020617]/80 p-4 backdrop-blur-md" onMouseDown={event=>{if(event.target===event.currentTarget)setConnectPlatform(null);}}><Card className="neon-border w-full max-w-lg p-6 sm:p-7"><div className="flex items-start justify-between gap-4"><div><div className="kicker">Secure connection</div><h2 className="mt-2 text-xl font-semibold text-white">Connect {connectPlatform}</h2><p className="muted mt-2 text-xs leading-5">For the MVP, enter the Meta account/page identifier and an approved access token. CreatorOS encrypts the token before database storage.</p></div><button onClick={()=>setConnectPlatform(null)} className="secondary-btn !h-9 !min-h-9 !w-9 !p-0" aria-label="Close">×</button></div><form onSubmit={connect} className="mt-6 space-y-4"><label className="block"><span className="label mb-2 block">{connectPlatform==="Facebook"?"Facebook Page ID":"Instagram Business Account ID"}</span><input name="account_name" className="field" placeholder="Meta account identifier" required maxLength={255}/></label><label className="block"><span className="label mb-2 block">Username or page name</span><input name="username" className="field" placeholder="creatoros" maxLength={255}/></label><label className="block"><span className="label mb-2 block">Access token</span><input name="access_token" type="password" autoComplete="off" className="field" placeholder="Paste approved Meta access token" required/><span className="muted mt-2 block text-[10px] leading-4">Use simulation mode for the university demo if live Meta API approval is unavailable.</span></label><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={()=>setConnectPlatform(null)} className="secondary-btn">Cancel</button><button className="primary-btn" disabled={pending!==null}>{pending===connectPlatform?"Connecting...":`Connect ${connectPlatform}`}</button></div></form></Card></div>}
    </AppShell>
  );
}
