import React from 'react'
import Navbar from './Navbar'
import HomeNavbarActions from "./HomeNavbarActions"
import CommunityIllustration from "../static/images/9_BLM_SIGNS.svg"
import { Button, Card, Tag } from '@blueprintjs/core'
import {
  TwitterFollowButton,
  TwitterShareButton,
  TwitterHashtagButton,
  TwitterTweetEmbed,
} from "react-twitter-embed";
import "../styles/community.scss"

export default function Community(props) {
  return (
    <div>
      <Navbar>
        <HomeNavbarActions {...props} />
      </Navbar>
      <div className="community mt-20 mb-20">
        <Card elevation={2} className="community__section__card">
          <div className="community__section">
            <div className="community__image">
              <img width="120" src={CommunityIllustration} />
            </div>
            <div className="community__card__content">
              <p>
                The <strong>DJ</strong>'s community welcomes you. Be
                open to ask your questions and share your opinions about the
                platform
              </p>
              <div className="community__aciton_btn">
                <Button className="mr-10" intent="primary" small="true">Ask Question / Share opinion</Button>
                <span className="mr-10">
                  <Tag intent="primary" minimal>
                    Or
                  </Tag>
                </span>
                <span className="">
                  <TwitterShareButton
                    className="mt-5"
                    url={"https://facebook.com/saurabhnemade"}
                    options={{ text: "#DJ is awesome dapp. #ethereum #dapp", via: "sudarshan151298" }}
                  />
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="twitter__widget">
      </div>
    </div>
  );
}
