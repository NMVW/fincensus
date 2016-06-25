import React from 'react';
import { Jumbotron } from 'react-bootstrap';

export default class Banner extends React.Component {
  
  render() {
    return (
      <Jumbotron>
        <h1>Fincensus</h1>
        <p>Showing how banks shape a country</p>
      </Jumbotron>
    )
  } 
}
