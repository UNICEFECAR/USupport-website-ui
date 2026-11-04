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

/**
 * Inject Clarity and queue the consent signal before the tag runs.
 * Without analytics consent Clarity stays in cookieless mode (heatmaps /
 * fragmented page recordings). With consent it sets cookies and full sessions.
 *
 * @param {boolean} hasAcceptedCookies
 */
const installClarity = (hasAcceptedCookies) => {
  if (document.getElementById(SCRIPT_ID)) return;

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    // Queue consent before the tag loads so cookies are never set without it.
    const storage = hasAcceptedCookies ? "granted" : "denied";
    c[a]("consentv2", {
      ad_Storage: storage,
      analytics_Storage: storage,
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
 * Keep Clarity loaded on staging/production. Accept all → full cookie tracking;
 * reject / no choice yet → cookieless mode only (no _clck/_clsk, fragmented sessions).
 *
 * @param {boolean} hasAcceptedCookies
 */
export const syncClarityConsent = (hasAcceptedCookies) => {
  if (!isClarityEnabled()) return;

  if (!document.getElementById(SCRIPT_ID)) {
    installClarity(hasAcceptedCookies);
  } else if (typeof window.clarity === "function") {
    setConsent(hasAcceptedCookies);
  }

  if (!hasAcceptedCookies) {
    clearClarityCookies();
  }
};
