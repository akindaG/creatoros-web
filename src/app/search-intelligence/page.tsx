"use client";

import { FormEvent, useMemo, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type AuditIssue = {
  severity: "info" | "warning" | "critical";
  category: string;
  message: string;
};

type AuditScores = {
  technical_seo: number;
  content_quality: number;
  answer_clarity: number;
  structured_content: number;
  authority_signals: number;
  discoverability: number;
};

type PageInfo = {
  status_code: number;
  final_url: string;
  title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string | null;
  h1: string[];
  h2_count: number;
  h3_count: number;
  word_count: number;
  internal_links: number;
  external_links: number;
  images: number;
  images_with_alt: number;
  structured_data_blocks: number;
  author_signal: boolean;
  open_graph_signal: boolean;
};

type SearchAudit = {
  url: string;
  score: number;
  scores: AuditScores;
  page: PageInfo;
  issues: AuditIssue[];
  recommendations: string[];
  methodology: string;
  source: string;
};

const scoreItems: Array<{ key: keyof AuditScores; label: string; weight: string }> = [
  { key: "technical_seo", label: "Technical SEO", weight: "25%" },
  { key: "content_quality", label: "Content quality", weight: "25%" },
  { key: "answer_clarity", label: "Answer clarity", weight: "20%" },
  { key: "structured_content", label: "Structured content", weight: "10%" },
  { key: "authority_signals", label: "Authority signals", weight: "10%" },
  { key: "discoverability", label: "Discoverability", weight: "10%" },
];

function scoreClass(score: number) {
  if (score >= 80) return "text-[#4edea3]";
  if (score >= 60) return "text-amber-200";
  return "text-rose-200";
}

function severityClass(severity: AuditIssue["severity"]) {
  if (severity === "critical") return "border-rose-300/10 bg-rose-400/[.055] text-rose-200";
  if (severity === "warning") return "border-amber-300/10 bg-amber-300/[.045] text-amber-100";
  return "border-cyan-300/10 bg-cyan-300/[.035] text-cyan-100";
}

export default function SearchIntelligencePage() {
  const [url, setUrl] = useState("");
  const [audit, setAudit] = useState<SearchAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const criticalCount = useMemo(
    () => audit?.issues.filter((issue) => issue.severity === "critical").length ?? 0,
    [audit],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiFetch<SearchAudit>("/api/v1/search-intelligence/analyze", {
        method: "POST",
        body: JSON.stringify({ url: url.trim() }),
      });
      setAudit(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not analyze this page.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      title="Search Intelligence"
      subtitle="SEO and AI-search readiness analysis for public web pages"
      actions={
        <span className="pill text-[#4edea3]">
          <span className="status-dot" />
          Explainable scoring
        </span>
      }
    >
      <section className="relative mb-5 overflow-hidden rounded-[26px] border border-violet-300/10 bg-gradient-to-br from-violet-500/[.09] via-[#071025] to-cyan-400/[.025] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/[.07] blur-[85px]" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_430px] xl:items-end">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="kicker">Search growth layer</div>
              <span className="pill">CreatorOS readiness model v1</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.055em] text-white sm:text-4xl">
              Audit a page before you invest more time in the content.
            </h1>
            <p className="muted mt-3 text-sm leading-6">
              CreatorOS checks crawlability signals, page structure, content depth, answer clarity, authority cues and discoverability. The score is a CreatorOS heuristic, not a Google or AI-platform ranking score.
            </p>
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-white/[.06] bg-black/10 p-3">
            <label htmlFor="search-url" className="text-[10px] font-bold uppercase tracking-[.13em] text-[#6f7c93]">
              Public page URL
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="search-url"
                type="url"
                required
                placeholder="https://example.com/article"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/[.07] bg-[#050b18] px-3 text-sm text-white outline-none transition placeholder:text-[#42506a] focus:border-violet-300/25"
              />
              <button disabled={loading} className="primary-btn !min-h-11 !px-4 text-xs sm:shrink-0">
                {loading ? "Analyzing..." : "Analyze page"}
              </button>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-[#5f6c84]">
              Only public HTTP/HTTPS pages are fetched. Private-network and localhost targets are blocked.
            </p>
          </form>
        </div>
      </section>

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">
          {error}
        </div>
      )}

      {!audit && !loading && (
        <Card className="p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="kicker">What this checks</div>
              <h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-white">A safe, explainable first version.</h2>
              <p className="muted mt-2 max-w-xl text-sm leading-6">
                This module is intentionally isolated from publishing, analytics and social account data. It analyzes a supplied web page and returns a readiness report without modifying the page or your CreatorOS records.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {["Titles, metadata and indexability", "Headings and answer structure", "Links, images and structured data", "Authority and discoverability cues"].map((item) => (
                <div key={item} className="rounded-xl border border-white/[.05] bg-white/[.015] p-3 text-xs leading-5 text-[#9aa7bd]">
                  <span className="mr-2 text-violet-300">◇</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {loading && (
        <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
          <div className="skeleton h-72 rounded-[24px] border border-white/[.04]" />
          <div className="skeleton h-72 rounded-[24px] border border-white/[.04]" />
        </div>
      )}

      {audit && !loading && (
        <>
          <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
            <Card className="neon-border p-6">
              <div className="kicker">AI search readiness</div>
              <div className="mt-4 flex items-end gap-2">
                <div className={`text-6xl font-semibold tracking-[-.07em] ${scoreClass(audit.score)}`}>{audit.score}</div>
                <div className="pb-2 text-sm text-[#617089]">/ 100</div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[.045]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-blue-400 to-emerald-300"
                  style={{ width: `${audit.score}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3">
                  <div className="text-lg font-semibold text-white">{audit.issues.length}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[.11em] text-[#65728a]">Signals</div>
                </div>
                <div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3">
                  <div className="text-lg font-semibold text-rose-200">{criticalCount}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[.11em] text-[#65728a]">Critical</div>
                </div>
                <div className="rounded-xl border border-white/[.05] bg-white/[.015] p-3">
                  <div className="text-lg font-semibold text-[#4edea3]">{audit.page.status_code}</div>
                  <div className="mt-1 text-[8px] uppercase tracking-[.11em] text-[#65728a]">HTTP</div>
                </div>
              </div>
              <p className="muted mt-5 text-xs leading-5">{audit.methodology}</p>
            </Card>

            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="kicker">Readiness breakdown</div>
                  <h2 className="mt-1 font-semibold text-white">Why the page received this score</h2>
                </div>
                <span className="pill">{audit.source}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {scoreItems.map((item) => {
                  const value = audit.scores[item.key];
                  return (
                    <div key={item.key} className="rounded-xl border border-white/[.05] bg-white/[.015] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-white">{item.label}</div>
                          <div className="mt-1 text-[9px] uppercase tracking-[.1em] text-[#5e6b83]">Weight {item.weight}</div>
                        </div>
                        <div className={`text-xl font-semibold ${scoreClass(value)}`}>{value}</div>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.04]">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
            <Card className="p-6">
              <div className="kicker">Optimization plan</div>
              <h2 className="mt-1 font-semibold text-white">Recommended next actions</h2>
              <div className="mt-4 space-y-2">
                {audit.recommendations.map((recommendation, index) => (
                  <div key={recommendation} className="flex gap-3 rounded-xl border border-white/[.05] bg-white/[.015] p-4">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-violet-300/10 bg-violet-500/[.08] text-xs font-semibold text-violet-200">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="text-sm leading-6 text-[#aab5c8]">{recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="kicker">Page evidence</div>
              <h2 className="mt-1 font-semibold text-white">What CreatorOS detected</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["Words", audit.page.word_count],
                  ["H2 sections", audit.page.h2_count],
                  ["Internal links", audit.page.internal_links],
                  ["External links", audit.page.external_links],
                  ["Images", audit.page.images],
                  ["JSON-LD", audit.page.structured_data_blocks],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-xl border border-white/[.05] bg-white/[.015] p-3">
                    <div className="text-[9px] font-bold uppercase tracking-[.11em] text-[#5f6c84]">{label}</div>
                    <div className="mt-2 text-lg font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="rounded-lg bg-white/[.015] p-3">
                  <div className="text-[#66738b]">Title</div>
                  <div className="mt-1 break-words text-[#b5c0d2]">{audit.page.title ?? "Not detected"}</div>
                </div>
                <div className="rounded-lg bg-white/[.015] p-3">
                  <div className="text-[#66738b]">Canonical</div>
                  <div className="mt-1 break-all text-[#b5c0d2]">{audit.page.canonical_url ?? "Not detected"}</div>
                </div>
                <div className="rounded-lg bg-white/[.015] p-3">
                  <div className="text-[#66738b]">Final URL</div>
                  <div className="mt-1 break-all text-[#b5c0d2]">{audit.page.final_url}</div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="kicker">Audit findings</div>
                <h2 className="mt-1 font-semibold text-white">Issues and supporting signals</h2>
              </div>
              <span className="pill">{audit.issues.length} findings</span>
            </div>
            {audit.issues.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {audit.issues.map((issue, index) => (
                  <div key={`${issue.category}-${index}`} className="rounded-xl border border-white/[.05] bg-white/[.012] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[.12em] ${severityClass(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className="text-[9px] font-semibold uppercase tracking-[.1em] text-[#59667d]">{issue.category.replaceAll("_", " ")}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#a9b5c8]">{issue.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-emerald-300/10 bg-emerald-300/[.035] p-4 text-sm text-[#9bcdb9]">
                No basic readiness problems were detected. Continue improving originality, evidence and usefulness.
              </div>
            )}
          </Card>
        </>
      )}
    </AppShell>
  );
}
