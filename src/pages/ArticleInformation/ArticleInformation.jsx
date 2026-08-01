import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Page, ArticleView } from "#blocks";
import {
  destructureArticleData,
  createArticleSlug,
  getLikesAndDislikesForContent,
} from "@USupport-components-library/utils";
import { Block, CardMedia, Loading } from "@USupport-components-library/src";
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
    localStorage.getItem("country"),
  );

  const shouldFetchIds = !!(currentCountry && currentCountry !== "global");

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country !== currentCountry) {
      setCurrentCountry(country);
    }
  }, [currentCountry]);

  useEventListener("countryChanged", handler);

  const mainScrollRef = useRef(null);
  const sidebarScrollRef = useRef(null);

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
    },
  );

  const getArticleData = async () => {
    let articleIdToFetch = id;

    const contentRatings = await userSvc.getRatingsForContent({
      contentType: "article",
      contentId: articleIdToFetch,
    });

    const { data } = await cmsSvc.getArticleById(
      articleIdToFetch,
      i18n.language,
    );

    const finalData = destructureArticleData(data);
    finalData.contentRating = contentRatings.data;
    return finalData;
  };

  const {
    data: articleData,
    isLoading: isArticlesLoading,
    isFetching: isFetchingArticleData,
    isFetched,
  } = useQuery(["article", i18n.language, id], getArticleData, {
    enabled: !!id,
  });

  const {
    data: articleContentEngagements,
    isLoading: isArticleContentEngagementsLoading,
  } = useQuery(
    ["articleContentEngagements", id],
    async () => {
      const { likes, dislikes } = await getLikesAndDislikesForContent(
        [Number(id)],
        "article",
      );
      return {
        likes: likes.get(Number(id)) || 0,
        dislikes: dislikes.get(Number(id)) || 0,
      };
    },
    {
      enabled: !!id,
    },
  );

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

    let articles = data.data || [];

    if (!articles.length) {
      let { data: newest } = await cmsSvc.getArticles({
        ...queryParams,
        sortBy: "createdAt", // Sort by created date
        sortOrder: "desc", // Sort in descending order
      });
      articles = newest.data || [];
    }

    if (!articles.length) return [];

    const ids = articles.map((article) => article.id);
    const { likes, dislikes } = await getLikesAndDislikesForContent(
      ids,
      "article",
    );

    // Attach aggregated likes/dislikes into attributes so destructureArticleData picks them up
    articles.forEach((article) => {
      if (!article.attributes) return;
      article.attributes.likes = likes.get(article.id) || 0;
      article.attributes.dislikes = dislikes.get(article.id) || 0;
    });

    return articles;
  };

  const {
    data: moreArticles,
    isLoading: isMoreArticlesLoading,
    isFetched: isMoreArticlesFetched,
    isFetching: isMoreArticlesFetching,
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
    },
  );

  useEffect(() => {
    const sidebarEl = sidebarScrollRef.current;
    const mainEl = mainScrollRef.current;

    if (!sidebarEl || !mainEl) {
      return;
    }

    const handleScroll = () => {
      const articleHeight = mainEl.scrollHeight;
      const articleTop = mainEl.offsetTop;
      const viewportHeight = window.innerHeight;

      const maxArticleScroll =
        articleHeight > viewportHeight ? articleHeight - viewportHeight : 1;

      const currentArticleScroll = window.scrollY - articleTop;

      const ratio = Math.min(
        1,
        Math.max(0, currentArticleScroll / (maxArticleScroll || 1)),
      );

      const sidebarScrollable = sidebarEl.scrollHeight - sidebarEl.clientHeight;

      if (sidebarScrollable <= 0) return;

      sidebarEl.scrollTop = ratio * sidebarScrollable;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [articleData, moreArticles?.length]);

  const onArticleClick = () => {
    window.scrollTo(0, 0);
  };

  const isLoading = isArticlesLoading || isArticleContentEngagementsLoading;

  const renderSidebar = () => {
    if (!isMoreArticlesLoading && moreArticles?.length > 0) {
      return (
        <aside
          className="page__article-information__sidebar"
          ref={sidebarScrollRef}
        >
          <h4 className="page__article-information__sidebar__heading">
            {t("heading")}
          </h4>
          {moreArticles.map((article, index) => {
            const articleData = destructureArticleData(article);

            return (
              <CardMedia
                key={index}
                type="portrait"
                size="sm"
                title={articleData.title}
                image={
                  articleData.imageMedium ||
                  articleData.imageThumbnail ||
                  articleData.imageSmall
                }
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
                      "language",
                    )}/information-portal/article/${
                      articleData.id
                    }/${createArticleSlug(articleData.title)}`,
                  );
                  onArticleClick();
                }}
              />
            );
          })}
        </aside>
      );
    }

    if (!moreArticles && isMoreArticlesLoading && isMoreArticlesFetching) {
      return (
        <aside
          className="page__article-information__sidebar"
          ref={sidebarScrollRef}
        >
          <Loading size="lg" />
        </aside>
      );
    }

    return null;
  };

  return (
    <Page classes="page__article-information" showGoBackArrow showBackground>
      <Block classes="page__article-information__block">
        <div className="page__article-information__layout">
          <div className="page__article-information__main" ref={mainScrollRef}>
            {articleData && !isLoading ? (
              <ArticleView
                articleData={{
                  ...articleData,
                  likes: articleContentEngagements?.likes || 0,
                  dislikes: articleContentEngagements?.dislikes || 0,
                }}
                t={t}
                language={i18n.language}
              />
            ) : isFetched && !isLoading ? (
              <h3 className="page__article-information__no-results">
                {t("not_found")}
              </h3>
            ) : (
              <Loading size="lg" />
            )}
          </div>
          {renderSidebar()}
        </div>

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
