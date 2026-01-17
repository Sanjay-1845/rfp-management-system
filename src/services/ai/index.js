const { getProvider, registerProvider, getAvailableProviders } = require('./AIProviderFactory');

/**
 * Generate a structured RFP from natural language text
 * @param {string} text - Natural language description
 * @returns {Promise<Object>} Structured RFP object
 */
async function generateRFPFromText(text) {
    const provider = getProvider();
    return provider.generateRFPFromText(text);
}

/**
 * Extract proposal data from vendor email
 * @param {Object} params
 * @param {Object} params.rfp - The RFP object
 * @param {string} params.emailText - Vendor's email text
 * @returns {Promise<Object>} Extracted proposal data
 */
async function extractProposalFromEmail({ rfp, emailText }) {
    const provider = getProvider();
    return provider.extractProposalFromEmail({ rfp, emailText });
}

/**
 * Generate AI recommendation for proposals
 * @param {Object} params
 * @param {Object} params.rfp - The RFP object
 * @param {Array} params.proposals - Array of proposals
 * @returns {Promise<Object>} Recommendation object
 */
async function generateRecommendation({ rfp, proposals }) {
    const provider = getProvider();
    return provider.generateRecommendation({ rfp, proposals });
}

module.exports = {
    // Main functions (same interface as before for backward compatibility)
    generateRFPFromText,
    extractProposalFromEmail,
    generateRecommendation,

    // Factory utilities
    getProvider,
    getAvailableProviders
};
