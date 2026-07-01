import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

type Req = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
};

type Res = {
  status: (code: number) => Res;
  json: (payload: any) => void;
};

const fallbackStories: any[] = [
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
    context: { situation: "We had just raised our $2M Seed round and had about 15 beta users.", stage: "Seed Stage", funding: "$2,000,000 Seed", involved: "CTO, 2 Senior Infrastructure Engineers, and Founder", assumptions: "We assumed scale was immediate." },
    decision: { action: "Migrate to Cassandra.", whyCorrectThen: "We feared launch-day write spikes.", emotionalFactors: "Fear of looking amateur." },
    outcome: { whatHappened: "Migration became a 3 month operational burden.", negatives: "Lost focus and money.", positives: "Better write pipeline.", financialImpact: "$120,000 lost" },
    reflection: { misunderstood: "Scaling risk was not existential risk.", surprised: "How hard it was to operate Cassandra.", neverRepeat: "No more premature scale work." },
    keyLesson: "Keep the stack humble until growth demands otherwise.",
    aiAnalysis: { rootCause: "Scaling too early", decisionBias: { name: "Overconfidence Bias", description: "Overestimating control.", whyItHappened: "They overtrusted their infra skills.", howToAvoid: "Use a pre-mortem." }, alternativeStrategy: "Stay on Postgres.", businessImpact: { timeLostWeeks: 16, revenueImpactUSD: 0, customerImpactPercent: 13, engineeringCostHours: 640, teamCostUSD: 120000 }, riskLevel: "High", transferableLesson: "Premature optimization is the startup tax.", confidenceScore: 94, explanation: "High confidence heuristic analysis." },
    likes: 342,
    commentsCount: 0,
    reposts: 54,
    bookmarks: 88,
    shares: 42,
    views: 4500,
    reads: 1200,
    aiHelpfulnessRating: 4.8,
    comments: [],
    relatedTopics: ["Premature Optimization", "SaaS Stack", "Scaling Failures"],
  },
];

const fallbackProfile = {
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
  bio: "Dedicated to building professional products and learning from honest decision-making.",
  followers: 12,
  following: 45,
  storiesPublished: 0,
  lessonsShared: 0,
  bookmarksCount: 0,
  readingStreak: 1,
  totalReads: 14,
  aiScore: 10,
};

const seedStoryTemplates = [
  {
    title: "We chose the fastest term sheet and inherited the slowest board dynamic",
    summary: "A promising seed round became operationally expensive because we optimized for speed instead of investor fit.",
    category: "Startup",
    domain: "Fintech",
    assumption: "We assumed all capital was equal if the valuation and close date looked good.",
    decisionAction: "Accept the fastest term sheet without doing deeper partner-reference checks.",
    whyCorrectThen: "Runway was tight, the market was moving, and the offer reduced immediate fundraising pressure.",
    emotionalFactors: "Relief, fatigue, and fear that another offer would not arrive.",
    negative: "Board discussions slowed major hiring and product decisions for months.",
    positive: "The money did extend runway and forced cleaner reporting discipline.",
    surprise: "The investor's operating style mattered more than the valuation headline.",
    neverRepeat: "We will reference-check partner behavior, not only firm reputation.",
    lesson: "Investor fit is a product decision for the company, not a closing detail.",
  },
  {
    title: "We treated certification like paperwork and lost the selling season",
    summary: "Compliance looked like a post-launch task until procurement turned it into the critical path.",
    category: "Product",
    domain: "Healthtech",
    assumption: "We assumed buyers cared about features first and compliance proof later.",
    decisionAction: "Delay certification work until after the pilot product was polished.",
    whyCorrectThen: "The product gaps felt more visible than the audit checklist.",
    emotionalFactors: "Product pride and impatience to show a beautiful demo.",
    negative: "Procurement blocked the rollout and competitors captured the annual budget cycle.",
    positive: "The delay exposed a repeatable enterprise-readiness checklist.",
    surprise: "The champion loved the product but could not route around procurement.",
    neverRepeat: "We now map procurement requirements before building the pilot promise.",
    lesson: "Enterprise readiness is part of the product, not paperwork after the product.",
  },
  {
    title: "Our beautiful portal failed because legal review had no path through it",
    summary: "We shipped a cleaner user journey but ignored the internal reviewer who controlled approval speed.",
    category: "Operations",
    domain: "Legaltech",
    assumption: "We assumed the buyer and daily user were enough to design the workflow.",
    decisionAction: "Launch the customer portal without a legal-review queue or escalation view.",
    whyCorrectThen: "The buyer wanted a simple interface and fewer visible process steps.",
    emotionalFactors: "Desire to look modern and avoid enterprise complexity.",
    negative: "Deals stalled because legal teams exported everything back into spreadsheets.",
    positive: "The failure revealed the real multi-stakeholder workflow.",
    surprise: "The hidden reviewer had more influence than the executive sponsor.",
    neverRepeat: "We identify every blocker-user before calling a workflow complete.",
    lesson: "If a workflow has invisible approvers, the product is not finished until they have a path.",
  },
  {
    title: "We priced breakthrough research like a dashboard subscription",
    summary: "A technically strong AI product underperformed because pricing copied SaaS norms instead of value created.",
    category: "AI",
    domain: "AI Research",
    assumption: "We assumed monthly seats would make an advanced workflow easier to buy.",
    decisionAction: "Launch with low per-seat pricing instead of outcome-based packaging.",
    whyCorrectThen: "The team wanted low friction and familiar SaaS procurement.",
    emotionalFactors: "Fear of sounding expensive before customers trusted us.",
    negative: "Customers treated the product like a nice-to-have dashboard instead of strategic infrastructure.",
    positive: "Usage data helped quantify the value of successful research acceleration.",
    surprise: "Higher prices created more serious evaluation behavior.",
    neverRepeat: "We price from the economic outcome before choosing the billing unit.",
    lesson: "A high-leverage product needs value-based packaging, not borrowed SaaS pricing.",
  },
];

function seededNumber(seed: number, salt: number) {
  let value = seed + salt * 0x9e3779b9;
  value = Math.imul(value ^ (value >>> 16), 0x85ebca6b);
  value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
  return (value ^ (value >>> 16)) >>> 0;
}

function metricInRange(seed: number, salt: number, min: number, max: number) {
  return min + (seededNumber(seed, salt) % (max - min + 1));
}

function generateStories(startIndex: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = startIndex + offset + 1;
    const template = seedStoryTemplates[index % seedStoryTemplates.length];
    const views = metricInRange(index, 1, 900, 18000);
    const reads = Math.round(views * 0.62);
    const likes = metricInRange(index, 2, 24, 520);
    const bookmarks = metricInRange(index, 3, 8, 180);
    const shares = metricInRange(index, 4, 4, 90);

    return {
      id: `generated-story-${index}`,
      title: template.title,
      summary: template.summary,
      category: template.category,
      time: `${metricInRange(index, 5, 1, 14)} days ago`,
      readingTime: `${metricInRange(index, 6, 4, 8)} min read`,
      author: fallbackProfile,
      context: {
        situation: `A ${template.domain} team was trying to move faster while customers were asking for more proof, structure, and confidence.`,
        stage: ["Pre-seed", "Seed", "Series A"][index % 3],
        funding: ["Bootstrapped", "$500k angel", "$2M seed", "$8M Series A"][index % 4],
        involved: `${metricInRange(index, 7, 4, 48)} team members and ${metricInRange(index, 8, 2, 18)} customer stakeholders`,
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
        financialImpact: `$${metricInRange(index, 9, 12000, 240000).toLocaleString()} in delayed revenue, rework, or avoidable cost`,
      },
      reflection: {
        misunderstood: template.assumption,
        surprised: template.surprise,
        neverRepeat: template.neverRepeat,
      },
      keyLesson: template.lesson,
      aiAnalysis: createFallbackAnalysis(template),
      likes,
      commentsCount: metricInRange(index, 10, 0, 36),
      reposts: Math.round(shares * 0.35),
      bookmarks,
      shares,
      views,
      reads,
      aiHelpfulnessRating: 4.6,
      hasLiked: false,
      hasBookmarked: false,
      hasReposted: false,
      comments: [],
      relatedTopics: [template.domain, template.category, "Decision Quality"],
    };
  });
}

let fallbackNotifications: any[] = [];
let fallbackCollections: any[] = [];

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey) : null;

const aiApiKey = process.env.GEMINI_API_KEY || "";
const ai = aiApiKey ? new GoogleGenAI({ apiKey: aiApiKey, httpOptions: { headers: { "User-Agent": "faultline-vercel" } } }) : null;

function send(res: Res, statusCode: number, payload: any) {
  res.status(statusCode).json(payload);
}

function relativeTime(dateString: string) {
  const then = new Date(dateString).getTime();
  const now = Date.now();
  const minutes = Math.max(1, Math.round((now - then) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

async function requireAuth(req: Req, res: Res) {
  if (!supabaseAdmin) return true;
  const authHeader = req.headers.authorization || "";
  const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const bearer = token.startsWith("Bearer ") ? token.slice(7) : "";
  if (!bearer) {
    send(res, 401, { error: "Missing authorization token" });
    return false;
  }
  const { data, error } = await supabaseAdmin.auth.getUser(bearer);
  if (error || !data.user) {
    send(res, 401, { error: "Invalid authorization token" });
    return false;
  }
  (req as any).user = data.user;
  return true;
}

async function ensureProfile(user: any) {
  if (!supabaseAdmin) return fallbackProfile;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    return profile;
  }

  const newProfile = {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Builder",
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Builder",
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || fallbackProfile.avatar,
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || fallbackProfile.avatar,
    headline: user.user_metadata?.headline || "Aspiring Tech Founder",
    company: user.user_metadata?.company || "",
    industry: user.user_metadata?.industry || "Technology",
    location: user.user_metadata?.location || "",
    website: user.user_metadata?.website || "",
    linkedin: user.user_metadata?.linkedin || "",
    github: user.user_metadata?.github || "",
    bio: user.user_metadata?.bio || "",
    onboarding_completed: false,
  };

  const { data: insertedProfile, error } = await supabaseAdmin
    .from("profiles")
    .upsert(newProfile)
    .select("*")
    .single();

  if (error) {
    return {
      ...newProfile,
      is_verified: true,
      followers_count: 0,
      following_count: 0,
      stories_published: 0,
      lessons_shared: 0,
      bookmarks_count: 0,
      reading_streak: 1,
      total_reads: 0,
      ai_score: 10,
    };
  }

  return insertedProfile;
}

function toAuthor(profile: any) {
  return {
    id: profile.id,
    name: profile.full_name || profile.name || fallbackProfile.name,
    avatar: profile.avatar_url || profile.avatar || fallbackProfile.avatar,
    headline: profile.headline || fallbackProfile.headline,
    company: profile.company || "",
    industry: profile.industry || fallbackProfile.industry,
    isVerified: profile.is_verified ?? true,
    location: profile.location || "",
    website: profile.website || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    bio: profile.bio || "",
    followers: profile.followers_count ?? profile.followers ?? 0,
    following: profile.following_count ?? profile.following ?? 0,
    storiesPublished: profile.stories_published ?? profile.stories ?? 0,
    lessonsShared: profile.lessons_shared ?? profile.lessons ?? 0,
    bookmarksCount: profile.bookmarks_count ?? profile.bookmarks ?? 0,
    readingStreak: profile.reading_streak ?? 1,
    totalReads: profile.total_reads ?? 0,
    aiScore: profile.ai_score ?? 10,
  };
}

async function getProfilesByIds(ids: string[]) {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (!supabaseAdmin || uniqueIds.length === 0) return new Map<string, any>();

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .in("id", uniqueIds);

  if (error) {
    console.error("Failed to load profiles", error);
    return new Map<string, any>();
  }

  return new Map((data || []).map((profile: any) => [profile.id, profile]));
}

function createFallbackAnalysis(story: any) {
  return {
    rootCause: "Incorrect assumptions",
    decisionBias: {
      name: "Optimism Bias",
      description: "Believing the best-case path is the likely one.",
      whyItHappened: "The team underweighted risk.",
      howToAvoid: "Force a pre-mortem.",
    },
    alternativeStrategy: "Validate first, then scale.",
    businessImpact: { timeLostWeeks: 8, revenueImpactUSD: 25000, customerImpactPercent: 12, engineeringCostHours: 240, teamCostUSD: 30000 },
    riskLevel: "Medium",
    transferableLesson: "Don't trade customer feedback for theory.",
    confidenceScore: 88,
    explanation: "Fallback analysis.",
  };
}

async function generateAIAnalysis(story: any) {
  if (!aiApiKey || !ai) return createFallbackAnalysis(story);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze this story and return JSON only: ${JSON.stringify(story)}`,
      config: { responseMimeType: "application/json" },
    });
    return JSON.parse((response.text || "").replace(/```json/g, "").replace(/```/g, "").trim());
  } catch {
    return createFallbackAnalysis(story);
  }
}

async function mapStoryRow(row: any, currentUserId?: string, authorProfile?: any) {
  const { data: commentsRows } = await supabaseAdmin!
    .from("story_comments")
    .select("id, comment, likes_count, created_at, author_id")
    .eq("story_id", row.id)
    .order("created_at", { ascending: true });

  const commentProfiles = await getProfilesByIds((commentsRows || []).map((comment: any) => comment.author_id));

  const { data: likedRow } = currentUserId
    ? await supabaseAdmin!.from("story_likes").select("story_id").eq("story_id", row.id).eq("user_id", currentUserId).maybeSingle()
    : { data: null };

  const { data: bookmarkedRow } = currentUserId
    ? await supabaseAdmin!.from("story_bookmarks").select("story_id").eq("story_id", row.id).eq("user_id", currentUserId).maybeSingle()
    : { data: null };

  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    category: row.category,
    author: toAuthor(authorProfile || row.profiles || fallbackProfile),
    time: relativeTime(row.created_at),
    readingTime: row.reading_time,
    context: row.context,
    decision: row.decision,
    outcome: row.outcome,
    reflection: row.reflection,
    keyLesson: row.key_lesson,
    aiAnalysis: row.ai_analysis || undefined,
    likes: row.likes_count,
    commentsCount: row.comments_count,
    reposts: row.reposts_count,
    bookmarks: row.bookmarks_count,
    shares: row.shares_count,
    views: row.views_count,
    reads: row.reads_count,
    aiHelpfulnessRating: row.ai_helpfulness_rating || undefined,
    hasLiked: Boolean(likedRow),
    hasBookmarked: Boolean(bookmarkedRow),
    comments: (commentsRows || []).map((comment: any) => ({
      id: comment.id,
      authorName: commentProfiles.get(comment.author_id)?.full_name || commentProfiles.get(comment.author_id)?.name || "Member",
      authorAvatar: commentProfiles.get(comment.author_id)?.avatar_url || commentProfiles.get(comment.author_id)?.avatar || fallbackProfile.avatar,
      authorHeadline: commentProfiles.get(comment.author_id)?.headline || "FaultLine Member",
      time: relativeTime(comment.created_at),
      comment: comment.comment,
      likes: comment.likes_count,
      replies: [],
    })),
    relatedTopics: row.related_topics || [],
  };
}

async function seedStoriesIfNeeded() {
  if (!supabaseAdmin) return;

  const existingStories = await supabaseAdmin.from("stories").select("id", { count: "exact", head: true });
  if ((existingStories.count || 0) > 0) {
    return;
  }

  const usersRes = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 20 });
  const users = usersRes.data?.users || [];
  if (users.length === 0) {
    return;
  }

  const profiles = [];
  for (const user of users) {
    profiles.push(await ensureProfile(user));
  }

  const generatedStories = generateStories(0, 24);
  const rows = generatedStories.map((story, index) => {
    const author = profiles[index % profiles.length];
    return {
      author_id: author.id,
      title: story.title,
      summary: story.summary,
      category: story.category,
      reading_time: story.readingTime,
      context: story.context,
      decision: story.decision,
      outcome: story.outcome,
      reflection: story.reflection,
      key_lesson: story.keyLesson,
      ai_analysis: story.aiAnalysis,
      likes_count: story.likes,
      comments_count: 0,
      reposts_count: story.reposts,
      bookmarks_count: story.bookmarks,
      shares_count: story.shares,
      views_count: story.views,
      reads_count: story.reads,
      ai_helpfulness_rating: story.aiHelpfulnessRating,
      related_topics: story.relatedTopics || [],
    };
  });

  await supabaseAdmin.from("stories").insert(rows);
}

async function getStoriesFromDb(params: URLSearchParams, currentUserId?: string) {
  try {
    await seedStoriesIfNeeded();

    const category = params.get("category");
    const search = params.get("search");
    const offset = Math.max(0, Number(params.get("offset") || 0));
    const limit = Math.max(1, Math.min(20, Number(params.get("limit") || 20)));

    let query = supabaseAdmin!
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (search?.trim()) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,key_lesson.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const authorProfiles = await getProfilesByIds((data || []).map((row: any) => row.author_id));
    const stories = await Promise.all((data || []).map((row) => mapStoryRow(row, currentUserId, authorProfiles.get(row.author_id))));
    const shouldUseFallbackFeed = stories.length === 0 && !search?.trim() && (!category || category === "All");

    return {
      stories: shouldUseFallbackFeed ? generateStories(offset, limit) : stories,
      nextOffset: offset + (shouldUseFallbackFeed ? limit : stories.length),
    };
  } catch (error) {
    console.error("Failed to load stories from database", error);
    const offset = Math.max(0, Number(params.get("offset") || 0));
    const limit = Math.max(1, Math.min(20, Number(params.get("limit") || 20)));
    const fallbackBatch = generateStories(offset, limit);
    return { stories: fallbackBatch, nextOffset: offset + fallbackBatch.length };
  }
}

export default async function handler(req: Req, res: Res) {
  const url = new URL(req.url || "http://localhost/api", "http://localhost");
  const pathname = url.pathname.replace(/^\/api/, "") || "/";
  const method = (req.method || "GET").toUpperCase();

  if (pathname === "/stories" && method === "GET") {
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) return send(res, 200, { stories: fallbackStories, nextOffset: fallbackStories.length });
    return send(res, 200, await getStoriesFromDb(url.searchParams, (req as any).user?.id));
  }

  if (pathname.startsWith("/stories/") && method === "GET") {
    if (!(await requireAuth(req, res))) return;
    const id = pathname.split("/")[2];
    if (!supabaseAdmin) {
      const story = fallbackStories.find((s) => s.id === id);
      return story ? send(res, 200, story) : send(res, 404, { error: "Story not found" });
    }
    const { data, error } = await supabaseAdmin
      .from("stories")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return send(res, 404, { error: "Story not found" });
    const profiles = await getProfilesByIds([data.author_id]);
    return send(res, 200, await mapStoryRow(data, (req as any).user?.id, profiles.get(data.author_id)));
  }

  if (pathname.startsWith("/stories/") && pathname.endsWith("/like") && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    const id = pathname.split("/")[2];
    const userId = (req as any).user.id;
    if (!supabaseAdmin) return send(res, 404, { error: "Database not configured" });

    const { data: existing } = await supabaseAdmin.from("story_likes").select("story_id").eq("story_id", id).eq("user_id", userId).maybeSingle();
    if (existing) {
      await supabaseAdmin.from("story_likes").delete().eq("story_id", id).eq("user_id", userId);
      const storyRes = await supabaseAdmin.from("stories").select("likes_count").eq("id", id).single();
      const nextLikes = Math.max(0, (storyRes.data?.likes_count || 0) - 1);
      await supabaseAdmin.from("stories").update({ likes_count: nextLikes }).eq("id", id);
      return send(res, 200, { likes: nextLikes, hasLiked: false });
    }

    await supabaseAdmin.from("story_likes").insert({ story_id: id, user_id: userId });
    const storyRes = await supabaseAdmin.from("stories").select("likes_count").eq("id", id).single();
    const nextLikes = (storyRes.data?.likes_count || 0) + 1;
    await supabaseAdmin.from("stories").update({ likes_count: nextLikes }).eq("id", id);
    return send(res, 200, { likes: nextLikes, hasLiked: true });
  }

  if (pathname.startsWith("/stories/") && pathname.endsWith("/bookmark") && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    const id = pathname.split("/")[2];
    const userId = (req as any).user.id;
    if (!supabaseAdmin) return send(res, 404, { error: "Database not configured" });

    const { data: existing } = await supabaseAdmin.from("story_bookmarks").select("story_id").eq("story_id", id).eq("user_id", userId).maybeSingle();
    if (existing) {
      await supabaseAdmin.from("story_bookmarks").delete().eq("story_id", id).eq("user_id", userId);
      const storyRes = await supabaseAdmin.from("stories").select("bookmarks_count").eq("id", id).single();
      const profileRes = await supabaseAdmin.from("profiles").select("bookmarks_count").eq("id", userId).single();
      const nextBookmarks = Math.max(0, (storyRes.data?.bookmarks_count || 0) - 1);
      const nextProfileBookmarks = Math.max(0, (profileRes.data?.bookmarks_count || 0) - 1);
      await supabaseAdmin.from("stories").update({ bookmarks_count: nextBookmarks }).eq("id", id);
      await supabaseAdmin.from("profiles").update({ bookmarks_count: nextProfileBookmarks }).eq("id", userId);
      return send(res, 200, { bookmarks: nextBookmarks, hasBookmarked: false });
    }

    await supabaseAdmin.from("story_bookmarks").insert({ story_id: id, user_id: userId });
    const storyRes = await supabaseAdmin.from("stories").select("bookmarks_count").eq("id", id).single();
    const profileRes = await supabaseAdmin.from("profiles").select("bookmarks_count").eq("id", userId).single();
    const nextBookmarks = (storyRes.data?.bookmarks_count || 0) + 1;
    const nextProfileBookmarks = (profileRes.data?.bookmarks_count || 0) + 1;
    await supabaseAdmin.from("stories").update({ bookmarks_count: nextBookmarks }).eq("id", id);
    await supabaseAdmin.from("profiles").update({ bookmarks_count: nextProfileBookmarks }).eq("id", userId);
    return send(res, 200, { bookmarks: nextBookmarks, hasBookmarked: true });
  }

  if (pathname.startsWith("/stories/") && pathname.endsWith("/comment") && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    const id = pathname.split("/")[2];
    const comment = req.body?.comment;
    if (!comment?.trim()) return send(res, 400, { error: "Comment text is required" });
    if (!supabaseAdmin) return send(res, 404, { error: "Database not configured" });

    const user = (req as any).user;
    const profile = await ensureProfile(user);
    const { data, error } = await supabaseAdmin
      .from("story_comments")
      .insert({ story_id: id, author_id: user.id, comment: comment.trim() })
      .select("id, comment, likes_count, created_at")
      .single();
    if (error || !data) return send(res, 500, { error: "Failed to create comment" });

    const storyRes = await supabaseAdmin.from("stories").select("comments_count").eq("id", id).single();
    await supabaseAdmin.from("stories").update({ comments_count: (storyRes.data?.comments_count || 0) + 1 }).eq("id", id);

    return send(res, 200, {
      id: data.id,
      authorName: profile.full_name || fallbackProfile.name,
      authorAvatar: profile.avatar_url || fallbackProfile.avatar,
      authorHeadline: profile.headline || fallbackProfile.headline,
      time: relativeTime(data.created_at),
      comment: data.comment,
      likes: data.likes_count,
      replies: [],
    });
  }

  if (pathname === "/stories" && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    const body = req.body || {};
    if (!body.title || !body.category || !body.context || !body.decision || !body.outcome || !body.reflection || !body.keyLesson) {
      return send(res, 400, { error: "All story fields are required." });
    }
    if (!supabaseAdmin) return send(res, 404, { error: "Database not configured" });

    const user = (req as any).user;
    const profile = await ensureProfile(user);
    const storyDraft = {
      title: body.title,
      summary: String(body.outcome.whatHappened || "").slice(0, 150) + "...",
      category: body.category,
      context: body.context,
      decision: body.decision,
      outcome: body.outcome,
      reflection: body.reflection,
      keyLesson: body.keyLesson,
      relatedTopics: [body.category, "Reflections"],
    };
    const aiAnalysis = await generateAIAnalysis(storyDraft);

    const { data, error } = await supabaseAdmin
      .from("stories")
      .insert({
        author_id: user.id,
        title: storyDraft.title,
        summary: storyDraft.summary,
        category: storyDraft.category,
        reading_time: "5 min read",
        context: storyDraft.context,
        decision: storyDraft.decision,
        outcome: storyDraft.outcome,
        reflection: storyDraft.reflection,
        key_lesson: storyDraft.keyLesson,
        ai_analysis: aiAnalysis,
        related_topics: storyDraft.relatedTopics,
      })
      .select("*")
      .single();

    if (error || !data) return send(res, 500, { error: "Failed to publish story" });

    await supabaseAdmin.from("profiles").update({
      stories_published: (profile.stories_published || 0) + 1,
      lessons_shared: (profile.lessons_shared || 0) + 1,
      ai_score: Math.min(100, (profile.ai_score || 10) + 15),
    }).eq("id", user.id);

    await supabaseAdmin.from("notifications").insert({
      user_id: user.id,
      type: "ai_complete",
      icon: "Sparkles",
      title: "AI Analysis Complete",
      description: `We've generated custom Decision Intelligence insights for your story: "${body.title}"`,
      story_id: data.id,
    });

    return send(res, 200, await mapStoryRow(data, user.id, profile));
  }

  if (pathname === "/profile" && method === "GET") {
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) return send(res, 200, fallbackProfile);
    const profile = await ensureProfile((req as any).user);
    return send(res, 200, toAuthor(profile));
  }

  if (pathname === "/profile" && method === "PUT") {
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) return send(res, 200, fallbackProfile);
    const user = (req as any).user;
    await ensureProfile(user);
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        name: req.body?.name,
        full_name: req.body?.name,
        headline: req.body?.headline,
        company: req.body?.company,
        industry: req.body?.industry,
        location: req.body?.location,
        website: req.body?.website,
        linkedin: req.body?.linkedin,
        github: req.body?.github,
        bio: req.body?.bio,
      })
      .eq("id", user.id)
      .select("*")
      .single();
    if (error || !data) return send(res, 500, { error: "Failed to update profile" });
    return send(res, 200, toAuthor(data));
  }

  if (pathname === "/profile/onboarding-complete" && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) return send(res, 200, fallbackProfile);
    const user = (req as any).user;
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        name: req.body?.name,
        full_name: req.body?.name,
        headline: req.body?.headline,
        company: req.body?.company,
        industry: req.body?.industry,
        location: req.body?.location,
        onboarding_completed: true,
        ai_score: 30,
      })
      .eq("id", user.id)
      .select("*")
      .single();
    if (error || !data) return send(res, 500, { error: "Failed to complete onboarding" });
    return send(res, 200, toAuthor(data));
  }

  if (pathname === "/notifications" && method === "GET") {
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) return send(res, 200, fallbackNotifications);
    const { data } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .eq("user_id", (req as any).user.id)
      .order("created_at", { ascending: false });
    return send(res, 200, (data || []).map((n) => ({
      id: n.id,
      type: n.type,
      icon: n.icon,
      title: n.title,
      description: n.description,
      time: relativeTime(n.created_at),
      isUnread: n.is_unread,
      storyId: n.story_id || undefined,
    })));
  }

  if (pathname === "/notifications/mark-read" && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) {
      fallbackNotifications = fallbackNotifications.map((n) => ({ ...n, isUnread: false }));
      return send(res, 200, { success: true });
    }
    await supabaseAdmin.from("notifications").update({ is_unread: false }).eq("user_id", (req as any).user.id);
    return send(res, 200, { success: true });
  }

  if (pathname === "/collections" && method === "GET") {
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) return send(res, 200, fallbackCollections);
    const { data } = await supabaseAdmin
      .from("collections")
      .select("id, name, collection_stories(story_id)")
      .eq("user_id", (req as any).user.id);
    return send(res, 200, (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      storyCount: c.collection_stories?.length || 0,
      coverStories: [],
      stories: (c.collection_stories || []).map((s: any) => s.story_id),
    })));
  }

  if (pathname === "/collections" && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    const { name, storyId } = req.body || {};
    if (!name) return send(res, 400, { error: "Collection name is required." });
    if (!supabaseAdmin) return send(res, 200, { id: `col-${Date.now()}`, name, storyCount: storyId ? 1 : 0, coverStories: [], stories: storyId ? [storyId] : [] });

    const { data, error } = await supabaseAdmin
      .from("collections")
      .insert({ user_id: (req as any).user.id, name })
      .select("*")
      .single();
    if (error || !data) return send(res, 500, { error: "Failed to create collection" });
    if (storyId) {
      await supabaseAdmin.from("collection_stories").insert({ collection_id: data.id, story_id: storyId });
    }
    return send(res, 200, { id: data.id, name: data.name, storyCount: storyId ? 1 : 0, coverStories: [], stories: storyId ? [storyId] : [] });
  }

  if (pathname.startsWith("/collections/") && pathname.endsWith("/add") && method === "POST") {
    if (!(await requireAuth(req, res))) return;
    const id = pathname.split("/")[2];
    const storyId = req.body?.storyId;
    if (!storyId) return send(res, 400, { error: "Story ID is required" });
    if (!supabaseAdmin) return send(res, 404, { error: "Database not configured" });
    await supabaseAdmin.from("collection_stories").upsert({ collection_id: id, story_id: storyId });
    const { data } = await supabaseAdmin.from("collections").select("id, name, collection_stories(story_id)").eq("id", id).single();
    return send(res, 200, {
      id: data?.id,
      name: data?.name,
      storyCount: data?.collection_stories?.length || 0,
      coverStories: [],
      stories: (data?.collection_stories || []).map((s: any) => s.story_id),
    });
  }

  if (pathname === "/suggest" && method === "POST") {
    return send(res, 200, {
      titleSuggestion: "Make the title specific and outcome-driven.",
      lessonSuggestion: "State the lesson in one sentence.",
      missingContext: "Add stage, funding, and team size.",
      clearerDecision: "Describe who made the call and what alternatives were considered.",
    });
  }

  if (pathname === "/search" && method === "POST") {
    const query = String(req.body?.query || "").toLowerCase().trim();
    if (!(await requireAuth(req, res))) return;
    if (!supabaseAdmin) {
      if (!query) return send(res, 200, fallbackStories);
      return send(res, 200, fallbackStories.filter((s) => [s.title, s.summary, s.keyLesson].join(" ").toLowerCase().includes(query)));
    }
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    const batch = await getStoriesFromDb(params, (req as any).user.id);
    return send(res, 200, batch.stories);
  }

  return send(res, 404, { error: "Not found" });
}
