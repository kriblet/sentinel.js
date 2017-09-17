#!/usr/bin/env node
'use strict';

// ===========================================
// Sentinel.js
// 1.0.1
// Licensed under AGPLv3
// ===========================================

const init = require('./src/bin/server');

require('yargs') // eslint-disable-line no-unused-expressions
    .usage('Usage: node $0 <cmd> [args]')
    .command({
        command: 'start',
        alias: ['boot', 'init'],
        desc: 'Start Sentinel.js process',
        handler: argv => {
            init.start(argv.debug, argv.config, argv.clusters)
        }
    })
    .command({
        command: 'stop',
        alias: ['quit', 'exit'],
        desc: 'Stop Sentinel.js process',
        handler: argv => {
            init.stop()
        }
    })
    .command({
        command: 'restart',
        alias: ['reload'],
        desc: 'Restart Sentinel.js process',
        handler: argv => {
            init.restart()
        }
    })
    .command({
        command: 'remove',
        alias: ['delete','remove'],
        desc: 'Stops the app and deletes it from pm2 list',
        handler: argv => {
            init.delete()
        }
    })
    .command({
        command: 'hello-world',
        alias: ['hello-world'],
        desc: 'Download and Runs Sentinel.js Hello-World project',
        handler: argv => {
            init.helloWorld()
        }
    })
    .option('debug', {
        type: Boolean,
        desc: 'Execute in debug mode (takes development config)'
    })
    .option('config', {
        type: String,
        desc: 'Path to the config file'
    })
    .option('clusters', {
        type: Number,
        desc: 'Number of instances to execute',
        default: 1
    })
    .recommendCommands()
    .demandCommand(1, 'You must provide one of the accepted commands above.')
    .help()
    .version()
    .epilogue('Read the docs at https://sentineljs.github.io')
    .argv