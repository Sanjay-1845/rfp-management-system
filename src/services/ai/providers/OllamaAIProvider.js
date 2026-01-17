const AIProvider = require('./AIProvider');

class OllamaAIProvider extends AIProvider {
    constructor() {
        super();
        this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        this.model = process.env.OLLAMA_MODEL || 'phi3:mini';
    }

    getName() {
        return 'ollama';
    }

    /**
     * Query Ollama API with system and user prompts
     * @param {string} systemPrompt - The system prompt
     * @param {string} userPrompt - The user prompt
     * @returns {Promise<string>} Raw response content from Ollama
     */
    async queryAI(systemPrompt, userPrompt) {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                prompt: `${systemPrompt}\n\n${userPrompt}`,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    }
}

module.exports = OllamaAIProvider;
