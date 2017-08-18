/**
 * Created by ben on 03/12/2015.
 */
var WebSocket = require('ws');
var ws = new WebSocket('ws://192.168.1.118:58455/', {
    protocolVersion: 8,
    origin: 'http://192.168.1.118'
});

ws.on('open', function open() {
    console.log('connected');
    ws.send(Date.now().toString(), {mask: true});
});

ws.on('close', function close() {
    console.log('disconnected');
});

ws.on('message', function message(data, flags) {
    console.log('Response: ' + data, flags);
    setTimeout(function timeout() {
        ws.send(Date.now().toString(), {mask: true});
    }, 500);
});