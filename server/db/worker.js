// Cron Worker will update database on schedule
// NOTE: in case of server outage, just reset
var schedule = require('node-schedule');

var Bank = require('./db.config').Bank;
var State = require('./db.config').State;
var Population = require('./db.config').Population;
var Complaint = require('./db.config').Complaint;
var Product = require('./db.config').Product;
var Submission = require('./db.config').Submission;
var Issue = require('./db.config').Issue;

var initStatesTable = require('./seed/state.seed').initStatesTable;
var initBanksTable = require('./seed/bank.seed').initBanksTable;
var initPopulationsTable = require('./seed/population.seed').initPopulationsTable;
var initProductsTable = require('./seed/product.seed').initProductsTable;
var initIssuesTable = require('./seed/issue.seed').initIssuesTable;
var initSubmissionsTable = require('./seed/submission.seed').initSubmissionsTable;
var initComplaintsTable = require('./seed/complaint.seed').initComplaintsTable;

// States will never change?

// Population updates from Census API ~1/year around July 1
exports.populationUpdate = schedule.scheduleJob({
  dayOfMonth: 1,
  month: 7,
  hour: 0,
  minute: 0
}, initPopulationsTable.bind(null, Population));

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

// Complaints will always update 10k results every 6 hours until reached max
// offset should increment by 10000 each query (start offset=0)
var offset = 0;
function complaintsOffset() {
  offset += 10000;
  return initComplaintsTable(Complaint, offset);
};

exports.complaintsUpdate = schedule.scheduleJob({
  hour: 6,
  minute: 0
}, complaintsOffset);
