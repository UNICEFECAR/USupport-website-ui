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
    const updated = categories.map((cat, i) => ({
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

  const { isLoading: isPodcastsLoading, isFetching: isPodcastsFetching } =
    useQuery(
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
    setPodcasts((prev) => [...prev, ...newData]);
    if (podcasts.length + newData.length >= numberOfPodcasts) setHasMore(false);
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

  const isLoading =
    isPodcastsLoading ||
    isPodcastsFetching ||
    isNewestPodcastLoading ||
    (shouldFetchIds && podcastIdsQuery.isLoading);

  const hasNoData =
    !isLoading &&
    ((shouldFetchIds && !podcastIdsQuery.data?.length) ||
      (!podcasts?.length && !newestPodcast));

  return (
    <Block classes="podcasts">
      {hasNoData && (
        <div className="podcasts__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
        </div>
      )}

      <Grid classes="podcasts__main-grid">
        <GridItem md={8} lg={12} classes="podcasts__heading-item">
          {theme === "dark" && (
            <h2 className="podcasts__heading-text">{t("heading")}</h2>
          )}
        </GridItem>

        {(isNewestPodcastLoading || newestPodcast) && (
          <GridItem md={8} lg={12} classes="podcasts__most-important-item">
            {isNewestPodcastLoading ? (
              <Loading />
            ) : (
              newestPodcast && (
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
                />
              )
            )}
          </GridItem>
        )}

        {podcasts?.length > 0 && categories && (
          <GridItem md={8} lg={12} classes="podcasts__categories-item">
            <div className="podcasts__categories-item__container">
              <Tabs
                options={categories}
                handleSelect={handleCategoryOnPress}
                t={t}
              />
            </div>
          </GridItem>
        )}

        <GridItem md={8} lg={12} classes="podcasts__podcasts-item">
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
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </GridItem>
      </Grid>
    </Block>
  );
};
