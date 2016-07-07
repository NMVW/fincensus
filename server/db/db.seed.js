/* Seed Database */
// sources: Census + Consumer Complaints
var request = require('request-promise');



var censusRequest = request.defaults({
  headers: {
    'key': process.env.KEY
  }
});







// poulate product, bank, state,type, and complaint tables
// BANK
//// Consumer Complaints DB
complaintsRequest(baseComplaints + '?company=' + bank + '&$where=date_sent_to_company between "' + start + '" and "' + end + '"')
  .then(function(complaints) {
    complaints = JSON.parse(complaints);

    // (States) that [bank] had complaints in [year]
    var states = complaints.reduce(function(uniqs, complaint) {
      // exclude provinces 'AP', 'GU'
      if (complaint.state && complaint.state !== 'AP' && complaint.state !== 'GU') {
        uniqs[complaint.state] = true;
      }
      return uniqs;
    }, {});
    
    states = Object.keys(states);

    // helper for concurrent reduce
    function sumBirths(births, state, cb) {

            }
  })
  .catch(function(err) {
    console.log(err);
  });

// STATE
complaintsRequest(baseComplaints + '?state=' + state + '&$select=product,count(issue)&$group=product')
  .then(function(data) {

    // extract [rank] most complained about product
    var products = JSON.parse(data).sort(function(a, b) {return +b.count_issue - +a.count_issue});
    var select = products[rank - 1];

    var result = {
      state: state,
      rank: rank,
      product: select
    };
    // send select to client HERE
    res.send(result);
  })
  .catch(function(err) {
    console.log(err);
  });

//



//// (State) of [rank] most growth with most complaints about [product]
// inputs: number OPTIONAL, string, number OPTIONAL -> output: [string, string]
exports.states = function(rank, product, year, res) {
  rank = rank || 1;
  product = product || 'Mortgage';
  year = year || 2015;

  var start = new Date('' + year).toISOString().replace('Z', '');
  var end = new Date('' + (year + 1)).toISOString().replace('Z', '');
      
      // find # of complaints for [product] in found state
      //// Consumer Complaints DB
      complaintsRequest(baseComplaints + '?product=' + product + '&state=' + select + '&$where=date_sent_to_company between "' + start + '" and "' + end + '"')
        .then(function(complaints) {
          complaints = JSON.parse(complaints);
          
          var result = {
            rank: rank,
            state: select,
            top: {
              product: product,
              complaints: complaints.length
            }
          };
          // (State) that [bank] had complaints in [year]
          res.send(result);
        }).catch(function(err) {
          console.log(err);
        });
}
 

exports.initialize = function(res) {
  //// Consumer Complaints DB
  var companies = []
  var products = [];
  
  // find API-valid banks,
  complaintsRequest(baseComplaints + '?$select=company&$group=company')
    .then(function(companies) {
      companies = JSON.parse(companies).map(function(entry) {
        return entry.company;
      });
      // products,
      complaintsRequest(baseComplaints + '?$select=product&$group=product')
        .then(function(products) {
          products = JSON.parse(products).map(function(entry) {
            return entry.product;
          });
          var result = {
            companies: companies,
            products: products
          };
          console.log(result);
          // return the bounds for queries to client
          res.send(result);
        })
        .catch(function(err) {
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log(err);
    });
};

