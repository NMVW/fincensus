import React from 'react';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import Map from './plot/Map.jsx';
import Tabs from './plot/Tabs.jsx';

export default class Plot extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
        <Grid fluid={ true }>
          <Row>
            <Col md={4}>
              <Panel header={<h3>Points of View</h3>} bsStyle="primary">
                <Tabs />
              </Panel>
            </Col>
            <Col md={8}>
              <Map />
            </Col>
          </Row>
        </Grid>
      )
  }
}