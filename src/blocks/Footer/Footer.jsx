import React from "react";
import { Link } from "react-router-dom";
import {
  Block,
  Grid,
  GridItem,
  List,
  Icon,
  Button,
  IconWithText,
} from "/USupport-components-library/src";
import "./footer.scss";

import { logo } from "/USupport-components-library/assets";

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

    if (link !== "") window.open(link, "_blank").focus();
  }

  let list1 = [];
  lists.list1.forEach((listItem) => {
    list1.push({
      value: (
        <Link to={listItem.url ? listItem.url : "#"}>
          <Button type="text" size="lg" label={listItem.name} />
        </Link>
      ),
    });
  });

  let list2 = [];
  lists.list2.forEach((listItem) => {
    list2.push({
      value: (
        <Link to={listItem.url ? listItem.url : "#"}>
          <Button type="text" size="lg" label={listItem.name} />
        </Link>
      ),
    });
  });

  let list3 = [];
  lists.list3.forEach((listItem) => {
    list3.push({
      value: (
        <IconWithText
          iconName={listItem.iconName}
          text={<p className="text">{listItem.value}</p>}
          onClick={() => handleContactsClick(listItem.onClick)}
        />
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
        <GridItem classes="footer__list-item" xs={2} md={2} lg={2}>
          <List items={list1} />
        </GridItem>
        <GridItem classes="footer__list-item" xs={2} md={2} lg={2}>
          <List items={list2} />
        </GridItem>
        <GridItem classes="footer__list-item" xs={4} md={4} lg={4}>
          <h4 className="footer__contact-us">Contact Us</h4>
          <List items={list3} />
        </GridItem>
        <GridItem classes="footer__copy-right-item" xs={4} md={8} lg={12}>
          <p className="small-text">©{currentYear} USupport</p>
        </GridItem>
      </Grid>
    </Block>
  );
};
