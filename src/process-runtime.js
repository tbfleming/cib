'use strict';

importScripts('process.js');
importScripts('wasm-tools.js');

let foo;

emModule.callGlobalInitializers = function () {
    console.log("*****", emModule.initName)
    emModule.wasmInstance.exports[emModule.initName]();
}

emModule.instantiateWasmAsync = async function (imports, successCallback) {
    try {
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
        console.log(e.message);
        await setStatusAsync('init', 'Error in startup');
        terminate();
    }
};

commands.start = async function ({ moduleName, wasmBinary }) {
    try {
        importScripts(moduleName + '.js');
        let binary = new Uint8Array(wasmBinary);
        let { standardSections, relocs, linking } = getSegments(binary);
        let { dataSize, initFunctions } = getLinkingInfo(binary, linking)
        let types = getTypes(binary, standardSections);
        let { numGlobalImports, numFunctionImports, spGlobalIndex } = fixSPImport(binary, standardSections);
        let functions = getFunctions(binary, standardSections, types);
        let globals = getGlobals(binary, standardSections);
        let exports = getExports(binary, standardSections);
        let elems = getElems(binary, standardSections);
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
        //postMessage({ function: 'workerDebugReplaceBinary', newBinary });
        emModule.moduleName = moduleName;
        emModule.wasmBinary = newBinary;
        emModule.STATICTOP = dataSize;
        await emModule.compileWasm();
        Module(emModule);
    } catch (e) {
        console.log(e.message);
        await setStatusAsync('error', 'Error in startup');
        terminate();
    }
};

commands.run = async function ({ wasmBinary }) {
    try {
        let binary = new Uint8Array(wasmBinary);
        let mainExports = emModule.wasmInstance.exports;
        let memory = emModule.wasmMemory;
        let table = emModule.wasmTable;
        let { standardSections, relocs, linking } = getSegments(binary);
        let { dataSize, initFunctions } = getLinkingInfo(binary, linking)
        let memoryBase = mainExports.malloc(dataSize);
        let tableBase = table.length;
        relocate(binary, standardSections, relocs, memoryBase, tableBase);
        let types = getTypes(binary, standardSections);
        let { numGlobalImports, numFunctionImports, spGlobalIndex } = fixSPImport(binary, standardSections);
        let functions = getFunctions(binary, standardSections, types);
        let globals = getGlobals(binary, standardSections);
        let exports = getExports(binary, standardSections);
        let elems = getElems(binary, standardSections);
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
        //postMessage({ function: 'workerDebugReplaceBinary', newBinary });

        let adjustedImports = {};
        for (let name in emModule.asmLibraryArg)
            if (name.substr(0, 3) === '___')
                adjustedImports[name.substr(1)] = emModule.asmLibraryArg[name];
        let env = {
            ...adjustedImports,
            ...emModule.asmLibraryArg,
            ...mainExports,
            __linear_memory: memory,
            __indirect_function_table: table,
            __stack_pointer: 0, // dummy value, not used

            // __info_*: not used by runtime, but available to user code.
            __info_data_begin: () => memoryBase,
            __info_data_end: () => memoryBase + dataSize,
        };
        let module = await WebAssembly.compile(newBinary);
        table.grow(elems.length);
        let inst = await WebAssembly.instantiate(module, { env });
        inst.exports[initName]();
        inst.exports.main();
    } catch (e) {
        console.log(e);
        emModule.printErr(e.toString());
    }

    postMessage({ function: 'workerRunDone' });
};
