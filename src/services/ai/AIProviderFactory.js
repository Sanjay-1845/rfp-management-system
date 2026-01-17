const MockAIProvider = require('./providers/MockAIProvider');
const OpenAIProvider = require('./providers/OpenAIProvider');
const OllamaAIProvider = require('./providers/OllamaAIProvider');
const HuggingFaceAIProvider = require('./providers/HuggingFaceAIProvider');

// Registry of available providers
const providers = {
    mock: new MockAIProvider(),
    openai: new OpenAIProvider(),
    ollama: new OllamaAIProvider(),
    huggingface: new HuggingFaceAIProvider()
};

/**
 * Get an AI provider by name
 * @param {string} [providerName] - Name of provider ('mock', 'openai'). 
 *                                   Defaults to AI_PROVIDER env variable or 'mock'
 * @returns {AIProvider} The requested AI provider instance
 */
function getProvider(providerName) {
    const name = providerName || process.env.AI_PROVIDER || 'mock';
    const provider = providers[name.toLowerCase()];

    if (!provider) {
        console.warn(`[AIProviderFactory] Unknown provider "${name}", falling back to mock`);
        return providers.mock;
    }

    console.log(`[AIProviderFactory] Using provider: ${provider.getName()}`);
    return provider;
}

/**
 * Get list of available provider names
 * @returns {string[]} Array of provider names
 */
function getAvailableProviders() {
    return Object.keys(providers);
}

module.exports = {
    getProvider,
    getAvailableProviders
};
