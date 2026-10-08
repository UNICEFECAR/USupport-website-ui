// Hosn El Hal configuration

export const HOSN_PROGRAM = "hosnelhal";

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

// Hosn El Hal is not wrapped in the uSupport theme (its global p / heading
// colours would override the HH styles). uSupport components it still uses
// (cookie banner, legal Markdown) get this class around them instead.
export const USUPPORT_THEME_CLASS = "theme-light";

// Domains serving Hosn El Hal, comma separated, e.g. "hosnelhal.org,staging.hosnelhal.org"
const HOSN_HOSTNAMES = (import.meta.env.VITE_HOSN_HOSTNAMES || "")
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);

const PREVIEW_STORAGE_KEY = "program";

/**
 * Whether the website should render Hosn El Hal. On its own domain it always
 * does; anywhere else (local, staging) `?program=hosnelhal` turns it on for
 * this browser and `?program=` turns it off again.
 *
 * @returns {boolean}
 */
export const isHosnElHal = () => {
  if (typeof window === "undefined") return false;
  if (HOSN_HOSTNAMES.includes(window.location.hostname)) return true;

  try {
    const preview = new URLSearchParams(window.location.search).get("program");
    if (preview === HOSN_PROGRAM) {
      localStorage.setItem(PREVIEW_STORAGE_KEY, HOSN_PROGRAM);
    } else if (preview !== null) {
      localStorage.removeItem(PREVIEW_STORAGE_KEY);
    }
    return localStorage.getItem(PREVIEW_STORAGE_KEY) === HOSN_PROGRAM;
  } catch {
    return false;
  }
};
