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
  MeetOurProvidersOverview,
  OurPartners,
  OurPartnersOverview,
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
    "meet-our-providers-overview": MeetOurProvidersOverview.en,
    "our-partners": OurPartners.en,
    "our-partners-overview": OurPartnersOverview.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "article-information": ArticleInformation.en,
    "provider-overview-page": ProviderOverviewPage.en,
  },
  kk: {
    // Blocks
    about: About.kk,
    "contact-us": ContactUs.kk,
    "download-app": DownloadApp.kk,
    faq: Faq.kk,
    "find-yourself": FindYourself.kk,
    hero: Hero.kk,
    "how-it-works": HowItWorks.kk,
    "meet-our-providers": MeetOurProviders.kk,
    page: Page.kk,
    question: Question.kk,
    "sos-center": SosCenter.kk,
    "we-help": WeHelp.kk,
    articles: Articles.kk,
    "privacy-policy": PrivacyPolicy.kk,
    "cookie-policy": CookiePolicy.kk,
    "terms-of-use": TermsOfUse.kk,
    "information-portal": InformationPortal.kk,
    "provider-overview": ProviderOverview.kk,
    "meet-our-providers-overview": MeetOurProvidersOverview.kk,
    "our-partners": OurPartners.kk,
    "our-partners-overview": OurPartnersOverview.kk,

    // Pages
    "not-found-page": NotFoundPage.kk,
    "article-information": ArticleInformation.kk,
    "provider-overview-page": ProviderOverviewPage.kk,
  },
  ru: {
    // Blocks
    about: About.ru,
    "contact-us": ContactUs.ru,
    "download-app": DownloadApp.ru,
    faq: Faq.ru,
    "find-yourself": FindYourself.ru,
    hero: Hero.ru,
    "how-it-works": HowItWorks.ru,
    "meet-our-providers": MeetOurProviders.ru,
    page: Page.ru,
    question: Question.ru,
    "sos-center": SosCenter.ru,
    "we-help": WeHelp.ru,
    articles: Articles.ru,
    "privacy-policy": PrivacyPolicy.ru,
    "cookie-policy": CookiePolicy.ru,
    "terms-of-use": TermsOfUse.ru,
    "information-portal": InformationPortal.ru,
    "provider-overview": ProviderOverview.ru,
    "meet-our-providers-overview": MeetOurProvidersOverview.ru,
    "our-partners": OurPartners.ru,
    "our-partners-overview": OurPartnersOverview.ru,

    // Pages
    "not-found-page": NotFoundPage.ru,
    "article-information": ArticleInformation.ru,
    "provider-overview-page": ProviderOverviewPage.ru,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
