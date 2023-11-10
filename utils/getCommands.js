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

module.exports = getCommands;
