import type { UserEntry, WeekOverride } from "./planner-types";
import { SEED_OVERRIDES } from "./planner-seed";

// Geen backend: uitzonderingen en eigen invullingen leven in localStorage
// van de browser. Dat betekent: data staat enkel op dit toestel/deze
// browser, niet gesynchroniseerd tussen bv. iPhone en MacBook. Voor een
// gedeelde/gesynchroniseerde versie later: zie de Supabase-schema-opzet in
// een eerdere versie van dit project (git-historiek), het datamodel is
// bewust hetzelfde gebleven.

const ENTRIES_KEY = "planner:user-entries";
const OVERRIDES_KEY = "planner:week-overrides";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage kan falen (privénavigatie, vol, geblokkeerd) — de
    // wijziging blijft dan enkel voor deze paginaweergave zichtbaar.
  }
}

export function loadEntries(): UserEntry[] {
  return readJson<UserEntry[]>(ENTRIES_KEY, []);
}

export function saveEntries(entries: UserEntry[]): void {
  writeJson(ENTRIES_KEY, entries);
}

export function loadOverrides(): WeekOverride[] {
  const raw = localStorage.getItem(OVERRIDES_KEY);
  if (raw === null) {
    // Eerste bezoek: start met de twee gekende uitzonderingen.
    saveOverrides(SEED_OVERRIDES);
    return SEED_OVERRIDES;
  }
  try {
    return JSON.parse(raw) as WeekOverride[];
  } catch {
    return SEED_OVERRIDES;
  }
}

export function saveOverrides(overrides: WeekOverride[]): void {
  writeJson(OVERRIDES_KEY, overrides);
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
