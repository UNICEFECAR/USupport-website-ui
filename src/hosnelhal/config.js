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

// Cards shown for each category on the resources overview
export const HOSN_CATEGORY_PREVIEW = 4;

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
