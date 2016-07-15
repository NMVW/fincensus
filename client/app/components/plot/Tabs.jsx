import React from 'react';
import { connect } from 'react-redux';
import { loadParams, setActive } from '../../data_flow/ACTIONS.jsx';

import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import Query from './query/Query.jsx';

class ContainerTabs extends React.Component {
  constructor(props) {
    super(props);
    this._handleSelect = this._handleSelect.bind(this);
  }
  
  componentWillMount() {
    this.props.dispatch(loadParams());
  }
  
  _handleSelect(key) {
    this.props.dispatch(setActive(key));
  }

  render() {
    
    return <Tabs defaultActiveKey={this.props.active} onSelect={this._handleSelect} id="controlled-tabs">
      <Tab eventKey={"STATES"} title="STATE">
        What is the <strong>PRODUCTRANK</strong> most complained about product in <strong>STATE</strong>?
        <Query params={["STATE", "PRODUCTRANK"]}/>
      </Tab>
      <Tab eventKey={"POPULATION"} title="POPULATION">
        How many people were born in states where <strong>BANK</strong> had a complaint in <strong>YEAR</strong>.
        <Query params={["YEAR", "BANK"]} />
      </Tab>
      <Tab eventKey={"GROWTH"} title="GROWTH">
        Number of complaints about <strong>PRODUCTRANK</strong> product in the <strong>STATERANK</strong> fastest growing state.
        <Query params={["PRODUCTRANK", "STATERANK"]} />
      </Tab>
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
