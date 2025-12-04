import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import propTypes from "prop-types";
import ReactHlsPlayer from "react-hls-player";
import { useQuery } from "@tanstack/react-query";

import {
  Block,
  Button,
  Grid,
  GridItem,
  Label,
  Like,
} from "@USupport-components-library/src";
import {
  createArticleSlug,
  ThemeContext,
} from "@USupport-components-library/utils";

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
  const { cookieState, setCookieState } = useContext(ThemeContext);
  const DISPLAY_VIDEO = cookieState.hasAcceptedCookies;
  const IS_PS = localStorage.getItem("country") === "PS";
  const IS_RTL = localStorage.getItem("language") === "ar";

  const { name } = useParams();

  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);

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

  return (
    <Block classes={`video-view ${IS_RTL ? "video-view--rtl" : ""}`}>
      <Grid classes="video-view__main-grid">
        <GridItem md={8} lg={12} classes="video-view__title-item">
          <h3>{videoData.title}</h3>
        </GridItem>

        <GridItem md={8} lg={12} classes="video-view__details-item">
          {creator && <p className={"small-text"}>{t("by", { creator })}</p>}

          <div className="video-view__details-item__category">
            <p className="small-text ">{videoData.categoryName}</p>
          </div>
        </GridItem>

        <GridItem xs={3} md={6} lg={8} classes="video-view__labels-item">
          {videoData.labels &&
            videoData.labels.map((label, index) => {
              return (
                <Label
                  classes={"video-view__label"}
                  text={label.name}
                  key={index}
                />
              );
            })}
        </GridItem>

        {!IS_PS && (
          <GridItem xs={1} md={2} lg={4} classes="video-view__like-item">
            <Like
              likes={videoData.likes || 0}
              isLiked={videoData.contentRating?.isLikedByUser || false}
              dislikes={videoData.dislikes || 0}
              isDisliked={videoData.contentRating?.isDislikedByUser || false}
            />
          </GridItem>
        )}

        <GridItem md={8} lg={12} classes="video-view__embed-item">
          {renderVideoEmbed()}
        </GridItem>

        <GridItem md={8} lg={12} classes="video-view__description-item">
          <p className="video-view__description-text">
            {videoData.description}
          </p>
        </GridItem>
      </Grid>
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
