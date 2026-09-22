export type Day =
  | "maandag"
  | "dinsdag"
  | "woensdag"
  | "donderdag"
  | "vrijdag"
  | "zaterdag"
  | "zondag";

export const DAYS: Day[] = [
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag",
  "zondag",
];

export const DAY_LABELS: Record<Day, string> = {
  maandag: "Maandag",
  dinsdag: "Dinsdag",
  woensdag: "Woensdag",
  donderdag: "Donderdag",
  vrijdag: "Vrijdag",
  zaterdag: "Zaterdag",
  zondag: "Zondag",
};

export type BlockType = "les" | "zelfstudie" | "werkblok";

export interface Block {
  id: string;
  title: string;
  type: BlockType;
  day: Day;
  start_time: string; // "HH:MM"
  end_time: string | null;
  location: string | null;
  vak_code: string | null;
  depends_on: string | null;
}

export interface Week {
  week_nr: number;
  iso_week: string;
  monday_date: string; // ISO date
  friday_date: string; // ISO date
  note: string | null;
}

export type OverrideStatus = "geen_les" | "verplaatst" | "aangepast";

export interface WeekOverride {
  id: string;
  week_nr: number;
  block_id: string;
  status: OverrideStatus;
  reason: string | null;
  new_start: string | null;
  new_end: string | null;
}

export type EntryCategory =
  | "Studio Maud"
  | "Kompas"
  | "Bachelorproef"
  | "Studie"
  | "Persoonlijk";

export const ENTRY_CATEGORIES: EntryCategory[] = [
  "Studio Maud",
  "Kompas",
  "Bachelorproef",
  "Studie",
  "Persoonlijk",
];

export interface UserEntry {
  id: string;
  week_nr: number;
  day: Day;
  start_time: string;
  end_time: string;
  title: string;
  notes: string | null;
  category: EntryCategory;
}

export type NewUserEntry = Omit<UserEntry, "id">;
