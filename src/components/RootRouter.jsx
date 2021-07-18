import React, { Component, memo } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Home';
import Dashboard from './Dashboard';
import Community from './Community';
import CrimeAgainstAllJournalists from "./CrimeAgainstAllJournalists"
import Footer from './Footer';
import AboutUs from './AboutUs';
import NewPost from "./NewPost"

export default memo(function RootRouter(props) {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/about_us" component={AboutUs} />
      <Route exact path="/crimeAgainstJournalists" component={CrimeAgainstAllJournalists} />
      <Route exact path="/dashboard/:id/new" component={NewPost} />
      <Route exact path="/community" component={Community} />
      <Footer />
    </Router>
  );
})
