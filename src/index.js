/* eslint-disable no-case-declarations */

const { GITHUB_AUTHOR_ASSOCIATION } = require('./constants');

module.exports = (app) => {
  app.on('issue_comment.created', async (context) => {
    const {
      id, github, name, payload,
    } = context;
    app.log(`[${name}] [#${id}] Event received`);

    try {
      if (!payload.comment.body.startsWith('!branch')) return;

      switch (payload.comment.author_association) {
        case GITHUB_AUTHOR_ASSOCIATION.COLLABORATOR:
        case GITHUB_AUTHOR_ASSOCIATION.OWNER:
          app.log(`[${name}] [#${id}] Creating new branch for issue ${payload.issue.html_url}`);

          const defaultBranch = context.payload.repository.default_branch;
          const owner = context.payload.repository.owner.login;
          const repo = context.payload.repository.name;
          const newBranch = payload.issue.title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/, '');

          // http://octokit.github.io/rest.js/#octokit-routes-repos-get-branch
          const {
            data: {
              commit: defaultBranchCommit,
            },
          } = await github.repos.getBranch({ branch: defaultBranch, owner, repo });

          // http://octokit.github.io/rest.js/#octokit-routes-git-create-ref
          // https://stackoverflow.com/a/9513594/2736233
          app.log({
            owner, ref: `refs/heads/${newBranch}`, repo, sha: defaultBranchCommit.sha,
          });
          await github.git.createRef({
            owner, ref: `refs/heads/${newBranch}`, repo, sha: defaultBranchCommit.sha,
          });

          // http://octokit.github.io/rest.js/#octokit-routes-issues-create-comment
          await github.issues.createComment(
            context.issue({
              body: `Branch \`${newBranch}\` created. You can now run:\n\n    git fetch -p && git checkout ${newBranch}.`,
            }),
          );
          break;

        case GITHUB_AUTHOR_ASSOCIATION.NONE:
        default:
          return;
      }
    } catch (err) {
      app.log.error(`[${name}] [#${id}] ERROR: ${err.message}`);
      app.log.debug(err);
    }
  });
};
