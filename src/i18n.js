import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  About,
  Hero,
  WeHelp,
  FindYourself,
  DownloadApp,
  HowItWorks,
  MeetOurSpecialists,
  Page,
  Question,
  SosCenter,
  ContactUs,
  Faq,
  MoreArticles,
  Articles,
} from "./blocks/locales.js";

import {
  HowItWorksPage,
  NotFoundPage,
  ArticleInformation,
} from "./pages/locales.js";

const resources = {
  en: {
    // Blocks
    about: About.en,
    "contact-us": ContactUs.en,
    "download-app": DownloadApp.en,
    faq: Faq.en,
    "find-yourself": FindYourself.en,
    hero: Hero.en,
    "how-it-works": HowItWorks.en,
    "meet-our-specialists": MeetOurSpecialists.en,
    page: Page.en,
    question: Question.en,
    "sos-center": SosCenter.en,
    "we-help": WeHelp.en,
    "more-articles": MoreArticles.en,
    articles: Articles.en,

    // Pages
    "how-it-works-page": HowItWorksPage.en,
    "not-found-page": NotFoundPage.en,
    "article-information": ArticleInformation.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
