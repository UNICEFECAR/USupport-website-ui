import { useParams, useNavigate, Navigate } from "react-router-dom";
import React, { useContext } from "react";
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
import {
  destructurePodcastData,
  ThemeContext,
  getLikesAndDislikesForContent,
} from "@USupport-components-library/utils";

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
  const { i18n, t } = useTranslation("pages", {
    keyPrefix: "podcast-information-page",
  });

  const { isPodcastsActive } = useContext(ThemeContext);

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

    const finalData = await destructurePodcastData(data);
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

  const {
    data: podcastContentEngagements,
    isLoading: isPodcastContentEngagementsLoading,
  } = useQuery(
    ["podcastContentEngagements", id],
    async () => {
      const { likes, dislikes } = await getLikesAndDislikesForContent(
        [Number(id)],
        "podcast"
      );
      return {
        likes: likes.get(Number(id)) || 0,
        dislikes: dislikes.get(Number(id)) || 0,
      };
    },
    {
      enabled: !!id,
    }
  );

  const getSimilarPodcasts = async () => {
    let { data } = await cmsSvc.getPodcasts({
      limit: 3,
      categoryId: podcastData.categoryId,
      locale: i18n.language,
      excludeId: podcastData.id,
      populate: true,
      ids: podcastIdsQuery.data,
    });

    let podcastsData = data.data || [];
    if (podcastsData.length === 0) {
      let { data: newest } = await cmsSvc.getPodcasts({
        limit: 3,
        sortBy: "createdAt",
        sortOrder: "desc",
        locale: i18n.language,
        excludeId: podcastData.id,
        populate: true,
        ids: podcastIdsQuery.data,
      });
      podcastsData = newest.data || [];
    }

    if (!podcastsData.length) return [];

    const podcastIds = podcastsData.map((podcast) => podcast.id);
    const { likes, dislikes } = await getLikesAndDislikesForContent(
      podcastIds,
      "podcast"
    );

    // Process podcasts with async destructurePodcastData and attach metrics
    const processedPodcasts = await Promise.all(
      podcastsData.map(async (podcast) => {
        const base = await destructurePodcastData(podcast);
        return {
          ...base,
          likes: likes.get(podcast.id) || 0,
          dislikes: dislikes.get(podcast.id) || 0,
        };
      })
    );
    return processedPodcasts;
  };

  const { data: morePodcasts, isLoading: isMorePodcastsLoading } = useQuery(
    ["more-podcasts", id, i18n.language],
    getSimilarPodcasts,
    {
      enabled:
        !isFetchingPodcastData &&
        !podcastIdsQuery.isLoading &&
        podcastIdsQuery.data?.length > 0 &&
        podcastData &&
        podcastData.categoryId
          ? true
          : false,
    }
  );

  const onPodcastClick = () => {
    window.scrollTo(0, 0);
  };

  const isLoading = isPodcastLoading || isPodcastContentEngagementsLoading;

  if (!isPodcastsActive) {
    return (
      <Navigate
        to={`/${localStorage.getItem(
          "language"
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page classes="page__podcast-information" showGoBackArrow={true}>
      {podcastData && !isLoading ? (
        <PodcastView
          podcastData={{
            ...podcastData,
            likes: podcastContentEngagements?.likes || 0,
            dislikes: podcastContentEngagements?.dislikes || 0,
          }}
          t={t}
          language={i18n.language}
        />
      ) : isFetchingPodcastData || isLoading ? (
        <Loading size="lg" />
      ) : (
        <h3 className="page__podcast-information__no-results">
          {t("not_found")}
        </h3>
      )}

      {!isMorePodcastsLoading && morePodcasts && morePodcasts.length > 0 && (
        <Block classes="page__podcast-information__more-podcasts">
          <Grid classes="page__podcast-information__more-podcasts__main-grid">
            <GridItem md={8} lg={12} classes="more-podcasts__heading-item">
              <h4>{t("more_podcasts")}</h4>
            </GridItem>
            {morePodcasts.map((podcast, index) => {
              // Podcast data is already processed in getSimilarPodcasts
              const podcastData = podcast;
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
    </Page>
  );
};
