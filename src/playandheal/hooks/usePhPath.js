import { useParams } from "react-router-dom";

/**
 * usePhPath
 *
 * Returns a function that prefixes a Play and Heal route with the current language
 *
 * @returns {function(string): string}
 */
export const usePhPath = () => {
  const { language } = useParams();
  const lang = language || localStorage.getItem("language") || "en";

  return (path = "") => `/${lang}${path}`;
};
