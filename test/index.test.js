process.env.JEST = true;
const main = require('../index');
const core = require('@actions/core');
const retrieveAllInputs = require('../retrieve-action-inputs');
const utility = require('../utility');

jest.mock('@actions/core');
jest.mock('../retrieve-action-inputs');
jest.mock('../utility');

describe('Happy Path', () => {
    test('I should be able to successfully make a call to the Discord Webhook with all expected attributes.', async () => {
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        let returnInputs = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            title: '',
            message: '',
            messageColor: '',
            branch: '',
            sha: '',
            buildNumber: '',
            triggeredBy: '',
            actionUrl: ''
        };
        retrieveAllInputs.retrieveAllInputs = jest.fn().mockReturnValue(returnInputs);

        utility.verifyDiscordWebhookUrl = jest.fn().mockReturnValue(true);

        utility.parseDiscordUrl = jest.fn().mockReturnValue({
            hostname: discordWebhookUrl,
            path: discordWebhookPathUrl
        });

        utility.buildDiscordEmbeddedMessage = jest.fn().mockReturnValue({});

        utility.executeDiscordWebhookPost = jest.fn().mockResolvedValue(true);

        await main();

        expect(core.setOutput).toBeCalledWith('successful', true);
    });
})

describe('Error occurs with utility methods', () => {

    test('I should see an expected Failed error message set in the github core if verifyDiscordWebhookUrl returns false.', async () => {
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        let returnInputs = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            title: '',
            message: '',
            messageColor: '',
            branch: '',
            sha: '',
            buildNumber: '',
            triggeredBy: '',
            actionUrl: ''
        };
        retrieveAllInputs.retrieveAllInputs = jest.fn().mockReturnValue(returnInputs);

        utility.verifyDiscordWebhookUrl = jest.fn().mockImplementation(() => {
            throw new Error('Failed!');
        })

        await main();

        expect(core.setFailed).toBeCalledWith('Failed!');
    });

    test('I should see an expected Failed error message set in the github core if executeDiscordWebhookPost throws an error.', async () => {
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        let returnInputs = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            title: '',
            message: '',
            messageColor: '',
            branch: '',
            sha: '',
            buildNumber: '',
            triggeredBy: '',
            actionUrl: ''
        };
        retrieveAllInputs.retrieveAllInputs = jest.fn().mockReturnValue(returnInputs);

        utility.verifyDiscordWebhookUrl = jest.fn().mockReturnValue(true);

        utility.parseDiscordUrl = jest.fn().mockReturnValue({
            hostname: discordWebhookUrl,
            path: discordWebhookPathUrl
        });

        utility.buildDiscordEmbeddedMessage = jest.fn().mockReturnValue({});

        utility.executeDiscordWebhookPost = jest.fn().mockRejectedValue({ message: 'Failed to make call due to error.'});

        await main();

        expect(core.setFailed).toBeCalledWith('Failed to make call due to error.');
    });

    test('I should see an expected Failed error message set in the github core if executeDiscordWebhookPost fails to make its call.', async () => {
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        let returnInputs = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            title: '',
            message: '',
            messageColor: '',
            branch: '',
            sha: '',
            buildNumber: '',
            triggeredBy: '',
            actionUrl: ''
        };
        retrieveAllInputs.retrieveAllInputs = jest.fn().mockReturnValue(returnInputs);

        utility.verifyDiscordWebhookUrl = jest.fn().mockReturnValue(true);

        utility.parseDiscordUrl = jest.fn().mockReturnValue({
            hostname: discordWebhookUrl,
            path: discordWebhookPathUrl
        });

        utility.buildDiscordEmbeddedMessage = jest.fn().mockReturnValue({});

        utility.executeDiscordWebhookPost = jest.fn().mockRejectedValue('Failed to make call due to error.');

        await main();

        expect(core.setFailed).toBeCalledWith('Failed to make call due to error.');
    });
})
