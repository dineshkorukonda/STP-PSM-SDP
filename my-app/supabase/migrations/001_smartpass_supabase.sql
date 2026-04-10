-- SmartPass on Supabase: profiles, passes (auth-linked), RLS, verify RPC.
-- Run in Supabase SQL Editor after creating a project, or via supabase db push.

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Transport types
-- ---------------------------------------------------------------------------
create table if not exists public.transport_types (
  id serial primary key,
  name text not null unique,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

alter table public.transport_types enable row level security;

create policy "transport_types_read_authenticated"
  on public.transport_types for select
  to authenticated
  using (coalesce(is_active, true));

insert into public.transport_types (name, is_active) values
  ('Bus', true),
  ('Metro', true),
  ('Shared Vehicle', true),
  ('All-in-One', true)
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Passes
-- ---------------------------------------------------------------------------
create table if not exists public.passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  pass_type text,
  duration_type text,
  start_date date,
  expiry_date date,
  status text default 'active',
  qr_token text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists passes_user_id_idx on public.passes (user_id);
create index if not exists passes_qr_token_idx on public.passes (qr_token);

alter table public.passes enable row level security;

create policy "passes_select_own"
  on public.passes for select
  using (auth.uid() = user_id);

create policy "passes_insert_own"
  on public.passes for insert
  with check (auth.uid() = user_id);

create policy "passes_update_own"
  on public.passes for update
  using (auth.uid() = user_id);

create policy "passes_delete_own"
  on public.passes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Pass – transport map
-- ---------------------------------------------------------------------------
create table if not exists public.pass_transport_map (
  id serial primary key,
  pass_id uuid not null references public.passes (id) on delete cascade,
  transport_type_id int not null references public.transport_types (id) on delete cascade,
  unique (pass_id, transport_type_id)
);

create index if not exists pass_transport_map_pass_id_idx on public.pass_transport_map (pass_id);

alter table public.pass_transport_map enable row level security;

create policy "pass_map_select"
  on public.pass_transport_map for select
  using (
    exists (
      select 1 from public.passes p
      where p.id = pass_id and p.user_id = auth.uid()
    )
  );

create policy "pass_map_insert"
  on public.pass_transport_map for insert
  with check (
    exists (
      select 1 from public.passes p
      where p.id = pass_id and p.user_id = auth.uid()
    )
  );

create policy "pass_map_delete"
  on public.pass_transport_map for delete
  using (
    exists (
      select 1 from public.passes p
      where p.id = pass_id and p.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Public verify by QR token (SECURITY DEFINER — safe fields only)
-- ---------------------------------------------------------------------------
create or replace function public.get_pass_public(p_qr_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if p_qr_token is null or length(trim(p_qr_token)) < 8 then
    return null;
  end if;

  select jsonb_build_object(
    'id', p.id,
    'passType', p.pass_type,
    'duration', p.duration_type,
    'startDate', p.start_date,
    'expiryDate', p.expiry_date,
    'status', p.status,
    'holderName', pr.display_name,
    'valid', (p.status = 'active' and p.expiry_date >= current_date)
  )
  into result
  from public.passes p
  join public.profiles pr on pr.id = p.user_id
  where p.qr_token = trim(p_qr_token)
  limit 1;

  return result;
end;
$$;

revoke all on function public.get_pass_public(text) from public;
grant execute on function public.get_pass_public(text) to anon;
grant execute on function public.get_pass_public(text) to authenticated;
