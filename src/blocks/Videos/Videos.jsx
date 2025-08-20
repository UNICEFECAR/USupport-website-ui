import { useState, useEffect, useCallback, useContext } from "react";
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
  ThemeContext,
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
  const { theme } = useContext(ThemeContext);

  const isNotDescktop = width < 1366;
  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

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
    const updated = categories.map((c, i) => ({
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

  const { isLoading: isVideosLoading, isFetching: isVideosFetching } = useQuery(
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
    setVideos((prev) => [...prev, ...newVideos]);

    if (videos.length + newVideos.length >= numberOfVideos) {
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

  const handleRedirect = (id, name) => {
    navigate(
      `/${localStorage.getItem(
        "language"
      )}/information-portal/video/${id}/${createArticleSlug(name)}`
    );
  };

  const isLoading =
    isVideosLoading ||
    isVideosFetching ||
    isNewestVideoLoading ||
    (shouldFetchIds && videoIdsQuery.isLoading);

  const hasNoData =
    !isLoading &&
    ((shouldFetchIds && !videoIdsQuery.data?.length) ||
      (!videos?.length && !newestVideo));

  const handlePlay = (url) => {
    setVideoToPlayUrl(url);
  };

  return (
    <>
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
            {theme === "dark" && (
              <h2 className="videos__heading-text">{t("heading")}</h2>
            )}
          </GridItem>

          {(isNewestVideoLoading || newestVideo) && (
            <GridItem md={8} lg={12} classes="videos__most-important-item">
              {isNewestVideoLoading ? (
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
                      handlePlay(newestVideo.originalUrl);
                    }}
                  />
                )
              )}
            </GridItem>
          )}

          {videos?.length > 0 && (
            <GridItem md={8} lg={12} classes="videos__categories-item">
              {categories && (
                <div className="videos__categories-item__container">
                  <Tabs
                    options={categories}
                    handleSelect={handleCategoryOnPress}
                    t={t}
                  />
                </div>
              )}
            </GridItem>
          )}

          <GridItem md={8} lg={12} classes="videos__videos-item">
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
                        size={gridSpan === 12 && !isNotDescktop ? "lg" : "sm"}
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
                          handlePlay(videoData.originalUrl);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </GridItem>
        </Grid>
      </Block>
    </>
  );
};
