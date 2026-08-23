"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card, EmptyState, MetricCard, SparkChart } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type Metrics = { followers:number; reach:number; likes:number; comments:number; shares:number; engagement_rate:number; growth_rate:number; posts_count:number };
type SeriesPoint = { captured_at:string; reach:number; engagements:number; engagement_rate:number };
type TopPost = { post_id:string; title:string; platform:string; reach:number; engagements:number; engagement_rate:number };
type Overview = { metrics:Metrics; series:SeriesPoint[]; top_posts:TopPost[]; platform_reach:Record<string,number> };
type BestTime = { best_day:string|null; formatted_time:string|null; confidence:number; sample_size:number; reason:string };
type Recommendation = { id:string; recommendation_text:string; type:string; created_at:string };

const emptyMetrics:Metrics={followers:0,reach:0,likes:0,comments:0,shares:0,engagement_rate:0,growth_rate:0,posts_count:0};
const short=(value:number)=>value>=1_000_000?`${(value/1_000_000).toFixed(1)}M`:value>=1_000?`${(value/1_000).toFixed(1)}K`:String(value);

export default function DashboardPage() {
  const [overview,setOverview]=useState<Overview>({metrics:emptyMetrics,series:[],top_posts:[],platform_reach:{instagram:0,facebook:0}});
  const [bestTime,setBestTime]=useState<BestTime|null>(null);
  const [recommendations,setRecommendations]=useState<Recommendation[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{
    const controller=new AbortController();
    Promise.all([
      apiFetch<Overview>("/api/v1/analytics/overview",{signal:controller.signal}),
      apiFetch<BestTime>("/api/v1/recommendations/best-time",{signal:controller.signal}),
      apiFetch<Recommendation[]>("/api/v1/recommendations",{signal:controller.signal}),
    ]).then(([analytics,best,recs])=>{setOverview(analytics);setBestTime(best);setRecommendations(recs);})
      .catch((requestError)=>{if(!(requestError instanceof DOMException&&requestError.name==="AbortError"))setError(requestError instanceof Error?requestError.message:"Could not load dashboard");})
      .finally(()=>setLoading(false));
    return()=>controller.abort();
  },[]);

  const metrics=overview.metrics;
  const engagements=metrics.likes+metrics.comments+metrics.shares;
  const bestLabel=bestTime?.best_day&&bestTime.formatted_time?`${bestTime.best_day} · ${bestTime.formatted_time}`:"Collect more data";
  const savedRecommendation=recommendations[0]?.recommendation_text;
  const instagramReach=overview.platform_reach.instagram??0;
  const facebookReach=overview.platform_reach.facebook??0;
  const trackedReach=instagramReach+facebookReach;
  const instagramShare=trackedReach?Math.round(instagramReach/trackedReach*100):0;
  const facebookShare=trackedReach?100-instagramShare:0;
  const dataHealth=overview.series.length>=5?"Strong":overview.series.length?"Building":"Needs data";

  return (
    <AppShell title="Dashboard" subtitle="Your social growth command center" actions={<Link href="/content-studio" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</Link>}>
      <section className="relative mb-5 overflow-hidden rounded-[26px] border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] via-[#071025]/80 to-cyan-400/[.025] p-5 shadow-[0_30px_90px_rgba(0,0,0,.22)] sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/[.09] blur-[80px]" />
        <div className="pointer-events-none absolute bottom-[-80px] left-[28%] h-52 w-52 rounded-full bg-cyan-400/[.035] blur-[70px]" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2"><div className="kicker">Live growth command center</div><span className="pill !py-1 text-[#4edea3]"><span className="status-dot" /> API connected</span></div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.055em] text-white sm:text-4xl">Know what is working, then make the next move.</h1>
            <p className="muted mt-3 max-w-xl text-sm leading-6">CreatorOS combines your stored performance, AI assistance and publishing workflow into one decision-focused workspace.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[410px]">
            <Link href="/ai-assistant" className="panel-hover rounded-xl border border-white/[.055] bg-white/[.022] p-3"><div className="text-violet-300">✦</div><div className="mt-2 text-[11px] font-semibold text-white">Generate</div><div className="mt-1 text-[9px] text-[#68758d]">AI content</div></Link>
            <Link href="/calendar" className="panel-hover rounded-xl border border-white/[.055] bg-white/[.022] p-3"><div className="text-violet-300">▦</div><div className="mt-2 text-[11px] font-semibold text-white">Schedule</div><div className="mt-1 text-[9px] text-[#68758d]">Open calendar</div></Link>
            <Link href="/growth-insights" className="panel-hover rounded-xl border border-white/[.055] bg-white/[.022] p-3"><div className="text-[#4edea3]">↗</div><div className="mt-2 text-[11px] font-semibold text-white">Improve</div><div className="mt-1 text-[9px] text-[#68758d]">Growth signals</div></Link>
          </div>
        </div>
      </section>

      {error&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Reach" value={loading?"…":short(metrics.reach)} delta={`${metrics.growth_rate.toFixed(1)}%`} hint="audience growth"/>
        <MetricCard label="Engagements" value={loading?"…":short(engagements)} delta={`${metrics.engagement_rate.toFixed(2)}%`} hint="engagement rate"/>
        <MetricCard label="Followers" value={loading?"…":short(metrics.followers)} hint="latest tracked audience"/>
        <MetricCard label="Posts" value={loading?"…":String(metrics.posts_count)} hint="content in workspace"/>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_.85fr]">
        <Card className="overflow-hidden p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div><div className="kicker">Performance momentum</div><h2 className="mt-1 font-semibold text-white">Reach trend</h2><p className="muted mt-1 text-xs">Live snapshots from your stored analytics history</p></div>
            <div className="flex gap-2"><span className="pill">{overview.series.length} data points</span><Link href="/analytics" className="pill border-violet-300/10 text-violet-200">Open analytics ↗</Link></div>
          </div>
          <SparkChart values={overview.series.map(point=>point.reach)} />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5e6b82]">Data health</div><div className={`mt-2 text-sm font-semibold ${dataHealth==="Strong"?"text-[#4edea3]":dataHealth==="Building"?"text-amber-300":"text-[#8a96ac]"}`}>{dataHealth}</div></div>
            <div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5e6b82]">Instagram reach</div><div className="mt-2 text-sm font-semibold text-white">{short(instagramReach)}</div></div>
            <div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5e6b82]">Facebook reach</div><div className="mt-2 text-sm font-semibold text-white">{short(facebookReach)}</div></div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><div className="kicker">Channel mix</div><h2 className="mt-1 font-semibold text-white">Where reach is coming from</h2></div><span className="pill">{short(trackedReach)} tracked</span></div>
          <div className="mt-7 space-y-5">
            <div><div className="flex items-center justify-between text-xs"><span className="text-[#8d99af]">Instagram</span><span className="font-semibold text-violet-200">{instagramShare}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[.045]"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" style={{width:`${instagramShare}%`}} /></div></div>
            <div><div className="flex items-center justify-between text-xs"><span className="text-[#8d99af]">Facebook</span><span className="font-semibold text-blue-200">{facebookShare}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[.045]"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width:`${facebookShare}%`}} /></div></div>
          </div>
          <div className="mt-7 rounded-xl border border-white/[.05] bg-white/[.015] p-4"><div className="text-[10px] font-semibold text-[#77849b]">What this means</div><p className="muted mt-2 text-xs leading-5">As you add analytics snapshots, CreatorOS uses this performance history to improve posting-time and growth recommendations.</p></div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between"><div><div className="kicker">Top content</div><h2 className="mt-1 font-semibold text-white">Posts earning attention</h2></div><Link className="text-xs font-semibold text-violet-300 hover:text-violet-200" href="/analytics">View all ↗</Link></div>
          {overview.top_posts.length?<div className="space-y-2">{overview.top_posts.slice(0,4).map((post,index)=><div key={post.post_id} className="panel-hover flex items-center gap-3 rounded-xl border border-white/[.045] bg-white/[.015] p-3"><div className="grid h-11 w-11 place-items-center rounded-xl border border-violet-300/10 bg-gradient-to-br from-violet-500/18 to-cyan-400/[.035] text-xs font-bold text-violet-200">0{index+1}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-[#e8edfb]">{post.title}</div><div className="mt-1 text-[9px] uppercase tracking-[.1em] text-[#66738c]">{post.platform} · {short(post.reach)} reach</div></div><div className="rounded-lg bg-emerald-300/[.055] px-2.5 py-1.5 text-xs font-semibold text-[#4edea3]">{post.engagement_rate.toFixed(1)}%</div></div>)}</div>:<EmptyState title="No ranked posts yet" description="Add analytics to published posts and CreatorOS will rank your strongest content here."/>}
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="panel-hover relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-24 w-24 bg-violet-500/10 blur-3xl"/><div className="kicker">Best posting window</div><div className="mt-3 text-xl font-semibold tracking-[-.03em] text-violet-100">{bestLabel}</div><div className="mt-3 flex items-center gap-2"><span className="pill">{bestTime?.sample_size??0} samples</span>{bestTime&&<span className="pill text-[#4edea3]">{Math.round(bestTime.confidence)}% confidence</span>}</div><p className="muted mt-3 text-xs leading-5">{bestTime?.reason??"CreatorOS needs performance snapshots before it can calculate your strongest posting time."}</p><Link href="/calendar" className="mt-5 inline-block text-xs font-semibold text-violet-300">Open calendar ↗</Link></Card>
          <Card className="panel-hover relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-24 w-24 bg-emerald-400/[.06] blur-3xl"/><div className="kicker">Growth recommendation</div><div className="mt-3 text-lg font-semibold tracking-[-.03em] text-violet-100">{savedRecommendation?"Latest strategy signal":"Generate your growth plan"}</div><p className="muted mt-3 text-xs leading-5">{savedRecommendation??"Run Growth Insights after adding performance data to receive explainable posting and engagement recommendations."}</p><Link href="/growth-insights" className="mt-5 inline-block text-xs font-semibold text-violet-300">Growth Insights ↗</Link></Card>
          <Card className="panel-hover relative overflow-hidden p-5 sm:col-span-2"><div className="absolute right-0 top-0 h-24 w-24 bg-violet-500/10 blur-3xl"/><div className="flex items-start justify-between gap-4"><div><div className="kicker">AI content workflow</div><div className="mt-2 text-lg font-semibold tracking-[-.03em] text-violet-100">Create → analyze → improve → schedule</div><p className="muted mt-3 max-w-lg text-xs leading-5">Generate a caption, CTA and hashtags, score the content, then move the final version directly into Content Studio without breaking your workflow.</p></div><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-violet-300/10 bg-violet-500/10 text-violet-200">✦</div></div><div className="mt-5 flex flex-wrap gap-2"><Link href="/ai-assistant" className="primary-btn !min-h-9 !px-3 text-xs">Open AI Assistant</Link><Link href="/content-studio" className="secondary-btn !min-h-9 !px-3 text-xs">Content Studio</Link></div></Card>
        </div>
      </div>
    </AppShell>
  );
}
