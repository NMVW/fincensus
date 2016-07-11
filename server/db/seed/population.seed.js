// populate population table from Census API
var request = require('request-promise');
var baseCensus = 'https://api.census.gov/data/2015/pep/';
var DATES = require('./utils').DATES;
var PERIODS = require('./utils').PERIODS;
var fipsToState = require('./utils').fipsToState;
var stateToFips = require('./utils').stateToFips;

function initPopulationsTable(Population, State) {
  var promisedDates = [];
    
  // generate population stats for each year
  for (var date in DATES) {
    
    // capture date
    (function(date) {
      
      promisedDate = promisedDates.concat(
        
        // query for population
        request(baseCensus + 'population?get=POP&for=state:*&DATE=' + DATES[date] + '&key=' + process.env.KEY)
          .then(function(data) {

            var populations = JSON.parse(data).slice(1);
                      
            var promisedPops = populations.map(function(population) {
              
              // capture population in year (date)
              return (function(total, fips, date) {
                
                // query for state (fips) growth in year (date)
                return request(baseCensus + 'components?get=BIRTHS,DEATHS&for=state:' + fips + '&PERIOD=' + PERIODS[date] + '&key=' + process.env.KEY)
                  .then(function(data) {
                    var growth = JSON.parse(data).slice(1);
                    
                    // capture population, year, births, deaths, state capital
                    return (function(total, year, births, deaths, state) {
                      
                      return Population.create({population: total, year: year, births: births, deaths: deaths})
                        .then(function(pop) {
                          console.log('success population initialized:', pop);
                          return State.findAll({where: {capital: state}})
                            .then(function(stateModel) {
                              return stateModel[0] ? pop.setState(stateModel[0]): pop.setState('Non-Continental');
                            });
                        })
                        .catch(function(err) {
                          console.log('error with population initialization:', err);
                        });
                      
                    })(Number(total), date, Number(growth[0][0]), Number(growth[0][1]), fipsToState[fips]);
                  })
                  .catch(function(err) {
                    console.log('incomplete growths', err);
                  });
                
              })(population[0], population[2], date);
            });
          
            return Promise.all(promisedPops);
          })
          .catch(function(err) {
            console.log(err);
          })
      );     
      
    })(date);
  }
  return Promise.all(promisedDates); 
}; 

exports.initPopulationsTable = initPopulationsTable;
