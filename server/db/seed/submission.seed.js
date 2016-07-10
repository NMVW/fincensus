// populate banks table from Consumer Complaints DB API
var complaintsRequest = require('./utils').complaintsRequest;
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';

function initSubmissionsTable(Submission) {
      
  // get all submissions from Consumer Complaints DB
  return complaintsRequest(baseComplaints + '$select=submitted_via,count(submitted_via)&$group=submitted_via')
    .then(function(data) {
      var submissions = JSON.parse(data);
      
      // create promise chain of submissions
      var promisedSubmissions = submissions.map(function(submission) {
        return Submission.create({via:submission.submitted_via});
      });
      console.log('Submissions initialized.');
      return Promise.all(promisedSubmissions);
    })
    .catch(function(err) {
      console.log('Submissions not initialized properly!');
    })
    
};

exports.initSubmissionsTable = initSubmissionsTable;
