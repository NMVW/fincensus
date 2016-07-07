// populate banks table from Consumer Complaints DB API
var complaintsRequest = require('./utils').complaintsRequest;
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';

function initComplaintsTable(Complaint, offset) {
  var promisedComplaints = [];
      
  // get the first 10,000 complaints
  promisedComplaints = promisedComplaints.concat(
    complaintsRequest(baseComplaints + '$select=*&limit=10000&$order=date_sent_to_company&$offset=' + offset)
      .then(function(data) {
        var complaints = JSON.parse(data);
        
        var promisedComplaints = complaints.map(function(complaint) {
          
          (function() {
            
            var compl = {
              cid: compalaint.complaint_id,
              date: complaint.date_sent_to_company
            };
            
            var issue = complaint.issue;
            var product = complaint.product;
            var state = complaint.state;
            var via = complaint.submitted_via;
            var bank = complaint.company;    
            
            return Complaint.create(compl)
              .then(function(complaint) {
                complaint.setState(state);
                complaint.setBank(bank);
                complaint.setProduct(product);
                complaint.setSubmission(via);
                complaint.setIssue(issue);
              });
              
          })();
          
        });
        console.log('Complaints initialized.');
        return Promise.all(promisedComplaints);
      })
      .catch(function(err) {
        console.log('Complaints not initialized properly!');
      })
  );
    
  return Promise.all(promisedComplaints);
};

exports.initComplaintsTable = initComplaintsTable;
