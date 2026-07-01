/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { useState } from "react";
import { Chrome, Github, User, Mail, Lock } from "lucide-react";
import { supabase } from "../utils/supabaseClient";

interface AuthProps {
  onLoginSuccess: (userName: string, isGuest: boolean) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const appUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
  const oauthRedirectUrl = import.meta.env.PROD && appUrl ? appUrl : `${window.location.origin}/`;
  const allowGuestAccess = import.meta.env.VITE_ALLOW_GUEST_ACCESS === "true";

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setLoadingType(provider);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: oauthRedirectUrl,
        queryParams: provider === "google"
          ? {
              prompt: "select_account",
              access_type: "offline",
            }
          : undefined,
      },
    });

    setLoadingType(null);

    if (error) {
      setMessage(error.message);
      return;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingType(mode);
    setMessage(null);

    const action =
      mode === "signup"
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password });

    const { data, error } = await action;
    setLoadingType(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    const displayName = data.user?.user_metadata?.full_name || data.user?.email?.split("@")[0] || "Builder";
    onLoginSuccess(displayName, false);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-card shadow-sm p-10 text-center"
        id="auth-card"
      >
        {/* Logo Metaphor */}
        <div className="inline-flex items-center justify-center space-x-2 mb-8" id="auth-logo-wrapper">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute w-full h-[3px] bg-[#233A66] rotate-45 transform translate-x-[-2px] rounded-full" />
            <div className="absolute w-full h-[3px] bg-[#D7A859] rotate-45 transform translate-x-[2px] translate-y-[4px] rounded-full" />
          </div>
          <span className="font-display text-3xl font-extrabold tracking-tight text-[#233A66]">
            FaultLine
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#111827] mb-2" id="auth-heading">
          Welcome to FaultLine
        </h1>
        <p className="text-[#6B7280] text-sm mb-8" id="auth-subheading">
          The decision intelligence network for startup builders, engineers, and investors.
        </p>

        <form className="space-y-4 mb-8 text-left" id="auth-actions-group" onSubmit={handleEmailAuth}>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#233A66]">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 pl-11 pr-4 bg-[#FCFCFC] border border-[#E5E7EB] rounded-button text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#233A66] focus:border-[#233A66]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#233A66]">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 pl-11 pr-4 bg-[#FCFCFC] border border-[#E5E7EB] rounded-button text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#233A66] focus:border-[#233A66]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingType !== null}
            className="w-full h-12 flex items-center justify-center space-x-3 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-sm transition-all duration-150 hover:shadow-md disabled:opacity-50"
          >
            {loadingType === mode ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}
            className="w-full text-xs font-semibold text-[#233A66] hover:underline"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>

          {message && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-card-secondary p-3">
              {message}
            </p>
          )}

          <div className="relative flex py-2 items-center" id="auth-divider">
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
            <span className="flex-shrink mx-4 text-xs text-[#9CA3AF] uppercase tracking-wider font-mono">Or</span>
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
          </div>

          <button
            type="button"
            id="auth-google-btn"
            disabled={loadingType !== null}
            onClick={() => handleOAuthLogin("google")}
            className="w-full h-12 flex items-center justify-center space-x-3 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-sm transition-all duration-150 hover:shadow-md disabled:opacity-50"
          >
            {loadingType === "google" ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Chrome className="w-5 h-5" />
            )}
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            id="auth-github-btn"
            disabled={loadingType !== null}
            onClick={() => handleOAuthLogin("github")}
            className="w-full h-12 flex items-center justify-center space-x-3 bg-white hover:bg-[#F9FAFB] text-[#233A66] border border-[#E5E7EB] font-semibold rounded-button text-sm transition-all duration-150 hover:shadow-sm disabled:opacity-50"
          >
            {loadingType === "github" ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-[#233A66] border-t-transparent rounded-full" />
            ) : (
              <Github className="w-5 h-5 text-[#233A66]" />
            )}
            <span>Continue with GitHub</span>
          </button>

          {allowGuestAccess && (
            <button
              type="button"
              id="auth-guest-btn"
              disabled={loadingType !== null}
              onClick={() => onLoginSuccess("Guest User", true)}
              className="w-full h-12 flex items-center justify-center space-x-3 bg-[#FCFCFC] hover:bg-[#F3F4F6] text-[#6B7280] font-medium rounded-button text-sm transition-all duration-150 disabled:opacity-50"
            >
              <User className="w-4 h-4" />
              <span>Continue as Guest</span>
            </button>
          )}
        </form>

        <p className="text-xs text-[#9CA3AF] leading-relaxed" id="auth-footer-note">
          "Join thousands of founders sharing the decisions that shaped their journey."
        </p>
      </motion.div>
    </div>
  );
}
