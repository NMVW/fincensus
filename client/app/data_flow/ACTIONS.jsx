import store from './STORE.jsx';
// ACTION TYPES for APP component
// sync
export const SET_ACTIVE = 'SET_ACTIVE';
export const UPDATE_PARAMS = 'UPDATE_PARAMS';
export const UPDATE_QUERY = 'UPDATE_QUERY';
// async
export const LOAD_PARAMS = 'LOAD_PARAMS';
export const LOAD_QUERY = 'LOAD_QUERY';

// ACTION CREATORS--------------------
// SYNC
export function setActive(active) {
  return { type: SET_ACTIVE, active }
}

export function updateParams(params, fetching) {
  return { 
    type: UPDATE_PARAMS, 
    banks: params.companies,
    products: params.products,     
    fetching 
  }
}

export function updateQuery(query, fetching) {
  return {
    type: UPDATE_QUERY,
    query,
    fetching
  }
}

// ASYNC
export function loadParams() {
  
  fetch('/api/initialize', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin'
    })
    .then((init) => init.text())
    .then((params) => {
      console.log('incoming params',params);
      store.dispatch(updateParams(params, false));
    }).catch((error) => {
      console.error(error);
    });
    
  return { type: LOAD_PARAMS, fetching: true }
}

export function loadQuery(query) {
  // // query 
  // {
  //   path: 'states/FL/1'
  // }
  
  fetch('/api/' + query.path, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
  })
  .then((init) => init.text())
  .then((queryResults) => {
    console.log('incoming query results', queryResults);
    store.dispatch(updateQuery(queryResults, false));
  }).catch((error) => {
    console.error(error);
  });
  
  return { type: LOAD_QUERY, fetching: true }
}