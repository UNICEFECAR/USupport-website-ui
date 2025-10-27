import React, { useState, useEffect, useCallback, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  Tabs,
  Loading,
  VideoModal,
} from "@USupport-components-library/src";
import {
  destructureVideoData,
  useWindowDimensions,
  createArticleSlug,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useEventListener } from "#hooks";

import "./videos.scss";

const getGridSpanForIndex = (index, pattern = [2, 3, 1]) => {
  const totalItemsInCycle = pattern.reduce((sum, count) => sum + count, 0);
  const cyclePosition = index % totalItemsInCycle;

  let currentPosition = 0;
  for (let i = 0; i < pattern.length; i++) {
    const itemsInThisRow = pattern[i];
    const columnsPerItem = 12 / itemsInThisRow;

    if (cyclePosition < currentPosition + itemsInThisRow) {
      return columnsPerItem;
    }
    currentPosition += itemsInThisRow;
  }

  return 4;
};

export const Videos = ({ debouncedSearchValue }) => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "articles" });

  const isNotDescktop = width < 1366;
  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  const IS_PS = localStorage.getItem("country") === "PS";
  const IS_RTL = localStorage.getItem("language") === "ar";

  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [videos, setVideos] = useState([]);
  const [numberOfVideos, setNumberOfVideos] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [videoToPlayUrl, setVideoToPlayUrl] = useState(null);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  const getCategories = async () => {
    const res = await cmsSvc.getCategories(usersLanguage);
    let data = [{ label: t("all"), value: "all", isSelected: true }];
    res.data.forEach((category) =>
      data.push({
        label: category.attributes.name,
        value: category.attributes.name,
        id: category.id,
        isSelected: false,
      })
    );
    setSelectedCategory(data[0]);
    return data;
  };

  useQuery(["videos-categories", usersLanguage], getCategories, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => setCategories([...data]),
  });

  const handleCategoryOnPress = (index) => {
    const updated = categoriesToShow.map((c, i) => ({
      ...c,
      isSelected: i === index,
    }));
    setSelectedCategory(updated[index]);
    setCategories(updated);
  };

  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );
  const shouldFetchIds = !!(currentCountry && currentCountry !== "global");

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country !== currentCountry) setCurrentCountry(country);
  }, [currentCountry]);

  useEventListener("countryChanged", handler);

  const getVideosIds = async () => {
    const ids = await adminSvc.getVideos();
    return ids;
  };

  const videoIdsQuery = useQuery(
    ["videoIds", currentCountry, shouldFetchIds],
    getVideosIds,
    {
      enabled: true,
    }
  );

  const getVideosData = async () => {
    let categoryId =
      selectedCategory?.value !== "all" ? selectedCategory.id : "";

    let queryParams = {
      startFrom: 0,
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      locale: usersLanguage,
      populate: true,
      sortBy: "title",
      sortOrder: "asc",
    };

    if (shouldFetchIds) queryParams.ids = videoIdsQuery.data;
    else {
      queryParams.global = true;
      queryParams.isForAdmin = true;
    }

    const { data } = await cmsSvc.getVideos(queryParams);
    const videoData = data.data || [];
    setVideos([...videoData]);
    setNumberOfVideos(data.meta?.pagination?.total || videoData.length);
    return videoData;
  };

  const { isFetching: isVideosFetching } = useQuery(
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
          ? !videoIdsQuery.isLoading &&
            !!videoIdsQuery.data &&
            videoIdsQuery.data.length > 0
          : true) && !!selectedCategory,
    }
  );

  const getMoreVideos = async () => {
    let categoryId =
      selectedCategory?.value !== "all" ? selectedCategory.id : "";

    let queryParams = {
      startFrom: videos.length,
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) queryParams.ids = videoIdsQuery.data;
    else {
      queryParams.global = true;
      queryParams.isForAdmin = true;
    }

    const { data } = await cmsSvc.getVideos(queryParams);
    const newVideos = data.data || [];
    const currentVideosLength = videos.length + newVideos.length;
    setVideos((prev) => [...prev, ...newVideos]);

    if (currentVideosLength >= numberOfVideos) {
      setHasMore(false);
    }
  };

  const getNewestVideo = async () => {
    let queryParams = {
      limit: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) queryParams.ids = videoIdsQuery.data;
    else {
      queryParams.global = true;
      queryParams.isForAdmin = true;
    }

    const { data } = await cmsSvc.getVideos(queryParams);
    if (!data?.data?.[0]) return null;
    return destructureVideoData(data.data[0]);
  };

  const { data: videoCategoryIdsToShow } = useQuery(
    ["videos-category-ids", usersLanguage, videoIdsQuery.data, shouldFetchIds],
    () =>
      cmsSvc.getVideoCategoryIds(
        usersLanguage,
        shouldFetchIds ? videoIdsQuery.data : undefined
      ),
    {
      enabled: shouldFetchIds ? !!videoIdsQuery.data : true,
    }
  );

  const categoriesToShow = useMemo(() => {
    if (!categories || !videoCategoryIdsToShow) return [];

    return categories.filter(
      (category) =>
        videoCategoryIdsToShow.includes(category.id) || category.value === "all"
    );
  }, [categories, videoCategoryIdsToShow]);

  const { data: newestVideo, isFetching: isNewestVideoFetching } = useQuery(
    ["newestVideo", usersLanguage, currentCountry, shouldFetchIds],
    getNewestVideo,
    {
      enabled: IS_PS
        ? false
        : shouldFetchIds
        ? !videoIdsQuery.isLoading &&
          !!videoIdsQuery.data &&
          videoIdsQuery.data.length > 0
        : true,
      refetchOnWindowFocus: false,
    }
  );

  const handleRedirect = (id, name) => {
    navigate(
      `/${localStorage.getItem(
        "language"
      )}/information-portal/video/${id}/${createArticleSlug(name)}`
    );
  };

  const isLoading =
    isVideosFetching ||
    isNewestVideoFetching ||
    (shouldFetchIds && videoIdsQuery.isFetching);

  const hasNoData =
    !isLoading &&
    ((shouldFetchIds && !videoIdsQuery.data?.length) ||
      (!videos?.length && !newestVideo));

  const hasVideosDifferentThanNewest =
    selectedCategory?.value !== "all"
      ? true
      : (newestVideo || IS_PS) &&
        videos?.length > 0 &&
        (videos?.some((video) => video.id !== newestVideo?.id) || IS_PS);

  const showCategories =
    categories && categories.length > 1 && hasVideosDifferentThanNewest;

  const handlePlay = (url) => {
    setVideoToPlayUrl(url);
  };

  return (
    <React.Fragment>
      {videoToPlayUrl && (
        <VideoModal
          isOpen={!!videoToPlayUrl}
          onClose={() => setVideoToPlayUrl(null)}
          videoUrl={videoToPlayUrl}
          t={t}
        />
      )}
      <Block classes="videos">
        {hasNoData && (
          <div className="videos__no-results-container">
            <h3>{t("could_not_load_content")}</h3>
          </div>
        )}

        <Grid classes="videos__main-grid">
          <GridItem md={8} lg={12} classes="videos__heading-item">
            {false && <h2 className="videos__heading-text">{t("heading")}</h2>}
          </GridItem>

          {isLoading && (
            <GridItem md={8} lg={12} classes="videos__loading-item">
              <Loading size="lg" />
            </GridItem>
          )}

          {(isNewestVideoFetching || (newestVideo && !IS_PS)) && (
            <GridItem md={8} lg={12} classes="videos__most-important-item">
              {isNewestVideoFetching ? (
                <Loading />
              ) : (
                newestVideo && (
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
                    onClick={() =>
                      handleRedirect(newestVideo.id, newestVideo.title)
                    }
                    handlePlay={() => {
                      handlePlay(newestVideo.originalUrl || newestVideo.awsUrl);
                    }}
                  />
                )
              )}
            </GridItem>
          )}

          {showCategories && !IS_PS && (
            <GridItem md={8} lg={12} classes="videos__categories-item">
              {categories && (
                <div className="videos__categories-item__container">
                  <Tabs
                    options={categoriesToShow}
                    handleSelect={handleCategoryOnPress}
                    t={t}
                  />
                </div>
              )}
            </GridItem>
          )}

          {((shouldFetchIds &&
            videoIdsQuery.data?.length > 0 &&
            videos?.length > 0) ||
            !shouldFetchIds) &&
            hasVideosDifferentThanNewest && (
              <GridItem md={8} lg={12} classes="videos__videos-item">
                <div style={{ position: "relative" }}>
                  {/* Loading overlay for category changes */}
                  {isVideosFetching && videos?.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                      }}
                    >
                      <Loading size="lg" />
                    </div>
                  )}

                  <InfiniteScroll
                    dataLength={videos?.length || 0}
                    next={getMoreVideos}
                    hasMore={hasMore}
                    loader={<Loading size="lg" />}
                  >
                    <div className="videos__custom-grid">
                      {videos?.map((video, index) => {
                        const videoData = destructureVideoData(video);
                        const gridSpan = getGridSpanForIndex(index, [2, 3, 1]);
                        return (
                          <div
                            key={index}
                            className="videos__card-wrapper"
                            style={{ gridColumn: `span ${gridSpan}` }}
                          >
                            <CardMedia
                              type={
                                gridSpan === 12 && !isNotDescktop
                                  ? "landscape"
                                  : "portrait"
                              }
                              size={
                                gridSpan === 12 && !isNotDescktop ? "lg" : "sm"
                              }
                              title={videoData.title}
                              image={videoData.image}
                              description={videoData.description}
                              labels={videoData.labels}
                              likes={videoData.likes || 0}
                              dislikes={videoData.dislikes || 0}
                              t={t}
                              categoryName={videoData.categoryName}
                              contentType="videos"
                              onClick={() =>
                                handleRedirect(videoData.id, videoData.title)
                              }
                              handlePlay={() => {
                                handlePlay(
                                  videoData.originalUrl || videoData.awsUrl
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                </div>
              </GridItem>
            )}
        </Grid>
      </Block>
    </React.Fragment>
  );
};
