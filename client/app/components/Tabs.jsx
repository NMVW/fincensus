import React from 'react';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import Query from './plot/Query.jsx';

export default class ContainerTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return <Tabs defaultActiveKey={1} id="uncontrolled-tabs">
      <Tab eventKey={1} title="STATE">What are people complaining about in <Query param="STATE"/> ?</Tab>
      <Tab eventKey={2} title="POPULATION">How many people were born in <Query param="YEAR" /> in all the states that <Query param="BANK" />received a consumer complaint in ?</Tab>
      <Tab eventKey={3} title="GROWTH">How many complaints about <Query param="PRODUCT" /> are there in the fastest growing state ?</Tab>
    </Tabs>
  }

}
