// Bepaalt voor de sitemap welke artikel-URL's canonical zijn en welke NL/EN-paren
// bij elkaar horen. Leest enkel de front matter; artikelinhoud blijft onaangeroerd.
import { readdirSync, readFileSync } from "node:fs";

const SITE = "https://maud-hendrix.com";

function frontMatter(file) {
  const raw = readFileSync(file, "utf8");
  const block = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const get = (key) => {
    const m = block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim().replace(/^["']|["']$/g, "") : undefined;
  };
  return { slugEn: get("slugEn"), canonicalPath: get("canonicalPath"), draft: get("draft") === "true" };
}

const nlDir = new URL("./src/content/artikelen/nl/", import.meta.url);
const enDir = new URL("./src/content/artikelen/en/", import.meta.url);
const ids = readdirSync(nlDir).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));

const excluded = new Set(["/planner"]);
const pairs = new Map(); // NL-URL en EN-URL -> { nl, en }

for (const id of ids) {
  const nl = frontMatter(new URL(`${id}.md`, nlDir));
  const en = frontMatter(new URL(`${id}.md`, enDir));
  const nlPath = `/artikelen/${id}`;
  const enPath = `/en/articles/${en.slugEn ?? id}`;
  if (nl.draft || nl.canonicalPath) excluded.add(nlPath);
  if (en.draft || en.canonicalPath) excluded.add(enPath);
  if (!nl.draft && !nl.canonicalPath && !en.draft && !en.canonicalPath) {
    const pair = { nl: `${SITE}${nlPath}`, en: `${SITE}${enPath}` };
    pairs.set(pair.nl, pair);
    pairs.set(pair.en, pair);
  }
}

// Draft-gidsen zijn noindex en horen niet in de sitemap.
const gidsDir = new URL("./src/content/reseller-gidsen/", import.meta.url);
for (const f of readdirSync(gidsDir).filter((f) => f.endsWith(".md"))) {
  const fm = frontMatter(new URL(f, gidsDir));
  if (fm.draft) excluded.add(`/reseller-gidsen/${readFileSync(new URL(f, gidsDir), "utf8").match(/^slug:\s*"?([^"\n]+)"?/m)?.[1] ?? f.slice(0, -3)}`);
}

// Gidsen met een afwijkende canonical (of draft) worden niet meer gebouwd, dus staan ze niet in de sitemap.
export function sitemapFilter(page) {
  return !excluded.has(new URL(page).pathname);
}

export function sitemapSerialize(item) {
  const pair = pairs.get(item.url);
  if (pair) {
    item.links = [
      { url: pair.nl, lang: "nl-BE" },
      { url: pair.en, lang: "en" },
      { url: pair.nl, lang: "x-default" },
    ];
  }
  return item;
}
