/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Comment, Story } from "../types";
import { generateAIAnalysis } from "./aiGenerator";
import { generateAuthor } from "./authorGenerator";
import { fundingProfiles, geographies, stages, templates, timestamps } from "./storyTemplates";

const MIN_VIEWS = 150;
const MAX_VIEW_SPREAD = 249850;

function seededNumber(seed: number, salt: number): number {
  let value = seed + salt * 0x9e3779b9;
  value = Math.imul(value ^ (value >>> 16), 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
  return (value ^ (value >>> 16)) >>> 0;
}

function pick<T>(items: readonly T[], seed: number, salt: number): T {
  return items[seededNumber(seed, salt) % items.length];
}

function metricInRange(seed: number, salt: number, min: number, max: number): number {
  return min + (seededNumber(seed, salt) % (max - min + 1));
}

function buildComments(index: number, likes: number): Comment[] {
  const count = Math.max(1, Math.round(likes * (metricInRange(index, 21, 5, 10) / 100)));
  const visibleCount = Math.min(count, 3);
  const commentBodies = [
    "This is painfully familiar. The part about separating buyer excitement from user behavior is the piece I wish we had written down earlier.",
    "Strong reminder that the operating cost of a decision rarely shows up in the meeting where it gets approved.",
    "I appreciate the specificity here. The lesson travels because the numbers and emotions are both visible.",
    "We hit a smaller version of this last year and the recovery only started once we named the assumption directly.",
  ];

  return Array.from({ length: visibleCount }, (_, offset) => {
    const authorIndex = index + offset + 31;
    const author = generateAuthor(authorIndex, "Operator");
    return {
      id: `comment-${index}-${offset}`,
      authorName: author.name,
      authorAvatar: author.avatar,
      authorHeadline: author.headline,
      time: pick(timestamps, index, offset + 23),
      comment: pick(commentBodies, index, offset + 29),
      likes: metricInRange(index, offset + 41, 1, Math.max(2, Math.floor(likes * 0.08))),
    };
  });
}

export function generateStory(id: number): Story {
  const template = pick(templates, id, 1);
  const stage = pick(stages, id, 2);
  const funding = pick(fundingProfiles, id, 3);
  const location = pick(geographies, id, 4);
  const author = generateAuthor(id, template.domain);
  const views = MIN_VIEWS + (seededNumber(id, 5) % MAX_VIEW_SPREAD);
  const reads = Math.round(views * (metricInRange(id, 6, 40, 90) / 100));
  const likes = Math.max(1, Math.round(reads * (metricInRange(id, 7, 1, 15) / 100)));
  const commentsCount = Math.max(1, Math.round(likes * (metricInRange(id, 8, 5, 10) / 100)));
  const bookmarks = Math.max(1, Math.round(reads * (metricInRange(id, 9, 2, 8) / 100)));
  const shares = Math.max(1, Math.round(reads * (metricInRange(id, 10, 1, 5) / 100)));
  const teamSize = metricInRange(id, 11, 3, 180);

  return {
    id: `story-${id}`,
    title: template.title,
    summary: template.summary,
    category: template.category,
    author,
    time: pick(timestamps, id, 12),
    readingTime: `${metricInRange(id, 13, 3, 9)} min read`,
    context: {
      situation: `At ${author.company}, we were a ${stage.toLowerCase()} ${template.domain} company in ${location}, running a ${template.businessModel} model with ${teamSize} people involved across product, engineering, and go-to-market. The product stack was ${template.technicalMaturity}, and the pressure was to make the company look more certain than it really was.`,
      stage,
      funding,
      involved: `${teamSize} team members, ${metricInRange(id, 14, 2, 18)} customers or pilots, and ${metricInRange(id, 15, 1, 5)} executive stakeholders`,
      assumptions: template.assumption,
    },
    decision: {
      action: template.decisionAction,
      whyCorrectThen: template.whyCorrectThen,
      emotionalFactors: template.emotionalFactors,
    },
    outcome: {
      whatHappened: `${template.negative} ${template.positive}`,
      positives: template.positive,
      negatives: template.negative,
      unexpectedConsequences: template.surprise,
      financialImpact: `$${metricInRange(id, 16, 12000, 240000).toLocaleString()} in delayed revenue, rework, or avoidable operating cost`,
      teamImpact: `${metricInRange(id, 17, 2, 11)} people had to pause planned work to unwind the decision.`,
      customerImpact: `${metricInRange(id, 18, 3, 29)}% of active accounts were delayed, confused, or pulled into recovery conversations.`,
      technicalImpact: `${metricInRange(id, 19, 40, 720)} engineering hours were redirected before the team recovered its roadmap rhythm.`,
    },
    reflection: {
      misunderstood: template.assumption,
      surprised: template.surprise,
      neverRepeat: template.neverRepeat,
    },
    keyLesson: template.lesson,
    aiAnalysis: generateAIAnalysis(template, id),
    likes,
    commentsCount,
    reposts: Math.max(0, Math.round(shares * 0.35)),
    bookmarks,
    shares,
    views,
    reads,
    aiHelpfulnessRating: Number((4.2 + (metricInRange(id, 20, 0, 7) / 10)).toFixed(1)),
    hasLiked: false,
    hasBookmarked: false,
    hasReposted: false,
    comments: buildComments(id, likes),
    relatedTopics: template.topics,
  };
}

export function generateStories(startIndex: number, count: number): Story[] {
  return Array.from({ length: count }, (_, offset) => generateStory(startIndex + offset + 1));
}
