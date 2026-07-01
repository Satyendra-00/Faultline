create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  headline text,
  company text,
  industry text,
  location text,
  website text,
  linkedin text,
  github text,
  bio text,
  is_verified boolean not null default true,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  stories_published integer not null default 0,
  lessons_shared integer not null default 0,
  bookmarks_count integer not null default 0,
  reading_streak integer not null default 1,
  total_reads integer not null default 0,
  ai_score integer not null default 10,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  key_lesson text not null,
  ai_analysis jsonb,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  reposts_count integer not null default 0,
  bookmarks_count integer not null default 0,
  shares_count integer not null default 0,
  views_count integer not null default 1,
  reads_count integer not null default 0,
  ai_helpfulness_rating numeric(2,1),
  related_topics text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

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

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.story_comments enable row level security;
alter table public.story_likes enable row level security;
alter table public.story_bookmarks enable row level security;
alter table public.notifications enable row level security;
alter table public.collections enable row level security;
alter table public.collection_stories enable row level security;

create policy "profiles are viewable by everyone"
on public.profiles for select
using (true);

create policy "users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "stories are viewable by everyone"
on public.stories for select
using (true);

create policy "users can create their own stories"
on public.stories for insert
with check (auth.uid() = author_id);

create policy "users can update their own stories"
on public.stories for update
using (auth.uid() = author_id);

create policy "comments are viewable by everyone"
on public.story_comments for select
using (true);

create policy "users can create their own comments"
on public.story_comments for insert
with check (auth.uid() = author_id);

create policy "users can view their own likes"
on public.story_likes for select
using (auth.uid() = user_id);

create policy "users can manage their own likes"
on public.story_likes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can view their own bookmarks"
on public.story_bookmarks for select
using (auth.uid() = user_id);

create policy "users can manage their own bookmarks"
on public.story_bookmarks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can view their own notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "users can update their own notifications"
on public.notifications for update
using (auth.uid() = user_id);

create policy "users can view their own collections"
on public.collections for select
using (auth.uid() = user_id);

create policy "users can manage their own collections"
on public.collections for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users can view their own collection stories"
on public.collection_stories for select
using (
  exists (
    select 1
    from public.collections c
    where c.id = collection_id and c.user_id = auth.uid()
  )
);

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
