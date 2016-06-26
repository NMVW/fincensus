import React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import Query from './query/Query.jsx';

export default class ContainerTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return <Tabs defaultActiveKey={"STATE"} id="controlled-tabs">
      <Tab eventKey={"STATE"} title="STATE">What are people complaining about in <Query param="STATE"/> ?</Tab>
      <Tab eventKey={"POP"} title="POPULATION">How many people were born in <Query param="YEAR" /> in all the states that <Query param="BANK" />received a consumer complaint in ?</Tab>
      <Tab eventKey={"GROWTH"} title="GROWTH">How many complaints about <Query param="PRODUCT" /> are there in the fastest growing state ?</Tab>
    </Tabs>
  }

}

// map the portion of the state tree desired
const mapStateToProps = (store) => {
  return {
    fetching: store.fincensusReducer.fetching,
    active: store.fincensusReducer.active,
  };
};

// connect the desired state to the relevant component
export default connect(mapStateToProps)(ContainerTabs);
