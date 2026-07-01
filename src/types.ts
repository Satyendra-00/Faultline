/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Author {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  company?: string;
  industry: string;
  isVerified: boolean;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  followers: number;
  following: number;
  storiesPublished: number;
  lessonsShared: number;
  bookmarksCount: number;
  readingStreak: number;
  totalReads: number;
  aiScore: number;
}

export interface BusinessImpactMetrics {
  timeLostWeeks?: number;
  revenueImpactUSD?: number;
  customerImpactPercent?: number;
  engineeringCostHours?: number;
  teamCostUSD?: number;
}

export interface AIAnalysis {
  rootCause: string;
  decisionBias: {
    name: string;
    description: string;
    whyItHappened: string;
    howToAvoid: string;
  };
  alternativeStrategy: string;
  businessImpact: BusinessImpactMetrics;
  riskLevel: "Low" | "Medium" | "High";
  transferableLesson: string;
  confidenceScore: number;
  explanation: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorHeadline: string;
  time: string;
  comment: string;
  replies?: Comment[];
  likes: number;
  hasLiked?: boolean;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: Author;
  time: string;
  readingTime: string;
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
    emotionalFactors?: string;
  };
  outcome: {
    whatHappened: string;
    positives?: string;
    negatives?: string;
    unexpectedConsequences?: string;
    financialImpact?: string;
    teamImpact?: string;
    customerImpact?: string;
    technicalImpact?: string;
  };
  reflection: {
    misunderstood: string;
    surprised: string;
    neverRepeat: string;
  };
  keyLesson: string;
  aiAnalysis?: AIAnalysis;
  likes: number;
  commentsCount: number;
  reposts: number;
  bookmarks: number;
  shares: number;
  views: number;
  reads: number;
  aiHelpfulnessRating?: number;
  hasLiked?: boolean;
  hasBookmarked?: boolean;
  hasReposted?: boolean;
  comments: Comment[];
  relatedTopics?: string[];
}

export interface Notification {
  id: string;
  type: "comment" | "bookmark" | "ai_complete" | "follow" | "learning_summary" | "trending_lesson";
  icon: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  storyId?: string;
}

export interface SavedCollection {
  id: string;
  name: string;
  storyCount: number;
  coverStories: string[]; // titles or image references
  stories: string[]; // storyIds
}

export interface ReadingProgress {
  weeklyStoriesRead: number;
  learningStreak: number;
  topicsLearned: string[];
  aiSummary: string;
}

export interface TrendingLesson {
  id: string;
  title: string;
  shortDescription: string;
  readersCount: number;
  category: string;
}

export interface TrendingFounder {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  followers: number;
  latestLesson: string;
  isFollowing: boolean;
}

export interface TrendingTopic {
  id: string;
  name: string;
  storyCount: number;
  weeklyGrowth: string;
}
