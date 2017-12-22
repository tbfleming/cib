'use strict';

function setStatus(state, status) {
    postMessage({ function: 'workerSetStatus', state, status });
}

function terminate() { postMessage({ function: 'terminate' }); }

let emModule = {
    noInitialRun: true,
    instanciating: false,
    arguments: [],
    status: '',

    print(text) {
        postMessage({ function: 'print', text });
    },

    printErr(text) {
        if (text.substr(0, 15) === 'atexit() called')
            return;
        if (text.substr(0, 12) === 'Calling stub')
            return;
        postMessage({ function: 'printErr', text });
    },

    setStatus(text) {
        if (!text || text === 'Running...')
            return;
        if (text.substr(0, 16) == 'Downloading data') {
            if (this.instanciating)
                return;
            text = 'Downloading filesystem';
        }
        if (this.status != text) {
            this.status = text;
            setStatus('init', text);
        }
    },

    async instantiateWasmAsync(imports, successCallback) {
        try {
            this.instanciating = true;
            if (!this.wasmModule) {
                setStatus('init', "Compiling " + this.moduleName + ".wasm (cache disabled)");
                this.wasmModule = await WebAssembly.compile(this.wasmBinary);
            }
            setStatus('init', 'Instanciating ' + this.moduleName + '.wasm');
            let instance = await WebAssembly.instantiate(this.wasmModule, imports);
            this.instanciating = false;
            setStatus('init', 'Initializing');
            setTimeout(() => successCallback(instance), 0);
        } catch (e) {
            console.log(e.message);
            setStatus('init', 'Error in startup');
            terminate();
        }
    },

    instantiateWasm(imports, successCallback) {
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
    async start({ moduleName, wasmBinary, wasmModule }) {
        try {
            importScripts(moduleName + '.js');
            emModule.moduleName = moduleName;
            emModule.wasmBinary = wasmBinary;
            emModule.wasmModule = wasmModule;
            Module(emModule);
        } catch (e) {
            console.log(e.message);
            setStatus('error', 'Error in startup');
            terminate();
        }
    },

    compile({ code }) {
        try {
            emModule.FS.writeFile('source', code);
            let ok = emModule.ccall(
                'compile', 'number', ['string', 'string'], ['source', 'result.wasm']);
            let contents;
            if (ok)
                contents = emModule.FS.readFile('result.wasm');
            postMessage({ function: 'workerCompileDone', ok, contents });
        } catch (e) {
            console.log(e);
            setStatus('error', 'Fatal error');
            terminate();
            emModule.printErr(e.toString());
        }
    },
};

onmessage = e => { commands[e.data.function](e.data); };
