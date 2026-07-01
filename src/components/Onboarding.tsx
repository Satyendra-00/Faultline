/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, BookOpen, PenTool, CheckCircle, Sparkles, AlertCircle } from "lucide-react";

interface OnboardingProps {
  userName: string;
  onComplete: (profileData: {
    name: string;
    headline: string;
    company: string;
    industry: string;
    location: string;
  }) => void;
  onSkip: () => void;
}

export default function Onboarding({ userName, onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(userName || "");
  const [headline, setHeadline] = useState("Co-Founder @ StealthSaaS");
  const [company, setCompany] = useState("StealthSaaS");
  const [industry, setIndustry] = useState("SaaS");
  const [location, setLocation] = useState("New York, NY");

  const [validationError, setValidationError] = useState("");

  const handleNext = () => {
    if (step === 0) {
      if (!name.trim() || !headline.trim()) {
        setValidationError("Name and professional headline are required.");
        return;
      }
      setValidationError("");
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleFinish = (action: "explore" | "create") => {
    onComplete({
      name,
      headline,
      company,
      industry,
      location,
    });
  };

  const cards = [
    {
      title: "Step 1: Your Profile Parameters",
      subtitle: "Let's set up your professional credentials. FaultLine is built for authentic peers.",
      content: (
        <div className="space-y-4 text-left" id="onboard-profile-fields">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5" htmlFor="onboard-name-input">
              Full Name
            </label>
            <input
              id="onboard-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-4 h-11 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5" htmlFor="onboard-headline-input">
              Professional Headline
            </label>
            <input
              id="onboard-headline-input"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Co-Founder @ StealthSaaS"
              className="w-full px-4 h-11 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5" htmlFor="onboard-company-input">
                Company Name
              </label>
              <input
                id="onboard-company-input"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. StealthSaaS"
                className="w-full px-4 h-11 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5" htmlFor="onboard-industry-input">
                Industry Sector
              </label>
              <select
                id="onboard-industry-input"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 h-11 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
              >
                <option value="SaaS">SaaS / Enterprise</option>
                <option value="Consumer">Consumer Web</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Fintech">Financial Tech</option>
                <option value="Hardware">Hardware / IoT</option>
                <option value="Agency">Consulting / Agency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5" htmlFor="onboard-location-input">
              Location
            </label>
            <input
              id="onboard-location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              className="w-full px-4 h-11 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66] transition-all"
            />
          </div>
          {validationError && (
            <div className="flex items-center space-x-1.5 text-[#D7A859]" id="onboard-validation-error">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{validationError}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Card 1: Welcome to FaultLine",
      subtitle: "The room where the world's smartest entrepreneurs openly discuss their biggest failures.",
      content: (
        <div className="space-y-4 py-4 text-center" id="onboard-card1-content">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#F8F5EE] border border-[#FFD691] flex items-center justify-center text-[#233A66] mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <p className="text-[#111827] text-base leading-relaxed">
            Every story shared on FaultLine represents a <strong>real decision</strong> made by a builder. We believe we learn exponentially more from honest retrospectives than polished, inflated success announcements.
          </p>
          <div className="bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary p-4 text-xs text-[#6B7280] leading-relaxed italic text-left">
            "We are not another social media platform optimized for dopamine scrolling. We are a library of lived decision frameworks."
          </div>
        </div>
      ),
    },
    {
      title: "Card 2: Structured Storytelling",
      subtitle: "How knowledge compounds in our community.",
      content: (
        <div className="space-y-3 text-left py-2" id="onboard-card2-content">
          <p className="text-sm text-[#6B7280] mb-3 text-center">
            Every published experience is mapped into five structured vectors to maintain maximum comparison compatibility:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center">
            <div className="p-3 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
              <div className="font-bold text-[#233A66] text-xs">1. Context</div>
              <p className="text-[10px] text-[#6B7280] mt-1">Situation, stage, and capital state</p>
            </div>
            <div className="p-3 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
              <div className="font-bold text-[#233A66] text-xs">2. Decision</div>
              <p className="text-[10px] text-[#6B7280] mt-1">Actions taken and logical biases</p>
            </div>
            <div className="p-3 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
              <div className="font-bold text-[#233A66] text-xs">3. Outcome</div>
              <p className="text-[10px] text-[#6B7280] mt-1">Raw metrics and direct consequences</p>
            </div>
            <div className="p-3 bg-[#F8F5EE] border border-[#E5E7EB] rounded-card-secondary">
              <div className="font-bold text-[#233A66] text-xs">4. Lesson</div>
              <p className="text-[10px] text-[#6B7280] mt-1">Highly shareable takeaways</p>
            </div>
            <div className="p-3 bg-[#FFFDF9] border border-[#FFD691] rounded-card-secondary">
              <div className="font-bold text-[#D7A859] text-xs flex items-center justify-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>5. AI Insights</span>
              </div>
              <p className="text-[10px] text-[#D7A859] mt-1">Automatic premium meta-analysis</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Card 3: Ready to Learn?",
      subtitle: "We prioritize knowledge quality over addictive vanity metrics.",
      content: (
        <div className="space-y-6 py-4 text-center" id="onboard-card3-content">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FFFDF9] border border-[#D7A859] flex items-center justify-center text-[#D7A859] mb-2">
            <CheckCircle className="w-8 h-8" />
          </div>
          <p className="text-[#111827] text-base leading-relaxed max-w-md mx-auto">
            You are fully set up. We encourage you to start reading other founders' experiences to prime your judgment, before eventually cataloging your own decision history.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="onboard-explore-btn"
              onClick={() => handleFinish("explore")}
              className="w-full md:w-auto px-6 h-12 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-sm transition-all duration-150 flex items-center justify-center space-x-2"
            >
              <span>Explore Decision Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="onboard-create-btn"
              onClick={() => handleFinish("create")}
              className="w-full md:w-auto px-6 h-12 bg-white hover:bg-[#F9FAFB] text-[#233A66] border border-[#E5E7EB] font-semibold rounded-button text-sm transition-all duration-150 flex items-center justify-center space-x-2"
            >
              <PenTool className="w-4 h-4" />
              <span>Create My First Story</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const currentCard = cards[step];

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-card shadow-sm p-8 md:p-12 relative flex flex-col justify-between"
        id="onboarding-modal-card"
      >
        {/* Skip button top right */}
        {step < cards.length - 1 && (
          <button
            id="onboard-skip-top-btn"
            onClick={onSkip}
            className="absolute top-8 right-8 text-xs font-semibold text-[#9CA3AF] hover:text-[#233A66] tracking-wider uppercase transition-all"
          >
            Skip Onboarding
          </button>
        )}

        {/* Progress Bar Indicators */}
        <div className="flex items-center space-x-2 mb-8" id="onboard-progress-bar">
          {cards.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full flex-grow transition-all duration-300 ${
                idx <= step ? "bg-[#233A66]" : "bg-[#E5E7EB]"
              }`}
            />
          ))}
        </div>

        {/* Animated Card Body */}
        <div className="flex-grow min-h-[300px] flex flex-col justify-center" id="onboard-step-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              id={`onboard-step-${step}`}
            >
              <h2 className="text-2xl font-bold tracking-tight text-[#233A66]">
                {currentCard.title}
              </h2>
              <p className="text-sm text-[#6B7280]">
                {currentCard.subtitle}
              </p>
              <div className="pt-4">{currentCard.content}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-8 mt-8" id="onboard-footer-nav">
          {step > 0 ? (
            <button
              id="onboard-prev-btn"
              onClick={handleBack}
              className="flex items-center space-x-2 text-sm font-semibold text-[#6B7280] hover:text-[#233A66] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < cards.length - 1 ? (
            <button
              id="onboard-next-btn"
              onClick={handleNext}
              className="px-5 h-11 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-sm transition-all duration-150 flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </motion.div>
    </div>
  );
}
