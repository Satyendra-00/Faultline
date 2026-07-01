/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import Splash from "./components/Splash";
import Auth from "./components/Auth";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import RightPanel from "./components/RightPanel";
import StoryCard from "./components/StoryCard";
import StoryDetail from "./components/StoryDetail";
import StoryCreator from "./components/StoryCreator";
import Profile from "./components/Profile";
import SettingsView from "./components/Settings";
import Explore from "./components/Explore";
import AiInsights from "./components/AiInsights";
import { Story, Author } from "./types";
import { Sparkles, PenTool, Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { storyProvider } from "./utils/storyProvider";
import { supabase } from "./utils/supabaseClient";
import { apiFetch } from "./utils/apiClient";

const FEED_BATCH_SIZE = 20;
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80";

type PublishStoryPayload = {
  title: string;
  category: string;
  context: Story["context"];
  decision: {
    action: string;
    whyCorrectThen: string;
    emotionalFactors: string;
  };
  outcome: Required<Story["outcome"]>;
  reflection: Story["reflection"];
  keyLesson: string;
};

function profileFromSessionUser(user: any): Author {
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Builder";
  return {
    id: user?.id || "current-user",
    name,
    avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || DEFAULT_AVATAR,
    headline: user?.user_metadata?.headline || "Aspiring Tech Founder",
    company: user?.user_metadata?.company || "",
    industry: user?.user_metadata?.industry || "Technology",
    isVerified: true,
    location: user?.user_metadata?.location || "",
    website: user?.user_metadata?.website || "",
    linkedin: user?.user_metadata?.linkedin || "",
    github: user?.user_metadata?.github || "",
    bio: user?.user_metadata?.bio || "",
    followers: 0,
    following: 0,
    storiesPublished: 0,
    lessonsShared: 0,
    bookmarksCount: 0,
    readingStreak: 1,
    totalReads: 0,
    aiScore: 10,
  };
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [activeTab, setActiveTab] = useState("home");
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const [stories, setStories] = useState<Story[]>([]);
  const [profile, setProfile] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const feedObserverRef = useRef<IntersectionObserver | null>(null);
  const storyCursorRef = useRef(0);
  const isLoadingStoriesRef = useRef(false);
  const searchQueryRef = useRef("");
  const selectedCategoryRef = useRef<string | undefined>(undefined);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiFetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error("Error fetching profile: ", e);
    }
  }, []);

  const fetchStories = useCallback(async (
    search?: string,
    category?: string,
    mode: "reset" | "append" = "reset"
  ) => {
    if (isLoadingStoriesRef.current) return;

    isLoadingStoriesRef.current = true;
    if (mode === "reset") {
      setLoading(true);
      storyCursorRef.current = 0;
    }

    try {
      const batch = await storyProvider.getStories({
        offset: storyCursorRef.current,
        limit: FEED_BATCH_SIZE,
        search,
        category,
      });

      storyCursorRef.current = batch.nextOffset;
      setStories((prev) => (mode === "append" ? [...prev, ...batch.stories] : batch.stories));
    } catch (e) {
      console.error("Error fetching stories: ", e);
    } finally {
      setLoading(false);
      isLoadingStoriesRef.current = false;
    }
  }, []);

  const loadNextBatch = useCallback(() => {
    fetchStories(searchQueryRef.current, selectedCategoryRef.current, "append");
  }, [fetchStories]);

  const setFeedSentinelRef = useCallback((node: HTMLDivElement | null) => {
    feedObserverRef.current?.disconnect();

    if (!node) return;

    feedObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadNextBatch();
        }
      },
      { rootMargin: "600px 0px" }
    );

    feedObserverRef.current.observe(node);
  }, [loadNextBatch]);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsLoggedIn(true);
        setProfile(profileFromSessionUser(data.session.user));
      }
    };

    void initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setProfile(profileFromSessionUser(session.user));
      }
      if (!session) {
        setProfile(null);
        setStories([]);
        setSelectedStoryId(null);
        setActiveTab("home");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
      fetchStories();
    }
  }, [isLoggedIn, fetchProfile, fetchStories]);

  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => () => feedObserverRef.current?.disconnect(), []);

  const handleLoginSuccess = (name: string, isGuest: boolean) => {
  console.log("LOGIN SUCCESS", name, isGuest);

  setIsLoggedIn(true);

  if (!isGuest) {
    setShowOnboarding(true);
  }
};

  const handleOnboardingComplete = async (profileData: {
    name: string;
    headline: string;
    company: string;
    industry: string;
    location: string;
  }) => {
    try {
      const request = await apiFetch("/api/profile/onboarding-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (request.ok) {
        const updated = await request.json();
        setProfile(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setShowOnboarding(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(undefined);
    fetchStories(query);
  };

  const handleSelectCategory = (category: string) => {
    setActiveTab("home");
    setSelectedStoryId(null);
    setSelectedCategory(category);
    fetchStories(searchQuery, category);
  };

  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setActiveTab(`story-${storyId}`);
  };

  const handleLike = async (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, likes: s.hasLiked ? s.likes - 1 : s.likes + 1, hasLiked: !s.hasLiked } : s))
    );

    try {
      const res = await apiFetch(`/api/stories/${storyId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStories((prev) =>
          prev.map((s) => (s.id === storyId ? { ...s, likes: data.likes, hasLiked: data.hasLiked } : s))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookmark = async (storyId: string) => {
    const selectedStory = stories.find((s) => s.id === storyId);
    const willBookmark = selectedStory ? !selectedStory.hasBookmarked : true;

    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId
          ? { ...s, bookmarks: s.hasBookmarked ? s.bookmarks - 1 : s.bookmarks + 1, hasBookmarked: !s.hasBookmarked }
          : s
      )
    );
    setProfile((prev) =>
      prev
        ? { ...prev, bookmarksCount: Math.max(0, prev.bookmarksCount + (willBookmark ? 1 : -1)) }
        : prev
    );

    try {
      const res = await apiFetch(`/api/stories/${storyId}/bookmark`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStories((prev) =>
          prev.map((s) => (s.id === storyId ? { ...s, bookmarks: data.bookmarks, hasBookmarked: data.hasBookmarked } : s))
        );
        void fetchProfile(); // update bookmarksCount badge from the database source of truth
      }
    } catch (e) {
      console.error(e);
      void fetchProfile();
    }
  };

  const handleAddComment = async (storyId: string, text: string) => {
    const localComment = {
      id: `local-comment-${Date.now()}`,
      authorName: profile?.name ?? "Member",
      authorAvatar: profile?.avatar ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      authorHeadline: profile?.headline ?? "FaultLine Member",
      time: "Just now",
      comment: text,
      likes: 0,
    };

    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, comments: [...s.comments, localComment], commentsCount: s.commentsCount + 1 } : s
      )
    );

    try {
      const res = await apiFetch(`/api/stories/${storyId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: text }),
      });
      if (res.ok) {
        await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublishStory = async (storyData: PublishStoryPayload) => {
    setIsCreatorOpen(false);
    // Open full-screen loading for processing Decision Intelligence
    setLoading(true);
    try {
      const res = await apiFetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });
      if (res.ok) {
        await fetchStories();
        fetchProfile();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedFields: Partial<Author>) => {
    try {
      const res = await apiFetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        return;
      }
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Failed to update profile");
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setIsLoggedIn(false);
      setShowOnboarding(false);
      setProfile(null);
      setStories([]);
      setSelectedStoryId(null);
      setActiveTab("home");
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId.startsWith("story-")) {
      const id = tabId.replace("story-", "");
      setSelectedStoryId(id);
    } else {
      setSelectedStoryId(null);
    }
    setActiveTab(tabId);
  };

  // Rendering flows
  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (!isLoggedIn) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  if (showOnboarding) {
    return (
      <Onboarding
        userName="Alex Rivera"
        onComplete={handleOnboardingComplete}
        onSkip={() => setShowOnboarding(false)}
      />
    );
  }

  // Active Story selection for Detail rendering
  const activeStory = stories.find((s) => s.id === selectedStoryId);

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col font-sans" id="app-viewport">
      {profile && (
        <Navbar
          profile={profile}
          onSearch={handleSearch}
          onCreateStory={() => setIsCreatorOpen(true)}
          onNavigate={handleTabChange}
          onLogout={handleLogout}
        />
      )}

      {/* Primary three-column desktop grid architecture */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 px-4 md:px-6 py-6" id="app-layout-grid">
        {/* Left lightweight sidebar Column */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2" id="layout-left-sidebar">
          <Sidebar
            activeTab={activeTab.startsWith("story-") ? "home" : activeTab}
            setActiveTab={handleTabChange}
            onCreateStory={() => setIsCreatorOpen(true)}
            onLogout={handleLogout}
          />
        </div>

        {/* Dynamic Main Middle Feed Column */}
        <div className="col-span-1 md:col-span-9 lg:col-span-7 space-y-6" id="layout-middle-feed">
          {activeTab === "home" && (
            <div className="space-y-6" id="feed-panel-wrapper">
              {/* Compact Composer prompt card */}
              <div className="bg-white border border-[#E5E7EB] rounded-card p-5 text-left flex items-center justify-between" id="compact-composer-card">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#F8F5EE] rounded-full text-[#233A66]">
                    <Sparkles className="w-5 h-5 text-[#D7A859]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">What decision changed your journey?</h4>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Contribute your transparent learnings to the Decision Intelligence Network.</p>
                  </div>
                </div>
                <button
                  id="composer-trigger-btn"
                  onClick={() => setIsCreatorOpen(true)}
                  className="px-4 py-2 bg-[#233A66] hover:bg-[#1E3055] text-white font-semibold rounded-button text-xs transition-colors shrink-0 ml-4"
                >
                  Share Story
                </button>
              </div>

              {/* Feed Header */}
              <div className="text-left" id="feed-introduction-block">
                <h2 className="font-display text-xl font-bold tracking-tight text-[#233A66]">Today's Decision Feed</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">Discover raw metrics and honest post-mortems shared by experienced builders.</p>
              </div>

              {/* Feed List or Loading Skeleton */}
              {loading ? (
                <div className="space-y-6" id="feed-loading-skeleton">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-[#E5E7EB] rounded-card p-6 space-y-4 animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#E5E7EB] rounded-full" />
                        <div className="space-y-2">
                          <div className="h-3.5 bg-[#E5E7EB] rounded w-32" />
                          <div className="h-3 bg-[#E5E7EB] rounded w-20" />
                        </div>
                      </div>
                      <div className="h-6 bg-[#E5E7EB] rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-3.5 bg-[#E5E7EB] rounded" />
                        <div className="h-3.5 bg-[#E5E7EB] rounded w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : stories.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-card p-12 text-center text-[#6B7280]" id="feed-empty-state">
                  <Search className="w-10 h-10 mx-auto text-[#9CA3AF] mb-3" />
                  <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider">No Stories Found</h3>
                  <p className="text-xs mt-1.5 leading-relaxed">Try adjusting your natural language filters or search queries.</p>
                </div>
              ) : (
                <div className="space-y-6" id="stories-feed-list">
                  {stories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      onLike={handleLike}
                      onBookmark={handleBookmark}
                      onSelectStory={handleSelectStory}
                    />
                  ))}
                  <div ref={setFeedSentinelRef} aria-hidden="true" className="h-1" />
                </div>
              )}
            </div>
          )}

          {activeTab === "explore" && (
            <Explore
              stories={stories}
              onSelectStory={handleSelectStory}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {activeTab === "trending" && (
            <Explore
              stories={stories}
              onSelectStory={handleSelectStory}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {activeTab === "bookmarks" && (
            <Profile
              profile={profile!}
              stories={stories}
              onUpdateProfile={handleUpdateProfile}
              onSelectStory={handleSelectStory}
            />
          )}

          {activeTab === "ai-insights" && (
            <AiInsights
              stories={stories}
              onSelectStory={handleSelectStory}
            />
          )}

          {activeTab === "profile" && profile && (
            <Profile
              profile={profile}
              stories={stories}
              onUpdateProfile={handleUpdateProfile}
              onSelectStory={handleSelectStory}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView />
          )}

          {activeTab.startsWith("story-") && activeStory && (
            <StoryDetail
              story={activeStory}
              onBack={() => handleTabChange("home")}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onAddComment={handleAddComment}
            />
          )}
        </div>

        {/* Right Information Insights Panel */}
        <div className="hidden lg:block lg:col-span-3" id="layout-right-insights">
          <RightPanel
            onSelectTopic={(topic) => handleSearch(topic)}
            onSelectStory={handleSelectStory}
          />
        </div>
      </div>

      {/* Immersive story editor Modal */}
      <AnimatePresence>
        {isCreatorOpen && (
          <StoryCreator
            onPublish={handlePublishStory}
            onClose={() => setIsCreatorOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
