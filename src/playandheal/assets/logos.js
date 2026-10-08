import logoEn from "./logo.png";
import logoAr from "./logo-ar.png";

// Play and Heal logo per language - the Arabic logo carries the Arabic wordmark
const PH_LOGOS = { en: logoEn, ar: logoAr };

/**
 * Get the Play and Heal logo for a language, falling back to English
 *
 * @param {string} language - "en" | "ar"
 * @returns {string} image url
 */
export const getPhLogo = (language) => PH_LOGOS[language] || PH_LOGOS.en;
