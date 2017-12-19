'use strict';

const logSegments = true;
const logLinkingInfo = true;
const logReloc = true;

// include/llvm/BinaryFormat/Wasm.h
const WASM_SEC_CUSTOM = 0;
const WASM_SEC_TYPE = 1;
const WASM_SEC_IMPORT = 2;
const WASM_SEC_FUNCTION = 3;
const WASM_SEC_TABLE = 4;
const WASM_SEC_MEMORY = 5;
const WASM_SEC_GLOBAL = 6;
const WASM_SEC_EXPORT = 7;
const WASM_SEC_START = 8;
const WASM_SEC_ELEM = 9;
const WASM_SEC_CODE = 10;
const WASM_SEC_DATA = 11;

// include/llvm/BinaryFormat/WasmRelocs/WebAssembly.def
const R_WEBASSEMBLY_FUNCTION_INDEX_LEB = 0;
const R_WEBASSEMBLY_TABLE_INDEX_SLEB = 1;
const R_WEBASSEMBLY_TABLE_INDEX_I32 = 2;
const R_WEBASSEMBLY_MEMORY_ADDR_LEB = 3;
const R_WEBASSEMBLY_MEMORY_ADDR_SLEB = 4;
const R_WEBASSEMBLY_MEMORY_ADDR_I32 = 5;
const R_WEBASSEMBLY_TYPE_INDEX_LEB = 6;
const R_WEBASSEMBLY_GLOBAL_INDEX_LEB = 7;

const relocTypes = {
    [R_WEBASSEMBLY_FUNCTION_INDEX_LEB]: 'R_WEBASSEMBLY_FUNCTION_INDEX_LEB',
    [R_WEBASSEMBLY_TABLE_INDEX_SLEB]: 'R_WEBASSEMBLY_TABLE_INDEX_SLEB',
    [R_WEBASSEMBLY_TABLE_INDEX_I32]: 'R_WEBASSEMBLY_TABLE_INDEX_I32',
    [R_WEBASSEMBLY_MEMORY_ADDR_LEB]: 'R_WEBASSEMBLY_MEMORY_ADDR_LEB',
    [R_WEBASSEMBLY_MEMORY_ADDR_SLEB]: 'R_WEBASSEMBLY_MEMORY_ADDR_SLEB',
    [R_WEBASSEMBLY_MEMORY_ADDR_I32]: 'R_WEBASSEMBLY_MEMORY_ADDR_I32',
    [R_WEBASSEMBLY_TYPE_INDEX_LEB]: 'R_WEBASSEMBLY_TYPE_INDEX_LEB',
    [R_WEBASSEMBLY_GLOBAL_INDEX_LEB]: 'R_WEBASSEMBLY_GLOBAL_INDEX_LEB',
};

// include/llvm/BinaryFormat/Wasm.h
const WASM_SYMBOL_INFO = 0x2;
const WASM_DATA_SIZE = 0x3;
const WASM_DATA_ALIGNMENT = 0x4;
const WASM_SEGMENT_INFO = 0x5;

function check(bool, msg) {
    if (!bool)
        throw msg;
}

function readI32(binary, pos) {
    let i =
        ((binary[pos.byte + 0]) << 0) |
        ((binary[pos.byte + 1]) << 8) |
        ((binary[pos.byte + 2]) << 16) |
        ((binary[pos.byte + 3]) << 24);
    pos.byte += 4;
    return i;
}

function readUI32(binary, pos) {
    return readI32(binary, pos) >>> 0;
}

function writeI32(binary, pos, value) {
    binary[pos.byte++] = (value >> 0) & 0xff;
    binary[pos.byte++] = (value >> 8) & 0xff;
    binary[pos.byte++] = (value >> 16) & 0xff;
    binary[pos.byte++] = (value >> 24) & 0xff;
}

function updateI32(binary, byte, delta) {
    let i =
        ((binary[byte + 0]) << 0) |
        ((binary[byte + 1]) << 8) |
        ((binary[byte + 2]) << 16) |
        ((binary[byte + 3]) << 24);
    i = ((i | 0) + (delta | 0)) | 0;
    binary[byte + 0] = (i >> 0) & 0xff;
    binary[byte + 1] = (i >> 8) & 0xff;
    binary[byte + 2] = (i >> 16) & 0xff;
    binary[byte + 3] = (i >> 24) & 0xff;
}

function readSleb(binary, pos) {
    let result = 0;
    let shift = 0;
    while (1) {
        let b = binary[pos.byte++];
        result |= (b & 0x7f) << shift;
        shift += 7;
        if (!(b & 0x80))
            return result;
    }
}

function readLeb(binary, pos) {
    return readSleb(binary, pos) >>> 0;
}

function writeLeb5(binary, pos, value) {
    binary[pos.byte++] = (value >> 0) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 7) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 14) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 21) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 28) & 0x1f | 0;
}

function updateLeb5(binary, byte, delta) {
    let i =
        ((binary[byte + 0] & 0x7f) << 0) |
        ((binary[byte + 1] & 0x7f) << 7) |
        ((binary[byte + 2] & 0x7f) << 14) |
        ((binary[byte + 3] & 0x7f) << 21) |
        ((binary[byte + 4] & 0x7f) << 28);
    i = ((i | 0) + (delta | 0)) | 0;
    binary[byte + 0] = (i >> 0) & 0x7f | 0x80;
    binary[byte + 1] = (i >> 7) & 0x7f | 0x80;
    binary[byte + 2] = (i >> 14) & 0x7f | 0x80;
    binary[byte + 3] = (i >> 21) & 0x7f | 0x80;
    binary[byte + 4] = (i >> 28) & 0x1f | 0;
}

function writeSleb5(binary, pos, value) {
    binary[pos.byte++] = (value >> 0) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 7) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 14) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 21) & 0x7f | 0x80;
    binary[pos.byte++] = (value >> 28) & 0x7f | 0;
}

function updateSleb5(binary, byte, delta) {
    let i =
        ((binary[byte + 0] & 0x7f) << 0) |
        ((binary[byte + 1] & 0x7f) << 7) |
        ((binary[byte + 2] & 0x7f) << 14) |
        ((binary[byte + 3] & 0x7f) << 21) |
        ((binary[byte + 4] & 0x7f) << 28);
    i = ((i | 0) + (delta | 0)) | 0;
    binary[byte + 0] = (i >> 0) & 0x7f | 0x80;
    binary[byte + 1] = (i >> 7) & 0x7f | 0x80;
    binary[byte + 2] = (i >> 14) & 0x7f | 0x80;
    binary[byte + 3] = (i >> 21) & 0x7f | 0x80;
    binary[byte + 4] = (i >> 28) & 0x7f | 0;
}

function getStr(binary, pos) {
    let len = readLeb(binary, pos);
    let str = (new TextDecoder).decode(binary.subarray(pos.byte, pos.byte + len));
    pos.byte += len;
    return str;
}

function getSegments(binary) {
    let int32View = new Uint32Array(binary.buffer, 0, 1);
    check(int32View[0] == 0x6d736100, 'not a wasm file');
    let pos = { byte: 8 };
    let end = binary.length;
    let standardSections = {};
    let relocs = [];
    let linking;
    while (pos.byte < end) {
        let begin = pos.byte;
        let id = binary[pos.byte++];
        let len = readLeb(binary, pos);
        let sEnd = pos.byte + len;
        if (id)
            standardSections[id] = { byte: pos.byte, end: sEnd, totalSize: sEnd - begin };
        else {
            let name = getStr(binary, pos);
            let sec = { name, byte: pos.byte, end: sEnd };
            if (name === 'linking')
                linking = sec;
            else if (name.substr(0, 6) === 'reloc.')
                relocs.push(sec);
        }
        pos.byte = sEnd;
    }
    if (logSegments) {
        console.log('standardSections:', standardSections);
        console.log('relocs:', relocs);
        console.log('linking:', linking);
    }

    return { standardSections, relocs, linking };
}

function getCount(binary, section) {
    if (!section)
        return 0;
    let pos = { byte: section.byte };
    return readLeb(binary, pos);
}

function getElems(binary, standardSections) {
    let elems = [];
    let elemSection = standardSections[WASM_SEC_ELEM];
    if (elemSection) {
        let pos = { byte: elemSection.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let table = readLeb(binary, pos);
            check(!table, 'WASM_SEC_ELEM has non-0 table index');
            let opcode = binary[pos.byte++];
            check(opcode === 0x41, 'WASM_SEC_ELEM init_expr is not i32.const');
            let offset = readLeb(binary, pos);
            opcode = binary[pos.byte++];
            check(opcode === 0x0b, 'WASM_SEC_ELEM init_expr missing end');
            let numFunctions = readLeb(binary, pos);
            let functions = [];
            for (let j = 0; j < numFunctions; ++j)
                functions.push(readLeb(binary, pos));
            elems.push({ offset, functions });
        }
        check(pos.byte === elemSection.end, 'WASM_SEC_ELEM section corrupt');
    }
    return elems;
} // getElems

function getData(binary, standardSections) {
    let dataSegments = [];
    let dataSection = standardSections[WASM_SEC_DATA];
    if (dataSection) {
        let pos = { byte: dataSection.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let memory = readLeb(binary, pos);
            check(!memory, 'WASM_SEC_DATA has non-0 memory index');
            let opcode = binary[pos.byte++];
            check(opcode === 0x41, 'WASM_SEC_DATA init_expr is not i32.const');
            let offset = readLeb(binary, pos);
            opcode = binary[pos.byte++];
            check(opcode === 0x0b, 'WASM_SEC_DATA init_expr missing end');
            let numBytes = readLeb(binary, pos);
            dataSegments.push({ offset, numBytes, byte: pos.byte });
            pos.byte += numBytes;
        }
        check(pos.byte === dataSection.end, 'WASM_SEC_DATA section corrupt');
    }
    return dataSegments;
} // getData

function getLinkingInfo(binary, linking) {
    check(linking, 'Missing linking section');
    let pos = { byte: linking.byte };
    let end = linking.end;
    let dataSize = 0;
    while (pos.byte < end) {
        let type = binary[pos.byte++];
        let pLen = readLeb(binary, pos);
        let pEnd = pos.byte + pLen;
        if (type === WASM_SYMBOL_INFO) {
            if (logLinkingInfo) {
                let count = readLeb(binary, pos);
                for (let i = 0; i < count; ++i) {
                    let name = getStr(binary, pos);
                    let flags = readLeb(binary, pos);
                    console.log('getLinkingInfo: symbol', name, flags);
                }
            }
        } else if (type === WASM_DATA_SIZE) {
            dataSize = readLeb(binary, pos);
            if (logLinkingInfo)
                console.log('getLinkingInfo: dataSize', dataSize);
        } else if (type === WASM_SEGMENT_INFO) {
            if (logLinkingInfo) {
                let count = readLeb(binary, pos);
                for (let i = 0; i < count; ++i) {
                    let name = getStr(binary, pos);
                    let alignment = readLeb(binary, pos);
                    let flags = readLeb(binary, pos);
                    console.log('getLinkingInfo: segment', name, alignment, flags);
                }
            }
        }
        pos.byte = pEnd;
    }
    check(pos.byte === end, 'Linking section corrupt');
    return { dataSize };
} // getLinkingInfo

function relocate(binary, standardSections, relocs, memoryBase, tableBase) {
    for (let reloc of relocs) {
        if (logReloc)
            console.log('relocate:', reloc.name);
        let pos = { byte: reloc.byte };
        let sectionType = readLeb(binary, pos);
        let count = readLeb(binary, pos);
        let section = standardSections[sectionType];
        check(section, reloc.name + ' references non-existing section ' + sectionType);
        for (let i = 0; i < count; ++i) {
            let type = readLeb(binary, pos);
            let offset = readLeb(binary, pos);
            let index = readLeb(binary, pos);
            let addend;
            if (type === R_WEBASSEMBLY_MEMORY_ADDR_LEB ||
                type === R_WEBASSEMBLY_MEMORY_ADDR_SLEB ||
                type === R_WEBASSEMBLY_MEMORY_ADDR_I32)
                addend = readLeb(binary, pos);
            if (logReloc)
                console.log(
                    'relocate:', 'type:', type, relocTypes[type],
                    'offset:', offset.toString(16),
                    'file:', (section.byte + offset).toString(16),
                    'index:', index, 'addend:', addend);
            switch (type) {
                case R_WEBASSEMBLY_FUNCTION_INDEX_LEB:
                    break;
                case R_WEBASSEMBLY_TABLE_INDEX_SLEB:
                    updateSleb5(binary, section.byte + offset, tableBase);
                    break;
                case R_WEBASSEMBLY_TABLE_INDEX_I32:
                    updateI32(binary, section.byte + offset, tableBase);
                    break;
                case R_WEBASSEMBLY_MEMORY_ADDR_LEB:
                    updateLeb5(binary, section.byte + offset, memoryBase);
                    break;
                case R_WEBASSEMBLY_MEMORY_ADDR_SLEB:
                    updateSleb5(binary, section.byte + offset, memoryBase);
                    break;
                case R_WEBASSEMBLY_MEMORY_ADDR_I32:
                    updateI32(binary, section.byte + offset, memoryBase);
                    break;
                case R_WEBASSEMBLY_TYPE_INDEX_LEB:
                    break;
                case R_WEBASSEMBLY_GLOBAL_INDEX_LEB:
                    break;
                default:
                    check(false, reloc.name + ' has unhandled type ' + type + ' ' + relocTypes[type]);
            } // switch(type)
        } // for(i)
        check(pos.byte === reloc.end, reloc.name + ' section corrupt');
    } // for(reloc)
} // relocate()

function replaceSections(oldBinary, standardSections, memoryBase, tableBase) {
    let elems = getElems(oldBinary, standardSections);
    let elemSection = standardSections[WASM_SEC_ELEM];
    let oldElemSize = elemSection ? elemSection.totalSize : 0;
    let newElemSize = 11;
    for (let elem of elems)
        newElemSize += 13 + elem.functions.length * 5;
    if (!elemSection)
        newElemSize = 0;

    let dataSegments = getData(oldBinary, standardSections);
    let dataSection = standardSections[WASM_SEC_DATA];
    let oldDataSize = dataSection ? dataSection.totalSize : 0;
    let newDataSize = 11;
    for (let dataSegment of dataSegments)
        newDataSize += 13 + dataSegment.numBytes;
    if (!dataSection)
        newDataSize = 0;

    let newBinarySize = oldBinary.length - oldElemSize + newElemSize - oldDataSize + newDataSize;
    let newBinary = new Uint8Array(newBinarySize);

    for (let i = 0; i < 8; ++i)
        newBinary[i] = oldBinary[i];
    let oldPos = { byte: 8 };
    let newPos = { byte: 8 };
    let oldEnd = oldBinary.length;

    while (oldPos.byte < oldEnd) {
        let oldBegin = oldPos.byte;
        let id = oldBinary[oldPos.byte++];
        let len = readLeb(oldBinary, oldPos);
        let totalSize = oldPos.byte + len - oldBegin;
        if (id === WASM_SEC_ELEM) {
            oldPos.byte += len;
            newBinary[newPos.byte++] = WASM_SEC_ELEM;
            writeLeb5(newBinary, newPos, newElemSize - 6);
            writeLeb5(newBinary, newPos, elems.length);
            for (let elem of elems) {
                newBinary[newPos.byte++] = 0;
                newBinary[newPos.byte++] = 0x41;
                writeLeb5(newBinary, newPos, tableBase + elem.offset);
                newBinary[newPos.byte++] = 0x0b;
                writeLeb5(newBinary, newPos, elem.functions.length);
                for (let f of elem.functions)
                    writeLeb5(newBinary, newPos, f);
            }
        } else if (id === WASM_SEC_DATA) {
            oldPos.byte += len;
            newBinary[newPos.byte++] = WASM_SEC_DATA;
            writeLeb5(newBinary, newPos, newDataSize - 6);
            writeLeb5(newBinary, newPos, dataSegments.length);
            for (let dataSegment of dataSegments) {
                newBinary[newPos.byte++] = 0;
                newBinary[newPos.byte++] = 0x41;
                writeLeb5(newBinary, newPos, memoryBase + dataSegment.offset);
                newBinary[newPos.byte++] = 0x0b;
                writeLeb5(newBinary, newPos, dataSegment.numBytes);
                for (let i = 0; i < dataSegment.numBytes; ++i)
                    newBinary[newPos.byte++] = oldBinary[dataSegment.byte + i];
            }
        } else {
            oldPos.byte = oldBegin;
            for (let i = 0; i < totalSize; ++i)
                newBinary[newPos.byte++] = oldBinary[oldPos.byte++];
        }
    } // while (oldPos.byte < oldEnd)

    // console.log(oldPos.byte, oldEnd, oldBinary.length);
    // console.log(newPos.byte, newBinary.length);
    check(oldPos.byte === oldBinary.length, "replaceSections: didn't reach end of source");
    check(newPos.byte === newBinary.length, "replaceSections: didn't reach end of dest");
    return newBinary;
} // replaceSections
