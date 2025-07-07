import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import propTypes from "prop-types";
import { toast } from "react-toastify";

import {
  Block,
  Grid,
  GridItem,
  Icon,
  Label,
  Markdown,
  Like,
  Loading,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import {
  ThemeContext,
  createArticleSlug,
} from "@USupport-components-library/utils";

import "./article-view.scss";

const countriesMap = {
  global: "global",
  kz: "kazakhstan",
  pl: "poland",
  ro: "romania",
};

const constructShareUrl = ({ contentType, id, name }) => {
  const country = localStorage.getItem("country");
  const language = localStorage.getItem("language");
  const subdomain = window.location.hostname.split(".")[0];
  const nameSlug = createArticleSlug(name);

  if (subdomain === "staging") {
    return `https://staging.usupport.online/${language}/information-portal/${contentType}/${id}/${nameSlug}`;
  }

  if (country === "global") {
    return `https://usupport.online/${language}/information-portal/${contentType}/${id}/${nameSlug}`;
  }
  const countryName = countriesMap[country.toLocaleLowerCase()];

  if (window.location.hostname.includes("staging")) {
    return `https://${countryName}.staging.usupport.online/${language}/information-portal/${contentType}/${id}/${nameSlug}`;
  }
  const url = `https://${countryName}.usupport.online/${language}/information-portal/${contentType}/${id}/${nameSlug}`;
  return url;
};

/**
 * ArticleView
 *
 * ArticleView block
 *
 * @return {jsx}
 */
export const ArticleView = ({ articleData, i18n }) => {
  const { t } = i18n;
  const { name } = useParams();

  const creator = articleData.creator ? articleData.creator : null;
  const { theme } = useContext(ThemeContext);

  // const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);

  const url = constructShareUrl({
    contentType: "article",
    id: articleData.id,
    name: articleData.title,
  });

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [i18n.language]);

  useEffect(() => {
    if (articleData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(articleData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/${i18n.language}/information-portal/article/${articleData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [articleData?.title, name, i18n.language, hasUpdatedUrl]);

  const handleExportToPdf = async () => {
    const language = localStorage.getItem("language") || "en";
    try {
      setIsExportingPdf(true);
      // Get CMS API URL where the article can be accessed with nested image data
      const apiUrl = `${import.meta.env.VITE_CMS_API_URL}/articles/${
        articleData.id
      }?locale=${language}&populate=creator,category,labels,thumbnail.formats,image`;

      // Make the fetch call
      const response = await userSvc.generatePdf({
        contentUrl: apiUrl,
        contentType: "article",
        title: articleData.title,
        // Add image URL info to help server locate it
        imageUrl: articleData.imageMedium || articleData.image,
      });

      if (response.status !== 200) {
        throw new Error(`Error generating PDF: ${response.statusText}`);
      }

      // Get the PDF blob
      const blob = response.data;

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${articleData.title.replace(/\s+/g, "_")}.pdf`
      );

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
  };

  return (
    <Block classes="article-view">
      <Grid classes="article-view__main-grid">
        <GridItem md={8} lg={12} classes="article-view__title-item">
          <div className="article-view__title-row">
            <h3>{articleData.title}</h3>
          </div>
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__category-item">
          <div className="article-view__details-item__category">
            <p className="small-text ">{articleData.categoryName}</p>
          </div>
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__details-item">
          {creator && <p className={"small-text"}>{t("by", { creator })}</p>}

          <Icon
            color={theme === "dark" ? "#ffffff" : "#66768d"}
            name={"time"}
            size="sm"
          />
          <p className={"small-text"}>
            {" "}
            {articleData.readingTime} {t("min_read")}
          </p>

          <div
            onClick={handleExportToPdf}
            className="article-view__details-item__download"
          >
            {isExportingPdf ? (
              <Loading padding="0px" size="sm" />
            ) : (
              <Icon
                color={theme === "dark" ? "#ffffff" : "#66768d"}
                name="download"
                size="sm"
              />
            )}
          </div>
          <div
            className="article-view__details-item__download"
            onClick={handleCopyLink}
          >
            <Icon
              color={theme === "dark" ? "#ffffff" : "#66768d"}
              name="share"
              size="sm"
            />
          </div>
        </GridItem>

        <GridItem xs={3} md={6} lg={8} classes="article-view__labels-item">
          {articleData.labels.map((label, index) => {
            return (
              <Label
                classes={"article-view__label"}
                text={label.name}
                key={index}
              />
            );
          })}
        </GridItem>

        <GridItem xs={1} md={2} lg={4} classes="article-view__like-item">
          <Like
            likes={articleData.likes || 0}
            isLiked={articleData.contentRating?.isLikedByUser || false}
            dislikes={articleData.dislikes || 0}
            isDisliked={articleData.contentRating?.isDislikedByUser || false}
          />
        </GridItem>

        <GridItem md={8} lg={12}>
          <img
            className="article-view__image-item"
            src={
              articleData.imageMedium
                ? articleData.imageMedium
                : "https://picsum.photos/300/400"
            }
            alt=""
          />
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__body-item">
          <Markdown markDownText={articleData.body} className={"text"} />
        </GridItem>
      </Grid>

      {/* <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        contentUrl={url}
        title={articleData.title}
        shareTitle={t("share_title")}
        successText={t("share_success")}
        copyText={t("copy_link")}
      /> */}
    </Block>
  );
};

ArticleView.propTypes = {
  /**
   * Article data
   * */
  articleData: propTypes.shape({
    title: propTypes.string,
    creator: propTypes.string,
    readingTime: propTypes.string,
    body: propTypes.string,
    labels: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string,
      })
    ),
  }).isRequired,
};

ArticleView.defaultProps = {
  articleData: {
    labels: [],
    title: "",
    creator: "",
    readingTime: 0,
    body: "",
  },
};
