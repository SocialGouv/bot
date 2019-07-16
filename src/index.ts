import { Application } from "probot";

import createNewBranchFromIssueComment from "./hooks/createNewBranchFromIssueComment";
import createNewBranchFromNewIssue from "./hooks/createNewBranchFromNewIssue";

export = (app: Application) => {
  // Listen to new issue comments creation:
  app.on("issue_comment.created", createNewBranchFromIssueComment.bind(app));
  // Listen to new issues creation:
  app.on("issues.opened", createNewBranchFromNewIssue.bind(app));
};
