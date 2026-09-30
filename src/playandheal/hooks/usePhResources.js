import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { adminSvc, cmsSvc } from "@USupport-components-library/services";

import { PH_COLLECTIONS } from "../config";

const LIMIT = 100;

// "2. Introduction" -> "Introduction", "6: Practice..." -> "Practice..."
const cleanTitle = (title = "") => title.replace(/^\s*\d+\s*[.:]\s*/, "").trim();

const getMediaUrl = (media) => {
  const data = Array.isArray(media?.data) ? media.data[0] : media?.data;
  return data?.attributes?.url || null;
};

const getThumbnailUrl = (media) => {
  const attributes = media?.data?.attributes;
  return attributes?.formats?.medium?.url || attributes?.url || null;
};

const getCollectionForCategory = (categoryName = "") => {
  const name = categoryName.toLowerCase();
  const match = Object.entries(PH_COLLECTIONS).find(([, collection]) =>
    collection.categoryMatchers?.some((matcher) => name.includes(matcher))
  );
  return match ? match[0] : null;
};

/**
 * Maps a localized CMS entry id to the id of its English version
 */
const getEnglishId = (meta, id) => {
  return String(meta?.availableLocales?.[id]?.en || id);
};

const fetchArticles = async (language) => {
  const ids = await adminSvc.getArticles();
  if (!ids || ids.length === 0) return [];

  const query = {
    ids,
    populate: true,
    limit: LIMIT,
    sortBy: "title",
    sortOrder: "asc",
  };

  // Categories are classified by their English name
  const { data: englishRes } = await cmsSvc.getArticles({
    ...query,
    locale: "en",
  });

  const collectionByEnglishId = {};
  englishRes.data.forEach((article) => {
    collectionByEnglishId[String(article.id)] = getCollectionForCategory(
      article.attributes.category?.data?.attributes?.name
    );
  });

  const localizedRes =
    language === "en"
      ? englishRes
      : (await cmsSvc.getArticles({ ...query, locale: language })).data;

  return localizedRes.data
    .map((article) => {
      const { attributes } = article;
      const englishId = getEnglishId(localizedRes.meta, article.id);

      return {
        id: article.id,
        type: "article",
        collection: collectionByEnglishId[englishId] || null,
        title: cleanTitle(attributes.title),
        description: attributes.description || "",
        image: getThumbnailUrl(attributes.image),
        pdfUrl: getMediaUrl(attributes.pdf),
        keywords: (attributes.labels?.data || [])
          .map((label) => label.attributes.name)
          .join(" "),
      };
    })
    .filter((article) => article.collection && article.pdfUrl);
};

const fetchVideos = async (language) => {
  const ids = await adminSvc.getVideos();
  if (!ids || ids.length === 0) return [];

  const { data: res } = await cmsSvc.getVideos({
    ids,
    locale: language,
    populate: true,
    limit: LIMIT,
    sortBy: "title",
    sortOrder: "asc",
  });

  return res.data
    .map((video) => {
      const { attributes } = video;
      return {
        id: video.id,
        type: "video",
        collection: "videos",
        title: cleanTitle(attributes.title),
        description: attributes.description || "",
        image: getThumbnailUrl(attributes.thumbnail),
        videoUrl: attributes.aws_url || attributes.url || null,
        externalUrl: attributes.url || null,
        keywords: (attributes.labels?.data || [])
          .map((label) => label.attributes.name)
          .join(" "),
      };
    })
    .filter((video) => video.videoUrl);
};

/**
 * usePhResources
 *
 * Fetches the Play and Heal toolkit resources for the current language:
 * booklet and activity-card PDFs (CMS articles) and competency videos.
 *
 * @returns {{ booklet: Array, cards: Array, videos: Array, all: Array, isLoading: boolean, isError: boolean }}
 */
export const usePhResources = () => {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";

  const articlesQuery = useQuery(["ph-articles", language], () =>
    fetchArticles(language)
  );
  const videosQuery = useQuery(["ph-videos", language], () =>
    fetchVideos(language)
  );

  const articles = articlesQuery.data || [];
  const videos = videosQuery.data || [];

  return {
    booklet: articles.filter((x) => x.collection === "booklet"),
    cards: articles.filter((x) => x.collection === "cards"),
    videos,
    all: [...articles, ...videos],
    isLoading: articlesQuery.isLoading || videosQuery.isLoading,
    isError: articlesQuery.isError || videosQuery.isError,
  };
};
