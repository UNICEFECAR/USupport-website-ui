import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
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
import { cmsSvc } from "@USupport-components-library/services";
import { useDebounce } from "@USupport-components-library/hooks";
import { useTranslation } from "react-i18next";

import "./articles.scss";

/**
 * Articles
 *
 * Articles block
 *
 * @return {jsx}
 */
export const Articles = () => {
  const CMS_HOST = `${import.meta.env.VITE_CMS_HOST}`;

  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { i18n, t } = useTranslation("articles");

  const isNotDescktop = width < 1366;

  //--------------------- Age Groups ----------------------//
  const [ageGroups, setAgeGroups] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();

  const getAgeGroups = async () => {
    try {
      const res = await cmsSvc.getAgeGroups(i18n.language);
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

  useQuery(["ageGroups"], getAgeGroups, {
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
      const res = await cmsSvc.getCategories(i18n.language);
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

  useQuery(["articles-categories"], getCategories, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setCategories([...data]);
    },
  });

  const handleCategoryOnPress = (index) => {
    const categoriesCopy = [...categories];

    for (let i = 0; i < categoriesCopy.length; i++) {
      if (i === index) {
        console.log(categoriesCopy[i]);
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

  //--------------------- Articles ----------------------//
  const [hasMore, setHasMore] = useState(true);

  const getArticlesData = async () => {
    const ageGroupId = ageGroups.find((x) => x.isSelected).id;
    let categoryId = "";
    if (selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    const res = await cmsSvc.getArticles({
      limit: 6,
      contains: debouncedSearchValue,
      ageGroupId,
      categoryId,
      locale: i18n.language,
      populate: true,
    });
    const articles = res.data;
    const numberOfArticles = res.meta.pagination.total;
    return { articles, numberOfArticles };
  };

  const [articles, setArticles] = useState();
  const [numberOfArticles, setNumberOfArticles] = useState();
  const { isLoading: loading } = useQuery(
    ["articles", debouncedSearchValue, selectedAgeGroup, selectedCategory],
    getArticlesData,
    {
      // Run the query when the getCategories and getAgeGroups queries have finished running
      enabled: categories?.length > 0 && ageGroups?.length > 0,
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

    const res = await cmsSvc.getArticles({
      startFrom: articles.length,
      limit: 6,
      contains: searchValue,
      ageGroupId: ageGroupId,
      categoryId: null,
      locale: i18n.language,
      populate: true,
    });

    const newArticles = res.data;

    setArticles((prevArticles) => [...prevArticles, ...newArticles]);
  };

  //--------------------- Newest Article ----------------------//
  const getNewestArticle = async () => {
    const res = await cmsSvc.getNewestArticles(1, i18n.language);
    const newestArticleData = destructureArticleData(CMS_HOST, res.data[0]);
    return newestArticleData;
  };

  const { data: newestArticle } = useQuery(
    ["newestArticle"],
    getNewestArticle,
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Block classes="articles">
      {newestArticle &&
      ageGroups &&
      ageGroups.length > 0 &&
      categories &&
      categories.length > 0 ? (
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
              {newestArticle ? (
                <CardMedia
                  type={isNotDescktop ? "portrait" : "landscape"}
                  size="lg"
                  title={newestArticle.title}
                  image={newestArticle.imageThumbnail}
                  description={newestArticle.description}
                  labels={newestArticle.labels}
                  creator={newestArticle.creator}
                  readingTime={newestArticle.readingTime}
                  showDescription={true}
                  onClick={() => {
                    navigate(`/article/${newestArticle.id}`);
                  }}
                />
              ) : (
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
              {numberOfArticles > 0 ? (
                <Grid>
                  {articles?.map((article, index) => {
                    const articleData = destructureArticleData(
                      CMS_HOST,
                      article
                    );
                    return (
                      <GridItem key={index}>
                        <CardMedia
                          type="portrait"
                          size="sm"
                          style={{ gridColumn: "span 4" }}
                          title={articleData.title}
                          image={articleData.imageThumbnail}
                          description={articleData.description}
                          labels={articleData.labels}
                          creator={articleData.creator}
                          readingTime={articleData.readingTime}
                          onClick={() => {
                            navigate(`/article/${articleData.id}`);
                          }}
                        />
                      </GridItem>
                    );
                  })}
                </Grid>
              ) : !loading ? (
                <div className="articles__no-results-container">
                  <p>{t("no_results")}</p>
                </div>
              ) : (
                <Loading size="lg" />
              )}
            </GridItem>
          </Grid>
        </InfiniteScroll>
      ) : (
        <div className="articles__page-loading">
          <Loading size="lg" />
        </div>
      )}
    </Block>
  );
};
