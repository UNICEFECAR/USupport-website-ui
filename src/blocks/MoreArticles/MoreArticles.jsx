import React from "react";
import {
  Block,
  Grid,
  GridItem,
  CardMedia,
} from "@USupport-components-library/src";
import { useNavigate } from "react-router-dom";
import { destructureArticleData } from "../../utils/articles";

import "./more-articles.scss";

import { useTranslation } from "react-i18next";

/**
 * MoreArticles
 *
 * MoreArticles block
 *
 * @return {jsx}
 */
export const MoreArticles = ({ articlesData }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("more-articles");
  return (
    <Block classes="more-articles">
      <Grid classes="more-articles__main-grid">
        <GridItem md={8} lg={12} classes="more-articles__heading-item">
          <h4>{t("heading")}</h4>
        </GridItem>
        {articlesData.map((article, index) => {
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
                }}
              />
            </GridItem>
          );
        })}
      </Grid>
    </Block>
  );
};
