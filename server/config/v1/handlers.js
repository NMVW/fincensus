var request = require('request-promise');

// helpers
var stateToFips = require('../utils.js').stateToFips;
var periods = require('../utils.js').periods;
var sumReduce = require('../utils.js').sumReduce;
var asyncReduce = require('../utils.js').asyncReduce;
var baseComplaints = require('../utils.js').baseComplaints;
var baseCensus = require('../utils.js').baseCensus;

// include app token in requests
var optionA = {
  url: baseComplaints,
  headers: {
    'X-App-Token': process.env.TOKEN
  }
};

//// (Product) of [rank] most complaints in [state] of
// inputs: 2 CHAR uppercase string, number OPTIONAL -> output: string
exports.complaintsToProduct = function(state, rank, res) {
  state = state || 'CO';
  rank = rank || 1;
  
  request(baseComplaints + '?state=' + state + '&$select=product,count(issue)&$group=product')
    .then(function(data) {

      // extract [rank] most complained about product
      var products = JSON.parse(data).sort(function(a, b) {return +b.count_issue - +a.count_issue});
      var select = products[rank - 1];

      var result = {
        state: state,
        rank: rank,
        product: select
      };
      // send select to client HERE
      res.send(result);
    })
    .catch(function(err) {
      console.log(err);
    });
};

//// (Number of births) in the states where [bank] had a complaint in [year]
// inputs: string, number -> output: number
exports.pop = function(bank, year, res) {
  bank = bank || 'Bank of America';
  year = year || 2015;
  
  var start = new Date('' + year).toISOString().replace('Z', '');
  var end = new Date('' + (year + 1)).toISOString().replace('Z', '');

  //// Consumer Complaints DB
  request(baseComplaints + '?company=' + bank + '&$where=date_sent_to_company between "' + start + '" and "' + end + '"')
    .then(function(complaints) {
      complaints = JSON.parse(complaints);

      // (States) that [bank] had complaints in [year]
      var states = complaints.reduce(function(uniqs, complaint) {
        // exclude provinces 'AP', 'GU'
        if (complaint.state && complaint.state !== 'AP' && complaint.state !== 'GU') {
          uniqs[complaint.state] = true;
        }
        return uniqs;
      }, {});
      
      states = Object.keys(states);

      // helper for concurrent reduce
      function sumBirths(births, state, cb) {

        //// US Census API
        // concurrent calls to sum BIRTHS
        request(baseCensus + 'components?get=BIRTHS,GEONAME&for=state:' + stateToFips[state] + '&PERIOD=' + periods[year] + '&key=' + process.env.KEY)
          .then(function(data) {

            var birth = JSON.parse(data);
            console.log('births in range for state:',state, +birth[1][0], 'total:',births);

            if (birth && typeof +birth[1][0] === 'number') {
              cb(null, births + +birth[1][0]);
            } else {
              cb(null, births + 0);
            }
          })
          .catch(function(err) {
            // NONBLOCKING error on provinces returned from states query
            console.log(err,'NOT a continental state: ', state,' total:', births);
            cb(null, births + 0);
          });
      }

      // (Number of births) in [states]
      sumReduce(states, 0, sumBirths, function(err, result) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          var results = {
            states: states.length,
            births: result,
            bank: bank,
            year: year
          };
          // send (Number of births) to client HERE in response body
          res.send(results);
        }
      })
    })
    .catch(function(err) {
      console.log(err);
    });
};

//// (State) of [rank] most growth with most complaints about [product]
// inputs: number OPTIONAL, string, number OPTIONAL -> output: [string, string]
exports.states = function(rank, product, year, res) {
  rank = rank || 1;
  product = product || 'Mortgage';
  year = year || 2015;

  var start = new Date('' + year).toISOString().replace('Z', '');
  var end = new Date('' + (year + 1)).toISOString().replace('Z', '');

  var stateGrowth = {};

  // helper for concurrent side-effects
  function netBirths(stateGrowth, state, cb) {

    //// US Census API
    // concurrent calls to sum BIRTHS
    request(baseCensus + 'components?get=BIRTHS,DEATHS,GEONAME&for=state:' + stateToFips[state] + '&PERIOD=' + periods[year] + '&key=' + process.env.KEY)
      .then(function(data) {

        var growth = JSON.parse(data);
        console.log('net growth for:', state, +growth[1][0]-growth[1][1]);

        if (growth && typeof +growth[1][0] === 'number') {
          stateGrowth[state] = +growth[1][0] - growth[1][1];
          cb(null, stateGrowth);
        } else {
          cb(null, stateGrowth);
        }
      })
      .catch(function(err) {
        // NONBLOCKING error on 'AP' and 'GU' provinces returned from states query
        console.log(err,'NOT a continental state: ', state,' growths:', stateGrowth);
        cb(null, stateGrowth);
      });
  }
  
  var states = Object.keys(stateToFips);
  
  // (Net births) in [states]
  asyncReduce(states, {}, netBirths, function(err, stateGrowth) {
    if (err) {
      console.log(err);
    } else {
      console.log('stateGrowth', stateGrowth);
      
      // find [rank] fastest growing state
      var ranked = states.sort(function(a, b) {return stateGrowth[b] - stateGrowth[a]});
      var select = ranked[rank - 1];
      
      // find # of complaints for [product] in found state
      //// Consumer Complaints DB
      request(baseComplaints + '?product=' + product + '&state=' + select + '&$where=date_sent_to_company between "' + start + '" and "' + end + '"')
        .then(function(complaints) {
          complaints = JSON.parse(complaints);
          
          var result = {
            rank: rank,
            state: select,
            top: {
              product: product,
              complaints: complaints.length
            }
          };
          // (State) that [bank] had complaints in [year]
          res.send(result);
        }).catch(function(err) {
          console.log(err);
        });
    }
  });
};

exports.initialize = function(res) {
  //// Consumer Complaints DB
  var companies = []
  var products = [];
  
  // find API-valid banks,
  request(baseComplaints + '?$select=company&$group=company')
    .then(function(companies) {
      companies = JSON.parse(companies).map(function(entry) {
        return entry.company;
      });
      // products,
      request(baseComplaints + '?$select=product&$group=product')
        .then(function(products) {
          products = JSON.parse(products).map(function(entry) {
            return entry.product;
          });
          var result = {
            companies: companies,
            products: products
          };
          console.log(result);
          // return the bounds for queries to client
          res.send(result);
        })
        .catch(function(err) {
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log(err);
    });
};
