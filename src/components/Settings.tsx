/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Eye,
  Languages,
  UserCheck,
  Sparkles,
  Download,
  Trash2,
  Lock,
  Globe
} from "lucide-react";

export default function SettingsView() {
  const [theme, setTheme] = useState("Editorial Warm Light");
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [notifDigest, setNotifDigest] = useState("Weekly");
  const [isPrivateProfile, setIsPrivatePrivate] = useState(false);

  const sections = [
    {
      id: "account",
      title: "Account Security & Parameters",
      icon: Shield,
      description: "Manage your core identity parameters and multi-factor authorization state.",
      content: (
        <div className="space-y-4" id="settings-account-fields">
          <div className="flex items-center justify-between p-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
            <div>
              <span className="text-xs font-bold text-[#233A66] block">Multi-Factor Authentication (MFA)</span>
              <p className="text-[10px] text-[#6B7280]">Protect your decision journal with hardware key security.</p>
            </div>
            <button
              id="settings-mfa-toggle"
              onClick={() => setIsMfaEnabled(!isMfaEnabled)}
              className={`px-3 py-1.5 rounded-button text-[10px] font-bold uppercase transition-all ${
                isMfaEnabled ? "bg-emerald-100 text-emerald-800" : "bg-[#233A66] text-white"
              }`}
            >
              {isMfaEnabled ? "MFA Active" : "Enable MFA"}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
            <div>
              <span className="text-xs font-bold text-[#233A66] block">Verified Founder Credentials</span>
              <p className="text-[10px] text-[#6B7280]">Verification status determines your decision scores authority weighting.</p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 uppercase flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              Verified via LinkedIn
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      title: "Notifications Preferences",
      icon: Bell,
      description: "Avoid spam. Configure digest summaries strictly matching your learning schedule.",
      content: (
        <div className="space-y-3" id="settings-notif-fields">
          <div className="flex items-center justify-between p-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
            <div>
              <span className="text-xs font-bold text-[#233A66] block">Email Digest Delivery</span>
              <p className="text-[10px] text-[#6B7280]">Select how often you wish to receive weekly decision intelligence summaries.</p>
            </div>
            <select
              id="settings-notif-digest-select"
              value={notifDigest}
              onChange={(e) => setNotifDigest(e.target.value)}
              className="px-3 h-8 bg-white border border-[#E5E7EB] rounded-button text-xs text-[#111827] focus:outline-none"
            >
              <option>Daily Retrospective</option>
              <option>Weekly Digest</option>
              <option>Bi-weekly Analysis</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "Privacy & Exposure Profile",
      icon: Eye,
      description: "Determine whether your decision journal remains public or strictly stealth-private.",
      content: (
        <div className="space-y-3" id="settings-privacy-fields">
          <div className="flex items-center justify-between p-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
            <div>
              <span className="text-xs font-bold text-[#233A66] block">Stealth Mode Profile</span>
              <p className="text-[10px] text-[#6B7280]">When private, your published stories list 'Stealth Founder' as author.</p>
            </div>
            <button
              id="settings-private-toggle"
              onClick={() => setIsPrivatePrivate(!isPrivateProfile)}
              className={`px-3 py-1.5 rounded-button text-[10px] font-bold uppercase transition-all ${
                isPrivateProfile ? "bg-amber-100 text-amber-800" : "bg-[#233A66] text-white"
              }`}
            >
              {isPrivateProfile ? "Stealth Mode Active" : "Go Stealth"}
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "connected",
      title: "Connected Venture Accounts",
      icon: Lock,
      description: "Link third-party platforms to automatically audit metadata or pull story parameters.",
      content: (
        <div className="space-y-2 text-xs" id="settings-connected-accounts">
          <p className="text-[#6B7280]">Connect systems like GitHub, Stripe, or Google Analytics to instantly back-verify your operational metrics:</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button className="h-10 bg-white border border-[#E5E7EB] rounded-button flex items-center justify-center space-x-2 text-[#233A66] font-semibold hover:bg-[#F8F5EE] transition-colors">
              <span>Connect Stripe Ledger</span>
            </button>
            <button className="h-10 bg-white border border-[#E5E7EB] rounded-button flex items-center justify-center space-x-2 text-[#233A66] font-semibold hover:bg-[#F8F5EE] transition-colors">
              <span>Link GitHub Codebase</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "export",
      title: "Data Sovereignty & Portability",
      icon: Download,
      description: "Own your data. Export your entire decision journal as clean JSON or markdown files.",
      content: (
        <div className="flex items-center justify-between p-4 bg-[#FFFDF9] border border-[#FFD691] rounded-card-secondary" id="settings-export-panel">
          <div>
            <span className="text-xs font-bold text-[#233A66] block">Export Full Decisional Log</span>
            <p className="text-[10px] text-[#6B7280]">Instantly package your narrative history, reflections, and AI scores.</p>
          </div>
          <button className="px-4 py-2 bg-[#233A66] hover:bg-[#1E3055] text-white rounded-button text-xs font-bold uppercase flex items-center space-x-1.5">
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Download Package</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[760px] mx-auto py-6 px-4 md:px-6 space-y-8 text-left animate-fade-in" id="settings-view-root">
      <div className="border-b border-[#E5E7EB] pb-4" id="settings-view-header">
        <h1 className="text-2xl font-bold tracking-tight text-[#233A66] flex items-center space-x-2">
          <Settings className="w-6 h-6 text-[#233A66]" />
          <span>System Parameters & Preferences</span>
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">Configure your decisional journal parameters, security tokens, and privacy profiles.</p>
      </div>

      <div className="space-y-6" id="settings-sections-wrapper">
        {sections.map(sec => {
          const Icon = sec.icon;
          return (
            <div key={sec.id} className="bg-white border border-[#E5E7EB] rounded-card p-6 space-y-4" id={`settings-card-${sec.id}`}>
              <div className="flex items-start space-x-3" id={`settings-card-header-${sec.id}`}>
                <div className="p-2 bg-[#F8F5EE] rounded-full text-[#233A66] flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">{sec.title}</h3>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{sec.description}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#F3F4F6]" id={`settings-card-body-${sec.id}`}>
                {sec.content}
              </div>
            </div>
          );
        })}

        {/* Delete account hazard zone */}
        <div className="bg-rose-50 border border-rose-200 rounded-card p-6 space-y-4 text-left" id="settings-danger-card">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-rose-100 rounded-full text-rose-600 flex-shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">Stealth Account Erasure</h3>
              <p className="text-[11px] text-rose-800 mt-0.5">Permanently delete your profile, credentials, and all recorded decisional logs. This cannot be reversed.</p>
            </div>
          </div>
          <div className="pt-2 border-t border-rose-200/50 flex justify-end">
            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-button text-xs font-bold uppercase">
              Permanently Erasure Decisional Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
