import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Page, Articles, Videos, Podcasts } from "#blocks";

import {
  ThemeContext,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import { TabsUnderlined } from "@USupport-components-library/src";

import informationPortalMobile from "./assets/information-portal-mobile.png";
import informationPortalLight from "./assets/information-portal-light.jpg";
import informationPortalDark from "./assets/information-portal.png";

import "./information-portal.scss";

export const InformationPortal = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "articles" });
  const { theme, isPodcastsActive, isVideosActive } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const [contentTypes, setContentTypes] = useState([]);

  useEffect(() => {
    let selectedTab = tab || "articles";

    if (!isPodcastsActive && !isVideosActive && selectedTab !== "articles") {
      selectedTab = "articles";
      setSearchParams({ tab: "articles" });
    }

    const initialTabs = [
      {
        label: "articles",
        value: "articles",
        isSelected: selectedTab === "articles",
      },
    ];

    if (isVideosActive) {
      initialTabs.push({
        label: "videos",
        value: "videos",
        isSelected: selectedTab === "videos",
      });
    }

    if (isPodcastsActive) {
      initialTabs.push({
        label: "podcasts",
        value: "podcasts",
        isSelected: selectedTab === "podcasts",
      });
    }

    setContentTypes(initialTabs);
  }, [isPodcastsActive, isVideosActive, tab]);

  const selectedContentType = contentTypes.find(
    (contentType) => contentType.isSelected
  )?.value;

  const handleContentTypeOnPress = (index) => {
    const contentTypesCopy = [...contentTypes];
    for (let i = 0; i < contentTypesCopy.length; i++) {
      if (index === i) {
        contentTypesCopy[i].isSelected = true;
      } else {
        contentTypesCopy[i].isSelected = false;
      }
    }
    setContentTypes(contentTypesCopy);
    setSearchParams({ tab: contentTypesCopy[index].value });
  };

  return (
    <Page
      classes={[
        "page__information-portal",
        theme === "dark" ? "page__information-portal--dark" : "",
      ].join(" ")}
    >
      {width < 768 ? (
        <img
          src={informationPortalMobile}
          alt="Information Portal"
          className="information-portal-image information-portal-image--mobile"
        />
      ) : (
        <img
          src={
            theme === "dark" ? informationPortalDark : informationPortalLight
          }
          alt="Information Portal"
          className={`information-portal-image information-portal-image--desktop ${
            theme !== "dark" ? "information-portal-image--visible" : ""
          }`}
        />
      )}
      {contentTypes.length > 1 && (
        <TabsUnderlined
          options={contentTypes.map((x) => ({
            ...x,
            label: t(x.label),
          }))}
          handleSelect={handleContentTypeOnPress}
        />
      )}
      {selectedContentType === "articles" && <Articles />}
      {selectedContentType === "videos" && <Videos />}
      {selectedContentType === "podcasts" && <Podcasts />}
    </Page>
  );
};
