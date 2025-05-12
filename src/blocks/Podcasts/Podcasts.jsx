import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  InputSearch,
  Tabs,
  Loading,
} from "@USupport-components-library/src";
import {
  destructurePodcastData,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useDebounce, useEventListener } from "#hooks";
import { ThemeContext } from "@USupport-components-library/utils";

import "./podcasts.scss";

/**
 * Podcasts
 *
 * Information portal podcasts
 *
 * @return {jsx}
 */
export const Podcasts = () => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { i18n, t } = useTranslation("articles");
  const { theme } = useContext(ThemeContext);

  const isNotDescktop = width < 1366;
  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Categories ----------------------//
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const getCategories = async () => {
    try {
      const res = await cmsSvc.getCategories(usersLanguage);
      let categoriesData = [
        { label: t("all"), value: "all", isSelected: true },
      ];
      res.data.map((category) =>
        categoriesData.push({
          label: category.attributes.name,
          value: category.attributes.name,
          id: category.id,
          isSelected: false,
        })
      );

      setSelectedCategory(categoriesData[0]);
      return categoriesData;
    } catch (err) {
      console.log(err, "Error when calling getCategories");
      return [];
    }
  };

  const categoriesQuery = useQuery(
    ["podcasts-categories", usersLanguage],
    getCategories,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCategories([...data]);
      },
    }
  );

  const handleCategoryOnPress = (index) => {
    const categoriesCopy = [...categories];
    for (let i = 0; i < categoriesCopy.length; i++) {
      if (i === index) {
        categoriesCopy[i].isSelected = true;
        setSelectedCategory(categoriesCopy[i]);
      } else {
        categoriesCopy[i].isSelected = false;
      }
    }
    setCategories(categoriesCopy);
  };

  //--------------------- Search Input ----------------------//
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const shouldFetchIds = !!(currentCountry && currentCountry !== "global");

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country !== currentCountry) {
      setCurrentCountry(country);
    }
  }, [currentCountry]);

  useEventListener("countryChanged", handler);

  //--------------------- Podcasts ----------------------//
  const getPodcastsIds = async () => {
    const podcastIds = await adminSvc.getPodcasts();
    return podcastIds;
  };

  const podcastIdsQuery = useQuery(
    ["podcastIds", currentCountry, shouldFetchIds],
    getPodcastsIds,
    {
      enabled: true,
    }
  );

  console.log(podcastIdsQuery.error);

  const getPodcastsData = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let queryParams = {
      limit: 12,
      contains: debouncedSearchValue,
      categoryId,
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = podcastIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    const { data } = await cmsSvc.getPodcasts(queryParams);
    return data.data || [];
  };

  const {
    data: podcasts,
    isLoading: isPodcastsLoading,
    isFetching: isPodcastsFetching,
  } = useQuery(
    [
      "podcasts",
      debouncedSearchValue,
      selectedCategory,
      podcastIdsQuery.data,
      usersLanguage,
      shouldFetchIds,
    ],
    getPodcastsData,
    {
      enabled:
        (shouldFetchIds
          ? !podcastIdsQuery.isLoading && !!podcastIdsQuery.data
          : true) && !!selectedCategory,
    }
  );

  //--------------------- Newest Podcast ----------------------//
  const getNewestPodcast = async () => {
    let queryParams = {
      limit: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
      locale: usersLanguage,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = podcastIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    let { data } = await cmsSvc.getPodcasts(queryParams);

    if (!data.data || !data.data[0]) return null;
    return destructurePodcastData(data.data[0]);
  };

  const { data: newestPodcast, isLoading: isNewestPodcastLoading } = useQuery(
    ["newestPodcast", usersLanguage, currentCountry, shouldFetchIds],
    getNewestPodcast,
    {
      enabled: shouldFetchIds
        ? !podcastIdsQuery.isLoading && !!podcastIdsQuery.data
        : true,
      refetchOnWindowFocus: false,
    }
  );

  const handleRedirect = (id) => {
    navigate(
      `/${localStorage.getItem("language")}/information-portal/podcast/${id}`
    );
  };

  // Simplified loading state
  const isLoading =
    isPodcastsLoading ||
    isPodcastsFetching ||
    isNewestPodcastLoading ||
    (shouldFetchIds && podcastIdsQuery.isLoading);

  // Simplified empty state detection
  const hasNoData =
    !isLoading &&
    ((shouldFetchIds && !podcastIdsQuery.data?.length) ||
      (!podcasts?.length && !newestPodcast));
  console.log(newestPodcast);
  return (
    <Block classes="podcasts">
      {hasNoData && (
        <div className="podcasts__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
        </div>
      )}

      <Grid classes="podcasts__main-grid">
        <GridItem md={8} lg={12} classes="podcasts__heading-item">
          {theme === "dark" && (
            <h2 className="podcasts__heading-text">{t("heading")}</h2>
          )}
        </GridItem>

        {isNewestPodcastLoading ? (
          <GridItem md={8} lg={12} classes="podcasts__most-important-item">
            <Loading />
          </GridItem>
        ) : (
          newestPodcast && (
            <GridItem md={8} lg={12} classes="podcasts__most-important-item">
              <CardMedia
                type={isNotDescktop ? "portrait" : "landscape"}
                size="lg"
                title={newestPodcast.title}
                image={newestPodcast.imageMedium}
                description={newestPodcast.description}
                labels={newestPodcast.labels}
                creator={newestPodcast.creator}
                contentType="podcasts"
                categoryName={newestPodcast.categoryName}
                showDescription={true}
                likes={newestPodcast.likes}
                dislikes={newestPodcast.dislikes}
                t={t}
                onClick={() => handleRedirect(newestPodcast.id)}
              />
            </GridItem>
          )
        )}

        <GridItem md={8} lg={12} classes="podcasts__search-item">
          <InputSearch onChange={handleInputChange} value={searchValue} />
        </GridItem>

        {categories && (
          <GridItem md={8} lg={12} classes="podcasts__categories-item">
            <Tabs
              options={categories}
              handleSelect={handleCategoryOnPress}
              t={t}
            />
          </GridItem>
        )}

        <GridItem md={8} lg={12} classes="podcasts__podcasts-item">
          {podcastIdsQuery.isLoading || isPodcastsLoading ? (
            <Loading />
          ) : podcasts?.length > 0 ? (
            <Grid>
              {podcasts.map((podcast, index) => {
                const podcastData = destructurePodcastData(podcast);
                return (
                  <GridItem key={index}>
                    <CardMedia
                      type="portrait"
                      size="sm"
                      style={{ gridColumn: "span 4" }}
                      title={podcastData.title}
                      image={podcastData.imageMedium}
                      description={podcastData.description}
                      labels={podcastData.labels}
                      likes={podcastData.likes || 0}
                      dislikes={podcastData.dislikes || 0}
                      contentType="podcasts"
                      t={t}
                      categoryName={podcastData.categoryName}
                      onClick={() => handleRedirect(podcastData.id)}
                    />
                  </GridItem>
                );
              })}
            </Grid>
          ) : (
            <div className="podcasts__no-results-container">
              <p>{t("no_results")}</p>
            </div>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};

export default Podcasts;
