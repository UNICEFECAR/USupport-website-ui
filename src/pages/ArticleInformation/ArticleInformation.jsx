import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Page } from "../../blocks/Page/Page";
import { ArticleView } from "../../blocks/ArticleView/ArticleView";
import { destructureArticleData } from "../../utils/articles";
import cmsService from "../../services/cmsService";
import { useNavigate } from "react-router-dom";
import {
  Block,
  Grid,
  GridItem,
  CardMedia,
  Loading,
} from "@USupport-components-library/src";

import "./article-information.scss";

import { useTranslation } from "react-i18next";

export const ArticleInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { i18n, t } = useTranslation("article-information");

  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    cmsService.getArticleById(id, i18n.language).then((res) => {
      const destructuredArticleData = destructureArticleData(res.data);
      setArticleData(destructuredArticleData);
    });
  }, [id]);

  const [moreArticles, setMoreArticles] = React.useState();

  useEffect(() => {
    if (articleData && articleData.categoryId) {
      cmsService
        .getSimilarArticles(
          3,
          articleData.categoryId,
          articleData.id,
          i18n.language
        )
        .then((res) => {
          if (res.data.length === 0) {
            cmsService.getNewestArticles(3, i18n.language).then((res) => {
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
              const articleData = destructureArticleData(article);

              return (
                <GridItem classes="more-articles__article-card" key={index}>
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
