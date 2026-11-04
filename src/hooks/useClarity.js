import { useEffect } from "react";

import { syncClarityConsent } from "#services/clarity";

/**
 * Syncs Microsoft Clarity consent from the website cookie choice.
 * Clarity always loads (cookieless without accept; full tracking with accept).
 * Waits until the saved choice has been read, so a returning visitor who
 * already accepted is not treated as a rejection on the first render.
 *
 * @param {boolean} hasAcceptedCookies
 * @param {boolean} isReady - true after localStorage has been read
 */
export const useClarity = (hasAcceptedCookies, isReady) => {
  useEffect(() => {
    if (!isReady) return;
    syncClarityConsent(hasAcceptedCookies);
  }, [hasAcceptedCookies, isReady]);
};

export default useClarity;
