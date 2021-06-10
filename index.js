const core = require('@actions/core');
const github = require('@actions/github');
const discordPayload = require('./discord-build-success-webhook');
const https = require('https');

let main = async () => {
    try {
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
            discordWebhookUrl = process.env.discordWebhookUrl;
            title = process.env.title;
            message = process.env.message;
            messageColor = process.env.messageColor;
            branch = process.env.branch;
            sha = process.env.sha;
            buildNumber = process.env.buildNumber;
            triggeredBy = process.env.triggeredBy;
        }
        console.log(`Url > ${discordWebhookUrl}`);
        console.log(`Title > ${title}`);
        console.log(`Message > ${message}`);
        console.log(`Message Color > ${messageColor}`);
        console.log(`Git Branch > ${branch}`);
        console.log(`Git Commit SHA > ${sha}`);
        console.log(`Build Number > ${buildNumber}`);
        console.log(`Triggered By > ${triggeredBy}`);
        console.log(`Action Url > ${actionUrl}`);
        let discordPayloadCopy = JSON.parse(JSON.stringify(discordPayload));
        discordPayloadCopy.embeds[0].url = actionUrl;
        discordPayloadCopy.embeds[0].title = title;
        discordPayloadCopy.embeds[0].description = message;
        discordPayloadCopy.embeds[0].color = messageColor;
        discordPayloadCopy.embeds[0].fields[0].value = buildNumber;
        discordPayloadCopy.embeds[0].fields[1].value = branch;
        discordPayloadCopy.embeds[0].fields[2].value = sha;
        discordPayloadCopy.embeds[0].fields[3].value = triggeredBy;
        let payload = JSON.stringify(discordPayloadCopy);
        console.log(`Discord Payload: ${payload}`);

        let hostname = discordWebhookUrl.substring(discordWebhookUrl.indexOf("/", 7) + 1, discordWebhookUrl.indexOf("/", 8));
        let path = discordWebhookUrl.substring(discordWebhookUrl.indexOf("/", 8), discordWebhookUrl.length);
        console.log(hostname);
        console.log(path);

        const options = {
            hostname: hostname,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let promise = new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                console.log('statusCode:', res.statusCode);
                let data = [];

                res.on('data', (d) => {
                    data += d;
                });

                res.on('end', () => {
                    if (res.statusCode !== 204) {
                        console.error(data);
                        reject(data);
                    } else {
                        resolve(true);
                    }
                })

                res.on('error', (err) => {
                    console.error(err);
                    reject(err);
                })
            });

            req.on('error', (e) => {
                console.error(e);
                reject(e);
            });
            req.write(payload);
            req.end();
        });
        let successful = await promise;
        core.setOutput("successful", successful);
        const gitPayload = JSON.stringify(github.context.payload, undefined, 2);
        console.log(`The event payload: ${gitPayload}`);
    } catch (error) {
        core.setFailed(error.message);
    }
};

main();
