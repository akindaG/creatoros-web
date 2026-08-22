"use client";

import { useState } from "react";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";

const days = ["Mon 16","Tue 17","Wed 18","Thu 19","Fri 20","Sat 21","Sun 22"];
const slots = ["8 AM","10 AM","12 PM","2 PM","4 PM","6 PM","8 PM"];

export default function CalendarPage() {
  const [view,setView] = useState("Week");
  return (
    <AppShell title="Content Calendar" subtitle="Plan and manage your publishing schedule" actions={<button className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</button>}>
      <div className="grid gap-4 xl:grid-cols-[1fr_290px]">
        <Card className="overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.055] p-4"><div className="flex items-center gap-2"><button className="secondary-btn !min-h-8 !px-3">‹</button><h2 className="min-w-36 text-center font-semibold text-white">June 2026</h2><button className="secondary-btn !min-h-8 !px-3">›</button><button className="secondary-btn !min-h-8">Today</button></div><div className="rounded-xl border border-white/[.055] bg-white/[.02] p-1">{["Month","Week","Day"].map(v=><button key={v} onClick={()=>setView(v)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${view===v?"bg-violet-500/15 text-violet-100":"text-[#758299]"}`}>{v}</button>)}</div></div>
        <div className="min-w-[720px] overflow-x-auto"><div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-white/[.055]"><div/>{days.map(d=><div key={d} className="border-l border-white/[.045] p-3 text-center text-xs font-semibold text-[#aeb8ca]">{d}</div>)}</div><div className="relative grid grid-cols-[64px_repeat(7,1fr)]">{slots.map((s,row)=><div key={s} className="contents"><div className="h-24 border-b border-white/[.045] p-2 text-right text-[10px] text-[#59667d]">{s}</div>{days.map((d,col)=><div key={`${d}-${s}`} className="relative h-24 border-b border-l border-white/[.045] bg-white/[.005] hover:bg-white/[.015]">{row===0&&col===1&&<div className="absolute inset-x-2 top-3 rounded-xl border border-violet-300/20 bg-violet-500/14 p-2 shadow-[0_10px_20px_rgba(124,58,237,.12)]"><div className="text-[9px] text-violet-200">Instagram</div><div className="mt-1 text-[11px] font-semibold text-white">Morning routine reel</div><div className="mt-1 text-[9px] text-[#8591aa]">8:15 AM</div></div>}{row===2&&col===2&&<div className="absolute inset-x-2 top-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[.07] p-2"><div className="text-[9px] text-[#4edea3]">Facebook</div><div className="mt-1 text-[11px] font-semibold text-white">Weekly insights</div><div className="mt-1 text-[9px] text-[#8591aa]">12:15 PM</div></div>}{row===5&&col===4&&<div className="absolute inset-x-2 top-3 rounded-xl border border-violet-300/20 bg-violet-500/12 p-2"><div className="text-[9px] text-violet-200">Instagram</div><div className="mt-1 text-[11px] font-semibold text-white">Creator growth tips</div><div className="mt-1 text-[9px] text-[#8591aa]">6:30 PM</div></div>}</div>)}</div>)}</div></div>
        </Card>
        <Card className="h-fit overflow-hidden"><div className="border-b border-white/[.055] p-4"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Draft queue</h2><span className="pill">3 drafts</span></div><p className="muted mt-1 text-xs">Drag to schedule in the final integrated version</p></div><div className="space-y-3 p-4">{[["5 hooks that stop the scroll","Instagram","Ready"],["My journey to consistent growth","Facebook","Draft"],["Why personal branding matters","Instagram","AI assisted"]].map(([t,p,s])=><div key={t} className="cursor-grab rounded-xl border border-white/[.055] bg-white/[.018] p-3 active:cursor-grabbing"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-violet-300">{p}</span><span className="text-[#657189]">⋮⋮</span></div><div className="mt-2 text-sm font-semibold leading-5 text-white">{t}</div><div className="mt-3 pill !py-1 text-[9px]">{s}</div></div>)}</div><div className="border-t border-white/[.055] p-4"><button className="secondary-btn w-full">＋ New draft</button></div></Card>
      </div>
    </AppShell>
  );
}
