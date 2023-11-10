// const {Configuration, OpenAIApi} = require('openai');
require('dotenv').config();
const api_key = process.env.OPEN_AI_KEY
// const config = new Configuration({apiKey: `${api_key}`});

// const openai = new OpenAIApi(config);
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: `${api_key}` });

const createPrompt = async ({patchesArray, numberOfCommits}) => {
    const promptString = `
    You are a github expert.
    This is actual Pull Request Data coming from. Explain the changes made in this pull request.
    This PR has ${numberOfCommits} commits
    The changes made in this PR are: ${patchesArray.join(' ')}
    Explain the changes made in this PR
    `
    // const response = await openai.createCompletion({
    //     model: 'text-davinci-003',
    //     prompt : promptString,
    //     max_tokens: 2048 - promptString.length,
    //     temperature: 0,
    // });
    const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: promptString }],
        model: "gpt-3.5-turbo",
      });


    // return response.data.choices[0].text;
    return response.choices[0]
}

module.exports = createPrompt;