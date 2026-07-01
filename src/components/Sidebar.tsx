/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Compass, TrendingUp, Bookmark, Sparkles, User, Settings, PenTool, LogOut } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreateStory: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onCreateStory, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "ai-insights", label: "AI Insights", icon: Sparkles },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-full h-full flex flex-col justify-between py-6 text-left" id="sidebar-container">
      <div className="space-y-6" id="sidebar-top-wrapper">
        <nav className="space-y-1.5" id="sidebar-navigation">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-card-secondary font-medium text-sm transition-all duration-150 group ${
                  isActive
                    ? "bg-[#233A66] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-[#233A66] hover:bg-[#F3F4F6]"
                }`}
              >
                <IconComponent
                  className={`w-[22px] h-[22px] stroke-[1.8] transition-colors ${
                    isActive ? "text-white" : "text-[#6B7280] group-hover:text-[#233A66]"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 px-2" id="sidebar-action-container">
          <button
            id="sidebar-create-btn"
            onClick={onCreateStory}
            className="w-full h-11 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-sm transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm"
          >
            <PenTool className="w-4 h-4 text-[#FFD691]" />
            <span>Document Story</span>
          </button>
        </div>
      </div>

      {/* Subtle Bottom Branding Meta-Statement */}
      <div className="px-4 py-4 border-t border-[#E5E7EB] mt-6 text-[11px] text-[#9CA3AF] font-mono leading-relaxed" id="sidebar-footprint">
        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="mb-4 w-full h-10 flex items-center justify-center space-x-2 rounded-button border border-[#E5E7EB] bg-white text-xs font-bold uppercase tracking-wide text-[#6B7280] hover:text-[#233A66] hover:border-[#233A66]/30 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
        <p className="font-semibold text-[#6B7280]">FAULTLINE v1.0.4</p>
        <p>Premium Decision Network</p>
      </div>
    </aside>
  );
}
