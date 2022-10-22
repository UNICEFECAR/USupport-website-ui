import React from "react";
import { Block, Grid, GridItem, Box } from "@USupport-components-library/src";

import "./we-help.scss";

import mascot from "../../assets/MascotBlue.png";
import { useTranslation } from "react-i18next";

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
          <h2>About Us</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Box borderSize="lg" classes="we-help__content-box">
            <Grid classes="we-help__secondary-grid">
              <GridItem
                md={6}
                lg={6}
                classes="we-help__secondary-grid__descriptions-item"
              >
                <h3>{t("heading")}</h3>

                <p className="text we-help__secondary-grid__text-two">
                  {t("paragraph_1")}
                </p>
                <p className="text we-help__secondary-grid__text-three">
                  {t("paragraph_2")}
                </p>
              </GridItem>

              <GridItem md={2} lg={6} classes="we-help__mascot-item">
                <img src={mascot} className="we-help__mascot-item__image" />
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
      </Grid>
    </Block>
  );
};
