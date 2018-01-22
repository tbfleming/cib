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

const logSegments = false;
const logLinkingInfo = false;
const logReloc = false;

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
const WASM_SEC_END = 12;

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
const WASM_SEGMENT_INFO = 0x5;
const WASM_INIT_FUNCS = 0x6;

const EXTERNAL_FUNCTION = 0;
const EXTERNAL_TABLE = 1;
const EXTERNAL_MEMORY = 2;
const EXTERNAL_GLOBAL = 3;

const TYPE_I32 = 0x7f;
const TYPE_I64 = 0x7e;
const TYPE_F32 = 0x7d;
const TYPE_F64 = 0x7c;
const TYPE_ANYFUNC = 0x70;
const TYPE_FUNC = 0x60;
const TYPE_BLOCK = 0x40;

const INSTR_END = 0x0b;
const INSTR_CALL = 0x10;
const INSTR_GET_LOCAL = 0x20;
const INSTR_SET_LOCAL = 0x21;
const INSTR_GET_GLOBAL = 0x23;
const INSTR_SET_GLOBAL = 0x24;
const INSTR_I32_LOAD = 0x28;
const INSTR_I32_STORE = 0x36;
const INSTR_I32_CONST = 0x41;

function check(bool, msg) {
    if (!bool)
        throw new Error(msg);
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

function pushLeb5(binary, value) {
    binary.push(
        (value >> 0) & 0x7f | 0x80,
        (value >> 7) & 0x7f | 0x80,
        (value >> 14) & 0x7f | 0x80,
        (value >> 21) & 0x7f | 0x80,
        (value >> 28) & 0x1f | 0,
    );
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

function pushStr(binary, str) {
    let s = (new TextEncoder).encode(str);
    pushLeb5(binary, s.length);
    for (let i = 0; i < s.length; ++i)
        binary.push(s[i]);
}

function skipInstr(binary, opcode, pos) {
    switch (opcode) {
        case 0x00:
        case 0x01:
        case 0x05:
        case 0x0b:
        case 0x0f:
        case 0x1a:
        case 0x1b:
        case 0x45:
        case 0x46:
        case 0x47:
        case 0x48:
        case 0x49:
        case 0x4a:
        case 0x4b:
        case 0x4c:
        case 0x4d:
        case 0x4e:
        case 0x4f:
        case 0x50:
        case 0x51:
        case 0x52:
        case 0x53:
        case 0x54:
        case 0x55:
        case 0x56:
        case 0x57:
        case 0x58:
        case 0x59:
        case 0x5a:
        case 0x5b:
        case 0x5c:
        case 0x5d:
        case 0x5e:
        case 0x5f:
        case 0x60:
        case 0x61:
        case 0x62:
        case 0x63:
        case 0x64:
        case 0x65:
        case 0x66:
        case 0x67:
        case 0x68:
        case 0x69:
        case 0x6a:
        case 0x6b:
        case 0x6c:
        case 0x6d:
        case 0x6e:
        case 0x6f:
        case 0x70:
        case 0x71:
        case 0x72:
        case 0x73:
        case 0x74:
        case 0x75:
        case 0x76:
        case 0x77:
        case 0x78:
        case 0x79:
        case 0x7a:
        case 0x7b:
        case 0x7c:
        case 0x7d:
        case 0x7e:
        case 0x7f:
        case 0x80:
        case 0x81:
        case 0x82:
        case 0x83:
        case 0x84:
        case 0x85:
        case 0x86:
        case 0x87:
        case 0x88:
        case 0x89:
        case 0x8a:
        case 0x8b:
        case 0x8c:
        case 0x8d:
        case 0x8e:
        case 0x8f:
        case 0x90:
        case 0x91:
        case 0x92:
        case 0x93:
        case 0x94:
        case 0x95:
        case 0x96:
        case 0x97:
        case 0x98:
        case 0x99:
        case 0x9a:
        case 0x9b:
        case 0x9c:
        case 0x9d:
        case 0x9e:
        case 0x9f:
        case 0xa0:
        case 0xa1:
        case 0xa2:
        case 0xa3:
        case 0xa4:
        case 0xa5:
        case 0xa6:
        case 0xa7:
        case 0xa8:
        case 0xa9:
        case 0xaa:
        case 0xab:
        case 0xac:
        case 0xad:
        case 0xae:
        case 0xaf:
        case 0xb0:
        case 0xb1:
        case 0xb2:
        case 0xb3:
        case 0xb4:
        case 0xb5:
        case 0xb6:
        case 0xb7:
        case 0xb8:
        case 0xb9:
        case 0xba:
        case 0xbb:
        case 0xbc:
        case 0xbd:
        case 0xbe:
        case 0xbf:
            break;

        case 0x02:
        case 0x03:
        case 0x04:
        case 0x0c:
        case 0x0d:
        case 0x10:
        case 0x20:
        case 0x21:
        case 0x22:
        case 0x23:
        case 0x24:
        case 0x3f:
        case 0x40:
        case 0x41:
        case 0x42:
            readSleb(binary, pos);
            break;

        case 0x11:
        case 0x28:
        case 0x29:
        case 0x2a:
        case 0x2b:
        case 0x2c:
        case 0x2d:
        case 0x2e:
        case 0x2f:
        case 0x30:
        case 0x31:
        case 0x32:
        case 0x33:
        case 0x34:
        case 0x35:
        case 0x36:
        case 0x37:
        case 0x38:
        case 0x39:
        case 0x3a:
        case 0x3b:
        case 0x3c:
        case 0x3d:
        case 0x3e:
            readSleb(binary, pos);
            readSleb(binary, pos);
            break;

        case 0x43:
            pos.byte += 4;
            break;

        case 0x44:
            pos.byte += 8;
            break;

        case 0x0e: {
            let count = readSleb(binary, pos);
            for (let i = 0; i < count; ++i)
                readSleb(binary, pos);
            readSleb(binary, pos);
            break;
        }

        default:
            check(false, 'unrecognized opcode: ' + opcode.toString(16))
    } // switch (opcode)
} // skipInstr()

function skipInitExpr(binary, pos) {
    while (true) {
        let opcode = binary[pos.byte++];
        if (opcode === INSTR_END)
            return;
        skipInstr(binary, opcode, pos);
    }
}

function getInitExpr32(binary, pos, sectionName) {
    let opcode = binary[pos.byte++];
    check(opcode === INSTR_I32_CONST, sectionName + ' init_expr is not i32.const');
    let offset = readLeb(binary, pos);
    opcode = binary[pos.byte++];
    check(opcode === INSTR_END, sectionName + ' init_expr missing end');
    return offset;
}

function createInitExpr32(value) {
    let result = [INSTR_I32_CONST];
    pushLeb5(result, value);
    result.push(INSTR_END);
    return result;
}

function pushInitExpr32(binary, value) {
    binary.push(INSTR_I32_CONST);
    pushLeb5(binary, value);
    binary.push(INSTR_END);
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

function skipResizableLimits(binary, pos) {
    let flags = readLeb(binary, pos);
    let initial = readLeb(binary, pos);
    if (flags & 1)
        readLeb(binary, pos);
}

function getTypes(binary, standardSections) {
    let types = [];
    let section = standardSections[WASM_SEC_TYPE];
    if (section) {
        let pos = { byte: section.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let type = { argTypes: [], returnTypes: [] };
            check(binary[pos.byte++] == TYPE_FUNC, "invalid form in type");
            let paramCount = readLeb(binary, pos);
            for (let j = 0; j < paramCount; ++j)
                type.argTypes.push(binary[pos.byte++]);
            let returnCount = readLeb(binary, pos);
            for (let j = 0; j < returnCount; ++j)
                type.returnTypes.push(binary[pos.byte++]);
            check(type.returnTypes.length <= 1, "multiple return types");
            types.push(type)
        }
        check(pos.byte === section.end, 'WASM_SEC_TYPE section corrupt');
    }
    return types;
}

function fixSPImport(binary, standardSections) {
    let globalImports = [];
    let numFunctionImports = 0;
    let spGlobalIndex = -1;
    let importSection = standardSections[WASM_SEC_IMPORT];
    if (importSection) {
        let pos = { byte: importSection.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let moduleStr = getStr(binary, pos);
            let fieldStr = getStr(binary, pos);
            let kind = binary[pos.byte++];
            if (kind === EXTERNAL_FUNCTION) {
                let type = readLeb(binary, pos);
                ++numFunctionImports;
            } else if (kind === EXTERNAL_TABLE) {
                let type = readLeb(binary, pos);
                skipResizableLimits(binary, pos);
            } else if (kind === EXTERNAL_MEMORY) {
                skipResizableLimits(binary, pos);
            } else if (kind === EXTERNAL_GLOBAL) {
                let type = readLeb(binary, pos);
                if (fieldStr === '__stack_pointer') {
                    spGlobalIndex = globalImports.length;
                    if (binary[pos.byte] === 1) // mutable
                        binary[pos.byte] = 0; // immutable
                }
                globalImports.push(fieldStr);
                ++pos.byte;
            }
            else
                check(false, 'WASM_SEC_IMPORT has unknown kind ' + kind);
        }
        check(pos.byte === importSection.end, 'WASM_SEC_IMPORT section corrupt');
    }
    return { globalImports, numFunctionImports, spGlobalIndex };
} // fixSPImport

function getFunctions(binary, standardSections, types) {
    let functions = [];
    let section = standardSections[WASM_SEC_FUNCTION];
    if (section) {
        let pos = { byte: section.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let type = readLeb(binary, pos);
            check(type < types.length, "function type doesn't exist");
            functions.push(type);
        }
        check(pos.byte === section.end, 'WASM_SEC_FUNCTION section corrupt');
    }
    return functions;
}

function getGlobals(binary, standardSections) {
    let globals = [];
    let globalSection = standardSections[WASM_SEC_GLOBAL];
    if (globalSection) {
        let pos = { byte: globalSection.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let type = binary[pos.byte++];
            let mutability = binary[pos.byte++];
            let beginInitExpr = pos.byte;
            skipInitExpr(binary, pos);
            let endInitExpr = pos.byte;
            globals.push({ type, mutability, initExpr: new Uint8Array(binary.buffer, beginInitExpr, endInitExpr - beginInitExpr) });
        }
        check(pos.byte === globalSection.end, 'WASM_SEC_GLOBAL section corrupt');
    }
    return globals;
} // getGlobals

function getExports(binary, standardSections) {
    let exp = {};
    let section = standardSections[WASM_SEC_EXPORT];
    if (section) {
        let pos = { byte: section.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let name = getStr(binary, pos);
            let kind = binary[pos.byte++];
            let index = readLeb(binary, pos);
            exp[name] = { kind, index };
        }
        check(pos.byte === section.end, 'WASM_SEC_EXPORT section corrupt');
    }
    return exp;
}

function getElems(binary, standardSections) {
    let elems = [];
    let elemSection = standardSections[WASM_SEC_ELEM];
    let tableSize = 0;
    if (elemSection) {
        let pos = { byte: elemSection.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let table = readLeb(binary, pos);
            check(!table, 'WASM_SEC_ELEM has non-0 table index');
            let offset = getInitExpr32(binary, pos, 'WASM_SEC_ELEM');
            let numFunctions = readLeb(binary, pos);
            let functions = [];
            for (let j = 0; j < numFunctions; ++j)
                functions.push(readLeb(binary, pos));
            elems.push({ offset, functions });
            tableSize = Math.max(tableSize, offset + numFunctions);
        }
        check(pos.byte === elemSection.end, 'WASM_SEC_ELEM section corrupt');
    }
    return { tableSize, elems };
} // getElems

function getCode(binary, standardSections) {
    let bodies = [];
    let codeSection = standardSections[WASM_SEC_CODE];
    if (codeSection) {
        let pos = { byte: codeSection.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let bodySize = readLeb(binary, pos);
            let bodyBegin = pos.byte;
            let localCount = readLeb(binary, pos);
            let locals = [];
            for (let j = 0; j < localCount; ++j)
                locals.push({
                    count: readLeb(binary, pos),
                    type: readLeb(binary, pos),
                });
            let codeBegin = pos.byte;
            let codeEnd = pos.byte = bodyBegin + bodySize;
            check(binary[codeEnd - 1] === INSTR_END, 'WASM_SEC_CODE body missing end');
            bodies.push({ locals, codeBegin, codeEnd })
        }
        check(pos.byte === codeSection.end, 'WASM_SEC_CODE section corrupt');
    }
    return bodies;
} // getCode

function getData(binary, standardSections) {
    let dataSegments = [];
    let endDataOffset = 0;
    let dataSection = standardSections[WASM_SEC_DATA];
    if (dataSection) {
        let pos = { byte: dataSection.byte };
        let count = readLeb(binary, pos);
        for (let i = 0; i < count; ++i) {
            let memory = readLeb(binary, pos);
            check(!memory, 'WASM_SEC_DATA has non-0 memory index');
            let offset = getInitExpr32(binary, pos, 'WASM_SEC_DATA');
            let numBytes = readLeb(binary, pos);
            dataSegments.push({ offset, numBytes, byte: pos.byte });
            endDataOffset = Math.max(endDataOffset, offset + numBytes);
            pos.byte += numBytes;
        }
        check(pos.byte === dataSection.end, 'WASM_SEC_DATA section corrupt');
    }
    return { dataSegments, endDataOffset };
} // getData

function getLinkingInfo(binary, linking) {
    check(linking, 'Missing linking section');
    let pos = { byte: linking.byte };
    let end = linking.end;
    let dataSize = 0;
    let initFunctions = [];
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
        } else if (type == WASM_INIT_FUNCS) {
            let count = readLeb(binary, pos);
            for (let i = 0; i < count; ++i) {
                let priority = readLeb(binary, pos);
                let index = readLeb(binary, pos);
                initFunctions.push({ priority, index });
            }
        }
        pos.byte = pEnd;
    }
    check(pos.byte === end, 'Linking section corrupt');
    return { dataSize, initFunctions };
} // getLinkingInfo

function relocate(binary, standardSections, relocs, outsideExports, globalImports, memoryBase, tableBase) {
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
                case R_WEBASSEMBLY_MEMORY_ADDR_SLEB:
                case R_WEBASSEMBLY_MEMORY_ADDR_I32: {
                    let found = false;
                    if (index < globalImports.length) {
                        let exp = outsideExports[globalImports[index]];
                        if (Number.isInteger(exp)) {
                            found = true;
                            if (type === R_WEBASSEMBLY_MEMORY_ADDR_LEB)
                                writeLeb5(binary, { byte: section.byte + offset }, exp + addend);
                            else if (type === R_WEBASSEMBLY_MEMORY_ADDR_SLEB)
                                writeSleb5(binary, { byte: section.byte + offset }, exp + addend);
                            else
                                writeI32(binary, { byte: section.byte + offset }, exp + addend);
                        }
                    }
                    if (!found) {
                        if (type === R_WEBASSEMBLY_MEMORY_ADDR_LEB)
                            updateLeb5(binary, section.byte + offset, memoryBase);
                        else if (type === R_WEBASSEMBLY_MEMORY_ADDR_SLEB)
                            updateSleb5(binary, section.byte + offset, memoryBase);
                        else
                            updateI32(binary, section.byte + offset, memoryBase);
                    }
                    break;
                }
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

function generateNewBodies(binary, types, functions, bodies, spGlobalIndex) {
    for (let i = 0; i < functions.length; ++i) {
        let newCode = [];
        let functionType = types[functions[i]];
        let body = bodies[i];
        let pos = { byte: body.codeBegin };
        let tempLocal = 0;
        tempLocal += functionType.argTypes.length;
        for (let local of body.locals)
            tempLocal += local.count;
        body.locals.push({ count: 1, type: TYPE_I32 });
        while (pos.byte < body.codeEnd) {
            let instrBegin = pos.byte;
            let opcode = binary[pos.byte++];
            let replaced = false;
            if (opcode === INSTR_GET_GLOBAL || opcode === INSTR_SET_GLOBAL) {
                let index = readSleb(binary, pos);
                // Replace SP in global variable with SP at address 1024.
                // This allows multiple loaded binaries to share a single
                // stack until wasm's thread extensions are deployed.
                if (index === spGlobalIndex) {
                    replaced = true;
                    if (opcode === INSTR_GET_GLOBAL) {
                        newCode.push(INSTR_I32_CONST);
                        pushLeb5(newCode, 1024);
                        newCode.push(INSTR_I32_LOAD);
                        newCode.push(2);
                        newCode.push(0);
                    } else {
                        newCode.push(INSTR_SET_LOCAL);
                        pushLeb5(newCode, tempLocal);
                        newCode.push(INSTR_I32_CONST);
                        pushLeb5(newCode, 1024);
                        newCode.push(INSTR_GET_LOCAL);
                        pushLeb5(newCode, tempLocal);
                        newCode.push(INSTR_I32_STORE);
                        newCode.push(2);
                        newCode.push(0);
                    }
                }
            } else {
                skipInstr(binary, opcode, pos);
            }
            if (!replaced)
                for (let i = instrBegin; i < pos.byte; ++i)
                    newCode.push(binary[i]);
        } // while (pos.byte < body.codeEnd)
        check(pos.byte === body.codeEnd, 'function body overrun');
        body.newCode = newCode;
    } // for (let body of bodies)
} // generateNewBodies()

function generateInit(name, types, numFunctionImports, functions, exports, bodies, initFunctions) {
    exports[name] = { kind: EXTERNAL_FUNCTION, index: numFunctionImports + functions.length };
    functions.push(types.length);
    types.push({ argTypes: [], returnTypes: [] });
    let newCode = [];
    initFunctions.sort((a, b) => a.priority - b.priority);
    for (let f of initFunctions) {
        newCode.push(INSTR_CALL);
        pushLeb5(newCode, f.index);
    }
    newCode.push(INSTR_END);
    bodies.push({ locals: [], newCode });
}

function generateType(types) {
    let result = [];
    pushLeb5(result, types.length);
    for (let type of types) {
        result.push(TYPE_FUNC);
        pushLeb5(result, type.argTypes.length);
        for (let t of type.argTypes)
            result.push(t);
        pushLeb5(result, type.returnTypes.length);
        for (let t of type.returnTypes)
            result.push(t);
    }
    return result;
}

function generateFunction(functions) {
    let result = [];
    pushLeb5(result, functions.length);
    for (let functionType of functions)
        result.push(functionType);
    return result;
}

function generateGlobal(globals) {
    let result = [];
    pushLeb5(result, globals.length);
    for (let global of globals) {
        result.push(global.type);
        result.push(global.mutability);
        for (let b of global.initExpr)
            result.push(b);
    }
    return result;
}

function generateExport(exports) {
    let result = [];
    let count = 0;
    for (let name in exports)
        ++count;
    pushLeb5(result, count);
    for (let name in exports) {
        let { kind, index } = exports[name];
        pushStr(result, name);
        result.push(kind);
        pushLeb5(result, index);
    }
    return result;
}

function generateElem(elems, tableBase) {
    let result = [];
    pushLeb5(result, elems.length);
    for (let elem of elems) {
        result.push(0);
        pushInitExpr32(result, tableBase + elem.offset);
        pushLeb5(result, elem.functions.length);
        for (let f of elem.functions)
            pushLeb5(result, f);
    }
    return result;
}

function generateCode(bodies) {
    let result = [];
    pushLeb5(result, bodies.length);
    for (let body of bodies) {
        let bodySize = 5 + body.locals.length * 6 + body.newCode.length;
        pushLeb5(result, bodySize);
        pushLeb5(result, body.locals.length);
        for (let local of body.locals) {
            pushLeb5(result, local.count);
            result.push(local.type);
        }
        for (let b of body.newCode)
            result.push(b);
    }
    return result;
}

function generateData(binary, memoryBase, dataSegments) {
    let result = [];
    pushLeb5(result, dataSegments.length);
    for (let dataSegment of dataSegments) {
        result.push(0);
        pushInitExpr32(result, memoryBase + dataSegment.offset);
        pushLeb5(result, dataSegment.numBytes);
        for (let i = 0; i < dataSegment.numBytes; ++i)
            result.push(binary[dataSegment.byte + i])
    }
    return result;
}

function generateBinary(oldBinary, standardSections, replacementSections) {
    let newBinarySize = 8;
    for (let id = 1; id < WASM_SEC_END; ++id) {
        if (replacementSections[id])
            newBinarySize += 6 + replacementSections[id].length;
        else if (standardSections[id])
            newBinarySize += 6 + standardSections[id].end - standardSections[id].byte;
    }
    let newBinary = new Uint8Array(newBinarySize);
    for (let i = 0; i < 8; ++i)
        newBinary[i] = oldBinary[i];
    let pos = { byte: 8 };
    for (let id = 1; id < WASM_SEC_END; ++id) {
        if (replacementSections[id]) {
            let sec = replacementSections[id];
            newBinary[pos.byte++] = id;
            writeLeb5(newBinary, pos, sec.length);
            for (let i = 0; i < sec.length; ++i)
                newBinary[pos.byte++] = sec[i];
        } else if (standardSections[id]) {
            let sec = standardSections[id];
            newBinary[pos.byte++] = id;
            writeLeb5(newBinary, pos, sec.end - sec.byte);
            for (let i = sec.byte; i < sec.end; ++i)
                newBinary[pos.byte++] = oldBinary[i];
        }
    }
    check(pos.byte === newBinary.length, "generateBinary: didn't reach end");
    return newBinary;
}
