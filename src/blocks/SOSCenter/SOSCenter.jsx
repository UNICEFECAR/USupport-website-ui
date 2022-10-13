import React from "react";
import { Block } from "@USupport-components-library/src";
import { Box } from "@USupport-components-library/src";
import { IconWithText } from "@USupport-components-library/src";
import { Grid } from "@USupport-components-library/src";
import { GridItem } from "@USupport-components-library/src";

import "./sos-center.scss";
import { useTranslation } from "react-i18next";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = ({ contacts }) => {
  const { t } = useTranslation("sos-center");
  return (
    <Block classes="soscenter" animation="fade-right">
      <Grid classes="soscenter__grid">
        <GridItem xs={4} md={8} lg={12} classes="soscenter__heading-item">
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem xs={4} md={8} lg={12} classes="soscenter__text-item">
          <Box classes="soscenter__box">
            <h3 className="soscenter__box-heading">{t("paragraph_1")}</h3>
            <p className="text soscenter__box-paragraph">{t("paragraph_2")}</p>

            {contacts.map((contact, index) => {
              return (
                <IconWithText
                  classes="soscenter__icon-with-text"
                  iconName={"call-filled"}
                  text={<p className="text">{contact}</p>}
                  onClick={() =>
                    window.open(`tel:${contact}`, "_blank").focus()
                  }
                  key={index}
                />
              );
            })}
          </Box>
        </GridItem>
      </Grid>
    </Block>
  );
};
