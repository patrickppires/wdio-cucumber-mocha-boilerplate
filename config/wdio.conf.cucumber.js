'use strict'
const base = require('./wdio.conf.base')

exports.config = Object.assign(base.config, {
    specs: ['./test/cucumber/features/**/*.feature'],
    exclude: [
    ],
    maxInstances: 5,
    capabilities: [
        {
            maxInstances: 1,
            browserName: 'chrome',
            'goog:chromeOptions': {
                // args: ["--headless", "--disable-gpu", "--lang=pt", "--no-sandbox", "--disable-dev-shm-usage", "--ignore-certificate-errors" ]
                args: ['--headless', '--disable-gpu', '--lang=pt', '--no-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors']
            }
        }
        // {
        //     maxInstances: 1,
        //     browserName: 'firefox',
        //     'moz:firefoxOptions': {
        //         // args: ['-headless']
        //     }
        // },
        // {
        //     browserName: 'MicrosoftEdge',
        //     maxInstances: '1'
        // },
        // {
        //     browserName: 'Internet Explorer',
        //     maxInstances: '1'
        // }
    ],

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async
    // way e.g. using promises you can set the sync option to false.
    sync: true,
    //
    // Level of logging verbosity: silent | verbose | command | data | result |
    // error
    logLevel: 'error',
    //
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './errorShots/',
    //
    // Set a base URL in order to shorten url command calls. If your url
    // parameter starts with "/", then the base url gets prepended.
    baseUrl: process.env.APP_FRONTEND_URL_MAAS_ACCOUNT,
    // baseUrl: 'http://localhost:3001/',
    // baseUrl: 'http://account.maashml.softbox.com.br/',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 60000,
    //
    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They
    // enhance your test setup with almost no effort. Unlike plugins, they don't
    // add new commands. Instead, they hook themselves up into the test process.
    services: ['selenium-standalone', 'static-server'],
    //
    // staticServerPort - Port to bind the server. Default:4567
    //
    staticServerFolders: [
        { mount: '/', path: './test/src/files/' }
    ],
    // DEBUG Server Static Pages
    staticServerLog: false,
    //
    // Framework you want to run your specs with.
    framework: 'cucumber',
    //
    // Test reporter for stdout.
    reporters: ['spec'],
    //
    // If you are using Cucumber you need to specify the location of your step
    // definitions.
    cucumberOpts: {
        // <boolean> show full backtrace for errors
        backtrace: false,
        // <boolean< Treat ambiguous definitions as errors
        failAmbiguousDefinitions: true,
        // <boolean> invoke formatters without executing steps
        // dryRun: false,
        // <boolean> abort the run on first failure
        failFast: false,
        // <boolean> Enable this config to treat undefined definitions as
        // warnings
        ignoreUndefinedDefinitions: false,
        // <string[]> ("extension:module") require files with the given
        // EXTENSION after requiring MODULE (repeatable)
        name: [],
        // <boolean> hide step definition snippets for pending steps
        snippets: true,
        // <boolean> hide source uris
        source: true,
        // <string[]> (name) specify the profile to use
        profile: [],
        // <string[]> (file/dir) require files before executing features
        require: [
            './test/cucumber/steps/**/*.js'
        ],
        // <string> specify a custom snippet syntax
        snippetSyntax: undefined,
        // <boolean> fail if there are any undefined or pending steps
        strict: true,
        // <string> (expression) only execute the features or scenarios with
        // tags matching the expression, see
        // https://docs.cucumber.io/tag-expressions/
        tagExpression: 'not @Pending',
        // <boolean> add cucumber tags to feature or scenario name
        tagsInTitle: false,
        // <number> timeout for step definitions
        // timeout: 60000
        timeout: 200000
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test
    // process in order to enhance it and to build services around it. You can
    // either apply a single function or an array of methods to it. If one of
    // them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    //
    // Gets executed once before all workers get launched.
    onPrepare: function onPrepare () {

    },
    //
    // Gets executed before test execution begins. At this point you can access
    // all global variables, such as `browser`. It is the perfect place to
    // define custom commands.
    before: function before () {

        const chai = require('chai')
        chai.use(require('chai-http'))
        chai.use(require('chai-string'))
        chai.use(require('chai-url'))

        global.expect = chai.expect
        global.assert = chai.assert
        global.should = chai.should()
        global.requestApi = chai.request

        browser.addCommand('waitAndClick', function (qtdRetry) {
            if (qtdRetry === undefined) qtdRetry = 30
            if (qtdRetry === 0) throw new Error(`Não foi possível clicar no elemento com seletor ${this.selector}`)
            try {
                this.click()
            } catch (err) {
                if (err.message.includes('Other element would receive the click')) {
                    browser.pause(500)
                    this.waitAndClick(qtdRetry - 1)
                } else {
                    throw new Error(`Erro ${err.message}`)
                }
            }
        }, true)

        browser.addCommand('forceCleanField', function () {
            try {
                const backSpaces = new Array(this.getValue().length).fill('Backspace')
                this.setValue(backSpaces)
                browser.pause(1000)
            } catch (erro) {
                throw new Error(`algo de errado aconteceu, erro informado: ${erro.message}`)
            }
        }, true)

        browser.addCommand('chooseAndUploadFile', function (selector, relativeFilePath) {
            if (selector === undefined || selector === '') {
                throw new Error(`A referência para o elemento é obrigatória`)
            }
            if (relativeFilePath === undefined || relativeFilePath === '') {
                throw new Error(`O caminho para o arquivo é obrigatório`)
            }
            try {
                const filePath = require('path').join(__dirname, relativeFilePath)
                browser.chooseFile(selector, filePath)
            } catch (erro) {
                throw new Error(`algo de errado aconteceu, erro informado: ${erro.message}`)
            }
        }, true)

        browser.addCommand('login', function (email, senha) {
            if ((email === undefined || email === '') || (senha === undefined || senha === '')) {
                throw new Error(`email e/ou senha não informados`)
            }
            try {
                const token = browser.sessionStorage('GET', 'TOKEN')
                if (token.value === null) {
                    browser.element('#username').setValue(email)
                    browser.element('#password').setValue(senha)
                    browser.element('input[type="submit"]').waitAndClick()
                }
            } catch (erro) {
                throw new Error(`algo de errado aconteceu, erro informado: ${erro.message}`)
            }
        }, true)

        browser.addCommand('logoutAccount', function () {
            try {
                browser.element('[data-test="buttonMenuUser"]').waitAndClick()
                browser.pause(2000)
                browser.element('[data-test="buttonLogout"]').waitAndClick()
            } catch (erro) {
                throw new Error(`algo de errado aconteceu, erro informado: ${erro.message}`)
            }
        }, true)

        browser.addCommand('navigateConsole', function () {
            try {
                browser.pause(2000)
                browser.element('[data-test="buttonMenuUser"]').waitAndClick()
                browser.element('[data-test="buttonConsole"]').waitAndClick()
                browser.pause(2000)
            } catch (erro) {
                throw new Error(`algo de errado aconteceu, erro informado: ${erro.message}`)
            }
        }, true)
    }
})
