'use strict';

importScripts('process.js');
importScripts('wasm-tools.js');

let foo;

commands.run = async function ({ wasmBinary }) {
    try {
        let binary = new Uint8Array(wasmBinary);
        let mainExports = emModule.wasmInstance.exports;
        let memory = emModule.wasmMemory;
        let table = emModule.wasmTable;
        let { standardSections, relocs, linking } = getSegments(binary);
        let { numGlobalImports, spGlobalIndex } = fixSPImport(binary, standardSections);
        let globals = getGlobals(binary, standardSections);
        let bodies = getCode(binary, standardSections);
        let { dataSegments, endDataOffset } = getData(binary, standardSections);
        let memoryBase = mainExports.malloc(endDataOffset);
        let tableBase = table.length;
        relocate(binary, standardSections, relocs, memoryBase, tableBase);
        generateNewBodies(binary, bodies, spGlobalIndex);
        let replacementSections = {
            [WASM_SEC_GLOBAL]: generateGlobal(globals),
            [WASM_SEC_ELEM]: generateElem(getElems(binary, standardSections), tableBase),
            [WASM_SEC_CODE]: generateCode(bodies),
            [WASM_SEC_DATA]: generateData(binary, memoryBase, dataSegments),
        };
        let newBinary = generateBinary(binary, standardSections, replacementSections);
        //postMessage({ function: 'workerDebugReplaceBinary', newBinary });

        let adjustedImports = {};
        for (let name in emModule.asmLibraryArg)
            if (name.substr(0, 3) === '___')
                adjustedImports[name.substr(1)] = emModule.asmLibraryArg[name];
        let imports = {
            env: {
                ...adjustedImports,
                ...emModule.asmLibraryArg,
                ...mainExports,
                __linear_memory: memory,
                __indirect_function_table: table,
                __stack_pointer: 0, // dummy value, not used

                // __info_*: not used by runtime, but available to user code.
                //           functions instead of constants to work around a codegen issue.
                __info_data_begin: () => memoryBase,
                __info_data_end: () => memoryBase + endDataOffset,
            },
        };
        let module = await WebAssembly.compile(newBinary);
        let inst = await WebAssembly.instantiate(module, imports);
        inst.exports.main();
    } catch (e) {
        console.log(e);
        emModule.printErr(e.toString());
    }

    postMessage({ function: 'workerRunDone' });
};
