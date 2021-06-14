const core = require('@actions/core');
const retrieveAllInputs = require('/retrieve-action-inputs');
const utility = require('/utility');

async function main() {
    try {
        let {discordWebhookUrl, title, message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl} = retrieveAllInputs.retrieveAllInputs();

        utility.verifyDiscordWebhookUrl(discordWebhookUrl);
        let parsedDiscordUrls = utility.parseDiscordUrl(discordWebhookUrl);
        let discordPayload = utility.buildDiscordEmbeddedMessage(title,
            message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl);
        core.setOutput("successful", successful);
    } catch (error) {
        core.setFailed(error.message);
    }
}
module.exports = main;
main();
