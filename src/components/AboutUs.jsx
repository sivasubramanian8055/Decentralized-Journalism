import { Card, H5, H3, Icon } from '@blueprintjs/core'
import React, { memo } from 'react'
import HomeNavbarActions from './HomeNavbarActions'
import Navbar from './Navbar'
import AviDP from "../static/images/avi.jpg";
import SivaDP from "../static/images/siva.jpeg"
import PrakDP from "../static/images/prak.jpg";

import "../styles/aboutUs.scss"
import CommunityIllustration from "../static/images/9_BLM_SIGNS.svg";

export default memo(function AboutUs(props) {
  const contributors = [
    {
      firstName: "Avinash",
      lastName: "Ravishankaran",
      description: "I am a photographer",
      displayPic: AviDP,
      githubLink: "",
      linkedinLink: "",
    },
    {
      firstName: "Siva",
      lastName: "Subramaniam",
      description: "just take a <br>",
      displayPic: SivaDP,
      githubLink: "https://github.com/sivasubramanian8055",
      linkedinLink: "https://www.linkedin.com/in/siva-subramanian-b907b622/",
    },
    {
      firstName: "Prakash",
      lastName: "Raj",
      description: "I am a gamer",
      displayPic: PrakDP,
      githubLink: "",
      linkedinLink: "",
    },
  ];
  return (
    <div>
      <Navbar>
        <HomeNavbarActions {...props} />
      </Navbar>
      <div className="container">

        <div className="mt-20 mb-20 center">
          <H3>About Us</H3>
        </div>
        <div className="about__us__card__wrapper">
          <Card className="about__us__card">
            <div className="about__us__section">
              <div className="about__us__img">
                <img src={CommunityIllustration} width="120" />
              </div>
              <div className="about__us__content">
                <H5>
                  What does<em> Decentralized Journalism</em> solves ?
                </H5>
                <p>
                  Decentalized journalism is a Dapp to provide a safe and open
                  journalism to both people as well as the journalist of this
                  country. We would approach this by using a disruptive tech
                  "Blockchain" to provide anonymity.
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="contributors__wrapper">
          <Card className="contributor__card mt-20">
            <H5 className="mt-10 mb-10 center">
              Contributors
            </H5>
            {contributors.map((contributor) => {
              return (
                <div className="contributors mt-10" key={contributor.linkedinLink}>
                  <div className="contributor__dp">
                    <img
                      className="display__img"
                      width="120"
                      src={contributor.displayPic}
                    />
                  </div>
                  <div className="contributor__details">
                    <div className="contributor__name">
                      <H3>
                        {contributor.firstName} {contributor.lastName}
                      </H3>
                    </div>
                    <div className="contributor__description">
                      <p>
                        {contributor.description}
                      </p>
                    </div>
                    <div className="contributor__social__profile">
                      <span style={{ fontSize: "20px" }}>
                        <a href={contributor.githubLink} target="_blank">
                          <i className="fab fa-github mr-10"></i>
                        </a>
                      </span>
                      <span style={{ fontSize: "20px" }}>
                        <a href={contributor.linkedinLink} target="_blank">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
})
