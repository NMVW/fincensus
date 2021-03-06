import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { loadQuery } from '../../../data_flow/ACTIONS.jsx';

// Exposed API Endpoints
// /api/states/:state/:productRank
// /api/population/:bank/:year
// /api/growth/:year/:stateRank/:productRank

class SmartButton extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }
  
  _handleClick() {
    let query = {};
    let sendQuery = this.props.dispatch;
    switch (this.props.active) {
      case 'STATES':
        query.path = 'states/' + this.props.build.STATE + '/' + this.props.build.PRODUCTRANK;
        return sendQuery(loadQuery(query));
      case 'GROWTH':
        query.path = 'growth/' + this.props.build.YEAR + '/' + this.props.build.STATERANK + '/' + this.props.build.PRODUCTRANK;
        return sendQuery(loadQuery(query));
      default:
        // 'POPULATION'
        query.path = 'population/' + this.props.build.BANK + '/' + this.props.build.YEAR;
        return sendQuery(loadQuery(query));
    }    
  }
  
  render() {
    let isLoading = this.props.fetching;
    return (
      <Button
        type="button"
        bsStyle="success"
        disabled={isLoading}
        onClick={!isLoading ? this._handleClick : null}>
        {isLoading ? 'Loading ' + this.props.show + '...': 'Show Me ' + this.props.show}
      </Button>
    )
  }
}


// map the portion of the state tree desired
const mapStateToProps = (store) => {
  return {
    query: store.fincensusReducer.query,
    fetching: store.fincensusReducer.fetching,
    active: store.fincensusReducer.active
  };
};

// connect the desired state to the relevant component
export default connect(mapStateToProps)(SmartButton);
