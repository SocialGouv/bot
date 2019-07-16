const createNewBranchFromNewIssues = require('./hooks/createNewBranchFromNewIssues');

module.exports = (app) => {
  app.on('issue_comment.created', createNewBranchFromNewIssues.bind(app));
};
