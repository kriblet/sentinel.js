#!/usr/bin/env node
'use strict';

// ===========================================
// Wiki.js
// 1.0.0
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
            init.start()
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
        command: 'hello-world',
        alias: ['hello-world'],
        desc: 'Download and Runs Sentinel.js Hello-World project',
        handler: argv => {
            init.helloWorld()
        }
    })
    .recommendCommands()
    .demandCommand(1, 'You must provide one of the accepted commands above.')
    .help()
    .version()
    .epilogue('Read the docs at https://sentineljs.github.io')
    .argv