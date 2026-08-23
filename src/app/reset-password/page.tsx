"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Logo } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setMessage("");setSuccess(false);const data=Object.fromEntries(new FormData(e.currentTarget));try{await apiFetch("/api/v1/auth/reset-password",{method:"POST",body:JSON.stringify({token:data.token,new_password:data.new_password})});setSuccess(true);setMessage("Password updated. You can now sign in with your new password.");}catch(err){setMessage(err instanceof Error?err.message:"Password reset failed");}finally{setLoading(false);}}
  return <form onSubmit={submit} className="glass neon-border w-full max-w-md rounded-[26px] p-8"><div className="kicker">Security</div><h1 className="mt-2 text-2xl font-semibold tracking-[-.04em] text-white">Choose a new password</h1><p className="muted mt-2 text-sm leading-6">Use the reset token from your email or the local development reset flow, then choose a secure password.</p><label className="mt-6 block"><span className="label mb-2 block">Reset token</span><textarea name="token" className="field min-h-24 resize-none" defaultValue={searchParams.get("token") ?? ""} required/></label><label className="mt-4 block"><span className="label mb-2 block">New password</span><input name="new_password" type="password" minLength={8} maxLength={128} className="field" autoComplete="new-password" required/></label>{message&&<div role={success?"status":"alert"} className={`mt-4 rounded-xl border p-3 text-xs leading-5 ${success?"border-emerald-300/15 bg-emerald-300/[.06] text-emerald-100":"border-rose-300/15 bg-rose-400/[.06] text-rose-100"}`}>{message}</div>}<button className="primary-btn mt-6 w-full" disabled={loading||success}>{loading?"Updating...":success?"Password updated":"Update password"}</button><Link href="/login" className="secondary-btn mt-3 w-full">Back to login</Link></form>;
}

export default function ResetPasswordPage(){
  return <main className="premium-grid relative grid min-h-screen place-items-center px-5 py-12"><div className="absolute left-6 top-6"><Logo/></div><Suspense fallback={<div className="glass h-[480px] w-full max-w-md animate-pulse rounded-[26px]" aria-label="Loading password reset form"/>}><ResetPasswordForm/></Suspense></main>;
}
