create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists headline text;
alter table public.profiles add column if not exists company text;
alter table public.profiles add column if not exists industry text;
alter table public.profiles add column if not exists location text;
alter table public.profiles add column if not exists website text;
alter table public.profiles add column if not exists linkedin text;
alter table public.profiles add column if not exists github text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists followers integer not null default 0;
alter table public.profiles add column if not exists following integer not null default 0;
alter table public.profiles add column if not exists stories_published integer not null default 0;
alter table public.profiles add column if not exists lessons_shared integer not null default 0;
alter table public.profiles add column if not exists bookmarks_count integer not null default 0;
alter table public.profiles add column if not exists reading_streak integer not null default 1;
alter table public.profiles add column if not exists total_reads integer not null default 0;
alter table public.profiles add column if not exists ai_score integer not null default 10;
alter table public.profiles add column if not exists is_verified boolean not null default true;
alter table public.profiles add column if not exists followers_count integer not null default 0;
alter table public.profiles add column if not exists following_count integer not null default 0;
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  summary text not null,
  category text not null,
  reading_time text not null default '5 min read',
  context jsonb not null,
  decision jsonb not null,
  outcome jsonb not null,
  reflection jsonb not null,
  key_lesson text not null
);

alter table public.stories add column if not exists ai_analysis jsonb;
alter table public.stories add column if not exists likes_count integer not null default 0;
alter table public.stories add column if not exists comments_count integer not null default 0;
alter table public.stories add column if not exists reposts_count integer not null default 0;
alter table public.stories add column if not exists bookmarks_count integer not null default 0;
alter table public.stories add column if not exists shares_count integer not null default 0;
alter table public.stories add column if not exists views_count integer not null default 1;
alter table public.stories add column if not exists reads_count integer not null default 0;
alter table public.stories add column if not exists ai_helpfulness_rating numeric(2,1);
alter table public.stories add column if not exists related_topics text[] not null default '{}';
alter table public.stories add column if not exists created_at timestamptz not null default now();
alter table public.stories add column if not exists updated_at timestamptz not null default now();

create table if not exists public.story_comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  comment text not null,
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.story_likes (
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);

create table if not exists public.story_bookmarks (
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  icon text not null,
  title text not null,
  description text not null,
  story_id uuid references public.stories(id) on delete set null,
  is_unread boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_stories (
  collection_id uuid not null references public.collections(id) on delete cascade,
  story_id uuid not null references public.stories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (collection_id, story_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_stories_updated_at on public.stories;
create trigger set_stories_updated_at
before update on public.stories
for each row execute procedure public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.story_comments enable row level security;
alter table public.story_likes enable row level security;
alter table public.story_bookmarks enable row level security;
alter table public.notifications enable row level security;
alter table public.collections enable row level security;
alter table public.collection_stories enable row level security;

drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone"
on public.profiles for select
using (true);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "stories are viewable by everyone" on public.stories;
create policy "stories are viewable by everyone"
on public.stories for select
using (true);

drop policy if exists "users can create their own stories" on public.stories;
create policy "users can create their own stories"
on public.stories for insert
with check (auth.uid() = author_id);

drop policy if exists "users can update their own stories" on public.stories;
create policy "users can update their own stories"
on public.stories for update
using (auth.uid() = author_id);

drop policy if exists "comments are viewable by everyone" on public.story_comments;
create policy "comments are viewable by everyone"
on public.story_comments for select
using (true);

drop policy if exists "users can create their own comments" on public.story_comments;
create policy "users can create their own comments"
on public.story_comments for insert
with check (auth.uid() = author_id);

drop policy if exists "users can view their own likes" on public.story_likes;
create policy "users can view their own likes"
on public.story_likes for select
using (auth.uid() = user_id);

drop policy if exists "users can manage their own likes" on public.story_likes;
create policy "users can manage their own likes"
on public.story_likes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can view their own bookmarks" on public.story_bookmarks;
create policy "users can view their own bookmarks"
on public.story_bookmarks for select
using (auth.uid() = user_id);

drop policy if exists "users can manage their own bookmarks" on public.story_bookmarks;
create policy "users can manage their own bookmarks"
on public.story_bookmarks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can view their own notifications" on public.notifications;
create policy "users can view their own notifications"
on public.notifications for select
using (auth.uid() = user_id);

drop policy if exists "users can update their own notifications" on public.notifications;
create policy "users can update their own notifications"
on public.notifications for update
using (auth.uid() = user_id);

drop policy if exists "users can view their own collections" on public.collections;
create policy "users can view their own collections"
on public.collections for select
using (auth.uid() = user_id);

drop policy if exists "users can manage their own collections" on public.collections;
create policy "users can manage their own collections"
on public.collections for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can view their own collection stories" on public.collection_stories;
create policy "users can view their own collection stories"
on public.collection_stories for select
using (
  exists (
    select 1
    from public.collections c
    where c.id = collection_id and c.user_id = auth.uid()
  )
);

drop policy if exists "users can manage their own collection stories" on public.collection_stories;
create policy "users can manage their own collection stories"
on public.collection_stories for all
using (
  exists (
    select 1
    from public.collections c
    where c.id = collection_id and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.collections c
    where c.id = collection_id and c.user_id = auth.uid()
  )
);
