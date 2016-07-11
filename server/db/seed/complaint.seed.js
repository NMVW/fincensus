// populate banks table from Consumer Complaints DB API
var complaintsRequest = require('./utils').complaintsRequest;
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';

function initComplaintsTable(Complaint, State, Bank, Product, Submission, Issue, offset) {
  offset = offset || 0;
      
  // get the first 10,000 complaints
  return complaintsRequest(baseComplaints + '$select=*&$order=date_sent_to_company&$limit=100&$offset=' + offset)
    .then(function(data) {
      var complaints = JSON.parse(data);
      
      var promisedStateComplaints = complaints.map(function(complaint) {
        
        return (function() {
          
          var compl = {
            cid: complaint.complaint_id,
            date: complaint.date_sent_to_company
          };
          
          var issue = complaint.issue;
          var product = complaint.product;
          var state = complaint.state;
          var via = complaint.submitted_via;
          var bank = complaint.company;    

          return Complaint.create(compl)
            .then(function(complaint) {
              var promisedAssoc = [];
              
              promisedAssoc = promisedAssoc.concat(State.findAll({where: {capital: state}})
                .then(function(state) {
                  console.log('complaint state:', state);
                  return complaint.setState(state[0]);
                })
              );                
              promisedAssoc = promisedAssoc.concat(Bank.findAll({where: {name: bank}})
                .then(function(bank) {
                  console.log('complaint bank:', bank);

                  return bank ? complaint.setBank(bank[0]): complaint.setBank('Not in dataset');
                }));  
              promisedAssoc = promisedAssoc.concat(Product.findAll({where: {name: product}})
                .then(function(product) {
                  console.log('complaint product:', product);

                  return complaint.setProduct(product[0]);
                }));
              promisedAssoc = promisedAssoc.concat(Submission.findAll({where: {via: via}})
                .then(function(sub) {
                  console.log('complaint submission:', submission);

                  return complaint.setSubmission(sub[0]);
                }));
              promisedAssoc = promisedAssoc.concat(Issue.findAll({where: {name: issue}})
                .then(function(issue) {
                  console.log('complaint issue:', issue);

                  return complaint.setIssue(issue[0]);
                }));
              return Promise.all(promisedAssoc);
            });
            
        })();
        
      });
      console.log('State Complaints initialized.');
      return Promise.all(promisedStateComplaints);
    })
    .catch(function(err) {
      console.log('State Complaints not initialized properly!', err);
    })
    
};

exports.initComplaintsTable = initComplaintsTable;
