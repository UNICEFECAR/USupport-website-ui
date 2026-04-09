import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import propTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Block, Icon, Label, Like } from "@USupport-components-library/src";
import {
  createArticleSlug,
  constructShareUrl,
  ThemeContext,
} from "@USupport-components-library/utils";
import { cmsSvc } from "@USupport-components-library/services";

import { useAddContentEngagement } from "#hooks";

import "./podcast-view.scss";

/**
 * PodcastView
 *
 * PodcastView block
 *
 * @return {jsx}
 */
export const PodcastView = ({ podcastData, t, language }) => {
  const { name } = useParams();
  const { theme } = useContext(ThemeContext);
  const creator = podcastData.creator ? podcastData.creator : null;

  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const addContentEngagementMutation = useAddContentEngagement();

  // Track view when podcast is loaded using useQuery
  useQuery(
    ["podcast-view-tracking", podcastData.id],
    async () => {
      addContentEngagementMutation({
        contentId: podcastData.id,
        contentType: "podcast",
        action: "view",
      });
      return true;
    },
    {
      enabled: !!podcastData?.id,
    }
  );

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [language]);

  useEffect(() => {
    if (podcastData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(podcastData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/${language}/information-portal/podcast/${podcastData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [podcastData?.title, name, language, hasUpdatedUrl]);

  const url = constructShareUrl({
    contentType: "podcast",
    id: podcastData.id,
    name: podcastData.title,
  });

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared) {
      cmsSvc.addPodcastShareCount(podcastData.id).then(() => {
        setIsShared(true);
      });
    }
    // Track share engagement
    addContentEngagementMutation({
      contentId: podcastData.id,
      contentType: "podcast",
      action: "share",
    });
  };

  return (
    <Block classes="podcast-view">
      <div className="podcast-view__content">
        <h2 className="podcast-view__title">{podcastData.title}</h2>

        <div className="podcast-view__meta">
          {podcastData.categoryName && (
            <div className="podcast-view__category-badge">
              <p className="small-text">{podcastData.categoryName}</p>
            </div>
          )}
          {creator && <p className="text podcast-view__creator">{t("by", { creator })}</p>}
        </div>

        {podcastData.labels?.length > 0 && (
          <div className="podcast-view__labels">
            {podcastData.labels.map((label, index) => (
              <Label
                classes="podcast-view__label"
                text={label.name}
                key={index}
              />
            ))}
          </div>
        )}

        <div className="podcast-view__separator" />

        <div className="podcast-view__actions">
          <div className="podcast-view__actions-left">
            <Like
              likes={podcastData.likes || 0}
              isLiked={podcastData.contentRating?.isLikedByUser || false}
              dislikes={podcastData.dislikes || 0}
              isDisliked={podcastData.contentRating?.isDislikedByUser || false}
            />
          </div>
          <div className="podcast-view__actions-right">
            <div className="podcast-view__action-btn" onClick={handleCopyLink}>
              <Icon
                color={theme === "dark" ? "#ffffff" : "#66768d"}
                name="share"
              />
            </div>
          </div>
        </div>

        <div className="podcast-view__separator" />

        <div className="podcast-view__player-container">
          <iframe
            src={`https://open.spotify.com/embed/${podcastData.spotifyId}`}
            width="100%"
            height="232"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Podcast Player"
          />
        </div>

        <div className="podcast-view__body">
          <p className="podcast-view__description-text">{podcastData.description}</p>
        </div>
      </div>
    </Block>
  );
};

PodcastView.propTypes = {
  /**
   * Podcast data
   * */
  podcastData: propTypes.shape({
    title: propTypes.string,
    creator: propTypes.string,
    description: propTypes.string,
    url: propTypes.string,
    labels: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string,
      })
    ),
  }).isRequired,
};

PodcastView.defaultProps = {
  podcastData: {
    labels: [],
    title: "",
    creator: "",
    description: "",
    url: "",
  },
};
