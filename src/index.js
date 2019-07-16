const createNewBranchFromIssueComment = require('./hooks/createNewBranchFromIssueComment');
const createNewBranchFromNewIssue = require('./hooks/createNewBranchFromNewIssue');

module.exports = (app) => {
  app.on('issue_comment.created', createNewBranchFromIssueComment.bind(app));
  app.on('issues.opened', createNewBranchFromNewIssue.bind(app));
};
