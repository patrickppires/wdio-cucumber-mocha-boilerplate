const { dbInstance } = require('../lib/db/helperMigration')

const debugProperties = {
    enable: process.env.DEBUG,
    ip: '127.0.0.1',
    port: 9228,
    stopException: process.env.STOPEXCEPTION ? '--inspect-brk' : '--inspect'
}

const argsDefault = ['--disable-gpu', '--lang=pt-BR', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,1280']
if (process.env.TEST_ENV === 'CI' || process.env.HEADLESS) argsDefault.push('--headless')

const defaultCapabilities = [
    {
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: argsDefault
        }
    }
]

exports.config = {

    maxInstances: debugProperties.enable ? 1 : 5,
    capabilities: defaultCapabilities,
    execArgv: debugProperties.enable ? [`${debugProperties.stopException}=${debugProperties.ip}:${debugProperties.port}`] : [],
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
    logLevel: 'silent',
    //
    // Enables colors for log output.
    coloredLogs: true,
    //
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './logs/screenShots',
    //
    // Set a base URL in order to shorten url command calls. If your url
    // parameter starts with "/", then the base url gets prepended.
    baseUrl: process.env.APP_BASE_URL,
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
    // staticServerPort - Port to bind the server. Default: 4567
    //
    staticServerFolders: [
        { mount: '/', path: './lib/core/assets/files/' }
    ],
    //
    // Test reporter for stdout.
    reporters: ['spec'],
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function onPrepare () {
        const path = require('path')
        require('dotenv').config({ path: path.resolve(__dirname, `./.env`), debug: false })
    },
    beforeSession: async function () {
        console.info('Performing migrations...')
        await dbInstance().silence(true)
        await dbInstance().reset()
        await dbInstance().up()
        await console.info('Migrations completed.')
    },
    waitForConnectDebugger: async function waitForConnectDebugger () {
        const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs))
        console.log('Waiting 5s for connect in debugger...')
        await sleep(5000)
    },
    beforeScenario: function (uri, feature, scenario) {}
}
