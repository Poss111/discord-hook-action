const core = require('@actions/core');
const github = require('@actions/github');
const discordPayload = require('./discord-build-success-webhook');

try {
    const discordWebhookUrl = core.getInput('discord-hook-url');
    const title = core.getInput('title');
    const message = core.getInput('message');
    const messageColor = core.getInput('message-color');
    console.log(`Url > ${discordWebhookUrl}`);
    console.log(`Title > ${title}`);
    console.log(`Message > ${message}`);
    console.log(`Message Color > ${messageColor}`);
    let discordPayloadCopy = JSON.parse(JSON.stringify(discordPayload));
    discordPayloadCopy.username = "Test";
    discordPayloadCopy.embeds[0].title = title;
    discordPayloadCopy.embeds[0].description = message;
    discordPayloadCopy.embeds[0].color = messageColor;
    console.log(`Discord Payload: ${JSON.stringify(discordPayloadCopy)}`);
    const successful = true;
    core.setOutput("successful", successful);
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
