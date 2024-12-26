import React from "react";
import {
  Block,
  Grid,
  GridItem,
  Box,
  Animation,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./we-help.scss";

/**
 * WeHelp
 *
 * The first block of the About us page
 *
 * @return {jsx}
 */
export const WeHelp = () => {
  const { t } = useTranslation("we-help");
  return (
    <Block classes="we-help">
      <Grid>
        <GridItem md={8} lg={12} classes="we-help__heading">
          {/* <h2 className="we-help__heading-text">{t("heading_1")}</h2> */}
        </GridItem>
        <GridItem md={8} lg={12}>
          <Box borderSize="lg" classes="we-help__content-box">
            <Grid classes="we-help__secondary-grid">
              <GridItem
                md={8}
                lg={12}
                classes="we-help__secondary-grid__descriptions-item"
              >
                <h3 className="mt-32">{t("heading_1")}</h3>
                <p className="text we-help__secondary-grid__text-two">
                  {t("paragraph_1")}
                </p>
                <h3 className="mt-32">{t("heading_2")}</h3>
                <p className="text we-help__secondary-grid__text-three">
                  {t("paragraph_2")}
                </p>

                <h3 className="mt-32">{t("heading_3")}</h3>
                <p className="text we-help__secondary-grid__text-three">
                  {t("paragraph_3")}
                </p>
                <p className="text we-help__secondary-grid__text-three">
                  {t("paragraph_4")}
                </p>

                <h3 className="mt-32">{t("heading_4")}</h3>
                <p className="text we-help__secondary-grid__text-three">
                  {t("paragraph_5")}
                </p>
                <h3 className="mt-32">{t("heading_5")}</h3>
                <p className="text we-help__secondary-grid__text-three">
                  {t("paragraph_6")}
                </p>

                <p className="text we-help__secondary-grid__text-four">
                  <span>{t("paragraph_7")}</span>
                  <span>
                    <a
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                      href="https://usupport.online/terms-of-use"
                    >
                      {" "}
                      {t("terms")}{" "}
                    </a>
                  </span>
                  <span>{t("and")}</span>
                  <span>
                    <a
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                      href="https://usupport.online/privacy-policy"
                    >
                      {" "}
                      {t("privacy")}{" "}
                    </a>
                  </span>
                  <span>{t("paragraph_7_2")}</span>
                </p>
              </GridItem>
              <GridItem md={8} lg={12} classes="we-help__mascot-item">
                <Animation
                  name="MascotPurpleInformation"
                  classes="we-help__mascot-item__animation"
                />
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
      </Grid>
    </Block>
  );
};
