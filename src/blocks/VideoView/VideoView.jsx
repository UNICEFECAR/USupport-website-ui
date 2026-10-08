import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import propTypes from "prop-types";
import ReactHlsPlayer from "react-hls-player";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  Block,
  Button,
  Icon,
  Label,
  Like,
} from "@USupport-components-library/src";
import {
  createArticleSlug,
  constructShareUrl,
  ThemeContext,
} from "@USupport-components-library/utils";
import { cmsSvc } from "@USupport-components-library/services";

import { useAddContentEngagement } from "#hooks";

import "./video-view.scss";

/**
 * VideoView
 *
 * VideoView block
 *
 * @return {jsx}
 */
export const VideoView = ({ videoData, t, language }) => {
  const creator = videoData.creator ? videoData.creator : null;
  const { cookieState, setCookieState, theme } = useContext(ThemeContext);
  const DISPLAY_VIDEO = cookieState.hasAcceptedCookies;
  const IS_PS = localStorage.getItem("country") === "PS";
  const IS_RTL = localStorage.getItem("language") === "ar";

  const { name } = useParams();

  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const addContentEngagementMutation = useAddContentEngagement();

  // Track view when video is loaded using useQuery
  useQuery(
    ["video-view-tracking", videoData.id],
    async () => {
      addContentEngagementMutation({
        contentId: videoData.id,
        contentType: "video",
        action: "view",
      });
      return true;
    },
    {
      enabled: !!videoData?.id,
    }
  );

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [language]);

  useEffect(() => {
    if (videoData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(videoData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/${language}/information-portal/video/${videoData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [videoData?.title, name, language, hasUpdatedUrl]);

  const handleOpenCookieBanner = () => {
    setCookieState({
      ...cookieState,
      isBannerOpen: true,
    });
  };

  const renderVideoEmbed = () => {
    if (!videoData || (!videoData.videoId && !videoData.awsUrl)) return null;

    if (!DISPLAY_VIDEO) {
      return (
        <div className="video-view__cookie-banner">
          <p>{t("require_cookies")}</p>
          <Button
            onClick={handleOpenCookieBanner}
            color="purple"
            size="sm"
            label={t("cookie_preferences")}
          />
        </div>
      );
    }

    if (videoData.awsUrl) {
      return (
        <div className="video-view__embed-container">
          <ReactHlsPlayer
            src={videoData.awsUrl}
            autoPlay={false}
            controls={true}
            width="100%"
            height="auto"
            hlsConfig={{
              startLevel: -1,
              capLevelOnFPSDrop: true,
            }}
          />
        </div>
      );
    }

    return (
      <div className="video-view__embed-container">
        <iframe
          src={
            videoData.originalUrl.includes("vimeo.com")
              ? `https://player.vimeo.com/video/${videoData.videoId}`
              : `https://www.youtube.com/embed/${videoData.videoId}`
          }
          title={videoData.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const url = constructShareUrl({
    contentType: "video",
    id: videoData.id,
    name: videoData.title,
  });

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared) {
      cmsSvc.addVideoShareCount(videoData.id).then(() => {
        setIsShared(true);
      });

      // Track share engagement
      addContentEngagementMutation({
        contentId: videoData.id,
        contentType: "video",
        action: "share",
      });
    }
  };

  return (
    <Block classes={`video-view ${IS_RTL ? "video-view--rtl" : ""}`}>
      <div className="video-view__content">
        <h2 className="video-view__title">{videoData.title}</h2>

        <div className="video-view__meta">
          {videoData.categoryName && (
            <div className="video-view__category-badge">
              <p className="small-text">{videoData.categoryName}</p>
            </div>
          )}
          {creator && <p className="text video-view__creator">{t("by", { creator })}</p>}
        </div>

        {videoData.labels?.length > 0 && (
          <div className="video-view__labels">
            {videoData.labels.map((label, index) => (
              <Label classes={"video-view__label"} text={label.name} key={index} />
            ))}
          </div>
        )}

        <div className="video-view__separator" />

        <div className="video-view__actions">
          <div className="video-view__actions-left">
            {!IS_PS && (
              <Like
                likes={videoData.likes || 0}
                isLiked={videoData.contentRating?.isLikedByUser || false}
                dislikes={videoData.dislikes || 0}
                isDisliked={videoData.contentRating?.isDislikedByUser || false}
              />
            )}
          </div>
          <div className="video-view__actions-right">
            <div className="video-view__action-btn" onClick={handleCopyLink}>
              <Icon
                color={theme === "dark" ? "#ffffff" : "#66768d"}
                name="share"
              />
            </div>
          </div>
        </div>

        <div className="video-view__separator" />

        <div className="video-view__embed-item">{renderVideoEmbed()}</div>

        <div className="video-view__body">
          <p className="video-view__description-text">{videoData.description}</p>
        </div>
      </div>
    </Block>
  );
};

VideoView.propTypes = {
  /**
   * Video data
   * */
  videoData: propTypes.shape({
    title: propTypes.string,
    creator: propTypes.string,
    description: propTypes.string,
    videoId: propTypes.string,
    labels: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string,
      })
    ),
  }).isRequired,
};

VideoView.defaultProps = {
  videoData: {
    labels: [],
    title: "",
    creator: "",
    description: "",
    videoId: "",
  },
};
