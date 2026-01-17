const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const AIProvider = require('./AIProvider');
const model = "gpt-4o-mini";

class OpenAIProvider extends AIProvider {
    constructor() {
        super();
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Load prompt templates
        this.systemPrompt = fs.readFileSync(
            path.join(__dirname, '../../../prompt/rfp_sys_prompt.txt'), 'utf-8'
        ).trim();

        this.userPromptTemplate = fs.readFileSync(
            path.join(__dirname, '../../../prompt/rfp_user_prompt.txt'), 'utf-8'
        ).trim();

        this.mailParsingSystemPrompt = fs.readFileSync(
            path.join(__dirname, '../../../prompt/mail_parsing_sys_prompt.txt'), 'utf-8'
        ).trim();

        this.mailParsingUserPromptTemplate = fs.readFileSync(
            path.join(__dirname, '../../../prompt/mail_parsing_user_prompt.txt'), 'utf-8'
        ).trim();
    }

    getName() {
        return 'openai';
    }

    async generateRFPFromText(text) {
        console.log('[OpenAIProvider] Generating RFP from text using OpenAI API');

        const userPrompt = `${this.userPromptTemplate}\n\nText:\n${text}`;

        const response = await this.client.chat.completions.create({
            model: model,
            temperature: 0,
            messages: [
                { role: 'system', content: this.systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        });

        return JSON.parse(response.choices[0].message.content);
    }

    async extractProposalFromEmail({ rfp, emailText }) {
        console.log('[OpenAIProvider] Extracting proposal from email using OpenAI API');

        const userPrompt = `${this.mailParsingUserPromptTemplate}\n\nRFP:\n${JSON.stringify(rfp.structured)}\n\nVendor Email:\n${emailText}`;

        const response = await this.client.chat.completions.create({
            model: model,
            temperature: 0,
            messages: [
                { role: 'system', content: this.mailParsingSystemPrompt },
                { role: 'user', content: userPrompt }
            ]
        });

        return JSON.parse(response.choices[0].message.content);
    }

    async generateRecommendation({ rfp, proposals }) {
        console.log('[OpenAIProvider] Generating recommendation using OpenAI API');

        const response = await this.client.chat.completions.create({
            model: model,
            temperature: 0,
            messages: [
                {
                    role: 'system',
                    content: 'You are a procurement decision assistant. Analyze proposals and provide recommendations.'
                },
                {
                    role: 'user',
                    content: `
RFP Constraints:
${JSON.stringify(rfp.structured?.constraints || {})}

Proposals:
${JSON.stringify(proposals)}

Based on the RFP constraints and proposals, determine:
1. The best vendor to select
2. A brief explanation for why
3. A ranking of all vendors

Return ONLY valid JSON in this exact format:
{
  "recommendedVendor": "vendor name",
  "reasoning": "explanation string",
  "ranking": ["vendor1", "vendor2", ...]
}
          `
                }
            ]
        });

        return JSON.parse(response.choices[0].message.content);
    }
}

module.exports = OpenAIProvider;
