import React from "react";
import propTypes from "prop-types";
import { useParams } from "react-router-dom";

import {
  Block,
  Grid,
  GridItem,
  Label,
  Like,
} from "@USupport-components-library/src";
import { createArticleSlug } from "@USupport-components-library/utils";

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
  const creator = podcastData.creator ? podcastData.creator : null;

  const [hasUpdatedUrl, setHasUpdatedUrl] = React.useState(false);

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [i18n.language]);

  useEffect(() => {
    if (podcastData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(podcastData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/${i18n.language}/information-portal/article/${videoData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [podcastData?.title, name, i18n.language, hasUpdatedUrl]);

  return (
    <Block classes="podcast-view">
      <Grid classes="podcast-view__main-grid">
        <GridItem md={8} lg={12} classes="podcast-view__title-item">
          <h3>{podcastData.title}</h3>
        </GridItem>

        <GridItem md={8} lg={12} classes="podcast-view__details-item">
          {creator && <p className={"small-text"}>{t("by", { creator })}</p>}

          <div className="podcast-view__details-item__category">
            <p className="small-text ">{podcastData.categoryName}</p>
          </div>
        </GridItem>

        <GridItem xs={3} md={6} lg={8} classes="podcast-view__labels-item">
          {podcastData.labels &&
            podcastData.labels.map((label, index) => {
              return (
                <Label
                  classes={"podcast-view__label"}
                  text={label.name}
                  key={index}
                />
              );
            })}
        </GridItem>

        <GridItem xs={1} md={2} lg={4} classes="podcast-view__like-item">
          <Like
            likes={podcastData.likes || 0}
            isLiked={podcastData.contentRating?.isLikedByUser || false}
            dislikes={podcastData.dislikes || 0}
            isDisliked={podcastData.contentRating?.isDislikedByUser || false}
          />
        </GridItem>

        <GridItem md={8} lg={12} classes="podcast-view__player-item">
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
        </GridItem>

        <GridItem md={8} lg={12} classes="podcast-view__description-item">
          <p className="podcast-view__description-text">
            {podcastData.description}
          </p>
        </GridItem>
      </Grid>
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
