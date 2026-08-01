import React from "react";
import { useParams, Navigate } from "react-router-dom";

import "./reports.scss";

import reportsHtml from "../../static/index.html?raw";

const reportsStylesUrl = new URL("../../static/styles.css", import.meta.url)
  .href;
const reportsScriptUrl = new URL("../../static/app.js", import.meta.url).href;
const reportsSrcDoc = reportsHtml
  .replace("./styles.css", reportsStylesUrl)
  .replace("./app.js", reportsScriptUrl);

/**
 * Reports
 *
 * Reports page that loads static report content in an iframe.
 *
 * @returns {JSX.Element}
 */
export const Reports = () => {
  const { language = "en" } = useParams();

  const isPolandDomain = window.location.hostname.includes("poland");
  if (!isPolandDomain) {
    return <Navigate to={`/${language}`} />;
  }

  return (
    <div className="reports-page__iframe-container">
      <iframe
        className="reports-page__iframe"
        title="Reports"
        srcDoc={reportsSrcDoc}
      />
    </div>
  );
};
