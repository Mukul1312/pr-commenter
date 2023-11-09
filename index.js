/**
 * This is the main entrypoint
 * @param {import('probot').Probot} app
 */
const createPrompt = require("./llm");

module.exports = triggerPR;

function triggerPR(app) {
  
  app.on("pull_request.opened", triggerCommandAndCommentResult);

  async function triggerCommandAndCommentResult(context) {
    const executableCommand = findCommandFromPullRequestDescription(
      context.payload.pull_request.body
    );

    if (executableCommand) {
      const result = await executeCommand(executableCommand, context);
      context.log(result);
      const comment = context.issue({
        body: `${result}`,
      });
      return context.octokit.issues.createComment(comment);
    }
  }

  function findCommandFromPullRequestDescription(description) {
    // Initially We will only support 2 commmands. /execute and /explain
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

  async function executeCommand(command, context) {
    if (command === "execute") {
      const files = await pullFilesChanged(context);
      // PISTON API Has to be implemented
      return "Executing the command";
    }

    if (command === "explain") {
      const files = await pullFilesChanged(context);

      const responseFromLLM = await createPrompt({
        numberOfCommits: files.data.length,
        patchesArray: files.data.map((file) => file.patch),
      });

      const message = responseFromLLM.message;
      const content = message["content"];
      return content;
    }
  }

  async function pullFilesChanged(context) {
    const files = await context.octokit.pulls.listFiles({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      pull_number: context.payload.pull_request.number,
    });

    return files;
  }
}
