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
  MyQALanding,
  MascotHeaderMyQA,
  MyQA,
  CouponInformation,
} from "#blocks/locales.js";

import {
  NotFoundPage,
  ArticleInformation,
  ProviderOverview as ProviderOverviewPage,
  MyQA as MyQAPage,
} from "#pages/locales.js";

import {
  QuestionDetails,
  HowItWorksMyQA,
  FilterQuestions,
} from "#modals/locales.js";

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
    "my-qa-landing": MyQALanding.en,
    "mascot-header-MyQA": MascotHeaderMyQA.en,
    "my-qa": MyQA.en,
    "coupon-information": CouponInformation.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "article-information": ArticleInformation.en,
    "provider-overview-page": ProviderOverviewPage.en,
    "my-qa-page": MyQAPage.en,

    //Modals
    "question-details": QuestionDetails.en,
    "how-it-works-my-qa": HowItWorksMyQA.en,
    "filter-questions": FilterQuestions.en,
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
    "my-qa-landing": MyQALanding.kk,
    "mascot-header-MyQA": MascotHeaderMyQA.kk,
    "my-qa": MyQA.kk,
    "coupon-information": CouponInformation.kk,

    // Pages
    "not-found-page": NotFoundPage.kk,
    "article-information": ArticleInformation.kk,
    "provider-overview-page": ProviderOverviewPage.kk,
    "my-qa-page": MyQAPage.kk,

    //Modals
    "question-details": QuestionDetails.kk,
    "how-it-works-my-qa": HowItWorksMyQA.kk,
    "filter-questions": FilterQuestions.kk,
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
    "my-qa-landing": MyQALanding.ru,
    "mascot-header-MyQA": MascotHeaderMyQA.ru,
    "my-qa": MyQA.ru,
    "coupon-information": CouponInformation.ru,

    // Pages
    "not-found-page": NotFoundPage.ru,
    "article-information": ArticleInformation.ru,
    "provider-overview-page": ProviderOverviewPage.ru,
    "my-qa-page": MyQAPage.ru,

    //Modals
    "question-details": QuestionDetails.ru,
    "how-it-works-my-qa": HowItWorksMyQA.ru,
    "filter-questions": FilterQuestions.ru,
  },
  pl: {
    // Blocks
    about: About.pl,
    "contact-us": ContactUs.pl,
    "download-app": DownloadApp.pl,
    faq: Faq.pl,
    "find-yourself": FindYourself.pl,
    hero: Hero.pl,
    "how-it-works": HowItWorks.pl,
    "meet-our-providers": MeetOurProviders.pl,
    page: Page.pl,
    question: Question.pl,
    "sos-center": SosCenter.pl,
    "we-help": WeHelp.pl,
    articles: Articles.pl,
    "privacy-policy": PrivacyPolicy.pl,
    "cookie-policy": CookiePolicy.pl,
    "terms-of-use": TermsOfUse.pl,
    "information-portal": InformationPortal.pl,
    "provider-overview": ProviderOverview.pl,
    "meet-our-providers-overview": MeetOurProvidersOverview.pl,
    "our-partners": OurPartners.pl,
    "our-partners-overview": OurPartnersOverview.pl,
    "my-qa-landing": MyQALanding.pl,
    "mascot-header-MyQA": MascotHeaderMyQA.pl,
    "my-qa": MyQA.pl,
    "coupon-information": CouponInformation.pl,

    // Pages
    "not-found-page": NotFoundPage.pl,
    "article-information": ArticleInformation.pl,
    "provider-overview-page": ProviderOverviewPage.pl,
    "my-qa-page": MyQAPage.pl,

    //Modals
    "question-details": QuestionDetails.pl,
    "how-it-works-my-qa": HowItWorksMyQA.pl,
    "filter-questions": FilterQuestions.pl,
  },
  uk: {
    // Blocks
    about: About.uk,
    "contact-us": ContactUs.uk,
    "download-app": DownloadApp.uk,
    faq: Faq.uk,
    "find-yourself": FindYourself.uk,
    hero: Hero.uk,
    "how-it-works": HowItWorks.uk,
    "meet-our-providers": MeetOurProviders.uk,
    page: Page.uk,
    question: Question.uk,
    "sos-center": SosCenter.uk,
    "we-help": WeHelp.uk,
    articles: Articles.uk,
    "privacy-policy": PrivacyPolicy.uk,
    "cookie-policy": CookiePolicy.uk,
    "terms-of-use": TermsOfUse.uk,
    "information-portal": InformationPortal.uk,
    "provider-overview": ProviderOverview.uk,
    "meet-our-providers-overview": MeetOurProvidersOverview.uk,
    "our-partners": OurPartners.uk,
    "our-partners-overview": OurPartnersOverview.uk,
    "my-qa-landing": MyQALanding.uk,
    "mascot-header-MyQA": MascotHeaderMyQA.uk,
    "my-qa": MyQA.uk,
    "coupon-information": CouponInformation.uk,

    // Pages
    "not-found-page": NotFoundPage.uk,
    "article-information": ArticleInformation.uk,
    "provider-overview-page": ProviderOverviewPage.uk,
    "my-qa-page": MyQAPage.uk,

    //Modals
    "question-details": QuestionDetails.uk,
    "how-it-works-my-qa": HowItWorksMyQA.uk,
    "filter-questions": FilterQuestions.uk,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
