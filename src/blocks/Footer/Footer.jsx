import React from "react";
import { Block } from "/USupport-components-library/src";

import "./footer.scss";
import { Grid } from "../../../USupport-components-library/src/components/grids/Grid/Grid";
import { GridItem } from "/USupport-components-library/src";
import { List } from "../../../USupport-components-library/src/components/lists/List/List";
import logo from "../../../USupport-components-library/src/assets/logo.png";
import { Icon } from "../../../USupport-components-library/src/components/icons/Icon/Icon";
import { Link } from "react-router-dom";

/**
 * Footer
 *
 * The Footer block
 *
 * @return {jsx}
 */
export const Footer = ({ lists }) => {
  const currentYear = new Date().getFullYear();

  function handleContactsClick(platform) {
    let link = "";

    switch (platform) {
      case "facebook":
        link = "https://www.facebook.com/";
        break;
      case "twitter":
        link = "https://twitter.com/";
        break;
      case "linkedin":
        link = "https://www.linkedin.com/";
        break;
      case "phone":
        link = "tel:+359 888 888 888";
        break;

      case "mail":
        link = "mailto:usupport@7digit.io";
        break;
      default:
        break;
    }

    window.open(link, "_blank").focus();
  }

  let list1 = [];
  lists.pagesList1.forEach((page) => {
    list1.push({
      value: (
        <Link to={page.url ? page.url : "#"}>
          <p className="paragraph">{page.name}</p>
        </Link>
      ),
    });
  });

  let list2 = [];
  lists.pagesList2.forEach((page) => {
    list2.push({
      value: (
        <Link to={page.url ? page.url : "#"}>
          <p className="paragraph">{page.name}</p>
        </Link>
      ),
    });
  });

  let list3 = [];
  lists.pagesList3.forEach((page) => {
    list3.push({
      value: (
        <div
          className="footer__contact-detail"
          onClick={() => handleContactsClick(page.onClick)}
        >
          <Icon
            classes="footer__contact-detail__icon"
            name={page.iconName}
            size="md"
          />
          <p className="paragraph">{page.value}</p>
        </div>
      ),
    });
  });

  return (
    <Block classes="footer">
      <Grid>
        <GridItem xs={4} md={8} lg={4}>
          <img className="footer__logo" src={logo} alt="logo" />
          <div>
            <Icon
              classes="footer__icon"
              name="linkedin"
              size={"lg"}
              onClick={() => handleContactsClick("linkedin")}
            />
            <Icon
              classes="footer__icon"
              name="twitter"
              size={"lg"}
              onClick={() => handleContactsClick("twitter")}
            />
            <Icon
              classes="footer__icon"
              name="facebook"
              size={"lg"}
              onClick={() => handleContactsClick("facebook")}
            />
          </div>
        </GridItem>
        <GridItem classes="footer__items-list" xs={2} md={2} lg={2}>
          <List items={list1}></List>
        </GridItem>
        <GridItem classes="footer__items-list" xs={2} md={2} lg={2}>
          <List items={list2}></List>
        </GridItem>
        <GridItem classes="footer__items-list" xs={4} md={4} lg={4}>
          <h4 className="footer__contact-us">Contact Us</h4>
          <List items={list3}></List>
        </GridItem>
        <GridItem classes="footer__copy-right" xs={4} md={8} lg={12}>
          <p className="small-text">©{currentYear} USupport</p>
        </GridItem>
      </Grid>
    </Block>
  );
};
