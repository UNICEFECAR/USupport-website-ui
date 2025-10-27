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
  TabsUnderlined,
  Tabs,
  Loading,
} from "@USupport-components-library/src";
import {
  destructureArticleData,
  useWindowDimensions,
  createArticleSlug,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useEventListener } from "#hooks";
import { ThemeContext } from "@USupport-components-library/utils";

import "./articles.scss";

const PL_LANGUAGE_AGE_GROUP_IDS = {
  pl: 13,
  uk: 11,
};

/**
 * Calculate grid span for articles based on 2-3-1 pattern
 * @param {number} index - Article index
 * @param {number[]} pattern - Array representing items per row [2, 3, 1]
 * @returns {number} Grid span value
 */
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

  return 4; // fallback
};

/**
 * Articles
 *
 * Articles block
 *
 * @return {jsx}
 */
export const Articles = ({ debouncedSearchValue }) => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "articles" });
  const { theme } = useContext(ThemeContext);

  const IS_PS = localStorage.getItem("country") === "PS";
  const IS_RTL = localStorage.getItem("language") === "ar";

  const isNotDescktop = width < 1366;

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);
  const [showAgeGroups, setShowAgeGroups] = useState(true);

  useEffect(() => {
    async function getArticleCategories() {
      const res = await cmsSvc.getCategories(usersLanguage);
      return res.data;
    }
    getArticleCategories();

    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Age Groups ----------------------//
  const [ageGroups, setAgeGroups] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();

  const country = localStorage.getItem("country");
  const isPLCountry = country === "PL";
  const hardcodedAgeGroupId = isPLCountry
    ? PL_LANGUAGE_AGE_GROUP_IDS[usersLanguage]
    : null;
  const shouldUseHardcodedAgeGroup = typeof hardcodedAgeGroupId === "number";

  const getAgeGroups = async () => {
    if (shouldUseHardcodedAgeGroup) {
      const hardcodedAgeGroup = {
        label: "",
        id: hardcodedAgeGroupId,
        isSelected: true,
      };
      setSelectedAgeGroup(hardcodedAgeGroup);
      setAgeGroups([hardcodedAgeGroup]);
      setShowAgeGroups(false);
      return [hardcodedAgeGroup];
    }
    try {
      const res = await cmsSvc.getAgeGroups(usersLanguage);
      const ageGroupsData = res.data.map((age, index) => ({
        label: age.attributes.name,
        id: age.id,
        isSelected: index === 0 ? true : false,
      }));
      setSelectedAgeGroup(ageGroupsData[0]);
      return ageGroupsData;
    } catch (err) {
      console.log(err);
    }
  };

  const ageGroupsQuery = useQuery(
    ["ageGroups", usersLanguage, hardcodedAgeGroupId],
    getAgeGroups,
    {
      enabled: showAgeGroups || shouldUseHardcodedAgeGroup,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      onSuccess: (data) => {
        setAgeGroups([...data]);
      },
    }
  );

  const handleAgeGroupOnPress = (index) => {
    const ageGroupsCopy = [...ageGroups];

    for (let i = 0; i < ageGroupsCopy.length; i++) {
      if (i === index) {
        ageGroupsCopy[i].isSelected = true;
        setSelectedAgeGroup(ageGroupsCopy[i]);
      } else {
        ageGroupsCopy[i].isSelected = false;
      }
    }

    setAgeGroups(ageGroupsCopy);
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
    setShowAgeGroups(country !== "PL");
  }, [currentCountry]);

  // Add event listener
  useEventListener("countryChanged", handler);

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
    }
  };

  const categoriesQuery = useQuery(
    ["articles-categories", usersLanguage],
    getCategories,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCategories([...data]);
      },
    }
  );

  //--------------------- Articles ----------------------//

  const getArticlesIds = async () => {
    // Request articles ids from the master DB based for website platform
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const articleIdsQuery = useQuery(
    ["articleIds", currentCountry, shouldFetchIds],
    getArticlesIds,
    {
      enabled: shouldFetchIds,
    }
  );

  const { data: categoryIdsToShow } = useQuery(
    [
      "articles-category-ids",
      usersLanguage,
      selectedAgeGroup?.id,
      articleIdsQuery.data,
      shouldFetchIds,
    ],
    () => {
      if (!selectedAgeGroup?.id) return [];
      return cmsSvc.getArticleCategoryIds(
        usersLanguage,
        selectedAgeGroup.id,
        shouldFetchIds ? articleIdsQuery.data : undefined
      );
    },
    {
      enabled:
        !!selectedAgeGroup?.id &&
        (shouldFetchIds ? !!articleIdsQuery.data : true),
    }
  );

  const categoriesToShow = useMemo(() => {
    if (!categories || !categoryIdsToShow) return [];

    return categories.filter(
      (category) =>
        categoryIdsToShow.includes(category.id) || category.value === "all"
    );
  }, [categories, categoryIdsToShow]);

  const handleCategoryOnPress = (index) => {
    const categoriesCopy = [...categoriesToShow];

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

  const [articles, setArticles] = useState();
  const [numberOfArticles, setNumberOfArticles] = useState();
  const [hasMore, setHasMore] = useState(true);

  const getArticlesData = async () => {
    const ageGroupId = ageGroupsQuery.data.find((x) => x.isSelected).id;

    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let queryParams = {
      limit: 6,
      contains: debouncedSearchValue,
      ageGroupId,
      categoryId,
      locale: usersLanguage,
      populate: true,
    };
    if (IS_PS) {
      queryParams["sortBy"] = "title";
      queryParams["sortOrder"] = "asc";
    }

    if (shouldFetchIds) {
      queryParams["ids"] = articleIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    let { data } = await cmsSvc.getArticles(queryParams);

    const articles = data.data;

    const numberOfArticles = data.meta.pagination.total;
    return { articles, numberOfArticles };
  };

  const {
    isLoading: isArticlesLoading,
    isFetching: isArticlesFetching,
    isFetched: isArticlesFetched,
    fetchStatus: articlesFetchStatus,
    data: articlesQueryData,
  } = useQuery(
    [
      "articles",
      debouncedSearchValue,
      selectedAgeGroup,
      selectedCategory,
      articleIdsQuery.data,
      usersLanguage,
      shouldFetchIds,
    ],
    getArticlesData,
    {
      enabled:
        (shouldFetchIds
          ? !articleIdsQuery.isLoading && articleIdsQuery.data?.length > 0
          : true) &&
        !ageGroupsQuery.isLoading &&
        !categoriesQuery.isLoading &&
        categoriesQuery.data?.length > 0 &&
        ageGroupsQuery.data?.length > 0 &&
        selectedCategory !== null &&
        selectedAgeGroup !== null,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setArticles([...data.articles]);
        setNumberOfArticles(data.numberOfArticles);
      },
    }
  );

  useEffect(() => {
    if (articles) {
      setHasMore(numberOfArticles > articles.length);
    }
  }, [articles]);

  const getMoreArticles = async () => {
    let ageGroupId = "";
    if (ageGroups) {
      let selectedAgeGroup = ageGroups.find((o) => o.isSelected === true);
      ageGroupId = selectedAgeGroup.id;
    }

    let categoryId = null;
    if (categories) {
      let selectedCategory = categories.find((o) => o.isSelected === true);
      categoryId = selectedCategory.id;
    }

    let queryParams = {
      startFrom: articles?.length,
      limit: 6,
      contains: debouncedSearchValue,
      ageGroupId: ageGroupId,
      categoryId,
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = articleIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    const { data } = await cmsSvc.getArticles(queryParams);

    const newArticles = data.data;

    setArticles((prevArticles) => [...(prevArticles || []), ...newArticles]);
  };

  //--------------------- Newest Article ----------------------//
  const getNewestArticle = async () => {
    let queryParams = {
      limit: 1, // Only get the newest article
      sortBy: "createdAt", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = articleIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    let { data } = await cmsSvc.getArticles(queryParams);

    if (!data || !data.data[0]) return null;
    const newestArticleData = destructureArticleData(data.data[0]);
    return newestArticleData;
  };

  const {
    data: newestArticle,
    isLoading: isNewestArticleLoading,
    isFetching: isNewestArticleFetching,
    isFetched: isNewestArticleFetched,
    fetchStatus: newestArticleFetchStatus,
  } = useQuery(
    ["newestArticle", usersLanguage, currentCountry, shouldFetchIds],
    getNewestArticle,
    {
      // Run the query when the getCategories and getAgeGroups queries have finished running
      enabled: IS_PS
        ? false
        : shouldFetchIds
        ? !articleIdsQuery.isLoading && articleIdsQuery.data?.length > 0
        : true,
      refetchOnWindowFocus: false,
    }
  );

  const handleRedirect = (id, name) => {
    navigate(
      `/${localStorage.getItem(
        "language"
      )}/information-portal/article/${id}/${createArticleSlug(name)}`
    );
  };

  return (
    <Block classes="articles">
      {(newestArticle || IS_PS) &&
        ageGroups?.length > 0 &&
        categories?.length > 0 && (
          <InfiniteScroll
            dataLength={articles?.length || 0}
            next={getMoreArticles}
            hasMore={hasMore}
            loader={<Loading size="lg" />}
            // endMessage={} // Add end message here if required
          >
            <Grid classes="articles__main-grid">
              <GridItem md={8} lg={12} classes="articles__heading-item">
                {theme === "dark" && (
                  <h2 className="articles__heading-text">{t("heading")}</h2>
                )}
              </GridItem>
              {(newestArticle || isNewestArticleFetched) && (
                <GridItem
                  md={8}
                  lg={12}
                  classes="articles__most-important-item"
                >
                  {newestArticle ? (
                    <CardMedia
                      type={isNotDescktop ? "portrait" : "landscape"}
                      size="lg"
                      title={newestArticle.title}
                      image={newestArticle.imageMedium}
                      description={newestArticle.description}
                      labels={newestArticle.labels}
                      creator={newestArticle.creator}
                      readingTime={newestArticle.readingTime}
                      categoryName={newestArticle.categoryName}
                      showDescription={true}
                      likes={newestArticle.likes}
                      dislikes={newestArticle.dislikes}
                      t={t}
                      onClick={() =>
                        handleRedirect(newestArticle.id, newestArticle.title)
                      }
                    />
                  ) : isNewestArticleLoading ? (
                    <Loading size="lg" />
                  ) : null}
                </GridItem>
              )}

              {showAgeGroups && !IS_PS && (
                <GridItem
                  md={8}
                  lg={12}
                  classes={`articles__age-groups-item ${
                    IS_RTL ? "articles__age-groups-item--rtl" : ""
                  }`}
                >
                  <div className="articles__age-groups-item__container">
                    {ageGroups && showAgeGroups && (
                      <TabsUnderlined
                        options={ageGroups}
                        handleSelect={handleAgeGroupOnPress}
                        textType="h3"
                      />
                    )}
                  </div>
                </GridItem>
              )}

              <GridItem
                md={8}
                lg={12}
                classes={`articles__categories-item ${
                  IS_RTL ? "articles__categories-item--rtl" : ""
                }`}
              >
                {categories && (
                  <Tabs
                    options={categoriesToShow}
                    handleSelect={handleCategoryOnPress}
                    t={t}
                  />
                )}
              </GridItem>

              <GridItem md={8} lg={12} classes="articles__articles-item">
                <div style={{ position: "relative", minHeight: "20rem" }}>
                  {/* Loading overlay for category changes - only show when refetching existing data */}
                  {isArticlesFetching && articles?.length > 0 && (
                    <div className="articles__articles-item__loader-overlay">
                      <Loading size="lg" />
                    </div>
                  )}

                  {/* Show articles when available and not in initial loading state */}
                  {articles?.length > 0 && !isArticlesLoading && (
                    <div className="articles__custom-grid">
                      {articles?.map((article, index) => {
                        const articleData = destructureArticleData(article);
                        const gridSpan = getGridSpanForIndex(index, [2, 3, 1]);

                        return (
                          <div
                            key={index}
                            className="articles__card-wrapper"
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
                              title={articleData.title}
                              image={articleData.imageMedium}
                              description={articleData.description}
                              labels={articleData.labels || []}
                              creator={articleData.creator}
                              readingTime={articleData.readingTime}
                              likes={articleData.likes || 0}
                              dislikes={articleData.dislikes || 0}
                              t={t}
                              categoryName={articleData.categoryName}
                              onClick={() =>
                                handleRedirect(
                                  articleData.id,
                                  articleData.title
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Show initial loading state when no articles yet */}
                  {isArticlesLoading && !articles?.length && (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                      <Loading size="lg" />
                    </div>
                  )}

                  {/* No results message */}
                  {!articles?.length &&
                    !isArticlesLoading &&
                    !isArticlesFetching &&
                    isArticlesFetched && (
                      <div className="articles__no-results-container">
                        <p>{t("no_results")}</p>
                      </div>
                    )}
                </div>
              </GridItem>
            </Grid>
          </InfiniteScroll>
        )}

      {/* Only show main loading when initially loading all data */}
      {!newestArticle &&
        !ageGroups?.length &&
        !categories?.length &&
        (isNewestArticleLoading ||
          isArticlesLoading ||
          articleIdsQuery.isLoading) && <Loading />}

      {/* Show error state only when everything is loaded but no data exists */}
      {((articleIdsQuery.isFetched &&
        articleIdsQuery.data?.length === 0 &&
        isArticlesFetched &&
        isNewestArticleFetched) ||
        (!newestArticle &&
          !isNewestArticleFetching &&
          !isNewestArticleLoading &&
          isArticlesFetched &&
          !articleIdsQuery.isFetching &&
          !articleIdsQuery.isLoading &&
          (!articlesQueryData ||
            !articlesQueryData.articles ||
            articlesQueryData.articles.length === 0))) && (
        <div className="articles__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
        </div>
      )}
    </Block>
  );
};
