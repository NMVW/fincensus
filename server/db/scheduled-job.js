/* Naïve implementation of web worker process model using HEROKU SCHEDULER */

// NOTE: first iteration -> update update complaints table with 10k/job results until 600k total
var Complaint = require('./db.config').Complaint;
var initComplaintsTable = require('./seed/complaint.seed').initComplaintsTable;

// Complaints will always update 10k results every 1 hour until reached max
// offset should increment by 10000 each query (start offset=0)
var offset = 0;
function complaintsOffset() {
  offset += 10000;
  return offset <= 600000 ? initComplaintsTable(Complaint, offset): false;
};

complaintsOffset();

// TODO: web worker handles message queue and stores recent queries
