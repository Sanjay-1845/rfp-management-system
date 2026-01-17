class AIProvider {
    /**
     * Returns the name of this provider
     * @returns {string}
     */
    getName() {
        throw new Error('Method getName() must be implemented by subclass');
    }

    /**
     * Generate a structured RFP from natural language text
     * @param {string} text - Natural language description of RFP requirements
     * @returns {Promise<Object>} Structured RFP object with title and structured data
     */
    async generateRFPFromText(text) {
        throw new Error('Method generateRFPFromText() must be implemented by subclass');
    }

    /**
     * Extract proposal data from vendor email response
     * @param {Object} params
     * @param {Object} params.rfp - The RFP object
     * @param {string} params.emailText - The vendor's email response text
     * @returns {Promise<Object>} Extracted proposal data with pricing, delivery, warranty, etc.
     */
    async extractProposalFromEmail({ rfp, emailText }) {
        throw new Error('Method extractProposalFromEmail() must be implemented by subclass');
    }

    /**
     * Generate a recommendation based on RFP and received proposals
     * @param {Object} params
     * @param {Object} params.rfp - The RFP object
     * @param {Array} params.proposals - Array of proposal objects
     * @returns {Promise<Object>} Recommendation with recommended vendor, reasoning, and ranking
     */
    async generateRecommendation({ rfp, proposals }) {
        throw new Error('Method generateRecommendation() must be implemented by subclass');
    }
}

module.exports = AIProvider;
