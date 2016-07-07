/* Database configuration */
var worker = require('./worker');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var sequelize = null;
var Schemas = require('./schemas');

if (process.env.CLEARDB_DATABASE_URL) {
  //initialize db on production server
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);
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
Complaint.belongsTo(Bank);
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
var initIssuesTable = require('./seed/product.seed').initIssuesTable;
var initSubmissionsTable = require('./seed/product.seed').initSubmissionsTable;
var initComplaintsTable = require('./seed/product.seed').initComplaintsTable;
/* Build Re-use of init functions to handle creation OR updates */

// ORDER OF INITIALIZATION (foreign key constraints)
// States -> Banks -> Populations -> Products -> Issues -> Submissions -> Complaints
initStatesTable(State)
  .then(function(res) {
    console.log('States seeded.', res);
    return initBanksTable(Bank);
  })
  .then(function(res) {
    console.log('Banks seeded.', res);
    return initPopulationsTable(Population);
  })
  .then(function(res) {
    console.log('Populations seeded.', res);
    return initProductsTable(Product);
  })
  .then(function(res) {
    console.log('Products seeded.', res);
    return initIssuesTable(Issue);
  })
  .then(function(res) {
    console.log('Issues seeded.', res);
    return initSubmissionsTable(Submission);
  })
  .then(function(res) {
    console.log('Submissions seeded.', res);
    return initComplaintsTable(Complaint);
  })
  .then(function(res) {
    console.log('Complaints seeded.', res);
    return Promise.resolve('Database seeded.');
  })
  .catch(function(err) {
    console.log('Seeding failed.', err);
    return Promise.reject('Database not seeded.');
  });
  
exports.Bank = Bank;
exports.State = State;
exports.Population = Population;
exports.Complaint = Complaint;
exports.Product = Product;
exports.Submission = Submission;
exports.Issue = Issue;
