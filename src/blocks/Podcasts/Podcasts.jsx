import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
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
  PodcastModal, // Add this import
} from "@USupport-components-library/src";
import {
  destructurePodcastData,
  useWindowDimensions,
  createArticleSlug,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useEventListener } from "#hooks";
import { ThemeContext } from "@USupport-components-library/utils";

import "./podcasts.scss";

// 2-3-1 card span logic
const getGridSpanForIndex = (index, pattern = [2, 3, 1]) => {
  const totalItems = pattern.reduce((sum, count) => sum + count, 0);
  const position = index % totalItems;
  let current = 0;
  for (let i = 0; i < pattern.length; i++) {
    const items = pattern[i];
    const span = 12 / items;
    if (position < current + items) return span;
    current += items;
  }
  return 4;
};

export const Podcasts = ({ debouncedSearchValue }) => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "articles" });
  const { theme } = useContext(ThemeContext);
  const isNotDescktop = width < 1366;

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [podcasts, setPodcasts] = useState([]);
  const [numberOfPodcasts, setNumberOfPodcasts] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [podcastToPlay, setPodcastToPlay] = useState(null);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  const getCategories = async () => {
    const res = await cmsSvc.getCategories(usersLanguage);
    const data = [
      { label: t("all"), value: "all", isSelected: true },
      ...res.data.map((cat) => ({
        label: cat.attributes.name,
        value: cat.attributes.name,
        id: cat.id,
        isSelected: false,
      })),
    ];
    setSelectedCategory(data[0]);
    return data;
  };

  useQuery(["podcasts-categories", usersLanguage], getCategories, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => setCategories([...data]),
  });

  const handleCategoryOnPress = (index) => {
    const updated = categoriesToShow.map((cat, i) => ({
      ...cat,
      isSelected: i === index,
    }));
    setCategories(updated);
    setSelectedCategory(updated[index]);
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

  const getPodcastsIds = async () => {
    return await adminSvc.getPodcasts();
  };

  const podcastIdsQuery = useQuery(
    ["podcastIds", currentCountry, shouldFetchIds],
    getPodcastsIds,
    { enabled: true }
  );

  const getPodcastsData = async () => {
    const categoryId =
      selectedCategory?.value !== "all" ? selectedCategory.id : "";
    const queryParams = {
      startFrom: 0,
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      locale: usersLanguage,
      populate: true,
      ...(shouldFetchIds
        ? { ids: podcastIdsQuery.data }
        : { global: true, isForAdmin: true }),
    };
    const { data } = await cmsSvc.getPodcasts(queryParams);
    setPodcasts(data.data || []);
    setNumberOfPodcasts(data.meta?.pagination?.total || data.data.length);
    return data.data;
  };

  const podcastsQuery = useQuery(
    [
      "podcasts",
      debouncedSearchValue,
      selectedCategory,
      podcastIdsQuery.data,
      usersLanguage,
      shouldFetchIds,
    ],
    getPodcastsData,
    {
      enabled:
        (shouldFetchIds
          ? !podcastIdsQuery.isLoading && !!podcastIdsQuery.data
          : true) && !!selectedCategory,
    }
  );

  const getMorePodcasts = async () => {
    const categoryId =
      selectedCategory?.value !== "all" ? selectedCategory.id : "";
    const queryParams = {
      startFrom: podcasts.length,
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      locale: usersLanguage,
      populate: true,
      ...(shouldFetchIds
        ? { ids: podcastIdsQuery.data }
        : { global: true, isForAdmin: true }),
    };
    const { data } = await cmsSvc.getPodcasts(queryParams);
    const newData = data.data || [];
    const currentPodcastsLength = podcasts.length + newData.length;
    setPodcasts((prev) => [...prev, ...newData]);
    if (currentPodcastsLength >= numberOfPodcasts) setHasMore(false);
  };

  const getNewestPodcast = async () => {
    const queryParams = {
      limit: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
      locale: usersLanguage,
      populate: true,
      ...(shouldFetchIds
        ? { ids: podcastIdsQuery.data }
        : { global: true, isForAdmin: true }),
    };
    const { data } = await cmsSvc.getPodcasts(queryParams);
    if (!data?.data?.[0]) return null;
    return destructurePodcastData(data.data[0]);
  };

  const { data: podcastCategoryIdsToShow } = useQuery(
    [
      "podcasts-category-ids",
      usersLanguage,
      podcastIdsQuery.data,
      shouldFetchIds,
    ],
    () =>
      cmsSvc.getPodcastCategoryIds(
        usersLanguage,
        shouldFetchIds ? podcastIdsQuery.data : undefined
      ),
    {
      enabled: shouldFetchIds ? !!podcastIdsQuery.data : true,
    }
  );

  const categoriesToShow = useMemo(() => {
    if (!categories || !podcastCategoryIdsToShow) return [];

    return categories.filter(
      (category) =>
        podcastCategoryIdsToShow.includes(category.id) ||
        category.value === "all"
    );
  }, [categories, podcastCategoryIdsToShow]);

  const { data: newestPodcast, isLoading: isNewestPodcastLoading } = useQuery(
    ["newestPodcast", usersLanguage, currentCountry, shouldFetchIds],
    getNewestPodcast,
    {
      enabled: shouldFetchIds
        ? !podcastIdsQuery.isLoading && !!podcastIdsQuery.data
        : true,
      refetchOnWindowFocus: false,
    }
  );

  const handleRedirect = (id, name) => {
    navigate(
      `/${localStorage.getItem(
        "language"
      )}/information-portal/podcast/${id}/${createArticleSlug(name)}`
    );
  };

  const handlePlay = (spotifyId, title) => {
    setPodcastToPlay({ spotifyId, title });
  };

  // Loading states
  const isInitialLoading = podcastIdsQuery.isLoading || isNewestPodcastLoading;
  const isContentLoading = podcastsQuery.isLoading || podcastsQuery.isFetching;
  const isAnyLoading = isInitialLoading || isContentLoading;

  // Data availability
  const hasIdsData = !shouldFetchIds || podcastIdsQuery.data?.length > 0;
  const hasPodcastsData = podcasts?.length > 0;
  const hasNewestData = !!newestPodcast;

  // UI conditions
  const shouldShowNoData =
    !isAnyLoading && (!hasIdsData || (!hasPodcastsData && !hasNewestData));

  const shouldShowPodcastsList =
    hasIdsData &&
    hasPodcastsData &&
    (selectedCategory?.value !== "all" ||
      (hasNewestData &&
        hasPodcastsData &&
        podcasts.some((podcast) => podcast.id !== newestPodcast.id)));

  const shouldShowCategories =
    categoriesToShow?.length > 1 && shouldShowPodcastsList;

  // Render helpers
  const renderPodcastModal = () =>
    podcastToPlay && (
      <PodcastModal
        isOpen={!!podcastToPlay}
        onClose={() => setPodcastToPlay(null)}
        spotifyId={podcastToPlay.spotifyId}
        title={podcastToPlay.title}
        t={t}
      />
    );

  const renderNoData = () =>
    shouldShowNoData && (
      <div className="podcasts__no-results-container">
        <h3>{t("could_not_load_content")}</h3>
      </div>
    );

  const renderHeading = () => (
    <GridItem md={8} lg={12} classes="podcasts__heading-item">
      {theme === "dark" && (
        <h2 className="podcasts__heading-text">{t("heading")}</h2>
      )}
    </GridItem>
  );

  const renderNewestPodcast = () =>
    (isNewestPodcastLoading || hasNewestData) && (
      <GridItem md={8} lg={12} classes="podcasts__most-important-item">
        {isNewestPodcastLoading ? (
          <Loading />
        ) : (
          hasNewestData && (
            <CardMedia
              type={isNotDescktop ? "portrait" : "landscape"}
              size="lg"
              title={newestPodcast.title}
              image={newestPodcast.imageMedium}
              description={newestPodcast.description}
              labels={newestPodcast.labels}
              creator={newestPodcast.creator}
              contentType="podcasts"
              categoryName={newestPodcast.categoryName}
              showDescription={true}
              likes={newestPodcast.likes}
              dislikes={newestPodcast.dislikes}
              t={t}
              onClick={() =>
                handleRedirect(newestPodcast.id, newestPodcast.title)
              }
              handlePlay={() => {
                handlePlay(newestPodcast.spotifyId, newestPodcast.title);
              }}
            />
          )
        )}
      </GridItem>
    );

  const renderCategories = () =>
    shouldShowCategories && (
      <GridItem md={8} lg={12} classes="podcasts__categories-item">
        <div className="podcasts__categories-item__container">
          <Tabs
            options={categoriesToShow}
            handleSelect={handleCategoryOnPress}
            t={t}
          />
        </div>
      </GridItem>
    );

  const renderPodcastsList = () =>
    shouldShowPodcastsList && (
      <GridItem md={8} lg={12} classes="podcasts__podcasts-item">
        <div style={{ position: "relative" }}>
          {/* Loading overlay for category changes */}
          {podcastsQuery.isFetching && podcasts?.length > 0 && (
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
            dataLength={podcasts.length}
            next={getMorePodcasts}
            hasMore={hasMore}
            loader={<Loading size="lg" />}
          >
            <div className="podcasts__custom-grid">
              {podcasts.map((podcast, index) => {
                const data = destructurePodcastData(podcast);
                const span = getGridSpanForIndex(index);
                return (
                  <div
                    key={index}
                    className="podcasts__card-wrapper"
                    style={{ gridColumn: `span ${span}` }}
                  >
                    <CardMedia
                      type={
                        span === 12 && !isNotDescktop ? "landscape" : "portrait"
                      }
                      size={span === 12 && !isNotDescktop ? "lg" : "sm"}
                      title={data.title}
                      image={data.imageMedium}
                      description={data.description}
                      labels={data.labels}
                      likes={data.likes || 0}
                      dislikes={data.dislikes || 0}
                      contentType="podcasts"
                      t={t}
                      categoryName={data.categoryName}
                      onClick={() => handleRedirect(data.id, data.title)}
                      handlePlay={() => {
                        handlePlay(data.spotifyId, data.title);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      </GridItem>
    );

  return (
    <>
      {renderPodcastModal()}
      <Block classes="podcasts">
        {renderNoData()}
        <Grid classes="podcasts__main-grid">
          {renderHeading()}
          {renderNewestPodcast()}
          {renderCategories()}
          {renderPodcastsList()}
        </Grid>
      </Block>
    </>
  );
};
