const fs = require('fs');
const path = require('path');
const AIProvider = require('./AIProvider');
const fetch = require('node-fetch');

const model = "phi3:mini";

class OllamaAIProvider extends AIProvider {
    constructor() {
        super();
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
        return 'Ollama';
    }

    async generateRFPFromText(text) {
        console.log('[OllamaAIProvider] Generating RFP from text using Ollama API');

        const userPrompt = `${this.userPromptTemplate}\n\nText:\n${text}`;

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                prompt: this.systemPrompt + '\n\n' + userPrompt,
                stream: false
            })
        });

        console.log(response);

        const data = await response.json();
        return JSON.parse(data.response);
    }

    async extractProposalFromEmail({ rfp, emailText }) {
        console.log('[OllamaAIProvider] Extracting proposal from email using Ollama API');

        const userPrompt = `${this.mailParsingUserPromptTemplate}\n\nRFP:\n${JSON.stringify(rfp.structured)}\n\nVendor Email:\n${emailText}`;

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                prompt: this.mailParsingSystemPrompt + '\n\n' + userPrompt,
                stream: false
            })
        });

        const data = await response.json();
        return JSON.parse(data.response);
    }

    async generateRecommendation({ rfp, proposals }) {
        console.log('[OpenAIProvider] Generating recommendation using OpenAI API');

        const systemPrompt = 'You are a procurement decision assistant. Analyze proposals and provide recommendations.';

        const userPrompt = `
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
          `;

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                prompt: systemPrompt + '\n\n' + userPrompt,
                stream: false
            })
        });

        const data = await response.json();
        return JSON.parse(data.response);
    }
}

module.exports = OllamaAIProvider;
