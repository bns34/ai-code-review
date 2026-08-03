const InputProcessor = require("./input-processor");
const core = require("./core-wrapper");
const { SUMMARY_SEPARATOR, FULL_REVIEW_PREFIX, INCREMENTAL_REVIEW_PREFIX } = require("./constants");

const main = async () => {
    const inputProcessor = new InputProcessor();

    try {
        await inputProcessor.processInputs();

        if (inputProcessor.filteredDiffs.length === 0) {
            core.info('No files to review');
            return;
        }
        
        const aiAgent = inputProcessor.getAIAgent();
        const reviewSummary = await aiAgent.doReview(inputProcessor.filteredDiffs);
        if (!reviewSummary || typeof reviewSummary !== 'string' || reviewSummary.trim() === '') {
            throw new Error('AI Agent did not return a valid review summary');
        }

        const reviewPrefix = inputProcessor.isIncremental ? INCREMENTAL_REVIEW_PREFIX : FULL_REVIEW_PREFIX;
        const commentBody = `${reviewPrefix}${inputProcessor.headCommit}${SUMMARY_SEPARATOR}${reviewSummary}\n\n**Model Used:** \`${inputProcessor.model}\``;
        await inputProcessor.githubAPI.createPRComment(
            inputProcessor.owner, 
            inputProcessor.repo, 
            inputProcessor.pullNumber, 
            commentBody
        );

    } catch (error) {
        if (inputProcessor.failAction) {            
            core.debug(error.stack);
            core.error(error.message);
            core.setFailed(error);
        } else {
            core.debug(error.stack);
            core.warning(error.message);
        }
    }
};

main();
