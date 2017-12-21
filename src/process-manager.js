class Process {
    constructor(name, moduleName) {
        this.name = name;
        this.moduleName = moduleName;
        this.worker = null;
        this.binary = null;
        this.onWorkerError = this.onWorkerError.bind(this);
        this.onWorkerMessage = this.onWorkerMessage.bind(this);
        this.start();
    }

    setStatus(status) { console.log(this.name, 'status:', status); }

    workerSetStatus({ status }) { this.setStatus(status); }

    onWorkerError(e) {
        if (e.currentTarget !== this.worker)
            return;
        console.log(this.name, 'error:', e);
        this.setStatus('Uncaught error');
        this.terminate();
    }

    onWorkerMessage(e) {
        if (e.currentTarget !== this.worker)
            return;
        this[e.data.function](e.data);
    }

    workerReady() { this.setStatus('Ready'); }

    async start() {
        let worker;
        try {
            this.terminate();
            this.worker = worker = new Worker('process.js', { name: this.name });
            this.worker.onerror = this.onWorkerError;
            this.worker.onmessage = this.onWorkerMessage;

            if (!this.binary) {
                this.setStatus('Downloading ' + this.moduleName + '.wasm');
                let response = await fetch(this.moduleName + '.wasm');
                if (worker != this.worker)
                    return;
                if (!response.ok) {
                    this.setStatus('Error downloading');
                    return;
                }
                let binary = await response.arrayBuffer();
                if (worker != this.worker)
                    return;
                this.binary = binary;
            }

            this.setStatus('Downloading scripts');
            this.worker.postMessage({
                function: 'start',
                moduleName: this.moduleName,
                binary: this.binary,
            })
        } catch (e) {
            if (worker != this.worker)
                return;
            this.setStatus(e.message);
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

let p = new Process('foo', 'clang')

p.workerReady = () => {
    console.log('aabbcc');
    p.worker.postMessage({
        function: 'compile',
        code: 'int puts(const char*);\n\nint main() {puts("example\\n");}\n',
    });
};
