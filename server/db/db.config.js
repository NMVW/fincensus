/* Database configuration */
var worker = require('./worker');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var sequelize = null;
var Schemas = require('./schemas');

if (process.env.CLEARDB_DATABASE_URL) {
  console.log('Initializing production DB connection: ', process.env.CLEARDB_DATABASE_URL);
  //initialize db on production server
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    pool: {
      maxConnections: 10,
      maxIdleTime: 30
    }
  });
} else {
  //initialize db on localhost
  sequelize = new Sequelize('fincensus', 'root', '', {logging: false});
}

var Bank = sequelize.define('Bank', Schemas.Bank);
var State = sequelize.define('State', Schemas.State);
var Population = sequelize.define('Population', Schemas.Population);
var Complaint = sequelize.define('Complaint', Schemas.Complaint);
var Product = sequelize.define('Product', Schemas.Product);
var Issue = sequelize.define('Issue', Schemas.Issue);
var Submission = sequelize.define('Submission', Schemas.Submission);

/* Define relationships */
// 1:m
Complaint.belongsTo(Bank, {constraints: false});
Complaint.belongsTo(Product);
Complaint.belongsTo(State);
Complaint.belongsTo(Issue);
Complaint.belongsTo(Submission);

Population.belongsTo(State);

// m:n
State.belongsToMany(Bank, {through: 'BankState'});
Bank.belongsToMany(State, {through: 'BankState'});

// creates these tables in MySQL if they don't already exist. Pass in {force: true}
// to drop all existing tables and make new ones. ie: sequelize.sync({force: true});
sequelize.sync({force:false});

// paginate results to max 200 per request

var initStatesTable = require('./seed/state.seed').initStatesTable;
var initBanksTable = require('./seed/bank.seed').initBanksTable;
var initPopulationsTable = require('./seed/population.seed').initPopulationsTable;
var initProductsTable = require('./seed/product.seed').initProductsTable;
var initIssuesTable = require('./seed/issue.seed').initIssuesTable;
var initSubmissionsTable = require('./seed/submission.seed').initSubmissionsTable;
var initComplaintsTable = require('./seed/complaint.seed').initComplaintsTable;
/* Build Re-use of init functions to handle creation OR updates */

// ORDER OF INITIALIZATION (foreign key constraints)
// States -> Banks -> Populations -> Products -> Issues -> Submissions -> Complaints
exports.initializeDB = function initializeDatabase() {
    
  return initProductsTable(Product)
    .then(function(product) {
      console.log('Products seeded.', product);
      return initIssuesTable(Issue);
    })
    .then(function(issue) {
      console.log('Issues seeded.', issue);
      return initSubmissionsTable(Submission);
    })
    .then(function(submission) {
      console.log('Submissions seeded.', submission);
      return initStatesTable(State);
    })
    .then(function(state) {
      console.log('States seeded.', state);
      return initBanksTable(Bank, State);
    })
    .then(function(bank) {
      console.log('Banks seeded.', bank);
      return initPopulationsTable(Population, State);
    })
    .then(function(population) {
      console.log('Populations seeded.', population);
      return initComplaintsTable(Complaint, State, Bank, Product, Submission, Issue, 0);
    })
    .then(function(complaint) {
      console.log('Complaints seeded.', complaint);
      return Promise.resolve(true);
    })
    .catch(function(err) {
      console.log('Error in seed chain', err);
    });
};

exports.Bank = Bank;
exports.State = State;
exports.Population = Population;
exports.Complaint = Complaint;
exports.Product = Product;
exports.Submission = Submission;
exports.Issue = Issue;
exports.sequelize = sequelize;
