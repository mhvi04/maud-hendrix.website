# maud-hendrix.com

Persoonlijke CV/portfolio-site van Maud Hendrix. Astro, hosted op Netlify.

## Development

```bash
npm install
npm run dev
```

## Structuur

- `/` — startscherm met twee ingangen: Professioneel en Privé
- `/professioneel` — profiel, studie, onderneming, traject, artikelen, contact
- `/artikelen` — artikelen op basis van "De Ku(n)s(t) van resellen" (voorheen `/professioneel/artikelen`, nu 301-redirect via `public/_redirects`)
- `/prive` — sociale kanalen, interesses, blog
- `/prive/blog` — blogposts

Artikelen en blogposts zijn Astro content collections (`src/content/articles`).

## Nog te doen

- `public/cv.pdf` toevoegen (de "CV downloaden"-knop op `/professioneel` linkt hiernaar)
- Echte tekst voor de twee concept-artikelen invullen (`src/content/articles/*.md`)
- Jaartallen/periodes in de tijdlijn op `/professioneel` controleren (`src/components/Timeline.astro`)
