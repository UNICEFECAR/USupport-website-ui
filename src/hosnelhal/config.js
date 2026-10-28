// Hosn El Hal configuration

export const HOSN_PROGRAM = "hosnelhal";

// Pseudo-country for visit / engagement events (see masterDB country XH)
export const HOSN_COUNTRY = "XH";

export const HOSN_LANGUAGES = [
  { value: "en", label: "EN", name: "English", dir: "ltr" },
  { value: "ar", label: "العربية", name: "العربية", dir: "rtl" },
];

export const HOSN_RTL_LANGUAGES = ["ar"];

// Formats in the order they are offered in the format filter
export const HOSN_FORMATS = ["video", "audio", "worksheet", "thumbnail"];

// Length filter, in minutes (min inclusive, max exclusive)
export const HOSN_LENGTHS = {
  short: { maxDuration: 5 },
  medium: { minDuration: 5, maxDuration: 15 },
  long: { minDuration: 15 },
};

export const HOSN_FEATURED_COUNT = 4;

// Home page selections chosen by UNICEF, as Strapi ids per locale (the
// localizations of an asset have different ids). Shown in this order.
export const HOSN_HOME_FEATURED = {
  en: [1, 76, 31, 65],
  ar: [2, 80, 32, 66],
};

// "How are you feeling today?" cards and the resources each one opens
export const HOSN_HOME_FEELINGS = [
  { key: "calm", ids: { en: [79, 21, 82, 3], ar: [87, 22, 88, 4] } },
  { key: "energy", ids: { en: [29, 57, 7, 41], ar: [30, 58, 11, 42] } },
  { key: "reconnect", ids: { en: [74, 53, 25, 39], ar: [78, 54, 26, 40] } },
  {
    key: "supported",
    ids: { en: [61, 59, 86, 71], ar: [62, 60, 91, 72] },
    showSupportLink: true,
  },
];

// Cards shown for each category on the resources overview
export const HOSN_CATEGORY_PREVIEW = 4;

// About page partners, in the order of the credits. Shown as names until
// UNICEF sends the logos - then set `logo` to the imported image.
export const HOSN_PARTNERS = [
  { key: "unicef", logo: null },
  { key: "nrc", logo: null },
  { key: "save_the_children", logo: null },
  { key: "unrwa", logo: null },
  { key: "war_child", logo: null },
];

export const HOSN_CONTACT_EMAILS = ["jcunningham@unicef.org", "rmaktabi@unicef.org"];

// Feedback card, opened from the footer button or the sticky tab. The survey
// links come from UNICEF (one per language); without one the card just says
// thank you after the vote.
export const HOSN_FEEDBACK = {
  surveyUrls: { en: "", ar: "" },
};

// Full library. The overview at /resources links here with ?topic= preselected.
export const HOSN_LIBRARY_PATH = "resources/all";

// Hosn El Hal is not wrapped in the uSupport theme (its global p / heading
// colours would override the HH styles). uSupport components it still uses
// (legal Markdown) get this class around them instead.
export const USUPPORT_THEME_CLASS = "theme-light";

/**
 * Whether the website should render Hosn El Hal. Decided before the first
 * paint by the inline script in index.html (by domain, or `?program=hosnelhal`
 * on any other host), which marks the page with data-program.
 *
 * @returns {boolean}
 */
export const isHosnElHal = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.program === HOSN_PROGRAM;
