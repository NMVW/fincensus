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
    this._updateQuery = this._updateQuery.bind(this);
    this._populate = this._populate.bind(this);
  }
  
  _populate() {
    switch (this.props.active) {
      case 'STATES':
        this.setState({
          STATE: this.props.states[0],
          RANK: 1
        });
      case 'GROWTH':
        this.setState({
          PRODUCTRANK: 1,
          STATERANK: 1,
          YEAR: this.props.years[0]
        });
      default:
        this.setState({
          YEAR: this.props.years[0],
          BANK: this.props.banks[0]
        });
    }
  }
  
  _updateQuery(e) {
    let ranks = [1,2,3,4,5,6,7,8,9,10];
    let target = e.target;
    let val = target.value;

    if (this.props.states.includes(val)) {
      this.setState({
        STATE: val
      });
    } else if (this.props.banks.includes(val)) {
      this.setState({
        BANK: val
      });
    } else if (this.props.products.includes(val)) {
      this.setState({
        PRODUCT: val
      });
    } else if (this.props.years.includes(+val)) {
      this.setState({
        YEAR: +val
      });
    } else if (target.id.match(/PRODUCTRANK/) && ranks.includes(+val)) {
      this.setState({
        PRODUCTRANK: +val
      });
    } else if (target.id.match(/STATERANK/) && ranks.includes(+val)) {
      this.setState({
        STATERANK: +val
      });
    }
  }
  
  componentDidMount() {
    this._populate();
  }
  
  render() {
    let self = this;
    let ranks = [1,2,3,4,5,6,7,8,9,10];
    let show = this.props.active === 'STATES' ? 'Product': this.props.active === 'GROWTH'? 'Issues': 'Births';
    let el =
      this.props.params.map((param) => {
        return <FormGroup controlId={"formControlsSelect" + param}>
          <ControlLabel>{ param }</ControlLabel>
          <FormControl onChange={this._updateQuery} componentClass="select" placeholder="select">
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
                } else if (param === 'STATERANK') {
                  return ranks.map((stateRank) => {
                    return <option key={stateRank} value={stateRank}>{stateRank}</option>
                  })
                } else if (param === 'PRODUCTRANK') {
                  return ranks.map((productRank) => {
                    return <option key={productRank} value={productRank}>{productRank}</option>
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
