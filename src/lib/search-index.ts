// Bouwt de doorzoekbare index voor de commandobalk. Draait tijdens de build
// (glob-loader content collections), niet in de browser — het resultaat
// wordt als statisch JSON-bestand geserveerd zodat zoeken client-side
// gebeurt zonder request per toetsaanslag.
import { getCollection } from "astro:content";
import type { Language } from "../i18n/ui";

export interface SearchSection {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface SearchArticle {
  title: string;
  excerpt: string;
  href: string;
  date: string;
}

export interface SearchIndex {
  sections: SearchSection[];
  articles: SearchArticle[];
}

// Geen Privé-sectie in het Engelse domein: die pagina bestaat niet (zie
// SiteHeader.astro). Contact heeft geen losse pagina, dus die wijst naar
// het contactblok op de respectievelijke homepage.
const sectionsByLocale: Record<Language, SearchSection[]> = {
  nl: [
    {
      id: "professioneel",
      title: "Professioneel",
      subtitle: "Criminologie & ondernemerschap",
      href: "/professioneel",
    },
    {
      id: "prive",
      title: "Privé",
      subtitle: "Kattenmoeder en muurklimmer",
      href: "/prive",
    },
    {
      id: "artikelen",
      title: "Artikelen",
      subtitle: "Praktijkkennis over resellen op Vinted",
      href: "/artikelen",
    },
    {
      id: "contact",
      title: "Contact",
      subtitle: "Stuur een mail of connecteer op LinkedIn",
      href: "/#contact",
    },
  ],
  en: [
    {
      id: "professional",
      title: "Professional",
      subtitle: "Criminology & entrepreneurship",
      href: "/en/professional",
    },
    {
      id: "articles",
      title: "Articles",
      subtitle: "Practical knowledge on reselling on Vinted",
      href: "/en/articles",
    },
    {
      id: "contact",
      title: "Contact",
      subtitle: "Send an email or connect on LinkedIn",
      href: "/en#contact",
    },
  ],
};

export async function buildSearchIndex(locale: Language): Promise<SearchIndex> {
  const collectionName = locale === "nl" ? "articlesNl" : "articlesEn";
  const base = locale === "nl" ? "/artikelen" : "/en/articles";

  const entries = (await getCollection(collectionName, ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.localeCompare(a.data.date) || a.data.title.localeCompare(b.data.title)
  );

  const articles: SearchArticle[] = entries.map((entry) => ({
    title: entry.data.title,
    excerpt: entry.data.excerpt,
    href: `${base}/${entry.data.slugEn ?? entry.id}`,
    date: entry.data.date,
  }));

  return { sections: sectionsByLocale[locale], articles };
}
