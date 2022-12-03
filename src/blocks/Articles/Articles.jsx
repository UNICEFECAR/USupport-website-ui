import React, { useState, useEffect, useCallback } from "react";
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
  InputSearch,
  Tabs,
  Loading,
} from "@USupport-components-library/src";
import {
  destructureArticleData,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useDebounce, useEventListener } from "#hooks";

import "./articles.scss";

/**
 * Articles
 *
 * Articles block
 *
 * @return {jsx}
 */
export const Articles = () => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { i18n, t } = useTranslation("articles");

  const isNotDescktop = width < 1366;

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Age Groups ----------------------//
  const [ageGroups, setAgeGroups] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();

  const getAgeGroups = async () => {
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
      // TODO: Handle the error
      console.log(err, "err");
    }
  };

  const ageGroupsQuery = useQuery(["ageGroups", usersLanguage], getAgeGroups, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    onSuccess: (data) => {
      setAgeGroups([...data]);
    },
  });

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

  //--------------------- Categories ----------------------//
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const getCategories = async () => {
    try {
      const res = await cmsSvc.getCategories(usersLanguage);
      let categoriesData = [{ label: "All", value: "all", isSelected: true }];
      res.data.map((category, index) =>
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

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country !== currentCountry) {
      setCurrentCountry(country);
    }
  }, [currentCountry]);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Articles ----------------------//

  const getArticlesIds = async () => {
    // Request articles ids from the master DB based for website platform
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const articleIdsQuery = useQuery(
    ["articleIds", currentCountry],
    getArticlesIds
  );

  const [hasMore, setHasMore] = useState(true);

  const getArticlesData = async () => {
    const ageGroupId = ageGroupsQuery.data.find((x) => x.isSelected).id;

    let categoryId = "";
    if (selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let { data } = await cmsSvc.getArticles({
      limit: 6,
      contains: debouncedSearchValue,
      ageGroupId,
      categoryId,
      locale: usersLanguage,
      populate: true,
      ids: articleIdsQuery.data,
    });

    const articles = data.data;

    const numberOfArticles = data.meta.pagination.total;
    return { articles, numberOfArticles };
  };

  const [articles, setArticles] = useState();
  const [numberOfArticles, setNumberOfArticles] = useState();
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
    ],
    getArticlesData,
    {
      enabled:
        !articleIdsQuery.isLoading &&
        !ageGroupsQuery.isLoading &&
        !categoriesQuery.isLoading &&
        categoriesQuery.data?.length > 0 &&
        ageGroupsQuery.data?.length > 0 &&
        articleIdsQuery.data?.length > 0 &&
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

    let categoryId = "";
    if (categories) {
      let selectedCategory = categories.find((o) => o.isSelected === true);
      categoryId = selectedCategory.id;
    }

    const { data } = await cmsSvc.getArticles({
      startFrom: articles?.length,
      limit: 6,
      contains: searchValue,
      ageGroupId: ageGroupId,
      categoryId: null,
      locale: usersLanguage,
      populate: true,
      ids: articleIdsQuery.data,
    });

    const newArticles = data.data;

    setArticles((prevArticles) => [...prevArticles, ...newArticles]);
  };

  //--------------------- Newest Article ----------------------//
  const getNewestArticle = async () => {
    let { data } = await cmsSvc.getArticles({
      limit: 1, // Only get the newest article
      sortBy: "createdAt", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: usersLanguage,
      populate: true,
      ids: articleIdsQuery.data,
    });
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
    ["newestArticle", usersLanguage, currentCountry],
    getNewestArticle,
    {
      // Run the query when the getCategories and getAgeGroups queries have finished running
      enabled: !articleIdsQuery.isLoading && articleIdsQuery.data?.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Block classes="articles">
      {newestArticle && ageGroups?.length > 0 && categories?.length > 0 && (
        <InfiniteScroll
          dataLength={articles?.length || 0}
          next={getMoreArticles}
          hasMore={hasMore}
          loader={<Loading size="lg" />}
          // endMessage={} // Add end message here if required
        >
          <Grid classes="articles__main-grid">
            <GridItem md={8} lg={12} classes="articles__heading-item">
              <h2>{t("heading")}</h2>
            </GridItem>
            <GridItem md={8} lg={12} classes="articles__most-important-item">
              <CardMedia
                type={isNotDescktop ? "portrait" : "landscape"}
                size="lg"
                title={newestArticle.title}
                image={newestArticle.imageMedium}
                description={newestArticle.description}
                labels={newestArticle.labels}
                creator={newestArticle.creator}
                readingTime={newestArticle.readingTime}
                showDescription={true}
                onClick={() => {
                  navigate(`/information-portal/article/${newestArticle.id}`);
                }}
              />
              {!newestArticle && isNewestArticleLoading && (
                <Loading size="lg" />
              )}
            </GridItem>

            <GridItem md={8} lg={8} classes="articles__age-groups-item">
              {ageGroups && (
                <TabsUnderlined
                  options={ageGroups}
                  handleSelect={handleAgeGroupOnPress}
                />
              )}
            </GridItem>
            <GridItem md={8} lg={4} classes="articles__search-item">
              <InputSearch onChange={handleInputChange} value={searchValue} />
            </GridItem>

            <GridItem md={8} lg={12} classes="articles__categories-item">
              {categories && (
                <Tabs
                  options={categories}
                  handleSelect={handleCategoryOnPress}
                />
              )}
            </GridItem>

            <GridItem md={8} lg={12} classes="articles__articles-item">
              {articles?.length > 0 &&
                !isArticlesLoading &&
                !isArticlesFetching && (
                  <Grid>
                    {articles?.map((article, index) => {
                      const articleData = destructureArticleData(article);
                      return (
                        <GridItem key={index}>
                          <CardMedia
                            type="portrait"
                            size="sm"
                            style={{ gridColumn: "span 4" }}
                            title={articleData.title}
                            image={articleData.imageMedium}
                            description={articleData.description}
                            labels={articleData.labels}
                            creator={articleData.creator}
                            readingTime={articleData.readingTime}
                            onClick={() => {
                              navigate(
                                `/information-portal/article/${articleData.id}`
                              );
                            }}
                          />
                        </GridItem>
                      );
                    })}
                  </Grid>
                )}
              {!articles?.length && !isArticlesLoading && !isArticlesFetching && (
                <div className="articles__no-results-container">
                  <p>{t("no_results")}</p>
                </div>
              )}
            </GridItem>
          </Grid>
        </InfiniteScroll>
      )}

      {isArticlesFetching ||
      articleIdsQuery.isLoading ||
      articleIdsQuery.isFetching ||
      isNewestArticleFetching ||
      (isNewestArticleLoading && newestArticleFetchStatus !== "idle") ? (
        <Loading />
      ) : null}

      {(articleIdsQuery.isFetched &&
        articleIdsQuery.data?.length === 0 &&
        (isArticlesFetched || articlesFetchStatus === "idle") &&
        isNewestArticleFetched) ||
      (!newestArticle &&
        !isNewestArticleFetching &&
        (isArticlesFetched || articlesFetchStatus === "idle") &&
        !articleIdsQuery.isFetching &&
        (!articlesQueryData ||
          !articlesQueryData.articles ||
          articlesQueryData.articles.length === 0)) ? (
        <div className="articles__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
        </div>
      ) : null}
    </Block>
  );
};
