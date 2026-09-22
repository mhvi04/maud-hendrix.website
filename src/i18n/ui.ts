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
  },
} as const;

export function useTranslations(lang: Language) {
  return ui[lang];
}
