/* Database configuration */
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
var Type = sequelize.define('Type', Schemas.Type);

/* Define relationships */
// 1:m
Complaint.belongsTo(Bank);
Complaint.belongsTo(Product);
Type.belongsTo(Product);
Population.belongsTo(State);

// m:n
State.belongsToMany(Bank, {through: 'BankState'});
Bank.belongsToMany(State, {through: 'BankState'});

// creates these tables in MySQL if they don't already exist. Pass in {force: true}
// to drop all existing tables and make new ones. ie: sequelize.sync({force: true});
sequelize.sync({force:false});

// paginate results to max 200 per request

var initStatesTable = require('./seed/state.seed').initStatesTable;
var initPopulationsTable = require('./seed/population.seed').initPopulationsTable;
var initBanksTable = require('./seed/bank.seed').initBanksTable;




initStatesTable(State).then(function(res) {
  
  initBanksTable(Bank)
    .then(function(res) {
      console.log('Banks seeded.', res);
    })
    .catch(function(err) {
      console.log('Banks not seeded properly!', err);
    });
// initPopulationsTable(Population)
//     .then(function(res) {
//       console.log('response from population chain:', res);
//     })
//     .catch(function(err) {
//       console.log('error on child population chain:',err)
//     }); 

})
.catch(function(err) {
  console.log('error on states chain:', err);
});
// State.create({capital:'no', name:'no'})
//   .then(function(state) {
//     console.log('is this the state object from the promise?', state.dataValues);
//   });
// State.find({where:{capital:'GA'}}).then(function(state) {
//   Population.create({population: 101, year: 2020}).then(function(pop) {
//     return pop.setState('GA');
//   }); 
// })

exports.Bank = Bank;
exports.State = State;
exports.Population = Population;
exports.Complaint = Complaint;
exports.Product = Product;
exports.Type = Type;
