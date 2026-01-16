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

// Mail parsing prompt paths
const mailParsingSystemPromptPath = path.join(__dirname, '../prompt/mail_parsing_sys_prompt.txt');
const mailParsingUserPromptPath = path.join(__dirname, '../prompt/mail_parsing_user_prompt.txt');
const vendorMailParsingSampleResponsePath = path.join(__dirname, '../prompt/vendor_mail_parsing_sample_response.json'); // This was already present, keeping it as is.

const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8').trim();
const userPromptTemplate = fs.readFileSync(userPromptPath, 'utf-8').trim();

// Mail parsing prompts
const mailParsingSystemPrompt = fs.readFileSync(mailParsingSystemPromptPath, 'utf-8').trim();
const mailParsingUserPromptTemplate = fs.readFileSync(mailParsingUserPromptPath, 'utf-8').trim();

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

exports.extractProposalFromEmail = async ({ rfp, emailText }) => {
  // For testing: Read sample response from file instead of calling OpenAI API
  const sampleResponse = fs.readFileSync(vendorMailParsingSampleResponsePath, 'utf-8');
  return JSON.parse(sampleResponse);

  // TODO: Uncomment below when ready to use OpenAI API
  // // Construct user prompt with RFP and email data
  // const userPrompt = `${mailParsingUserPromptTemplate}\n\nRFP:\n${JSON.stringify(rfp.structured)}\n\nVendor Email:\n${emailText}`;

  // const response = await client.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   temperature: 0,
  //   messages: [
  //     {
  //       role: 'system',
  //       content: mailParsingSystemPrompt
  //     },
  //     {
  //       role: 'user',
  //       content: userPrompt
  //     }
  //   ]
  // });

  // return JSON.parse(response.choices[0].message.content);
};


exports.generateRecommendation = async ({ rfp, proposals }) => {
  // MOCK MODE (for testing)
  return {
    recommendedVendor: proposals[0].vendorName,
    reasoning:
      'This vendor offers the best balance of price, delivery time, and warranty while meeting all RFP constraints.',
    ranking: proposals
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
      .map(p => p.vendorName)
  };

  /*
  // REAL AI MODE (enable later)
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: 'You are a procurement decision assistant.'
      },
      {
        role: 'user',
        content: `
RFP Constraints:
${JSON.stringify(rfp.structured.constraints)}

Proposals:
${JSON.stringify(proposals)}

Decide:
- Best vendor
- Short explanation
- Ranking
Return ONLY valid JSON:
{
  "recommendedVendor": string,
  "reasoning": string,
  "ranking": string[]
}
        `
      }
    ]
  });

  return JSON.parse(response.choices[0].message.content);
  */
};

