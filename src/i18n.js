import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  About,
  Hero,
  WeHelp,
  FindYourself,
  DownloadApp,
  HowItWorks,
  MeetOurProviders,
  Page,
  Question,
  SosCenter,
  ContactUs,
  Faq,
  Articles,
  PrivacyPolicy,
  CookiePolicy,
  TermsOfUse,
  InformationPortal,
  ProviderOverview,
} from "#blocks/locales.js";

import {
  NotFoundPage,
  ArticleInformation,
  ProviderOverview as ProviderOverviewPage,
} from "#pages/locales.js";

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
    "meet-our-providers": MeetOurProviders.en,
    page: Page.en,
    question: Question.en,
    "sos-center": SosCenter.en,
    "we-help": WeHelp.en,
    articles: Articles.en,
    "privacy-policy": PrivacyPolicy.en,
    "cookie-policy": CookiePolicy.en,
    "terms-of-use": TermsOfUse.en,
    "information-portal": InformationPortal.en,
    "provider-overview": ProviderOverview.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "article-information": ArticleInformation.en,
    "provider-overview-page": ProviderOverviewPage.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
