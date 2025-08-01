import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Question,
  Page,
  DownloadApp,
  Articles,
  Videos,
  Podcasts,
} from "#blocks";

import {
  ThemeContext,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import { useDebounce } from "#hooks";
import {
  Block,
  InputSearch,
  TabsUnderlined,
} from "@USupport-components-library/src";

import informationPortalMobile from "./assets/information-portal-mobile.png";
// import informationPortalLight from "./assets/information-portal-light.jpg";
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

  //--------------------- Search Input ----------------------//
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

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
        <div className="page__information-portal__img-container">
          <img
            src={informationPortalMobile}
            alt="Information Portal"
            className="information-portal-image information-portal-image--mobile"
          />
          <InputSearch
            onChange={handleInputChange}
            value={searchValue}
            classes="page__information-portal__img-container__input"
            placeholder={t("search")}
          />
        </div>
      ) : (
        <div className="page__information-portal__img-container">
          <img
            // src={
            //   theme === "dark" ? informationPortalDark : informationPortalLight
            // }
            src={informationPortalDark}
            alt="Information Portal"
            className={`information-portal-image information-portal-image--desktop ${
              theme !== "dark" ? "information-portal-image--visible" : ""
            }`}
          />
          <InputSearch
            onChange={handleInputChange}
            value={searchValue}
            classes="page__information-portal__img-container__input"
            placeholder={t("search")}
          />
        </div>
      )}
      <Block>
        <div className="page__information-portal__tabs-container">
          <TabsUnderlined
            options={contentTypes.map((x) => ({
              ...x,
              label: t(x.label),
            }))}
            handleSelect={handleContentTypeOnPress}
            textType="h3"
          />
        </div>
      </Block>
      {selectedContentType === "articles" && (
        <Articles debouncedSearchValue={debouncedSearchValue} />
      )}
      {selectedContentType === "videos" && (
        <Videos debouncedSearchValue={debouncedSearchValue} />
      )}
      {selectedContentType === "podcasts" && (
        <Podcasts debounceSearchValue={debouncedSearchValue} />
      )}
      <Question />
      <DownloadApp />
    </Page>
  );
};
