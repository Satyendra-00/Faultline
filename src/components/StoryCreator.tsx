/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PenTool,
  CheckCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Info
} from "lucide-react";

interface StoryCreatorProps {
  onPublish: (story: {
    title: string;
    category: string;
    context: {
      situation: string;
      stage: string;
      funding: string;
      involved: string;
      assumptions: string;
    };
    decision: {
      action: string;
      whyCorrectThen: string;
      emotionalFactors: string;
    };
    outcome: {
      whatHappened: string;
      positives: string;
      negatives: string;
      unexpectedConsequences: string;
      financialImpact: string;
      teamImpact: string;
      customerImpact: string;
      technicalImpact: string;
    };
    reflection: {
      misunderstood: string;
      surprised: string;
      neverRepeat: string;
    };
    keyLesson: string;
  }) => void;
  onClose: () => void;
}

export default function StoryCreator({ onPublish, onClose }: StoryCreatorProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Startup");
  const [title, setTitle] = useState("");

  // Context fields
  const [situation, setSituation] = useState("");
  const [stage, setStage] = useState("Pre-revenue / Idea");
  const [funding, setFunding] = useState("Bootstrapped");
  const [involved, setInvolved] = useState("");
  const [assumptions, setAssumptions] = useState("");

  // Decision fields
  const [action, setAction] = useState("");
  const [whyCorrectThen, setWhyCorrectThen] = useState("");
  const [emotionalFactors, setEmotionalFactors] = useState("");

  // Outcome fields
  const [whatHappened, setWhatHappened] = useState("");
  const [positives, setPositives] = useState("");
  const [negatives, setNegatives] = useState("");
  const [unexpectedConsequences, setUnexpectedConsequences] = useState("");
  const [financialImpact, setFinancialImpact] = useState("");
  const [teamImpact, setTeamImpact] = useState("");
  const [customerImpact, setCustomerImpact] = useState("");
  const [technicalImpact, setTechnicalImpact] = useState("");

  // Reflection fields
  const [misunderstood, setMisunderstood] = useState("");
  const [surprised, setSurprised] = useState("");
  const [neverRepeat, setNeverRepeat] = useState("");

  // Key Lesson
  const [keyLesson, setKeyLesson] = useState("");

  // AI Suggestion Box state
  const [aiSuggestions, setAiSuggestions] = useState<{
    titleSuggestion?: string;
    lessonSuggestion?: string;
    missingContext?: string;
    clearerDecision?: string;
  } | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Auto-trigger suggestions when composing
  useEffect(() => {
    if (step === 2 || step === 3 || step === 4 || step === 5 || step === 6) {
      const delayDebounce = setTimeout(() => {
        fetchSuggestions();
      }, 1500); // 1.5s debounce to avoid flooding
      return () => clearTimeout(delayDebounce);
    }
  }, [title, situation, action, whatHappened, keyLesson, step]);

  const fetchSuggestions = async () => {
    if (!title && !situation && !action) return;
    setIsSuggesting(true);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          context: situation,
          decision: action,
          outcome: whatHappened,
          keyLesson,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleNext = () => {
    setStep(prev => Math.min(8, prev + 1));
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    onPublish({
      title,
      category,
      context: {
        situation,
        stage,
        funding,
        involved,
        assumptions,
      },
      decision: {
        action,
        whyCorrectThen,
        emotionalFactors,
      },
      outcome: {
        whatHappened,
        positives,
        negatives,
        unexpectedConsequences,
        financialImpact,
        teamImpact,
        customerImpact,
        technicalImpact,
      },
      reflection: {
        misunderstood,
        surprised,
        neverRepeat,
      },
      keyLesson,
    });
  };

  const categories = [
    "Startup", "Engineering", "Career", "Leadership",
    "Marketing", "Sales", "Fundraising", "Operations",
    "Product", "Personal Growth"
  ];

  return (
    <div className="fixed inset-0 bg-[#233A66]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" id="creator-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-white border border-[#E5E7EB] rounded-dialog shadow-xl overflow-hidden flex flex-col md:flex-row h-[90vh]"
        id="creator-dialog-card"
      >
        {/* Left pane: Guidelines & AI Assistant */}
        <div className="w-full md:w-1/3 bg-[#F8F5EE] border-r border-[#E5E7EB] p-6 flex flex-col justify-between" id="creator-guidance-pane">
          <div className="space-y-6" id="guidance-top-group">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-[#233A66]">
                <PenTool className="w-4 h-4" />
                <span className="font-display text-sm font-bold tracking-wider uppercase">Document Decision</span>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mt-2 leading-tight">Structured Post-Mortem</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                By organizing your narrative, other founders can match parameters and avoid similar pitfalls.
              </p>
            </div>

            {/* Step Descriptions mapping */}
            <div className="space-y-3" id="guidance-step-list">
              {[
                { num: 1, label: "Category Selector" },
                { num: 2, label: "Objective & Title" },
                { num: 3, label: "Contextual Parameters" },
                { num: 4, label: "Biases & Turning Point" },
                { num: 5, label: "Operational Outcomes" },
                { num: 6, label: "Self-Reflection Metrics" },
                { num: 7, label: "Prerequisites Preview" },
              ].map(s => (
                <div key={s.num} className="flex items-center space-x-3 text-xs" id={`guidance-indicator-step-${s.num}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold border transition-colors ${
                    step === s.num
                      ? "bg-[#233A66] text-white border-[#233A66]"
                      : step > s.num
                      ? "bg-[#D7A859] text-white border-[#D7A859]"
                      : "bg-white text-[#9CA3AF] border-[#E5E7EB]"
                  }`}>
                    {s.num}
                  </span>
                  <span className={`font-semibold ${step === s.num ? "text-[#111827]" : "text-[#6B7280]"}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI REAL-TIME SUGGESTION BOX (Signature Feature) */}
          <div className="mt-6 bg-[#FFFDF9] border border-[#FFD691] rounded-card-secondary p-4 relative" id="ai-suggestion-box">
            <div className="flex items-center space-x-1.5 text-[#D7A859] mb-2" id="ai-suggestion-header">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Writing Co-Pilot</span>
              {isSuggesting && (
                <span className="animate-pulse text-[9px] text-[#6B7280]">Suggesting...</span>
              )}
            </div>

            <div className="text-xs space-y-2.5 text-[#6B7280]" id="ai-suggestions-content">
              {step === 1 && (
                <p className="italic">"Select the category that best matches your decision domain to activate domain-specific co-pilot parameters."</p>
              )}

              {step === 2 && (
                <div>
                  <span className="font-bold text-[#233A66] block mb-0.5">Title Coaching</span>
                  <p className="leading-relaxed">
                    {aiSuggestions?.titleSuggestion || "Ensure your title lists the exact scope of the compromise (e.g., 'Chasing enterprise SSO cost us 3 months and $20k')."}
                  </p>
                </div>
              )}

              {step === 3 && (
                <div>
                  <span className="font-bold text-[#233A66] block mb-0.5">Missing Parameter Audits</span>
                  <p className="leading-relaxed">
                    {aiSuggestions?.missingContext || "Be sure to specify what funding stage and involved headcount existed at the moment of the decision."}
                  </p>
                </div>
              )}

              {step === 4 && (
                <div>
                  <span className="font-bold text-[#233A66] block mb-0.5">Decision Transparency</span>
                  <p className="leading-relaxed">
                    {aiSuggestions?.clearerDecision || "Explain what assumptions made this decision feel logical to the executive team at that time."}
                  </p>
                </div>
              )}

              {step === 5 && (
                <div>
                  <span className="font-bold text-[#233A66] block mb-0.5">Outcome Metrics</span>
                  <p className="leading-relaxed">
                    Describe positive, negative, and unexpected outcomes. Try listing exact customer loss percentages or tech delays.
                  </p>
                </div>
              )}

              {step === 6 && (
                <div>
                  <span className="font-bold text-[#233A66] block mb-0.5">Key Lesson Takeaways</span>
                  <p className="leading-relaxed">
                    {aiSuggestions?.lessonSuggestion || "Craft a precise, highly shareable takeaway that other engineers or product managers can apply directly."}
                  </p>
                </div>
              )}

              {step >= 7 && (
                <p className="italic font-medium text-[#D7A859]">
                  "Prerender checks pass. Ready to generate premium automated Decision Intelligence analysis."
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right pane: Interactive step forms */}
        <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-between" id="creator-forms-pane">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4" id="creator-header-action">
            <span className="text-xs font-mono text-[#9CA3AF]">
              DRAFT PROGRESS: {Math.round((step / 7) * 100)}% Complete
            </span>
            <button
              id="creator-close-btn"
              onClick={onClose}
              className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] cursor-pointer"
            >
              Discard Draft
            </button>
          </div>

          {/* Core step screens */}
          <div className="flex-1 overflow-y-auto py-6" id="creator-step-body">
            {step === 1 && (
              <div className="space-y-5 text-left" id="creator-step1">
                <h4 className="text-lg font-bold text-[#111827]">Step 1: Domain Category</h4>
                <p className="text-xs text-[#6B7280]">
                  Which professional domain does this decision mainly impact? This filters context fields correctly.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      id={`category-select-${cat}`}
                      onClick={() => setCategory(cat)}
                      className={`h-11 px-4 text-xs font-semibold rounded-button border text-left transition-all ${
                        category === cat
                          ? "bg-[#233A66] border-[#233A66] text-white shadow-sm"
                          : "bg-[#FCFCFC] border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-left" id="creator-step2">
                <h4 className="text-lg font-bold text-[#111827]">Step 2: Clear & Objective Title</h4>
                <p className="text-xs text-[#6B7280]">
                  Summarize the decision, trade-off, or consequence. Keep it descriptive, avoiding vague titles.
                </p>
                <div>
                  <textarea
                    id="creator-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 120))}
                    placeholder="e.g., Scaling our database horizontally before finding PMF cost us $120k and 4 months"
                    className="w-full p-4 h-28 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66] focus:bg-white resize-none transition-all"
                  />
                  <div className="flex justify-between items-center mt-1 text-[11px] text-[#9CA3AF]">
                    <span>A good title focuses on the compromise metrics.</span>
                    <span>{title.length}/120 characters</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-left" id="creator-step3">
                <h4 className="text-lg font-bold text-[#111827]">Step 3: Background Context</h4>
                <p className="text-xs text-[#6B7280]">
                  Describe the parameters of the environment before this key decision was executed.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Company Stage</label>
                    <select
                      id="creator-stage-input"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    >
                      <option>Pre-revenue / Idea</option>
                      <option>Seed Stage</option>
                      <option>Growth Stage (Series A)</option>
                      <option>Mature / Scaled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Funding State</label>
                    <input
                      id="creator-funding-input"
                      type="text"
                      value={funding}
                      onChange={(e) => setFunding(e.target.value)}
                      placeholder="e.g. $2M Seed or Bootstrap"
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Involved Personnel</label>
                  <input
                    id="creator-involved-input"
                    type="text"
                    value={involved}
                    onChange={(e) => setInvolved(e.target.value)}
                    placeholder="e.g. CTO, 2 Infrastructure Engineers, Founder"
                    className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">What situation were you facing?</label>
                  <textarea
                    id="creator-situation-input"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Describe the environment and the core trigger or pressure that required an executive decision."
                    className="w-full p-3 h-24 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] focus:bg-white resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Pre-existing Assumptions</label>
                  <input
                    id="creator-assumptions-input"
                    type="text"
                    value={assumptions}
                    onChange={(e) => setAssumptions(e.target.value)}
                    placeholder="What assumptions did the team hold as guaranteed truths then?"
                    className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-left" id="creator-step4">
                <h4 className="text-lg font-bold text-[#111827]">Step 4: The Core Decision</h4>
                <p className="text-xs text-[#6B7280]">
                  Explain exactly what course of action was decided upon, and what bias may have influenced it.
                </p>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">What exact decision did you make?</label>
                  <textarea
                    id="creator-action-input"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="Specify the choice or tech stack migration."
                    className="w-full p-3 h-24 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] focus:bg-white resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Why did it feel absolutely correct at that moment?</label>
                  <input
                    id="creator-whycorrect-input"
                    type="text"
                    value={whyCorrectThen}
                    onChange={(e) => setWhyCorrectThen(e.target.value)}
                    placeholder="Describe the logical justification or long-term alignment theory."
                    className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Emotional / Team Factors (Optional)</label>
                  <input
                    id="creator-emotional-input"
                    type="text"
                    value={emotionalFactors}
                    onChange={(e) => setEmotionalFactors(e.target.value)}
                    placeholder="Fears of appearing amateur, board pressures, or tech-hype FOMO."
                    className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 text-left" id="creator-step5">
                <h4 className="text-lg font-bold text-[#111827]">Step 5: Consequence Outcomes</h4>
                <p className="text-xs text-[#6B7280]">
                  Map out both positive and negative consequences across technical, financial, and team structures.
                </p>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">What happened afterwards?</label>
                  <textarea
                    id="creator-whathappened-input"
                    value={whatHappened}
                    onChange={(e) => setWhatHappened(e.target.value)}
                    placeholder="List the direct operational fallout."
                    className="w-full p-3 h-20 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] focus:bg-white resize-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Financial Impact (USD)</label>
                    <input
                      id="creator-fin-input"
                      type="text"
                      value={financialImpact}
                      onChange={(e) => setFinancialImpact(e.target.value)}
                      placeholder="e.g. $120,000 lost or $0"
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Team Impact Details</label>
                    <input
                      id="creator-team-impact-input"
                      type="text"
                      value={teamImpact}
                      onChange={(e) => setTeamImpact(e.target.value)}
                      placeholder="e.g. Engineering exhaustion"
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Customer / Retention Fallout</label>
                    <input
                      id="creator-customer-impact-input"
                      type="text"
                      value={customerImpact}
                      onChange={(e) => setCustomerImpact(e.target.value)}
                      placeholder="e.g. 2 beta accounts churned"
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Technical Debt Added</label>
                    <input
                      id="creator-tech-debt-input"
                      type="text"
                      value={technicalImpact}
                      onChange={(e) => setTechnicalImpact(e.target.value)}
                      placeholder="e.g. Schema denormalization required"
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 text-left" id="creator-step6">
                <h4 className="text-lg font-bold text-[#111827]">Step 6: Reflection & Transferable Lesson</h4>
                <p className="text-xs text-[#6B7280]">
                  Look back objectively. If another startup was in your position, what is the single lesson they must remember?
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">What did you misunderstand?</label>
                    <input
                      id="creator-misunderstood-input"
                      type="text"
                      value={misunderstood}
                      onChange={(e) => setMisunderstood(e.target.value)}
                      placeholder="e.g. Scale risk vs. existential PMF risk"
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">What surprised you?</label>
                    <input
                      id="creator-surprised-input"
                      type="text"
                      value={surprised}
                      onChange={(e) => setSurprised(e.target.value)}
                      placeholder="e.g. Cassandra operating complexity"
                      className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">What will you NEVER repeat?</label>
                  <input
                    id="creator-neverrepeat-input"
                    type="text"
                    value={neverRepeat}
                    onChange={(e) => setNeverRepeat(e.target.value)}
                    placeholder="e.g. Overengineering before 100 paying customers"
                    className="w-full px-3 h-10 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">State your core, concise lesson takeaway:</label>
                  <textarea
                    id="creator-keylesson-input"
                    value={keyLesson}
                    onChange={(e) => setKeyLesson(e.target.value)}
                    placeholder="e.g. Keep your technology stack as humble as possible until the cost of your current simplicity actively prevents your business from growing."
                    className="w-full p-3 h-24 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-xs text-[#111827] focus:outline-none focus:border-[#233A66] focus:bg-white resize-none transition-all"
                  />
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-6 text-left" id="creator-step7">
                <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <h4 className="text-lg font-bold text-[#111827]">Step 7: Final Story Review</h4>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Review your structured retrospective before submission. AI analysis will begin processing immediately upon publication.
                </p>

                <div className="bg-[#F8F5EE] border border-[#E5E7EB] rounded-card p-6 space-y-4" id="creator-preview-card">
                  <div>
                    <span className="text-[10px] font-bold text-[#D7A859] uppercase tracking-wider block">#{category} Domain Case Study</span>
                    <h3 className="text-xl font-bold text-[#233A66] mt-1">{title || "Untitled Retrospective"}</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-[#E5E7EB]">
                    <div>
                      <span className="text-[10px] text-[#6B7280] block font-semibold uppercase">Stage</span>
                      <span className="font-bold text-[#111827]">{stage}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7280] block font-semibold uppercase">Involved</span>
                      <span className="font-bold text-[#111827]">{involved || "None specified"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7280] block font-semibold uppercase">Financial Impact</span>
                      <span className="font-bold text-rose-600">{financialImpact || "$0 / Negligible"}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#E5E7EB] text-xs">
                    <div>
                      <span className="font-bold text-[#233A66] block">The Context</span>
                      <p className="text-[#6B7280] leading-relaxed italic">"{situation || "No context specified."}"</p>
                    </div>
                    <div>
                      <span className="font-bold text-[#D7A859] block">The Decision</span>
                      <p className="text-[#111827] font-semibold leading-relaxed">"{action || "No decision specified."}"</p>
                    </div>
                    <div>
                      <span className="font-bold text-[#233A66] block">Key Lesson</span>
                      <p className="text-[#111827] font-medium leading-relaxed">"{keyLesson || "No lesson drafted."}"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-5" id="creator-footer-navigation">
            {step > 1 ? (
              <button
                id="creator-prev-btn"
                onClick={handleBack}
                className="flex items-center space-x-2 text-xs font-semibold text-[#6B7280] hover:text-[#233A66]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 7 ? (
              <button
                id="creator-next-btn"
                disabled={step === 2 && !title}
                onClick={handleNext}
                className="px-5 h-11 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-xs transition-all duration-150 flex items-center space-x-1.5 disabled:opacity-40"
              >
                <span>Continue Draft</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="creator-submit-btn"
                onClick={handleSubmit}
                className="px-6 h-11 bg-[#D7A859] hover:bg-[#C09248] text-white font-bold rounded-button text-xs tracking-wide uppercase transition-all duration-150 flex items-center space-x-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Publish & Process Intelligence</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
