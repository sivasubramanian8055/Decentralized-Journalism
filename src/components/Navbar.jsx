import { Alignment, Button, Navbar as Nav, NavbarDivider } from '@blueprintjs/core';
import React, { Fragment, memo } from 'react'
import { NavLink } from 'react-router-dom';

export default memo(function Navbar(props) {
  return (
    <Fragment>
      <Nav>
        <Nav.Group>
          <NavLink to="/" activeClassName="home__link">
            <Nav.Heading className="nav__link">Decentralized Journalism</Nav.Heading>
          </NavLink>
          {props.children}
        </Nav.Group>
      </Nav>
    </Fragment>
  );
})
