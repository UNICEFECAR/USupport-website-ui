import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";
import { PhIcon } from "../../components/PhIcon/PhIcon";
import { PhButton } from "../../components/PhButton/PhButton";
import { PhResourceCard } from "../../components/PhResourceCard/PhResourceCard";
import { usePhPath } from "../../hooks/usePhPath";
import { PH_COLLECTIONS } from "../../config";

import bookletArtwork from "../../assets/booklet-artwork.jpg";
import cardsArtwork from "../../assets/cards-artwork.jpg";
import heroArtwork from "../../assets/hero-artwork.jpg";

import "./ph-toolkit.scss";

const CATEGORY_ARTWORK = {
  booklet: { src: bookletArtwork, fit: "contain" },
  cards: { src: cardsArtwork, fit: "contain" },
  videos: { src: heroArtwork, fit: "cover" },
};

const normalize = (value = "") => value.toLocaleLowerCase().trim();

/**
 * PhToolkit
 *
 * "A little guidance. A lot to explore." - the three toolkit collections,
 * complementary resources and a search across all resources
 *
 * @param {Array} resources - every resource from usePhResources
 * @param {function} onOpenResource - opens a resource in its modal
 * @returns {JSX.Element}
 */
export const PhToolkit = ({ resources = [], onOpenResource }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "home.toolkit" });
  const toPath = usePhPath();
  const [search, setSearch] = useState("");

  const query = normalize(search);

  const results = useMemo(() => {
    if (!query) return [];
    return resources.filter((resource) =>
      normalize(
        `${resource.title} ${resource.description} ${resource.keywords}`
      ).includes(query)
    );
  }, [resources, query]);

  return (
    <section
      className="ph-toolkit"
      id="ph-toolkit"
      aria-labelledby="ph-toolkit-heading"
    >
      <div className="ph-toolkit__heading">
        <PhSectionIntro
          id="ph-toolkit-heading"
          eyebrow={t("eyebrow")}
          heading={t("heading")}
          description={t("text")}
        />
        <div className="ph-toolkit__search" role="search">
          <PhIcon name="search" size={20} />
          <label htmlFor="ph-toolkit-search" className="ph__visually-hidden">
            {t("search_label")}
          </label>
          <input
            id="ph-toolkit-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            autoComplete="off"
          />
          {search && (
            <button
              type="button"
              className="ph-toolkit__search-clear"
              onClick={() => setSearch("")}
              aria-label={t("search_clear")}
            >
              <PhIcon name="close" size={16} />
            </button>
          )}
        </div>
      </div>

      {query ? (
        <div className="ph-toolkit__results">
          <p className="ph-toolkit__results-count" role="status">
            {t("search_results", { count: results.length, query: search })}
          </p>
          {results.length > 0 && (
            <ul className="ph-toolkit__grid">
              {results.map((resource) => (
                <li key={`${resource.type}-${resource.id}`}>
                  <PhResourceCard
                    resource={resource}
                    onOpen={onOpenResource}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <ul className="ph-toolkit__grid">
            {Object.entries(PH_COLLECTIONS).map(([key, collection]) => (
              <li key={key}>
                <Link
                  to={toPath(`/toolkit/${collection.slug}`)}
                  className="ph-toolkit__category"
                >
                  <span
                    className={classNames(
                      "ph-toolkit__category-media",
                      `ph-toolkit__category-media--${collection.tone}`,
                      `ph-toolkit__category-media--${CATEGORY_ARTWORK[key].fit}`
                    )}
                  >
                    <img src={CATEGORY_ARTWORK[key].src} alt="" loading="lazy" />
                  </span>
                  <span className="ph-toolkit__category-content">
                    <span className="ph-toolkit__category-title">
                      {t(`${key}_title`)}
                    </span>
                    <span className="ph-toolkit__category-text">
                      {t(`${key}_text`)}
                    </span>
                    <span className="ph-toolkit__category-action">
                      <span>{t("explore_collection")}</span>
                      <PhIcon name="arrow" size={20} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="ph-toolkit__extras">
            <li className="ph-toolkit__extra ph-toolkit__extra--soft">
              <p className="ph-toolkit__extra-eyebrow">
                {t("complementary_eyebrow")}
              </p>
              <h3 className="ph-toolkit__extra-title">
                {t("complementary_title")}
              </h3>
              <p className="ph-toolkit__extra-text">
                {t("complementary_text")}
              </p>
              <p className="ph-toolkit__extra-status">
                {t("complementary_status")}
              </p>
            </li>
            <li className="ph-toolkit__extra ph-toolkit__extra--mint">
              <p className="ph-toolkit__extra-eyebrow">
                {t("caregivers_eyebrow")}
              </p>
              <h3 className="ph-toolkit__extra-title">
                {t("caregivers_title")}
              </h3>
              <p className="ph-toolkit__extra-text">{t("caregivers_text")}</p>
              <PhButton
                tone="outline"
                to={toPath("/caregivers")}
                fullWidth
                classes="ph-toolkit__extra-cta"
              >
                {t("caregivers_cta")}
              </PhButton>
            </li>
          </ul>
        </>
      )}
    </section>
  );
};
