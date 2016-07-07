// populate banks table from Consumer Complaints DB API
var complaintsRequest = require('./utils').complaintsRequest;
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';

function initSubmissionsTable(Submission) {
  var promisedSubmissions = [];
      
  // get all submissions
  promisedSubmissions = promisedSubmissions.concat(
    complaintsRequest(baseComplaints + '$select=submitted_via,count(submitted_via)&$group=submitted_via')
      .then(function(data) {
        var submissions = JSON.parse(data);
        
        var promisedSubmissions = submissions.map(function(submission) {
          return Submission.create({via:submissions.submitted_via});
        });
        console.log('submissions initialized.');
        return Promise.all(promisedSubmissions);
      })
      .catch(function(err) {
        console.log('submissions not initialized properly!');
      })
  );
    
  return Promise.all(promisedSubmissions);
};

exports.initSubmissionsTable = initSubmissionsTable;
