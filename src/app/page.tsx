import Link from "next/link";
import { Logo } from "@/components/app-shell";
import { Card, SparkChart } from "@/components/ui";

const capabilityCards = [
  {
    icon: "✦",
    title: "AI Content Studio",
    description: "Turn a simple content brief into platform-ready captions, CTAs, hashtags and improvement suggestions.",
    detail: "Caption generation · Hashtags · Content analysis",
  },
  {
    icon: "◇",
    title: "Unified Content Workspace",
    description: "Upload media, save drafts and keep the work-in-progress content that matters in one focused creator workspace.",
    detail: "Images · Video · Draft management",
  },
  {
    icon: "▦",
    title: "Smart Scheduling",
    description: "Plan Facebook and Instagram content visually, manage your queue and keep publishing decisions organized.",
    detail: "Calendar · Queue · Rescheduling",
  },
  {
    icon: "⌁",
    title: "Performance Analytics",
    description: "See reach, likes, comments, shares and engagement rate without jumping between disconnected dashboards.",
    detail: "Reach · Engagement · Growth",
  },
  {
    icon: "◉",
    title: "Audience Intelligence",
    description: "Use historical performance to understand when your audience responds and when your next post should go live.",
    detail: "Best day · Best time · Confidence",
  },
  {
    icon: "↗",
    title: "Growth Recommendations",
    description: "Translate raw performance signals into practical posting, consistency and content-improvement actions.",
    detail: "Explainable · Actionable · Focused",
  },
];

const workflowSteps = [
  ["01", "Create", "Upload media, shape the idea and use AI to refine the caption, CTA and hashtags."],
  ["02", "Prepare", "Save the post as a draft, choose Facebook or Instagram and keep everything ready in one queue."],
  ["03", "Schedule", "Choose a future publish time, place the post on the calendar and keep your week organized."],
  ["04", "Improve", "Read performance, discover better posting windows and turn analytics into the next growth action."],
] as const;

const personas = ["Content creators", "Influencers", "Personal brands", "Small businesses", "Startups", "Digital marketers"];

const faq = [
  [
    "What makes CreatorOS different from a normal scheduler?",
    "CreatorOS combines content management and scheduling with AI-assisted copy, analytics, best-time recommendations and growth guidance. The goal is not only to publish content, but to help you make better publishing decisions.",
  ],
  [
    "Which social platforms are supported in Version 1.0?",
    "The Version 1.0 MVP is intentionally focused on Facebook and Instagram. TikTok, LinkedIn and YouTube belong to the future roadmap rather than the current product scope.",
  ],
  [
    "Does CreatorOS create the whole content for me?",
    "No. CreatorOS is designed as a growth assistant. It helps you improve captions, hashtags, CTAs, scheduling decisions and performance understanding while keeping creative control with you.",
  ],
  [
    "How does the AI layer work?",
    "CreatorOS uses an Ollama and Qwen 3 AI layer for caption generation, hashtag generation and content analysis, with a fallback mode that keeps the MVP demonstrable when the local AI service is unavailable.",
  ],
  [
    "Can I see why a posting time is recommended?",
    "Yes. Posting-time recommendations are based on historical engagement signals and are presented with supporting context such as the best day, best hour, confidence and sample size.",
  ],
  [
    "Is this built for agencies or enterprise teams?",
    "Not in Version 1.0. The current product is deliberately optimized for individual creators, personal brands and smaller teams. Agency management and enterprise multi-tenancy are future roadmap items.",
  ],
] as const;

export default function Home() {
  return (
    <main className="premium-grid min-h-screen overflow-hidden bg-[#020611] text-white">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[.055] bg-[#020611]/78 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6">
          <div className="sm:hidden"><Logo compact /></div>
          <div className="hidden sm:block"><Logo /></div>
          <div className="hidden items-center gap-7 text-[13px] font-medium text-[#8995ac] lg:flex">
            <a className="transition hover:text-white" href="#product">Product</a>
            <a className="transition hover:text-white" href="#features">Features</a>
            <a className="transition hover:text-white" href="#intelligence">Intelligence</a>
            <a className="transition hover:text-white" href="#workflow">Workflow</a>
            <a className="transition hover:text-white" href="#faq">FAQ</a>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/login" className="secondary-btn hidden sm:inline-flex">Log in</Link>
            <Link href="/register" className="primary-btn">Start growing <span>↗</span></Link>
          </div>
        </div>
      </nav>

      <section className="relative mx-auto flex min-h-[980px] max-w-7xl flex-col items-center px-5 pb-24 pt-40 text-center sm:px-6 sm:pt-44">
        <div className="pulse-glow pointer-events-none absolute left-1/2 top-20 h-[560px] w-[780px] -translate-x-1/2 rounded-full bg-violet-600/[.14] blur-[120px]" />
        <div className="pointer-events-none absolute left-[12%] top-72 h-48 w-48 rounded-full bg-cyan-400/[.06] blur-[80px]" />
        <div className="pointer-events-none absolute right-[10%] top-48 h-56 w-56 rounded-full bg-blue-500/[.07] blur-[90px]" />

        <div className="relative pill border-violet-300/20 bg-violet-500/[.08] text-violet-100 shadow-[0_0_40px_rgba(124,58,237,.08)]">
          <span className="status-dot" /> AI-powered social growth intelligence
        </div>

        <h1 className="relative mt-8 max-w-6xl text-5xl font-semibold leading-[.96] tracking-[-.07em] text-white sm:text-7xl lg:text-[92px]">
          Run your social growth from <span className="gradient-text">one intelligent OS.</span>
        </h1>
        <p className="relative mt-7 max-w-3xl text-base leading-7 text-[#8c99b1] sm:text-lg sm:leading-8">
          CreatorOS AI brings content planning, AI assistance, scheduling, analytics and growth recommendations into one premium workspace built for creators who want clarity instead of more tabs.
        </p>

        <div className="relative mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="primary-btn !min-h-12 !px-6">Enter CreatorOS <span>↗</span></Link>
          <a href="#product" className="secondary-btn !min-h-12 !px-6">Explore the product <span>↓</span></a>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[.12em] text-[#626f87]">
          <span>Facebook + Instagram</span><span className="text-violet-500">•</span><span>Qwen 3 intelligence</span><span className="text-violet-500">•</span><span>Scheduling + analytics</span><span className="text-violet-500">•</span><span>Creator-first workflow</span>
        </div>

        <div id="product" className="relative mt-20 w-full max-w-6xl scroll-mt-28 rounded-[30px] border border-violet-300/15 bg-gradient-to-b from-white/[.065] to-white/[.012] p-2 shadow-[0_60px_160px_rgba(0,0,0,.62),0_0_100px_rgba(124,58,237,.09)]">
          <div className="overflow-hidden rounded-[24px] border border-white/[.07] bg-[#050a18] text-left">
            <div className="flex items-center justify-between border-b border-white/[.055] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400/70"/><span className="h-2.5 w-2.5 rounded-full bg-amber-300/70"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70"/></div>
              <div className="flex items-center gap-2"><span className="pill hidden sm:inline-flex">Illustrative product preview</span><span className="pill border-emerald-300/10 text-[#4edea3]"><span className="status-dot"/> Connected</span></div>
            </div>

            <div className="grid lg:grid-cols-[190px_1fr]">
              <div className="hidden border-r border-white/[.055] bg-[#030816]/70 p-4 lg:block">
                <div className="mb-5 px-2 text-[9px] font-bold uppercase tracking-[.18em] text-[#59667d]">Workspace</div>
                {["Dashboard","Content Studio","AI Assistant","Calendar","Analytics","Growth Insights"].map((item, index) => <div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-semibold ${index === 0 ? "border border-violet-300/10 bg-violet-500/10 text-violet-100" : "text-[#6f7b92]"}`}><span className="text-violet-300/70">{["◫","◇","✦","▦","⌁","↗"][index]}</span>{item}</div>)}
                <div className="mt-7 rounded-xl border border-violet-300/10 bg-violet-500/[.045] p-3"><div className="kicker !text-[8px]">CreatorOS AI</div><p className="mt-2 text-[10px] leading-4 text-[#66738b]">One workspace for the decisions around every post.</p></div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div><div className="kicker">Growth command center</div><div className="mt-2 text-xl font-semibold tracking-[-.03em] text-white sm:text-2xl">Good morning, creator.</div><p className="mt-1 text-xs text-[#718099]">Here is what your content needs next.</p></div>
                  <div className="pill w-fit">Last 30 days</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[["Total Reach","82.4K","+18.4%"],["Engagement","5.26%","+1.8%"],["Followers","12.5K","+12.1%"],["Posts Tracked","24","This month"]].map(([a,b,c]) => <div key={a} className="rounded-xl border border-white/[.06] bg-white/[.022] p-4 transition hover:border-violet-300/15 hover:bg-white/[.035]"><div className="text-[10px] font-semibold text-[#78859c]">{a}</div><div className="mt-2 text-2xl font-semibold tracking-[-.04em] text-white">{b}</div><div className="mt-1 text-[10px] text-[#4edea3]">{c}</div></div>)}
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_.75fr]">
                  <div className="rounded-xl border border-white/[.06] bg-white/[.018] p-4 sm:p-5">
                    <div className="mb-4 flex items-start justify-between"><div><div className="text-sm font-semibold text-white">Growth momentum</div><div className="mt-1 text-[10px] text-[#69768e]">Reach and engagement performance</div></div><span className="pill">Live analytics</span></div>
                    <SparkChart compact />
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-lg bg-white/[.02] p-2"><div className="text-sm font-semibold text-white">6.8K</div><div className="mt-1 text-[9px] text-[#66738a]">Avg reach</div></div><div className="rounded-lg bg-white/[.02] p-2"><div className="text-sm font-semibold text-white">4.9%</div><div className="mt-1 text-[9px] text-[#66738a]">Avg engagement</div></div><div className="rounded-lg bg-white/[.02] p-2"><div className="text-sm font-semibold text-white">+14%</div><div className="mt-1 text-[9px] text-[#66738a]">Momentum</div></div></div>
                  </div>

                  <div className="rounded-xl border border-violet-300/10 bg-gradient-to-br from-violet-500/[.10] to-cyan-400/[.025] p-5">
                    <div className="flex items-center justify-between"><div className="kicker">AI Recommendation</div><span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[9px] font-bold text-[#4edea3]">HIGH CONFIDENCE</span></div>
                    <div className="mt-5 text-xl font-semibold tracking-[-.03em] text-white">Post tonight at 7:30 PM</div>
                    <p className="mt-3 text-xs leading-5 text-[#8794ad]">Your strongest engagement window is between 7 PM and 9 PM. Keep the CTA concise and lead with the outcome.</p>
                    <div className="mt-5 flex gap-2"><span className="pill">Instagram</span><span className="pill">Educational</span></div>
                    <div className="mt-6 border-t border-white/[.06] pt-4"><div className="flex justify-between text-[10px] text-[#6e7a91]"><span>Recommendation confidence</span><span className="text-violet-200">86%</span></div><div className="mt-2 h-1.5 rounded-full bg-white/[.05]"><div className="h-full w-[86%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" /></div></div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[["Next post","Instagram · 7:30 PM","Scheduled"],["Top content","How-to carousel","8.4% engagement"],["AI action","Strengthen CTA","2 suggestions"]].map(([label,value,state]) => <div key={label} className="flex items-center justify-between rounded-xl border border-white/[.055] bg-[#030816]/50 p-3"><div><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#5f6c84]">{label}</div><div className="mt-1 text-xs font-semibold text-[#dbe4f8]">{value}</div></div><div className="text-[9px] font-semibold text-violet-300">{state}</div></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[.055] bg-white/[.012]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-8 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-left"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-violet-300">Designed around real creator workflows</div><div className="mt-1 text-sm text-[#7c899f]">Focused enough for an MVP. Flexible enough to grow with the product.</div></div>
          <div className="flex flex-wrap justify-center gap-2">{personas.map((persona) => <span key={persona} className="rounded-full border border-white/[.07] bg-white/[.02] px-3 py-2 text-[10px] font-semibold text-[#8d9ab1]">{persona}</span>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <div className="kicker">Less tool switching. Better decisions.</div>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Your growth workflow should feel like a system, not a pile of tabs.</h2>
            <p className="muted mt-6 max-w-xl text-base leading-7">Creators usually plan in one place, write somewhere else, schedule in another tool and then hunt for analytics later. CreatorOS brings those repeated decisions into a single growth loop.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{[["Scattered content drafts","One content workspace"],["Generic caption writing","AI-assisted improvement"],["Guessing publish times","Historical best-time signals"],["Raw social metrics","Actionable growth recommendations"]].map(([before,after]) => <div key={before} className="rounded-xl border border-white/[.055] bg-white/[.018] p-4"><div className="text-[10px] text-[#637089] line-through decoration-rose-300/50">{before}</div><div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#dce5f8]"><span className="text-[#4edea3]">✓</span>{after}</div></div>)}</div>
          </div>

          <div className="relative rounded-[28px] border border-violet-300/12 bg-gradient-to-br from-violet-500/[.07] to-transparent p-2">
            <div className="rounded-[22px] border border-white/[.06] bg-[#050a18] p-5 sm:p-7">
              <div className="flex items-start justify-between"><div><div className="kicker">Creator growth loop</div><div className="mt-2 text-xl font-semibold text-white">Every post makes the next decision smarter.</div></div><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-xl text-violet-200">↗</div></div>
              <div className="mt-7 space-y-3">{[["1","Create with context","Brief + media + AI assistance"],["2","Publish with intent","Platform + schedule + queue"],["3","Measure the signal","Reach + engagement + growth"],["4","Improve the next post","Best time + recommendations"]].map(([number,title,detail], index) => <div key={number} className="group flex gap-4 rounded-xl border border-white/[.055] bg-white/[.018] p-4 transition hover:border-violet-300/15 hover:bg-violet-500/[.04]"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-violet-300/10 bg-violet-500/10 text-xs font-bold text-violet-200">{number}</div><div className="min-w-0 flex-1"><div className="text-sm font-semibold text-white">{title}</div><div className="mt-1 text-[11px] text-[#6f7c94]">{detail}</div></div><div className={`self-center text-sm ${index === 3 ? "text-[#4edea3]" : "text-[#536078]"}`}>{index === 3 ? "↗" : "↓"}</div></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 border-y border-white/[.05] bg-white/[.01] py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="kicker">One premium workspace</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Everything around the post, connected.</h2>
            <p className="muted mt-5 text-base leading-7">CreatorOS is intentionally focused on the recurring work creators do every week: create, prepare, schedule, understand and improve.</p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilityCards.map((feature, index) => <Card key={feature.title} className={`group relative overflow-hidden p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-300/20 ${index === 0 || index === 4 ? "neon-border" : ""}`}><div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/[.05] blur-3xl transition group-hover:bg-violet-500/[.10]"/><div className="relative grid h-11 w-11 place-items-center rounded-xl border border-violet-300/10 bg-violet-500/10 text-lg text-violet-200">{feature.icon}</div><h3 className="relative mt-6 text-xl font-semibold tracking-[-.03em] text-white">{feature.title}</h3><p className="muted relative mt-3 text-sm leading-6">{feature.description}</p><div className="relative mt-6 border-t border-white/[.05] pt-4 text-[10px] font-semibold text-[#66738b]">{feature.detail}</div></Card>)}
          </div>
        </div>
      </section>

      <section id="intelligence" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-28 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
          <div>
            <div className="pill w-fit border-violet-300/15 bg-violet-500/[.07] text-violet-200">✦ Qwen 3 intelligence layer</div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">AI that helps improve the work, not replace the creator.</h2>
            <p className="muted mt-6 text-base leading-7">Start with your idea. CreatorOS helps turn it into stronger platform-specific copy, checks the structure and CTA, and gives you clear suggestions before you schedule.</p>
            <div className="mt-8 space-y-4">{[["Generate","Caption, CTA and hashtag support from the content brief."],["Analyze","Score caption quality, CTA strength and content structure."],["Improve","Turn the analysis into direct, creator-controlled edits."],["Fallback","Keep the MVP usable even when the local AI service is unavailable."]].map(([title,description]) => <div key={title} className="flex gap-3"><div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-emerald-300/10 bg-emerald-300/[.06] text-[10px] text-[#4edea3]">✓</div><div><div className="text-sm font-semibold text-white">{title}</div><p className="mt-1 text-xs leading-5 text-[#748198]">{description}</p></div></div>)}</div>
          </div>

          <div className="rounded-[28px] border border-violet-300/12 bg-gradient-to-b from-violet-500/[.06] to-transparent p-2 shadow-[0_40px_120px_rgba(0,0,0,.4)]">
            <div className="rounded-[22px] border border-white/[.06] bg-[#050a18] p-5 sm:p-7">
              <div className="flex items-center justify-between"><div><div className="kicker">AI Content Assistant</div><div className="mt-2 text-lg font-semibold text-white">Turn a rough idea into publish-ready copy.</div></div><span className="pill">Instagram</span></div>
              <div className="mt-6 rounded-xl border border-white/[.055] bg-[#020611]/70 p-4"><div className="text-[9px] font-bold uppercase tracking-[.14em] text-[#59667e]">Content brief</div><div className="mt-2 text-sm leading-6 text-[#cbd5e9]">Share three practical ways creators can improve engagement without posting more often.</div></div>
              <div className="mt-3 grid gap-3 md:grid-cols-[1.15fr_.85fr]">
                <div className="rounded-xl border border-violet-300/10 bg-violet-500/[.045] p-4"><div className="flex items-center justify-between"><div className="text-[9px] font-bold uppercase tracking-[.14em] text-violet-300">Generated caption</div><span className="text-[9px] text-[#637089]">Qwen 3</span></div><p className="mt-3 text-xs leading-5 text-[#c3cde0]">Posting more is not always the answer. Start by making every post easier to respond to: ask one clear question, lead with the value, and publish when your audience is already active.</p><div className="mt-4 flex flex-wrap gap-2"><span className="pill">#CreatorGrowth</span><span className="pill">#ContentStrategy</span><span className="pill">#SocialMediaTips</span></div></div>
                <div className="rounded-xl border border-emerald-300/10 bg-emerald-300/[.025] p-4"><div className="flex items-center justify-between"><div className="text-[9px] font-bold uppercase tracking-[.14em] text-[#4edea3]">Content score</div><div className="text-xl font-semibold text-white">88<span className="text-xs text-[#718099]">/100</span></div></div><div className="mt-4 h-1.5 rounded-full bg-white/[.06]"><div className="h-full w-[88%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"/></div><div className="mt-5 space-y-3">{[["Hook","Strong"],["CTA","Improve"],["Structure","Clear"]].map(([label,state]) => <div key={label} className="flex justify-between text-[10px]"><span className="text-[#6d7a91]">{label}</span><span className={state === "Improve" ? "text-amber-300" : "text-[#4edea3]"}>{state}</span></div>)}</div></div>
              </div>
              <div className="mt-3 rounded-xl border border-white/[.055] bg-white/[.018] p-4"><div className="flex gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-200">✦</div><div><div className="text-xs font-semibold text-white">Improvement suggestion</div><p className="mt-1 text-[11px] leading-5 text-[#718099]">Make the CTA more specific: ask the audience which of the three changes they will try first.</p></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[.05] bg-white/[.012] py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-[28px] border border-white/[.07] bg-[#050a18] p-5 shadow-[0_40px_110px_rgba(0,0,0,.4)] sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="kicker">Content Calendar</div><div className="mt-2 text-lg font-semibold text-white">A week you can actually understand.</div></div><div className="flex gap-2"><span className="pill">Week view</span><span className="pill border-emerald-300/10 text-[#4edea3]"><span className="status-dot"/> Live schedule</span></div></div>
                <div className="mt-6 grid grid-cols-7 overflow-hidden rounded-xl border border-white/[.055]">
                  {[["Mon","17"],["Tue","18"],["Wed","19"],["Thu","20"],["Fri","21"],["Sat","22"],["Sun","23"]].map(([day,date], dayIndex) => <div key={day} className="min-h-60 border-r border-white/[.045] bg-[#030816]/45 p-2 last:border-r-0"><div className="text-center"><div className="text-[9px] text-[#637089]">{day}</div><div className={`mx-auto mt-1 grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold ${dayIndex === 3 ? "bg-violet-500 text-white" : "text-[#8894aa]"}`}>{date}</div></div>{dayIndex === 1 && <div className="mt-10 rounded-lg border border-blue-400/15 bg-blue-500/[.08] p-2"><div className="text-[8px] font-bold text-blue-300">FACEBOOK</div><div className="mt-1 text-[9px] text-[#bfc9dc]">Product story</div><div className="mt-2 text-[8px] text-[#65728a]">10:30 AM</div></div>}{dayIndex === 3 && <div className="mt-20 rounded-lg border border-violet-300/15 bg-violet-500/[.10] p-2 shadow-[0_0_24px_rgba(124,58,237,.08)]"><div className="text-[8px] font-bold text-violet-300">INSTAGRAM</div><div className="mt-1 text-[9px] text-[#d2d9e8]">Creator tips carousel</div><div className="mt-2 text-[8px] text-[#7d89a0]">7:30 PM</div></div>}{dayIndex === 5 && <div className="mt-32 rounded-lg border border-emerald-300/10 bg-emerald-300/[.045] p-2"><div className="text-[8px] font-bold text-[#4edea3]">INSTAGRAM</div><div className="mt-1 text-[9px] text-[#c4cede]">Weekly recap</div><div className="mt-2 text-[8px] text-[#68758d]">6:00 PM</div></div>}</div>)}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">{[["3","Scheduled"],["2","Drafts ready"],["7:30 PM","Best window"]].map(([value,label]) => <div key={label} className="rounded-xl border border-white/[.05] bg-white/[.018] p-3"><div className="text-lg font-semibold text-white">{value}</div><div className="mt-1 text-[9px] uppercase tracking-[.1em] text-[#65728a]">{label}</div></div>)}</div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="kicker">Smart scheduling</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Plan the week with confidence, not guesswork.</h2>
              <p className="muted mt-6 text-base leading-7">Save drafts, choose the connected platform, schedule future posts and see the queue in a visual calendar. Best-time intelligence gives the schedule more context without taking control away from you.</p>
              <div className="mt-8 grid gap-3">{[["Visual calendar","See what is planned across the week at a glance."],["Draft-to-schedule flow","Move ready content into the publishing queue without rebuilding the post."],["Connected-account checks","Schedule against a Facebook or Instagram account that is actually connected."],["Reschedule and cancel","Change the plan when the content calendar changes."]].map(([title,description]) => <div key={title} className="flex gap-3 rounded-xl border border-white/[.045] bg-white/[.012] p-4"><div className="text-violet-300">▦</div><div><div className="text-sm font-semibold text-white">{title}</div><p className="mt-1 text-xs leading-5 text-[#738097]">{description}</p></div></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-6">
        <div className="mx-auto max-w-3xl text-center"><div className="kicker">Analytics that lead somewhere</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">See the numbers. Then know what to do next.</h2><p className="muted mt-5 text-base leading-7">CreatorOS connects performance analytics with posting-time intelligence and growth recommendations, so the dashboard ends with a decision rather than a data dump.</p></div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-[24px] border border-white/[.065] bg-[#050a18] p-5 sm:p-7">
            <div className="flex items-start justify-between"><div><div className="text-lg font-semibold text-white">Performance overview</div><div className="mt-1 text-xs text-[#718099]">Illustrative analytics snapshot</div></div><span className="pill">30 days</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">{[["Reach","82.4K"],["Likes","4.8K"],["Comments","612"],["Shares","938"]].map(([label,value]) => <div key={label} className="rounded-xl border border-white/[.05] bg-white/[.018] p-3"><div className="text-[9px] uppercase tracking-[.1em] text-[#64718a]">{label}</div><div className="mt-2 text-xl font-semibold text-white">{value}</div></div>)}</div>
            <div className="mt-5 rounded-xl border border-white/[.05] bg-white/[.012] p-4"><div className="mb-4 flex justify-between"><div className="text-xs font-semibold text-white">Reach over time</div><div className="text-[10px] text-[#4edea3]">↗ Healthy momentum</div></div><SparkChart compact /></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/[.05] bg-white/[.015] p-4"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#66738b]">Instagram share</div><div className="mt-3 flex items-end justify-between"><div className="text-2xl font-semibold text-white">68%</div><div className="h-12 w-24 rounded-t-lg bg-gradient-to-t from-violet-500/30 to-violet-400/5"/></div></div><div className="rounded-xl border border-white/[.05] bg-white/[.015] p-4"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#66738b]">Facebook share</div><div className="mt-3 flex items-end justify-between"><div className="text-2xl font-semibold text-white">32%</div><div className="h-8 w-24 rounded-t-lg bg-gradient-to-t from-blue-500/30 to-blue-400/5"/></div></div></div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[24px] border border-violet-300/12 bg-gradient-to-br from-violet-500/[.09] to-transparent p-6"><div className="kicker">Best posting time</div><div className="mt-5 flex items-end gap-3"><div className="text-4xl font-semibold tracking-[-.05em] text-white">7:30</div><div className="pb-1 text-sm text-[#8b98ae]">PM</div></div><div className="mt-2 text-sm font-semibold text-violet-200">Thursday · Instagram</div><p className="muted mt-4 text-xs leading-5">Calculated from the strongest historical engagement window available in your workspace data.</p><div className="mt-5 flex items-center justify-between text-[10px]"><span className="text-[#68758d]">Confidence</span><span className="text-[#4edea3]">86%</span></div><div className="mt-2 h-1.5 rounded-full bg-white/[.05]"><div className="h-full w-[86%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"/></div></div></div>
            <div className="rounded-[24px] border border-white/[.065] bg-[#050a18] p-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/[.06] text-[#4edea3]">↗</div><div><div className="kicker">Growth action</div><div className="mt-1 text-sm font-semibold text-white">Increase consistency before volume.</div></div></div><p className="muted mt-4 text-xs leading-5">Your recent performance suggests improving weekly consistency is a stronger next move than simply publishing more content.</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[.05] bg-white/[.012] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div><div className="kicker">Focused V1 integrations</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Built deeply around Facebook and Instagram first.</h2><p className="muted mt-6 text-base leading-7">CreatorOS does not pretend to support every network in Version 1.0. The MVP keeps the integration surface focused so the core creator workflow can be tested properly before the roadmap expands.</p><div className="mt-7 flex flex-wrap gap-2"><span className="pill border-blue-300/15 text-blue-200">Facebook</span><span className="pill border-violet-300/15 text-violet-200">Instagram</span><span className="pill">TikTok · Roadmap</span><span className="pill">LinkedIn · Roadmap</span><span className="pill">YouTube · Roadmap</span></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[{icon:"f",title:"Facebook",detail:"Connect the account, prepare posts, schedule content and track performance inside the same workspace.",accent:"text-blue-300 bg-blue-500/10 border-blue-300/10"},{icon:"◎",title:"Instagram",detail:"Manage drafts, improve captions with AI, choose publish times and understand engagement performance.",accent:"text-violet-300 bg-violet-500/10 border-violet-300/10"}].map((platform) => <div key={platform.title} className="rounded-2xl border border-white/[.06] bg-[#050a18] p-6"><div className={`grid h-12 w-12 place-items-center rounded-xl border text-xl font-bold ${platform.accent}`}>{platform.icon}</div><div className="mt-5 flex items-center justify-between"><h3 className="text-lg font-semibold text-white">{platform.title}</h3><span className="rounded-full bg-emerald-300/[.06] px-2 py-1 text-[9px] font-bold text-[#4edea3]">V1</span></div><p className="muted mt-3 text-sm leading-6">{platform.detail}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1"><div className="kicker">Control by design</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white">Premium UX should also feel dependable.</h2><p className="muted mt-5 text-sm leading-6">CreatorOS keeps the MVP practical with authentication, protected workspace routes, encrypted social credentials and safe simulation support for demonstrations.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">{[["JWT sessions","Protected account and workspace access with authenticated API requests."],["Encrypted social tokens","Connected social access and refresh tokens are encrypted before database storage."],["Simulation mode","Demonstrate the publishing workflow safely without relying on approved live Meta credentials."],["AI fallback mode","Keep caption and analysis workflows available if the local Ollama service is temporarily unavailable."]].map(([title,description], index) => <div key={title} className="rounded-2xl border border-white/[.06] bg-white/[.016] p-5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-500/[.08] text-sm text-violet-200">{["⌁","◇","◉","✦"][index]}</div><span className="text-[9px] font-bold uppercase tracking-[.13em] text-[#4edea3]">Built in</span></div><h3 className="mt-5 text-base font-semibold text-white">{title}</h3><p className="muted mt-2 text-xs leading-5">{description}</p></div>)}</div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-24 border-y border-white/[.05] bg-white/[.012] py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="max-w-3xl"><div className="kicker">A focused creator rhythm</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">From idea to insight in one continuous workflow.</h2><p className="muted mt-5 max-w-2xl text-base leading-7">CreatorOS keeps the process deliberately understandable. Each stage prepares the data and context for the next one.</p></div>
          <div className="relative mt-14 grid gap-4 md:grid-cols-4">{workflowSteps.map(([number,title,description], index) => <div key={number} className="group relative rounded-2xl border border-white/[.06] bg-[#050a18] p-6 transition hover:-translate-y-1 hover:border-violet-300/18"><div className="flex items-center justify-between"><div className="text-xs font-bold text-violet-300">{number}</div>{index < workflowSteps.length - 1 && <div className="text-[#46536c]">→</div>}</div><h3 className="mt-7 text-xl font-semibold text-white">{title}</h3><p className="muted mt-3 text-sm leading-6">{description}</p><div className="mt-7 h-px bg-gradient-to-r from-violet-500/40 to-transparent"/></div>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-6">
        <div className="mx-auto max-w-3xl text-center"><div className="kicker">Built for focused growth</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Different creators. The same need for clarity.</h2><p className="muted mt-5 text-base leading-7">The MVP is shaped around people who manage their own content decisions and need one place to stay consistent, understand performance and improve the next post.</p></div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">{[["Creator / Influencer","Keep a repeatable content rhythm, improve copy faster and understand what earns engagement."],["Personal Brand / Founder","Turn ideas into consistent social communication without spending the week inside publishing tools."],["Small Team / Marketer","Keep drafts, schedules and growth signals visible in one shared mental model of the social workflow."]].map(([title,description], index) => <div key={title} className="rounded-2xl border border-white/[.06] bg-gradient-to-b from-white/[.025] to-transparent p-6"><div className="text-3xl">{["✦","↗","◇"][index]}</div><h3 className="mt-6 text-lg font-semibold text-white">{title}</h3><p className="muted mt-3 text-sm leading-6">{description}</p><Link href="/register" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-violet-300 transition hover:text-violet-200">Start workspace <span>→</span></Link></div>)}</div>
      </section>

      <section className="border-y border-white/[.05] bg-[#030713] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div><div className="kicker">More than a scheduler</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white">The value is in the connected decisions.</h2><p className="muted mt-5 text-sm leading-6">CreatorOS is not trying to win by adding the most buttons. The product is designed around a smaller set of connected growth decisions.</p></div>
            <div className="overflow-hidden rounded-2xl border border-white/[.06] bg-[#050a18]">
              <div className="grid grid-cols-[1.25fr_.75fr_.75fr] border-b border-white/[.055] bg-white/[.018] px-4 py-3 text-[9px] font-bold uppercase tracking-[.12em] text-[#647189]"><div>Capability</div><div className="text-center">Basic scheduler</div><div className="text-center text-violet-300">CreatorOS</div></div>
              {[["Draft + schedule content","✓","✓"],["AI caption + hashtag assistance","—","✓"],["Content quality analysis","—","✓"],["Analytics dashboard","Sometimes","✓"],["Best posting-time recommendation","Limited","✓"],["Growth recommendation engine","—","✓"]].map(([capability,basic,creatoros]) => <div key={capability} className="grid grid-cols-[1.25fr_.75fr_.75fr] items-center border-b border-white/[.045] px-4 py-4 text-xs last:border-b-0"><div className="font-medium text-[#cdd6e8]">{capability}</div><div className="text-center text-[#66738b]">{basic}</div><div className="text-center font-bold text-[#4edea3]">{creatoros}</div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 mx-auto max-w-5xl px-5 py-28 sm:px-6">
        <div className="mx-auto max-w-2xl text-center"><div className="kicker">FAQ</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">A few things worth knowing.</h2></div>
        <div className="mt-12 space-y-3">{faq.map(([question,answer]) => <details key={question} className="group rounded-2xl border border-white/[.06] bg-white/[.015] px-5 py-1 transition open:border-violet-300/15 open:bg-violet-500/[.025] sm:px-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-sm font-semibold text-[#e2e8f7] marker:content-none"><span>{question}</span><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/[.07] text-sm text-violet-300 transition group-open:rotate-45">+</span></summary><p className="muted max-w-3xl pb-6 pr-10 text-sm leading-6">{answer}</p></details>)}</div>
      </section>

      <section className="px-5 pb-28 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-violet-300/15 bg-gradient-to-br from-violet-600/[.16] via-[#080d1d] to-cyan-400/[.05] px-6 py-16 text-center shadow-[0_50px_140px_rgba(0,0,0,.5)] sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-violet-500/[.12] blur-[90px]" />
          <div className="relative mx-auto max-w-3xl"><div className="pill border-violet-200/15 bg-white/[.035] text-violet-100">Your next post can start with better context.</div><h2 className="mt-6 text-4xl font-semibold tracking-[-.06em] text-white sm:text-6xl">Create smarter. Schedule with confidence. Grow with evidence.</h2><p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-[#9aa7bd] sm:text-base">Enter the CreatorOS workspace and experience the complete Version 1.0 flow across content, AI assistance, scheduling, analytics and growth recommendations.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/register" className="primary-btn !min-h-12 !px-7">Create your workspace <span>↗</span></Link><Link href="/login" className="secondary-btn !min-h-12 !px-7">Log in</Link></div></div>
        </div>
      </section>

      <footer className="border-t border-white/[.055] bg-[#02050d]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_.6fr_.6fr_.6fr]">
            <div><Logo/><p className="mt-4 max-w-sm text-xs leading-5 text-[#65728a]">AI-powered social growth intelligence for creators, personal brands and small teams who want one place to create, schedule, understand and improve.</p><div className="mt-5 text-[9px] font-bold uppercase tracking-[.15em] text-[#4f5c73]">Version 1.0 · Facebook + Instagram</div></div>
            <div><div className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7b879d]">Product</div><div className="mt-4 space-y-3 text-xs text-[#647189]"><a className="block hover:text-white" href="#features">Features</a><a className="block hover:text-white" href="#intelligence">AI Intelligence</a><a className="block hover:text-white" href="#workflow">Workflow</a></div></div>
            <div><div className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7b879d]">Workspace</div><div className="mt-4 space-y-3 text-xs text-[#647189]"><Link className="block hover:text-white" href="/dashboard">Dashboard</Link><Link className="block hover:text-white" href="/analytics">Analytics</Link><Link className="block hover:text-white" href="/calendar">Calendar</Link></div></div>
            <div><div className="text-[10px] font-bold uppercase tracking-[.14em] text-[#7b879d]">Account</div><div className="mt-4 space-y-3 text-xs text-[#647189]"><Link className="block hover:text-white" href="/register">Register</Link><Link className="block hover:text-white" href="/login">Log in</Link><a className="block hover:text-white" href="#faq">FAQ</a></div></div>
          </div>
          <div className="mt-10 flex flex-col gap-3 border-t border-white/[.05] pt-6 text-[10px] text-[#526078] sm:flex-row sm:items-center sm:justify-between"><span>CreatorOS AI · Social Growth Intelligence Platform</span><span>Built around focused, data-driven creator workflows.</span></div>
        </div>
      </footer>
    </main>
  );
}
