/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

app.use(express.json());

// Initialize Gemini SDK
// Note: We use process.env.GEMINI_API_KEY. It is server-only.
const aiApiKey = process.env.GEMINI_API_KEY || "";
const ai = aiApiKey
  ? new GoogleGenAI({
      apiKey: aiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

async function requireAuth(req: any, res: any, next: any) {
  if (!supabaseAdmin) {
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid authorization token" });
  }

  req.user = data.user;
  next();
}

// Database - In-Memory storage with premium pre-seeded data matching the PRD
let stories: any[] = [
  {
    id: "story-1",
    title: "Scaling our database horizontally before finding PMF cost us $120k and 4 months",
    summary: "Our SaaS company had pre-revenue traction, but we overengineered our infrastructure expecting massive scale, leading to distraction and heavy technical debt.",
    category: "Startup",
    time: "2 days ago",
    readingTime: "5 min read",
    author: {
      id: "auth-1",
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      headline: "Founder & CTO at Veloce",
      company: "Veloce",
      industry: "SaaS Infrastructure",
      isVerified: true,
      location: "San Francisco, CA",
      website: "veloce.io",
      linkedin: "linkedin.com/in/marcus-chen-veloce",
      github: "github.com/marcuschen",
      bio: "Marcus is a third-time technical founder. Previously at Stripe and Snowflake, he now shares architectural and execution-level lessons in early-stage startups.",
      followers: 1240,
      following: 189,
      storiesPublished: 4,
      lessonsShared: 12,
      bookmarksCount: 28,
      readingStreak: 5,
      totalReads: 8500,
      aiScore: 88,
    },
    context: {
      situation: "We had just raised our $2M Seed round and had about 15 beta users. We were building a real-time analytics product.",
      stage: "Seed Stage",
      funding: "$2,000,000 Seed",
      involved: "CTO, 2 Senior Infrastructure Engineers, and Founder",
      assumptions: "We assumed that when we officially launched, we would instantly get thousands of concurrent write requests, which our SQL database couldn't handle.",
    },
    decision: {
      action: "We decided to migrate our entire database from a managed PostgreSQL instance to a fully self-managed multi-region Cassandra cluster.",
      whyCorrectThen: "Cassandra is optimized for write-heavy horizontal scalability. We wanted to build 'future-proof' architecture and avoid the pain of database migration later.",
      emotionalFactors: "We had a strong desire to play with high-scale tech. We also feared appearing 'amateur' to our technical beta testers if we experienced any launch day lag.",
    },
    outcome: {
      whatHappened: "The migration was an operational nightmare. We spent 3 months setting up the cluster, tuning consistency levels, and re-writing all of our relational database queries.",
      positives: "We built an incredibly robust write pipeline that could technically support millions of requests per second.",
      negatives: "We spent $120,000 in dev time and infrastructure bills. More importantly, we lost 4 months of feature development. We couldn't easily build simple features because Cassandra doesn't support joins.",
      unexpectedConsequences: "Two of our core beta users churned because we stopped building requested integrations to focus on database management.",
      financialImpact: "$120,000 lost in engineering wages and cloud server costs.",
      teamImpact: "The engineering team was exhausted from debugging gossip protocols and partition keys instead of building user value.",
      customerImpact: "Beta user feature requests were delayed by 4 months, leading to loss of momentum and 2 churns.",
      technicalImpact: "Massive technical complexity. Every new relational property required manually writing denormalized data schemas.",
    },
    reflection: {
      misunderstood: "We confused potential scaling risk with immediate existential risk. Our actual existential risk was failing to find product-market fit, not database throughput.",
      surprised: "We were shocked by how difficult it is to operate Cassandra correctly, and how much it slowed down our feature shipping velocity.",
      neverRepeat: "We will never optimize for scale before we have 100 paying customers who are actively bottlenecking the current simple server.",
    },
    keyLesson: "Keep your technology stack as humble as possible until the cost of your current simplicity actively prevents your business from growing.",
    aiAnalysis: {
      rootCause: "Scaling too early",
      decisionBias: {
        name: "Overconfidence Bias",
        description: "Overestimating our ability to control complex outcomes, combined with assuming future demand was guaranteed.",
        whyItHappened: "We were experienced infrastructure engineers who had solved scaling issues at Stripe. We assumed we could quickly drop in a Cassandra cluster without it eating our roadmap.",
        howToAvoid: "Before adopting any complex system, force a pre-mortem: 'If this migration takes twice as long as expected, will it kill the company?'",
      },
      alternativeStrategy: "Stick with PostgreSQL. Use standard indexing, read replicas, and connection pooling. Only migrate once single-node PostgreSQL write volume exceeds 10,000 requests per second.",
      businessImpact: {
        timeLostWeeks: 16,
        revenueImpactUSD: 0,
        customerImpactPercent: 13,
        engineeringCostHours: 640,
        teamCostUSD: 120000,
      },
      riskLevel: "High",
      transferableLesson: "Premature optimization is the ultimate startup tax. It trade cash and focus for theoretical capabilities that may never be utilized.",
      confidenceScore: 94,
      explanation: "Analysis is highly confident. The combination of Seed stage, 15 beta users, and multi-region self-managed Cassandra represents a textbook case of pre-PMF overengineering.",
    },
    likes: 342,
    commentsCount: 18,
    reposts: 54,
    bookmarks: 88,
    shares: 42,
    views: 4500,
    reads: 1200,
    aiHelpfulnessRating: 4.8,
    comments: [
      {
        id: "c-1",
        authorName: "Sarah Jenkins",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        authorHeadline: "Product Lead at DrawFlow",
        time: "1 day ago",
        comment: "This is a classic. I've seen so many Seed engineering teams fall into the Cassandra or Kubernetes rabbit hole when they should be hacking together raw JS and Postgres. Thank you for the complete transparency on the costs.",
        likes: 24,
        replies: [],
      },
      {
        id: "c-2",
        authorName: "David Miller",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        authorHeadline: "VP Engineering at ScaleUp",
        time: "18 hours ago",
        comment: "The Cassandra joins constraint is painful. When you are pre-PMF, your schema needs to be incredibly fluid because you are changing your business definition every week. PostgreSQL JSONB is a savior here.",
        likes: 12,
        replies: [],
      }
    ],
    relatedTopics: ["Premature Optimization", "SaaS Stack", "Scaling Failures"]
  },
  {
    id: "story-2",
    title: "We built an enterprise feature set for a prosumer customer base",
    summary: "DrawFlow prioritized advanced user roles, SOC2 compliance, and enterprise single sign-on, completely neglecting our actual core base of freelance designers.",
    category: "Product",
    time: "4 days ago",
    readingTime: "4 min read",
    author: {
      id: "auth-2",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      headline: "Product Lead at DrawFlow",
      company: "DrawFlow",
      industry: "Design Tools",
      isVerified: true,
      location: "New York, NY",
      website: "drawflow.design",
      linkedin: "linkedin.com/in/sarah-jenkins-drawflow",
      github: "github.com/sarahj",
      bio: "Sarah is a product manager specialized in visual editor tools. She advocates for extreme user empathy and outcome-oriented roadmap design.",
      followers: 890,
      following: 240,
      storiesPublished: 3,
      lessonsShared: 8,
      bookmarksCount: 15,
      readingStreak: 3,
      totalReads: 5400,
      aiScore: 92,
    },
    context: {
      situation: "DrawFlow was thriving as a design tool for individual freelancers. We had 5,000 active users paying $15/month. To grow faster, we decided we needed to chase the Enterprise.",
      stage: "Growth Stage (Series A)",
      funding: "$5,000,000 Series A",
      involved: "Product Team, sales consultant, and executive team",
      assumptions: "We assumed freelance accounts were low-value and would churn quickly, whereas large agencies with 100+ designers were the key to sustainable ARR.",
    },
    decision: {
      action: "We paused all consumer feature requests (like custom brushes and offline backup) for 6 months to implement complex SSO, audit logs, and SOC2 compliance structures.",
      whyCorrectThen: "Enterprise buyers require security certifications and deep user permission trees. We wanted to unlock $50k+ contracts.",
      emotionalFactors: "We were lured by the glamour of enterprise sales and felt pressured by our VC board to demonstrate 'high-value expansion potential'.",
    },
    outcome: {
      whatHappened: "Our sales team couldn't close a single Enterprise deal because our core drawing performance was lagging behind newer entrants. Meanwhile, our freelance base felt ignored and started migrating to a competitor, CanvasZen.",
      positives: "We received our SOC2 Type II certification, which is a nice stamp of approval.",
      negatives: "We lost about 1,200 paying prosumer designers (roughly $18,000/month in recurring revenue). We also failed to secure any active enterprise accounts during that period.",
      unexpectedConsequences: " freelancers who churned were our loudest advocates. When they left, they wrote articles comparing DrawFlow to legacy bloated tools, destroying our organic growth loop.",
      financialImpact: "$216,000 annual run rate lost from prosumer churn, plus $60,000 spent on compliance consulting.",
      teamImpact: "The design team was demotivated by building admin panels and compliance dashboards instead of creative visual features.",
      customerImpact: "Freelanders felt abandoned, complaining that the editor hadn't received a meaningful update in half a year.",
      technicalImpact: "We added a massive amount of role-checking middleware to our backend, which slowed down our main asset-loading routes.",
    },
    reflection: {
      misunderstood: "We misunderstood the sales cycle and readiness of our product. You can't sell an Enterprise solution just because you have SSO; your product must be deeply entrenched in their daily workflow first.",
      surprised: "We were surprised by how quickly a passionate community turns on you when you ignore their core utility feedback.",
      neverRepeat: "We will never build enterprise-exclusive gates until we have at least 5 letters of intent with deposits from actual corporate prospects.",
    },
    keyLesson: "Nurture the core customer that got you here. Don't starve your existing cash engine to hunt for a theoretical prize you don't yet have the muscles to catch.",
    aiAnalysis: {
      rootCause: "Weak customer research",
      decisionBias: {
        name: "Sunk Cost Fallacy",
        description: "Continuing to pour resources into a failing plan because we had already invested heavy board expectations and early compliance fees.",
        whyItHappened: "After 3 months of SOC2 prep and zero sales traction, we doubled down on SSO and audits because we felt we 'couldn't turn back now' without admitting defeat to our investors.",
        howToAvoid: "Set explicit, time-boxed milestones. If no enterprise pilot signs within 4 months of compliance prep, pivot back to core designer priorities immediately.",
      },
      alternativeStrategy: "Offer a simple team sharing plan first. Use self-serve billing rather than complex high-touch sales, keeping the feature set lightweight while maintaining core freelance product updates.",
      businessImpact: {
        timeLostWeeks: 24,
        revenueImpactUSD: 216000,
        customerImpactPercent: 24,
        engineeringCostHours: 960,
        teamCostUSD: 180000,
      },
      riskLevel: "Medium",
      transferableLesson: "Product expansion should be concentric, not tangential. Build incremental extensions of user utility rather than forcing the product into a completely different market segment overnight.",
      confidenceScore: 91,
      explanation: "Analysis is highly confident. Moving from a purely B2C/prosumer draw tool directly to Enterprise sales without a middle B2B self-serve tier is a very common failure pattern.",
    },
    likes: 198,
    commentsCount: 9,
    reposts: 28,
    bookmarks: 45,
    shares: 19,
    views: 3100,
    reads: 920,
    aiHelpfulnessRating: 4.6,
    comments: [
      {
        id: "c-3",
        authorName: "Marcus Chen",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        authorHeadline: "Founder & CTO at Veloce",
        time: "3 days ago",
        comment: "Excellent writeup, Sarah. Freelancers are the atomic advocates of tools like Notion, Figma, and Slack. If you lose them, you lose the bottom-up land-and-expand loop. Enterprise sales cycles take 9-12 months anyway, which can kill a seed startup.",
        likes: 18,
        replies: [],
      }
    ],
    relatedTopics: ["Product Strategy", "SaaS Pricing", "Customer Retrospective"]
  }
];

// Profile storage
let userProfile = {
  id: "current-user",
  name: "Anonymous Builder",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  headline: "Aspiring Tech Founder",
  company: "Stealth",
  industry: "Technology",
  isVerified: false,
  location: "Global",
  website: "",
  linkedin: "",
  github: "",
  bio: "Dedicated to building professional products and learning from honest decision-making. Working on stealth solutions.",
  followers: 12,
  following: 45,
  storiesPublished: 0,
  lessonsShared: 0,
  bookmarksCount: 0,
  readingStreak: 1,
  totalReads: 14,
  aiScore: 10,
};

// Saved collections storage
let collections: any[] = [
  {
    id: "col-1",
    name: "Architectural Pitfalls",
    storyCount: 1,
    coverStories: ["Scaling our database horizontally before finding PMF cost us $120k and 4 months"],
    stories: ["story-1"]
  }
];

// Notifications storage
let notifications: any[] = [
  {
    id: "n-1",
    type: "ai_complete",
    icon: "Sparkles",
    title: "AI Analysis Complete",
    description: "Welcome to FaultLine! Your onboarding decision assistant is ready to help you analyze your stories.",
    time: "2 hours ago",
    isUnread: true,
  },
  {
    id: "n-2",
    type: "trending_lesson",
    icon: "TrendingUp",
    title: "Trending in Startup",
    description: "Marcus Chen's story on Database Scalability is trending among founders this week.",
    time: "1 day ago",
    isUnread: false,
    storyId: "story-1",
  }
];

// Core AI analysis generation route helper
async function generateAIAnalysis(story: any) {
  if (!aiApiKey) {
    console.warn("GEMINI_API_KEY is not defined. Returning a fallback mock analysis.");
    return createFallbackAnalysis(story);
  }

  const prompt = `
    You are the premium decision intelligence model for "FaultLine".
    Your goal is to perform a world-class professional analysis on a founder's shared story.
    Do NOT rewrite the story itself. Instead, extract deeper intellectual patterns, psychological biases, and practical recommendations.

    Here is the story:
    Title: "${story.title}"
    Category: "${story.category}"
    Context: "${story.context.situation}"
    Decision: "${story.decision.action}" (Why they did it: "${story.decision.whyCorrectThen}", Emotional Factors: "${story.decision.emotionalFactors || 'None'}")
    Outcome: "${story.outcome.whatHappened}" (Negatives: "${story.outcome.negatives || 'N/A'}", Positives: "${story.outcome.positives || 'N/A'}", Financial: "${story.outcome.financialImpact || 'N/A'}")
    Reflection: "${story.reflection.misunderstood}" (What surprised them: "${story.reflection.surprised || 'N/A'}")
    Key Lesson: "${story.keyLesson}"

    Analyze the decision and return a JSON object matching the following TypeScript schema:
    {
      "rootCause": string (Choose one of: "Poor validation", "Communication failure", "Leadership conflict", "Technical debt", "Incorrect assumptions", "Weak customer research", "Scaling too early", "Hiring too quickly", "Pricing mistakes", or suggest another short professional root cause phrase),
      "decisionBias": {
        "name": string (Choose a psychological decision bias such as: "Confirmation Bias", "Survivorship Bias", "Sunk Cost Fallacy", "Overconfidence", "Recency Bias", "Authority Bias", "Optimism Bias", "Anchoring Bias"),
        "description": string (Brief definition of this psychological bias),
        "whyItHappened": string (Specific explanation of how this bias played out in the author's decision based on their story),
        "howToAvoid": string (Actionable advice on how the author or another founder can avoid this specific bias in the future)
      },
      "alternativeStrategy": string (A practical, realistic recommendation of what they should have done instead),
      "businessImpact": {
        "timeLostWeeks": number (Estimate weeks lost, between 1 and 100),
        "revenueImpactUSD": number (Estimate USD revenue loss/cost, or 0 if none),
        "customerImpactPercent": number (Estimate percentage of customers affected, 0 to 100),
        "engineeringCostHours": number (Estimate engineering hours spent unnecessarily, or 0 if none),
        "teamCostUSD": number (Estimate team/wage cost of the failure, or 0 if none)
      },
      "riskLevel": "Low" | "Medium" | "High",
      "transferableLesson": string (One highly concise, punchy, shareable transferable takeaway for other builders),
      "confidenceScore": number (Between 70 and 99),
      "explanation": string (A professional summary of why the AI generated this specific analysis and how it fits professional frameworks)
    }

    Respond ONLY with valid, clean JSON. Do not include markdown code block characters like \`\`\`json.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating Gemini analysis: ", error);
    return createFallbackAnalysis(story);
  }
}

// Fallback analysis if Gemini is unavailable
function createFallbackAnalysis(story: any) {
  const categoriesBiases: Record<string, any> = {
    Startup: {
      name: "Optimism Bias",
      description: "A cognitive bias that causes someone to believe that they themselves are less likely to experience a negative event.",
      why: "As an ambitious founder, you naturally assumed your team could pull off the transition flawlessly without hitting major roadmap delays.",
      avoid: "Double all timeline estimates for complex technological migrations, and define a hard revert threshold.",
    },
    Product: {
      name: "Confirmation Bias",
      description: "The tendency to search for, interpret, favor, and recall information in a way that confirms one's preexisting beliefs or hypotheses.",
      why: "You listened exclusively to high-profile enterprise requests while ignoring metrics showing prosumers were the true cash engine.",
      avoid: "Regularly audit usage logs. When prioritizing features, weigh them strictly by active volume rather than contract sizes.",
    },
    Engineering: {
      name: "Overconfidence",
      description: "A well-established bias in which a person's subjective confidence in his or her judgments is reliably greater than the objective accuracy of those judgments.",
      why: "We assumed that because our team was highly skilled, we could handle complex custom infrastructure easily.",
      avoid: "Default to standard serverless or managed cloud databases until current performance limits are genuinely reached.",
    },
  };

  const selected = categoriesBiases[story.category] || categoriesBiases["Startup"];

  return {
    rootCause: story.category === "Engineering" ? "Technical debt" : "Incorrect assumptions",
    decisionBias: {
      name: selected.name,
      description: selected.description,
      whyItHappened: selected.why,
      howToAvoid: selected.avoid,
    },
    alternativeStrategy: "Take an incremental approach. Validate demand via basic prototypes and surveys before committing significant code or capital.",
    businessImpact: {
      timeLostWeeks: 8,
      revenueImpactUSD: 25000,
      customerImpactPercent: 12,
      engineeringCostHours: 240,
      teamCostUSD: 30000,
    },
    riskLevel: "Medium",
    transferableLesson: "Never trade immediate customer feedback for speculative future expansion capabilities.",
    confidenceScore: 88,
    explanation: "This is an automated analysis generated via FaultLine's local decision framework based on past common startup pivots.",
  };
}

// API Routes

// Fetch all stories
app.get("/api/stories", requireAuth, (req, res) => {
  const { category, search } = req.query;
  const offset = Math.max(0, Number(req.query.offset ?? 0));
  const limit = Math.max(1, Math.min(20, Number(req.query.limit ?? 20)));
  let filtered = [...stories];

  if (category && category !== "All") {
    filtered = filtered.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.keyLesson.toLowerCase().includes(q) ||
        s.author.name.toLowerCase().includes(q) ||
        (s.author.company && s.author.company.toLowerCase().includes(q))
    );
  }

  const batch = filtered.slice(offset, offset + limit);
  res.json({
    stories: batch,
    nextOffset: offset + batch.length,
  });
});

// Fetch single story
app.get("/api/stories/:id", requireAuth, (req, res) => {
  const story = stories.find(s => s.id === req.params.id);
  if (!story) {
    return res.status(404).json({ error: "Story not found" });
  }
  res.json(story);
});

// Toggle Like
app.post("/api/stories/:id/like", requireAuth, (req, res) => {
  const storyIndex = stories.findIndex(s => s.id === req.params.id);
  if (storyIndex === -1) {
    return res.status(404).json({ error: "Story not found" });
  }

  const story = stories[storyIndex];
  if (story.hasLiked) {
    story.likes -= 1;
    story.hasLiked = false;
  } else {
    story.likes += 1;
    story.hasLiked = true;
  }
  res.json({ likes: story.likes, hasLiked: story.hasLiked });
});

// Toggle Bookmark
app.post("/api/stories/:id/bookmark", requireAuth, (req, res) => {
  const storyIndex = stories.findIndex(s => s.id === req.params.id);
  if (storyIndex === -1) {
    return res.status(404).json({ error: "Story not found" });
  }

  const story = stories[storyIndex];
  if (story.hasBookmarked) {
    story.bookmarks -= 1;
    story.hasBookmarked = false;
    userProfile.bookmarksCount = Math.max(0, userProfile.bookmarksCount - 1);
  } else {
    story.bookmarks += 1;
    story.hasBookmarked = true;
    userProfile.bookmarksCount += 1;
  }
  res.json({ bookmarks: story.bookmarks, hasBookmarked: story.hasBookmarked });
});

// Add Comment
app.post("/api/stories/:id/comment", requireAuth, (req, res) => {
  const storyIndex = stories.findIndex(s => s.id === req.params.id);
  if (storyIndex === -1) {
    return res.status(404).json({ error: "Story not found" });
  }

  const { comment } = req.body;
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Comment text is required" });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    authorName: userProfile.name,
    authorAvatar: userProfile.avatar,
    authorHeadline: userProfile.headline,
    time: "Just now",
    comment: comment,
    likes: 0,
    replies: [],
  };

  stories[storyIndex].comments.push(newComment);
  stories[storyIndex].commentsCount += 1;

  // Add notification to story author if it is not current user
  if (stories[storyIndex].author.id !== userProfile.id) {
    notifications.unshift({
      id: `n-${Date.now()}`,
      type: "comment",
      icon: "MessageSquare",
      title: "New Comment",
      description: `${userProfile.name} commented on your story: "${stories[storyIndex].title}"`,
      time: "Just now",
      isUnread: true,
      storyId: stories[storyIndex].id,
    });
  }

  res.json(newComment);
});

// Publish a new story
app.post("/api/stories", requireAuth, async (req, res) => {
  const { title, category, context, decision, outcome, reflection, keyLesson } = req.body;

  if (!title || !category || !context || !decision || !outcome || !reflection || !keyLesson) {
    return res.status(400).json({ error: "All story fields are required." });
  }

  const newStoryId = `story-${Date.now()}`;
  const newStory: any = {
    id: newStoryId,
    title,
    summary: outcome.whatHappened.slice(0, 150) + "...",
    category,
    time: "Just now",
    readingTime: `${Math.max(1, Math.ceil((context.situation.length + decision.action.length + outcome.whatHappened.length) / 800))} min read`,
    author: {
      ...userProfile,
      id: userProfile.id,
      storiesPublished: userProfile.storiesPublished + 1,
    },
    context,
    decision,
    outcome,
    reflection,
    keyLesson,
    likes: 0,
    commentsCount: 0,
    reposts: 0,
    bookmarks: 0,
    shares: 0,
    views: 1,
    reads: 0,
    comments: [],
    relatedTopics: [category, "Reflections"],
  };

  // Push temporarily, then run AI analysis asynchronously or block-wait for feedback
  stories.unshift(newStory);

  // Update user stats
  userProfile.storiesPublished += 1;
  userProfile.lessonsShared += 1;
  userProfile.aiScore = Math.min(100, userProfile.aiScore + 15);

  // Trigger analysis
  const aiAnalysis = await generateAIAnalysis(newStory);
  newStory.aiAnalysis = aiAnalysis;

  // Find updated story index and merge
  const idx = stories.findIndex(s => s.id === newStoryId);
  if (idx !== -1) {
    stories[idx] = newStory;
  }

  // Create success notification
  notifications.unshift({
    id: `n-ai-${Date.now()}`,
    type: "ai_complete",
    icon: "Sparkles",
    title: "AI Analysis Complete",
    description: `We've generated custom Decision Intelligence insights for your story: "${title}"`,
    time: "Just now",
    isUnread: true,
    storyId: newStoryId,
  });

  res.json(newStory);
});

// AI Suggestion Box feedback endpoint while composing
app.post("/api/suggest", async (req, res) => {
  const { title, context, decision, outcome, keyLesson } = req.body;

  if (!aiApiKey) {
    return res.json({
      titleSuggestion: title ? `How about: "How we compromised our roadmap on: ${title}"` : undefined,
      lessonSuggestion: "Try to specify the precise metrics of the lesson to keep it highly shareable.",
      missingContext: "Describe the exact company funding level and stage to give readers more baseline parameters.",
      clearerDecision: "Explain specifically who was in the room when the final call was made.",
    });
  }

  const prompt = `
    You are an AI writing mentor for "FaultLine" (a professional decision sharing platform).
    The user is drafts a story.
    Current Draft:
    Title: "${title || ''}"
    Context: "${context || ''}"
    Decision: "${decision || ''}"
    Outcome: "${outcome || ''}"
    Key Lesson: "${keyLesson || ''}"

    Provide constructive suggestions to improve their post and make it look like a pristine, transparent case study.
    Suggest:
    1. A better, more objective title if possible.
    2. Missing context (what crucial details are missing like funding, company stage, team size, assumptions).
    3. Better lesson phrasing.
    4. Clearer decision actions.

    Respond with a clean JSON object ONLY of this format:
    {
      "titleSuggestion": "...",
      "lessonSuggestion": "...",
      "missingContext": "...",
      "clearerDecision": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    res.json(JSON.parse(cleanText));
  } catch (error) {
    res.status(500).json({ error: "Failed to generate writing suggestions" });
  }
});

// AI-assisted natural-language search
app.post("/api/search", async (req, res) => {
  const { query } = req.body;
  if (!query || query.trim() === "") {
    return res.json(stories);
  }

  if (!aiApiKey) {
    // Basic local keyword filter fallback
    const q = query.toLowerCase();
    const matches = stories.filter(
      s =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.keyLesson.toLowerCase().includes(q)
    );
    return res.json(matches);
  }

  const storiesBrief = stories.map(s => ({
    id: s.id,
    title: s.title,
    summary: s.summary,
    category: s.category,
    keyLesson: s.keyLesson,
  }));

  const prompt = `
    You are a professional search semantic assistant for "FaultLine".
    The user has searched with this natural language query: "${query}"

    Here is a list of available decision stories:
    ${JSON.stringify(storiesBrief, null, 2)}

    Determine which stories best address or contain lessons relevant to the user's query.
    Return a list of IDs of matching stories, sorted by relevance.
    Respond with a clean JSON array of strings ONLY, e.g. ["story-1", "story-2"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const matchedIds = JSON.parse(cleanText);

    if (Array.isArray(matchedIds)) {
      const sortedStories = matchedIds
        .map(id => stories.find(s => s.id === id))
        .filter(Boolean);
      return res.json(sortedStories);
    }
    res.json(stories);
  } catch (error) {
    console.error("AI Search Error:", error);
    res.json(stories);
  }
});

// Fetch notifications
app.get("/api/notifications", requireAuth, (req, res) => {
  res.json(notifications);
});

// Mark all notifications read
app.post("/api/notifications/mark-read", requireAuth, (req, res) => {
  notifications = notifications.map(n => ({ ...n, isUnread: false }));
  res.json({ success: true });
});

// Fetch user profile
app.get("/api/profile", requireAuth, async (req, res) => {
  if (req.user) {
    const user = req.user;
    return res.json({
      ...userProfile,
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || userProfile.name,
      email: user.email,
    });
  }

  res.json(userProfile);
});

// Update user profile
app.put("/api/profile", requireAuth, (req, res) => {
  userProfile = {
    ...userProfile,
    ...req.body,
  };
  res.json(userProfile);
});

// Fetch saved collections
app.get("/api/collections", requireAuth, (req, res) => {
  res.json(collections);
});

// Create collection
app.post("/api/collections", requireAuth, (req, res) => {
  const { name, storyId } = req.body;
  if (!name) return res.status(400).json({ error: "Collection name is required." });

  const story = stories.find(s => s.id === storyId);
  const coverStories = story ? [story.title] : [];

  const newCol = {
    id: `col-${Date.now()}`,
    name,
    storyCount: storyId ? 1 : 0,
    coverStories,
    stories: storyId ? [storyId] : [],
  };

  collections.push(newCol);
  res.json(newCol);
});

// Save story to collection
app.post("/api/collections/:id/add", requireAuth, (req, res) => {
  const colIndex = collections.findIndex(c => c.id === req.params.id);
  if (colIndex === -1) return res.status(404).json({ error: "Collection not found" });

  const { storyId } = req.body;
  const story = stories.find(s => s.id === storyId);
  if (!story) return res.status(404).json({ error: "Story not found" });

  const col = collections[colIndex];
  if (!col.stories.includes(storyId)) {
    col.stories.push(storyId);
    col.storyCount += 1;
    col.coverStories.push(story.title);
  }

  res.json(col);
});

// Onboarding complete route - upgrades auth state
app.post("/api/profile/onboarding-complete", requireAuth, (req, res) => {
  userProfile.isVerified = true;
  userProfile.name = req.body.name || "Alex Rivera";
  userProfile.headline = req.body.headline || "Co-Founder @ StealthSaaS";
  userProfile.company = req.body.company || "StealthSaaS";
  userProfile.industry = req.body.industry || "SaaS";
  userProfile.location = req.body.location || "New York, NY";
  userProfile.aiScore = 30; // onboarding boost
  res.json(userProfile);
});

// Vite server integrations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FaultLine Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
