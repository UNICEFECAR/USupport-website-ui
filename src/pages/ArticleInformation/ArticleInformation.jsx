import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Page, ArticleView } from "#blocks";
import { destructureArticleData } from "@USupport-components-library/utils";
import { useNavigate } from "react-router-dom";
import {
  Block,
  Grid,
  GridItem,
  CardMedia,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import cmsSvc from "#services/cms";

import "./article-information.scss";

export const ArticleInformation = () => {
  const CMS_HOST = `${import.meta.env.VITE_CMS_HOST}`;

  const navigate = useNavigate();
  const { id } = useParams();

  const { i18n, t } = useTranslation("article-information");

  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    cmsSvc.getArticleById(id, i18n.language).then((res) => {
      const destructuredArticleData = destructureArticleData(
        CMS_HOST,
        res.data
      );
      setArticleData(destructuredArticleData);
    });
  }, [id]);

  const [moreArticles, setMoreArticles] = React.useState();

  useEffect(() => {
    if (articleData && articleData.categoryId) {
      cmsSvc
        .getSimilarArticles(
          3,
          articleData.categoryId,
          articleData.id,
          i18n.language
        )
        .then((res) => {
          if (res.data.length === 0) {
            cmsSvc.getNewestArticles(3, i18n.language).then((res) => {
              setMoreArticles(res.data);
            });
          } else {
            setMoreArticles(res.data);
          }
        });
    }
  }, [articleData]);

  const onArticleClick = () => {
    setArticleData(null);
    setMoreArticles(null);
  };

  return (
    <Page classes="page__article-information">
      {articleData !== null ? (
        <>
          <img
            className="page__article-information__image"
            src={
              articleData.imageMedium
                ? articleData.imageMedium
                : "https://picsum.photos/300/400"
            }
            alt=""
          />
          <ArticleView articleData={articleData} />
        </>
      ) : (
        <Loading size="lg" />
      )}

      {moreArticles && moreArticles.length > 0 ? (
        <Block classes="page__article-information__more-articles">
          <Grid classes="page__article-information__more-articles__main-grid">
            <GridItem md={8} lg={12} classes="more-articles__heading-item">
              <h4>{t("heading")}</h4>
            </GridItem>
            {moreArticles.map((article, index) => {
              const articleData = destructureArticleData(CMS_HOST, article);

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
                    image={articleData.imageThumbnail}
                    description={articleData.description}
                    labels={articleData.labels}
                    creator={articleData.creator}
                    readingTime={articleData.readingTime}
                    onClick={() => {
                      navigate(`/article/${articleData.id}`);
                      onArticleClick();
                    }}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </Block>
      ) : (
        <Loading size="lg" />
      )}
    </Page>
  );
};
