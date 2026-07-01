/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIAnalysis } from "../types";
import { ScenarioKind, StoryTemplate } from "./storyTemplates";

interface BiasProfile {
  rootCause: string;
  name: string;
  description: string;
  howToAvoid: string;
  riskLevel: AIAnalysis["riskLevel"];
}

const biasProfiles: Record<ScenarioKind, BiasProfile> = {
  "hiring-fast": {
    rootCause: "Hiring before operating clarity",
    name: "Optimism Bias",
    description: "The team assumed additional people would automatically create momentum and absorb ambiguity.",
    howToAvoid: "Define ownership, decision rights, and success metrics before opening the role.",
    riskLevel: "High",
  },
  "ignored-users": {
    rootCause: "Weak customer research",
    name: "Confirmation Bias",
    description: "Visible signals from louder stakeholders outweighed quieter evidence from retained users.",
    howToAvoid: "Separate buyer, user, and retained-customer feedback before prioritizing roadmap changes.",
    riskLevel: "High",
  },
  "scaled-early": {
    rootCause: "Scaling too early",
    name: "Overconfidence",
    description: "Future demand was treated as certain enough to justify present complexity.",
    howToAvoid: "Require repeated customer pull and a measured bottleneck before scaling the system.",
    riskLevel: "Medium",
  },
  "unwanted-features": {
    rootCause: "Unvalidated feature scope",
    name: "Assumption Bias",
    description: "The roadmap relied on what the team believed customers should value instead of observed behavior.",
    howToAvoid: "Prototype the workflow cheaply and measure whether customers change behavior before building depth.",
    riskLevel: "Medium",
  },
  "pricing-anchor": {
    rootCause: "Mispriced value capture",
    name: "Anchoring",
    description: "An early reference price shaped later willingness to pay more strongly than product value did.",
    howToAvoid: "Anchor pricing to customer economics and test multiple packages before public commitments.",
    riskLevel: "Medium",
  },
  "wrong-investor": {
    rootCause: "Capital-strategy mismatch",
    name: "Scarcity Bias",
    description: "Runway pressure made the fastest option feel safer than the most strategically useful option.",
    howToAvoid: "Score investors on operating relevance, decision style, and network fit before comparing terms.",
    riskLevel: "High",
  },
  "technical-rewrite": {
    rootCause: "Technical debt",
    name: "Sunk Cost Fallacy",
    description: "The team over-weighted frustration with old code and under-weighted the cost of pausing customer value.",
    howToAvoid: "Tie every rewrite to a narrow business metric and preserve delivery through incremental replacement.",
    riskLevel: "Medium",
  },
  "market-positioning": {
    rootCause: "Positioning-market mismatch",
    name: "Social Proof Bias",
    description: "A competitor's visible success was copied without validating whether the same promise fit this business.",
    howToAvoid: "Test positioning against margin, retention, and buyer intent instead of clicks alone.",
    riskLevel: "Medium",
  },
  "compliance-delay": {
    rootCause: "Trust artifact gap",
    name: "Planning Fallacy",
    description: "Compliance and procurement work was treated as a later step instead of a core adoption dependency.",
    howToAvoid: "Map required trust artifacts during discovery and build them into the launch critical path.",
    riskLevel: "High",
  },
  "enterprise-distraction": {
    rootCause: "Unsigned roadmap capture",
    name: "Authority Bias",
    description: "A high-status prospect was allowed to outweigh committed customers and current strategy.",
    howToAvoid: "Gate custom roadmap work behind signed commercial commitments and explicit opportunity-cost review.",
    riskLevel: "High",
  },
};

export function generateAIAnalysis(template: StoryTemplate, index: number): AIAnalysis {
  const bias = biasProfiles[template.scenario];
  const timeLostWeeks = 3 + ((index * 5) % 24);
  const teamCostUSD = 8000 + ((index * 13700) % 180000);
  const engineeringCostHours = 40 + ((index * 31) % 620);
  const customerImpactPercent = 4 + ((index * 7) % 36);

  return {
    rootCause: bias.rootCause,
    decisionBias: {
      name: bias.name,
      description: bias.description,
      whyItHappened: `${template.whyCorrectThen} That made the decision feel evidence-backed even though the evidence was incomplete.`,
      howToAvoid: bias.howToAvoid,
    },
    alternativeStrategy: `Run a two-week validation pass around "${template.assumption.toLowerCase()}" before committing roadmap, hiring, or capital to the decision.`,
    businessImpact: {
      timeLostWeeks,
      revenueImpactUSD: teamCostUSD + ((index * 9000) % 240000),
      customerImpactPercent,
      engineeringCostHours,
      teamCostUSD,
    },
    riskLevel: bias.riskLevel,
    transferableLesson: template.lesson,
    confidenceScore: 82 + (index % 15),
    explanation: `The story links the decision, the operating context, and the resulting cost pattern. The strongest signal is the mismatch between "${template.decisionAction}" and the later outcome.`,
  };
}
