'use strict'
const base = require('./wdio.conf.base')

exports.config = Object.assign(base.config, {
    specs: ['./test/mocha/*.js'],
    // suites: {
    //     smoke: ['./test/features/smoke/**/*.feature'],
    //     tests: ['./test/features/tests/**/*.feature']
    // },
    exclude: [
    ],
    //
    // Framework you want to run your specs with.
    framework: 'mocha',
    //
    // Test reporter for stdout.
    reporters: ['spec'],
    //
    // If you are using mocha you need to specify the location of your step
    // definitions.
    mochaOpts: {
        ui: 'bdd',
        timeout: process.env.DEBUG ? 99999999 : 60 * 1000
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
    // Gets executed before test execution begins. At this point you can access
    // all global variables, such as `browser`. It is the perfect place to
    // define custom commands.
    before: async function before () {
        const chai = require('chai')
        chai.use(require('chai-http'))
        chai.use(require('chai-string'))
        chai.use(require('chai-url'))
        global.expect = chai.expect
        global.assert = chai.assert
        global.should = chai.should()
        global.requestApi = chai.request
        global.workdir = __dirname
        if (process.env.DEBUG) await this.waitForConnectDebugger()
    }
})
