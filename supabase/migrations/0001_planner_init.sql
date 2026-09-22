-- Weekplanner v1 — schema
--
-- Eén gebruiker (Maud), geen auth in v1. RLS staat wel aan met een
-- permissieve policy, zodat login later toegevoegd kan worden zonder
-- herontwerp: voeg dan een nullable `user_id uuid references auth.users`
-- toe aan `week_overrides` en `user_entries` en vervang de policy op die
-- twee tabellen door `using (auth.uid() = user_id)`. `blocks` en `weeks`
-- blijven publieke referentiedata (het vaste sjabloon), die hoeven geen
-- user_id.

-- ---------------------------------------------------------------------
-- blocks — het vaste sjabloon (lesblokken, zelfstudieblokken, werkblokken)
-- ---------------------------------------------------------------------
create table if not exists blocks (
  id text primary key,
  title text not null,
  type text not null check (type in ('les', 'zelfstudie', 'werkblok')),
  day text not null check (
    day in ('maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag')
  ),
  start_time time not null,
  end_time time, -- nullable: pcve-les heeft nog geen bevestigd einduur (zie seed + TODO in UI)
  location text,
  vak_code text,
  depends_on text references blocks(id)
);

-- ---------------------------------------------------------------------
-- weeks — de 12 kalenderweken van semester 1
-- ---------------------------------------------------------------------
create table if not exists weeks (
  week_nr integer primary key,
  iso_week text not null,
  monday_date date not null,
  friday_date date not null,
  note text
);

-- ---------------------------------------------------------------------
-- week_overrides — uitzonderingen op het vaste sjabloon, per week
-- ---------------------------------------------------------------------
create table if not exists week_overrides (
  id uuid primary key default gen_random_uuid(),
  week_nr integer not null references weeks(week_nr) on delete cascade,
  block_id text not null references blocks(id) on delete cascade,
  status text not null check (status in ('geen_les', 'verplaatst', 'aangepast')),
  reason text,
  new_start time,
  new_end time,
  unique (week_nr, block_id)
);

-- ---------------------------------------------------------------------
-- user_entries — zelf ingevulde uren
-- ---------------------------------------------------------------------
create type user_entry_category as enum (
  'Studio Maud',
  'Kompas',
  'Bachelorproef',
  'Studie',
  'Persoonlijk'
  -- bewust een 6e slot vrijgelaten: later toe te voegen met
  -- `alter type user_entry_category add value '...'`, geen herontwerp nodig.
);

create table if not exists user_entries (
  id uuid primary key default gen_random_uuid(),
  week_nr integer not null references weeks(week_nr) on delete cascade,
  day text not null check (
    day in ('maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag')
  ),
  start_time time not null,
  end_time time not null,
  title text not null,
  notes text,
  category user_entry_category not null,
  check (end_time > start_time)
);

create index if not exists user_entries_week_nr_idx on user_entries (week_nr);
create index if not exists week_overrides_week_nr_idx on week_overrides (week_nr);

-- ---------------------------------------------------------------------
-- RLS — v1: open voor iedereen met de anon key (geen login), maar wel
-- expliciet aangezet zodat de overstap naar echte auth later een
-- policy-wijziging is, geen schema-wijziging op de app-tabellen zelf.
-- ---------------------------------------------------------------------
alter table blocks enable row level security;
alter table weeks enable row level security;
alter table week_overrides enable row level security;
alter table user_entries enable row level security;

create policy "blocks: publiek leesbaar" on blocks for select using (true);
create policy "weeks: publiek leesbaar" on weeks for select using (true);

create policy "week_overrides: v1 open" on week_overrides for all using (true) with check (true);
create policy "user_entries: v1 open" on user_entries for all using (true) with check (true);
