import React, { Fragment } from "react";
import HomeNavbarActions from "./HomeNavbarActions";
import Navbar from "./Navbar";
import HeroImage from "../static/images/9_BLM_SIGNS.svg";
import "../styles/home.scss";
import CrimeChart from "./CrimeChart";
import AffectedJournalistCard from "./AffectedJournalistCard";
import { Button } from "@blueprintjs/core";
import { Link, NavLink } from "react-router-dom";

export default function Home(props) {
  console.log(props)
  return (
    <Fragment>
      <Navbar>
        <HomeNavbarActions {...props} />
      </Navbar>
      <div className="container">
        <div className="hero__section">
          <div className="hero__img_section">
            <img src={HeroImage} alt="hero_logo" />
          </div>
          <div className="hero__content__section">
            <h1>Decentralized Journalism</h1>
            <blockquote>" Freedom of the press is a precious privilege that no country can forego. " - Mahatma Gandhi</blockquote>
          </div>
        </div>
        <div className="chart__section">
          <CrimeChart />
        </div>
        <div className="affected__journalists__sections">
          <AffectedJournalistCard label="Few noticable Crimes">
            <div className="see__all__cta">
              <Link to="/crimeAgainstJournalists">
                <Button intent="warning" rightIcon="chevron-right">
                  See All
                </Button>
              </Link>
            </div>
          </AffectedJournalistCard>
        </div>
      </div>
    </Fragment>
  );
}
