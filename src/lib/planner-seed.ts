import type { Block, Week, WeekOverride } from "./planner-types";

// Vast sjabloon voor semester 1, AJ26-27 — 12 weken vanaf 21 september 2026.
// Voorheen seed-data voor Supabase, nu de bron van waarheid zelf (geen
// backend meer): blocks/weeks liggen vast in de code, week_overrides en
// user_entries leven in localStorage (zie planner-storage.ts).

export const SEED_WEEKS: Week[] = [
  { week_nr: 1, iso_week: "W39", monday_date: "2026-09-21", friday_date: "2026-09-25", note: null },
  { week_nr: 2, iso_week: "W40", monday_date: "2026-09-28", friday_date: "2026-10-02", note: null },
  { week_nr: 3, iso_week: "W41", monday_date: "2026-10-05", friday_date: "2026-10-09", note: null },
  { week_nr: 4, iso_week: "W42", monday_date: "2026-10-12", friday_date: "2026-10-16", note: null },
  { week_nr: 5, iso_week: "W43", monday_date: "2026-10-19", friday_date: "2026-10-23", note: null },
  { week_nr: 6, iso_week: "W44", monday_date: "2026-10-26", friday_date: "2026-10-30", note: null },
  {
    week_nr: 7,
    iso_week: "W45",
    monday_date: "2026-11-02",
    friday_date: "2026-11-06",
    note: "Geen les ctp-les (Allerzielen)",
  },
  { week_nr: 8, iso_week: "W46", monday_date: "2026-11-09", friday_date: "2026-11-13", note: null },
  { week_nr: 9, iso_week: "W47", monday_date: "2026-11-16", friday_date: "2026-11-20", note: null },
  { week_nr: 10, iso_week: "W48", monday_date: "2026-11-23", friday_date: "2026-11-27", note: null },
  { week_nr: 11, iso_week: "W49", monday_date: "2026-11-30", friday_date: "2026-12-04", note: null },
  { week_nr: 12, iso_week: "W50", monday_date: "2026-12-07", friday_date: "2026-12-11", note: null },
];

export const SEED_BLOCKS: Block[] = [
  {
    id: "ctp-les",
    title: "Criminaliteit tijd en plaats",
    type: "les",
    day: "maandag",
    start_time: "09:00",
    end_time: "11:30",
    location: "Auditorium C Campus Aula",
    vak_code: "B001844A",
    depends_on: null,
  },
  {
    id: "ctp-herhaling",
    title: "Criminaliteit tijd en plaats (herhaling)",
    type: "zelfstudie",
    day: "dinsdag",
    start_time: "10:30",
    end_time: "13:00",
    location: "Zelfstudie",
    vak_code: null,
    depends_on: "ctp-les",
  },
  {
    id: "bronnen-les",
    title: "Bronnen en onderzoeksontwerp in de criminologie",
    type: "les",
    day: "maandag",
    start_time: "16:00",
    end_time: "19:00",
    location: "Blandijn Campus Boekentoren",
    vak_code: "B001825A/B001636A",
    depends_on: null,
  },
  {
    id: "bronnen-herhaling",
    title: "Bronnen en onderzoeksontwerp (herhaling)",
    type: "zelfstudie",
    day: "dinsdag",
    start_time: "13:00",
    end_time: "16:00",
    location: "Zelfstudie",
    vak_code: null,
    depends_on: "bronnen-les",
  },
  {
    id: "bachelorproef",
    title: "Bachelorproef",
    type: "werkblok",
    day: "woensdag",
    start_time: "09:00",
    end_time: "17:00",
    location: "Vast werkblok",
    vak_code: null,
    depends_on: null,
  },
  // TODO: einduur pcve-les onbevestigd. 11:30 is een placeholder (gelijk aan
  // ctp-les qua duur) tot het echte uur bekend is. Zie ook badge in de UI
  // en PLACEHOLDER_END_TIME_BLOCK_IDS in planner-constants.ts.
  {
    id: "pcve-les",
    title: "Preventie en aanpak van gewelddadig extremisme",
    type: "les",
    day: "donderdag",
    start_time: "08:30",
    end_time: "11:30",
    location: "Auditorium G",
    vak_code: "B001857A",
    depends_on: null,
  },
];

export const SEED_OVERRIDES: WeekOverride[] = [
  {
    id: "seed-ctp-w7",
    week_nr: 7,
    block_id: "ctp-les",
    status: "geen_les",
    reason: "Allerzielen",
    new_start: null,
    new_end: null,
  },
  {
    id: "seed-pcve-w1",
    week_nr: 1,
    block_id: "pcve-les",
    status: "geen_les",
    reason: "vak start pas 1 oktober",
    new_start: null,
    new_end: null,
  },
];
