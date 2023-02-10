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
import { destructureArticleData } from "@USupport-components-library/utils";
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
  const { i18n, t } = useTranslation("information-portal");
  const navigate = useNavigate();
  const [showBlock, setShowBlock] = useState(false);

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

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
    ["articleIds", currentCountry],
    getArticlesIds
  );

  //--------------------- Most Read Articles ----------------------//

  const getMostReadArticles = async () => {
    let { data } = await cmsSvc.getArticles({
      limit: 4,
      sortBy: "read_count", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: i18n.language,
      populate: true,
      ids: articleIdsQuerry.data,
    });

    for (let i = 0; i < data.data.length; i++) {
      data.data[i] = destructureArticleData(data.data[i]);
    }

    return data.data;
  };

  const mostReadArticlesQuerry = useQuery(
    ["mostReadArticles", i18n.language, articleIdsQuerry.data],
    getMostReadArticles,
    {
      enabled: !articleIdsQuerry.isLoading && articleIdsQuerry.data?.length > 0,
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
                  md={4}
                  lg={6}
                  classes="information-portal__main-article-item"
                >
                  <CardMedia
                    type="portrait"
                    size="lg"
                    style={{ gridColumn: "span 4" }}
                    title={mostReadArticlesQuerry.data[0].title}
                    image={mostReadArticlesQuerry.data[0].imageMedium}
                    description={mostReadArticlesQuerry.data[0].description}
                    labels={mostReadArticlesQuerry.data[0].labels}
                    creator={mostReadArticlesQuerry.data[0].creator}
                    readingTime={mostReadArticlesQuerry.data[0].readingTime}
                    categoryName={mostReadArticlesQuerry.data[0].categoryName}
                    onClick={() => {
                      navigate(
                        `/information-portal/article/${mostReadArticlesQuerry.data[0].id}`
                      );
                    }}
                  />
                </GridItem>
              )}

            {!mostReadArticlesQuerry.isLoading &&
              mostReadArticlesQuerry.data?.length > 1 && (
                <GridItem>
                  <Grid classes="">
                    <GridItem
                      md={4}
                      lg={6}
                      classes="information-portal__secondary-grid"
                    >
                      {mostReadArticlesQuerry.data?.map((article, index) => {
                        return (
                          index > 0 && (
                            <GridItem
                              md={4}
                              lg={6}
                              key={index}
                              classes="information-portal__secondary-cards"
                            >
                              <CardMedia
                                type="landscape"
                                size="sm"
                                style={{ gridColumn: "span 4" }}
                                title={article.title}
                                image={article.imageSmall}
                                description={article.description}
                                labels={article.labels}
                                creator={article.creator}
                                readingTime={article.readingTime}
                                categoryName={article.categoryName}
                                showLabels={false}
                                onClick={() => {
                                  navigate(
                                    `/information-portal/article/${article.id}`
                                  );
                                }}
                              />
                            </GridItem>
                          )
                        );
                      })}
                    </GridItem>
                  </Grid>
                </GridItem>
              )}
          </Grid>
        </Block>
      )}
    </>
  );
};
