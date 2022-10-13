import React, { useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  CardSpecialistSmall,
} from "@USupport-components-library/src";

import "./meet-our-specialists.scss";
import { useTranslation } from "react-i18next";

// Placeholder data
const specialistData = [
  { name: "Joane Doe", description: "Life therapist and coach" },
  { name: "Joane Doe-1", description: "Life therapist and coach" },
  { name: "Joane Doe-2", description: "Life therapist and coach" },
  { name: "Joane Doe-3", description: "Life therapist and coach" },
  { name: "Joane Doe-4", description: "Life therapist and coach" },
  { name: "Joane Doe-5", description: "Life therapist and coach" },
];

/**
 * MeetOurSpecialists
 *
 * Meet our specialists block
 *
 * @return {jsx}
 */
export const MeetOurSpecialists = () => {
  const { t } = useTranslation("meet-our-specialists");
  const [specialists] = useState(specialistData);

  return (
    <Block classes="meet-our-specialists">
      <Grid classes="meet-our-specialists__main-grid">
        <GridItem md={8} lg={12}>
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="meet-our-specialists__subheading">
          <p className="text">{t("paragraph")}</p>
        </GridItem>

        <GridItem
          md={8}
          lg={12}
          classes="meet-our-specialists__specialists-item"
        >
          <Grid classes="meet-our-specialists__secondary-grid">
            {specialists.map((specialist, index) => {
              return (
                <GridItem md={4} lg={4} key={index}>
                  <CardSpecialistSmall
                    name={specialist.name}
                    description={specialist.description}
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
