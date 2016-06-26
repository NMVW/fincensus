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
    console.log(this.props.params)
    console.log(this.props.params.map((param) => {
      <FormGroup controlId={"formControlsSelect" + param}>
              <ControlLabel>{ param }</ControlLabel>
              <FormControl componentClass="select" placeholder="select">
                <option value ={param}>param</option>
              </FormControl>
      </FormGroup>
    });
    let el = this.props.params.map((param) => {
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>{ param }</ControlLabel>
              <FormControl componentClass="select" placeholder="select">
                if (param === 'STATE') {
                  this.props.states.map((state) => {
                    return <option key={state} value={state}>state</option>
                  })
                } else if (param === 'YEAR') {
                  this.props.years.map((year) => {
                    return <option key={year} value={year}>year</option>
                  })
                } else if (param === 'BANK') {
                  this.props.banks.map((bank) => {
                    return <option key={bank} value={bank}>bank</option>
                  })
                } else if (param === 'PRODUCT') {
                  this.props.products.map((product) => {
                    return <option key={product} value={product}>product</option>
                  })
                } else {
                  [1,2,3,4,5,6,7,8,9,10].map((rank) => {
                    return <option key={rank} value={rank}>rank</option>
                  })
                }
              </FormControl>
            </FormGroup>
          });
    console.log('this is el',el);
    return (
      <form>
        {el}
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
