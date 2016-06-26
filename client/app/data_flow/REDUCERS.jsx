import { SET_ACTIVE, UPDATE_PARAMS, LOAD_PARAMS, UPDATE_QUERY, LOAD_QUERY } from './ACTIONS.jsx';

// API-valid states list
const States = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID',
  'IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS',
  'MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK',
  'OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV',
  'WI','WY'
];

// API-valid years list
const Years = [2011,2012,2013,2014,2015];

//===================================================
// REDUCER for APP component
import { combineReducers } from 'redux';

const initialState = {
  states: States,
  years: Years,
  banks: [],
  products: [],
  active: 'STATES',
  query: [],
  fetching: false
}

// COMBINED REDUCER -> yield Store
function fincensusReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE:
      return Object.assign({}, state, {
        active: action.active
      })
    case UPDATE_PARAMS:
      return Object.assign({}, state, {
        banks: action.banks,
        products: action.products,
        fetching: action.fetching
      })
    case LOAD_PARAMS:
      return Object.assign({}, state, {
        fetching: action.fetching
      })
    case UPDATE_QUERY:
      return Object.assign({}, state, {
        query: action.query,
        fetching: action.fetching
      })
    case LOAD_QUERY:
      return Object.assign({}, state, {
        fetching: action.fetching
      })
    default: 
      return state;
  }
}

const fincensusApp = combineReducers({
  fincensusReducer
})

export default fincensusApp;
