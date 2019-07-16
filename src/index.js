const createNewBranchFromIssueComment = require('./hooks/createNewBranchFromIssueComment');

module.exports = (app) => {
  app.on('issue_comment.created', createNewBranchFromIssueComment.bind(app));
};
