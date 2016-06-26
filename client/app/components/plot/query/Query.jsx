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

class Query extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    this.props;
  }

  render() {
    let self = this;
    let ranks = [1,2,3,4,5,6,7,8,9,10];
    let params = this.props.params;
    let el =
      params.map((param) => {
        return <FormGroup controlId={"formControlsSelect" + param}>
          <ControlLabel>{ param }</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            {
              (() => {
              
                if (param === 'STATE') {
                  return self.props.states.map((state) => {
                    return <option key={state} value={state}>{state}</option>
                  })
                } else if (param === 'YEAR') {
                  return self.props.years.map((year) => {
                    return <option key={year} value={year}>{year}</option>
                  })
                } else if (param === 'BANK') {
                  return self.props.banks.map((bank) => {
                    return <option key={bank} value={bank}>{bank}</option>
                  })
                } else if (param === 'PRODUCT') {
                  return self.props.products.map((product) => {
                    return <option key={product} value={product}>{product}</option>
                  })
                } else {
                  return ranks.map((rank) => {
                    return <option key={rank} value={rank}>{rank}</option>
                  })
                }
              })()
            }
          </FormControl>
        </FormGroup>
      });
    return <form>
      {el}
      <Button type="submit" bsStyle="success">
        Show Me { this.props.active }
      </Button>
    </form>
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
