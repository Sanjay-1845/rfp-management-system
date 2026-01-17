const fs = require('fs');
const path = require('path');
const AIProvider = require('./AIProvider');

class MockAIProvider extends AIProvider {
    constructor() {
        super();
        // Load sample response files
        this.sampleResponsePath = path.join(__dirname, '../../prompt/rfp_sample_response.json');
        this.vendorMailParsingSampleResponsePath = path.join(__dirname, '../../prompt/vendor_mail_parsing_sample_response.json');
    }

    getName() {
        return 'mock';
    }

    async generateRFPFromText(text) {
        console.log('[MockAIProvider] Generating RFP from text using mock response');
        const sampleResponse = fs.readFileSync(this.sampleResponsePath, 'utf-8');
        return JSON.parse(sampleResponse);
    }

    async extractProposalFromEmail({ rfp, emailText }) {
        console.log('[MockAIProvider] Extracting proposal from email using mock response');
        const sampleResponse = fs.readFileSync(this.vendorMailParsingSampleResponsePath, 'utf-8');
        return JSON.parse(sampleResponse);
    }

    async generateRecommendation({ rfp, proposals }) {
        console.log('[MockAIProvider] Generating recommendation using mock logic');
        // Simple logic: recommend the vendor with best AI score
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
