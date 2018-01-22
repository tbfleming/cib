// Copyright 2017-2018 Todd Fleming
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

'use strict';

var inWorker = this.importScripts != undefined;

function sendMessage(msg) {
    if (inWorker)
        postMessage(msg);
    else
        window.parent.postMessage(msg, '*');
}

function setStatus(state, status) {
    sendMessage({ function: 'workerSetStatus', state, status });
}

async function setStatusAsync(state, status) {
    setStatus(state, status);
    return new Promise(resolve => setTimeout(resolve, 0));
}

function terminate() { }

function checkCache(name, hash) {
    return new Promise(resolve => {
        let result = {
            db: null,
            module: null,
        };
        try {
            let request = indexedDB.open('module-cache', 1);
            request.onupgradeneeded = _ => {
                let db = request.result;
                let store = db.createObjectStore('module-cache');
            };
            request.onsuccess = _ => {
                result.db = request.result;
                let store = result.db.transaction(['module-cache'], 'readonly').objectStore('module-cache');
                let read = store.get(name);
                read.onsuccess = _ => {
                    if (read.result) {
                        let h1 = new Uint32Array(hash);
                        let h2 = new Uint32Array(read.result.hash);
                        if (h1.length === h2.length) {
                            let matched = true;
                            for (let i = 0; i < h1.length; ++i)
                                if (h1[i] !== h2[i])
                                    matched = false;
                            if (matched)
                                result.module = read.result.module;
                        }
                    }
                    resolve(result);
                };
                read.onerror = _ => {
                    resolve(result);
                };
            };
            request.onerror = _ => {
                resolve(result);
            };
        } catch (e) {
            resolve(result);
        }
    });
} // checkCache

let emModule = {
    noInitialRun: true,
    instanciating: false,
    arguments: [],
    wasmImports: null,
    wasmInstance: null,
    status: '',

    print(text) {
        sendMessage({ function: 'print', text });
    },

    printErr(text) {
        sendMessage({ function: 'printErr', text });
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

    async compileWasm() {
        let hash, cacheResult;
        if (crypto.subtle) {
            hash = await crypto.subtle.digest('SHA-512', this.wasmBinary);
            cacheResult = await checkCache(this.moduleName, hash);
        } else {
            if (console.log)
                console.log(this.moduleName, "crypto.subtle missing; can't put compiled module in object store");
        }
        if (cacheResult && cacheResult.module) {
            this.wasmModule = cacheResult.module;
            if (console.log)
                console.log(this.moduleName, 'Reusing module from cache');
            return;
        }
        await setStatusAsync('init', 'Compiling ' + this.moduleName + '.wasm');
        this.wasmModule = await WebAssembly.compile(this.wasmBinary);
        if (cacheResult && cacheResult.db) {
            let store = cacheResult.db.transaction(['module-cache'], 'readwrite').objectStore('module-cache');
            try {
                store.put({ hash, module: this.wasmModule }, this.moduleName);
            } catch (e) {
                if (console.log)
                    console.log(this.moduleName, "Can't put compiled module in object store");
            }
        }
    }, // compileWasm()   

    async instantiateWasmAsync(imports, successCallback) {
        try {
            this.instanciating = true;
            await setStatusAsync('init', 'Instanciating ' + this.moduleName + '.wasm');
            imports.env.__environ = emModule._environ; // emscripten sometimes forgots to set some things
            imports.env.__dso_handle = imports.env.__dso_handle || emModule.___dso_handle;
            this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, imports);
            this.instanciating = false;
            await setStatusAsync('init', 'Initializing');
            successCallback(this.wasmInstance);
        } catch (e) {
            if (console.log)
                console.log(e.message);
            await setStatusAsync('init', 'Error in startup');
            terminate();
        }
    },

    instantiateWasm(imports, successCallback) {
        this.wasmImports = imports;
        this.instantiateWasmAsync(imports, successCallback);
        return {};
    },

    postRun() {
        emModule.callMain();
        sendMessage({ function: 'workerReady' });
    },
};

let commands = {
    async start({ moduleName, wasmBinary }) {
        try {
            importScripts(moduleName + '.js');
            emModule.moduleName = moduleName;
            emModule.wasmBinary = wasmBinary;
            await emModule.compileWasm();
            Module(emModule);
        } catch (e) {
            if (console.log)
                console.log(e.message);
            await setStatusAsync('error', 'Error in startup');
            terminate();
        }
    },
};

if (inWorker) {
    onmessage = e => { commands[e.data.function](e.data); };
} else {
    window.addEventListener('message', e => {
        if (e.source == window.parent)
            commands[e.data.function](e.data);
    });
}
