import * as Webhooks from "@octokit/webhooks";

import { Hook } from "./types";
import { GITHUB_AUTHOR_ASSOCIATION } from "../constants";

let createNewBranchFromNewIssue: Hook<Webhooks.WebhookPayloadIssues>;
export default createNewBranchFromNewIssue = async function(context) {
  const { id, github, name, payload } = context;
  this.log(`[${name}] [#${id}] Event received`);

  try {
    if (
      ![GITHUB_AUTHOR_ASSOCIATION.COLLABORATOR, GITHUB_AUTHOR_ASSOCIATION.OWNER].includes(
        payload.issue.author_association
      )
    ) {
      return;
    }

    this.log(`[${name}] [#${id}] Creating new branch for issue ${payload.issue.html_url}`);

    const defaultBranch = context.payload.repository.default_branch;
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const newBranch = payload.issue.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/, "");

    // http://octokit.github.io/rest.js/#octokit-routes-repos-get-branch
    const {
      data: { commit: defaultBranchCommit }
    } = await github.repos.getBranch({ owner, repo, branch: defaultBranch });

    // http://octokit.github.io/rest.js/#octokit-routes-git-create-ref
    // https://stackoverflow.com/a/9513594/2736233
    await github.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha: defaultBranchCommit.sha
    });

    // http://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
    await github.issues.createComment(
      context.issue({
        body: `Branch \`${newBranch}\` created. You can now run:\n\n    git fetch -p && git checkout ${newBranch}.`
      })
    );
  } catch (err) {
    this.log.error(`[${name}] [#${id}] ERROR: ${err.message}`);
    this.log.debug(err);
  }
};
