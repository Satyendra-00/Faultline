/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Bell, Sparkles, MessageSquare, ChevronDown, Flame, ArrowLeft, LogOut } from "lucide-react";
import { Notification, Author } from "../types";
import { apiFetch } from "../utils/apiClient";

interface NavbarProps {
  profile: Author;
  onSearch: (query: string) => void;
  onCreateStory: () => void;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

export default function Navbar({ profile, onSearch, onCreateStory, onNavigate, onLogout }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [profile.storiesPublished]); // re-fetch when new story increases notification count

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => n.isUnread).length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    onNavigate("home");
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await apiFetch("/api/notifications/mark-read", { method: "POST" });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isUnread: false })));
        setUnreadCount(0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-[#D7A859]" />;
      case "MessageSquare":
        return <MessageSquare className="w-4 h-4 text-[#233A66]" />;
      default:
        return <Bell className="w-4 h-4 text-[#6B7280]" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-[72px] bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between" id="global-navbar">
      <div className="flex items-center space-x-3" id="navbar-left-controls">
        <button
          id="navbar-back-btn"
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#233A66] hover:bg-[#F3F4F6] transition-colors"
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Brand logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate("home")} id="navbar-brand-logo">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute w-full h-[2.5px] bg-[#233A66] rotate-45 transform translate-x-[-1px] rounded-full" />
            <div className="absolute w-full h-[2.5px] bg-[#D7A859] rotate-45 transform translate-x-[1.5px] translate-y-[3px] rounded-full" />
          </div>
          <span className="font-display text-2xl font-extrabold tracking-tight text-[#233A66]">
            FaultLine
          </span>
        </div>
      </div>

      {/* Global Natural Language Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-lg mx-8 relative" id="navbar-search-form">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Proactive instant search filter triggers
              onSearch(e.target.value);
            }}
            placeholder="Search hiring mistakes, founders, lessons, or decisions..."
            className="w-full h-11 pl-11 pr-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-full text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#233A66] focus:border-[#233A66] transition-all"
          />
        </div>
      </form>

      {/* Right side controls */}
      <div className="flex items-center space-x-4" id="navbar-controls-wrapper">
        {/* Streak indicator if reading */}
        {profile.readingStreak > 0 && (
          <div className="flex items-center space-x-1 px-3 py-1 bg-[#FFFBEB] border border-[#FEF3C7] rounded-full text-xs font-semibold text-[#D97706]" id="navbar-streak-badge">
            <Flame className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
            <span>{profile.readingStreak} Day Streak</span>
          </div>
        )}

        {/* Create Story trigger shortcut */}
        <button
          id="navbar-create-shortcut-btn"
          onClick={onCreateStory}
          className="hidden lg:flex items-center justify-center px-4 h-10 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-xs tracking-wide uppercase transition-all duration-150"
        >
          Share Decision
        </button>

        {/* Notifications Trigger */}
        <div className="relative" id="navbar-notif-container">
          <button
            id="navbar-notif-bell"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) fetchNotifications();
            }}
            className="relative p-2 text-[#6B7280] hover:text-[#233A66] rounded-full hover:bg-[#F3F4F6] transition-all"
          >
            <Bell className="w-[22px] h-[22px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D7A859] rounded-full ring-2 ring-white" id="notif-badge" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-[#E5E7EB] rounded-card shadow-lg py-4 z-50 text-left" id="navbar-notif-popover">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-[#E5E7EB]" id="notif-popover-header">
                <span className="font-semibold text-sm text-[#111827]">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    id="notif-mark-read-btn"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-[#D7A859] hover:text-[#233A66]"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto" id="notif-popover-list">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] text-center py-8">No notifications yet.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (notif.storyId) {
                          onNavigate(`story-${notif.storyId}`);
                        }
                      }}
                      className={`flex items-start space-x-3 p-3.5 hover:bg-[#F8F5EE] border-b border-[#F9FAFB] cursor-pointer transition-colors ${
                        notif.isUnread ? "bg-[#FFFDF9]" : ""
                      }`}
                    >
                      <div className="p-1.5 bg-[#F8F5EE] rounded-full flex-shrink-0 mt-0.5">
                        {getIcon(notif.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#233A66] truncate">{notif.title}</p>
                          {notif.isUnread && <span className="w-1.5 h-1.5 bg-[#D7A859] rounded-full" />}
                        </div>
                        <p className="text-[11px] text-[#6B7280] mt-0.5 line-clamp-2">{notif.description}</p>
                        <span className="text-[10px] text-[#9CA3AF] mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          id="navbar-logout-btn"
          onClick={onLogout}
          className="hidden sm:flex items-center justify-center w-10 h-10 text-[#6B7280] hover:text-[#233A66] rounded-full hover:bg-[#F3F4F6] transition-all"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>

        {/* User Profile Avatar block */}
        <div
          onClick={() => onNavigate("profile")}
          className="flex items-center space-x-2.5 pl-2 cursor-pointer border-l border-[#E5E7EB] hover:opacity-90"
          id="navbar-profile-trigger"
        >
          <img
            id="navbar-avatar-img"
            src={profile.avatar}
            alt={profile.name}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-[#233A66]/10"
          />
          <div className="hidden lg:block text-left" id="navbar-profile-meta">
            <p className="text-xs font-bold text-[#233A66] truncate max-w-[120px]">{profile.name}</p>
            <p className="text-[10px] text-[#6B7280] truncate max-w-[120px]">{profile.headline}</p>
          </div>
          <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-[#6B7280]" />
        </div>
      </div>
    </header>
  );
}
