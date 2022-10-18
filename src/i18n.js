import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  about,
  hero,
  weHelp,
  findYourself,
  downloadApp,
  howItWorks,
  meetOurSpecialists,
  page,
  question,
  sosCenter,
  contactUs,
  faq,
} from "./blocks/locales.js";

import { howItWorksPage, notFoundPage } from "./pages/locales.js";

const resources = {
  en: {
    // Blocks
    about: about.en,
    "contact-us": contactUs.en,
    "download-app": downloadApp.en,
    faq: faq.en,
    "find-yourself": findYourself.en,
    hero: hero.en,
    "how-it-works": howItWorks.en,
    "meet-our-specialists": meetOurSpecialists.en,
    page: page.en,
    question: question.en,
    "sos-center": sosCenter.en,
    "we-help": weHelp.en,

    // Pages
    "how-it-works-page": howItWorksPage.en,
    "not-found-page": notFoundPage.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
