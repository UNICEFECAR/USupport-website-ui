import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Page } from "#blocks";
import { VideoView } from "#blocks";

import {
  Block,
  Grid,
  GridItem,
  CardMedia,
  Loading,
} from "@USupport-components-library/src";
import {
  cmsSvc,
  adminSvc,
  userSvc,
} from "@USupport-components-library/services";
import { destructureVideoData } from "@USupport-components-library/utils";

import "./video-information.scss";

/**
 * VideoInformation
 *
 * Video information page
 *
 * @returns {JSX.Element}
 */
export const VideoInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { i18n, t } = useTranslation("pages", {
    keyPrefix: "video-information-page",
  });

  const getVideosIds = async () => {
    const videoIds = await adminSvc.getVideos();
    return videoIds;
  };

  const videoIdsQuery = useQuery(["videoIds"], getVideosIds);

  const getVideoData = async () => {
    const contentRatings = await userSvc.getRatingsForContent({
      contentType: "video",
      contentId: id,
    });
    const { data } = await cmsSvc.getVideoById(id, i18n.language);

    const finalData = destructureVideoData(data);
    finalData.contentRating = contentRatings.data;
    return finalData;
  };

  const {
    data: videoData,
    isLoading: isVideoLoading,
    isFetching: isFetchingVideoData,
    isFetched,
  } = useQuery(["video", i18n.language, id], getVideoData, {
    enabled: !!id,
  });

  const getSimilarVideos = async () => {
    let { data } = await cmsSvc.getVideos({
      limit: 3,
      categoryId: videoData.categoryId,
      locale: i18n.language,
      excludeId: videoData.id,
      populate: true,
      ids: videoIdsQuery.data,
    });

    if (data.length === 0) {
      let { data: newest } = await cmsSvc.getVideos({
        limit: 3,
        sortBy: "createdAt", // Sort by created date
        sortOrder: "desc", // Sort in descending order
        locale: i18n.language,
        excludeId: videoData.id,
        populate: true,
        ids: videoIdsQuery.data,
      });
      return newest.data;
    }
    return data.data;
  };

  const {
    data: moreVideos,
    isLoading: isMoreVideosLoading,
    isFetched: isMoreVideosFetched,
  } = useQuery(["more-videos", id, i18n.language], getSimilarVideos, {
    enabled:
      !isFetchingVideoData &&
      !videoIdsQuery.isLoading &&
      videoIdsQuery.data?.length > 0 &&
      videoData &&
      videoData.categoryId
        ? true
        : false,
  });

  const onVideoClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Page classes="page__video-information" showGoBackArrow={true}>
      {videoData ? (
        <VideoView videoData={videoData} t={t} language={i18n.language} />
      ) : isFetched ? (
        <h3 className="page__video-information__no-results">
          {t("not_found")}
        </h3>
      ) : (
        <Loading size="lg" />
      )}

      {!isMoreVideosLoading && moreVideos && moreVideos.length > 0 && (
        <Block classes="page__video-information__more-videos">
          <Grid classes="page__video-information__more-videos__main-grid">
            <GridItem md={8} lg={12} classes="more-videos__heading-item">
              <h4>{t("more_videos")}</h4>
            </GridItem>
            {moreVideos.map((video, index) => {
              const videoData = destructureVideoData(video);

              return (
                <GridItem
                  classes="page__video-information__more-videos-card"
                  key={index}
                >
                  <CardMedia
                    type="portrait"
                    size="sm"
                    style={{ gridColumn: "span 4" }}
                    title={videoData.title}
                    image={videoData.imageMedium}
                    description={videoData.description}
                    labels={videoData.labels}
                    creator={videoData.creator}
                    categoryName={videoData.categoryName}
                    contentType="videos"
                    likes={videoData.likes || 0}
                    dislikes={videoData.dislikes || 0}
                    t={t}
                    onClick={() => {
                      navigate(
                        `/${localStorage.getItem(
                          "language"
                        )}/information-portal/video/${videoData.id}`
                      );
                      onVideoClick();
                    }}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </Block>
      )}
    </Page>
  );
};
