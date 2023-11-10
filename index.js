/**
 * This is the main entrypoint
 * @param {import('probot').Probot} app
 */
const createPrompt = require("./llm");

module.exports = triggerPR;

function triggerPR(app) {
  app.on(
    ["pull_request.opened", "pull_request.edited", "pull_request.synchronize"],
    triggerCommandAndCommentResult
  );

  async function triggerCommandAndCommentResult(context) {
    let commandsArr = [];

    const commandsFromPRDescription = getCommands(
      context.payload.pull_request.body
    );

    const commitMessagesList = await getCommitMessages(context);

    const commandsFromCommitMessages = commitMessagesList.map((commitMessage) =>
      getCommands(commitMessage)
    );

    commandsArr = [...commandsFromPRDescription, ...commandsFromCommitMessages]
      .flat()
      .filter((command) => command)
      .reduce((uniqueCommands, command) => {
        if (!uniqueCommands.includes(command)) {
          uniqueCommands.push(command);
        }
        return uniqueCommands;
      }, []);

    if (commandsArr.length === 0) {
      return context.octokit.issues.createComment(
        context.issue({
          body: `To execute commands, please add the following commands in the PR description or in the commit messages: \n\n - /execute \n - /explain`,
        })
      );
    }

    commandsArr.forEach(async (command) => {
      const result = await executeCommand(command, context);
      context.log(result);
      const comment = context.issue({
        body: `${result}`,
      });
      return context.octokit.issues.createComment(comment);
    });
  }

  async function getCommitMessages(context) {
    const commits = await context.octokit.pulls.listCommits({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      pull_number: context.payload.pull_request.number,
    });

    // Extract commit messages
    const commitMessagesList = commits.data.map(
      (commit) => commit["commit"]["message"]
    );
    // context.log(commitMessages);

    return commitMessagesList;
  }

  function getCommands(description) {
    // Initially We will only support 2 commmands. /execute and /explain
    const executeCommandRegex = /\/execute/i;
    const explainCommandRegex = /\/explain/i;

    const commands = [];

    if (explainCommandRegex.test(description)) {
      commands.push("explain");
    }

    if (executeCommandRegex.test(description)) {
      commands.push("execute");
    }

    return commands;
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
