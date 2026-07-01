/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { TrendingUp, UserPlus, UserCheck, BookOpen, ArrowRight, Star } from "lucide-react";
import { TrendingLesson, TrendingFounder, TrendingTopic } from "../types";

interface RightPanelProps {
  onSelectTopic: (topic: string) => void;
  onSelectStory: (storyId: string) => void;
}

export default function RightPanel({ onSelectTopic, onSelectStory }: RightPanelProps) {
  const [lessons, setLessons] = useState<TrendingLesson[]>([]);
  const [founders, setFounders] = useState<TrendingFounder[]>([]);
  const [topics, setTopics] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    // Premium pre-seeded dashboard stats conforming to the PRD
    setLessons([
      {
        id: "story-1",
        title: "horizontal Cassandra split pre-PMF",
        shortDescription: "How premature scaling cost Marcus Chen's team $120,000.",
        readersCount: 4210,
        category: "Startup",
      },
      {
        id: "story-2",
        title: "Enterprise chasing vs. Core Prosumers",
        shortDescription: "Sarah Jenkins on why ignoring active freelancers cost 24% customer base.",
        readersCount: 1890,
        category: "Product",
      },
    ]);

    setFounders([
      {
        id: "f-1",
        name: "Marcus Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        headline: "CTO at Veloce",
        followers: 1240,
        latestLesson: "Avoid database migrations pre-PMF",
        isFollowing: false,
      },
      {
        id: "f-2",
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        headline: "Product Lead at DrawFlow",
        followers: 890,
        latestLesson: "Nurture atomic prosumers",
        isFollowing: true,
      },
    ]);

    setTopics([
      { id: "t-1", name: "Scaling Failures", storyCount: 4, weeklyGrowth: "+18%" },
      { id: "t-2", name: "Hiring Mistakes", storyCount: 8, weeklyGrowth: "+24%" },
      { id: "t-3", name: "Fundraising Errors", storyCount: 3, weeklyGrowth: "+12%" },
    ]);
  }, []);

  const handleFollowToggle = (id: string) => {
    setFounders(prev =>
      prev.map(f => {
        if (f.id === id) {
          const updatedState = !f.isFollowing;
          return {
            ...f,
            isFollowing: updatedState,
            followers: updatedState ? f.followers + 1 : f.followers - 1,
          };
        }
        return f;
      })
    );
  };

  return (
    <div className="space-y-8 sticky top-24" id="right-panel-root">
      {/* Premium Contribution Stats summary */}
      <div className="bg-[#233A66] rounded-card p-6 text-white text-left relative overflow-hidden" id="premium-ad-card">
        <div className="absolute right-[-15px] top-[-15px] w-24 h-24 rounded-full bg-[#D7A859] opacity-10" />
        <span className="px-2.5 py-0.5 text-[9px] font-bold text-[#233A66] bg-[#FFD691] rounded-full uppercase tracking-wider">
          Decision Rank
        </span>
        <h4 className="text-lg font-bold tracking-tight mt-2 text-[#FFD691]">
          Top Contributor Program
        </h4>
        <p className="text-xs text-[#E5E7EB] mt-1.5 leading-relaxed">
          Unlock your custom executive score. Share transparent post-mortems and gain professional validation across the platform.
        </p>
        <div className="mt-4 flex items-center space-x-2 text-[#FFD691] font-bold text-xs" id="rank-stars">
          <Star className="w-4 h-4 fill-[#FFD691]" />
          <span>Average AI helpfulness score must exceed 4.5</span>
        </div>
      </div>

      {/* Trending Lessons Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-card p-6 text-left" id="trending-lessons-card">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#D7A859]" />
          <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider">
            Trending Lessons
          </h3>
        </div>
        <div className="space-y-4" id="trending-lessons-list">
          {lessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => onSelectStory(lesson.id)}
              className="group cursor-pointer border-b border-[#F9FAFB] pb-3 last:border-0 last:pb-0"
            >
              <span className="text-[9px] font-bold text-[#D7A859] bg-[#FFFDF9] border border-[#FFD691]/50 px-1.5 py-0.5 rounded uppercase font-mono">
                {lesson.category}
              </span>
              <h4 className="text-xs font-bold text-[#111827] mt-1.5 group-hover:text-[#233A66] transition-colors line-clamp-1">
                {lesson.title}
              </h4>
              <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-0.5 leading-relaxed">
                {lesson.shortDescription}
              </p>
              <span className="text-[10px] text-[#9CA3AF] mt-1 block">
                {lesson.readersCount.toLocaleString()} builders reading
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Founders Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-card p-6 text-left" id="trending-founders-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider">
            Featured Builders
          </h3>
        </div>
        <div className="space-y-4.5" id="trending-founders-list">
          {founders.map(founder => (
            <div key={founder.id} className="flex items-start justify-between space-x-2 pb-3 border-b border-[#F9FAFB] last:border-0 last:pb-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <img
                  src={founder.avatar}
                  alt={founder.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB]"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#111827] truncate">{founder.name}</h4>
                  <p className="text-[10px] text-[#6B7280] truncate">{founder.headline}</p>
                  <p className="text-[9px] text-[#D7A859] italic truncate mt-0.5">"{founder.latestLesson}"</p>
                </div>
              </div>
              <button
                id={`founder-follow-${founder.id}`}
                onClick={() => handleFollowToggle(founder.id)}
                className={`p-1.5 rounded-full transition-all flex-shrink-0 ${
                  founder.isFollowing
                    ? "bg-[#F8F5EE] text-[#D7A859]"
                    : "bg-[#233A66]/5 hover:bg-[#233A66]/10 text-[#233A66]"
                }`}
                title={founder.isFollowing ? "Following" : "Follow builder"}
              >
                {founder.isFollowing ? (
                  <UserCheck className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics list */}
      <div className="bg-white border border-[#E5E7EB] rounded-card p-6 text-left" id="trending-topics-card">
        <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider mb-4">
          Hot Decisional Topics
        </h3>
        <div className="space-y-3" id="trending-topics-list">
          {topics.map(topic => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.name)}
              className="flex items-center justify-between cursor-pointer p-2 rounded-card-secondary hover:bg-[#F8F5EE] transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-[#111827]">#{topic.name}</span>
                <span className="text-[10px] text-[#6B7280] block mt-0.5">{topic.storyCount} active debriefings</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 font-mono">{topic.weeklyGrowth}</span>
                <span className="text-[9px] text-[#9CA3AF] block mt-0.5">weekly</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
