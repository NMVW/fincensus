// populate banks table from Consumer Complaints DB API
var complaintsRequest = require('./utils').complaintsRequest;
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';
var STATES = require('./utils').stateToFips;

function initBanksTable(Bank, State) {
  var promisedTopBanks = [];
  
  for (var state in STATES) {
    
    (function(state) {
      
      // get THE TOP 100 MOST COMPLAINED ABOUT banks 
      // in each state from consumer complaints DB
      promisedTopBanks = promisedTopBanks.concat(
        complaintsRequest(baseComplaints + '$select=company,count(issue)&$group=company&state=' + state + '&$order=-count_issue&$limit=100')
          .then(function(data) {
            var banks = JSON.parse(data);
            var promisedBanks = banks.map(function(bank) {
              return Bank.create({name: bank.company})
                .then(function(bank) {
                  // find state model to assign relationship with bank
                  return State.findAll({where: {capital: state}})
                    .then(function(stateModel) {
                      return bank.addState(stateModel[0]);
                    });
                });
            });
            console.log('Banks initialized.');
            return Promise.all(promisedBanks);
          })
          .catch(function(err) {
            console.log('Banks not initialized properly!');
          })
      );
      
    })(state);
    
  }
  return Promise.all(promisedTopBanks);
};

exports.initBanksTable = initBanksTable;
