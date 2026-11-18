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
    menu: {
      home: "Start",
      work: "Werk",
      articles: "Artikelen",
      profile: "Profiel",
      private: "Buiten beeld",
      contact: "Contact",
      open: "Menu",
      close: "Sluiten",
      navLabel: "Hoofdmenu",
      logoLabel: "Maud Hendrix, naar de startpagina",
      tagline: "Criminologie & ondernemerschap",
    },
    footer: {
      location: "Gent, België",
      kicker: "Een idee? Een vraag? Een interessante omweg?",
      cta: "Laten we praten",
      linkedin: "LinkedIn",
      motionOff: "Beweging uitzetten",
      motionOn: "Beweging aanzetten",
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
    menu: {
      home: "Home",
      work: "Work",
      articles: "Articles",
      profile: "Profile",
      private: "Off the clock",
      contact: "Contact",
      open: "Menu",
      close: "Close",
      navLabel: "Main menu",
      logoLabel: "Maud Hendrix, to the home page",
      tagline: "Criminology & entrepreneurship",
    },
    footer: {
      location: "Ghent, Belgium",
      kicker: "An idea? A question? An interesting detour?",
      cta: "Let's talk",
      linkedin: "LinkedIn",
      motionOff: "Turn motion off",
      motionOn: "Turn motion on",
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
