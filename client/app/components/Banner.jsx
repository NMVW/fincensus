import React from 'react';
import { Jumbotron, Image } from 'react-bootstrap';

let centerText = {
  textAlign: 'center'
};

export default class Banner extends React.Component {
  
  render() {
    return (
      <Jumbotron>
        <h1 style={centerText}>$ Fincensus $</h1>
        <p style={centerText}>How banks shape a country</p>
      </Jumbotron>
    )
  } 
}
