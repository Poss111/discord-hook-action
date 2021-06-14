const discordPayload = require('./discord-build-success-webhook');
const https = require('https');

class Utility {

    verifyDiscordWebhookUrl(discordWebhookUrl) {
        const discordWebhookPrefix = 'https://discord.com/api/webhooks';
        if (!discordWebhookUrl || !discordWebhookUrl.includes(discordWebhookPrefix)) {
            throw new Error(`Invalid Discord Webhook passed ('${discordWebhookUrl}'), valid Discord Webhook is required. Please pass url starting with '${discordWebhookPrefix}'`);
        }
    }

    parseDiscordUrl(expectedUrl) {
        let hostname = expectedUrl.substring(expectedUrl.indexOf("/", 7) + 1, expectedUrl.indexOf("/", 8));
        let path = expectedUrl.substring(expectedUrl.indexOf("/", 8), expectedUrl.length);

        return {hostname, path};
    }

    buildDiscordEmbeddedMessage(title, message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl) {
        let discordPayloadCopy = JSON.parse(JSON.stringify(discordPayload));
        discordPayloadCopy.embeds[0].url = actionUrl;
        discordPayloadCopy.embeds[0].title = title;
        discordPayloadCopy.embeds[0].description = message;
        discordPayloadCopy.embeds[0].color = messageColor;
        discordPayloadCopy.embeds[0].fields[0].value = buildNumber;
        discordPayloadCopy.embeds[0].fields[1].value = branch;
        discordPayloadCopy.embeds[0].fields[2].value = sha;
        discordPayloadCopy.embeds[0].fields[3].value = triggeredBy;
        return discordPayloadCopy;
    }

    executeDiscordWebhookPost(parsedDiscordUrls, payload) {
        console.log('Starting function...');
        const options = {
            hostname: parsedDiscordUrls.hostname,
            path: parsedDiscordUrls.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log('Built');
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                if (!res) {
                    console.error('Failed to receive.');
                    reject(res);
                }
                console.log('statusCode : ' + res.statusCode);
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

            req.write(JSON.stringify(payload));
            req.end();
        });
    }
}

module.exports = new Utility;
