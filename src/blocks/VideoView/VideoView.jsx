import React from "react";
import propTypes from "prop-types";
import {
  Block,
  Grid,
  GridItem,
  Label,
  Like,
} from "@USupport-components-library/src";

import "./video-view.scss";

/**
 * VideoView
 *
 * VideoView block
 *
 * @return {jsx}
 */
export const VideoView = ({ videoData, t }) => {
  const creator = videoData.creator ? videoData.creator : null;

  // Function to render YouTube embed
  const renderVideoEmbed = () => {
    if (!videoData || !videoData.videoId) return null;

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
    <Block classes="video-view">
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

        <GridItem xs={1} md={2} lg={4} classes="video-view__like-item">
          <Like
            likes={videoData.likes || 0}
            isLiked={videoData.contentRating?.isLikedByUser || false}
            dislikes={videoData.dislikes || 0}
            isDisliked={videoData.contentRating?.isDislikedByUser || false}
          />
        </GridItem>

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
