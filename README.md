# maud-hendrix.com

Persoonlijke CV/portfolio-site van Maud Hendrix. Astro, hosted op Netlify.

## Development

```bash
npm install
npm run dev
```

## Structuur

- `/` — startscherm met twee ingangen (Professioneel en Privé) en daaronder
  de lijst van alle artikelen, nieuwste eerst
- `/professioneel` — profiel, studie, onderneming, traject, contact
- `/artikelen` — overzicht van de artikelen op basis van "De Ku(n)s(t) van resellen" (voorheen `/professioneel/artikelen`, nu 301-redirect via `public/_redirects`)
- `/prive` — sociale kanalen, interesses, blog
- `/prive/blog` — blogposts
- `/planner` — persoonlijke weekplanner semester 1 (AJ26-27), zie hieronder

Artikelen en blogposts zijn Astro content collections (`src/content/articles`).

## Nog te doen

- `public/cv.pdf` toevoegen (de "CV downloaden"-knop op `/professioneel` linkt hiernaar)
- Echte tekst voor de twee concept-artikelen invullen (`src/content/articles/*.md`)
- Jaartallen/periodes in de tijdlijn op `/professioneel` controleren (`src/components/Timeline.astro`)

## Weekplanner (`/planner`)

Persoonlijke weekplanner/agenda voor semester 1, AJ26-27 (12 weken vanaf
21 september 2026). Gewone gecodeerde Astro-pagina met een client-side
TypeScript-island (`src/scripts/planner-app.ts`). **Geen backend**: het
vaste sjabloon (lesblokken, weken) staat hardcoded in de code, en je eigen
wijzigingen (uitzonderingen, invullingen) worden bewaard in `localStorage`
van je browser. Geen account, geen configuratie nodig — werkt meteen na
`npm run dev` of live op Netlify.

Staat achter een pincode (`2004`, via de bestaande `PinGate`-component,
zelfde als `/prive`) — puur een scherm in de browser, geen echte
serverbeveiliging.

**Beperking om te weten**: data leeft alleen op het toestel/de browser
waarin je hem invult. Open je de site op je iPhone én je MacBook, dan zijn
dat twee gescheiden datasets — geen sync tussen apparaten. Wis je de
browsergegevens (of gebruik je een privévenster), dan ben je je eigen
invullingen kwijt; het vaste sjabloon komt gewoon terug, dat staat in de
code. Voor echte sync tussen apparaten is later alsnog een backend nodig
(Supabase, zoals een eerdere versie van dit project had — zie git-historiek
voor het uitgewerkte schema, dat was bewust identiek aan dit datamodel).

### Code-structuur

- `src/lib/planner-types.ts` — TypeScript-types voor blocks/weeks/overrides/entries.
- `src/lib/planner-seed.ts` — het vaste sjabloon: de 12 weken, 6 vaste
  blokken en de 2 gekende uitzonderingen, hardcoded.
- `src/lib/planner-logic.ts` — pure cascadelogica (geen afhankelijkheden,
  dus makkelijk apart te testen): berekent per week welke vaste blokken
  doorgaan, vervallen of verschuiven.
- `src/lib/planner-constants.ts` — kleuren, roostergrid-instellingen.
- `src/lib/planner-storage.ts` — lezen/schrijven van uitzonderingen en
  invullingen naar `localStorage`.
- `src/scripts/planner-app.ts` — client-side app: grid tekenen, modals,
  CRUD, print-export, swipe-navigatie.
- `src/pages/planner/index.astro` — markup + styling (eigen kleurenschema,
  losstaand van de rest van de site, zie stijlsectie in dat bestand) +
  de `PinGate`.

### Aannames tijdens bouw

Waar de opdracht ambigu was, is hieronder de keuze en de reden gedocumenteerd
(zoals gevraagd, in plaats van voor elk detail terug te vragen):

- **Bouwsysteem**: gewone gecodeerde Astro-pagina + Supabase, zoals gevraagd
  te verifiëren — bevestigd doordat de rest van de site al een gecodeerde
  Astro-codebase is (geen Lovable), dus dit past naadloos in de bestaande
  toolchain.
- **Weekgrid toont maandag t/m zondag** (07:00–22:00, blokken van 30 min),
  niet enkel tot vrijdag: het is een persoonlijke planner, dus er moet ook
  ruimte zijn voor Kompas/Studio Maud/Persoonlijk-invullingen in het weekend
  en 's avonds. `weeks.friday_date` blijft puur het einde van de academische
  week markeren voor de weeklabel.
- **"Verplaatst"/"aangepast" wijzigt enkel de tijd, niet de dag**: het
  gegeven `week_overrides`-schema heeft geen `new_day`-veld. Een les naar
  een andere dag verplaatsen kan dus niet via het blok zelf; de UI legt uit
  dat je het blok op "Annuleren" zet en zelf een invulling toevoegt op de
  gewenste dag/tijd (categorie Studie). Dit hield het schema exact zoals
  opgegeven, zonder herontwerp.
- **PDF-export via de browser-printdialoog** (`window.print()` met een
  toegespitst print-stylesheet), niet via een aparte PDF-library: lichter,
  werkt nativief op iPhone/Mac (Safari's "Opslaan als PDF"), en dekt zowel
  "per week" als "alle 12 weken" (elke week een eigen pagina).
- **Geen backend (v1.1, bijgestuurd tijdens bouw)**: oorspronkelijk gebouwd
  met Supabase, maar dat vergde een account, schema-migraties en
  omgevingsvariabelen instellen voor het live stond — te veel frictie voor
  wat in essentie een persoonlijk, single-device sjabloontje moest worden.
  Omgezet naar `localStorage`: direct bruikbaar, geen setup. Het datamodel
  (types in `planner-types.ts`) bleef ongewijzigd, dus een latere overstap
  naar een echte backend voor multi-device sync is een uitbreiding, geen
  herontwerp.
- **Categoriekleuren**: exacte hex-waarden zelf gekozen binnen de gegeven
  kleurnamen (terracotta/salie-groen/mosterdgeel/grijs-lavendel/gedempt
  blauw), zie `src/lib/planner-constants.ts`. Een 6e categorie-slot is
  bewust vrij gelaten in het `EntryCategory`-type.
- **Vaste lesblokken krijgen de "Studie"-kleur** (gedempt blauw), behalve
  het werkblok Bachelorproef, dat de Bachelorproef-kleur krijgt zodat het
  visueel aansluit bij de gelijknamige user_entry-categorie.
- **pcve-les einduur (11:30) is een onbevestigde placeholder** — zichtbaar
  gemarkeerd met een TODO-badge op het blok zelf (zolang het niet
  geannuleerd is) plus een `TODO`-commentaar in `planner-seed.ts` en
  `PLACEHOLDER_END_TIME_BLOCK_IDS` in `planner-constants.ts`. Aanpassen
  zodra het echte einduur bekend is: die twee plekken.
- **Cascade-ghost die volledig overlapt met een verschoven blok wordt niet
  getoond**: wanneer ctp-les vervalt, verschuift bronnen-herhaling naar
  10:30–16:00 en zou het "vervallen"-spookvak van ctp-herhaling daar exact
  overheen liggen. Zulke volledig overlappende ghosts worden niet getekend
  (generieke overlap-check op dag+tijd, geen aparte cascade-tabel).
- **Route `/planner` heeft `noindex`**, staat niet in de hoofdnavigatie, en
  staat achter dezelfde soort pincode als `/prive` (code `2004`): puur een
  scherm in de browser, geen echte serverbeveiliging — logisch genoeg
  gezien er ook geen server/database meer is om iets op af te schermen.
