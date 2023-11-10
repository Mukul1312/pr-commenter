async function fetchPullRequestCommits(context) {
  const result = await context.octokit.pulls.listCommits({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.pull_request.number,
  });

  return result;
}

async function fetchPullRequestFiles(context) {
  const result = await context.octokit.pulls.listFiles({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.pull_request.number,
  });

  return result;
}

async function fetchPullRequestComments(context) {
  const result = await context.octokit.issues.listComments({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    issue_number: context.payload.pull_request.number,
  });

  return result;
}

async function postComment(context, comment) {
  const result = await context.octokit.issues.createComment(
    context.repo({
      issue_number: context.payload.pull_request.number,
      body: comment,
    })
  );
  
  return result;
}

async function updateComment(context, comment_id, comment) {
  const result = await context.octokit.issues.updateComment(
    context.repo({
      comment_id: comment_id,
      body: comment,
    })
  );

  return result;
}

module.exports = {
  fetchPullRequestCommits,
  fetchPullRequestFiles,
  fetchPullRequestComments,
  postComment,
  updateComment,
};
