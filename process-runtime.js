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
        let stack = mainExports.malloc(8 * 1024 * 1024);

        let { standardSections, relocs, linking } = getSegments(binary);
        let { numGlobalImports, spGlobalIndex } = fixSPImport(binary, standardSections);
        let globals = getGlobals(binary, standardSections);
        let newSpIndex = numGlobalImports + globals.length;
        globals.push({ type: 0x7f, mutability: 1, initExpr: createInitExpr32(stack) });
        let bodies = getCode(binary, standardSections);
        let { dataSegments, endDataOffset } = getData(binary, standardSections);
        let memoryBase = mainExports.malloc(endDataOffset);
        let tableBase = table.length;
        relocate(binary, standardSections, relocs, memoryBase, tableBase);
        generateNewBodies(binary, bodies, spGlobalIndex, newSpIndex);
        let newBinary = replaceSections(binary, standardSections, bodies, dataSegments, globals, memoryBase, tableBase);
        //postMessage({ function: 'workerDebugReplaceBinary', newBinary });

        let imports = {
            env: {
                ...mainExports,
                __linear_memory: memory,
                __indirect_function_table: table,
                __stack_pointer: 0, // dummy value, not used
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
