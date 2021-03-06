var stateToName = require('./utils').stateToName;

function initStatesTable(State) {
  var promisedStates = [];
  
  for (var stateCapital in stateToName) {
    promisedStates = promisedStates.concat(
      State.create({capital: stateCapital, name: stateToName[stateCapital]})
        .then(function(state) {
          console.log('States initialized.', state);
        })
        .catch(function(err) {
          console.log('States not initialized properly.', err);
        })
    );
  }
  return Promise.all(promisedStates);
};

exports.initStatesTable = initStatesTable;
