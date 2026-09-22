# maud-hendrix.com

Persoonlijke CV/portfolio-site van Maud Hendrix. Astro, hosted op Netlify.

## Development

```bash
npm install
cp .env.example .env   # vul PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY in, nodig voor /planner
npm run dev
```

## Structuur

- `/` — startscherm met twee ingangen: Professioneel en Privé
- `/professioneel` — profiel, studie, onderneming, traject, artikelen, contact
- `/artikelen` — artikelen op basis van "De Ku(n)s(t) van resellen" (voorheen `/professioneel/artikelen`, nu 301-redirect via `public/_redirects`)
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
TypeScript-island (`src/scripts/planner-app.ts`) die rechtstreeks met
Supabase praat via `@supabase/supabase-js`. Eén gebruiker, geen login in v1.

### Opzetten

1. Maak een Supabase-project.
2. Draai `supabase/migrations/0001_planner_init.sql` (schema + RLS) en
   daarna `supabase/seed.sql` (12 weken, 6 vaste blokken, de 2 gekende
   uitzonderingen) — bv. via de SQL-editor in het Supabase-dashboard, of
   met de Supabase CLI.
3. Zet `PUBLIC_SUPABASE_URL` en `PUBLIC_SUPABASE_ANON_KEY` in `.env`
   (lokaal) en als omgevingsvariabelen in Netlify (productie). Deze zijn
   client-side zichtbaar (vereist voor een client-only Supabase-app) —
   dat is de bedoeling, toegang wordt afgeschermd door RLS, niet door de
   geheimhouding van de anon key.

### Code-structuur

- `src/lib/planner-types.ts` — TypeScript-types die het Supabase-schema volgen.
- `src/lib/planner-logic.ts` — pure cascadelogica (geen Supabase-afhankelijkheid,
  dus makkelijk apart te testen): berekent per week welke vaste blokken
  doorgaan, vervallen of verschuiven.
- `src/lib/planner-constants.ts` — kleuren, roostergrid-instellingen.
- `src/lib/planner-supabase.ts` — Supabase-client.
- `src/scripts/planner-app.ts` — client-side app: data laden, grid tekenen,
  modals, CRUD, print-export, swipe-navigatie.
- `src/pages/planner/index.astro` — markup + styling (eigen kleurenschema,
  losstaand van de rest van de site, zie stijlsectie in dat bestand).

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
- **RLS in v1 permissief** (open voor de anon key, geen login): zo werkt de
  app meteen zonder login. Opstap naar echte auth later: voeg een nullable
  `user_id uuid references auth.users` toe aan `week_overrides` en
  `user_entries` (niet aan `blocks`/`weeks`, dat blijft gedeelde
  referentiedata) en vervang de policy door `using (auth.uid() = user_id)`.
  Additieve migratie, geen herontwerp.
- **Categoriekleuren**: exacte hex-waarden zelf gekozen binnen de gegeven
  kleurnamen (terracotta/salie-groen/mosterdgeel/grijs-lavendel/gedempt
  blauw), zie `src/lib/planner-constants.ts`. Een 6e categorie-slot is
  bewust vrij: `user_entry_category` is een Postgres enum met 5 waarden,
  later uit te breiden met `alter type ... add value` zonder herontwerp.
- **Vaste lesblokken krijgen de "Studie"-kleur** (gedempt blauw), behalve
  het werkblok Bachelorproef, dat de Bachelorproef-kleur krijgt zodat het
  visueel aansluit bij de gelijknamige user_entry-categorie.
- **pcve-les einduur (11:30) is een onbevestigde placeholder** — zichtbaar
  gemarkeerd met een TODO-badge op het blok zelf (zolang het niet
  geannuleerd is) plus een `TODO`-commentaar in `supabase/seed.sql` en
  `PLACEHOLDER_END_TIME_BLOCK_IDS` in `planner-constants.ts`. Aanpassen
  zodra het echte einduur bekend is: seed-waarde + die constante.
- **Cascade-ghost die volledig overlapt met een verschoven blok wordt niet
  getoond**: wanneer ctp-les vervalt, verschuift bronnen-herhaling naar
  10:30–16:00 en zou het "vervallen"-spookvak van ctp-herhaling daar exact
  overheen liggen. Zulke volledig overlappende ghosts worden niet getekend
  (generieke overlap-check op dag+tijd, geen aparte cascade-tabel).
- **Route `/planner` heeft `noindex`** en staat niet in de hoofdnavigatie:
  het is een persoonlijk werktool, geen publieke contentpagina. Bewust
  zonder pincode (zoals `/prive` wel heeft), omdat login expliciet nog niet
  bevestigd is voor v1.
