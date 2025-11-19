import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Block,
  Grid,
  GridItem,
  Loading,
  CardMedia,
} from "@USupport-components-library/src";
import {
  destructureArticleData,
  createArticleSlug,
  useWindowDimensions,
  getLikesAndDislikesForContent,
} from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";
import { useEventListener } from "#hooks";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import "./information-portal.scss";

/**
 * InformationPortal
 *
 * InformationPortal Block
 *
 * @return {jsx}
 */
export const InformationPortal = () => {
  const { i18n, t } = useTranslation("blocks", {
    keyPrefix: "information-portal",
  });
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const isNotDescktop = width < 1366;
  const [showBlock, setShowBlock] = useState(false);

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );
  const shouldFetchIds = !!(currentCountry && currentCountry !== "global");

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Articles ----------------------//

  const getArticlesIds = async () => {
    // Request articles ids from the master DB based for website platform
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const articleIdsQuerry = useQuery(
    ["articleIds", currentCountry, shouldFetchIds],
    getArticlesIds,
    {
      enabled: shouldFetchIds,
    }
  );

  //--------------------- Most Read Articles ----------------------//

  const getMostReadArticles = async () => {
    const queryParams = {
      limit: 4,
      sortBy: "read_count", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: i18n.language,
      populate: true,
    };
    if (shouldFetchIds) {
      queryParams["ids"] = articleIdsQuerry.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    const { data } = await cmsSvc.getArticles(queryParams);
    const rawArticles = data.data || [];
    if (!rawArticles.length) return [];

    const ids = rawArticles.map((article) => article.id);
    const { likes, dislikes } = await getLikesAndDislikesForContent(
      ids,
      "article"
    );

    const processedArticles = rawArticles.map((article) => {
      const base = destructureArticleData(article);
      return {
        ...base,
        likes: likes.get(base.id) ?? base.likes ?? 0,
        dislikes: dislikes.get(base.id) ?? base.dislikes ?? 0,
      };
    });

    return processedArticles;
  };

  const mostReadArticlesQuerry = useQuery(
    ["mostReadArticles", i18n.language, articleIdsQuerry.data, shouldFetchIds],
    getMostReadArticles,
    {
      enabled: shouldFetchIds
        ? !articleIdsQuerry.isLoading && articleIdsQuerry.data?.length > 0
        : true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.length === 0) {
          setShowBlock(false);
        } else {
          setShowBlock(true);
        }
      },
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
    <>
      {showBlock && (
        <Block classes="information-portal">
          <Grid classes="information-portal__main-grid">
            <GridItem md={8} lg={12}>
              <h2>{t("heading")}</h2>
            </GridItem>
            <GridItem md={8} lg={12} classes="information-portal__paragraphs">
              <p>{t("paragraph_1")}</p>
              <p>{t("paragraph_2")}</p>
              <p>{t("paragraph_3")}</p>
            </GridItem>
            {mostReadArticlesQuerry.isLoading ? (
              <GridItem
                md={8}
                lg={12}
                classes="information-portal__loading-item"
              >
                <Loading />
              </GridItem>
            ) : null}
            {!mostReadArticlesQuerry.isLoading &&
              mostReadArticlesQuerry.data?.length > 0 && (
                <GridItem
                  md={8}
                  lg={6}
                  classes="information-portal__main-article-item"
                  type="portrait"
                >
                  <CardMedia
                    // type={isNotDescktop ? "portrait" : "landscape"}
                    size="lg"
                    title={mostReadArticlesQuerry.data[0].title}
                    image={mostReadArticlesQuerry.data[0].imageMedium}
                    description={mostReadArticlesQuerry.data[0].description}
                    labels={mostReadArticlesQuerry.data[0].labels}
                    creator={mostReadArticlesQuerry.data[0].creator}
                    readingTime={mostReadArticlesQuerry.data[0].readingTime}
                    categoryName={mostReadArticlesQuerry.data[0].categoryName}
                    likes={mostReadArticlesQuerry.data[0].likes || 0}
                    dislikes={mostReadArticlesQuerry.data[0].dislikes || 0}
                    t={t}
                    onClick={() =>
                      handleRedirect(
                        mostReadArticlesQuerry.data[0].id,
                        mostReadArticlesQuerry.data[0].name
                      )
                    }
                  />
                </GridItem>
              )}

            {!mostReadArticlesQuerry.isLoading &&
              mostReadArticlesQuerry.data?.length > 1 && (
                <GridItem md={8} lg={6}>
                  <Grid classes="information-portal__secondary-cards-grid">
                    {mostReadArticlesQuerry.data?.map((article, index) => {
                      return (
                        index > 0 && (
                          <GridItem md={4} lg={12} key={index}>
                            <CardMedia
                              type={isNotDescktop ? "portrait" : "landscape"}
                              size="sm"
                              title={article.title}
                              image={article.imageSmall}
                              description={article.description}
                              labels={article.labels}
                              creator={article.creator}
                              readingTime={article.readingTime}
                              categoryName={article.categoryName}
                              showLabels={false}
                              likes={article.likes}
                              dislikes={article.dislikes}
                              t={t}
                              onClick={() =>
                                handleRedirect(article.id, article.title)
                              }
                            />
                          </GridItem>
                        )
                      );
                    })}
                  </Grid>
                </GridItem>
              )}
          </Grid>
        </Block>
      )}
    </>
  );
};
