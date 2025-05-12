import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Page } from "#blocks";
import { PodcastView } from "#blocks";

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
import { destructurePodcastData } from "@USupport-components-library/utils";

import "./podcast-information.scss";

/**
 * PodcastInformation
 *
 * Podcast information page
 *
 * @returns {JSX.Element}
 */
export const PodcastInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { i18n, t } = useTranslation("podcast-information-page");

  const getPodcastsIds = async () => {
    const podcastIds = await adminSvc.getPodcasts();
    return podcastIds;
  };

  const podcastIdsQuery = useQuery(["podcastIds"], getPodcastsIds);

  const getPodcastData = async () => {
    const contentRatings = await userSvc.getRatingsForContent({
      contentType: "podcast",
      contentId: id,
    });
    const { data } = await cmsSvc.getPodcastById(id, i18n.language);

    const finalData = destructurePodcastData(data);
    finalData.contentRating = contentRatings.data;
    return finalData;
  };

  const {
    data: podcastData,
    isLoading: isPodcastLoading,
    isFetching: isFetchingPodcastData,
  } = useQuery(["podcast", i18n.language, id], getPodcastData, {
    enabled: !!id,
  });

  const getSimilarPodcasts = async () => {
    let { data } = await cmsSvc.getPodcasts({
      limit: 3,
      categoryId: podcastData.categoryId,
      locale: i18n.language,
      excludeId: podcastData.id,
      populate: true,
      ids: podcastIdsQuery.data,
    });

    if (data.length === 0) {
      let { data: newest } = await cmsSvc.getPodcasts({
        limit: 3,
        sortBy: "createdAt",
        sortOrder: "desc",
        locale: i18n.language,
        excludeId: podcastData.id,
        populate: true,
        ids: podcastIdsQuery.data,
      });
      return newest.data;
    }
    return data.data;
  };

  const {
    data: morePodcasts,
    isLoading: isMorePodcastsLoading,
    isFetched: isMorePodcastsFetched,
  } = useQuery(["more-podcasts", id, i18n.language], getSimilarPodcasts, {
    enabled:
      !isFetchingPodcastData &&
      !podcastIdsQuery.isLoading &&
      podcastIdsQuery.data?.length > 0 &&
      podcastData &&
      podcastData.categoryId
        ? true
        : false,
  });

  const onPodcastClick = () => {
    window.scrollTo(0, 0);
  };
  return (
    <Page classes="page__podcast-information" showGoBackArrow={true}>
      {podcastData ? (
        <PodcastView podcastData={podcastData} t={t} />
      ) : (
        <Loading size="lg" />
      )}

      {!isMorePodcastsLoading && morePodcasts && morePodcasts.length > 0 && (
        <Block classes="page__podcast-information__more-podcasts">
          <Grid classes="page__podcast-information__more-podcasts__main-grid">
            <GridItem md={8} lg={12} classes="more-podcasts__heading-item">
              <h4>{t("more_podcasts")}</h4>
            </GridItem>
            {morePodcasts.map((podcast, index) => {
              const podcastData = destructurePodcastData(podcast);
              return (
                <GridItem
                  classes="page__podcast-information__more-podcasts-card"
                  key={index}
                >
                  <CardMedia
                    type="portrait"
                    size="sm"
                    style={{ gridColumn: "span 4" }}
                    title={podcastData.title}
                    image={podcastData.imageMedium}
                    description={podcastData.description}
                    labels={podcastData.labels}
                    creator={podcastData.creator}
                    categoryName={podcastData.categoryName}
                    contentType="podcasts"
                    likes={podcastData.likes || 0}
                    dislikes={podcastData.dislikes || 0}
                    t={t}
                    onClick={() => {
                      navigate(
                        `/${localStorage.getItem(
                          "language"
                        )}/information-portal/podcast/${podcastData.id}`
                      );
                      onPodcastClick();
                    }}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </Block>
      )}

      <Block>
        {!morePodcasts && isMorePodcastsLoading && !isPodcastLoading && (
          <Loading size="lg" />
        )}
      </Block>
    </Page>
  );
};
