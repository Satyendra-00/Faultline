/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Sparkles, Star, AlertTriangle, TrendingUp, Compass, CheckCircle, Flame } from "lucide-react";
import { Story } from "../types";

interface AiInsightsProps {
  stories: Story[];
  onSelectStory: (storyId: string) => void;
}

export default function AiInsights({ stories, onSelectStory }: AiInsightsProps) {
  const [activeBias, setActiveBias] = useState<string | null>(null);

  const biases = [
    {
      name: "Confirmation Bias",
      incidence: "Occurred in 34% of documented cases",
      desc: "The tendency to listen only to feedback that confirms our positive assumptions while filtering negative metrics.",
      solution: "Force a monthly customer advisory meeting containing only churned accounts. Explicitly mandate tracking churn patterns."
    },
    {
      name: "Optimism Bias",
      incidence: "Occurred in 28% of documented cases",
      desc: "Assuming your team can build complex vertical integrations flawlessly with no roadmap delays or personnel exhaustion.",
      solution: "Always double codebase estimations when implementing custom multi-region setups or databases."
    },
    {
      name: "Sunk Cost Fallacy",
      incidence: "Occurred in 19% of documented cases",
      desc: "Continuing to fund an unvalidated enterprise SSO priority because the team already invested 3 months of dev bills.",
      solution: "Define time-boxed pilots. If zero pilot contracts sign within 4 months, abort priorities immediately."
    }
  ];

  return (
    <div className="max-w-[760px] mx-auto py-6 px-4 md:px-6 space-y-8 text-left animate-fade-in" id="ai-insights-view-root">
      <div className="border-b border-[#E5E7EB] pb-4" id="ai-insights-view-header">
        <h1 className="text-2xl font-bold tracking-tight text-[#233A66] flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-[#D7A859]" />
          <span>Decision Intelligence Board</span>
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">Aggregated learning statistics, psychological risk maps, and executive co-pilot frameworks.</p>
      </div>

      {/* Community Impact Statistics Card */}
      <div className="bg-[#233A66] rounded-card p-6 text-white relative overflow-hidden" id="ai-insights-aggregated-stats">
        <div className="absolute right-[-20px] top-[-20px] w-28 h-28 rounded-full bg-[#D7A859]/10" />
        <span className="px-2 py-0.5 text-[9px] font-bold text-[#233A66] bg-[#FFD691] rounded-full uppercase tracking-wider">
          Aggregated Meta-metrics
        </span>
        <h3 className="text-lg font-bold mt-2 text-[#FFD691]">Community Losses Audited</h3>
        <p className="text-xs text-[#E5E7EB] mt-1 leading-relaxed">
          Through transparent disclosure, FaultLine has mapped critical executive pitfalls to save future founders money and timeline delays.
        </p>

        <div className="grid grid-cols-3 gap-4 border-t border-[#FFFFFF]/10 pt-4 mt-4 text-center">
          <div>
            <span className="text-[10px] text-[#E5E7EB] uppercase block">Cumulative capital audited</span>
            <span className="text-base md:text-xl font-bold text-[#FFD691] font-mono mt-1 block">$396,000</span>
          </div>
          <div className="border-l border-[#FFFFFF]/10">
            <span className="text-[10px] text-[#E5E7EB] uppercase block">Timeline Weeks Recovered</span>
            <span className="text-base md:text-xl font-bold text-[#FFD691] font-mono mt-1 block">48 Weeks</span>
          </div>
          <div className="border-l border-[#FFFFFF]/10">
            <span className="text-[10px] text-[#E5E7EB] uppercase block">Decisional confidence score</span>
            <span className="text-base md:text-xl font-bold text-[#FFD691] font-mono mt-1 block">92.4%</span>
          </div>
        </div>
      </div>

      {/* Common Psychological Biases index */}
      <div className="space-y-4" id="ai-insights-biases-section">
        <div className="flex items-center space-x-1.5 text-[#233A66]">
          <AlertTriangle className="w-4 h-4 text-[#D7A859]" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider">Decisional Biases Map</h3>
        </div>
        <p className="text-xs text-[#6B7280]">Click on any bias index to expand recommended operational counter-strategies:</p>

        <div className="space-y-3" id="biases-interactive-accordion">
          {biases.map((bias) => (
            <div
              key={bias.name}
              onClick={() => setActiveBias(activeBias === bias.name ? null : bias.name)}
              className="bg-white border border-[#E5E7EB] rounded-card p-5 cursor-pointer hover:border-[#D7A859]/30 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#233A66]">{bias.name}</h4>
                  <span className="text-[10px] text-[#D7A859] font-semibold font-mono block mt-0.5">{bias.incidence}</span>
                </div>
                <button className="text-[#6B7280] text-xs">
                  {activeBias === bias.name ? "Collapse Counter-strategy" : "Expand Counter-strategy"}
                </button>
              </div>

              {activeBias === bias.name && (
                <div className="pt-4 border-t border-[#F3F4F6] mt-4 space-y-3 text-xs text-[#6B7280]">
                  <div>
                    <span className="font-bold text-[#233A66] block">Cognitive trigger parameters:</span>
                    <p className="leading-relaxed mt-0.5">{bias.desc}</p>
                  </div>
                  <div className="p-3 bg-[#F8F5EE] border-l-2 border-[#D7A859] rounded-r-card-secondary">
                    <span className="font-bold text-[#233A66] block">Systemized solution:</span>
                    <p className="leading-relaxed mt-0.5 italic">"{bias.solution}"</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Curated Readings list based on biases */}
      <div className="space-y-4" id="ai-insights-reading-section">
        <div className="flex items-center space-x-1.5 text-[#233A66]">
          <Compass className="w-4 h-4 text-[#D7A859]" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider">Co-pilot Recommended Reading</h3>
        </div>
        <div className="space-y-4" id="ai-insights-curated-list">
          {stories.map(story => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story.id)}
              className="p-5 bg-white border border-[#E5E7EB] hover:border-[#233A66]/30 rounded-card flex justify-between items-center cursor-pointer transition-all hover:shadow-sm"
            >
              <div>
                <span className="px-2 py-0.5 text-[9px] font-bold text-[#233A66] bg-[#F8F5EE] rounded uppercase font-mono">
                  #{story.category} Case Study
                </span>
                <h4 className="text-sm font-bold text-[#111827] mt-1.5">{story.title}</h4>
                <p className="text-xs text-[#6B7280] mt-1">AI calculated bias trigger: <strong>{story.aiAnalysis?.decisionBias.name || "Overconfidence"}</strong></p>
              </div>
              <button className="text-xs font-semibold text-[#D7A859] hover:text-[#233A66] whitespace-nowrap shrink-0 ml-4">
                Study case
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
