import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default class Navigation extends React.Component {
  
  render() {
    return ( 
      <Navbar inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Fincensus</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">About</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
