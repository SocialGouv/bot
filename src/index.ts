import { Application } from "probot";

import createNewBranchFromIssueComment from "./hooks/createNewBranchFromIssueComment";
import createNewBranchFromNewIssue from "./hooks/createNewBranchFromNewIssue";

export = (app: Application) => {
  app.on("issue_comment.created", createNewBranchFromIssueComment.bind(app));
  app.on("issues.opened", createNewBranchFromNewIssue.bind(app));
};
