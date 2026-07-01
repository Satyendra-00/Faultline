import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const appUrl = process.env.VITE_PUBLIC_APP_URL || "https://faultlinee.vercel.app";
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey || !anonKey) {
  throw new Error("Missing Supabase URL, service role key, or anon key in .env");
}

const admin = createClient(supabaseUrl, serviceKey);
const anon = createClient(supabaseUrl, anonKey);
const email = `faultline-e2e-${Date.now()}@example.com`;
const password = `E2E-${Date.now()}-Pass!`;
let userId;
let bookmarkedStoryId;

async function api(path, token, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${appUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers,
  });

  const json = await response.json().catch(() => null);
  return { status: response.status, ok: response.ok, json };
}

try {
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "FaultLine E2E" },
  });
  if (created.error) throw created.error;
  userId = created.data.user.id;

  const signedIn = await anon.auth.signInWithPassword({ email, password });
  if (signedIn.error) throw signedIn.error;
  const token = signedIn.data.session.access_token;

  const profileBefore = await api("/api/profile", token);
  if (!profileBefore.ok) throw new Error(`Profile GET failed: ${profileBefore.status} ${JSON.stringify(profileBefore.json)}`);

  const profileUpdate = await api("/api/profile", token, {
    method: "PUT",
    body: JSON.stringify({
      name: "FaultLine E2E Updated",
      headline: "Production Test Founder",
      company: "FaultLine",
      industry: "SaaS",
      location: "Test Lab",
      website: "faultlinee.vercel.app",
      linkedin: "",
      github: "",
      bio: "Temporary production verification profile.",
    }),
  });
  if (!profileUpdate.ok) throw new Error(`Profile PUT failed: ${profileUpdate.status} ${JSON.stringify(profileUpdate.json)}`);

  const stories = await api("/api/stories?offset=0&limit=5", token);
  if (!stories.ok) throw new Error(`Stories GET failed: ${stories.status} ${JSON.stringify(stories.json)}`);
  if (!stories.json?.stories?.length) throw new Error("Stories GET returned zero stories");

  bookmarkedStoryId = stories.json.stories[0].id;
  const bookmark = await api(`/api/stories/${bookmarkedStoryId}/bookmark`, token, { method: "POST" });
  if (!bookmark.ok) throw new Error(`Bookmark POST failed: ${bookmark.status} ${JSON.stringify(bookmark.json)}`);

  const profileAfter = await api("/api/profile", token);
  if (!profileAfter.ok) throw new Error(`Profile GET after bookmark failed: ${profileAfter.status} ${JSON.stringify(profileAfter.json)}`);

  console.log(JSON.stringify({
    appUrl,
    profileGet: profileBefore.status,
    profileBeforeName: profileBefore.json.name,
    profilePut: profileUpdate.status,
    updatedName: profileUpdate.json.name,
    updatedCompany: profileUpdate.json.company,
    storiesGet: stories.status,
    storiesCount: stories.json.stories.length,
    firstStoryTitle: stories.json.stories[0].title,
    bookmarkPost: bookmark.status,
    bookmarkState: bookmark.json.hasBookmarked,
    profileBookmarksAfter: profileAfter.json.bookmarksCount,
  }, null, 2));
} finally {
  if (userId) {
    if (bookmarkedStoryId) {
      await admin.from("story_bookmarks").delete().eq("user_id", userId).eq("story_id", bookmarkedStoryId);
    }
    await admin.from("story_likes").delete().eq("user_id", userId);
    await admin.from("profiles").delete().eq("id", userId);
    await admin.auth.admin.deleteUser(userId);
  }
}
