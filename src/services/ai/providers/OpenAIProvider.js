const OpenAI = require('openai');
const AIProvider = require('./AIProvider');

class OpenAIProvider extends AIProvider {
    constructor() {
        super();
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    }

    getName() {
        return 'openai';
    }

    /**
     * Query OpenAI API with system and user prompts
     * @param {string} systemPrompt - The system prompt
     * @param {string} userPrompt - The user prompt
     * @returns {Promise<string>} Raw response content from OpenAI
     */
    async queryAI(systemPrompt, userPrompt) {
        const response = await this.client.chat.completions.create({
            model: this.model,
            temperature: 0,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        });

        return response.choices[0].message.content;
    }
}

module.exports = OpenAIProvider;
