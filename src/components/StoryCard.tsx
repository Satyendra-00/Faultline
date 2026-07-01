/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  MessageSquare,
  Repeat2,
  Bookmark,
  Share2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  MoreHorizontal,
  Clock,
  Coins,
  TrendingUp,
  Cpu,
  Users
} from "lucide-react";
import { Story } from "../types";

interface StoryCardProps {
  key?: string;
  story: Story;
  onLike: (storyId: string) => void;
  onBookmark: (storyId: string) => void;
  onSelectStory: (storyId: string) => void;
}

export default function StoryCard({ story, onLike, onBookmark, onSelectStory }: StoryCardProps) {
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/api/stories/${story.id}`);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const getRootCauseBadgeColor = (cause: string) => {
    switch (cause.toLowerCase()) {
      case "scaling too early":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "weak customer research":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "technical debt":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <article
      id={`story-card-${story.id}`}
      onClick={() => onSelectStory(story.id)}
      className="w-full bg-white border border-[#E5E7EB] rounded-card hover:border-[#233A66]/30 hover:shadow-md transition-all duration-200 cursor-pointer p-6 md:p-8 space-y-6"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between" id="card-header-row">
        <div className="flex items-center space-x-3.5" id="card-author-info">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F8F5EE]"
            id="card-author-avatar"
          />
          <div className="text-left" id="card-author-meta">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-[#111827] text-sm hover:underline">{story.author.name}</span>
              {story.author.isVerified && (
                <Award className="w-4 h-4 text-[#D7A859] fill-[#FFD691]/20" aria-label="Verified Professional" />
              )}
            </div>
            <p className="text-xs text-[#6B7280] truncate max-w-[280px]">
              {story.author.headline}
            </p>
            <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-[#9CA3AF]">
              <span>{story.time}</span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-0.5 text-[#9CA3AF]" />
                {story.readingTime}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2" id="card-header-badge-controls">
          <span className="px-2.5 py-1 text-[11px] font-bold text-[#233A66] bg-[#F8F5EE] border border-[#E5E7EB] rounded-full uppercase tracking-wider">
            {story.category}
          </span>
          <button className="p-1.5 text-[#9CA3AF] hover:text-[#111827] rounded-full hover:bg-[#F3F4F6] transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2 text-left" id="card-title-group">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#111827] leading-tight hover:text-[#233A66] transition-colors line-clamp-2">
          {story.title}
        </h3>
        {story.summary && (
          <p className="text-[#6B7280] text-sm line-clamp-2 leading-relaxed">
            {story.summary}
          </p>
        )}
      </div>

      {/* Structured Content Preview (3 main sections) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-[#F3F4F6] py-5 text-left" id="card-structured-grid">
        <div className="space-y-1.5" id="card-context-section">
          <h4 className="text-xs font-bold text-[#233A66] uppercase tracking-wider">Context</h4>
          <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
            {story.context.situation}
          </p>
        </div>
        <div className="space-y-1.5 bg-[#FFFDF9] border border-[#FFD691]/20 rounded-card-secondary p-3.5" id="card-decision-section">
          <h4 className="text-xs font-bold text-[#D7A859] uppercase tracking-wider flex items-center">
            <span>Decision</span>
            <span className="ml-1 text-[9px] font-medium text-[#D7A859] uppercase tracking-normal font-mono bg-white border border-[#FFD691] px-1 rounded">Turning Point</span>
          </h4>
          <p className="text-xs text-[#111827] font-semibold leading-relaxed line-clamp-3">
            {story.decision.action}
          </p>
        </div>
        <div className="space-y-1.5" id="card-outcome-section">
          <h4 className="text-xs font-bold text-[#233A66] uppercase tracking-wider">Outcome</h4>
          <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
            {story.outcome.whatHappened}
          </p>
        </div>
      </div>

      {/* Key Lesson highlighted */}
      <div className="p-4 bg-[#F8F5EE] border-l-2 border-[#233A66] rounded-r-card-secondary text-left" id="card-lesson-block">
        <span className="text-[10px] font-bold text-[#233A66] uppercase tracking-widest block mb-1">Key Lesson</span>
        <p className="text-sm font-semibold text-[#111827] leading-relaxed">
          "{story.keyLesson}"
        </p>
      </div>

      {/* AI Premium Expandable Preview */}
      {story.aiAnalysis && (
        <div
          id="card-ai-preview-panel"
          onClick={(e) => e.stopPropagation()}
          className="bg-[#FFFDF9] border border-[#FFD691]/50 rounded-card-secondary p-5 text-left transition-all duration-200"
        >
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsAiExpanded(!isAiExpanded)}>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D7A859]" />
              <span className="font-display text-xs font-bold text-[#233A66] tracking-wide uppercase">AI Decision Intelligence</span>
              <span className="px-2 py-0.5 text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold font-mono">
                {story.aiAnalysis.confidenceScore}% Confidence
              </span>
            </div>
            <button className="text-[#D7A859] hover:text-[#233A66] transition-colors">
              {isAiExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-semibold">Root Cause</span>
              <span className={`inline-block px-2 py-0.5 text-[11px] font-medium border rounded mt-1 ${getRootCauseBadgeColor(story.aiAnalysis.rootCause)}`}>
                {story.aiAnalysis.rootCause}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-semibold">Decision Bias</span>
              <span className="text-xs font-bold text-[#233A66] mt-1 block">
                {story.aiAnalysis.decisionBias.name}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-semibold">Risk Level</span>
              <span className={`text-xs font-bold mt-1 block ${
                story.aiAnalysis.riskLevel === "High" ? "text-rose-600" : "text-amber-600"
              }`}>
                {story.aiAnalysis.riskLevel} Risk Profile
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-semibold">Weeks Compromised</span>
              <span className="text-xs font-bold text-[#111827] mt-1 block">
                {story.aiAnalysis.businessImpact.timeLostWeeks || 0} Weeks Lost
              </span>
            </div>
          </div>

          <AnimatePresence>
            {isAiExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-[#FFD691]/30 mt-4 space-y-4 text-xs text-[#6B7280]">
                  <div>
                    <span className="font-bold text-[#233A66] block mb-1">Bias Retrospective</span>
                    <p className="leading-relaxed">{story.aiAnalysis.decisionBias.whyItHappened}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#233A66] block mb-1">Recommended Alternative Course</span>
                    <p className="leading-relaxed text-[#111827] font-medium">{story.aiAnalysis.alternativeStrategy}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-[#F8F5EE] p-3 rounded-card-secondary">
                    {story.aiAnalysis.businessImpact.teamCostUSD && (
                      <div className="flex items-center space-x-1.5">
                        <Coins className="w-3.5 h-3.5 text-[#D7A859]" />
                        <span>Capital wasted: <strong>${story.aiAnalysis.businessImpact.teamCostUSD.toLocaleString()}</strong></span>
                      </div>
                    )}
                    {story.aiAnalysis.businessImpact.engineeringCostHours && (
                      <div className="flex items-center space-x-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#D7A859]" />
                        <span>Dev cycles lost: <strong>{story.aiAnalysis.businessImpact.engineeringCostHours} hrs</strong></span>
                      </div>
                    )}
                    {story.aiAnalysis.businessImpact.customerImpactPercent && (
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-[#D7A859]" />
                        <span>Users disrupted: <strong>{story.aiAnalysis.businessImpact.customerImpactPercent}%</strong></span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onSelectStory(story.id)}
                    className="w-full h-9 bg-white border border-[#FFD691] hover:bg-[#FFFDF9] text-[#D7A859] font-bold rounded-button text-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>View Full Deep Intelligence Case Study</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Interactions */}
      <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-4 text-sm" id="card-footer-bar">
        <div className="flex items-center space-x-5" id="card-interactions-left">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(story.id);
            }}
            className={`flex items-center space-x-1.5 hover:text-rose-600 transition-colors ${
              story.hasLiked ? "text-rose-600 font-semibold" : "text-[#6B7280]"
            }`}
            id="card-like-btn"
          >
            <Heart className={`w-[18px] h-[18px] ${story.hasLiked ? "fill-rose-600" : ""}`} />
            <span>{story.likes}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectStory(story.id);
            }}
            className="flex items-center space-x-1.5 text-[#6B7280] hover:text-[#233A66] transition-colors"
            id="card-comment-btn"
          >
            <MessageSquare className="w-[18px] h-[18px]" />
            <span>{story.commentsCount}</span>
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-1.5 text-[#6B7280] hover:text-[#233A66] transition-colors"
            id="card-repost-btn"
          >
            <Repeat2 className="w-[18px] h-[18px]" />
            <span>{story.reposts}</span>
          </button>
        </div>

        <div className="flex items-center space-x-3" id="card-interactions-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(story.id);
            }}
            className={`p-1.5 rounded-full hover:bg-[#F3F4F6] transition-colors ${
              story.hasBookmarked ? "text-[#D7A859]" : "text-[#6B7280]"
            }`}
            id="card-bookmark-btn"
            title="Bookmark Experience"
          >
            <Bookmark className={`w-[18px] h-[18px] ${story.hasBookmarked ? "fill-[#D7A859]" : ""}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#233A66] transition-colors relative"
            id="card-share-btn"
            title="Copy reference link"
          >
            <Share2 className="w-[18px] h-[18px]" />
            {hasCopied && (
              <span className="absolute -top-8 right-0 bg-[#233A66] text-white text-[10px] px-2 py-0.5 rounded shadow-sm font-sans font-medium animate-fade-in-down">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
