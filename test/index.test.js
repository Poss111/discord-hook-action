const main = require('../index');
const core = require('@actions/core');
const retrieveAllInputs = require('../retrieve-action-inputs');

jest.mock('@actions/core');
jest.mock('../retrieve-action-inputs');

describe('Happy Path', () => {
    test('I should be able to successfully make a call to the Discord Webhook with all expected attributes.', () => {
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        core.getInput = jest.fn().mockImplementation((string) => {
            if (string === 'discord-hook-url') {
                return discordWebhookUrl + discordWebhookPathUrl;
            }
        });

        // main();

        expect(core.setOutput).toBeCalledWith('successful', true);
    });
})
