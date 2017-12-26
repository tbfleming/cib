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
        let { dataSegments, endDataOffset } = getData(binary, standardSections);
        let memoryBase = mainExports.malloc(endDataOffset);
        let tableBase = table.length;
        relocate(binary, standardSections, relocs, memoryBase, tableBase);
        let newBinary = replaceSections(binary, standardSections, dataSegments, memoryBase, tableBase);
        let module = await WebAssembly.compile(newBinary);

        let imports = {
            env: {
                ...mainExports,
                __linear_memory: memory,
                __indirect_function_table: table,
            },
        };
        let inst = await WebAssembly.instantiate(module, imports);
        inst.exports.main();
    } catch (e) {
        console.log(e);
        emModule.printErr(e.toString());
    }

    postMessage({ function: 'workerRunDone' });
};
