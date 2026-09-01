const { OpenAI } = require("openai");
const OpenAIAgent = require("./openai-agent");

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

class OpenRouterAgent extends OpenAIAgent {
    constructor(apiKey, fileContentGetter, fileCommentator, model, reviewRulesContent) {
        super(apiKey, fileContentGetter, fileCommentator, model, reviewRulesContent, OPENROUTER_BASE_URL);

        // Recreate the client with attribution headers so requests are labelled in OpenRouter activity page
        this.openai = new OpenAI({
            apiKey,
            baseURL: OPENROUTER_BASE_URL,
            defaultHeaders: {
                "HTTP-Referer": "https://github.com/bns34/ai-code-review",
                "X-Title": "AI Code Review"
            }
        });
    }
}

module.exports = OpenRouterAgent;
