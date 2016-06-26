import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { loadQuery } from '../../../data_flow/ACTIONS.jsx';

class SmartButton extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
  }
  
  _handleClick() {
    console.log('do i have the query path?', this.props.build);
    this.props.dispatch(loadQuery(this.props.build));
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
  };
};

// connect the desired state to the relevant component
export default connect(mapStateToProps)(SmartButton);
