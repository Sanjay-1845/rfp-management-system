const AIProvider = require('./AIProvider');

class HuggingFaceAIProvider extends AIProvider {
    constructor() {
        super();
        // Use a small chat-capable model that's more likely to be available
        this.model = process.env.HF_MODEL || 'Qwen/Qwen2.5-1.5B-Instruct';
        // HuggingFace router uses OpenAI-compatible API format
        this.baseUrl = 'https://router.huggingface.co/v1/chat/completions';
    }

    getName() {
        return 'huggingface';
    }

    /**
     * Query HuggingFace API with system and user prompts
     * Uses OpenAI-compatible chat completions format
     * @param {string} systemPrompt - The system prompt
     * @param {string} userPrompt - The user prompt
     * @returns {Promise<string>} Raw response content from HuggingFace
     */
    async queryAI(systemPrompt, userPrompt) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 2000,
                temperature: 0
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[HuggingFace] API Error:', errorText);
            console.error('[HuggingFace] TIP: HuggingFace free tier is limited. Try AI_PROVIDER=mock or AI_PROVIDER=openai instead.');
            throw new Error(`HuggingFace API error: ${response.status} - Consider using AI_PROVIDER=mock or openai`);
        }

        const data = await response.json();
        console.log("[HuggingFace] Response received");

        // OpenAI-compatible format: { choices: [{ message: { content: "..." } }] }
        if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content;
        }

        throw new Error('Unexpected HuggingFace response format');
    }
}

module.exports = HuggingFaceAIProvider;
