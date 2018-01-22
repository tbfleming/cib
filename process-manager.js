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

class ProcessManager {
    constructor(name, moduleName) {
        this.name = name;
        this.moduleName = moduleName;
        this.iframe = null;
        this.worker = null;
        this.wasmBinary = null;
        this.onWorkerError = this.onWorkerError.bind(this);
        this.onWorkerMessage = this.onWorkerMessage.bind(this);
    }

    postMessage(msg) {
        if (this.iframe)
            this.iframe.contentWindow.postMessage(msg, '*');
        else
            this.worker.postMessage(msg);
    }

    setStatus(state, status) { console.log(this.name, 'state:', state, 'status:', status); }

    workerSetStatus({ state, status }) { this.setStatus(state, status); }

    onWorkerError(e) {
        if (e.currentTarget !== this.worker)
            return;
        console.log(this.name, 'error:', e);
        this.setStatus('error', 'Uncaught error; see log');
        this.terminate();
    }

    onWorkerMessage(e) {
        if (this.iframe) {
            if (e.source != this.iframe.contentWindow)
                return;
        } else {
            if (e.currentTarget != this.worker)
                return;
        }
        this[e.data.function](e.data);
    }

    workerReady() { this.setStatus('ready', 'Ready'); }

    workerSendStart() {
        this.postMessage({
            function: 'start',
            moduleName: this.moduleName,
            wasmBinary: this.wasmBinary,
        });
    }

    async start(iframe) {
        let worker;
        try {
            this.terminate();
            this.iframe = iframe;
            if (iframe) {
                window.addEventListener('message', this.onWorkerMessage);
            }
            else {
                this.worker = worker = new Worker('process-' + this.name + '.js', { name: this.name });
                this.worker.onerror = this.onWorkerError;
                this.worker.onmessage = this.onWorkerMessage;
            }

            if (!this.wasmBinary) {
                this.setStatus('init', 'Downloading ' + this.moduleName + '.wasm');
                let response = await fetch(this.moduleName + '.wasm');
                if (worker !== this.worker || iframe !== this.iframe)
                    return;
                if (!response.ok) {
                    this.setStatus('error', 'Error downloading ' + this.moduleName + '.wasm');
                    return;
                }
                let wasmBinary = await response.arrayBuffer();
                if (worker !== this.worker || iframe !== this.iframe)
                    return;
                this.wasmBinary = wasmBinary;
            }

            this.setStatus('init', 'Downloading scripts');
            if (worker)
                this.postMessage({
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
        if (!this.worker && !this.iframe)
            return;
        console.log(this.name, 'terminate');
        if (this.iframe)
            window.removeEventListener('message', this.onWorkerMessage);
        if (this.worker)
            this.worker.terminate();
        this.iframe = null;
        this.worker = null;
    }
} // class ProcessManager
