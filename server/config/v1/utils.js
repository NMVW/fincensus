// Useful constants and helpers

// CONCURRENT reduce
exports.sumReduce = require('async-reduce').concurrent(10, 0, function(a,b) {
  console.log('concurrent operation:', a, b);
  return a + b;
});

exports.asyncReduce = require('async-reduce');

// Data sources - json
exports.baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json';
exports.baseCensus = 'https://api.census.gov/data/2015/pep/';

// Conversion for Census API
// https://en.wikipedia.org/wiki/Federal_Information_Processing_Standard_state_code
exports.stateToFips = {
  AL: 01,
  AK: 02,
  AZ: 04,
  AR: 05,
  CA: 06,
  CO: 08,
  CT: 09,
  DE: 10,
  DC: 11,
  FL: 12,
  GA: 13,
  HI: 15,
  ID: 16,
  IL: 17,
  IN: 18,
  IA: 19,
  KS: 20,
  KY: 21,
  LA: 22,
  ME: 23,
  MD: 24,
  MA: 25,
  MI: 26,
  MN: 27,
  MS: 28,
  MO: 29,
  MT: 30,
  NE: 31,
  NV: 32,
  NH: 33,
  NJ: 34,
  NM: 35,
  NY: 36,
  NC: 37,
  ND: 38,
  OH: 39,
  OK: 40,
  OR: 41,
  PA: 42,
  PR: 72,
  RI: 44,
  SC: 45,
  SD: 46,
  TN: 47,
  TX: 48,
  UT: 49,
  VT: 50,
  VA: 51,
  WA: 53,
  WV: 54,
  WI: 55,
  WY: 56
};

// map year of change to periods for API endpoint
exports.periods = {
  2011: 2,
  2012: 3,
  2013: 4,
  2014: 5,
  2015: 6
};
