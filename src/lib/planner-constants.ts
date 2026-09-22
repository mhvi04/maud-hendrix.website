import type { EntryCategory } from "./planner-types";

// Categoriekleuren — bindend qua kleurnaam uit de opdracht, exacte hex zelf
// gekozen binnen die naam (niet letterlijk gegeven). 6e categorie-slot
// bewust vrijgelaten (geen kleur toegewezen), zie ENTRY_CATEGORIES.
export const CATEGORY_COLORS: Record<EntryCategory, string> = {
  "Studio Maud": "#c1633d", // terracotta
  Kompas: "#7a9471", // salie-groen
  Bachelorproef: "#d8a83e", // mosterdgeel
  Studie: "#4a6fa5", // gedempt blauw — ook kleur van vaste lesblokken
  Persoonlijk: "#9089a3", // grijs-lavendel
};

// Vaste lesblokken (blocks-tabel) krijgen dezelfde kleur als categorie
// "Studie", behalve het werkblok Bachelorproef, dat de Bachelorproef-kleur
// krijgt zodat het visueel aansluit bij de gelijknamige user_entry-categorie.
export function blockColor(blockId: string, type: string): string {
  if (blockId === "bachelorproef" || type === "werkblok") {
    return CATEGORY_COLORS["Bachelorproef"];
  }
  return CATEGORY_COLORS["Studie"];
}

// Roostergrid: 07:00-22:00 in blokken van 30 minuten. Ruimer dan enkel de
// vaste lesuren omdat dit een persoonlijke planner is (ook avond/eigen
// invulling moet passen).
export const GRID_START_MINUTES = 7 * 60;
export const GRID_END_MINUTES = 22 * 60;
export const SLOT_MINUTES = 30;
export const SLOT_COUNT = (GRID_END_MINUTES - GRID_START_MINUTES) / SLOT_MINUTES;

// Blokken waarvan het end_time in de seed-data een onbevestigde placeholder
// is (zie supabase/seed.sql). Puur presentatie: toont een TODO-markering in
// de UI, geen schemawijziging.
export const PLACEHOLDER_END_TIME_BLOCK_IDS = ["pcve-les"];
