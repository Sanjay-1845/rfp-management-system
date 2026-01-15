const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Read prompt files once at module load
const systemPromptPath = path.join(__dirname, '../prompt/rfp_sys_prompt.txt');
const userPromptPath = path.join(__dirname, '../prompt/rfp_user_prompt.txt');
const sampleResponsePath = path.join(__dirname, '../prompt/rfp_sample_response.json');

const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8').trim();
const userPromptTemplate = fs.readFileSync(userPromptPath, 'utf-8').trim();

exports.generateRFPFromText = async (text) => {
  // For testing: Read sample response from file instead of calling OpenAI API
  const sampleResponse = fs.readFileSync(sampleResponsePath, 'utf-8');
  return JSON.parse(sampleResponse);

  // TODO: Uncomment below when ready to use OpenAI API
  // // Append the actual text to the user prompt template
  // const userPrompt = `${userPromptTemplate}\n\nText:\n${text}`;

  // const response = await client.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   temperature: 0,
  //   messages: [
  //     {
  //       role: 'system',
  //       content: systemPrompt
  //     },
  //     {
  //       role: 'user',
  //       content: userPrompt
  //     }
  //   ]
  // });

  // return JSON.parse(response.choices[0].message.content);
};