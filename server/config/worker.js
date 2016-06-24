var request = require('request-promise');

// helpers
var stateToFips = require('./utils.js').stateToFips;
var periods = require('./utils.js').periods;
var sumReduce = require('./utils.js').sumReduce;
var asyncReduce = require('./utils.js').asyncReduce;
var baseComplaints = require('./utils.js').baseComplaints;
var baseCensus = require('./utils.js').baseCensus;



// include app token in requests
var optionA = {
  url: baseComplaints,
  headers: {
    'X-App-Token': process.env.TOKEN
  }
};

//// (Product) of [rank] most complaints in [state] of
// inputs: 2 CHAR uppercase string, number OPTIONAL -> output: string
// DEFAULTS: undefined, 1
exports.productRankByState = function(state, rank) {
  request(baseComplaints + '?state=' + state + '&' + '$select=product,count(issue)&$group=product')
    .then(function(data) {

      // extract most complained about product
      var max = JSON.parse(data)
        .reduce(function(a,b) {
          return +a.count_issue > +b.count_issue ? a: b;
        }, {count_issue:0});

      console.log('send product to client:', max);
      // send max to client HERE
    })
    .catch(function(err) {
      console.log(err);
    });
};

//// (Number of births) in the [year] and states where [bank] had a complaint
// inputs: string, number -> output: number
exports.birthsInRange = function(bank, year) {

  var start = new Date('' + year).toISOString().replace('Z', '');
  var end = new Date('' + (year + 1)).toISOString().replace('Z', '');

  //// Consumer Complaints DB
  request(baseComplaints + '?company=' + bank + '&$where=date_sent_to_company between "' + start + '" and "' + end + '"')
    .then(function(complaints) {
      complaints = JSON.parse(complaints);

      // (States) that [bank] had complaints in [year]
      var states = complaints.reduce(function(uniqs, complaint) {
        if (complaint.state) {
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
            console.log('births in range data for state!',state, +birth[1][0], 'total:',births);

            if (birth && typeof +birth[1][0] === 'number') {
              cb(null, births + +birth[1][0]);
            } else {
              cb(null, births + 0);
            }
          })
          .catch(function(err) {
            // NONBLOCKING error on 'AP' and 'GU' provinces returned from states query
            console.log(err,'NOT a continental state: ', state,' total:', births);
            cb(null, births + 0);
          });
      }

      // (Number of births) in [states]
      sumReduce(states, 0, sumBirths, function(err,result) {
        if (err) {
          console.log(err);
        } else {
          console.log('sum of all births in ',states.length,' states: ',result);
          // send (Number of births) to client HERE in response body
        }
      })
    })
    .catch(function(err) {
      console.log(err);
    });
};

//// (State) of [rank] most growth with most complaints about [product]
// inputs: number OPTIONAL, string, number OPTIONAL -> output: [string, string]
exports.stateByProduct = function(rank, product, year) {
  year = year || 2014;
  rank = rank || 1;

  var start = new Date('' + year).toISOString().replace('Z', '');
  var end = new Date('' + (year + 1)).toISOString().replace('Z', '');

  //// Consumer Complaints DB
  // TODO : simplify by reordering queries, fastest growing state then find # of complaints
  request(baseComplaints + '?product=' + product + '&$where=date_sent_to_company between "' + start + '" and "' + end + '"')
    .then(function(complaints) {
      complaints = JSON.parse(complaints);

      // (States) that [bank] had complaints in [year]
      var stateComplaints = complaints.reduce(function(uniqs, complaint) {
        if (complaint.state) {
          uniqs[complaint.state] = uniqs[complaint.state] ? ++uniqs[complaint.state]: 1;
        }
        return uniqs;
      }, {});

      console.log('states: issue count', stateComplaints);

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

      // (Net births) in [states]
      asyncReduce(Object.keys(stateComplaints), {}, netBirths, function(err,stateGrowth) {
        if (err) {
          console.log(err);
        } else {
          console.log('stateGrowth, stateComplaints', stateGrowth, stateComplaints);

          var max = 'NY';
          // find fastest growing state
          for (var state in stateGrowth) {
            max = stateGrowth[state] > stateGrowth[max] ? max: state;
          }

          // send (state, product) to client HERE in response body
          console.log('fastest growing state:',max, '# of complaints about',product, stateComplaints[max]);

        }
      });
    })
    .catch(function(err) {
      console.log(err);
    });
};
