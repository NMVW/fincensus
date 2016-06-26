import React from 'react';
import { connect } from 'react-redux';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

// Exposed API Endpoints
// /api/states/:state/:rank
// /api/pop/:bank/:year
// /api/growth/:year/:rank/:product

export default class Query extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    this.props;
  }

  render() {
    return (
      
      <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>{ this.props.active }</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value={this.props.active}>{this.props.active}</option>
            <option value={this.props.params}>{this.props.params}</option>
          </FormControl>
        </FormGroup>
        <Button type="submit" bsStyle="success">
          Show Me { this.props.active }
        </Button>
      </form>
    )
  }

}

// map the portion of the state tree desired
const mapStateToProps = (store) => {
  return {
    states: store.fincensusReducer.states,
    years: store.fincensusReducer.years,
    banks: store.fincensusReducer.banks,
    products: store.fincensusReducer.products,
    active: store.fincensusReducer.active,
    query: store.fincensusReducer.query
  };
};

// connect the desired state to the relevant component
export default connect(mapStateToProps)(Query);
