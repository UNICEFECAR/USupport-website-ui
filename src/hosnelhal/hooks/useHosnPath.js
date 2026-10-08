import { useParams } from "react-router-dom";

/**
 * @returns {function} (path) => "/<language>/<path>"
 */
export const useHosnPath = () => {
  const { language = "en" } = useParams();
  return (path = "") => `/${language}${path ? `/${path}` : ""}`;
};
