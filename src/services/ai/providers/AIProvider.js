
const fs = require('fs');
const path = require('path');

class AIProvider {
    constructor() {
        // Load prompt templates (common to all providers except Mock)
        this.rfpSystemPrompt = this._loadPrompt('rfp_sys_prompt.txt');
        this.rfpUserPromptTemplate = this._loadPrompt('rfp_user_prompt.txt');
        this.mailParsingSystemPrompt = this._loadPrompt('mail_parsing_sys_prompt.txt');
        this.mailParsingUserPromptTemplate = this._loadPrompt('mail_parsing_user_prompt.txt');

        // Recommendation system prompt (inline since it's simple)
        this.recommendationSystemPrompt = 'You are a procurement decision assistant. Analyze proposals and provide recommendations.';
    }

    /**
     * Load a prompt file from the prompts directory
     * @param {string} filename - Name of the prompt file
     * @returns {string} Content of the prompt file
     */
    _loadPrompt(filename) {
        try {
            return fs.readFileSync(
                path.join(__dirname, '../../../prompt', filename), 'utf-8'
            ).trim();
        } catch (error) {
            console.warn(`[AIProvider] Could not load prompt file: ${filename}`);
            return '';
        }
    }

    /**
     * Returns the name of this provider
     * @returns {string}
     */
    getName() {
        throw new Error('Method getName() must be implemented by subclass');
    }

    /**
     * Query the AI with system and user prompts
     * THIS IS THE ONLY METHOD SUBCLASSES NEED TO IMPLEMENT
     * 
     * @param {string} systemPrompt - The system prompt
     * @param {string} userPrompt - The user prompt
     * @returns {Promise<string>} Raw response string from AI (should be valid JSON)
     */
    async queryAI(systemPrompt, userPrompt) {
        throw new Error('Method queryAI() must be implemented by subclass');
    }

    /**
     * Generate a structured RFP from natural language text
     * Template method - uses queryAI internally
     */
    async generateRFPFromText(text) {
        console.log(`[${this.getName()}] Generating RFP from text`);

        const userPrompt = `${this.rfpUserPromptTemplate}\n\nText:\n${text}`;
        const response = await this.queryAI(this.rfpSystemPrompt, userPrompt);

        return this._parseJSON(response);
    }

    /**
     * Extract proposal data from vendor email response
     * Template method - uses queryAI internally
     */
    async extractProposalFromEmail({ rfp, emailText }) {
        console.log(`[${this.getName()}] Extracting proposal from email`);

        const userPrompt = `${this.mailParsingUserPromptTemplate}\n\nRFP:\n${JSON.stringify(rfp.structured)}\n\nVendor Email:\n${emailText}`;
        const response = await this.queryAI(this.mailParsingSystemPrompt, userPrompt);

        return this._parseJSON(response);
    }

    /**
     * Generate a recommendation based on RFP and received proposals
     * Template method - uses queryAI internally
     */
    async generateRecommendation({ rfp, proposals }) {
        console.log(`[${this.getName()}] Generating recommendation`);

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
}`;

        const response = await this.queryAI(this.recommendationSystemPrompt, userPrompt);
        return this._parseJSON(response);
    }

    /**
     * Parse JSON response with error handling
     * @param {string} response - Raw response string
     * @returns {Object} Parsed JSON object
     */
    _parseJSON(response) {
        try {
            // If response is already an object, return it
            if (typeof response === 'object') {
                return response;
            }
            return JSON.parse(response);
        } catch (error) {
            console.error(`[${this.getName()}] Failed to parse JSON response:`, error.message);
            console.error('Raw response:', response);
            throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
        }
    }
}

module.exports = AIProvider;
