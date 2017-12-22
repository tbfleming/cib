const useCache = !/Chrome/.test(navigator.userAgent);

function checkCache(name, hash) {
    return new Promise((resolve, reject) => {
        let result = {
            db: null,
            module: null,
        };
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
                        matched = true;
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
    });
}

class Process {
    constructor(name, moduleName) {
        this.name = name;
        this.moduleName = moduleName;
        this.worker = null;
        this.wasmBinary = null;
        this.wasmModule = null;
        this.onWorkerError = this.onWorkerError.bind(this);
        this.onWorkerMessage = this.onWorkerMessage.bind(this);
    }

    setStatus(state, status) { console.log(this.name, 'state:', state, 'status:', status); }

    workerSetStatus({ state, status }) { this.setStatus(state, status); }

    onWorkerError(e) {
        if (e.currentTarget !== this.worker)
            return;
        console.log(this.name, 'error:', e);
        this.setStatus('error', 'Uncaught error');
        this.terminate();
    }

    onWorkerMessage(e) {
        if (e.currentTarget !== this.worker)
            return;
        this[e.data.function](e.data);
    }

    workerReady() { this.setStatus('ready', 'Ready'); }

    async start() {
        let worker;
        try {
            this.terminate();
            this.worker = worker = new Worker('process.js', { name: this.name });
            this.worker.onerror = this.onWorkerError;
            this.worker.onmessage = this.onWorkerMessage;

            if (!this.wasmBinary) {
                this.setStatus('init', 'Downloading ' + this.moduleName + '.wasm');
                let response = await fetch(this.moduleName + '.wasm');
                if (worker != this.worker)
                    return;
                if (!response.ok) {
                    this.setStatus('error', 'Error downloading');
                    return;
                }
                let wasmBinary = await response.arrayBuffer();
                if (worker != this.worker)
                    return;
                this.wasmBinary = wasmBinary;
            }

            if (!this.wasmModule && useCache) {
                let hash = await crypto.subtle.digest('SHA-512', this.wasmBinary);
                let cacheResult = await checkCache(this.moduleName, hash);
                if (cacheResult.module) {
                    this.wasmModule = cacheResult.module;
                    console.log(this.name, 'Reusing module from cache');
                } else {
                    this.setStatus('init', 'Compiling ' + this.moduleName + '.wasm (will cache)');
                    this.wasmModule = await WebAssembly.compile(this.wasmBinary);
                    if (cacheResult.db) {
                        let store = cacheResult.db.transaction(['module-cache'], 'readwrite').objectStore('module-cache');
                        store.put({ hash, module: this.wasmModule }, this.moduleName);
                    }
                }
            }

            this.setStatus('init', 'Downloading scripts');
            if (this.wasmModule)
                this.worker.postMessage({
                    function: 'start',
                    moduleName: this.moduleName,
                    wasmModule: this.wasmModule,
                });
            else
                this.worker.postMessage({
                    function: 'start',
                    moduleName: this.moduleName,
                    wasmBinary: this.wasmBinary,
                });
        } catch (e) {
            if (worker != this.worker)
                return;
            this.setStatus('error', e.message);
        }
    }

    terminate() {
        if (!this.worker)
            return;
        console.log(this.name, 'terminate');
        this.worker.terminate();
        this.worker = null;
    }
} // class Process
