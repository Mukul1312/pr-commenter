require('dotenv').config();
const api_key = process.env.OPEN_AI_KEY

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: `${api_key}` });

const createPrompt = async (promptString) => {  
    const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: promptString }],
        model: "gpt-3.5-turbo",
      });

    return response.choices[0]
}

module.exports = createPrompt;