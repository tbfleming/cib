'use strict';

importScripts('process.js');

commands.format = function ({ code }) {
    try {
        let result = emModule.ccall('formatCode', 'string', ['string'], [code]);
        postMessage({ function: 'workerFormatDone', result });
    } catch (e) {
        console.log(e);
        emModule.printErr(e.toString());
        postMessage({ function: 'workerFormatDone', result: e.toString() });
        setStatus('error', 'Fatal error');
        terminate();
    }
};
