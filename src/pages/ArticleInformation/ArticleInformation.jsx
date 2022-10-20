import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Page } from "../../blocks/Page/Page";
import { ArticleView } from "../../blocks/ArticleView/ArticleView";
import { SimilarArticles } from "../../blocks/SimilarArticles/SimilarArticles";

import "./article-information.scss";

import cmsService from "../../services/cmsService";
import { destructureArticleData } from "../../utils/articles";

export const ArticleInformation = () => {
  const { id } = useParams();

  const [articleData, setArticelData] = useState();

  useEffect(() => {
    cmsService.getArticleById(id).then((res) => {
      console.log(res.data);
      const destructuredArticleData = destructureArticleData(res.data);
      console.log(destructuredArticleData);
      setArticelData(destructuredArticleData);
    });
  }, [id]);

  const [similarArticles, setSimilarArticles] = React.useState([1, 2, 3]);

  //TODO: Get similar articles
  // useEffect(() => {
  //   cmsService.getArticlesLimit(3).then((res) => {
  //     setSimilarArticles(res.data);
  //   });
  // }, []);

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
        <SimilarArticles similarArticlesData={similarArticles} />
      )}
    </Page>
  );
};
