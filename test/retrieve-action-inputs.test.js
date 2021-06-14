const retrieveActionInputs = require('../retrieve-action-inputs');
const core = require('@actions/core');

jest.mock('@actions/core')

describe('Git Input', () => {
    test('Should be able to retrieve all expected Inputs passed from git action.', () => {
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        let expectedObject = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            title: 'SampleTitle',
            message: 'SampleMessage',
            messageColor: '123456',
            branch: 'SampleBranch',
            sha: 'asdfqwerasdf9123',
            buildNumber: '12334',
            triggeredBy: 'Me',
            actionUrl: 'https://some-url/path'
        };
        core.getInput = jest.fn().mockImplementation((string) => {
            if (string === 'discord-hook-url') {
                return expectedObject.discordWebhookUrl;
            } else if (string === 'title') {
                return expectedObject.title
            } else if (string === 'message') {
                return expectedObject.message;
            } else if (string === 'message-color') {
                return expectedObject.messageColor;
            } else if (string === 'branch') {
                return expectedObject.branch;
            } else if (string === 'sha') {
                return expectedObject.sha;
            } else if (string === 'buildNumber') {
                return expectedObject.buildNumber;
            } else if (string === 'triggeredBy') {
                return expectedObject.triggeredBy;
            } else if (string === 'actionUrl') {
                return expectedObject.actionUrl;
            }
        });
        expect(retrieveActionInputs.retrieveAllInputs()).toEqual(expectedObject);
    })

    test('Should be able to retrieve all expected Inputs passed from environment variable if environment LOCAL is given.', () => {
        process.env.LOCAL = true;
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        let expectedObjectFromGithubAction = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            title: 'SampleTitle',
            message: 'SampleMessage',
            messageColor: '123456',
            branch: 'SampleBranch',
            sha: 'asdfqwerasdf9123',
            buildNumber: '12334',
            triggeredBy: 'Me',
            actionUrl: 'https://some-url/path'
        };
        let expectedObjectFromEnvironment = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            title: 'SampleTitle2',
            message: 'SampleMessage2',
            messageColor: '1234562',
            branch: 'SampleBranch3',
            sha: 'asdfqwerasdf91232',
            buildNumber: '123342',
            triggeredBy: 'Me2',
            actionUrl: 'https://some-url/path2'
        };
        core.getInput = jest.fn().mockImplementation((string) => {
            if (string === 'discord-hook-url') {
                return expectedObjectFromGithubAction.discordWebhookUrl;
            } else if (string === 'title') {
                return expectedObjectFromGithubAction.title
            } else if (string === 'message') {
                return expectedObjectFromGithubAction.message;
            } else if (string === 'message-color') {
                return expectedObjectFromGithubAction.messageColor;
            } else if (string === 'branch') {
                return expectedObjectFromGithubAction.branch;
            } else if (string === 'sha') {
                return expectedObjectFromGithubAction.sha;
            } else if (string === 'buildNumber') {
                return expectedObjectFromGithubAction.buildNumber;
            } else if (string === 'triggeredBy') {
                return expectedObjectFromGithubAction.triggeredBy;
            } else if (string === 'actionUrl') {
                return expectedObjectFromGithubAction.actionUrl;
            }
        });

        process.env.discordWebhookUrl = expectedObjectFromEnvironment.discordWebhookUrl;
        process.env.title = expectedObjectFromEnvironment.title;
        process.env.message = expectedObjectFromEnvironment.message;
        process.env.messageColor = expectedObjectFromEnvironment.messageColor;
        process.env.branch = expectedObjectFromEnvironment.branch;
        process.env.sha = expectedObjectFromEnvironment.sha;
        process.env.buildNumber = expectedObjectFromEnvironment.buildNumber;
        process.env.triggeredBy = expectedObjectFromEnvironment.triggeredBy;
        process.env.actionUrl = expectedObjectFromEnvironment.actionUrl;

        expect(retrieveActionInputs.retrieveAllInputs()).toEqual(expectedObjectFromEnvironment);
    })

    test('Should be able to retrieve defaults for expected Inputs (title, message, color) if not passed from git action.', () => {
        delete process.env.LOCAL;
        let discordWebhookUrl = 'https://discord.com/api/webhooks';
        let discordWebhookPathUrl = '/123456778900/87213098127039817203987';
        let expectedObject = {
            discordWebhookUrl: discordWebhookUrl + discordWebhookPathUrl,
            branch: 'SampleBranch',
            sha: 'asdfqwerasdf9123',
            buildNumber: '12334',
            triggeredBy: 'Me',
            actionUrl: 'https://some-url/path'
        };
        core.getInput = jest.fn().mockImplementation((string) => {
            if (string === 'discord-hook-url') {
                return expectedObject.discordWebhookUrl;
            } else if (string === 'title') {
                return expectedObject.title
            } else if (string === 'message') {
                return expectedObject.message;
            } else if (string === 'message-color') {
                return expectedObject.messageColor;
            } else if (string === 'branch') {
                return expectedObject.branch;
            } else if (string === 'sha') {
                return expectedObject.sha;
            } else if (string === 'buildNumber') {
                return expectedObject.buildNumber;
            } else if (string === 'triggeredBy') {
                return expectedObject.triggeredBy;
            } else if (string === 'actionUrl') {
                return expectedObject.actionUrl;
            }
        });

        let expectedObjectWithDefaults = JSON.parse(JSON.stringify(expectedObject));
        expectedObjectWithDefaults.title = 'Github Action Notification';
        expectedObjectWithDefaults.message = 'Here is a quick update!';
        expectedObjectWithDefaults.messageColor = '65345';
        expect(retrieveActionInputs.retrieveAllInputs()).toEqual(expectedObjectWithDefaults);
    });
})
