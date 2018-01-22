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
var wasmImports = {};
var wasmExports = {};

if (inWorker) {
    importScripts('process.js');
    importScripts('wasm-tools.js');
}

emModule.callGlobalInitializers = function () {
    emModule.wasmInstance.exports[emModule.initName]();
}

emModule.instantiateWasmAsync = async function (imports, successCallback) {
    try {
        this.jsExports = imports.env;
        this.instanciating = true;
        await setStatusAsync('init', 'Instanciating ' + this.moduleName + '.wasm');
        let env = {
            ...imports.env,
            __indirect_function_table: imports.env.table,
            __linear_memory: imports.env.memory,
            __stack_pointer: 0, // dummy value, not used
        };
        this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, { env });
        this.instanciating = false;
        await setStatusAsync('init', 'Initializing');
        successCallback(this.wasmInstance);
    } catch (e) {
        if (console.log)
            console.log(e.message);
        await setStatusAsync('init', 'Error in startup');
        terminate();
    }
};

if (!inWorker) {
    emModule.postRun = function () {
        emModule.callMain();
        sendMessage({ function: 'workerSendRun' });
    };
}

commands.start = async function ({ moduleName, wasmBinary }) {
    try {
        if (inWorker)
            importScripts(moduleName + '.js');
        let binary = new Uint8Array(wasmBinary);
        let { standardSections, relocs, linking } = getSegments(binary);
        let { dataSize, initFunctions } = getLinkingInfo(binary, linking)
        let { globalImports, numFunctionImports, spGlobalIndex } = fixSPImport(binary, standardSections);
        let types = getTypes(binary, standardSections);
        let functions = getFunctions(binary, standardSections, types);
        let globals = getGlobals(binary, standardSections);
        let exports = getExports(binary, standardSections);
        let { tableSize, elems } = getElems(binary, standardSections);
        let bodies = getCode(binary, standardSections);
        let { dataSegments } = getData(binary, standardSections);
        generateNewBodies(binary, types, functions, bodies, spGlobalIndex);
        emModule.initName = '__cib_rtl_init';
        generateInit(emModule.initName, types, numFunctionImports, functions, exports, bodies, initFunctions);
        let replacementSections = {
            [WASM_SEC_TYPE]: generateType(types),
            [WASM_SEC_FUNCTION]: generateFunction(functions),
            [WASM_SEC_GLOBAL]: generateGlobal(globals),
            [WASM_SEC_EXPORT]: generateExport(exports),
            [WASM_SEC_ELEM]: generateElem(elems, 0),
            [WASM_SEC_CODE]: generateCode(bodies),
            [WASM_SEC_DATA]: generateData(binary, 0, dataSegments),
        };
        let newBinary = generateBinary(binary, standardSections, replacementSections);
        //sendMessage({ function: 'workerDebugReplaceBinary', newBinary });
        emModule.moduleName = moduleName;
        emModule.wasmBinary = newBinary;
        emModule.STATICTOP = dataSize;
        await emModule.compileWasm();
        Module(emModule);
    } catch (e) {
        if (console.log)
            console.log(e.message);
        await setStatusAsync('error', 'Error in startup');
        terminate();
    }
};

commands.run = async function ({ wasmBinary }) {
    try {
        let binary = new Uint8Array(wasmBinary);
        let rtlExports = emModule.wasmInstance.exports;
        let memory = emModule.wasmMemory;
        let table = emModule.wasmTable;
        let { standardSections, relocs, linking } = getSegments(binary);
        let { dataSize, initFunctions } = getLinkingInfo(binary, linking)
        let memoryBase = rtlExports.malloc(dataSize);
        let tableBase = table.length;
        let { globalImports, numFunctionImports, spGlobalIndex } = fixSPImport(binary, standardSections);
        relocate(binary, standardSections, relocs, rtlExports, globalImports, memoryBase, tableBase);
        let types = getTypes(binary, standardSections);
        let functions = getFunctions(binary, standardSections, types);
        let globals = getGlobals(binary, standardSections);
        let exports = getExports(binary, standardSections);
        let { tableSize, elems } = getElems(binary, standardSections);
        let bodies = getCode(binary, standardSections);
        let { dataSegments } = getData(binary, standardSections);
        generateNewBodies(binary, types, functions, bodies, spGlobalIndex);
        let initName = '__cib_user_init';
        generateInit(initName, types, numFunctionImports, functions, exports, bodies, initFunctions);
        let replacementSections = {
            [WASM_SEC_TYPE]: generateType(types),
            [WASM_SEC_FUNCTION]: generateFunction(functions),
            [WASM_SEC_GLOBAL]: generateGlobal(globals),
            [WASM_SEC_EXPORT]: generateExport(exports),
            [WASM_SEC_ELEM]: generateElem(elems, tableBase),
            [WASM_SEC_CODE]: generateCode(bodies),
            [WASM_SEC_DATA]: generateData(binary, memoryBase, dataSegments),
        };
        let newBinary = generateBinary(binary, standardSections, replacementSections);
        //sendMessage({ function: 'workerDebugReplaceBinary', newBinary });

        let env = {
            ...emModule.jsExports,
            ...rtlExports,
            ...wasmImports,
            __linear_memory: memory,
            __indirect_function_table: table,
            __stack_pointer: 0, // dummy value, not used

            // __info_*: not used by runtime, but available to user code.
            __info_data_begin: () => memoryBase,
            __info_data_end: () => memoryBase + dataSize,
        };
        let module = await WebAssembly.compile(newBinary);
        table.grow(tableSize);
        let inst = await WebAssembly.instantiate(module, { env });
        wasmExports = inst.exports;
        inst.exports[initName]();
        inst.exports.main();
    } catch (e) {
        if (console.log)
            console.log(e);
        emModule.printErr(e.toString());
    }

    sendMessage({ function: 'workerRunDone' });
};

if (!inWorker) {
    emModule.print = emModule.printErr = msg => {
        if (console.log)
            console.log('print:', msg);
    };
    sendMessage({ 'function': 'workerSendStart' });
}
