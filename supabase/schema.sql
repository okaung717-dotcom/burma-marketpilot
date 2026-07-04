-- Burma MarketPilot Supabase schema
-- Run this in Supabase Dashboard > SQL Editor > New query > Run.

create extension if not exists "pgcrypto";

-- 1) Storage buckets for business logos and product images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('business-logos', 'business-logos', true, 5242880, array['image/png','image/jpeg','image/webp','image/gif']),
  ('product-images', 'product-images', true, 10485760, array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do nothing;

-- 2) User profile table. Supabase Auth owns passwords; this table stores account name only.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  account_name text unique not null,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are editable by owner" on public.profiles;
create policy "Profiles are editable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Create profile automatically after auth signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, account_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'account_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3) Business DNA tables.
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  logo_url text,
  logo_storage_path text,
  business_name text not null,
  industry_category text not null,
  description text,
  brand_voice text[] default '{}',
  created_at timestamptz default now() not null
);

create index if not exists businesses_owner_id_idx on public.businesses(owner_id);
alter table public.businesses enable row level security;

drop policy if exists "Businesses owner CRUD" on public.businesses;
create policy "Businesses owner CRUD"
  on public.businesses for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  product_name text not null,
  category text,
  price_mmk numeric,
  unique_selling_point text,
  created_at timestamptz default now() not null
);

create index if not exists products_business_id_idx on public.products(business_id);
create index if not exists products_owner_id_idx on public.products(owner_id);
alter table public.products enable row level security;

drop policy if exists "Products owner CRUD" on public.products;
create policy "Products owner CRUD"
  on public.products for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  storage_path text,
  sort_order int default 0,
  created_at timestamptz default now() not null
);

create index if not exists product_images_product_id_idx on public.product_images(product_id);
create index if not exists product_images_owner_id_idx on public.product_images(owner_id);
alter table public.product_images enable row level security;

drop policy if exists "Product images owner CRUD" on public.product_images;
create policy "Product images owner CRUD"
  on public.product_images for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- 4) Social account connection intent and marketing preferences.
create table if not exists public.social_integrations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  status text not null default 'not_connected' check (status in ('connected', 'not_connected', 'needs_review')),
  account_handle text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  unique(owner_id, platform)
);

create index if not exists social_integrations_owner_id_idx on public.social_integrations(owner_id);
alter table public.social_integrations enable row level security;

drop policy if exists "Social integrations owner CRUD" on public.social_integrations;
create policy "Social integrations owner CRUD"
  on public.social_integrations for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create table if not exists public.marketing_preferences (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  posting_frequency text not null,
  assistance text[] default '{}',
  created_at timestamptz default now() not null
);

create index if not exists marketing_preferences_owner_id_idx on public.marketing_preferences(owner_id);
alter table public.marketing_preferences enable row level security;

drop policy if exists "Marketing preferences owner CRUD" on public.marketing_preferences;
create policy "Marketing preferences owner CRUD"
  on public.marketing_preferences for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- 5) Storage object policies. Public buckets allow read; write/update/delete are scoped by first folder = auth.uid().
drop policy if exists "Anyone can read business logos" on storage.objects;
create policy "Anyone can read business logos"
  on storage.objects for select
  using (bucket_id = 'business-logos');

drop policy if exists "Users upload own business logos" on storage.objects;
create policy "Users upload own business logos"
  on storage.objects for insert
  with check (bucket_id = 'business-logos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users update own business logos" on storage.objects;
create policy "Users update own business logos"
  on storage.objects for update
  using (bucket_id = 'business-logos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users delete own business logos" on storage.objects;
create policy "Users delete own business logos"
  on storage.objects for delete
  using (bucket_id = 'business-logos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Anyone can read product images" on storage.objects;
create policy "Anyone can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Users upload own product images" on storage.objects;
create policy "Users upload own product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users update own product images" on storage.objects;
create policy "Users update own product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users delete own product images" on storage.objects;
create policy "Users delete own product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);
