/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, BookOpen, Star, Sparkles, MessageCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Story } from "../types";

interface ExploreProps {
  stories: Story[];
  onSelectStory: (storyId: string) => void;
  onSelectCategory: (category: string) => void;
}

export default function Explore({ stories, onSelectStory, onSelectCategory }: ExploreProps) {
  const quickSearches = [
    "Stories about hiring mistakes",
    "Fundraising failures",
    "Product pricing mistakes",
    "Premature horizontal database scaling",
    "Technical debt bottlenecks",
    "Ignoring core prosumers"
  ];

  return (
    <div className="max-w-[760px] mx-auto py-6 px-4 md:px-6 space-y-8 text-left animate-fade-in" id="explore-view-root">
      <div className="border-b border-[#E5E7EB] pb-4" id="explore-view-header">
        <h1 className="text-2xl font-bold tracking-tight text-[#233A66] flex items-center space-x-2">
          <Compass className="w-6 h-6 text-[#233A66]" />
          <span>Curated Decision Index</span>
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">Explore real experiences cataloged by developers, designers, product managers, and founders.</p>
      </div>

      {/* Suggested prompts for natural language search co-pilot */}
      <div className="space-y-3" id="explore-prompts-section">
        <h3 className="font-display font-bold text-xs text-[#233A66] uppercase tracking-wider">Suggested Decisional Audits</h3>
        <div className="flex flex-wrap gap-2.5" id="explore-prompts-list">
          {quickSearches.map((promptText, idx) => (
            <button
              key={idx}
              id={`quick-search-prompt-${idx}`}
              onClick={() => {
                // Set query in global search field proxy
                const globalSearchInput = document.getElementById("navbar-search-input") as HTMLInputElement;
                if (globalSearchInput) {
                  globalSearchInput.value = promptText;
                  const e = new Event("input", { bubbles: true });
                  globalSearchInput.dispatchEvent(e);
                  // Focus
                  globalSearchInput.focus();
                }
              }}
              className="px-3.5 py-2 bg-white hover:bg-[#F8F5EE] border border-[#E5E7EB] rounded-button text-xs font-medium text-[#6B7280] hover:text-[#233A66] transition-all cursor-pointer shadow-sm"
            >
              "{promptText}"
            </button>
          ))}
        </div>
      </div>

      {/* Category domain shortcuts */}
      <div className="space-y-4" id="explore-categories-section">
        <h3 className="font-display font-bold text-xs text-[#233A66] uppercase tracking-wider">Domain Portals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="explore-categories-grid">
          {[
            { name: "Startup", desc: "Seed dynamics, PMF iterations, founder alignment.", count: "12 active retrospectives", icon: Star, color: "text-[#D7A859] bg-[#FFFDF9] border-[#FFD691]" },
            { name: "Product", desc: "SSO requirements, prosumer priorities, feature loops.", count: "15 active retrospectives", icon: BookOpen, color: "text-[#233A66] bg-[#F8F5EE] border-[#E5E7EB]" },
            { name: "Engineering", desc: "Database scaling compromises, microservices issues.", count: "8 active retrospectives", icon: Sparkles, color: "text-[#D7A859] bg-[#FFFDF9] border-[#FFD691]" },
            { name: "Leadership", desc: "Co-founder equity arguments, team burnouts, hiring mistakes.", count: "6 active retrospectives", icon: AlertTriangle, color: "text-rose-600 bg-rose-50 border-rose-200" },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                id={`domain-portal-${cat.name}`}
                onClick={() => onSelectCategory(cat.name)}
                className={`p-5 rounded-card border ${cat.color} flex flex-col justify-between cursor-pointer hover:shadow-md transition-all`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm uppercase tracking-wide">{cat.name} Domain</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]/50 mt-4 text-[10px] font-semibold text-[#6B7280]">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured articles panel */}
      <div className="space-y-4" id="explore-featured-section">
        <h3 className="font-display font-bold text-xs text-[#233A66] uppercase tracking-wider">Curated Case Studies</h3>
        <div className="space-y-4" id="explore-featured-list">
          {stories.map(story => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story.id)}
              className="p-5 bg-white border border-[#E5E7EB] hover:border-[#233A66]/30 rounded-card flex justify-between items-center cursor-pointer transition-all hover:shadow-sm"
            >
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 text-[9px] font-bold text-[#D7A859] bg-[#FFFDF9] border border-[#FFD691] rounded uppercase font-mono">
                  #{story.category}
                </span>
                <h4 className="text-sm font-bold text-[#111827]">{story.title}</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-1 italic">"{story.keyLesson}"</p>
                <div className="flex items-center space-x-2 text-[10px] text-[#9CA3AF] pt-0.5">
                  <span>By {story.author.name}</span>
                  <span>•</span>
                  <span>{story.readingTime}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9CA3AF] shrink-0 ml-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
