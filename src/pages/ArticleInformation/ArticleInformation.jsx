import React, { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Page, ArticleView } from "#blocks";
import {
  destructureArticleData,
  createArticleSlug,
} from "@USupport-components-library/utils";
import {
  Block,
  Grid,
  GridItem,
  CardMedia,
  Loading,
} from "@USupport-components-library/src";
import {
  cmsSvc,
  adminSvc,
  userSvc,
} from "@USupport-components-library/services";
import { useEventListener } from "#hooks";

import "./article-information.scss";

export const ArticleInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { i18n, t } = useTranslation("pages", {
    keyPrefix: "article-information",
  });

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

  useEventListener("countryChanged", handler);

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

  const getArticleData = async () => {
    let articleIdToFetch = id;

    const contentRatings = await userSvc.getRatingsForContent({
      contentType: "article",
      contentId: articleIdToFetch,
    });

    const { data } = await cmsSvc.getArticleById(
      articleIdToFetch,
      i18n.language
    );

    const finalData = destructureArticleData(data);
    finalData.contentRating = contentRatings.data;
    return finalData;
  };

  const {
    data: articleData,
    isLoading: isArticlesLoading,
    isFetching: isFetchingArticleData,
  } = useQuery(["article", i18n.language, id], getArticleData, {
    enabled: !!id,
  });

  const getSimilarArticles = async () => {
    let queryParams = {
      limit: 3,
      locale: i18n.language,
      excludeId: articleData.id,
      populate: true,
      ids: articleIdsQuery.data,
      ageGroupId: articleData.ageGroupId,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = articleIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    let { data } = await cmsSvc.getArticles({
      ...queryParams,
      categoryId: articleData.categoryId,
    });

    if (data.length === 0) {
      let { data: newest } = await cmsSvc.getArticles({
        ...queryParams,
        sortBy: "createdAt", // Sort by created date
        sortOrder: "desc", // Sort in descending order
      });
      return newest.data;
    }
    return data.data;
  };

  const {
    data: moreArticles,
    isLoading: isMoreArticlesLoading,
    isFetched: isMoreArticlesFetched,
  } = useQuery(
    ["more-articles", id, i18n.language, shouldFetchIds],
    getSimilarArticles,
    {
      enabled:
        (shouldFetchIds
          ? !articleIdsQuery.isLoading && articleIdsQuery.data?.length > 0
          : true) &&
        !isFetchingArticleData &&
        articleData &&
        articleData.categoryId
          ? true
          : false,
    }
  );

  const onArticleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Page classes="page__article-information">
      {articleData ? (
        <ArticleView articleData={articleData} i18n={i18n} />
      ) : (
        <Loading size="lg" />
      )}
      {!isMoreArticlesLoading && moreArticles.length > 0 && (
        <Block classes="page__article-information__more-articles">
          <Grid classes="page__article-information__more-articles__main-grid">
            <GridItem md={8} lg={12} classes="more-articles__heading-item">
              <h4>{t("heading")}</h4>
            </GridItem>
            {moreArticles.map((article, index) => {
              const articleData = destructureArticleData(article);

              return (
                <GridItem
                  classes="page__article-information__more-articles-card"
                  key={index}
                >
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
                    categoryName={articleData.categoryName}
                    likes={articleData.likes || 0}
                    dislikes={articleData.dislikes || 0}
                    t={t}
                    onClick={() => {
                      navigate(
                        `/${localStorage.getItem(
                          "language"
                        )}/information-portal/article/${
                          articleData.id
                        }/${createArticleSlug(articleData.title)}`
                      );
                      onArticleClick();
                    }}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </Block>
      )}
      <Block>
        {!moreArticles && isMoreArticlesLoading && !isArticlesLoading && (
          <Loading size="lg" />
        )}
        {!moreArticles?.length &&
          !isMoreArticlesLoading &&
          isMoreArticlesFetched && (
            <h3 className="page__article-information__no-results">
              {t("no_results")}
            </h3>
          )}
      </Block>
    </Page>
  );
};
