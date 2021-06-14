const core = require('@actions/core');

class RetrieveInputs  {

    retrieveAllInputs() {
        let discordWebhookUrl = core.getInput('discord-hook-url');
        let title = core.getInput('title');
        let message = core.getInput('message');
        let messageColor = core.getInput('message-color');
        let branch = core.getInput('branch');
        let sha = core.getInput('sha');
        let buildNumber = core.getInput('buildNumber');
        let triggeredBy = core.getInput('triggeredBy');
        let actionUrl = core.getInput('actionUrl');
        if (process.env.LOCAL) {
            console.log('Running in local.');
            discordWebhookUrl = process.env.discordWebhookUrl;
            title = process.env.title;
            message = process.env.message;
            messageColor = process.env.messageColor;
            branch = process.env.branch;
            sha = process.env.sha;
            buildNumber = process.env.buildNumber;
            triggeredBy = process.env.triggeredBy;
            actionUrl = process.env.actionUrl;
        }
        console.log('Input Parameters given.');
        console.log('----------------------------------');
        console.log(`Url > ${discordWebhookUrl}`);
        console.log(`Title > ${title}`);
        console.log(`Message > ${message}`);
        console.log(`Message Color > ${messageColor}`);
        console.log(`Git Branch > ${branch}`);
        console.log(`Git Commit SHA > ${sha}`);
        console.log(`Build Number > ${buildNumber}`);
        console.log(`Triggered By > ${triggeredBy}`);
        console.log(`Action Url > ${actionUrl}`);
        return {discordWebhookUrl, title, message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl};
    }

}

module.exports = new RetrieveInputs;
