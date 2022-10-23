import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Page } from "../../blocks/Page/Page";
import { ArticleView } from "../../blocks/ArticleView/ArticleView";
import { MoreArticles } from "../../blocks/MoreArticles/MoreArticles";

import "./article-information.scss";

import cmsService from "../../services/cmsService";
import { destructureArticleData } from "../../utils/articles";

export const ArticleInformation = () => {
  const { id } = useParams();

  const [articleData, setArticelData] = useState();

  useEffect(() => {
    cmsService.getArticleById(id).then((res) => {
      const destructuredArticleData = destructureArticleData(res.data);
      setArticelData(destructuredArticleData);
    });
  }, [id]);

  const [similarArticles, setSimilarArticles] = React.useState();
  const [newestArticles, setNewestArticles] = React.useState();

  useEffect(() => {
    if (articleData && articleData.categoryId) {
      cmsService
        .getSimilarArticles(3, articleData.categoryId, articleData.id)
        .then((res) => {
          setSimilarArticles(res.data);
        });
    }
  }, [articleData]);

  useEffect(() => {
    if (similarArticles && similarArticles.length === 0) {
      cmsService.getNewestArticles(3).then((res) => {
        setNewestArticles(res.data);
      });
    }
  }, [similarArticles]);
  return (
    <Page classes="page__article">
      {articleData && (
        <img
          src={
            articleData.imageMedium
              ? articleData.imageMedium
              : "https://picsum.photos/300/400"
          }
          alt=""
        />
      )}
      {articleData && <ArticleView articleData={articleData} />}

      {similarArticles && similarArticles.length > 0 && (
        <MoreArticles articlesData={similarArticles} />
      )}

      {newestArticles &&
        newestArticles.length > 0 &&
        similarArticles.length === 0 && (
          <MoreArticles articlesData={newestArticles} />
        )}
    </Page>
  );
};
