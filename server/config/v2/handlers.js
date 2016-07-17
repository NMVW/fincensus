// helpers
// var sumReduce = require('../utils.js').sumReduce;
// var asyncReduce = require('../utils.js').asyncReduce;
var Sequelize = require('sequelize');
var sequelize = null;
var models = require('../../db/db.config');

if (process.env.CLEARDB_DATABASE_URL) {
  //initialize db connection on production server
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);
} else {
  //initialize db connection on localhost
  sequelize = new Sequelize('fincensus', 'root', '', {logging: false});
}

// import database models
var Bank = models.Bank;
var State = models.State;
var Population = models.Population;
var Complaint = models.Complaint;
var Product = models.Product;
var Submission = models.Submission;
var Issue = models.Issue;

//// (Product) of [prodRank] most complaints in [state] of
// inputs: 2 CHAR uppercase string, number OPTIONAL -> output: string
exports.complaintsToProduct = function(state, prodRank, res) {
  state = state || 'CO';
  prodRank = prodRank || 1;
  var queryString = 'SELECT COUNT(productname), productname AS product FROM complaints WHERE statecapital="'+ state +'" GROUP BY productname ORDER BY -COUNT(productname);';
  // TODO: refactor raw SQL to optimized Sequelize query
  // Complaint.findAll({statecapital: state , offset: prodRank-1, limit: 1, number: sequelize.fn('COUNT', 'productname') order: 'by number desc'})
  return sequelize.query(queryString)
    .then(function(complaints) {
      console.log(prodRank + ' most complained about product in ' + state + ':', complaints[prodRank - 1][prodRank - 1]);
      var product = complaints[0].length ? complaints[prodRank - 1][prodRank - 1].product: null;
      var numberOfC = complaints[prodRank - 1].reduce(function(total, curr) {
        return total + curr['COUNT(productname)'];
      }, 0); 
          
      var result = {
        state: state,
        product: {
          name: product,
          rank: prodRank,
          complaints: numberOfC
        }
      };
      res.json(result);
    })
    .catch(function(err) {
      console.log(err);
      res.json(null);
    });
};

//// (Number of births) in the states where [bank] had a complaint in [year]
// inputs: string, number -> output: number
exports.pop = function(bank, year, res) {
  bank = bank || 'Bank of America';
  year = year || 2015;
  
  // var start = new Date('' + year).toISOString().replace('Z', '');
  // var end = new Date('' + (year + 1)).toISOString().replace('Z', '');

  return sequelize.query('select sum(births) as sumOfBirths from populations where statecapital in (select statecapital as states from complaints where bankname="' + bank + '" group by statecapital) and year="' + year + '";')
    .then(function(births) {
      console.log('Total births in states where '+bank+' had complaints in '+year+':', births[0][0].sumOfBirths);
      
      // TODO: Can send separate query to retrieve number of states affected
      var results = {
        // states: states.length,
        births: births[0][0].sumOfBirths,
        bank: bank,
        year: year
      };
      res.json(results);
    })
    .catch(function(err) {
      console.log('Error with SQL query', err);
      res.json(null);
    });  
}; 

//// (State) of [stateRank] most growth with product of [rank] complaints
// inputs: number OPTIONAL, number OPTIONAL, number OPTIONAL -> output: {state: {rank, name}, product: {rank, name, complaints}}
exports.states = function(stateRank, prodRank, year, res) {
  stateRank = stateRank || 1;
  prodRank = prodRank || 1;
  year = year || 2015;
  console.log(stateRank, prodRank, year);
  var start = new Date('' + year).toISOString().replace('Z', '');
  var end = new Date('' + (year + 1)).toISOString().replace('Z', '');
  var queryString = 'select (births-deaths) as growth,statecapital from populations where year="' + year + '" and statecapital is not null order by -growth;';
  
  // Sequelize: find state of [stateRank] most growth in [year]
  return sequelize.query(queryString)
    .then(function(growths) {
      console.log('State of '+ stateRank +' growth:', growths[stateRank-1][stateRank-1].statecapital);
      var state = growths[stateRank - 1][stateRank - 1].statecapital;
      
      // then find [prodRank] complaints about [product] in found state
      queryString = 'select count(productname),productname from complaints where statecapital="' + state +'" and date between "' + start + '" and "' + end +'" group by productname order by -count(productname);';
      return sequelize.query(queryString)
        .then(function(products) {
          console.log('Product of '+prodRank+' most complaints in '+state+ ':', products[prodRank - 1][prodRank - 1].productname);
          var product = products[prodRank - 1][prodRank - 1].productname;
          var count = products[prodRank - 1][prodRank - 1]['count(productname)'];
          var results = {
            state: {
              name: state,
              rank: stateRank
            },
            product: {
              name: product,
              rank: prodRank,
              complaints: count
            }
          };
          console.log('Sending to client:', results);
          res.json(results);
        })
        .catch(function(err) {
          console.log('Error querying product', err);
          res.json(null);
        });
    })
    .catch(function(err) {
      console.log('Error querying state', err);
      res.json(null);
    });
};

exports.initialize = function(res) {
  //// Consumer Complaints DB
  var companies = []
  var products = [];
  
  // find API-valid banks,
  return Bank.findAll()
    .then(function(companies) {
      companies = companies.map(function(company) {
        return company.dataValues.name;
      });
      return companies;
    })
    .then(function(companies) {
      return Product.findAll()
        .then(function(products) {
          products = products.map(function(product) {
            return product.dataValues.name;
          });
          res.json({companies: companies, products: products});
        })
        .catch(function(err) {
          console.log('Error finding products', err);
          res.json(null);
        });
    })
    .catch(function(err) {
      console.log('Error finding companies', err);
      res.json(null);
    });
};
