import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { PhIcon } from "../PhIcon/PhIcon";

import "./ph-resource-card.scss";

/**
 * PhResourceCard
 *
 * Card for a single PDF or video in a collection. Opens the resource on click.
 *
 * @param {object} resource - resource from usePhResources
 * @param {function} onOpen - called with the resource
 * @returns {JSX.Element}
 */
export const PhResourceCard = ({ resource, onOpen }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "collection" });
  const isVideo = resource.type === "video";

  return (
    <button
      type="button"
      className={classNames(
        "ph-resource-card",
        isVideo ? "ph-resource-card--video" : "ph-resource-card--document"
      )}
      onClick={() => onOpen(resource)}
    >
      <span className="ph-resource-card__media">
        {resource.image ? (
          <img src={resource.image} alt="" loading="lazy" />
        ) : (
          <PhIcon name={isVideo ? "play" : "book"} size={48} />
        )}
        {isVideo && (
          <span className="ph-resource-card__play" aria-hidden="true">
            <PhIcon name="play" size={24} />
          </span>
        )}
      </span>
      <span className="ph-resource-card__content">
        <span className="ph-resource-card__title">{resource.title}</span>
        <span className="ph__visually-hidden">
          {isVideo ? t("watch_video") : t("open_document")}
        </span>
      </span>
    </button>
  );
};
