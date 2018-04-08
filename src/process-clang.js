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

importScripts('process.js');
importScripts('zip.js/zip.js');
importScripts('zip.js/inflate.js');

zip.useWebWorkers = false;

let files = {};
let nextFileId = 0;

class ArrayBufferReader extends zip.Reader {
    constructor(arrayBuffer) {
        super();
        this.arrayBuffer = arrayBuffer;
        this.size = 0;
    }

    init(callback) {
        this.size = this.arrayBuffer.byteLength;
        callback();
    }

    readUint8Array(index, length, callback) {
        // zip.js assumes the Uint8Array points to the beginning of
        // its ArrayBuffer, so we have to copy.
        callback(new Uint8Array(this.arrayBuffer.slice(index, index + length)));
    }
}

async function fetchFile(url) {
    if (url in files)
        return files[url];
    emModule.print('fetch ' + url);
    let response = await fetch(url, { headers: new Headers({ 'accept': 'application/octet-stream' }) });
    if (response.status !== 200)
        throw new Error(response.statusText);
    let content = await response.arrayBuffer();
    files[url] = { url, content };
    return files[url];
}

async function unzipFile(file) {
    if (file.basePath)
        return file.basePath;
    emModule.print('unzip...');
    let basePath = 'fetched_' + nextFileId++ + '/';
    emModule.FS.mkdir(basePath.slice(0, -1));

    await new Promise((resolve, reject) => {
        zip.createReader(
            new ArrayBufferReader(file.content),
            reader => {
                reader.getEntries(entries => {
                    for (let entry of entries) {
                        if (entry.directory) {
                            let path = basePath + entry.filename;
                            emModule.FS.mkdir(path.slice(0, -1));
                        } else {
                            entry.getData({
                                init(callback) {
                                    callback();
                                },
                                writeUint8Array(array, callback) {
                                    let path = basePath + entry.filename;
                                    emModule.FS.writeFile(path, array, { encoding: 'binary' });
                                    callback();
                                },
                                getData() { },
                            }, () => { });
                        }
                    }
                    resolve();
                })
            }, e => {
                if (e instanceof Error)
                    reject(e);
                else
                    reject(new Error(e));
            });
    });

    emModule.print('unzip finished');
    file.basePath = basePath;
    return basePath;
} // unzipFile

commands.compile = async function ({ code, link }) {
    try {
        let systemIncludes = '';
        let re = /^\s*\/\/\s*cib\s*:\s*(\{.*$)/gm;
        let searchResult;
        while (searchResult = re.exec(code)) {
            try {
                let json = JSON.parse(searchResult[1]);
                if (json.fetch && json.unzip_compiler && json.system_includes) {
                    let file = await fetchFile(json.fetch + '');
                    let basePath = await unzipFile(file);
                    for (let a of json.system_includes)
                        systemIncludes += ':' + basePath + a;
                }
            } catch (e) {
                console.log(e);
                emModule.printErr(e.toString());
                postMessage({ function: 'workerCompileDone', result: 0 });
                return;
            }
        }

        emModule.FS.writeFile('source', code);
        let ok = emModule.ccall(
            'compile', 'number', ['string', 'string', 'string'], ['source', 'result.wasm', systemIncludes]);
        let result = null;
        if (ok && link)
            ok = emModule.ccall(
                'link_wasm', 'number', ['string', 'string', 'number'], ['result.wasm', 'result.wasm', 16 * 1024]);
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
