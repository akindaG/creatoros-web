"use client";

import { useState } from "react";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";

export default function SocialAccountsPage() {
  const [connected,setConnected] = useState({Instagram:true,Facebook:false});
  async function toggle(platform: "Instagram" | "Facebook") {
    const next = !connected[platform];
    const base = process.env.NEXT_PUBLIC_API_URL;
    try {
      if (base) await fetch(next ? `${base}/api/accounts/connect` : `${base}/api/accounts/${platform.toLowerCase()}`, {method: next ? "POST":"DELETE",headers:{"Content-Type":"application/json"},body: next ? JSON.stringify({platform:platform.toLowerCase()}) : undefined});
    } catch {}
    setConnected(c=>({...c,[platform]:next}));
  }
  return (
    <AppShell title="Connected Accounts" subtitle="Manage supported social integrations" actions={<button className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Connect account</button>}>
      <div className="mb-6"><div className="kicker">MVP integrations</div><h1 className="mt-2 text-3xl font-semibold tracking-[-.045em] text-white">Social accounts</h1><p className="muted mt-2 max-w-2xl text-sm">CreatorOS AI Version 1.0 is deliberately focused on Facebook and Instagram. Connect only the channels needed for the final MVP.</p></div>
      <div className="grid gap-4 md:grid-cols-2">{(["Instagram","Facebook"] as const).map((platform,i)=><Card key={platform} className="neon-border overflow-hidden p-6"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4"><div className={`grid h-12 w-12 place-items-center rounded-2xl border ${i===0?"border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/20 to-amber-300/10":"border-blue-300/15 bg-blue-500/10"} text-lg font-bold text-white`}>{platform[0]}</div><div><h2 className="text-lg font-semibold text-white">{platform}</h2><p className="muted mt-1 text-xs">{connected[platform]?"Connected workspace":"Not connected"}</p></div></div><span className={`pill ${connected[platform]?"border-emerald-300/15 text-[#4edea3]":"text-[#7b879e]"}`}><span className={connected[platform]?"status-dot":"h-2 w-2 rounded-full bg-[#566277]"}/>{connected[platform]?"Connected":"Disconnected"}</span></div><div className="mt-7 grid grid-cols-2 gap-3 border-y border-white/[.055] py-5"><div><div className="text-[10px] uppercase tracking-[.12em] text-[#657189]">Followers</div><div className="mt-1 text-xl font-semibold text-white">{connected[platform]?(i===0?"12.5K":"8.9K"):"—"}</div></div><div><div className="text-[10px] uppercase tracking-[.12em] text-[#657189]">30d reach</div><div className="mt-1 text-xl font-semibold text-white">{connected[platform]?(i===0?"1.8M":"740K"):"—"}</div></div></div><div className="mt-5 flex items-center justify-between"><p className="text-xs text-[#728098]">{connected[platform]?"Syncing content and analytics":"Connect to enable scheduling and analytics"}</p><button onClick={()=>toggle(platform)} className={connected[platform]?"secondary-btn":"primary-btn"}>{connected[platform]?"Disconnect":"Connect"}</button></div></Card>)}</div>
      <Card className="mt-4 p-6"><div className="kicker">Integration health</div><div className="mt-4 grid gap-4 md:grid-cols-3">{[["API status","Operational","#4edea3"],["Last sync","2 min ago","#d2bbff"],["Token health","Secure","#4edea3"]].map(([a,b,c])=><div key={a} className="rounded-xl border border-white/[.05] bg-white/[.015] p-4"><div className="text-xs text-[#718099]">{a}</div><div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white"><span className="h-2 w-2 rounded-full" style={{background:c,boxShadow:`0 0 12px ${c}`}}/>{b}</div></div>)}</div></Card>
    </AppShell>
  );
}
