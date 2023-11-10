/**
 * This is the main entrypoint
 * @param {import('probot').Probot} app
 */

const createPrompt = require("./api/openai");
const getCommands = require("./utils/getCommands");

const {
  fetchPullRequestCommits,
  fetchPullRequestComments,
  fetchPullRequestFiles,
  postComment,
  updateComment,
} = require("./api/github");

const getOptmizedPrompt = require('./prompt/llm-prompt');

module.exports = triggerPR;

function triggerPR(app) {
  app.on(["pull_request.opened", "pull_request.edited", "pull_request.synchronize"], triggerCommandAndCommentResult);

  async function triggerCommandAndCommentResult(context) {
    let commandsArr = [];

    // Get commands from PR description
    const commandsFromPRDescription = getCommands(context.payload.pull_request.body);

    // Get commands from PR comments
    const comments = await fetchPullRequestComments(context);
    const commentsList = comments.data.map((comment) => comment.body);
    const commandsFromPRComments = commentsList.map((comment) => getCommands(comment));

    // Get commands from commit messages
    const commits = await fetchPullRequestCommits(context);
    const commitMessagesList = commits.data.map((commit) => commit["commit"]["message"]);
    const commandsFromCommitMessages = commitMessagesList.map((commitMessage) => getCommands(commitMessage));

    // Merge all commands
    commandsArr = [...commandsFromPRDescription, ...commandsFromCommitMessages, ...commandsFromPRComments]
      .flat()
      .filter((command) => command)
      .reduce((uniqueCommands, command) => {
        if (!uniqueCommands.includes(command)) {
          uniqueCommands.push(command);
        }
        return uniqueCommands;
      }, []);


    // This functionality has to be implemented in upcoming features. If no commands are found, then the bot give a list of commands that can be used. in the PR comments.
    // if (commandsArr.length === 0) {
    //   return context.octokit.issues.createComment(
    //     context.issue({
    //       body: `To execute commands, please add the following commands in the comments: \n\n - /execute \n - /explain`,
    //     })
    //   );
    // }

    // Execute all commands and post the result in the PR comments one by one.
    commandsArr.forEach(async (command) => {
      const preliminaryCommentResponse = await postComment(
        context,
        `The code ${command === "explain" ? "explanation" : "execution"} is being processed. Please wait...`
      );

      try {
        const result = await executeCommand(command, context);
        await updateComment(context, preliminaryCommentResponse.data.id, result);
      } catch (error) {
        await updateComment(
          context,
          preliminaryCommentResponse.data.id,
          `There was an error while executing the command. Please try again later.`
        );
      }
    });
  }

  async function executeCommand(command, context) {
    const files = await fetchPullRequestFiles(context);

    if (command === "execute") {
      // PISTON API Has to be implemented
      return "Executing the command";
    }

    if (command === "explain") {
      // Uncomment this line to see the files data 
      // context.log(`files ${files.data.map((file) => file.patch).join(" ")}}`)

      const promptString = await getOptmizedPrompt(files, context);
      context.log(`promptString ${promptString}`);
      const responseFromLLM = await createPrompt(promptString);
      context.log(`responseFromLLM ${responseFromLLM}`);

      const message = responseFromLLM.message;
      const content = message["content"];
      return content;
    }
  }
}
