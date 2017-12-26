'use strict';

function setStatus(state, status) {
    postMessage({ function: 'workerSetStatus', state, status });
}

function terminate() { }

let emModule = {
    noInitialRun: true,
    instanciating: false,
    arguments: [],
    wasmImports: null,
    wasmInstance: null,
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
            imports.env.__environ = emModule._environ; // It looks like emscripten forgot to set this
            this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, imports);
            this.instanciating = false;
            setStatus('init', 'Initializing');
            setTimeout(() => successCallback(this.wasmInstance), 0);
        } catch (e) {
            console.log(e.message);
            setStatus('init', 'Error in startup');
            terminate();
        }
    },

    instantiateWasm(imports, successCallback) {
        this.wasmImports = imports;
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
};

onmessage = e => { commands[e.data.function](e.data); };
