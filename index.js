/**
 * This is the main entrypoint
 * @param {import('probot').Probot} app
 */
module.exports = triggerPR;

 function triggerPR (app)  {
  app.on("pull_request.opened", triggerCommandAndCommentResult);

  async function triggerCommandAndCommentResult(context) {
    const executableCommand = findCommandFromPullRequestDescription(
      context.payload.pull_request.body
    );

    if (executableCommand) {
      const result = await executeCommand(executableCommand);
      const comment = context.issue({
        body: result,
      });
      return context.octokit.issues.createComment(comment);
    }
  }

  function findCommandFromPullRequestDescription(description) {
    // Initially We will only support 2 commmands. /execute and /explain
    // We will use regex to find the command
    const executeCommandRegex = /\/execute/i;
    const explainCommandRegex = /\/explain/i;

    if (executeCommandRegex.test(description)) {
      return "execute";
    }

    if (explainCommandRegex.test(description)) {
      return "explain";
    }

    return null;
  }

  async function executeCommand(command) {
    if (command === "execute") {
      return "Executing the command";
    }

    if (command === "explain") {
      return "Explaining the command";
    }
  }
};
