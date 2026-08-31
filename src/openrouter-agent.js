const OpenAIAgent = require("./openai-agent");

class OpenRouterAgent extends OpenAIAgent {
    constructor(apiKey, fileContentGetter, fileCommentator, model, reviewRulesContent) {
        super(apiKey, fileContentGetter, fileCommentator, model, reviewRulesContent, "https://openrouter.ai/api/v1");
    }
}

module.exports = OpenRouterAgent;
