const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const discordWebhookUrl = core.getInput('discord-hook-url:');
    console.log(`Url ${discordWebhookUrl}!`);
    const successful = true;
    core.setOutput("successful", successful);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
