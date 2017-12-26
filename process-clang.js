'use strict';

importScripts('process.js');

commands.compile = function ({ code }) {
    try {
        emModule.FS.writeFile('source', code);
        let ok = emModule.ccall(
            'compile', 'number', ['string', 'string'], ['source', 'result.wasm']);
        let result = null;
        if (ok)
            result = emModule.FS.readFile('result.wasm');
        postMessage({ function: 'workerCompileDone', result });
    } catch (e) {
        console.log(e);
        setStatus('error', 'Fatal error');
        terminate();
        emModule.printErr(e.toString());
    }
};
