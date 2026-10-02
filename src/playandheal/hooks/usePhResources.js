import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { adminSvc, cmsSvc } from "@USupport-components-library/services";

import { PH_COLLECTIONS, PH_INTRO_VIDEO_CATEGORY } from "../config";

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

const isIntroCategory = (categoryName = "") =>
  categoryName.trim().toLowerCase() === PH_INTRO_VIDEO_CATEGORY;

const mapVideo = (video) => {
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
};

/**
 * Competency videos plus the homepage introduction video, which is the one
 * whose English category is PH_INTRO_VIDEO_CATEGORY
 */
const fetchVideos = async (language) => {
  const ids = await adminSvc.getVideos();
  if (!ids || ids.length === 0) return { videos: [], intro: null };

  const query = {
    ids,
    populate: true,
    limit: LIMIT,
    sortBy: "title",
    sortOrder: "asc",
  };

  // Categories are classified by their English name
  const { data: englishRes } = await cmsSvc.getVideos({
    ...query,
    locale: "en",
  });

  const introEnglishIds = new Set(
    englishRes.data
      .filter((video) =>
        isIntroCategory(video.attributes.category?.data?.attributes?.name)
      )
      .map((video) => String(video.id))
  );

  const localizedRes =
    language === "en"
      ? englishRes
      : (await cmsSvc.getVideos({ ...query, locale: language })).data;

  const videos = [];
  let intro = null;
  localizedRes.data.forEach((video) => {
    const englishId = getEnglishId(localizedRes.meta, video.id);
    const mapped = mapVideo(video);
    if (!mapped.videoUrl) return;
    if (introEnglishIds.has(englishId)) intro = intro || mapped;
    else videos.push(mapped);
  });

  // No translation of the introduction yet - fall back to the English one
  if (!intro && introEnglishIds.size > 0) {
    const englishIntro = englishRes.data
      .filter((video) => introEnglishIds.has(String(video.id)))
      .map(mapVideo)
      .find((video) => video.videoUrl);
    intro = englishIntro || null;
  }

  return { videos, intro };
};

/**
 * usePhResources
 *
 * Fetches the Play and Heal toolkit resources for the current language:
 * booklet and activity-card PDFs (CMS articles), competency videos and the
 * homepage introduction video.
 *
 * @returns {{ booklet: Array, cards: Array, videos: Array, introVideo: Object|null, all: Array, isLoading: boolean, isError: boolean }}
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
  const videos = videosQuery.data?.videos || [];

  return {
    booklet: articles.filter((x) => x.collection === "booklet"),
    cards: articles.filter((x) => x.collection === "cards"),
    videos,
    introVideo: videosQuery.data?.intro || null,
    all: [...articles, ...videos],
    isLoading: articlesQuery.isLoading || videosQuery.isLoading,
    isError: articlesQuery.isError || videosQuery.isError,
  };
};
