'use strict';

function setStatus(status) {
    console.log('postMessage:', { function: 'workerSetStatus', status });
    postMessage({ function: 'workerSetStatus', status });
}

function terminate() { postMessage({ function: 'terminate' }); }

let emModule = {
    noInitialRun: true,
    downloadingFilesystem: false,
    instanciated: false,
    arguments: [],

    print(text) { console.log('print:', text); },

    printErr(text) { console.error('printErr:', text); },

    setStatus(text) {
        console.log('??? ', text)
        if (!text || text === 'Running...')
            return;
        if (text.substr(0, 16) == 'Downloading data') {
            this.downloadingFilesystem = true;
            if (this.instanciated)
                setStatus('Downloading filesystem');
        } else {
            setStatus(text);
        }
    },

    async instantiateWasmAsync(imports, successCallback) {
        try {
            console.log('args', this.arguments);
            setStatus('Compiling wasm');
            let module = await WebAssembly.compile(this.binary);
            setStatus('Instanciating wasm');
            let instance = await WebAssembly.instantiate(module, imports);
            this.instanciated = true;
            if (this.downloadingFilesystem)
                setStatus('Downloading filesystem');
            else
                setStatus('Instanciated');
            successCallback(instance);
        } catch (e) {
            console.log(e.message);
            setStatus('Error in startup');
            terminate();
        }
    },

    instantiateWasm(imports, successCallback) {
        console.log(imports);
        this.instantiateWasmAsync(imports, successCallback);
        return {};
    },

    postRun() {
        emModule.FS.quit = null; // Stop FS shutdown after main()
        emModule.callMain();
        postMessage({ function: 'workerReady' });
    },
};

let commands = {
    async start({ moduleName, binary }) {
        try {
            importScripts(moduleName + '.js');
            emModule.binary = binary;
            Module(emModule);
        } catch (e) {
            console.log(e.message);
            setStatus('Error in startup');
            terminate();
        }
    },

    compile({ code }) {
        try {
            emModule.FS.writeFile('source', code);
            var ok = emModule.ccall(
                'compile', 'number', ['string', 'string'], ['source', 'result.wasm']);
            console.log('ok:', ok);
            var contents =
                emModule.FS.readFile('result.wasm'); //, { encoding: `utf8` });
            console.log(contents);
        } catch (e) {
            console.log(e);
        }
    },
};

onmessage = e => { commands[e.data.function](e.data); };
