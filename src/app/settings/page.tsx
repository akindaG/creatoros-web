"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "@/components/app-shell";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";

type Profile = {
  id?: string;
  name: string;
  email: string;
  bio: string | null;
  profile_image?: string | null;
  role?: string;
};

const fallbackProfile: Profile = {
  name: "Creator User",
  email: "creator@example.com",
  bio: "Building with CreatorOS AI to create smarter content and grow with data.",
};

export default function SettingsPage() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [savedProfile, setSavedProfile] = useState(fallbackProfile);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch<Profile>("/api/v1/users/me", { signal: controller.signal })
      .then((data) => {
        const next = { ...data, bio: data.bio ?? "" };
        setProfile(next);
        setSavedProfile(next);
        setLive(true);
      })
      .catch((requestError) => {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setLive(false);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const updated = await apiFetch<Profile>("/api/v1/users/me", {
        method: "PUT",
        body: JSON.stringify({ name: profile.name.trim(), bio: profile.bio?.trim() ?? "" }),
      });
      const next = { ...updated, bio: updated.bio ?? "" };
      setProfile(next);
      setSavedProfile(next);
      setLive(true);
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setPasswordMessage("");
    setPasswordError("");
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("current_password") ?? "");
    const newPassword = String(form.get("new_password") ?? "");
    const confirmPassword = String(form.get("confirm_password") ?? "");
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      await apiFetch("/api/v1/users/me/password", {
        method: "PUT",
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      formElement.reset();
      setPasswordMessage("Password changed successfully.");
    } catch (requestError) {
      setPasswordError(requestError instanceof Error ? requestError.message : "Could not change password");
    } finally {
      setChangingPassword(false);
    }
  }

  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CR";

  return (
    <AppShell title="Settings" subtitle="Profile and account security">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="pill border-violet-300/30 bg-violet-500/10 text-violet-100">Profile & security</div>
        <span className={`pill ${live ? "text-[#4edea3]" : "text-[#ffb95f]"}`}>
          {loading ? "Loading profile" : live ? "Live profile" : "Demo fallback"}
        </span>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="border-b border-white/[.055] pb-6">
          <h1 className="text-xl font-semibold text-white">Profile information</h1>
          <p className="muted mt-2 text-sm">Manage your public profile and account details.</p>
        </div>
        <form onSubmit={submitProfile} className="mt-7">
          <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
            <div className="space-y-5">
              <label className="block">
                <span className="label mb-2 block">Full name</span>
                <input className="field" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} minLength={2} maxLength={100} required />
              </label>
              <label className="block">
                <span className="label mb-2 block">Email</span>
                <input type="email" className="field opacity-70" value={profile.email} disabled />
                <span className="mt-2 block text-[10px] text-[#657189]">Email changes are disabled for this account.</span>
              </label>
              <label className="block">
                <span className="label mb-2 block">Bio</span>
                <textarea className="field min-h-32 resize-none" value={profile.bio ?? ""} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} maxLength={500} />
                <span className="mt-2 block text-[10px] text-[#657189]">Brief description for your profile.</span>
              </label>
            </div>
            <div className="border-white/[.055] pl-0 lg:border-l lg:pl-8">
              <div className="label mb-3 text-center">Profile image</div>
              <div className="mx-auto grid h-32 w-32 place-items-center rounded-full border border-violet-300/15 bg-gradient-to-br from-violet-500/18 via-[#0d1529] to-emerald-300/[.06] text-3xl font-semibold text-violet-100 shadow-[0_0_35px_rgba(124,58,237,.12)]">{initials}</div>
              <p className="muted mt-4 text-center text-xs leading-5">Initials update automatically from your name.</p>
            </div>
          </div>
          {error && <div role="alert" className="mt-5 rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200">{error}</div>}
          <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-white/[.055] pt-6">
            {saved && <span role="status" className="mr-auto text-xs font-semibold text-[#4edea3]">✓ Changes saved</span>}
            <button type="button" onClick={() => { setProfile(savedProfile); setError(""); setSaved(false); }} className="secondary-btn" disabled={saving}>Cancel</button>
            <button className="primary-btn" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </form>
      </Card>

      <Card className="mt-4 p-6 sm:p-8">
        <div className="kicker">Security</div>
        <h2 className="mt-2 font-semibold text-white">Change password</h2>
        <p className="muted mt-2 text-sm leading-6">Confirm your current password before choosing a new one.</p>
        <form onSubmit={submitPassword} className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block"><span className="label mb-2 block">Current password</span><input name="current_password" type="password" className="field" autoComplete="current-password" minLength={8} required /></label>
          <label className="block"><span className="label mb-2 block">New password</span><input name="new_password" type="password" className="field" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
          <label className="block"><span className="label mb-2 block">Confirm new password</span><input name="confirm_password" type="password" className="field" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
          {passwordError && <div role="alert" className="rounded-xl border border-rose-300/10 bg-rose-400/[.06] p-3 text-xs text-rose-200 md:col-span-3">{passwordError}</div>}
          {passwordMessage && <div role="status" className="rounded-xl border border-emerald-300/10 bg-emerald-300/[.06] p-3 text-xs text-emerald-100 md:col-span-3">{passwordMessage}</div>}
          <div className="md:col-span-3"><button className="secondary-btn" disabled={changingPassword}>{changingPassword ? "Changing..." : "Change password"}</button></div>
        </form>
      </Card>
    </AppShell>
  );
}
