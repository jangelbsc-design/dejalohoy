-- Crear la tabla de perfiles (déjalo hoy)
create table if not exists public.profiles (
  username text primary key,
  passwordHash text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

-- Para uso personal: la app usa la clave anon pública.
-- OJO: cualquiera con la clave anon puede leer/escribir. Si la app va a
-- tener muchos usuarios reales, conviene migrar a Supabase Auth.
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (true);
create policy "profiles_update" on public.profiles for update using (true) with check (true);
