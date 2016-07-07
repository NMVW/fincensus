// populate banks table from Consumer Complaints DB API
var complaintsRequest = require('./utils').complaintsRequest;
var baseComplaints = 'https://data.consumerfinance.gov/resource/jhzv-w97w.json?';

function initIssuesTable(Issue) {
  var promisedIssues = [];
      
  // get all issues
  promisedIssues = promisedIssues.concat(
    complaintsRequest(baseComplaints + '$select=issue&$group=issue')
      .then(function(data) {
        var issues = JSON.parse(data);
        
        var promisedIssues = issues.map(function(issue) {
          return Issue.create({name:issue.issue});
        });
        console.log('Issues initialized.');
        return Promise.all(promisedIssues);
      })
      .catch(function(err) {
        console.log('Issues not initialized properly!');
      })
  );
    
  return Promise.all(promisedIssues);
};

exports.initIssuesTable = initIssuesTable;
