import { supabase } from "../lib/planner-supabase";
import {
  computeEffectiveBlocks,
  isCancelled,
  timeToMinutes,
  type EffectiveBlock,
} from "../lib/planner-logic";
import {
  CATEGORY_COLORS,
  GRID_START_MINUTES,
  GRID_END_MINUTES,
  SLOT_MINUTES,
  SLOT_COUNT,
  PLACEHOLDER_END_TIME_BLOCK_IDS,
  blockColor,
} from "../lib/planner-constants";
import {
  DAYS,
  DAY_LABELS,
  type Block,
  type Day,
  type EntryCategory,
  type OverrideStatus,
  type UserEntry,
  type Week,
  type WeekOverride,
} from "../lib/planner-types";

const MONTHS_NL = [
  "jan",
  "feb",
  "mrt",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec",
];

interface State {
  weeks: Week[];
  blocks: Block[];
  overrides: WeekOverride[];
  entries: UserEntry[];
  currentWeekNr: number;
}

const state: State = {
  weeks: [],
  blocks: [],
  overrides: [],
  entries: [],
  currentWeekNr: 1,
};

function $<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} niet gevonden`);
  return el as T;
}

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS_NL[d.getMonth()]}`;
}

function dateForDayInWeek(week: Week, day: Day): Date {
  const monday = new Date(week.monday_date + "T00:00:00");
  const offset = DAYS.indexOf(day);
  const d = new Date(monday);
  d.setDate(monday.getDate() + offset);
  return d;
}

function isoDateForDayInWeek(week: Week, day: Day): string {
  const d = dateForDayInWeek(week, day);
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// -------------------------------------------------------------------
// Data laden
// -------------------------------------------------------------------

async function loadStaticData(): Promise<void> {
  const [{ data: weeks, error: weeksError }, { data: blocks, error: blocksError }] =
    await Promise.all([
      supabase.from("weeks").select("*").order("week_nr"),
      supabase.from("blocks").select("*"),
    ]);

  if (weeksError) throw weeksError;
  if (blocksError) throw blocksError;

  state.weeks = weeks ?? [];
  state.blocks = blocks ?? [];
}

async function loadMutableData(): Promise<void> {
  const [{ data: overrides, error: overridesError }, { data: entries, error: entriesError }] =
    await Promise.all([
      supabase.from("week_overrides").select("*"),
      supabase.from("user_entries").select("*"),
    ]);

  if (overridesError) throw overridesError;
  if (entriesError) throw entriesError;

  state.overrides = overrides ?? [];
  state.entries = entries ?? [];
}

function overridesForWeek(weekNr: number): WeekOverride[] {
  return state.overrides.filter((o) => o.week_nr === weekNr);
}

function entriesForWeek(weekNr: number): UserEntry[] {
  return state.entries.filter((e) => e.week_nr === weekNr);
}

function determineDefaultWeek(): number {
  if (!state.weeks.length) return 1;
  const today = todayIso();
  for (const week of state.weeks) {
    const start = week.monday_date;
    const sunday = new Date(week.monday_date + "T00:00:00");
    sunday.setDate(sunday.getDate() + 6);
    const end = sunday.toISOString().slice(0, 10);
    if (today >= start && today <= end) return week.week_nr;
  }
  if (today < state.weeks[0].monday_date) return state.weeks[0].week_nr;
  return state.weeks[state.weeks.length - 1].week_nr;
}

// -------------------------------------------------------------------
// Grid opbouwen
// -------------------------------------------------------------------

function slotRow(time: string): number {
  const minutes = Math.min(
    Math.max(timeToMinutes(time), GRID_START_MINUTES),
    GRID_END_MINUTES
  );
  const slot = Math.round((minutes - GRID_START_MINUTES) / SLOT_MINUTES);
  return 2 + slot; // rij 1 = dagheader
}

function setStatus(message: string, isError = false): void {
  const el = $<HTMLParagraphElement>("planner-status");
  el.textContent = message;
  el.hidden = !message;
  el.style.color = isError ? "#a3402c" : "";
}

function renderWeekLabel(): void {
  const week = state.weeks.find((w) => w.week_nr === state.currentWeekNr);
  if (!week) return;
  $("week-label").textContent = `Week ${week.week_nr} · ${week.iso_week}`;
  const monday = fmtDate(week.monday_date);
  const friday = fmtDate(week.friday_date);
  const year = week.monday_date.slice(0, 4);
  $("week-dates").textContent = week.note
    ? `${monday}–${friday} ${year} · ${week.note}`
    : `${monday}–${friday} ${year}`;
}

function buildGrid(): void {
  const grid = $<HTMLDivElement>("planner-grid");
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = "44px repeat(7, 1fr)";
  grid.style.gridTemplateRows = `36px repeat(${SLOT_COUNT}, 20px)`;

  const week = state.weeks.find((w) => w.week_nr === state.currentWeekNr);
  if (!week) return;

  const today = todayIso();

  // Hoekje
  const corner = document.createElement("div");
  corner.className = "pl-day-header";
  corner.style.gridColumn = "1 / 2";
  corner.style.gridRow = "1 / 2";
  grid.appendChild(corner);

  // Dagheaders
  DAYS.forEach((day, i) => {
    const dateIso = isoDateForDayInWeek(week, day);
    const header = document.createElement("div");
    header.className = "pl-day-header" + (dateIso === today ? " is-today" : "");
    header.style.gridColumn = `${2 + i} / ${3 + i}`;
    header.style.gridRow = "1 / 2";
    header.innerHTML = `${DAY_LABELS[day].slice(0, 2)}<span class="pl-day-date">${fmtDate(
      dateIso
    )}</span>`;
    grid.appendChild(header);
  });

  // Uur-gutter (enkel op het hele uur, spant 2 slots van 30 min)
  for (let m = GRID_START_MINUTES; m < GRID_END_MINUTES; m += 60) {
    const row = slotRow(`${String(Math.floor(m / 60)).padStart(2, "0")}:00`);
    const label = document.createElement("div");
    label.className = "pl-gutter";
    label.style.gridColumn = "1 / 2";
    label.style.gridRow = `${row} / ${row + 2}`;
    label.textContent = `${String(Math.floor(m / 60)).padStart(2, "0")}:00`;
    grid.appendChild(label);
  }

  // Lege klikbare cellen (basislaag)
  for (let slot = 0; slot < SLOT_COUNT; slot++) {
    const minutes = GRID_START_MINUTES + slot * SLOT_MINUTES;
    const isHourStart = minutes % 60 === 0;
    DAYS.forEach((day, dayIndex) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "pl-cell" + (isHourStart ? " pl-cell--hour-start" : "");
      cell.style.gridColumn = `${2 + dayIndex} / ${3 + dayIndex}`;
      cell.style.gridRow = `${2 + slot} / ${3 + slot}`;
      cell.setAttribute(
        "aria-label",
        `Toevoegen ${DAY_LABELS[day]} ${minutesToTimeLabel(minutes)}`
      );
      cell.addEventListener("click", () => {
        openEntryModal({
          mode: "create",
          day,
          startTime: minutesToTimeLabel(minutes),
          endTime: minutesToTimeLabel(Math.min(minutes + 60, GRID_END_MINUTES)),
        });
      });
      grid.appendChild(cell);
    });
  }

  // Vaste blokken. Een vervallen blok (geen_les of cascade_geen_les) wordt
  // als doorstreepte "ghost" getoond, tenzij een ander, wél actief blok
  // deze week exact diezelfde dag/tijd al inneemt (dat gebeurt wanneer de
  // bronnen-herhaling-cascaderegel het vrijgekomen ctp-herhaling-slot
  // opvult) — dan zou de ghost er toch alleen maar overheen liggen.
  const effective = computeEffectiveBlocks(state.blocks, overridesForWeek(week.week_nr));
  for (const item of effective) {
    if (isCancelled(item.status) && isCoveredByActiveSibling(item, effective)) continue;
    grid.appendChild(renderBlockElement(item, week.week_nr));
  }

  // Eigen invullingen
  for (const entry of entriesForWeek(week.week_nr)) {
    grid.appendChild(renderEntryElement(entry));
  }
}

function isCoveredByActiveSibling(item: EffectiveBlock, effective: EffectiveBlock[]): boolean {
  const itemStart = timeToMinutes(item.startTime);
  const itemEnd = item.endTime ? timeToMinutes(item.endTime) : itemStart + SLOT_MINUTES;
  return effective.some((other) => {
    if (other === item || isCancelled(other.status) || other.day !== item.day) return false;
    const otherStart = timeToMinutes(other.startTime);
    const otherEnd = other.endTime ? timeToMinutes(other.endTime) : otherStart + SLOT_MINUTES;
    return itemStart < otherEnd && otherStart < itemEnd;
  });
}

/** Postgres time-kolommen komen als "HH:MM:SS" terug; dat tonen we als "HH:MM". */
function hhmm(time: string): string {
  return time.slice(0, 5);
}

function minutesToTimeLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function renderBlockElement(item: EffectiveBlock, weekNr: number): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  const dayIndex = DAYS.indexOf(item.day);
  const startRow = slotRow(item.startTime);
  const endRow = item.endTime ? slotRow(item.endTime) : startRow + 1;
  el.style.gridColumn = `${2 + dayIndex} / ${3 + dayIndex}`;
  el.style.gridRow = `${startRow} / ${Math.max(endRow, startRow + 1)}`;
  el.style.position = "relative";

  const cancelled = isCancelled(item.status);
  const changed = item.status === "verplaatst" || item.status === "aangepast" || item.status === "cascade_verschoven";
  const isPlaceholder =
    PLACEHOLDER_END_TIME_BLOCK_IDS.includes(item.block.id) && !cancelled;

  el.className = "pl-block" + (cancelled ? " pl-block--cancelled" : "") + (changed ? " pl-block--changed" : "") + (isPlaceholder ? " pl-block--todo" : "");
  if (!cancelled) {
    el.style.background = blockColor(item.block.id, item.block.type);
  }

  const timeLabel = item.endTime ? `${hhmm(item.startTime)}–${hhmm(item.endTime)}` : hhmm(item.startTime);
  const metaBits = [timeLabel, item.block.location].filter(Boolean).join(" · ");

  el.innerHTML = `
    <span class="pl-block-title">${item.block.title}</span>
    <span class="pl-block-meta">${metaBits}</span>
    ${isPlaceholder ? '<span class="pl-block-todo-tag">TODO</span>' : ""}
  `;

  const titleParts = [item.block.title, timeLabel];
  if (item.block.location) titleParts.push(item.block.location);
  if (item.block.vak_code) titleParts.push(item.block.vak_code);
  if (cancelled) titleParts.push(`Geen les${item.reason ? " — " + item.reason : ""}`);
  else if (changed) titleParts.push(`Aangepast deze week${item.reason ? " — " + item.reason : ""}`);
  if (isPlaceholder) titleParts.push("Einduur nog niet bevestigd (placeholder)");
  el.title = titleParts.join(" · ");

  el.addEventListener("click", () => {
    openExceptionModal(item.block, weekNr);
  });

  return el;
}

function renderEntryElement(entry: UserEntry): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  const dayIndex = DAYS.indexOf(entry.day);
  const startRow = slotRow(entry.start_time);
  const endRow = slotRow(entry.end_time);
  el.style.gridColumn = `${2 + dayIndex} / ${3 + dayIndex}`;
  el.style.gridRow = `${startRow} / ${Math.max(endRow, startRow + 1)}`;
  el.className = "pl-entry";
  el.style.background = CATEGORY_COLORS[entry.category] + "33"; // lichte tint
  el.style.borderColor = CATEGORY_COLORS[entry.category];

  const timeLabel = `${hhmm(entry.start_time)}–${hhmm(entry.end_time)}`;
  el.innerHTML = `
    <span class="pl-block-title">${entry.title}</span>
    <span class="pl-block-meta">${timeLabel}</span>
  `;
  el.title = `${entry.title} · ${timeLabel} · ${entry.category}${
    entry.notes ? " · " + entry.notes : ""
  }`;

  el.addEventListener("click", () => {
    openEntryModal({ mode: "edit", entry });
  });

  return el;
}

function renderWeek(): void {
  renderWeekLabel();
  buildGrid();
}

// -------------------------------------------------------------------
// Entry-modal (user_entries CRUD)
// -------------------------------------------------------------------

interface EntryModalCreateOptions {
  mode: "create";
  day: Day;
  startTime: string;
  endTime: string;
}
interface EntryModalEditOptions {
  mode: "edit";
  entry: UserEntry;
}

function openEntryModal(opts: EntryModalCreateOptions | EntryModalEditOptions): void {
  const modal = $<HTMLDialogElement>("entry-modal");
  const title = $<HTMLHeadingElement>("entry-modal-title");
  const idField = $<HTMLInputElement>("entry-id");
  const dayField = $<HTMLSelectElement>("entry-day");
  const startField = $<HTMLInputElement>("entry-start");
  const endField = $<HTMLInputElement>("entry-end");
  const titleField = $<HTMLInputElement>("entry-title");
  const categoryField = $<HTMLSelectElement>("entry-category");
  const notesField = $<HTMLTextAreaElement>("entry-notes");
  const deleteBtn = $<HTMLButtonElement>("entry-delete");
  const errorEl = $<HTMLParagraphElement>("entry-error");
  errorEl.hidden = true;

  if (opts.mode === "create") {
    title.textContent = "Invullen";
    idField.value = "";
    dayField.value = opts.day;
    startField.value = opts.startTime;
    endField.value = opts.endTime;
    titleField.value = "";
    categoryField.value = "Persoonlijk" satisfies EntryCategory;
    notesField.value = "";
    deleteBtn.hidden = true;
  } else {
    title.textContent = "Invulling bewerken";
    idField.value = opts.entry.id;
    dayField.value = opts.entry.day;
    startField.value = hhmm(opts.entry.start_time);
    endField.value = hhmm(opts.entry.end_time);
    titleField.value = opts.entry.title;
    categoryField.value = opts.entry.category;
    notesField.value = opts.entry.notes ?? "";
    deleteBtn.hidden = false;
  }

  modal.showModal();
  titleField.focus();
}

async function saveEntry(): Promise<void> {
  const idField = $<HTMLInputElement>("entry-id");
  const dayField = $<HTMLSelectElement>("entry-day");
  const startField = $<HTMLInputElement>("entry-start");
  const endField = $<HTMLInputElement>("entry-end");
  const titleField = $<HTMLInputElement>("entry-title");
  const categoryField = $<HTMLSelectElement>("entry-category");
  const notesField = $<HTMLTextAreaElement>("entry-notes");
  const errorEl = $<HTMLParagraphElement>("entry-error");

  if (endField.value <= startField.value) {
    errorEl.textContent = "Eindtijd moet na starttijd liggen.";
    errorEl.hidden = false;
    return;
  }
  if (!titleField.value.trim()) {
    errorEl.textContent = "Vul een titel in.";
    errorEl.hidden = false;
    return;
  }

  const payload = {
    week_nr: state.currentWeekNr,
    day: dayField.value as Day,
    start_time: startField.value,
    end_time: endField.value,
    title: titleField.value.trim(),
    notes: notesField.value.trim() || null,
    category: categoryField.value as EntryCategory,
  };

  try {
    if (idField.value) {
      const { error } = await supabase.from("user_entries").update(payload).eq("id", idField.value);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("user_entries").insert(payload);
      if (error) throw error;
    }
    $<HTMLDialogElement>("entry-modal").close();
    await loadMutableData();
    renderWeek();
    setStatus("Opgeslagen.");
  } catch (err) {
    errorEl.textContent = `Opslaan mislukt: ${(err as Error).message}`;
    errorEl.hidden = false;
  }
}

async function deleteEntry(): Promise<void> {
  const idField = $<HTMLInputElement>("entry-id");
  if (!idField.value) return;
  if (!confirm("Deze invulling verwijderen?")) return;
  try {
    const { error } = await supabase.from("user_entries").delete().eq("id", idField.value);
    if (error) throw error;
    $<HTMLDialogElement>("entry-modal").close();
    await loadMutableData();
    renderWeek();
    setStatus("Verwijderd.");
  } catch (err) {
    setStatus(`Verwijderen mislukt: ${(err as Error).message}`, true);
  }
}

// -------------------------------------------------------------------
// Exception-modal (week_overrides CRUD)
// -------------------------------------------------------------------

function openExceptionModal(block: Block, weekNr: number): void {
  const modal = $<HTMLDialogElement>("exception-modal");
  const info = $<HTMLParagraphElement>("exception-block-info");
  const weekNrField = $<HTMLInputElement>("exc-week-nr");
  const blockIdField = $<HTMLInputElement>("exc-block-id");
  const statusField = $<HTMLSelectElement>("exc-status");
  const reasonField = $<HTMLInputElement>("exc-reason");
  const startField = $<HTMLInputElement>("exc-start");
  const endField = $<HTMLInputElement>("exc-end");
  const deleteBtn = $<HTMLButtonElement>("exception-delete");
  const errorEl = $<HTMLParagraphElement>("exception-error");
  errorEl.hidden = true;

  const existing = overridesForWeek(weekNr).find((o) => o.block_id === block.id);

  info.textContent = `${block.title} · normaal ${DAY_LABELS[block.day]} ${hhmm(block.start_time)}${
    block.end_time ? "–" + hhmm(block.end_time) : ""
  }${block.location ? " · " + block.location : ""}`;

  weekNrField.value = String(weekNr);
  blockIdField.value = block.id;
  statusField.value = (existing?.status ?? "geen_les") satisfies OverrideStatus;
  reasonField.value = existing?.reason ?? "";
  startField.value = hhmm(existing?.new_start ?? block.start_time);
  endField.value = hhmm(existing?.new_end ?? block.end_time ?? "00:00");
  deleteBtn.hidden = !existing;

  toggleExceptionTimeFields();
  modal.showModal();
}

function toggleExceptionTimeFields(): void {
  const statusField = $<HTMLSelectElement>("exc-status");
  const row = $<HTMLDivElement>("exc-time-row");
  row.style.display = statusField.value === "geen_les" ? "none" : "grid";
}

async function saveException(): Promise<void> {
  const weekNrField = $<HTMLInputElement>("exc-week-nr");
  const blockIdField = $<HTMLInputElement>("exc-block-id");
  const statusField = $<HTMLSelectElement>("exc-status");
  const reasonField = $<HTMLInputElement>("exc-reason");
  const startField = $<HTMLInputElement>("exc-start");
  const endField = $<HTMLInputElement>("exc-end");
  const errorEl = $<HTMLParagraphElement>("exception-error");

  const status = statusField.value as OverrideStatus;
  if (status !== "geen_les" && endField.value <= startField.value) {
    errorEl.textContent = "Eindtijd moet na starttijd liggen.";
    errorEl.hidden = false;
    return;
  }

  const payload = {
    week_nr: Number(weekNrField.value),
    block_id: blockIdField.value,
    status,
    reason: reasonField.value.trim() || null,
    new_start: status === "geen_les" ? null : startField.value,
    new_end: status === "geen_les" ? null : endField.value,
  };

  try {
    const { error } = await supabase
      .from("week_overrides")
      .upsert(payload, { onConflict: "week_nr,block_id" });
    if (error) throw error;
    $<HTMLDialogElement>("exception-modal").close();
    await loadMutableData();
    renderWeek();
    setStatus("Uitzondering opgeslagen.");
  } catch (err) {
    errorEl.textContent = `Opslaan mislukt: ${(err as Error).message}`;
    errorEl.hidden = false;
  }
}

async function deleteException(): Promise<void> {
  const weekNrField = $<HTMLInputElement>("exc-week-nr");
  const blockIdField = $<HTMLInputElement>("exc-block-id");
  try {
    const { error } = await supabase
      .from("week_overrides")
      .delete()
      .eq("week_nr", Number(weekNrField.value))
      .eq("block_id", blockIdField.value);
    if (error) throw error;
    $<HTMLDialogElement>("exception-modal").close();
    await loadMutableData();
    renderWeek();
    setStatus("Uitzondering opgeheven.");
  } catch (err) {
    setStatus(`Opheffen mislukt: ${(err as Error).message}`, true);
  }
}

// -------------------------------------------------------------------
// Print / PDF export
// -------------------------------------------------------------------

function printableTitleForBlock(item: EffectiveBlock): string {
  const changed =
    item.status === "verplaatst" || item.status === "aangepast" || item.status === "cascade_verschoven";
  return changed ? `${item.block.title} (aangepast)` : item.block.title;
}

function buildPrintableTable(week: Week): HTMLTableElement {
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.fontSize = "11px";

  const rows: { day: Day; start: string; end: string; title: string; meta: string }[] = [];

  for (const item of computeEffectiveBlocks(state.blocks, overridesForWeek(week.week_nr))) {
    if (isCancelled(item.status)) continue;
    rows.push({
      day: item.day,
      start: hhmm(item.startTime),
      end: hhmm(item.endTime ?? item.startTime),
      title: printableTitleForBlock(item),
      meta: item.block.location ?? "",
    });
  }
  for (const entry of entriesForWeek(week.week_nr)) {
    rows.push({
      day: entry.day,
      start: hhmm(entry.start_time),
      end: hhmm(entry.end_time),
      title: entry.title,
      meta: entry.category,
    });
  }

  rows.sort((a, b) => {
    const dayDiff = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return timeToMinutes(a.start) - timeToMinutes(b.start);
  });

  const thead = document.createElement("thead");
  thead.innerHTML =
    "<tr><th style='text-align:left;border-bottom:1px solid #1a1a1a;padding:4px'>Dag</th>" +
    "<th style='text-align:left;border-bottom:1px solid #1a1a1a;padding:4px'>Tijd</th>" +
    "<th style='text-align:left;border-bottom:1px solid #1a1a1a;padding:4px'>Wat</th>" +
    "<th style='text-align:left;border-bottom:1px solid #1a1a1a;padding:4px'>Locatie / categorie</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const r of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="padding:4px;border-bottom:1px solid #ddd">${DAY_LABELS[r.day]}</td>
      <td style="padding:4px;border-bottom:1px solid #ddd">${r.start}–${r.end}</td>
      <td style="padding:4px;border-bottom:1px solid #ddd">${r.title}</td>
      <td style="padding:4px;border-bottom:1px solid #ddd">${r.meta}</td>
    `;
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  return table;
}

function renderPrintRoot(weeks: Week[]): void {
  const root = $<HTMLDivElement>("print-root");
  root.innerHTML = "";
  weeks.forEach((week, i) => {
    const section = document.createElement("section");
    section.style.padding = "24px";
    section.style.fontFamily = "Inter, Arial, sans-serif";
    section.style.color = "#1a1a1a";
    if (i < weeks.length - 1) section.style.breakAfter = "page";

    const heading = document.createElement("h2");
    heading.textContent = `Week ${week.week_nr} · ${week.iso_week} (${fmtDate(
      week.monday_date
    )}–${fmtDate(week.friday_date)} ${week.monday_date.slice(0, 4)})`;
    heading.style.fontSize = "16px";
    heading.style.margin = "0 0 4px";
    section.appendChild(heading);

    if (week.note) {
      const note = document.createElement("p");
      note.textContent = week.note;
      note.style.fontSize = "11px";
      note.style.margin = "0 0 10px";
      note.style.color = "#4a6fa5";
      section.appendChild(note);
    }

    section.appendChild(buildPrintableTable(week));
    root.appendChild(section);
  });
}

function printCurrentWeek(): void {
  const week = state.weeks.find((w) => w.week_nr === state.currentWeekNr);
  if (!week) return;
  renderPrintRoot([week]);
  window.print();
}

function printAllWeeks(): void {
  renderPrintRoot(state.weeks);
  window.print();
}

// -------------------------------------------------------------------
// Navigatie + swipe
// -------------------------------------------------------------------

function goToWeek(weekNr: number): void {
  const clamped = Math.min(Math.max(weekNr, state.weeks[0]?.week_nr ?? 1), state.weeks[state.weeks.length - 1]?.week_nr ?? 12);
  state.currentWeekNr = clamped;
  renderWeek();
}

function setupSwipe(container: HTMLElement): void {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  container.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    },
    { passive: true }
  );

  container.addEventListener(
    "touchend",
    (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) goToWeek(state.currentWeekNr + 1);
        else goToWeek(state.currentWeekNr - 1);
      }
    },
    { passive: true }
  );
}

// -------------------------------------------------------------------
// Init
// -------------------------------------------------------------------

export async function initPlanner(): Promise<void> {
  setStatus("Laden…");
  try {
    await loadStaticData();
    await loadMutableData();
    state.currentWeekNr = determineDefaultWeek();
    renderWeek();
    setStatus("");
  } catch (err) {
    setStatus(`Kon planner niet laden: ${(err as Error).message}`, true);
    return;
  }

  $<HTMLButtonElement>("prev-week-btn").addEventListener("click", () =>
    goToWeek(state.currentWeekNr - 1)
  );
  $<HTMLButtonElement>("next-week-btn").addEventListener("click", () =>
    goToWeek(state.currentWeekNr + 1)
  );
  $<HTMLButtonElement>("today-btn").addEventListener("click", () =>
    goToWeek(determineDefaultWeek())
  );

  $<HTMLFormElement>("entry-form").addEventListener("submit", (e) => {
    e.preventDefault();
    void saveEntry();
  });
  $<HTMLButtonElement>("entry-cancel").addEventListener("click", () =>
    $<HTMLDialogElement>("entry-modal").close()
  );
  $<HTMLButtonElement>("entry-delete").addEventListener("click", () => void deleteEntry());

  $<HTMLFormElement>("exception-form").addEventListener("submit", (e) => {
    e.preventDefault();
    void saveException();
  });
  $<HTMLButtonElement>("exception-cancel").addEventListener("click", () =>
    $<HTMLDialogElement>("exception-modal").close()
  );
  $<HTMLButtonElement>("exception-delete").addEventListener("click", () => void deleteException());
  $<HTMLSelectElement>("exc-status").addEventListener("change", toggleExceptionTimeFields);

  $<HTMLButtonElement>("print-week-btn").addEventListener("click", printCurrentWeek);
  $<HTMLButtonElement>("print-all-btn").addEventListener("click", printAllWeeks);

  setupSwipe($<HTMLDivElement>("grid-scroll"));
}
