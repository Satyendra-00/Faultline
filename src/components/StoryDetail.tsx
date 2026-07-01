/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Repeat2,
  Bookmark,
  Share2,
  Award,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Coins,
  TrendingUp,
  Cpu,
  Users,
  Compass,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { Story, Comment } from "../types";

interface StoryDetailProps {
  story: Story;
  onBack: () => void;
  onLike: (storyId: string) => void;
  onBookmark: (storyId: string) => void;
  onAddComment: (storyId: string, commentText: string) => void;
}

export default function StoryDetail({ story, onBack, onLike, onBookmark, onAddComment }: StoryDetailProps) {
  const [commentInput, setCommentText] = useState("");
  const [isAiExpanded, setIsAiExpanded] = useState(true);
  const [hasCopied, setHasCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/api/stories/${story.id}`);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(story.id, commentInput);
    setCommentText("");
  };

  return (
    <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-6 px-4 md:px-6" id="story-detail-root">
      {/* Main Story column - 720-760px wide equivalent mapping */}
      <main className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-card p-6 md:p-10 space-y-8 text-left" id="story-detail-main">
        {/* Back navigation Row */}
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-[#233A66] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Decision Feed</span>
        </button>

        {/* Story Header */}
        <div className="space-y-4" id="detail-header-wrapper">
          <div className="flex items-center space-x-3.5" id="detail-author-avatar-row">
            <img
              src={story.author.avatar}
              alt={story.author.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#F8F5EE]"
            />
            <div id="detail-author-metadata">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-[#111827] text-base">{story.author.name}</span>
                {story.author.isVerified && (
                  <Award className="w-4 h-4 text-[#D7A859] fill-[#FFD691]/20" aria-label="Verified Professional" />
                )}
              </div>
              <p className="text-xs text-[#6B7280]">{story.author.headline}</p>
              <div className="flex items-center space-x-2 mt-1 text-[11px] text-[#9CA3AF]">
                <span>{story.time}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-0.5 text-[#9CA3AF]" />
                  {story.readingTime}
                </span>
                <span>•</span>
                <span className="font-semibold text-[#233A66]">{story.category}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2" id="detail-title-panel">
            <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827] leading-tight">
              {story.title}
            </h1>
            {/* Short sentence summarizing the lesson as requested in PRD */}
            <div className="p-3.5 bg-[#FFFDF9] border border-[#FFD691] rounded-card-secondary text-sm font-semibold italic text-[#D7A859]" id="detail-tagline">
              "{story.keyLesson}"
            </div>
          </div>
        </div>

        {/* Structured Body: Context -> Decision -> Outcome -> Reflection -> Key Lesson */}
        <div className="space-y-8 pt-4 border-t border-[#F3F4F6]" id="detail-structured-body">
          {/* Section 1: Context */}
          <div className="space-y-2.5 text-left" id="detail-context-section">
            <h2 className="text-xs font-bold text-[#233A66] uppercase tracking-widest font-mono">1. Situation Context</h2>
            <p className="text-[#111827] text-sm md:text-base leading-relaxed font-sans">
              {story.context.situation}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2" id="context-metrics-grid">
              <div className="p-3 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
                <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Stage</span>
                <span className="text-xs font-bold text-[#233A66] mt-0.5 block">{story.context.stage}</span>
              </div>
              <div className="p-3 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
                <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Capital state</span>
                <span className="text-xs font-bold text-[#233A66] mt-0.5 block">{story.context.funding}</span>
              </div>
              <div className="p-3 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary col-span-2">
                <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Preexisting assumptions</span>
                <span className="text-xs font-bold text-[#233A66] mt-0.5 block line-clamp-1">{story.context.assumptions}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Decision */}
          <div className="space-y-2.5 text-left p-6 bg-[#FFFDF9] border border-[#FFD691]/40 rounded-card" id="detail-decision-section">
            <h2 className="text-xs font-bold text-[#D7A859] uppercase tracking-widest font-mono flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-[#D7A859]" />
              <span>2. Executive Decision Taken</span>
            </h2>
            <p className="text-[#233A66] text-sm md:text-base font-semibold leading-relaxed">
              {story.decision.action}
            </p>
            <div className="pt-2 text-xs text-[#6B7280] space-y-1.5" id="decision-meta-reasons">
              <p>
                <strong>Justification at the time:</strong> {story.decision.whyCorrectThen}
              </p>
              {story.decision.emotionalFactors && (
                <p>
                  <strong>Cognitive / Emotional factors:</strong> {story.decision.emotionalFactors}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Outcome */}
          <div className="space-y-2.5 text-left" id="detail-outcome-section">
            <h2 className="text-xs font-bold text-[#233A66] uppercase tracking-widest font-mono">3. Operational Outcomes</h2>
            <p className="text-[#111827] text-sm leading-relaxed">
              {story.outcome.whatHappened}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3" id="outcome-consequence-panels">
              {story.outcome.negatives && (
                <div className="p-4 border border-[#E5E7EB] rounded-card-secondary space-y-1">
                  <div className="text-xs font-bold text-rose-600 uppercase tracking-wide flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    Negative consequences
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{story.outcome.negatives}</p>
                </div>
              )}
              {story.outcome.positives && (
                <div className="p-4 border border-[#E5E7EB] rounded-card-secondary space-y-1">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center">
                    <Lightbulb className="w-3.5 h-3.5 mr-1" />
                    Silver lining takeaways
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{story.outcome.positives}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Reflection */}
          <div className="space-y-2.5 text-left bg-[#F8F5EE] border border-[#E5E7EB] rounded-card p-6" id="detail-reflection-section">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest font-mono">4. Intellectual Retrospective</h2>
            <div className="space-y-3 pt-1 text-xs text-[#111827]" id="reflection-retrospective-blocks">
              <div>
                <span className="block font-bold text-[#233A66]">What we misunderstood completely:</span>
                <p className="text-[#6B7280] mt-0.5 leading-relaxed">{story.reflection.misunderstood}</p>
              </div>
              <div>
                <span className="block font-bold text-[#233A66]">The biggest surprise along the way:</span>
                <p className="text-[#6B7280] mt-0.5 leading-relaxed">{story.reflection.surprised}</p>
              </div>
              <div>
                <span className="block font-bold text-rose-600">What we will NEVER repeat in our careers:</span>
                <p className="text-[#6B7280] mt-0.5 leading-relaxed font-medium">"{story.reflection.neverRepeat}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Discussion Box */}
        <div className="border-t border-[#F3F4F6] pt-8 text-left space-y-6" id="detail-comments-container">
          <h3 className="font-display text-lg font-bold text-[#233A66]">Professional Discussion</h3>

          {/* Comment Composer */}
          <form onSubmit={handleCommentSubmit} className="flex gap-4 items-start" id="detail-comment-form">
            <div className="w-10 h-10 rounded-full bg-[#233A66]/10 flex items-center justify-center font-bold text-[#233A66] text-xs">
              M
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                id="comment-input"
                rows={3}
                value={commentInput}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share critical insights, alternative perspectives, or questions. Avoid simple one-word comments."
                className="w-full p-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] focus:bg-white resize-none transition-all"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#9CA3AF]">Threaded professional conversations are moderated for depth.</span>
                <button
                  id="comment-submit-btn"
                  type="submit"
                  className="px-4 py-2 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-xs transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </form>

          {/* Threaded Comment list */}
          <div className="space-y-4 pt-4" id="detail-comments-list">
            {story.comments.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] text-center py-6">No discussions started yet. Be the first to share your perspective!</p>
            ) : (
              story.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3.5 pb-4 border-b border-[#F9FAFB] last:border-0" id={`comment-item-${comment.id}`}>
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">{comment.authorName}</span>
                      <span className="text-[10px] text-[#9CA3AF]">{comment.time}</span>
                    </div>
                    <p className="text-[10px] text-[#6B7280]">{comment.authorHeadline}</p>
                    <p className="text-xs text-[#111827] leading-relaxed pt-1">{comment.comment}</p>
                    <div className="flex items-center space-x-3 pt-1 text-[10px] text-[#9CA3AF]">
                      <button className="hover:text-rose-600">Like ({comment.likes})</button>
                      <span>•</span>
                      <button className="hover:text-[#233A66]">Reply</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Right AI Decision Intelligence Panel (Premium Expandable Case Study Card) */}
      <aside className="lg:col-span-4 space-y-6" id="story-detail-sidebar">
        {story.aiAnalysis ? (
          <div className="bg-[#FFFDF9] border border-[#FFD691] rounded-card p-6 text-left space-y-5" id="detail-ai-pane">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#FFD691]/30">
              <Sparkles className="w-5 h-5 text-[#D7A859]" />
              <div>
                <h3 className="font-display font-extrabold text-sm text-[#233A66] tracking-wide uppercase">AI Meta-Analysis</h3>
                <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-mono">
                  {story.aiAnalysis.confidenceScore}% Confidence Framework
                </span>
              </div>
            </div>

            {/* Root Cause Card */}
            <div>
              <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Identified Root Cause</span>
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-card-secondary mt-1 font-bold text-xs text-[#233A66]">
                {story.aiAnalysis.rootCause}
              </div>
            </div>

            {/* Decision Bias Card */}
            <div className="space-y-1">
              <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Psychological Bias</span>
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-card-secondary mt-1">
                <span className="font-bold text-xs text-[#D7A859] block mb-1">{story.aiAnalysis.decisionBias.name}</span>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">{story.aiAnalysis.decisionBias.description}</p>
                <div className="pt-2 border-t border-[#F3F4F6] mt-2 text-[10px] text-[#6B7280] leading-relaxed italic">
                  <strong>Why it triggered:</strong> {story.aiAnalysis.decisionBias.whyItHappened}
                </div>
              </div>
            </div>

            {/* Business Impact metrics */}
            <div className="space-y-1">
              <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Calculated Impact Profile</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="p-2.5 bg-white border border-[#E5E7EB] rounded-card-secondary flex flex-col justify-between">
                  <span className="text-[9px] text-[#9CA3AF] uppercase">Lost Capital</span>
                  <span className="text-xs font-bold text-rose-600 mt-1">${story.aiAnalysis.businessImpact.teamCostUSD ? story.aiAnalysis.businessImpact.teamCostUSD.toLocaleString() : "0"}</span>
                </div>
                <div className="p-2.5 bg-white border border-[#E5E7EB] rounded-card-secondary flex flex-col justify-between">
                  <span className="text-[9px] text-[#9CA3AF] uppercase">Roadmap lag</span>
                  <span className="text-xs font-bold text-[#233A66] mt-1">{story.aiAnalysis.businessImpact.timeLostWeeks || 0} Weeks</span>
                </div>
              </div>
            </div>

            {/* Alternative strategy recommendations */}
            <div>
              <span className="block text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Alternative Strategy Recommendation</span>
              <div className="p-3 bg-white border border-[#FFD691]/30 rounded-card-secondary mt-1 text-[11px] text-[#111827] leading-relaxed">
                {story.aiAnalysis.alternativeStrategy}
              </div>
            </div>

            {/* Transferable Lessons */}
            <div className="p-4 bg-[#233A66] text-white rounded-card-secondary">
              <span className="text-[9px] font-bold text-[#FFD691] uppercase tracking-widest block mb-1">Transferable Takeaway</span>
              <p className="text-xs font-medium leading-relaxed">
                "{story.aiAnalysis.transferableLesson}"
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFDF9] border border-[#FFD691] rounded-card p-6 text-center py-10 text-[#D7A859]" id="detail-ai-loading">
            <Sparkles className="w-8 h-8 animate-spin mx-auto mb-3" />
            <span className="font-display text-xs font-bold uppercase block tracking-wider">Generating Decision Intelligence...</span>
            <p className="text-[10px] text-[#6B7280] mt-1.5 leading-relaxed">Gemini is processing executive schemas, psychological parameters, and business metrics mapping.</p>
          </div>
        )}

        {/* Read interactions stick sidebar */}
        <div className="bg-white border border-[#E5E7EB] rounded-card p-6 space-y-4" id="detail-stats-card">
          <h4 className="font-display font-bold text-xs text-[#233A66] uppercase tracking-wider">Story Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="border-r border-[#F3F4F6] py-1">
              <span className="text-xs text-[#6B7280]">Views</span>
              <span className="block font-mono font-bold text-sm text-[#111827] mt-0.5">{story.views}</span>
            </div>
            <div className="py-1">
              <span className="text-xs text-[#6B7280]">Reads</span>
              <span className="block font-mono font-bold text-sm text-[#111827] mt-0.5">{story.reads || Math.round(story.views * 0.4)}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-[#F3F4F6] flex justify-between text-xs text-[#6B7280]">
            <span>Average Reading Time:</span>
            <strong className="text-[#111827]">{story.readingTime}</strong>
          </div>
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>AI Helpfulness rating:</span>
            <strong className="text-[#D7A859]">{story.aiHelpfulnessRating || "4.8"} / 5.0</strong>
          </div>
        </div>
      </aside>
    </div>
  );
}
