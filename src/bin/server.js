/**
 * Created by Ben on 08/06/2017.
 */

'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const pm2 = Promise.promisifyAll(require('pm2'));
const ora = require('ora');
const path = require('path');

const ROOTPATH = process.cwd();

let printSentinel = function(){
    console.log("\n" +
        "   _____            _   _            _       _  _____ \n" +
        "  / ____|          | | (_)          | |     | |/ ____|\n" +
        " | (___   ___ _ __ | |_ _ _ __   ___| |     | | (___  \n" +
        "  \\___ \\ / _ \\ '_ \\| __| | '_ \\ / _ \\ | _   | |\\___ \\ \n" +
        "  ____) |  __/ | | | |_| | | | |  __/ || |__| |____) |\n" +
        " |_____/ \\___|_| |_|\\__|_|_| |_|\\___|_(_)____/|_____/ \n" +
        "                                                      \n" +
        "                                                      \n");
};

let server = {
    start: function(){
        let spinner = ora('Initializing...').start();
        printSentinel();
        return fs.emptyDirAsync(path.join(ROOTPATH, './logs')).then(() => {
            return pm2.connectAsync().then(() => {
                return pm2.startAsync({
                    name: 'sentinel',
                    script: './src/bin/index.js',
                    cwd: ROOTPATH,
                    output: path.join(ROOTPATH, './logs/sentinel-output.log'),
                    error: path.join(ROOTPATH, './logs/sentinel-error.log'),
                    minUptime: 5000,
                    maxRestarts: 5
                }).then((res) => {
                    spinner.succeed('Sentinel.js has started successfully.');
                }).catch((err)=>{
                    spinner.fail(err);
                    process.exit(1);
                }).finally(() => {
                    pm2.disconnect();
                })
            }).catch((err)=>{
                spinner.fail(err);
                process.exit(1);
            })
        }).catch(err => {
            spinner.fail(err);
            process.exit(1);
        });
    },
    stop: function(){
        let spinner = ora('Shutting down Sentinel.js...').start();
        return pm2.connectAsync().then(() => {
            return pm2.stopAsync('sentinel').then(() => {
                spinner.succeed('Sentinel.js has stopped successfully.');
            }).finally(() => {
                pm2.disconnect();
            })
        }).catch(err => {
            spinner.fail(err);
            process.exit(1);
        })
    },
    restart: function(){
        let self = this;
        return self.stop().delay(1000).then(() => {
            self.start();
        })
    },
    helloWorld: function(){
        printSentinel();
        let spinner = ora('Working on it yet.').start();
        console.log("\n¯\\_(ツ)_/¯");
        spinner.fail('Sentinel.js not ready for hello-world yet.');
        process.exit();
    }
};
module.exports = server;