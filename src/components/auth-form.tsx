"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Logo } from "./app-shell";

type Mode = "login" | "register" | "reset";

type LoginResponse = { access_token: string; token_type?: string };
type ForgotPasswordResponse = { message: string; reset_token?: string | null };

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [success, setSuccess] = useState(false);
  const isRegister = mode === "register";
  const isReset = mode === "reset";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setResetToken("");
    setSuccess(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (isRegister) {
        await apiFetch("/api/v1/auth/register", { method: "POST", body: JSON.stringify(data) });
        router.replace("/login");
      } else if (isReset) {
        const result = await apiFetch<ForgotPasswordResponse>("/api/v1/auth/forgot-password", { method: "POST", body: JSON.stringify(data) });
        setMessage(result.message);
        setResetToken(result.reset_token ?? "");
        setSuccess(true);
      } else {
        const payload = await apiFetch<LoginResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify(data) });
        localStorage.setItem("creatoros_token", payload.access_token);
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="premium-grid relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div className="pulse-glow absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full bg-violet-600/[.14] blur-[100px]" />
      <div className="absolute left-6 top-6"><Logo /></div>
      <div className="glass neon-border relative w-full max-w-md rounded-[26px] p-7 shadow-[0_40px_120px_rgba(0,0,0,.5)] sm:p-9">
        <div className="text-center"><div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/15 bg-violet-500/10 text-xl text-violet-200 shadow-[0_0_30px_rgba(124,58,237,.15)]">✦</div><h1 className="text-2xl font-semibold tracking-[-.04em] text-white">{isRegister ? "Create your workspace" : isReset ? "Reset your password" : "Welcome back"}</h1><p className="muted mt-2 text-sm">{isRegister ? "Start building a smarter social growth workflow." : isReset ? "Enter the email attached to your CreatorOS account." : "Sign in to continue to CreatorOS AI."}</p></div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {isRegister && <label className="block"><span className="label mb-2 block">Full name</span><input className="field" name="name" placeholder="Your name" required /></label>}
          <label className="block"><span className="label mb-2 block">Email address</span><input className="field" type="email" name="email" placeholder="you@example.com" required /></label>
          {!isReset && <label className="block"><span className="flex items-center justify-between"><span className="label mb-2 block">Password</span>{mode === "login" && <Link href="/forgot-password" className="mb-2 text-xs text-violet-300 hover:text-violet-200">Forgot password?</Link>}</span><input className="field" type="password" name="password" placeholder="••••••••" minLength={8} required /></label>}
          {message && <div role={success ? "status" : "alert"} className={`rounded-xl border p-3 text-xs leading-5 ${success ? "border-emerald-300/15 bg-emerald-300/[.06] text-emerald-100" : "border-rose-300/15 bg-rose-400/[.06] text-rose-100"}`}>{message}</div>}
          {resetToken && <Link href={`/reset-password?token=${encodeURIComponent(resetToken)}`} className="secondary-btn w-full">Continue to password reset</Link>}
          <button className="primary-btn !mt-6 w-full" disabled={loading}>{loading ? "Working..." : isRegister ? "Create account" : isReset ? "Send reset instructions" : "Log in"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-[#7b879e]">{isRegister ? <>Already have an account? <Link className="text-violet-300" href="/login">Log in</Link></> : !isReset ? <>New to CreatorOS? <Link className="text-violet-300" href="/register">Create an account</Link></> : <Link className="text-violet-300" href="/login">Back to login</Link>}</p>
      </div>
    </main>
  );
}
