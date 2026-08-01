import { useParams, useNavigate, Navigate } from "react-router-dom";
import React, { useContext, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Page } from "#blocks";
import { PodcastView } from "#blocks";

import {
  Block,
  CardMediaVideo,
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
  createArticleSlug,
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
  const mainScrollRef = useRef(null);
  const sidebarScrollRef = useRef(null);
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
        "podcast",
      );
      return {
        likes: likes.get(Number(id)) || 0,
        dislikes: dislikes.get(Number(id)) || 0,
      };
    },
    {
      enabled: !!id,
    },
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
      "podcast",
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
      }),
    );
    return processedPodcasts;
  };

  const {
    data: morePodcasts,
    isLoading: isMorePodcastsLoading,
    isFetched: isMorePodcastsFetched,
    isFetching: isMorePodcastsFetching,
  } = useQuery(["more-podcasts", id, i18n.language], getSimilarPodcasts, {
    enabled:
      !isFetchingPodcastData &&
      !podcastIdsQuery.isLoading &&
      podcastIdsQuery.data?.length > 0 &&
      !!podcastData &&
      !!podcastData.categoryId,
  });

  useEffect(() => {
    const sidebarEl = sidebarScrollRef.current;
    const mainEl = mainScrollRef.current;

    if (!sidebarEl || !mainEl) {
      return;
    }

    const handleScroll = () => {
      const podcastHeight = mainEl.scrollHeight;
      const podcastTop = mainEl.offsetTop;
      const viewportHeight = window.innerHeight;

      const maxPodcastScroll =
        podcastHeight > viewportHeight ? podcastHeight - viewportHeight : 1;

      const currentPodcastScroll = window.scrollY - podcastTop;

      const ratio = Math.min(
        1,
        Math.max(0, currentPodcastScroll / (maxPodcastScroll || 1)),
      );

      const sidebarScrollable = sidebarEl.scrollHeight - sidebarEl.clientHeight;

      if (sidebarScrollable <= 0) return;

      sidebarEl.scrollTop = ratio * sidebarScrollable;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [podcastData, morePodcasts?.length]);

  const onPodcastClick = () => {
    window.scrollTo(0, 0);
  };

  const isLoading = isPodcastLoading || isPodcastContentEngagementsLoading;

  const renderSidebar = () => {
    if (!isMorePodcastsLoading && morePodcasts?.length > 0) {
      return (
        <aside
          className="page__podcast-information__sidebar"
          ref={sidebarScrollRef}
        >
          <h4 className="page__podcast-information__sidebar__heading">
            {t("more_podcasts")}
          </h4>
          {morePodcasts.map((podcast, index) => {
            const podcastData = podcast;
            return (
              <CardMediaVideo
                key={index}
                type="portrait"
                size="sm"
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
                      "language",
                    )}/information-portal/podcast/${
                      podcastData.id
                    }/${createArticleSlug(podcastData.title)}`,
                  );
                  onPodcastClick();
                }}
              />
            );
          })}
        </aside>
      );
    }

    if (!morePodcasts && isMorePodcastsLoading && isMorePodcastsFetching) {
      return (
        <aside
          className="page__podcast-information__sidebar"
          ref={sidebarScrollRef}
        >
          <Loading size="lg" />
        </aside>
      );
    }

    return null;
  };

  if (!isPodcastsActive) {
    return (
      <Navigate
        to={`/${localStorage.getItem(
          "language",
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page
      classes="page__podcast-information"
      showGoBackArrow={true}
      showBackground={true}
    >
      <Block classes="page__podcast-information__block">
        <div className="page__podcast-information__layout">
          <div className="page__podcast-information__main" ref={mainScrollRef}>
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
          </div>
          {renderSidebar()}
        </div>

        {!morePodcasts?.length &&
          !isMorePodcastsLoading &&
          isMorePodcastsFetched && (
            <h3 className="page__podcast-information__no-results">
              {t("no_results")}
            </h3>
          )}
      </Block>
    </Page>
  );
};
