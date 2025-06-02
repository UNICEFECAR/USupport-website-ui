import React, { useContext, useState } from "react";
import propTypes from "prop-types";
import { toast } from "react-toastify";

import {
  Block,
  Grid,
  GridItem,
  ActionButton,
  Label,
  Like,
} from "@USupport-components-library/src";
import { cmsSvc } from "@USupport-components-library/services";
import { ThemeContext } from "@USupport-components-library/utils";

import "./podcast-view.scss";

const countriesMap = {
  global: "global",
  kz: "kazakhstan",
  pl: "poland",
  ro: "romania",
};

const constructShareUrl = ({ contentType, id }) => {
  const country = localStorage.getItem("country");
  const language = localStorage.getItem("language");
  const subdomain = window.location.hostname.split(".")[0];

  if (subdomain === "staging") {
    return `https://staging.usupport.online/${language}/information-portal/${contentType}/${id}`;
  }

  if (country === "global") {
    return `https://usupport.online/${language}/information-portal/${contentType}/${id}`;
  }
  const countryName = countriesMap[country.toLocaleLowerCase()];

  if (window.location.hostname.includes("staging")) {
    return `https://${countryName}.staging.usupport.online/${language}/information-portal/${contentType}/${id}`;
  }
  const url = `https://${countryName}.usupport.online/${language}/information-portal/${contentType}/${id}`;
  return url;
};

/**
 * PodcastView
 *
 * PodcastView block
 *
 * @return {jsx}
 */
export const PodcastView = ({ podcastData, t }) => {
  const creator = podcastData.creator ? podcastData.creator : null;
  const [isShared, setIsShared] = useState(false);

  const url = constructShareUrl({
    contentType: "podcast",
    id: podcastData.id,
  });

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared)
      cmsSvc.addPodcastShareCount(podcastData.id).then(() => {
        setIsShared(true);
      });
  };

  return (
    <Block classes="podcast-view">
      <Grid classes="podcast-view__main-grid">
        <GridItem md={8} lg={12} classes="podcast-view__title-item">
          <div className="podcast-view__title-item__container">
            <h3>{podcastData.title}</h3>
            <ActionButton iconName="share" onClick={handleCopyLink} />
          </div>
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
