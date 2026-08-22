"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type Platform = "Instagram" | "Facebook";
type Account = { id:string; platform:string; account_name:string; status:string };

export default function SocialAccountsPage() {
  const [accounts,setAccounts] = useState<Account[]>([]);
  const [error,setError] = useState("");
  useEffect(()=>{apiFetch<Account[]>("/api/v1/social-accounts").then(setAccounts).catch(()=>{});},[]);
  function isConnected(platform:Platform){return accounts.some(a=>a.platform.toLowerCase()===platform.toLowerCase());}
  async function toggle(platform: Platform) {
    setError("");
    try {
      const existing=accounts.find(a=>a.platform.toLowerCase()===platform.toLowerCase());
      if(existing){await apiFetch(`/api/v1/social-accounts/${existing.id}`,{method:"DELETE"});setAccounts(a=>a.filter(x=>x.id!==existing.id));return;}
      const accountName=window.prompt(`${platform} account or page name`); if(!accountName)return;
      const accessToken=window.prompt(`Paste the ${platform} access token for the MVP connection`); if(!accessToken)return;
      const created=await apiFetch<Account>("/api/v1/social-accounts",{method:"POST",body:JSON.stringify({platform:platform.toLowerCase(),account_name:accountName,username:accountName,access_token:accessToken})});
      setAccounts(a=>[...a,created]);
    } catch(e){setError(e instanceof Error?e.message:"Could not update social connection");}
  }
  return (
    <AppShell title="Connected Accounts" subtitle="Manage supported social integrations" actions={<button className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Connect account</button>}>
      <div className="mb-6"><div className="kicker">MVP integrations</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Social accounts</h1><p className="muted mt-2 max-w-2xl text-sm">CreatorOS AI Version 1.0 is deliberately focused on Facebook and Instagram. Connect only the channels needed for the final MVP.</p></div>
      {error&&<div className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">{(["Instagram","Facebook"] as Platform[]).map((platform,i)=>{const connected=isConnected(platform);return <Card key={platform} className="neon-border overflow-hidden p-6"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4"><div className={`grid h-12 w-12 place-items-center rounded-2xl border ${i===0?"border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/20 to-amber-300/10":"border-blue-300/15 bg-blue-500/10"} text-lg font-bold text-white`}>{platform[0]}</div><div><h2 className="text-lg font-semibold text-white">{platform}</h2><p className="muted mt-1 text-xs">{connected?"Connected workspace":"Not connected"}</p></div></div><span className={`pill ${connected?"border-emerald-300/15 text-[#4edea3]":"text-[#7b879e]"}`}><span className={connected?"status-dot":"h-2 w-2 rounded-full bg-[#566277]"}/>{connected?"Connected":"Disconnected"}</span></div><div className="mt-7 grid grid-cols-2 gap-3 border-y border-white/[.055] py-5"><div><div className="text-[10px] uppercase tracking-[.12em] text-[#657189]">Followers</div><div className="mt-1 text-xl font-semibold text-white">{connected?(i===0?"12.5K":"8.9K"):"—"}</div></div><div><div className="text-[10px] uppercase tracking-[.12em] text-[#657189]">30d reach</div><div className="mt-1 text-xl font-semibold text-white">{connected?(i===0?"1.8M":"740K"):"—"}</div></div></div><div className="mt-5 flex items-center justify-between"><p className="text-xs text-[#728098]">{connected?"Ready for CreatorOS workflows":"Connect to enable scheduling and analytics"}</p><button onClick={()=>toggle(platform)} className={connected?"secondary-btn":"primary-btn"}>{connected?"Disconnect":"Connect"}</button></div></Card>})}</div>
      <Card className="mt-4 p-6"><div className="kicker">Integration health</div><div className="mt-4 grid gap-4 md:grid-cols-3">{[["API status","Operational","#4edea3"],["Connected","${accounts.length} accounts","#d2bbff"],["Token handling","Protected","#4edea3"]].map(([a,b,c])=><div key={a} className="rounded-xl border border-white/[.05] bg-white/[.015] p-4"><div className="text-xs text-[#718099]">{a}</div><div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white"><span className="h-2 w-2 rounded-full" style={{background:c,boxShadow:`0 0 12px ${c}`}}/>{b}</div></div>)}</div></Card>
    </AppShell>
  );
}
