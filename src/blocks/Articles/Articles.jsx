import React, { useState, useEffect, useCallback, useContext } from "react";
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
import { ThemeContext } from "@USupport-components-library/utils";

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
  const { theme } = useContext(ThemeContext);

  const isNotDescktop = width < 1366;

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);
  const [showAgeGroups, setShowAgeGroups] = useState(true);

  useEffect(() => {
    const country = localStorage.getItem("country");
    if (country === "PL") {
      setShowAgeGroups(false);
    }
  }, []);

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
      console.log(err);
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
    setShowAgeGroups(country !== "PL");
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
    ["articleIds", currentCountry, shouldFetchIds],
    getArticlesIds,
    {
      enabled: shouldFetchIds,
    }
  );

  const [articles, setArticles] = useState();
  const [numberOfArticles, setNumberOfArticles] = useState();
  const [hasMore, setHasMore] = useState(true);

  const getArticlesData = async () => {
    const ageGroupId = ageGroupsQuery.data.find((x) => x.isSelected).id;

    let categoryId = "";
    if (selectedCategory.value !== "all") {
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
      contains: searchValue,
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

    setArticles((prevArticles) => [...prevArticles, ...newArticles]);
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
      enabled: shouldFetchIds
        ? !articleIdsQuery.isLoading && articleIdsQuery.data?.length > 0
        : true,
      refetchOnWindowFocus: false,
    }
  );

  const handleRedirect = (id) => {
    navigate(
      `/${localStorage.getItem("language")}/information-portal/article/${id}`
    );
  };

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
              {theme === "dark" && (
                <h2 className="articles__heading-text">{t("heading")}</h2>
              )}
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
                categoryName={newestArticle.categoryName}
                showDescription={true}
                likes={newestArticle.likes}
                dislikes={newestArticle.dislikes}
                t={t}
                onClick={() => handleRedirect(newestArticle.id)}
              />
              {!newestArticle && isNewestArticleLoading && (
                <Loading size="lg" />
              )}
            </GridItem>

            {showAgeGroups && (
              <GridItem md={8} lg={8} classes="articles__age-groups-item">
                {ageGroups && showAgeGroups && (
                  <TabsUnderlined
                    options={ageGroups}
                    handleSelect={handleAgeGroupOnPress}
                  />
                )}
              </GridItem>
            )}
            <GridItem
              md={8}
              lg={showAgeGroups ? 4 : 12}
              classes="articles__search-item"
            >
              <InputSearch onChange={handleInputChange} value={searchValue} />
            </GridItem>

            <GridItem md={8} lg={12} classes="articles__categories-item">
              {categories && (
                <Tabs
                  options={categories}
                  handleSelect={handleCategoryOnPress}
                  t={t}
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
                            likes={articleData.likes || 0}
                            dislikes={articleData.dislikes || 0}
                            t={t}
                            categoryName={articleData.categoryName}
                            onClick={() => handleRedirect(articleData.id)}
                          />
                        </GridItem>
                      );
                    })}
                  </Grid>
                )}
              {!articles?.length &&
                !isArticlesLoading &&
                !isArticlesFetching && (
                  <div className="articles__no-results-container">
                    <p>{t("no_results")}</p>
                  </div>
                )}
            </GridItem>
          </Grid>
        </InfiniteScroll>
      )}

      {(shouldFetchIds &&
        (isArticlesFetching ||
          articleIdsQuery.isLoading ||
          articleIdsQuery.isFetching)) ||
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
