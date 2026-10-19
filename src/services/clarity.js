const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;
const SCRIPT_ID = "usupport-clarity";

// Cookies Clarity sets on the site. Removed when consent is withdrawn.
const CLARITY_COOKIE_NAMES = [
  "_clck",
  "_clsk",
  "CLID",
  "MUID",
  "ANONCHK",
  "MR",
  "SM",
];
const CLARITY_STORAGE_KEY = "_cltk";

/**
 * Clarity runs for staging or production builds with a configured project id.
 * Localhost stays disabled. Leave the env var unset to disable an environment.
 */
const isClarityEnabled = () => {
  if (!CLARITY_PROJECT_ID) return false;
  if (!["staging", "production"].includes(import.meta.env.MODE)) return false;
  if (typeof window === "undefined") return false;

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return false;
  return true;
};

const installClarity = () => {
  if (document.getElementById(SCRIPT_ID)) return;

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    // Queue consent before the tag loads so Clarity does not start without it.
    c[a]("consentv2", {
      ad_Storage: "granted",
      analytics_Storage: "granted",
    });
    t = l.createElement(r);
    t.async = 1;
    t.id = SCRIPT_ID;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
};

const setConsent = (granted) => {
  window.clarity("consentv2", {
    ad_Storage: granted ? "granted" : "denied",
    analytics_Storage: granted ? "granted" : "denied",
  });
};

const clearClarityCookies = () => {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  const parts = host.split(".").filter(Boolean);
  const domains = [host, `.${host}`];
  if (parts.length >= 2) {
    domains.push(`.${parts.slice(-2).join(".")}`);
  }

  CLARITY_COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=; expires=${expires}; path=/`;
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=${expires}; path=/; domain=${domain}`;
    });
  });

  localStorage.removeItem(CLARITY_STORAGE_KEY);
};

/**
 * Load Clarity after Accept all, or stop it and drop its cookies after Reject all.
 * The script is not added until consent is given.
 *
 * @param {boolean} hasAcceptedCookies
 */
export const syncClarityConsent = (hasAcceptedCookies) => {
  if (!isClarityEnabled()) return;

  if (hasAcceptedCookies) {
    if (document.getElementById(SCRIPT_ID)) {
      setConsent(true);
      return;
    }
    installClarity();
    return;
  }

  if (typeof window.clarity === "function") {
    setConsent(false);
  }
  clearClarityCookies();
};
