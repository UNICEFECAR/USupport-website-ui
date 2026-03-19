import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Page,
  DownloadApp,
  Articles,
  Videos,
  Podcasts,
  InformationPortalHero,
} from "#blocks";
import { useDebounce, useCustomNavigate as useNavigate } from "#hooks";

import {
  ThemeContext,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import {
  Block,
  TabsUnderlined,
  Grid,
  GridItem,
} from "@USupport-components-library/src";

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
    (contentType) => contentType.isSelected,
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

  return (
    <Page
      classes={[
        "page__information-portal",
        theme === "dark" ? "page__information-portal--dark" : "",
      ].join(" ")}
      showBackground={true}
    >
      <InformationPortalHero
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={handleInputChange}
        placeholder={t("search")}
      />
      <Block classes="page__information-portal__tabs-block">
        <Grid classes="page__information-portal__tabs-container">
          <GridItem md={8} lg={12}>
            <div
              className={`page__information-portal__tabs-container__inner ${
                IS_RTL
                  ? "page__information-portal__tabs-container__inner--rtl"
                  : ""
              }`}
            >
              <TabsUnderlined
                options={contentTypes.map((x) => ({
                  ...x,
                  label: t(x.label),
                }))}
                handleSelect={handleContentTypeOnPress}
                textType={width < 768 ? "h3" : "h2"}
                classes="page__information-portal__tabs"
              />
            </div>
          </GridItem>
        </Grid>
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
      {/* {!IS_PS && <Question />} */}
      {!IS_PS && <DownloadApp />}
    </Page>
  );
};
