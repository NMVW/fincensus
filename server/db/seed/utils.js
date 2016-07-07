/* SEED utils */
var request = require('request-promise');

// Fips Conversion
// https://en.wikipedia.org/wiki/Federal_Information_Processing_Standard_state_code
var stateToFips = {
  AL: 01, AK: 02, AZ: 04, AR: 05, CA: 06, CO: 08, CT: 09,
  DE: 10, DC: 11, FL: 12, GA: 13, HI: 15, ID: 16, IL: 17,
  IN: 18, IA: 19, KS: 20, KY: 21, LA: 22, ME: 23, MD: 24,
  MA: 25, MI: 26, MN: 27, MS: 28, MO: 29, MT: 30, NE: 31,
  NV: 32, NH: 33, NJ: 34, NM: 35, NY: 36, NC: 37, ND: 38,
  OH: 39, OK: 40, OR: 41, PA: 42, PR: 72, RI: 44, SC: 45,
  SD: 46, TN: 47, TX: 48, UT: 49, VT: 50, VA: 51, WA: 53,
  WV: 54, WI: 55, WY: 56
};
function flip(obj) {
  var flipped = {};
  for (var key in obj) {
    flipped[obj[key]] = key;
  }
  return flipped;
};
exports.stateToFips = stateToFips;
exports.fipsToState = flip(stateToFips);
exports.flip = flip;

// map year of change to periods for API endpoint
exports.DATES = {2011: 4, 2012: 5, 2013: 6, 2014: 7, 2015: 8};
exports.PERIODS = {2011:2, 2012:3, 2013:4, 2014:5, 2015:6};
exports.stateToName = {
  'AK': 'ALASKA', 'AL': 'ALABAMA', 'AR': 'ARKANSAS', 'AZ': 'ARIZONA',
  'CA': 'CALIFORNIA', 'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DE': 'DELAWARE',
  'FL': 'FLORIDA', 'GA': 'GEORGIA', 'HI': 'HAWAII', 'IA': 'IOWA', 'ID': 'IDAHO',
  'IL': 'ILLINOIS', 'IN': 'INDIANA', 'KS': 'KANSAS', 'KY': 'KENTUCKY',
  'LA': 'LOUISIANA', 'MA': 'MASSACHUSETTS', 'MD': 'MARYLAND', 'ME': 'MAINE',
  'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MO': 'MISSOURI', 'MS': 'MISSISSIPPI',
  'MT': 'MONTANA', 'NE': 'NEBRASKA', 'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA',
  'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY', 'NM': 'NEW MEXICO', 'NY': 'NEW YORK',
  'NV': 'NEVADA', 'OH': 'OHIO', 'OK': 'OKLAHOMA', 'OR': 'OREGON', 'PA': 'PENNSYLVANIA',
  'PR': 'PUERTO RICO', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA', 'SD': 'SOUTH DAKOTA',
  'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH', 'VA': 'VIRGINIA', 'VT': 'VERMONT',
  'WA': 'WASHINGTON', 'WI': 'WISCONSIN', 'WV': 'WEST VIRGINIA', 'WY': 'WYOMING'
};

// include app token in requests
exports.complaintsRequest = request.defaults({
  headers: {
    'X-App-Token': process.env.TOKEN
  }
});
