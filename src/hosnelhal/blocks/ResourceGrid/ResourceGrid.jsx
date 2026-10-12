import React from "react";
import { useTranslation } from "react-i18next";

import {
  HHCardGrid,
  HHLoadingRegion,
  HHResourceCard,
  HHResourceCardSkeleton,
} from "@USupport-components-library/src/hosnelhal";

import { useHosnPath } from "../../hooks/useHosnPath";
import { getLengthLabel } from "../../utils/assets";

import "./resource-grid.scss";

/**
 * ResourceGrid
 *
 * Cards for a list of assets, with loading, error and empty states
 *
 * @param {object[]} assets - see utils/assets
 * @param {boolean} isLoading
 * @param {boolean} isError
 * @param {string} labelledBy - id of the section heading
 * @param {string} emptyMessage - shown when there are no assets
 * @param {number} skeletonCount - placeholder cards while loading
 * @returns {JSX.Element}
 */
export const ResourceGrid = ({
  assets,
  isLoading,
  isError,
  labelledBy,
  emptyMessage,
  skeletonCount = 4,
}) => {
  const { t } = useTranslation("hosnelhal");
  const toPath = useHosnPath();

  if (isLoading) {
    return (
      <HHLoadingRegion label={t("common.loading")}>
        <HHCardGrid>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <HHResourceCardSkeleton key={index} />
          ))}
        </HHCardGrid>
      </HHLoadingRegion>
    );
  }

  if (isError || !assets?.length) {
    const message = isError
      ? t("common.error")
      : emptyMessage || t("filters.no_resources");
    return (
      <p className="hosn-resource-grid__status" role="status">
        {message}
      </p>
    );
  }

  return (
    <HHCardGrid labelledBy={labelledBy}>
      {assets.map((asset) => (
        <HHResourceCard
          key={asset.id}
          to={toPath(`resources/${asset.id}`)}
          image={asset.image}
          label={t(`formats.${asset.format}`)}
          meta={getLengthLabel(asset, t)}
          title={asset.title}
          description={asset.description}
          openLabel={t(`open.${asset.format}`)}
        />
      ))}
    </HHCardGrid>
  );
};
