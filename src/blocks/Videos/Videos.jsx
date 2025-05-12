import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  InputSearch,
  Tabs,
  Loading,
} from "@USupport-components-library/src";
import {
  destructureVideoData,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useDebounce, useEventListener } from "#hooks";
import { ThemeContext } from "@USupport-components-library/utils";

import "./videos.scss";

/**
 * Videos
 *
 * Information portal videos
 *
 * @return {jsx}
 */
export const Videos = () => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { i18n, t } = useTranslation("articles");
  const { theme } = useContext(ThemeContext);

  const isNotDescktop = width < 1366;
  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Categories ----------------------//
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const getCategories = async () => {
    try {
      const res = await cmsSvc.getCategories(usersLanguage);
      let categoriesData = [
        { label: t("all"), value: "all", isSelected: true },
      ];
      res.data.map((category) =>
        categoriesData.push({
          label: category.attributes.name,
          value: category.attributes.name,
          id: category.id,
          isSelected: false,
        })
      );

      setSelectedCategory(categoriesData[0]);
      return categoriesData;
    } catch (err) {
      console.log(err, "Error when calling getCategories");
      return [];
    }
  };

  const categoriesQuery = useQuery(
    ["videos-categories", usersLanguage],
    getCategories,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCategories([...data]);
      },
    }
  );

  const handleCategoryOnPress = (index) => {
    const categoriesCopy = [...categories];

    for (let i = 0; i < categoriesCopy.length; i++) {
      if (i === index) {
        categoriesCopy[i].isSelected = true;
        setSelectedCategory(categoriesCopy[i]);
      } else {
        categoriesCopy[i].isSelected = false;
      }
    }
    setCategories(categoriesCopy);
  };

  //--------------------- Search Input ----------------------//
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const shouldFetchIds = !!(currentCountry && currentCountry !== "global");

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country !== currentCountry) {
      setCurrentCountry(country);
    }
  }, [currentCountry]);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Videos ----------------------//

  const getVideosIds = async () => {
    // Request videos ids from the master DB
    const videosIds = await adminSvc.getVideos();
    return videosIds;
  };

  const videoIdsQuery = useQuery(
    ["videoIds", currentCountry, shouldFetchIds],
    getVideosIds,
    {
      enabled: true,
    }
  );

  const getVideosData = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let queryParams = {
      limit: 12, // Load more items at once since we're not using infinite scroll
      contains: debouncedSearchValue,
      categoryId,
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = videoIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    const { data } = await cmsSvc.getVideos(queryParams);
    return data.data || [];
  };

  const {
    data: videos,
    isLoading: isVideosLoading,
    isFetching: isVideosFetching,
  } = useQuery(
    [
      "videos",
      debouncedSearchValue,
      selectedCategory,
      videoIdsQuery.data,
      usersLanguage,
      shouldFetchIds,
    ],
    getVideosData,
    {
      enabled:
        (shouldFetchIds
          ? !videoIdsQuery.isLoading && !!videoIdsQuery.data
          : true) && !!selectedCategory,
    }
  );

  //--------------------- Newest Video ----------------------//
  const getNewestVideo = async () => {
    let queryParams = {
      limit: 1, // Only get the newest video
      sortBy: "createdAt", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = videoIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    let { data } = await cmsSvc.getVideos(queryParams);

    if (!data.data || !data.data[0]) return null;
    return destructureVideoData(data.data[0]);
    // Assuming videos data structure is similar to articles
    // const newestVideoData = destructureArticleData(data.data[0]);
    // return newestVideoData;
  };

  const { data: newestVideo, isLoading: isNewestVideoLoading } = useQuery(
    ["newestVideo", usersLanguage, currentCountry, shouldFetchIds],
    getNewestVideo,
    {
      enabled: shouldFetchIds
        ? !videoIdsQuery.isLoading && !!videoIdsQuery.data
        : true,
      refetchOnWindowFocus: false,
    }
  );

  const handleRedirect = (id) => {
    navigate(
      `/${localStorage.getItem("language")}/information-portal/video/${id}`
    );
  };

  // Simplified loading state
  const isLoading =
    isVideosLoading ||
    isVideosFetching ||
    isNewestVideoLoading ||
    (shouldFetchIds && videoIdsQuery.isLoading);

  // Simplified empty state detection
  const hasNoData =
    !isLoading &&
    ((shouldFetchIds && !videoIdsQuery.data?.length) ||
      (!videos?.length && !newestVideo));

  return (
    <Block classes="videos">
      {hasNoData && (
        <div className="videos__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
        </div>
      )}

      <Grid classes="videos__main-grid">
        <GridItem md={8} lg={12} classes="videos__heading-item">
          {theme === "dark" && (
            <h2 className="videos__heading-text">{t("heading")}</h2>
          )}
        </GridItem>

        {isNewestVideoLoading ? (
          <GridItem md={8} lg={12} classes="videos__most-important-item">
            <Loading />
          </GridItem>
        ) : (
          newestVideo && (
            <GridItem md={8} lg={12} classes="videos__most-important-item">
              <CardMedia
                type={isNotDescktop ? "portrait" : "landscape"}
                size="lg"
                title={newestVideo.title}
                image={newestVideo.image}
                description={newestVideo.description}
                labels={newestVideo.labels}
                creator={newestVideo.creator}
                categoryName={newestVideo.categoryName}
                contentType="videos"
                showDescription={true}
                likes={newestVideo.likes}
                dislikes={newestVideo.dislikes}
                t={t}
                onClick={() => handleRedirect(newestVideo.id)}
              />
            </GridItem>
          )
        )}

        <GridItem md={8} lg={12} classes="videos__search-item">
          <InputSearch onChange={handleInputChange} value={searchValue} />
        </GridItem>

        {categories && (
          <GridItem md={8} lg={12} classes="videos__categories-item">
            <Tabs
              options={categories}
              handleSelect={handleCategoryOnPress}
              t={t}
            />
          </GridItem>
        )}

        <GridItem md={8} lg={12} classes="videos__videos-item">
          {videoIdsQuery.isLoading || isVideosLoading ? (
            <Loading />
          ) : videos?.length > 0 ? (
            <Grid>
              {videos.map((video, index) => {
                const videoData = destructureVideoData(video);
                return (
                  <GridItem key={index}>
                    <CardMedia
                      type="portrait"
                      size="sm"
                      style={{ gridColumn: "span 4" }}
                      title={videoData.title}
                      image={videoData.image}
                      description={videoData.description}
                      labels={videoData.labels}
                      likes={videoData.likes || 0}
                      dislikes={videoData.dislikes || 0}
                      t={t}
                      categoryName={videoData.categoryName}
                      contentType="videos"
                      onClick={() => handleRedirect(videoData.id)}
                    />
                  </GridItem>
                );
              })}
            </Grid>
          ) : (
            <div className="videos__no-results-container">
              <p>{t("no_results")}</p>
            </div>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
