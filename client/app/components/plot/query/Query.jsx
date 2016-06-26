import React from 'react';
import { connect } from 'react-redux';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import SmartButton from './SmartButton.jsx';

class Query extends React.Component {
  constructor(props) {
    super(props);
    // query elements for path
    this.state = {};
    this._checkQuery = this._checkQuery.bind(this);
    this._updateQuery = this._updateQuery.bind(this);
  }
  
  _checkQuery() {
    // clear out component query after submission
    if (this.fetching) {
      this.setState({});
    }
    if (this.state.path > 11 && this.state.count >= 2) {
      return 'success';
    } else {
      return 'error';
    }
  }
  
  _updateQuery(e) {
    let ranks = [1,2,3,4,5,6,7,8,9,10];
    let val = e.target.value;
    if (this.props.states.indexOf(val) !== -1) {
      this.setState({
        STATE: val
      });
    } else if (this.props.banks.indexOf(val) !== -1) {
      this.setState({
        BANK: val
      });
    } else if (this.props.products.indexOf(val) !== -1) {
      this.setState({
        PRODUCT: val
      });
    } else if (this.props.years.indexOf(+val) !== -1) {
      this.setState({
        YEAR: val
      });
    } else if (ranks.indexOf(+val) !== -1) {
      this.setState({
        RANK: val
      });
    }
    // no need for value checking, we know it is valid
    // simply add value to query as property {STATE:'FL', RANK: 3}
    // smart button will determine how to assemble piece into API endpoint
  }

  render() {
    let self = this;
    let ranks = [1,2,3,4,5,6,7,8,9,10];
    let show = this.props.active === 'STATES' ? 'Product': this.props.active === 'GROWTH'? 'Issues': 'Births';
    let el =
      this.props.params.map((param) => {
        return <FormGroup validationState={this._checkQuery()} controlId={"formControlsSelect" + param}>
          <ControlLabel>{ param }</ControlLabel>
          <FormControl onChange={this._updateQuery} componentClass="select" placeholder="select">
            {
              (() => {
              
                if (param === 'STATE') {
                  return self.props.states.map((state) => {
                    return <option flag="STATE" key={state} value={state}>{state}</option>
                  })
                } else if (param === 'YEAR') {
                  return self.props.years.map((year) => {
                    return <option flag="YEAR" key={year} value={year}>{year}</option>
                  })
                } else if (param === 'BANK') {
                  return self.props.banks.map((bank) => {
                    return <option flag="BANK" key={bank} value={bank}>{bank}</option>
                  })
                } else if (param === 'PRODUCT') {
                  return self.props.products.map((product) => {
                    return <option flag="PRODUCT" key={product} value={product}>{product}</option>
                  })
                } else {
                  return ranks.map((rank) => {
                    return <option flag="RANK" key={rank} value={rank}>{rank}</option>
                  })
                }
              })()
            }
          </FormControl>
        </FormGroup>
      });
    return <form>
      {el}
      <SmartButton build={this.state} show={show} />
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
    query: store.fincensusReducer.query,
    fetching: store.fincensusReducer.fetching
  };
};

// connect the desired state to the relevant component
export default connect(mapStateToProps)(Query);
