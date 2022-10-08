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
  lists.list1.forEach((listItem) => {
    list1.push({
      value: (
        <Link to={listItem.url ? listItem.url : "#"}>
          <p className="paragraph">{listItem.name}</p>
        </Link>
      ),
    });
  });

  let list2 = [];
  lists.list2.forEach((listItem) => {
    list2.push({
      value: (
        <Link to={listItem.url ? listItem.url : "#"}>
          <p className="paragraph">{listItem.name}</p>
        </Link>
      ),
    });
  });

  let list3 = [];
  lists.list3.forEach((listItem) => {
    list3.push({
      value: (
        <div
          className="footer__contact-detail"
          onClick={() => handleContactsClick(listItem.onClick)}
        >
          <Icon
            classes="footer__contact-detail__icon"
            name={listItem.iconName}
            size="md"
          />
          <p className="paragraph">{listItem.value}</p>
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
