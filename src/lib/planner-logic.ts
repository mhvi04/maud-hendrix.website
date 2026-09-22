import type { Block, Day, OverrideStatus, WeekOverride } from "./planner-types";

// De enige hardcoded cascaderegel (bewust geen generieke cascade-tabel):
// valt ctp-les een week weg, dan schuift bronnen-herhaling naar 10:30-16:00
// (het vult de sloten op die ctp-herhaling anders had ingenomen).
const CTP_LES_ID = "ctp-les";
const BRONNEN_HERHALING_ID = "bronnen-herhaling";
const BRONNEN_HERHALING_SHIFTED_START = "10:30";
const BRONNEN_HERHALING_SHIFTED_END = "16:00";

export type EffectiveStatus =
  | "normaal"
  | "geen_les"
  | "verplaatst"
  | "aangepast"
  | "cascade_geen_les"
  | "cascade_verschoven";

export interface EffectiveBlock {
  block: Block;
  day: Day;
  startTime: string;
  endTime: string | null;
  status: EffectiveStatus;
  reason: string | null;
}

/**
 * Berekent voor een week welke vaste blokken effectief doorgaan, vervallen
 * of verschoven zijn, op basis van de eigen week_overrides van dat blok en
 * (waar van toepassing) de status van het blok waar het van afhangt.
 */
export function computeEffectiveBlocks(
  blocks: Block[],
  overrides: WeekOverride[]
): EffectiveBlock[] {
  const overrideByBlockId = new Map(overrides.map((o) => [o.block_id, o]));

  const result: EffectiveBlock[] = blocks.map((block) => {
    const override = overrideByBlockId.get(block.id);
    if (!override) {
      return {
        block,
        day: block.day,
        startTime: block.start_time,
        endTime: block.end_time,
        status: "normaal",
        reason: null,
      };
    }
    return {
      block,
      day: block.day,
      startTime: override.new_start ?? block.start_time,
      endTime: override.new_end ?? block.end_time,
      status: override.status as OverrideStatus,
      reason: override.reason,
    };
  });

  const byId = new Map(result.map((r) => [r.block.id, r]));

  // Generieke depends_on-cascade: een zelfstudieblok dat afhangt van een
  // les die deze week geen_les is, vervalt automatisch mee — tenzij het
  // zelf al een eigen override heeft (die heeft voorrang).
  for (const item of result) {
    if (!item.block.depends_on) continue;
    if (item.status !== "normaal") continue;
    const parent = byId.get(item.block.depends_on);
    if (parent && parent.status === "geen_les") {
      item.status = "cascade_geen_les";
      item.reason = parent.reason;
    }
  }

  // Specifieke hardcoded regel: zie comment bovenaan het bestand.
  const ctpLes = byId.get(CTP_LES_ID);
  const bronnenHerhaling = byId.get(BRONNEN_HERHALING_ID);
  if (
    ctpLes?.status === "geen_les" &&
    bronnenHerhaling &&
    !overrideByBlockId.has(BRONNEN_HERHALING_ID)
  ) {
    bronnenHerhaling.startTime = BRONNEN_HERHALING_SHIFTED_START;
    bronnenHerhaling.endTime = BRONNEN_HERHALING_SHIFTED_END;
    bronnenHerhaling.status = "cascade_verschoven";
    bronnenHerhaling.reason = ctpLes.reason;
  }

  return result;
}

export function isCancelled(status: EffectiveStatus): boolean {
  return status === "geen_les" || status === "cascade_geen_les";
}

/** "09:00" -> 540 (minuten sinds middernacht) */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}
