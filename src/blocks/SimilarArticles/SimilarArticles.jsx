import React from "react";
import {
  Block,
  Grid,
  GridItem,
  CardMedia,
} from "@USupport-components-library/src";
import { useNavigate } from "react-router-dom";

import "./similar-articles.scss";

/**
 * SimilarArticles
 *
 * SimilarArticles block
 *
 * @return {jsx}
 */
export const SimilarArticles = ({ similarArticlesData }) => {
  const navigate = useNavigate();

  return (
    <Block classes="similar-articles">
      <Grid classes="similar-articles__main-grid">
        <GridItem md={8} lg={12} classes="similar-articles__heading-item">
          <h4>Similar Articles</h4>
        </GridItem>
        {similarArticlesData.map((article, index) => {
          // const articleData = destructureArticleData(article);

          return (
            <GridItem classes="similar-articles__article-card" key={index}>
              <CardMedia
                type="portrait"
                size="sm"
                title="12 Tips on how to overcome anxiety and depression?"
                description="U support Me is the first platform that provides you with personalized care for..."
                labels={[{ name: "Depresion" }, { name: "Anxiety" }]}
                // creator={articleData.creator}
                readingTime={10}
                onClick={() => {
                  navigate("/article", {});
                }}
              />
            </GridItem>
          );
        })}
      </Grid>
    </Block>
  );
};
