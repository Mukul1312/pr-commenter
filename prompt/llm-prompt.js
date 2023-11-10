async function getOptmizedPrompt(files, context) {

  // Exclude generated or binary files that don't contribute to the logic.
  const relevantFilesName = files.data.map(file => identifyRelevantFile(file.filename));
  const filterFilesByExtension = files.data.filter((_, index) => relevantFilesName[index]);
  
  const noOfFilesChanged = filterFilesByExtension.length;
  const patchesArray = filterFilesByExtension.map((file) => file.patch);

  const string = `
    You are a github expert.
    This is actual Pull Request Data coming from. Explain the changes made in this pull request.
    This PR contains ${noOfFilesChanged} commits
    The changes made in this PR are: ${patchesArray.join(" ")}
    Explain the changes made in this PR
    `;

  return string;
}

module.exports = getOptmizedPrompt;

const identifyRelevantFile = (filename) => {
  //Exclude generated or binary files that don't contribute to the logic.
  //Focus on source code files (e.g., .js, .py, .java) rather than build artifacts.

  const excludedFileExtensions = [".png", ".jpg", ".jpeg", ".gif", ".pdf", ".docx", ".xlsx", ".pptx", ".svg"];
  const excludedFileNames = ["package-lock.json", "package.json", "yarn.lock", "Gemfile.lock", "composer.lock"];

  const isExcludedFileExtension = excludedFileExtensions.some((extension) => filename.endsWith(extension));
  const isExcludedFileName = excludedFileNames.some((name) => filename.endsWith(name));

  const source_extensions = [".js", ".html", ".css", ".py", ".java", ".cpp", ".h", ".cs", ".rb", ".swift", ".go"];
  const isSourceFile = source_extensions.some((extension) => filename.endsWith(extension));

  const excluded_patterns = [".exe", ".dll", ".so", ".class", ".min.", "node_modules", "dist", "build"];
  const isExcludedPattern = excluded_patterns.some((pattern) => filename.includes(pattern));

  if (isExcludedFileExtension || isExcludedFileName || !isSourceFile || isExcludedPattern) {
    return false;
  }

  return true;
};
