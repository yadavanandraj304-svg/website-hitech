-- ---------------------------------------------------------------------------
-- Supabase schema for the Hi-Tech Civil Design Consultancy inquiry form.
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- (Create the project with the owner's email: yadavanandraj304@gmail.com)
-- ---------------------------------------------------------------------------

create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  phone       text not null,
  email       text,
  location    text,
  services    text[] not null default '{}',
  message     text
);

-- Anyone (anon key / visitors) may INSERT — the form only ever writes.
-- Reading stays blocked below.
alter table public.inquiries enable row level security;

create policy "public can submit inquiries"
  on public.inquiries
  for insert
  to anon
  with check (true);

create policy "no public read of inquiries"
  on public.inquiries
  for select
  to anon
  using (false);

-- Handy index for newest-first listing in the dashboard
create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);
