-- AuthSystem Pro database schema + RLS policies

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read only their own profile
create policy if not exists "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can insert their own profile row
create policy if not exists "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Users can update their own profile details (not role)
create policy if not exists "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role in ('user', 'admin'));

-- Admins can read all rows
create policy if not exists "Admins can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins can update all profiles, including role
create policy if not exists "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admins can delete profile rows
create policy if not exists "Admins can delete profiles"
  on public.profiles
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    'user'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
