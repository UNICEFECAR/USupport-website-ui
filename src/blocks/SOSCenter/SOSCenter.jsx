import React from "react";
import {
  Block,
  Grid,
  GridItem,
  EmergencyCenter,
} from "@USupport-components-library/src";

import "./sos-center.scss";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = ({ contacts }) => {
  return (
    <Block classes="soscenter" animation="fade-right">
      <Grid classes="soscenter__grid">
        <GridItem xs={4} md={8} lg={12} classes="soscenter__heading-item">
          <h2>SOS center</h2>
        </GridItem>
        <GridItem xs={4} md={8} lg={12} classes="soscenter__text-item">
          <Grid classes="soscenter__secondary-grid" xs={4} md={8} lg={12}>
            {contacts.map((contact, index) => {
              return (
                <GridItem
                  classes="soscenter__secondary-grid__item"
                  md={4}
                  lg={12}
                  key={index}
                >
                  <EmergencyCenter
                    title={contact.title}
                    link={contact.link}
                    phone={contact.phone}
                    btnLabel="Contact now"
                  />
                </GridItem>
              );
            })}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
