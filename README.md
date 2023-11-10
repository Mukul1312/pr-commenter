# codemate-assignment

> PR of Testing Repo: https://github.com/Mukul1312/codemate-assignment-testing-repo/pulls

## Setup

### Requirements
- [OpenAI API Key](https://platform.openai.com/api-keys/) : sk-xxx

```sh
# Install dependencies
npm install

# Run the bot
npm run start
```
- You need to set the `OPENAI_API_KEY` in the env file.
- In browser, go to http://localhost:3000/ and create a new GitHub App.

## Updates in this version:
 - [ ] /explain commands are detectable from the commit message
 - [ ] Improved commenting by the bot in PR by adding LLM response error handling and delayed response.
 - [ ] Refactored code of index.js 
    - GitHub API logic in api/github file
    - utils folder for storing utility functions like getCommand.


## Updated Demo
https://github.com/Mukul1312/codemate-assignment/assets/84818958/8ad2c41e-7a8b-43e1-a6d0-95d295dee2eb

## Summary Report
It was quite an amazing experience to integrate the AI Tools with the GitHub app since I was new to webhooks and Probot, AI.

### Functionality in main:
/explain the command working when put in the description of PR Creation.

### Approach:
I started to learn webhooks and then the efficiency of WebHooks over API's. Then, I took a reference from dev.to create a GitHub app. ( By this time I had only 3 hours) Then, I read the quick start section of the documentation of open AI to integrate it into the application.

#### Challenges:
- Find difficulties while prompting code into LLM. But was able to overcome it.
- There are not many articles online for creating the tutorial. It reconfirms that this space is new.
- The LLM Model works for small code change (about 100 lines) but, When I tried /explain on code changes of 500. It's starting breaking. Currently, I've handled it with catch statement. But, I'm looking for a better solution.


### Suggestion:
The article provided as a reference in PFA for creating the first GitHub app requires a paid subscription. So, I've taken a reference from this article. 
https://dev.to/github/developing-my-first-github-app-with-probot-3g0p 
