const fs = require('fs');
const path = require('path');
const AIProvider = require('./AIProvider');

class MockAIProvider extends AIProvider {
    constructor() {
        super();
        // Load sample response files
        this.sampleResponsePath = path.join(__dirname, '../../../prompt/rfp_sample_response.json');
        this.vendorMailParsingSampleResponsePath = path.join(__dirname, '../../../prompt/vendor_mail_parsing_sample_response.json');
    }

    getName() {
        return 'mock';
    }

    /**
     * Mock queryAI - not used since we override the template methods
     * @param {string} systemPrompt - The system prompt (ignored)
     * @param {string} userPrompt - The user prompt (ignored)
     * @returns {Promise<string>} Empty string
     */
    async queryAI(systemPrompt, userPrompt) {
        // Mock provider doesn't use queryAI - it overrides the main methods directly
        return '{}';
    }

    /**
     * Override: Returns mock RFP response from file
     */
    async generateRFPFromText(text) {
        console.log('[MockAIProvider] Generating RFP from text using mock response');
        const sampleResponse = fs.readFileSync(this.sampleResponsePath, 'utf-8');
        return JSON.parse(sampleResponse);
    }

    /**
     * Override: Returns mock proposal extraction from file
     */
    async extractProposalFromEmail({ rfp, emailText }) {
        console.log('[MockAIProvider] Extracting proposal from email using mock response');
        const sampleResponse = fs.readFileSync(this.vendorMailParsingSampleResponsePath, 'utf-8');
        return JSON.parse(sampleResponse);
    }

    /**
     * Override: Returns mock recommendation based on proposal scores
     */
    async generateRecommendation({ rfp, proposals }) {
        console.log('[MockAIProvider] Generating recommendation using mock logic');
        return {
            recommendedVendor: proposals[0]?.vendorName || 'Unknown',
            reasoning: 'This vendor offers the best balance of price, delivery time, and warranty while meeting all RFP constraints.',
            ranking: proposals
                .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
                .map(p => p.vendorName)
        };
    }
}

module.exports = MockAIProvider;
