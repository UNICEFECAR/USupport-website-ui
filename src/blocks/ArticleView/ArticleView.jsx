import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import propTypes from "prop-types";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import {
  Block,
  AudioPlayer,
  Grid,
  GridItem,
  Icon,
  Label,
  Markdown,
  Like,
  Loading,
} from "@USupport-components-library/src";

import { PDFViewer } from "#blocks/PDFViewer/PDFViewer";

import { useAddContentEngagement } from "#hooks";

import { userSvc, cmsSvc } from "@USupport-components-library/services";
import {
  ThemeContext,
  createArticleSlug,
  constructShareUrl,
} from "@USupport-components-library/utils";

import "./article-view.scss";

/**
 * ArticleView
 *
 * ArticleView block
 *
 * @return {jsx}
 */
export const ArticleView = ({ articleData, t, language }) => {
  const { name } = useParams();

  const IS_RTL = localStorage.getItem("language") === "ar";

  const creator = articleData.creator ? articleData.creator : null;
  const { theme } = useContext(ThemeContext);

  // const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);
  const [isShared, setIsShare] = useState(false);
  const [hasTrackedAudioPlay, setHasTrackedAudioPlay] = useState(false);
  const addContentEngagementMutation = useAddContentEngagement();

  // Track view when article is loaded using useQuery
  useQuery(
    ["article-view-tracking", articleData.id],
    async () => {
      addContentEngagementMutation({
        contentId: articleData.id,
        contentType: "article",
        action: "view",
      });
      return true;
    },
    {
      enabled: !!articleData?.id,
    }
  );

  const url = constructShareUrl({
    contentType: "article",
    id: articleData.id,
    name: articleData.title,
  });

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [language]);

  useEffect(() => {
    setHasTrackedAudioPlay(false);
  }, [articleData?.id]);

  useEffect(() => {
    if (articleData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(articleData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/${language}/information-portal/article/${articleData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [articleData?.title, name, language, hasUpdatedUrl]);

  const handleExportToPdf = async () => {
    const language = localStorage.getItem("language") || "en";
    try {
      setIsExportingPdf(true);
      // Get CMS API URL where the article can be accessed with nested image data
      const apiUrl = `${import.meta.env.VITE_CMS_API_URL}/articles/${
        articleData.id
      }?locale=${language}&populate=creator,category,labels,thumbnail.formats,image`;

      // Make the fetch call
      const response = await userSvc.generatePdf({
        contentUrl: apiUrl,
        contentType: "article",
        title: articleData.title,
        // Add image URL info to help server locate it
        imageUrl: articleData.imageMedium || articleData.image,
      });

      if (response.status !== 200) {
        throw new Error(`Error generating PDF: ${response.statusText}`);
      }

      // Get the PDF blob
      const blob = response.data;

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${articleData.title.replace(/\s+/g, "_")}.pdf`
      );

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addContentEngagementMutation({
        contentId: articleData.id,
        contentType: "article",
        action: "download",
      });
    } finally {
      setIsExportingPdf(false);

      cmsSvc.addArticleDownloadCount(articleData.id);
    }
  };

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared) {
      cmsSvc.addArticleShareCount(articleData.id).then(() => {
        setIsShare(true);
      });
    } // Track share engagement
    addContentEngagementMutation({
      contentId: articleData.id,
      contentType: "article",
      action: "share",
    });
  };

  const handleAudioPlay = () => {
    if (hasTrackedAudioPlay) return;

    addContentEngagementMutation({
      contentId: articleData.id,
      contentType: "article",
      action: "listen",
    });
    setHasTrackedAudioPlay(true);
  };

  const SHOW_DOWNLOAD = !articleData.pdfUrl;

  return (
    <Block classes={`article-view ${IS_RTL ? "article-view--rtl" : ""}`}>
      <div className="article-view__content">
        {/* Title */}
        <h2 className="article-view__title">{articleData.title}</h2>

        {/* Author & meta row */}
        <div className="article-view__meta">
          {articleData.categoryName && (
            <div className="article-view__category-badge">
              <p className="small-text">{articleData.categoryName}</p>
            </div>
          )}
          {creator && (
            <p className="text article-view__creator">{t("by", { creator })}</p>
          )}
          <div className="article-view__meta-dot" />
          <Icon
            name="time"
            size="sm"
            color={theme === "dark" ? "#ffffff" : "#66768d"}
          />
          <p className="text">
            {articleData.readingTime} {t("min_read")}
          </p>
        </div>

        {/* Labels */}
        {articleData.labels.length > 0 && (
          <div className="article-view__labels">
            {articleData.labels.map((label, index) => (
              <Label
                classes="article-view__label"
                text={label.name}
                key={index}
              />
            ))}
          </div>
        )}

        {/* Separator */}
        <div className="article-view__separator" />

        {/* Action bar */}
        <div className="article-view__actions">
          <div className="article-view__actions-left">
            {SHOW_DOWNLOAD && (
              <Like
                likes={articleData.likes || 0}
                isLiked={articleData.contentRating?.isLikedByUser || false}
                dislikes={articleData.dislikes || 0}
                isDisliked={
                  articleData.contentRating?.isDislikedByUser || false
                }
              />
            )}
          </div>
          <div className="article-view__actions-right">
            {SHOW_DOWNLOAD && (
              <>
                <div
                  onClick={handleExportToPdf}
                  className="article-view__action-btn"
                >
                  {isExportingPdf ? (
                    <Loading padding="0px" size="sm" />
                  ) : (
                    <Icon
                      color={theme === "dark" ? "#ffffff" : "#66768d"}
                      name="download"
                    />
                  )}
                </div>
                <div
                  className="article-view__action-btn"
                  onClick={handleCopyLink}
                >
                  <Icon
                    color={theme === "dark" ? "#ffffff" : "#66768d"}
                    name="share"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="article-view__separator" />

        {/* Hero image / PDF */}
        {!articleData.pdfUrl && (
          <img
            className="article-view__image"
            src={
              articleData.imageMedium ||
              articleData.imageThumbnail ||
              articleData.imageSmall ||
              "https://picsum.photos/300/400"
            }
            alt={articleData.title}
          />
        )}

        {articleData.pdfUrl && <PDFViewer pdfUrl={articleData.pdfUrl} />}
        {articleData.ttsUrl && (
          <div className="article-view__audio-item">
            <AudioPlayer src={articleData.ttsUrl} onPlay={handleAudioPlay} />
          </div>
        )}
        {/* Article body */}
        <div className="article-view__body">
          <Markdown
            markDownText={articleData.bodyCK || articleData.body}
            className={"text"}
          />
        </div>
      </div>
    </Block>
  );
};

ArticleView.propTypes = {
  /**
   * Article data
   * */
  articleData: propTypes.shape({
    title: propTypes.string,
    creator: propTypes.string,
    readingTime: propTypes.string,
    body: propTypes.string,
    ttsUrl: propTypes.string,
    labels: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string,
      })
    ),
  }).isRequired,
};

ArticleView.defaultProps = {
  articleData: {
    labels: [],
    title: "",
    creator: "",
    readingTime: 0,
    body: "",
  },
};
