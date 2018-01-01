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
        let stackSize = 8 * 1024 * 1024;
        let stackBegin = mainExports.malloc(stackSize);
        let stackEnd = stackBegin + stackSize;

        let { standardSections, relocs, linking } = getSegments(binary);
        let { numGlobalImports, spGlobalIndex } = fixSPImport(binary, standardSections);
        let globals = getGlobals(binary, standardSections);
        let newSpIndex = numGlobalImports + globals.length;
        globals.push({ type: 0x7f, mutability: 1, initExpr: createInitExpr32(stackEnd) });
        let bodies = getCode(binary, standardSections);
        let { dataSegments, endDataOffset } = getData(binary, standardSections);
        let memoryBase = mainExports.malloc(endDataOffset);
        let tableBase = table.length;
        relocate(binary, standardSections, relocs, memoryBase, tableBase);
        generateNewBodies(binary, bodies, spGlobalIndex, newSpIndex);
        let newBinary = replaceSections(binary, standardSections, bodies, dataSegments, globals, memoryBase, tableBase);
        //postMessage({ function: 'workerDebugReplaceBinary', newBinary });

        let adjustedImports = {};
        for(let name in emModule.asmLibraryArg)
            if(name.substr(0,3) === '___')
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
                __info_stack_begin: () => stackBegin,
                __info_stack_end: () => stackEnd,
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
