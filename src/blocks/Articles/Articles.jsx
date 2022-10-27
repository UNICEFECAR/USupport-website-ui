import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import {
  destructureArticleData,
  useWindowDimensions,
} from "@USupport-components-library/utils";
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
import { useTranslation } from "react-i18next";

import cmsSvc from "#services/cms";

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
  const isNotDescktop = width < 1366;

  const { i18n, t } = useTranslation("articles");
  const [loading, setLoading] = useState(false);

  //--------------------- Age Groups ----------------------//
  const [ageGroups, setAgeGroups] = useState();

  useEffect(() => {
    cmsSvc.getAgeGroups(i18n.language).then((res) => {
      const ageGroupsData = res.data.map((ageGroup, index) => {
        return {
          label: ageGroup.attributes.name,
          id: ageGroup.id,
          isSelected: index === 0 ? true : false,
        };
      });

      setAgeGroups(ageGroupsData);
    });
  }, []);

  const handleAgeGroupOnPress = (index) => {
    const ageGroupsCopy = [...ageGroups];

    for (let i = 0; i < ageGroupsCopy.length; i++) {
      if (i === index) {
        ageGroupsCopy[i].isSelected = true;
        setLoading(true);
        setArticles([]);
      } else {
        ageGroupsCopy[i].isSelected = false;
      }
    }

    setAgeGroups(ageGroupsCopy);
  };

  //--------------------- Categories ----------------------//

  const [categories, setCategories] = useState();

  useEffect(() => {
    cmsSvc.getCategories(i18n.language).then((res) => {
      const categoriesData = res.data.map((category, index) => {
        return {
          label: category.attributes.name,
          value: category.attributes.name,
          id: category.id,
          isSelected: index === 0 ? true : false,
        };
      });

      setCategories(categoriesData);
    });
  }, []);

  const handleCategoryOnPress = (index) => {
    const categoriesCopy = [...categories];

    for (let i = 0; i < categoriesCopy.length; i++) {
      if (i === index) {
        categoriesCopy[i].isSelected = true;
        setLoading(true);
        setArticles([]);
      } else {
        categoriesCopy[i].isSelected = false;
      }
    }

    setCategories(categoriesCopy);
  };

  //--------------------- Search Input ----------------------//
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  useEffect(() => {
    if (searchValue !== "") {
      setLoading(true);
      setArticles([]);
    }
  }, [searchValue]);

  //--------------------- Articles ----------------------//
  const [articles, setArticles] = useState();
  const [numberOfArticles, setNumberOfArticles] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let ageGroupId = null;
    if (ageGroups) {
      let selectedAgeGroup = ageGroups.find((o) => o.isSelected === true);
      ageGroupId = selectedAgeGroup.id;
    }

    let categoryId = null;
    if (categories) {
      let selectedCategory = categories.find((o) => o.isSelected === true);
      categoryId = selectedCategory.id;
    }

    if (loading !== true) {
      setLoading(true);
    }

    cmsSvc
      .getArticles({
        limit: 5,
        contains: searchValue,
        ageGroupId: ageGroupId,
        categoryId: categoryId,
        locale: i18n.language,
        populate: true,
      })
      .then(async (res) => {
        setArticles(res.data);
        setNumberOfArticles(res.meta.pagination.total);
        setLoading(false);
      });
  }, [searchValue, ageGroups, categories]);

  useEffect(() => {
    if (articles) {
      setHasMore(numberOfArticles > articles.length ? true : false);
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
      limit: 5,
      contains: searchValue,
      ageGroupId: ageGroupId,
      categoryId: categoryId,
      locale: i18n.language,
      populate: true,
    });

    const newArticles = res.data;

    setArticles((prevArticles) => [...prevArticles, ...newArticles]);
  };

  //--------------------- Newest Article ----------------------//
  const [newestArticle, setNewestArticle] = useState();

  useEffect(() => {
    cmsSvc.getNewestArticles(1, i18n.language).then((res) => {
      const newestArticleData = destructureArticleData(CMS_HOST, res.data[0]);
      setNewestArticle(newestArticleData);
    });
  }, []);

  return (
    <Block classes="articles">
      {newestArticle &&
      ageGroups &&
      ageGroups.length > 0 &&
      categories &&
      categories.length > 0 &&
      articles ? (
        <InfiniteScroll
          dataLength={articles.length}
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
              {newestArticle && (
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
                  {articles.map((article, index) => {
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
              ) : loading === false ? (
                <p>{t("no_results")}</p>
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
