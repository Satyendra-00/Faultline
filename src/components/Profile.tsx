/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Settings,
  MapPin,
  Link as LinkIcon,
  Linkedin,
  Github,
  Award,
  BookOpen,
  Bookmark,
  Heart,
  Flame,
  Star,
  CheckCircle,
  Briefcase
} from "lucide-react";
import { Author, Story } from "../types";

interface ProfileProps {
  profile: Author;
  stories: Story[];
  onUpdateProfile: (updated: Partial<Author>) => Promise<void>;
  onSelectStory: (storyId: string) => void;
}

export default function Profile({ profile, stories, onUpdateProfile, onSelectStory }: ProfileProps) {
  const [activeTab, setActiveTab] = useState("stories");
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [company, setCompany] = useState(profile.company || "");
  const [industry, setIndustry] = useState(profile.industry);
  const [location, setLocation] = useState(profile.location || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [linkedin, setLinkedin] = useState(profile.linkedin || "");
  const [github, setGithub] = useState(profile.github || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setName(profile.name);
    setHeadline(profile.headline);
    setCompany(profile.company || "");
    setIndustry(profile.industry);
    setLocation(profile.location || "");
    setWebsite(profile.website || "");
    setLinkedin(profile.linkedin || "");
    setGithub(profile.github || "");
    setBio(profile.bio || "");
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      await onUpdateProfile({
        name,
        headline,
        company,
        industry,
        location,
        website,
        linkedin,
        github,
        bio,
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setSaveError("Profile save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const userStories = stories.filter(s => s.author.id === profile.id);
  const bookmarkedStories = stories.filter(s => s.hasBookmarked);
  const likedStories = stories.filter(s => s.hasLiked);

  return (
    <div className="max-w-[1140px] mx-auto py-6 px-4 md:px-6 space-y-8 text-left" id="profile-page-root">
      {/* Profile Header & Banner card */}
      <div className="bg-white border border-[#E5E7EB] rounded-card overflow-hidden" id="profile-header-card">
        {/* Banner with minimalist branding */}
        <div className="h-32 bg-gradient-to-r from-[#233A66] to-[#D7A859]/20 relative" id="profile-banner">
          <div className="absolute right-6 bottom-4 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Score: {profile.aiScore} pts
          </div>
        </div>

        {/* Profile Info block */}
        <div className="px-6 md:px-10 pb-8 pt-0 relative" id="profile-meta-content">
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 mb-6" id="profile-avatar-row">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-5" id="profile-identity">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white border-2 border-[#233A66] bg-white"
              />
              <div className="mt-4 md:mt-0 space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold tracking-tight text-[#111827]">{profile.name}</h1>
                  {profile.isVerified && (
                    <Award className="w-5 h-5 text-[#D7A859] fill-[#FFD691]/20" aria-label="Verified Professional" />
                  )}
                </div>
                <p className="text-sm font-semibold text-[#233A66]">{profile.headline}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280] pt-1">
                  {profile.company && (
                    <span className="flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" />
                      {profile.company}
                    </span>
                  )}
                  {profile.location && (
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center text-[#D7A859] hover:underline">
                      <LinkIcon className="w-3.5 h-3.5 mr-1 text-[#D7A859]" />
                      {profile.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0" id="profile-controls">
              <button
                id="edit-profile-btn"
                onClick={() => setIsEditing(true)}
                className="px-5 h-11 bg-white hover:bg-[#F9FAFB] text-[#233A66] border border-[#E5E7EB] font-semibold rounded-button text-sm transition-all duration-150"
              >
                Edit Professional Parameters
              </button>
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] pt-6 grid grid-cols-1 md:grid-cols-12 gap-6" id="profile-bio-row">
            <div className="md:col-span-8 space-y-3">
              <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider">Professional Bio</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {profile.bio || "No professional biography has been documented yet. Introduce your background and core decisional domains."}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-start md:justify-end space-x-6 text-center text-xs" id="profile-counts">
              <div>
                <span className="text-[#6B7280]">Followers</span>
                <span className="block text-lg font-bold text-[#233A66] font-mono mt-0.5">{profile.followers}</span>
              </div>
              <div className="border-l border-[#E5E7EB] pl-6">
                <span className="text-[#6B7280]">Following</span>
                <span className="block text-lg font-bold text-[#233A66] font-mono mt-0.5">{profile.following}</span>
              </div>
              <div className="border-l border-[#E5E7EB] pl-6">
                <span className="text-[#6B7280]">Case Studies</span>
                <span className="block text-lg font-bold text-[#233A66] font-mono mt-0.5">{profile.storiesPublished}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Statistics & Stats Card section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="profile-stats-grid">
        <div className="bg-white border border-[#E5E7EB] rounded-card p-5 text-center">
          <BookOpen className="w-5 h-5 mx-auto text-[#233A66] mb-1.5" />
          <span className="text-xs text-[#6B7280] block">Lessons Shared</span>
          <span className="text-xl font-bold font-mono text-[#233A66] mt-1 block">{profile.lessonsShared}</span>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-card p-5 text-center">
          <Bookmark className="w-5 h-5 mx-auto text-[#D7A859] mb-1.5" />
          <span className="text-xs text-[#6B7280] block">Saved Bookmarks</span>
          <span className="text-xl font-bold font-mono text-[#233A66] mt-1 block">{profile.bookmarksCount}</span>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-card p-5 text-center">
          <Flame className="w-5 h-5 mx-auto text-amber-500 mb-1.5" />
          <span className="text-xs text-[#6B7280] block">Reading Streak</span>
          <span className="text-xl font-bold font-mono text-[#233A66] mt-1 block">{profile.readingStreak} Days</span>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-card p-5 text-center">
          <Star className="w-5 h-5 mx-auto text-[#D7A859] mb-1.5" />
          <span className="text-xs text-[#6B7280] block">Decision AI Score</span>
          <span className="text-xl font-bold font-mono text-[#D7A859] mt-1 block">{profile.aiScore}% score</span>
        </div>
      </div>

      {/* Tabs list with content panels */}
      <div className="space-y-6" id="profile-tabs-wrapper">
        <div className="flex border-b border-[#E5E7EB]" id="profile-tab-buttons">
          {[
            { id: "stories", label: "Stories Published" },
            { id: "bookmarks", label: "Bookmarks" },
            { id: "liked", label: "Liked Experiences" },
          ].map(tab => (
            <button
              key={tab.id}
              id={`profile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold text-xs tracking-wider uppercase border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#233A66] text-[#233A66]"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-6" id="profile-tab-content">
          {activeTab === "stories" && (
            <div className="space-y-6">
              {userStories.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-card p-12 text-center text-[#6B7280] max-w-lg mx-auto">
                  <CheckCircle className="w-10 h-10 mx-auto text-[#D7A859] mb-3" />
                  <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider">No Stories Published</h3>
                  <p className="text-xs mt-1.5 leading-relaxed">Document your first major startup pivot, software overengineering issue, or fundraising success.</p>
                </div>
              ) : (
                userStories.map(story => (
                  <div
                    key={story.id}
                    onClick={() => onSelectStory(story.id)}
                    className="p-5 bg-white border border-[#E5E7EB] hover:border-[#233A66]/30 rounded-card flex justify-between items-center cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#D7A859] uppercase">{story.category}</span>
                      <h4 className="text-sm font-bold text-[#111827] mt-1">{story.title}</h4>
                      <p className="text-xs text-[#6B7280] mt-1 line-clamp-1 italic">"{story.keyLesson}"</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#233A66] font-mono shrink-0 ml-4">
                      {story.readingTime}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              {bookmarkedStories.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-card p-12 text-center text-[#6B7280] max-w-lg mx-auto">
                  <Bookmark className="w-10 h-10 mx-auto text-[#6B7280] mb-3" />
                  <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider">No Bookmarked Stories</h3>
                  <p className="text-xs mt-1.5 leading-relaxed">Bookmark valuable post-mortems in the feed to save them to your active personal collection.</p>
                </div>
              ) : (
                bookmarkedStories.map(story => (
                  <div
                    key={story.id}
                    onClick={() => onSelectStory(story.id)}
                    className="p-5 bg-white border border-[#E5E7EB] hover:border-[#233A66]/30 rounded-card flex justify-between items-center cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#D7A859] uppercase">{story.category}</span>
                      <h4 className="text-sm font-bold text-[#111827] mt-1">{story.title}</h4>
                      <p className="text-xs text-[#6B7280] mt-1">Shared by {story.author.name}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#233A66] font-mono shrink-0 ml-4">
                      {story.readingTime}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "liked" && (
            <div className="space-y-6">
              {likedStories.length === 0 ? (
                <div className="bg-white border border-[#E5E7EB] rounded-card p-12 text-center text-[#6B7280] max-w-lg mx-auto">
                  <Heart className="w-10 h-10 mx-auto text-rose-500 mb-3" />
                  <h3 className="font-display font-bold text-sm text-[#233A66] uppercase tracking-wider">No Liked Experiences</h3>
                  <p className="text-xs mt-1.5 leading-relaxed">Show alignment with high-quality transparency by liking stories on the platform.</p>
                </div>
              ) : (
                likedStories.map(story => (
                  <div
                    key={story.id}
                    onClick={() => onSelectStory(story.id)}
                    className="p-5 bg-white border border-[#E5E7EB] hover:border-[#233A66]/30 rounded-card flex justify-between items-center cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#D7A859] uppercase">{story.category}</span>
                      <h4 className="text-sm font-bold text-[#111827] mt-1">{story.title}</h4>
                      <p className="text-xs text-[#6B7280] mt-1">Shared by {story.author.name}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#233A66] font-mono shrink-0 ml-4">
                      {story.likes} Likes
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile parameter settings modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-[#233A66]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" id="edit-profile-overlay">
          <div className="w-full max-w-xl bg-white border border-[#E5E7EB] rounded-dialog p-6 md:p-8 space-y-4 max-h-[90vh] overflow-y-auto" id="edit-profile-modal">
            <h3 className="text-lg font-bold text-[#233A66]">Edit Professional Credentials</h3>
            {saveError && (
              <div className="rounded-input border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {saveError}
              </div>
            )}

            <div className="space-y-4 text-left" id="edit-profile-fields">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#6B7280] mb-1">Full Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#6B7280] mb-1">Headline</label>
                <input
                  id="edit-headline"
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full h-11 px-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6B7280] mb-1">Company</label>
                  <input
                    id="edit-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6B7280] mb-1">Location</label>
                  <input
                    id="edit-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#6B7280] mb-1">Personal / Company URL</label>
                <input
                  id="edit-website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. stealthsaas.io"
                  className="w-full h-11 px-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#6B7280] mb-1">Professional Bio</label>
                <textarea
                  id="edit-bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-4 bg-[#F8F5EE] border border-[#E5E7EB] rounded-input text-sm text-[#111827] focus:outline-none focus:border-[#233A66] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-[#F3F4F6] pt-4" id="edit-profile-actions">
              <button
                id="edit-cancel-btn"
                onClick={() => setIsEditing(false)}
                className="px-4 h-10 border border-[#E5E7EB] rounded-button text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                Cancel
              </button>
              <button
                id="edit-save-btn"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 h-10 bg-[#233A66] hover:bg-[#1E3055] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-button text-xs font-bold uppercase"
              >
                {isSaving ? "Saving..." : "Save parameters"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
