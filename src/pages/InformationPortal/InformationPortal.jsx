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
import { useDebounce, useCustomNavigate as useNavigate } from "#hooks";

import {
  ThemeContext,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import {
  Block,
  InputSearch,
  TabsUnderlined,
} from "@USupport-components-library/src";

import informationPortalMobile from "./assets/information-portal-mobile.png";
// import informationPortalLight from "./assets/information-portal-light.jpg";
import informationPortalDark from "./assets/information-portal.png";
import informationPortalPs from "./assets/information-portal-ps.png";
import informationPortalPsDark from "./assets/information-portal-ps-dark.png";
import informationPortalPsMobile from "./assets/information-portal-ps-mobile.png";
import informationPortalPsMobileDark from "./assets/information-portal-ps-mobile-dark.png";

import "./information-portal.scss";

export const InformationPortal = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "articles" });
  const { theme, isPodcastsActive, isVideosActive } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const tab = searchParams.get("tab");
  const IS_PS = localStorage.getItem("country") === "PS";
  const IS_RTL = localStorage.getItem("language") === "ar";

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
    const newTab = contentTypesCopy[index].value;
    navigate(`/information-portal?tab=${newTab}`);
  };

  const isDark = theme === "dark";
  const informationPortalMobileImage = IS_PS
    ? isDark
      ? informationPortalPsMobileDark
      : informationPortalPsMobile
    : informationPortalMobile;
  const informationPortalImage = IS_PS
    ? isDark
      ? informationPortalPsDark
      : informationPortalPs
    : informationPortalDark;

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
            src={informationPortalMobileImage}
            alt="Information Portal"
            className="information-portal-image information-portal-image--mobile"
          />
          <InputSearch
            onChange={handleInputChange}
            value={searchValue}
            classes={`page__information-portal__img-container__input ${
              IS_RTL
                ? "page__information-portal__img-container__input--rtl"
                : ""
            }`}
            placeholder={t("search")}
          />
        </div>
      ) : (
        <div className="page__information-portal__img-container">
          <img
            // src={
            //   theme === "dark" ? informationPortalDark : informationPortalLight
            // }
            src={informationPortalImage}
            alt="Information Portal"
            className={`information-portal-image information-portal-image--desktop ${
              theme !== "dark" ? "information-portal-image--visible" : ""
            }`}
          />
          <InputSearch
            onChange={handleInputChange}
            value={searchValue}
            classes={`page__information-portal__img-container__input ${
              IS_RTL
                ? "page__information-portal__img-container__input--rtl"
                : ""
            }`}
            placeholder={t("search")}
          />
        </div>
      )}
      <Block>
        <div
          className={`page__information-portal__tabs-container ${
            IS_RTL ? "page__information-portal__tabs-container--rtl" : ""
          }`}
        >
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
      {!IS_PS && <Question />}
      {!IS_PS && <DownloadApp />}
    </Page>
  );
};
