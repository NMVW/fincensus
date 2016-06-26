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
//==========================================
// Create and configure app store
import { createStore, compose } from 'redux'
import fincensusApp from './REDUCERS.jsx'

const initialState = {
  states: States,
  years: Years,
  banks: [],
  products: [],
  active: 'STATE',
  query: [],
  fetching: false
}

const store = createStore(fincensusApp, { fincensusReducer: initialState }, compose(
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? 
  window.devToolsExtension(): (f) => f
  )
);

export default store;
