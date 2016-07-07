// Cron Worker will update database on schedule
// NOTE: in case of server outage, just reset
var schedule = require('node-schedule');

var initStatesTable = require('./seed/state.seed').initStatesTable;
var initBanksTable = require('./seed/bank.seed').initBanksTable;
var initPopulationsTable = require('./seed/population.seed').initPopulationsTable;
var initProductsTable = require('./seed/product.seed').initProductsTable;
var initIssuesTable = require('./seed/product.seed').initIssuesTable;
var initSubmissionsTable = require('./seed/product.seed').initSubmissionsTable;
var initComplaintsTable = require('./seed/product.seed').initComplaintsTable;

// States will never change?

// Population updates from Census API ~1/year around July 1
exports.populationUpdate = schedule.scheduleJob({
  dayOfMonth: 1,
  month: 7,
  hour: 0,
  minute: 0
}, initPopulationsTable.bind(null, Population));

// Complaints will always update 10k results every 6 hours until reached max
// offset should increment by 10000 each query (start offset=0)
exports.complaintsUpdate = schedule.scheduleJob({
  hour: 6,
  minute: 0
}, initComplaintsTable.bind(null, Complaint, offset + 10000));

// Banks will change every 1 year when taxes roll around
exports.banksUpdate = schedule.scheduleJob({
  dayOfMonth: 15,
  month: 4,
  hour: 0,
  minute: 0
}, initBanksTable.bind(null, Bank));

// Products will change every 6 months
exports.productsUpdate = schedule.scheduleJob({
  dayOfMonth: 1,
  month: 6,
  hour: 0,
  minute: 0
}, initProductsTable.bind(null, Product));

// Issues will change every 6 months
exports.issuesUpdate = schedule.scheduleJob({
  dayOfMonth: 15,
  month: 10,
  hour: 0,
  minute: 0
}, initIssuesTable.bind(null, Issue));

// Submission tech will change every 1 year
exports.submissionsUpdate = schedule.scheduleJob({
  dayOfMonth: 1,
  month: 1,
  hour: 0,
  minute: 0
}, initSubmissionsTable.bind(null, Submission));
