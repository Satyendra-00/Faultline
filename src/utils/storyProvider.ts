/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Story } from "../types";
import { generateStories } from "./storyGenerator";
import { apiFetch } from "./apiClient";

export interface StoryQuery {
  offset: number;
  limit: number;
  search?: string;
  category?: string;
}

export interface StoryBatch {
  stories: Story[];
  nextOffset: number;
}

export interface StoryProvider {
  getStories(query: StoryQuery): Promise<StoryBatch>;
}

function storyMatches(story: Story, search?: string, category?: string): boolean {
  const matchesCategory = !category || category === "All" || story.category === category;
  if (!matchesCategory) return false;
  if (!search?.trim()) return true;

  const query = search.toLowerCase();
  const searchableText = [
    story.title,
    story.summary,
    story.category,
    story.author.name,
    story.author.company,
    story.context.situation,
    story.context.assumptions,
    story.decision.action,
    story.outcome.whatHappened,
    story.keyLesson,
    ...(story.relatedTopics ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

export const generatedStoryProvider: StoryProvider = {
  async getStories({ offset, limit, search, category }) {
    const stories: Story[] = [];
    let cursor = offset;

    while (stories.length < limit) {
      const candidate = generateStories(cursor, 1)[0];
      cursor += 1;

      if (storyMatches(candidate, search, category)) {
        stories.push(candidate);
      }
    }

    return {
      stories,
      nextOffset: cursor,
    };
  },
};

function toStoryBatch(stories: Story[], offset: number, limit: number, serverNextOffset?: number): StoryBatch {
  return {
    stories,
    nextOffset: serverNextOffset ?? offset + Math.min(limit, stories.length),
  };
}

export const apiStoryProvider: StoryProvider = {
  async getStories({ offset, limit, search, category }) {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
    });

    if (search) params.set("search", search);
    if (category) params.set("category", category);

    const res = await apiFetch(`/api/stories?${params.toString()}`);

    if (!res.ok) {
      throw new Error("Failed to load stories from API");
    }

    const data = (await res.json()) as StoryBatch;
    return toStoryBatch(data.stories, offset, limit, data.nextOffset);
  },
};

const shouldUseApiProvider = import.meta.env.VITE_USE_API_PROVIDER === "true" || import.meta.env.PROD;

export const storyProvider = shouldUseApiProvider
  ? apiStoryProvider
  : generatedStoryProvider;
