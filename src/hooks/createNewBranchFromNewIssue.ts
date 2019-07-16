import * as Webhooks from "@octokit/webhooks";

import { Hook } from "./types";
import generateBranchNameFromText from "../helpers/generateBranchNameFromText";
import isCollaborator from "../helpers/isCollaborator";

/**
 * Auto-generate a branch named after the issue title if a a collaborator-like user for the related
 * repository is the one who opened it.
 *
 * @todo Check if the branch does not already exists.
 */
let createNewBranchFromNewIssue: Hook<Webhooks.WebhookPayloadIssues>;
export default createNewBranchFromNewIssue = async function(context) {
  const { id, github, name, payload } = context;
  const LOG_PREFIX = `[${name}] [#${id}]`;
  this.log(`${LOG_PREFIX} Event received`);

  try {
    // Only repository collaborator-like users are allowed to call this hook:
    if (!isCollaborator(payload.issue.author_association)) return;
    this.log(`${LOG_PREFIX} Creating new branch for issue ${payload.issue.html_url}`);

    const defaultBranchName = context.payload.repository.default_branch;
    const repositoryOwner = context.payload.repository.owner.login;
    const repositoryName = context.payload.repository.name;
    const newBranchName = generateBranchNameFromText(payload.issue.title);

    // Fetch the default branch info:
    // http://octokit.github.io/rest.js/#octokit-routes-repos-get-branch
    const { data: defaultBranchData } = await github.repos.getBranch({
      branch: defaultBranchName,
      owner: repositoryOwner,
      repo: repositoryName
    });
    const defaultBranchCommitHash = defaultBranchData.commit.sha;

    // Create a new branch from the last default branch commit:
    // http://octokit.github.io/rest.js/#octokit-routes-git-create-ref
    // https://stackoverflow.com/a/9513594/2736233
    await github.git.createRef({
      owner: repositoryOwner,
      ref: `refs/heads/${newBranchName}`,
      repo: repositoryName,
      sha: defaultBranchCommitHash
    });

    // Post a new comment on this issue to confirm the branch creation:
    // http://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
    const newIssueCommentBody =
      `Branch \`${newBranchName}\` created. You can now run:\n\n` +
      `    git fetch -p && git checkout ${newBranchName}.`;
    const newIssueComment = context.issue({ body: newIssueCommentBody });
    await github.issues.createComment(newIssueComment);
  } catch (err) {
    this.log.error(`${LOG_PREFIX} ERROR: ${err.message}`);
    this.log.debug(err);
  }
};
