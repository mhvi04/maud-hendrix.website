export const languages = ["nl", "en"] as const;
export type Language = (typeof languages)[number];

export const ui = {
  nl: {
    nav: {
      home: "Start",
      switchLanguage: "EN",
      switchLanguageLabel: "Switch to English",
      backToArticles: "← Alle artikelen",
    },
    footer: {
      location: "Gent, België",
    },
    search: {
      triggerLabel: "Zoeken (Cmd+K)",
      dialogLabel: "Zoeken",
      placeholder: "Zoek secties of artikelen…",
      close: "Sluiten",
      sectionsGroup: "Secties",
      articlesGroup: "Artikelen",
      recentGroup: "Meest recent",
      noResults: "Geen resultaten gevonden.",
      hintNavigate: "navigeren",
      hintSelect: "openen",
      hintClose: "sluiten",
    },
  },
  en: {
    nav: {
      home: "Home",
      switchLanguage: "NL",
      switchLanguageLabel: "Schakel over naar Nederlands",
      backToArticles: "← All articles",
    },
    footer: {
      location: "Ghent, Belgium",
    },
    search: {
      triggerLabel: "Search (Cmd+K)",
      dialogLabel: "Search",
      placeholder: "Search sections or articles…",
      close: "Close",
      sectionsGroup: "Sections",
      articlesGroup: "Articles",
      recentGroup: "Most recent",
      noResults: "No results found.",
      hintNavigate: "navigate",
      hintSelect: "select",
      hintClose: "close",
    },
  },
} as const;

export function useTranslations(lang: Language) {
  return ui[lang];
}
