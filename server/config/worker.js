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

///// QUERIES to Consumer Complaints DB /////////

// inputs: 2 CHAR uppercase string i.e. 'NY' -> output: most complained about product
exports.productRankByState = function(state) {
  request(baseComplaints + '?state=' + state + '&' + '$select=product,count(issue)&$group=product')
    .then(function(data) {

      // pluck most complained about product
      var max = JSON.parse(data)
        .reduce(function(a,b) {
          return +a.count_issue > +b.count_issue ? a: b;
        }, {count_issue:0});

      console.log('send product to client:', max);
    })
    .catch(function(err) {
      console.log(err);
    });
};


///// QUERIES to US Census DB /////////////////

// inputs: bank, year -> output: total number of people born in cities
exports.birthsInRange = function(bank, year) {

  // map year of change to periods for API endpoint
  var periods = {
    2011: 2,
    2012: 3,
    2013: 4,
    2014: 5,
    2015: 6
  };

  // first find cities where bank had Complaints

  // then find number of people born in those cities
  request(baseCensus + 'components?get=BIRTHS,GEONAME&for=state:06&PERIOD=' + periods[year] + '&key=' + process.env.KEY)
    .then(function(data) {
      var births = JSON.parse(data);
      console.log('births in range data!', births);
    });
};
