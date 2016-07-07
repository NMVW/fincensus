function initTypesTable(State) {
  var promisedStates = [];
  
  for (var stateCapital in stateToName) {
    promisedStates.push(State.create({capital: stateCapital, name: stateToName[stateCapital]}));
  }
  return Promise.all(promisedStates);
};
