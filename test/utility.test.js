const utility = require('../utility');
const discordPayload = require('../discord-build-success-webhook');
const nock = require('nock');

describe('Make call to DiscordWebhook.', () => {

    test('When I successfully call the Discord Webhook I should be returned a successful promise and a boolean of true', async () => {
        let discordWebhookUrl = {
            hostname: 'discord.com',
            path: '/api/webhooks/852584010806329446/2cwT5MBSPSdLMbv_st4ZphOsQg_PILmE7wBr-6LM9u33sypLgOGG5fWHPelSHPT29IrE'
        };
        let title = 'Sample Title';
        let message = 'Sample Message';
        let messageColor = '54321';
        let branch = 'Branchy';
        let sha = '123asdf098fdsa098fdsa098qwe';
        let buildNumber = '404';
        let triggeredBy = 'Pacman';
        let actionUrl = 'https://action.com/packed/url';

        nock('https://' + discordWebhookUrl.hostname + ':443')
            .post(discordWebhookUrl.path)
            .reply(204, {
                body: 'Nothing here'
            });
        let payload = utility.buildDiscordEmbeddedMessage(title,
            message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl);
        return utility.executeDiscordWebhookPost(discordWebhookUrl, payload).then(data => {
            expect(data).toBeTruthy();
        }).catch(err => {
            expect(err).toBeFalsy();
        });
    });

    test('When I fail to call the Discord Webhook I should be returned a rejected promise with an appropriate message stating code and url called.', async () => {
        let discordWebhookUrl = {
            hostname: 'discord.com',
            path: '/api/webhooks/852584010806329446/2cwT5MBSPSdLMbv_st4ZphOsQg_PILmE7wBr-6LM9u33sypLgOGG5fWHPelSHPT29IrE'
        };
        let title = 'Sample Title';
        let message = 'Sample Message';
        let messageColor = '54321';
        let branch = 'Branchy';
        let sha = '123asdf098fdsa098fdsa098qwe';
        let buildNumber = '404';
        let triggeredBy = 'Pacman';
        let actionUrl = 'https://action.com/packed/url';

        let expectedStatusCode = 500;
        let expectedBody = {
            error: 'Failed to make call'
        };

        nock('https://' + discordWebhookUrl.hostname + ':443')
            .post(discordWebhookUrl.path)
            .reply(500, expectedBody);
        let payload = utility.buildDiscordEmbeddedMessage(title,
            message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl);
        return utility.executeDiscordWebhookPost(discordWebhookUrl, payload).then(data => {
            expect(data).toBeFalsy();
        }).catch(err => {
            expect(err).toEqual(`Failed to make call to Discord Webhook Status ('${expectedStatusCode}') Body => ${JSON.stringify(expectedBody)}`);
        });
    });

    test('When I fail to call the Discord Webhook I should be returned a rejected promise with an appropriate message stating code and url called.', async () => {
        let discordWebhookUrl = {
            hostname: 'discord.com',
            path: '/api/webhooks/852584010806329446/2cwT5MBSPSdLMbv_st4ZphOsQg_PILmE7wBr-6LM9u33sypLgOGG5fWHPelSHPT29IrE'
        };
        let title = 'Sample Title';
        let message = 'Sample Message';
        let messageColor = '54321';
        let branch = 'Branchy';
        let sha = '123asdf098fdsa098fdsa098qwe';
        let buildNumber = '404';
        let triggeredBy = 'Pacman';
        let actionUrl = 'https://action.com/packed/url';
        let expectedBody = {
            error: 'Failed to make call'
        };

        nock('https://' + discordWebhookUrl.hostname + ':443')
            .post(discordWebhookUrl.path)
            .replyWithError( expectedBody);
        let payload = utility.buildDiscordEmbeddedMessage(title,
            message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl);
        return utility.executeDiscordWebhookPost(discordWebhookUrl, payload).then(data => {
            expect(data).toBeFalsy();
        }).catch(err => {
            expect(err).toEqual(`Failed to make call to Discord Webhook due to => ${JSON.stringify(expectedBody)}`);
        });
    });
});

describe('Validate Discord Webhook Url', () => {
    test('Should pass if the url passed contains the expected discord url as a prefix.', () => {
        utility.verifyDiscordWebhookUrl('https://discord.com/api/webhooks');
    });

    test('Should throw and error if the url passed does not contain the expected discord url as a prefix.', () => {
        let expectedUrl = 'https://discord.com/api/webhooks';
        let invalidUrl = 'https://discordfdsa.com/api/webhooks';
        try {
            utility.verifyDiscordWebhookUrl(invalidUrl);
            expect(false).toBeTruthy();
        } catch (err) {
            expect(err.message).toEqual(`Invalid Discord Webhook passed ('${invalidUrl}'), valid Discord Webhook is required. Please pass url starting with '${expectedUrl}'`)
        }
    });
});

describe('Parse Discord Webhook Url into hostname and path.', () => {
   test('A discord url should be parsed into hostname and path.', () => {
        let expectedUrl = 'https://discord.com/api/webhooks/12341223122312/09871029837409812730498';

        let expectedHostname = expectedUrl.substring(expectedUrl.indexOf("/", 7) + 1, expectedUrl.indexOf("/", 8));
        let expectedPath = expectedUrl.substring(expectedUrl.indexOf("/", 8), expectedUrl.length);

        let parseDiscordUrl = utility.parseDiscordUrl(expectedUrl);
        expect(parseDiscordUrl.hostname).toEqual(expectedHostname);
        expect(parseDiscordUrl.path).toEqual(expectedPath);
    });
});

describe('Build Discord embedded message.', () => {
   test('Should successfully replace input variables of discord template.', () => {
       let title = 'Sample Title';
       let message = 'Sample Message';
       let messageColor = '54321';
       let branch = 'Branchy';
       let sha = '123asdf098fdsa098fdsa098qwe';
       let buildNumber = '404';
       let triggeredBy = 'Pacman';
       let actionUrl = 'https://action.com/packed/url';
       let expectedDiscordPayloadCopy = JSON.parse(JSON.stringify(discordPayload));
       expectedDiscordPayloadCopy.embeds[0].url = actionUrl;
       expectedDiscordPayloadCopy.embeds[0].title = title;
       expectedDiscordPayloadCopy.embeds[0].description = message;
       expectedDiscordPayloadCopy.embeds[0].color = messageColor;
       expectedDiscordPayloadCopy.embeds[0].fields[0].value = buildNumber;
       expectedDiscordPayloadCopy.embeds[0].fields[1].value = branch;
       expectedDiscordPayloadCopy.embeds[0].fields[2].value = sha;
       expectedDiscordPayloadCopy.embeds[0].fields[3].value = triggeredBy;
       expect(utility.buildDiscordEmbeddedMessage(title, message, messageColor, branch, sha, buildNumber, triggeredBy, actionUrl)).toEqual(expectedDiscordPayloadCopy);
   });
});
