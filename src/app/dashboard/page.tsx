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

  return (
    <AppShell title="Dashboard" subtitle="Your social growth command center" actions={<Link href="/content-studio" className="primary-btn !min-h-9 !px-4 !py-2 text-xs">＋ Create post</Link>}>
      <div className="mb-6 flex flex-col gap-2"><div className="kicker">Live overview</div><h1 className="text-3xl font-semibold tracking-[-.045em] text-white">Your growth picture, in one workspace.</h1><p className="muted text-sm">CreatorOS is reading your stored Facebook and Instagram performance data through the live API.</p></div>
      {error&&<div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total Reach" value={loading?"…":short(metrics.reach)} delta={`${metrics.growth_rate.toFixed(1)}%`} hint="audience growth"/><MetricCard label="Engagements" value={loading?"…":short(engagements)} delta={`${metrics.engagement_rate.toFixed(2)}%`} hint="engagement rate"/><MetricCard label="Followers" value={loading?"…":short(metrics.followers)} hint="latest tracked audience"/><MetricCard label="Posts" value={loading?"…":String(metrics.posts_count)} hint="content in workspace"/></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="p-5"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-white">Performance overview</h2><p className="muted mt-1 text-xs">Reach snapshots from your stored analytics history</p></div><div className="pill">{overview.series.length} data points</div></div><SparkChart values={overview.series.map(point=>point.reach)} /></Card>
        <Card className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold text-white">Top content</h2><p className="muted mt-1 text-xs">Ranked by engagement rate</p></div><Link className="text-xs text-violet-300" href="/analytics">View analytics</Link></div>{overview.top_posts.length?<div className="space-y-2">{overview.top_posts.slice(0,3).map((post,index)=><div key={post.post_id} className="flex items-center gap-3 rounded-xl border border-white/[.045] bg-white/[.015] p-3"><div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-violet-500/20 to-emerald-400/5 text-sm text-violet-200">0{index+1}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-[#e8edfb]">{post.title}</div><div className="mt-1 text-[10px] uppercase tracking-wide text-[#66738c]">{post.platform} · {short(post.reach)} reach</div></div><div className="text-sm font-semibold text-[#4edea3]">{post.engagement_rate.toFixed(1)}%</div></div>)}</div>:<EmptyState title="No ranked posts yet" description="Add analytics to published posts and CreatorOS will rank your strongest content here."/>}</Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-24 w-24 bg-violet-500/10 blur-3xl"/><div className="kicker">Best posting window</div><div className="mt-3 text-xl font-semibold tracking-[-.03em] text-violet-100">{bestLabel}</div><p className="muted mt-3 text-xs leading-5">{bestTime?.reason??"CreatorOS needs performance snapshots before it can calculate your strongest posting time."}</p><Link href="/calendar" className="mt-5 inline-block text-xs font-semibold text-violet-300">Open calendar ↗</Link></Card>
        <Card className="relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-24 w-24 bg-violet-500/10 blur-3xl"/><div className="kicker">Growth recommendation</div><div className="mt-3 text-lg font-semibold tracking-[-.03em] text-violet-100">{savedRecommendation?"Latest strategy signal":"Generate your growth plan"}</div><p className="muted mt-3 text-xs leading-5">{savedRecommendation??"Run Growth Insights after adding performance data to receive explainable posting and engagement recommendations."}</p><Link href="/growth-insights" className="mt-5 inline-block text-xs font-semibold text-violet-300">Growth Insights ↗</Link></Card>
        <Card className="relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-24 w-24 bg-violet-500/10 blur-3xl"/><div className="kicker">AI content workflow</div><div className="mt-3 text-lg font-semibold tracking-[-.03em] text-violet-100">Create, analyze, improve</div><p className="muted mt-3 text-xs leading-5">Generate a caption, CTA and hashtags, then score the content before adding it to your publishing queue.</p><Link href="/ai-assistant" className="mt-5 inline-block text-xs font-semibold text-violet-300">Open AI Assistant ↗</Link></Card>
      </div>
    </AppShell>
  );
}
