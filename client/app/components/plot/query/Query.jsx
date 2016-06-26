import React from 'react';
import { connect } from 'react-redux';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import SmartButton from './SmartButton.jsx';

// Exposed API Endpoints
// /api/states/:state/:rank
// /api/population/:bank/:year
// /api/growth/:year/:rank/:product

class Query extends React.Component {
  constructor(props) {
    super(props);
    // query build path
    this.state = {
      path: this.props.active,
      count: 0
    };
    this._checkQuery = this._checkQuery.bind(this);
    this._submitQuery = this._submitQuery.bind(this);
    this._updateQuery = this._updateQuery.bind(this);
  }
  
  _submitQuery(query) {
    query.preventDefault();
    console.log('form inputs please?', Object.keys(query));
  }
  
  _checkQuery() {
    if (this.state.path > 11 && this.state.count >= 2) {
      return 'success';
    } else {
      return 'error';
    }
  }
  
  _updateQuery(e) {
    console.log('what is there to do?', e.target.value, typeof e.target.key);
    let piece = this.state.path;
    console.log('piece',piece,'active',this.props.active);
    switch (this.props.active) {
      case 'STATES':
        // fresh path (hack for state)
        if (piece === 'STATES' && this.props.states.indexOf(e.target.value) !== -1) {
          this.setState({
            path: piece + '/' + e.target.value,
            count: ++this.state.count
          });
        // 2/3 params filled out (hack for rank)
        } else if (piece.length === 9 && [1,2,3,4,5,6,7,8,9,10].indexOf(+e.target.value) !== -1) {
          this.setState({
            path: piece + '/' + e.target.value,
            count: ++this.state.count
          });
        }
      case 'GROWTH':
        // fresh path
        if (piece === 'GROWTH' && this.props.years.indexOf(e.target.value) !== -1) {
          this.setState({
            path: piece + '/' + e.target.value,
            count: ++this.state.count            
          });
        } else if (piece.length === 11 && [1,2,3,4,5,6,7,8,9,10].indexOf(+e.target.value) !== -1) {
          this.setState({
            path: piece + '/' + e.target.value,
            count: ++this.state.count
          });
        } else if (piece.length > 12 && this.props.products.indexOf(e.target.value) !== -1) {
          this.setState({
            path: piece + '/' + e.target.value,
            count: ++this.state.count
          });
        }
      default:
        //population
        if (piece === 'POPULATION' && this.props.banks.indexOf(e.target.value) !== -1) {
          this.setState({
            path: piece + '/' + e.target.value,
            count: ++this.state.count
          });
        } else if (piece.length > 11 && this.props.years.indexOf(e.target.value) !== -1) {
          this.setState({
            path: piece + '/' + e.target.value,
            count: ++this.state.count
          });
        }
    }
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
    query: store.fincensusReducer.query
  };
};

// connect the desired state to the relevant component
export default connect(mapStateToProps)(Query);
