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

#include "wasm-tools.h"
#include <stdio.h>

namespace WasmTools {

const char* type_str(uint8_t type) {
    switch (type) {
    case type_i32:
        return "i32";
    case type_i64:
        return "i64";
    case type_f32:
        return "f32";
    case type_f64:
        return "f64";
    case type_anyfunc:
        return "anyfunc";
    case type_func:
        return "func";
    case type_block:
        return "block";
    default:
        return "bad_type";
    }
}

void write_i32(std::vector<uint8_t>& binary, size_t pos, uint32_t value) {
    binary[pos++] = value >> 0;
    binary[pos++] = value >> 8;
    binary[pos++] = value >> 16;
    binary[pos++] = value >> 24;
}

uint32_t read_leb(const std::vector<uint8_t>& binary, size_t& pos) {
    auto result = uint32_t{0};
    auto shift = 0;
    while (true) {
        auto b = binary[pos++];
        result |= (uint32_t{b} & 0x7f) << shift;
        shift += 7;
        if (!(b & 0x80))
            return result;
    }
}

void write_leb5(std::vector<uint8_t>& binary, size_t pos, uint32_t value) {
    binary[pos++] = ((value >> 0) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 7) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 14) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 21) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 28) & 0x1f) | 0;
}

void write_sleb5(std::vector<uint8_t>& binary, size_t pos, int32_t value) {
    binary[pos++] = ((value >> 0) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 7) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 14) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 21) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 28) & 0x7f) | 0;
}

void push_leb5(std::vector<uint8_t>& binary, uint32_t value) {
    binary.push_back(((value >> 0) & 0x7f) | 0x80);
    binary.push_back(((value >> 7) & 0x7f) | 0x80);
    binary.push_back(((value >> 14) & 0x7f) | 0x80);
    binary.push_back(((value >> 21) & 0x7f) | 0x80);
    binary.push_back(((value >> 28) & 0x1f) | 0);
}

std::string_view read_str(const std::vector<uint8_t>& binary, size_t& pos) {
    auto len = read_leb(binary, pos);
    auto str = std::string_view{(char*)&binary[0] + pos, len};
    pos += len;
    return str;
}

void push_str(std::vector<uint8_t>& binary, std::string_view str) {
    push_leb5(binary, str.size());
    binary.insert(binary.end(), str.begin(), str.end());
}

uint32_t get_count_size(const std::vector<uint8_t>& binary,
                        const Section& section) {
    auto count_pos = section.begin;
    auto count_end = count_pos;
    read_leb(binary, count_end);
    return count_end - count_pos;
}

uint32_t get_init_expr32(const std::vector<uint8_t>& binary, size_t& pos) {
    check(binary[pos++] == instr_i32_const, "init_expr is not i32.const");
    auto offset = read_leb(binary, pos);
    check(binary[pos++] == instr_end, "init_expr missing end");
    return offset;
}

void push_init_expr32(std::vector<uint8_t>& binary, uint32_t value) {
    binary.push_back(instr_i32_const);
    push_leb5(binary, value);
    binary.push_back(instr_end);
}

ResizableLimits read_resizable_limits(const std::vector<uint8_t>& binary,
                                      size_t& pos) {
    auto max_present = !!(binary[pos++] & 1);
    auto initial = read_leb(binary, pos);
    uint32_t maximum{};
    if (max_present)
        maximum = read_leb(binary, pos);
    return {true, max_present, initial, maximum};
}

void push_resizable_limits(std::vector<uint8_t>& binary, bool max_present,
                           uint32_t initial, uint32_t maximum) {
    binary.push_back(max_present);
    push_leb5(binary, initial);
    if (max_present)
        push_leb5(binary, maximum);
}

template <typename F> void push_sized(std::vector<uint8_t>& binary, F f) {
    auto size_pos = binary.size();
    binary.insert(binary.end(), 5, 0);
    auto content_pos = binary.size();
    f();
    write_leb5(binary, size_pos, binary.size() - content_pos);
}

// relocate() relies on this being 5 bytes when filling Linked::relocs
template <typename F> void push_counted(std::vector<uint8_t>& binary, F f) {
    auto count_pos = binary.size();
    binary.insert(binary.end(), 5, 0);
    write_leb5(binary, count_pos, f());
}

template <typename F>
void push_sized_counted(std::vector<uint8_t>& binary, F f) {
    push_sized(binary, [&] { push_counted(binary, f); });
}

void read_sec_type(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("type\n");
    auto count = read_leb(module.binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        FunctionType function_type;
        check(module.binary[pos++] == type_func, "invalid form in type");
        if (debug_read)
            printf("    [%03d] type (", i);
        auto param_count = read_leb(module.binary, pos);
        for (uint32_t j = 0; j < param_count; ++j) {
            function_type.arg_types.push_back(module.binary[pos++]);
            if (debug_read)
                printf("%s ", type_str(function_type.arg_types.back()));
        }
        if (debug_read)
            printf(") ==> (");
        auto return_count = read_leb(module.binary, pos);
        for (uint32_t j = 0; j < return_count; ++j) {
            function_type.return_types.push_back(module.binary[pos++]);
            if (debug_read)
                printf("%s ", type_str(function_type.return_types.back()));
        }
        check(function_type.return_types.size() <= 1, "multiple return types");
        if (debug_read)
            printf(")\n");
        module.function_types.push_back(std::move(function_type));
    }
}

void read_sec_import(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("import\n");
    auto add = [&](auto name, auto kind, auto& container, auto&& value) {
        auto& symbol = module.symbols[name];
        symbol.module = &module;
        if (symbol.import_index)
            check(false,
                  "symbol " + std::string{name} + " has multiple imports");
        symbol.import_index = module.imports.size();
        module.imports.push_back(
            Import{name, kind, (uint32_t)container.size()});
        container.push_back(std::move(value));
    };
    auto count = read_leb(module.binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        auto module_name = read_str(module.binary, pos);
        auto field_name = read_str(module.binary, pos);
        auto kind = module.binary[pos++];
        switch (kind) {
        case external_function: {
            auto type = read_leb(module.binary, pos);
            check(type < module.function_types.size(),
                  "function type doesn't exist");
            if (debug_read)
                printf("    [%03zu] func   %s.%s type %d\n",
                       module.functions.size(),
                       std::string{module_name}.c_str(),
                       std::string{field_name}.c_str(), type);
            ++module.num_imported_functions;
            add(field_name, kind, module.functions, Function{type});
            break;
        }
        case external_table: {
            check(module.binary[pos++] == type_anyfunc,
                  "import table is not anyfunc");
            check(!module.tables.size(), "multiple tables");
            auto limits = read_resizable_limits(module.binary, pos);
            if (debug_read)
                printf(
                    "    [000] table  %s.%s max_present:%u initial:%u max:%u\n",
                    std::string{module_name}.c_str(),
                    std::string{field_name}.c_str(), limits.max_present,
                    limits.initial, limits.maximum);
            add(field_name, kind, module.tables, limits);
            break;
        }
        case external_memory: {
            check(!module.memories.size(), "multiple memories");
            auto limits = read_resizable_limits(module.binary, pos);
            if (debug_read)
                printf(
                    "    [000] memory %s.%s max_present:%u initial:%u max:%u\n",
                    std::string{module_name}.c_str(),
                    std::string{field_name}.c_str(), limits.max_present,
                    limits.initial, limits.maximum);
            add(field_name, kind, module.memories, limits);
            break;
        }
        case external_global: {
            check(module.binary[pos++] == type_i32,
                  "imported global is not i32");
            auto mutability = module.binary[pos++];
            if (debug_read)
                printf("    [%03zu] global %s.%s %s\n", module.globals.size(),
                       std::string{module_name}.c_str(),
                       std::string{field_name}.c_str(),
                       mutability ? "mut" : "");
            ++module.num_imported_globals;
            add(field_name, kind, module.globals, Global{mutability});
            break;
        }
        default:
            check(false, "unknown import kind");
        }
    }
    check(pos == s_end, "import section malformed");
} // read_sec_import

void read_sec_function(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("function\n");
    auto count = read_leb(module.binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        auto type = read_leb(module.binary, pos);
        check(type < module.function_types.size(),
              "function type doesn't exist");
        if (debug_read)
            printf("    [%03zu] func type=%d\n", module.functions.size(), type);
        module.functions.push_back(Function{type});
    }
    check(pos == s_end, "function section malformed");
} // read_sec_function

void read_sec_table(Module& module, size_t& pos, size_t s_end) {
    check(module.binary[pos++] == type_anyfunc, "import table is not anyfunc");
    check(!module.tables.size(), "multiple tables");
    auto limits = read_resizable_limits(module.binary, pos);
    if (debug_read)
        printf("    [000] table  max_present:%u initial:%u max:%u\n",
               limits.max_present, limits.initial, limits.maximum);
    module.tables.push_back(limits);
    check(pos == s_end, "table section malformed");
}

void read_sec_memory(Module& module, size_t& pos, size_t s_end) {
    check(!module.memories.size(), "multiple memories");
    auto limits = read_resizable_limits(module.binary, pos);
    if (debug_read)
        printf("    [000] memory max_present:%u initial:%u max:%u\n",
               limits.max_present, limits.initial, limits.maximum);
    module.memories.push_back(limits);
    check(pos == s_end, "memory section malformed");
}

void read_sec_global(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("global\n");
    auto count = read_leb(module.binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        check(module.binary[pos++] == type_i32, "global is not i32");
        auto mutability = module.binary[pos++];
        auto init_u32 = get_init_expr32(module.binary, pos);
        if (debug_read)
            printf("    [%03zu] global %s = %u\n", module.globals.size(),
                   mutability ? "mut" : "", init_u32);
        module.globals.push_back(Global{mutability, init_u32});
    }
    check(pos == s_end, "global section malformed");
}

void read_sec_export(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("export\n");
    auto add = [&](auto name, auto kind, auto index) {
        auto& symbol = module.symbols[name];
        symbol.module = &module;
        if (symbol.export_index)
            check(false,
                  "symbol " + std::string{name} + " has multiple exports");
        symbol.export_index = module.exports.size();
        module.exports.push_back(Export{name, kind, index});
    };
    auto count = read_leb(module.binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        auto name = read_str(module.binary, pos);
        auto kind = module.binary[pos++];
        auto index = read_leb(module.binary, pos);
        if (kind == external_function) {
            check(index >= module.num_imported_functions &&
                      index < module.functions.size(),
                  "export has invalid function index");
            add(name, kind, index);
            if (debug_read)
                printf("    [%03u] func   %s\n", index,
                       std::string{name}.c_str());
        } else if (kind == external_global) {
            check(index >= module.num_imported_globals &&
                      index < module.globals.size(),
                  "export has invalid global index");
            add(name, kind, index);
            if (debug_read)
                printf("    [%03u] global %s\n", index,
                       std::string{name}.c_str());
        } else {
            if (debug_read)
                printf("    [---] skipped\n");
        }
    }
    check(pos == s_end, "export section malformed");
}

void read_sec_start(Module& module, size_t& pos, size_t s_end) {
    check(false, "start section unsupported");
}

void read_sec_elem(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("elem\n");
    auto count = read_leb(module.binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        check(read_leb(module.binary, pos) == 0, "elem table index not 0");
        auto offset = get_init_expr32(module.binary, pos);
        auto num = read_leb(module.binary, pos);
        for (uint32_t j = 0; j < num; ++j) {
            auto eIndex = offset + j;
            auto function_index = read_leb(module.binary, pos);
            check(function_index < module.functions.size(),
                  "elem has invalid function index");
            if (debug_read)
                printf("    [%03u] = [%03u] func\n", eIndex, function_index);
            if (eIndex >= module.elements.size())
                module.elements.resize(eIndex + 1);
            module.elements[eIndex] = {Element{true, function_index}};
        }
    }
    for (size_t i = 0; i < module.elements.size(); ++i)
        if (!module.elements[i].valid)
            check(false, "hole in table at index " + std::to_string(i));
    check(pos == s_end, "elem section malformed");
}

void read_sec_code(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("code\n");
}

void read_sec_data(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("data\n");
    auto count = read_leb(module.binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        check(read_leb(module.binary, pos) == 0, "data memory index not 0");
        auto offset = get_init_expr32(module.binary, pos);
        auto size = read_leb(module.binary, pos);
        if (debug_read)
            printf("    offset:%d size=%d\n", offset, size);
        module.data_segments.push_back(
            DataSegment{offset, size, uint32_t(pos)});
        pos += size;
    }
    check(pos == s_end, "data section malformed");
}

void read_sec_name(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("name\n");
    while (pos < s_end) {
        auto type = module.binary[pos++];
        auto sub_len = read_leb(module.binary, pos);
        auto sub_end = pos + sub_len;
        if (debug_read)
            printf("    type %d\n", type);
        if (type == name_function) {
            auto count = read_leb(module.binary, pos);
            for (uint32_t i = 0; i < count; ++i) {
                auto index = read_leb(module.binary, pos);
                auto name = read_str(module.binary, pos);
                if (debug_read)
                    printf("        %d %s\n", index, std::string{name}.c_str());
                check(index < module.functions.size(),
                      "invalid function index in name");
            }
        } else {
            pos = sub_end;
        }
    }
    check(pos == s_end, "name section malformed");
}

void read_reloc(Module& module, std::string_view name, size_t& pos,
                size_t s_end) {
    if (debug_read)
        printf("%s\n", std::string{name}.c_str());
    auto section_id = read_leb(module.binary, pos);
    check(section_id == sec_code || section_id == sec_data,
          "unsupported reloc section id");
    auto count = read_leb(module.binary, pos);
    if (debug_read)
        printf("    %d relocs\n", count);
    for (uint32_t i = 0; i < count; ++i) {
        auto type = read_leb(module.binary, pos);
        auto offset = read_leb(module.binary, pos);
        auto index = read_leb(module.binary, pos);
        auto addend = uint32_t{0};
        if (type == reloc_memory_addr_leb || type == reloc_memory_addr_sleb ||
            type == reloc_memory_addr_i32)
            addend = read_leb(module.binary, pos);
        module.relocs.push_back({section_id, type, offset, index, addend});
    }
    check(pos == s_end, "reloc section malformed");
}

void read_linking(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("linking\n");
    while (pos < s_end) {
        auto type = module.binary[pos++];
        read_leb(module.binary, pos); // len
        if (type == link_symbol_info) {
            auto count = read_leb(module.binary, pos);
            for (uint32_t i = 0; i < count; ++i) {
                auto name = read_str(module.binary, pos);
                auto flags = read_leb(module.binary, pos);
                if (debug_read)
                    printf("    symbol  %s flags=%d\n",
                           std::string{name}.c_str(), flags);
                auto& symbol = module.symbols[name];
                symbol.module = &module;
                symbol.flags = flags;
                symbol.in_linking = true;
            }
        } else if (type == link_data_size) {
            module.data_size = read_leb(module.binary, pos);
            if (debug_read)
                printf("    data_size: %d\n", module.data_size);
        } else if (type == link_segment_info) {
            auto count = read_leb(module.binary, pos);
            for (uint32_t i = 0; i < count; ++i) {
                auto name = read_str(module.binary, pos);
                auto alignment = read_leb(module.binary, pos);
                auto flags = read_leb(module.binary, pos);
                if (debug_read)
                    printf("    segment %s alignment=%d flags=%d\n",
                           std::string{name}.c_str(), alignment, flags);
            }
        } else if (type == link_init_funcs) {
            auto count = read_leb(module.binary, pos);
            for (uint32_t i = 0; i < count; ++i) {
                auto priority = read_leb(module.binary, pos);
                auto index = read_leb(module.binary, pos);
                if (index >= module.functions.size())
                    check(false, "init function " + std::to_string(index) +
                                     " out of range");
                module.init_functions.push_back(InitFunction{priority, index});
            }
        } else {
            check(false,
                  "unhandled linking subsection " + std::to_string(type));
        }
    } // while (pos < s_end)
    check(pos == s_end, "linking section malformed");
} // read_linking

void prepare_symbols(Module& module) {
    for (auto& [name, symbol] : module.symbols) {
        if (!symbol.in_linking && symbol.export_index &&
            (symbol.import_global_index || symbol.export_global_index))
            check(false, "global symbol " + std::string{name} +
                             " is exported, but not in linking section");
        if (symbol.in_linking && !symbol.import_index && !symbol.export_index)
            check(false, "symbol " + std::string{name} +
                             " is in linking, but is not an import or export");
        if (symbol.import_index) {
            auto& import = module.imports[*symbol.import_index];
            if (import.kind == external_global) {
                module.globals[import.index].import_symbol = &symbol;
                module.globals[import.index].has_symbols = true;
                symbol.import_global_index = import.index;
            } else if (import.kind == external_function) {
                module.functions[import.index].import_symbol = &symbol;
                symbol.import_function_index = import.index;
            }
        }
        if (symbol.export_index) {
            auto& exp = module.exports[*symbol.export_index];
            if (exp.kind == external_global) {
                module.globals[exp.index].has_symbols = true;
                symbol.export_global_index = exp.index;
            } else if (exp.kind == external_function)
                symbol.export_function_index = exp.index;
        }
        if ((symbol.import_global_index || symbol.export_global_index) &&
            (symbol.import_function_index || symbol.export_function_index))
            check(false,
                  "symbol " + std::string{name} + " has incompatable types");
    } // for(symbols)

    for (auto& global : module.globals)
        if (!global.has_symbols)
            check(false, "global " +
                             std::to_string(&global - &module.globals[0]) +
                             " does not have a symbol");
} // prepare_symbols

void read_module(Module& module) {
    check(module.binary.size() >= 8 &&
              *(uint32_t*)(&module.binary[0]) == 0x6d736100,
          "not a wasm file");
    auto pos = size_t{8};
    auto end = module.binary.size();
    while (pos != end) {
        auto id = module.binary[pos++];
        check(id < num_sections, "invalid section id");
        auto payload_len = read_leb(module.binary, pos);
        auto s_end = pos + payload_len;
        check(s_end <= module.binary.size(), "section extends past file end");
        if (id) {
            module.sections[id] = {true, pos, s_end};
            switch (id) {
            case sec_type:
                read_sec_type(module, pos, s_end);
                break;
            case sec_import:
                read_sec_import(module, pos, s_end);
                break;
            case sec_function:
                read_sec_function(module, pos, s_end);
                break;
            case sec_table:
                read_sec_table(module, pos, s_end);
                break;
            case sec_memory:
                read_sec_memory(module, pos, s_end);
                break;
            case sec_global:
                read_sec_global(module, pos, s_end);
                break;
            case sec_export:
                read_sec_export(module, pos, s_end);
                break;
            case sec_start:
                read_sec_start(module, pos, s_end);
                break;
            case sec_elem:
                read_sec_elem(module, pos, s_end);
                break;
            case sec_code:
                read_sec_code(module, pos, s_end);
                break;
            case sec_data:
                read_sec_data(module, pos, s_end);
                break;
            default:
                check(false, "unknown section id");
            }
        } else {
            auto name = read_str(module.binary, pos);
            if (name.size() >= 6 && !strncmp(&name[0], "reloc.", 6))
                read_reloc(module, name, pos, s_end);
            else if (name == "linking")
                read_linking(module, pos, s_end);
        }
        pos = s_end;
    } // while (pos != end)

    prepare_symbols(module);
} // read_module

Symbol* create_sp_export(Linked& linked) {
    linked.modules.push_back(std::make_unique<Module>());
    auto& module = *linked.modules.back();
    module.filename = "__stack_pointer__module";
    module.globals.push_back(Global{1});
    auto& global = module.globals[0];
    global.is_memory_address = false;
    module.exports.push_back(Export{stack_pointer_name, external_global, 0});
    auto& symbol = module.symbols[stack_pointer_name];
    symbol.module = &module;
    symbol.export_index = 0;
    symbol.export_global_index = 0;
    return &symbol;
}

Module& create_start_function(Linked& linked) {
    linked.modules.push_back(std::make_unique<Module>());
    auto& module = *linked.modules.back();
    module.filename = "__start_function__module";
    module.function_types.push_back(FunctionType{});
    module.functions.push_back(Function{0});
    module.exports.push_back(Export{start_function_name, external_function, 0});
    auto& symbol = module.symbols[start_function_name];
    symbol.module = &module;
    symbol.export_index = 0;
    symbol.export_function_index = 0;
    return module;
}

template <typename F> void for_each_public_linked_symbol(Linked& linked, F f) {
    for (auto& [key, linked_symbol] : linked.linked_symbols) {
        auto& [module, name] = key;
        if (module)
            break;
        f(module, name, linked_symbol);
    }
}

void link_symbols(Linked& linked) {
    for (auto& module : linked.modules) {
        for (auto& [name, symbol] : module->symbols) {
            if (!symbol.import_global_index && !symbol.export_global_index &&
                !symbol.import_function_index && !symbol.export_function_index)
                continue;
            auto key = std::tuple{&*module, name};
            if (!(symbol.flags & sym_binding_local))
                std::get<0>(key) = nullptr;
            auto& linked_symbol = linked.linked_symbols[key];
            symbol.linked_symbol = &linked_symbol;
            linked_symbol.symbols.push_back(&symbol);
            if (symbol.import_global_index || symbol.export_global_index)
                linked_symbol.is_global = true;
            if (symbol.import_function_index || symbol.export_function_index)
                linked_symbol.is_function = true;
        }
    }
    for (auto& [key, linked_symbol] : linked.linked_symbols) {
        auto& [module, name] = key;
        if (linked_symbol.is_global && linked_symbol.is_function)
            check(false, "symbol " + std::string{name} +
                             " types differ between modules");
        for (auto symbol : linked_symbol.symbols) {
            if ((symbol->flags & sym_binding_weak) ||
                (!symbol->export_global_index &&
                 !symbol->export_function_index))
                continue;
            if (linked_symbol.definition) {
                check(false, "symbol " + std::string{name} +
                                 " has multiple definitions" +
                                 "\n   found in: " +
                                 linked_symbol.definition->module->filename +
                                 "\n   found in: " + symbol->module->filename);
            }
            linked_symbol.definition = symbol;
        }
        if (!linked_symbol.definition) {
            for (auto symbol : linked_symbol.symbols) {
                if (symbol->export_global_index ||
                    symbol->export_function_index) {
                    linked_symbol.definition = symbol;
                    break;
                }
            }
        }
        if (!linked_symbol.definition) {
            // printf("unresolved import: %s\n", std::string{name}.c_str());
            if (module)
                check(false, "local symbol " + std::string{name} +
                                 " has no definition in " + module->filename);
            if (linked_symbol.is_function)
                linked.unresolved_functions.push_back(&linked_symbol);
            if (linked_symbol.is_global)
                linked.unresolved_globals.push_back(&linked_symbol);
        }
    }
} // link_symbols

void mark_all(Linked& linked) {
    for (auto& module : linked.modules)
        module->is_marked = true;
    for (auto& [key, linked_symbol] : linked.linked_symbols) {
        linked_symbol.is_marked = true;
        linked_symbol.is_marked_export = true;
    }
}

void add_symbol_to_queue(Linked& linked, LinkedSymbol* linked_symbol,
                         std::vector<LinkedSymbol*>& queue) {
    if (linked_symbol && !linked_symbol->in_queue) {
        linked_symbol->in_queue = true;
        queue.push_back(linked_symbol);
    }
}

void add_export_to_queue(Linked& linked, std::string_view name,
                         std::vector<LinkedSymbol*>& queue) {
    for (auto& module : linked.modules) {
        auto it = module->symbols.find(name);
        if (it != module->symbols.end() && it->second.linked_symbol &&
            it->second.linked_symbol->definition == &it->second) {
            it->second.linked_symbol->is_marked_export = true;
            add_symbol_to_queue(linked, it->second.linked_symbol, queue);
        }
    }
}

void mark_module(Linked& linked, Module& module,
                 std::vector<LinkedSymbol*>& queue) {
    if (module.is_marked)
        return;
    // printf("mark: %s\n", std::string{module.filename}.c_str());
    module.is_marked = true;
    for (uint32_t i = 0; i < module.num_imported_globals; ++i)
        add_symbol_to_queue(
            linked, module.globals[i].import_symbol->linked_symbol, queue);
    for (uint32_t i = 0; i < module.num_imported_functions; ++i)
        add_symbol_to_queue(
            linked, module.functions[i].import_symbol->linked_symbol, queue);
}

void mark_symbols_in_queue(Linked& linked, std::vector<LinkedSymbol*>& queue) {
    while (!queue.empty()) {
        auto* linked_symbol = queue.back();
        queue.pop_back();
        linked_symbol->is_marked = true;
        if (linked_symbol->definition)
            mark_module(linked, *linked_symbol->definition->module, queue);
    }
}

void map_function_types(Linked& linked) {
    auto get_replacement = [&](auto& function_type) {
        auto [it, inserted] = linked.function_type_map.insert(
            {function_type, linked.function_types.size()});
        if (inserted)
            linked.function_types.push_back(function_type);
        return it->second;
    };

    for (auto& module : linked.modules) {
        if (module->is_marked) {
            for (auto& function_type : module->function_types)
                module->replacement_function_types.push_back(
                    get_replacement(function_type));
        } else {
            module->replacement_function_types.insert(
                module->replacement_function_types.end(),
                module->function_types.size(), -1);
        }
    }

    for (auto& linked_symbol : linked.unresolved_functions) {
        auto* symbol = linked_symbol->symbols[0];
        if (!linked_symbol->is_marked)
            continue;
        check(!!symbol->import_function_index,
              "missing symbol->import_function_index");
        auto* module = symbol->module;
        auto& function = module->functions[*symbol->import_function_index];
        module->replacement_function_types[function.type] =
            get_replacement(module->function_types[function.type]);
    }
} // map_function_types

void allocate_memory(Linked& linked, uint32_t memory_offset) {
    for (auto& module : linked.modules) {
        if (!module->is_marked)
            continue;
        module->memory_offset = memory_offset;
        memory_offset =
            (memory_offset + module->data_size + memory_alignment - 1) &
            -memory_alignment;
    }
    linked.memory_size = memory_offset;
}

void allocate_functions(Linked& linked) {
    auto function_offset = uint32_t{0};
    for (auto symbol : linked.unresolved_functions)
        if (symbol->is_marked)
            symbol->final_index = function_offset++;
    for (auto& module : linked.modules) {
        if (!module->is_marked)
            continue;
        module->function_offset = function_offset;
        function_offset +=
            module->functions.size() - module->num_imported_functions;
    }
    for (auto& [key, linked_symbol] : linked.linked_symbols) {
        auto& [module, name] = key;
        auto definition = linked_symbol.definition;
        if (!linked_symbol.is_function || !definition ||
            !definition->module->is_marked)
            continue;
        check(*definition->export_function_index >=
                  definition->module->num_imported_functions,
              "function export malfunction");
        linked_symbol.final_index = *definition->export_function_index -
                                    definition->module->num_imported_functions +
                                    definition->module->function_offset;
        if (!module)
            linked.export_functions.push_back(&linked_symbol);
    }
    for (auto& module : linked.modules) {
        if (!module->is_marked)
            continue;
        module->replacement_functions.resize(module->functions.size());
        uint32_t i = 0;
        for (; i < module->num_imported_functions; ++i) {
            auto& function = module->functions[i];
            check(function.import_symbol, "missing function.import_symbol");
            check(function.import_symbol->linked_symbol,
                  "missing function.import_symbol->linked_symbol");
            check(!!function.import_symbol->linked_symbol->final_index,
                  "missing function.import_symbol->linked_symbol->final_index");
            module->replacement_functions[i] =
                *function.import_symbol->linked_symbol->final_index;
        }
        for (; i < module->functions.size(); ++i)
            module->replacement_functions[i] =
                module->function_offset + i - module->num_imported_functions;
    }
} // allocate_functions

bool fill_start_function_code(Linked& linked, Module& module) {
    std::vector<std::tuple<uint32_t, Module*, uint32_t>> init_functions;
    for (auto& m : linked.modules)
        for (auto& init : m->init_functions)
            init_functions.emplace_back(init.priority, &*m, init.index);
    std::sort(init_functions.begin(), init_functions.end());

    auto& binary = module.binary;
    push_leb5(binary, 1); // count
    push_sized(binary, [&] {
        push_leb5(binary, 0); // local_count
        for (auto& [priority, m, index] : init_functions) {
            binary.push_back(instr_call);
            push_leb5(binary, m->replacement_functions[index]);
        }
        binary.push_back(instr_end);
    });
    module.sections[sec_code] = Section{true, 0, binary.size()};
    return !init_functions.empty();
}

void allocate_code(Linked& linked) {
    uint32_t code_offset = 0;
    for (auto& module : linked.modules) {
        if (!module->is_marked || !module->sections[sec_code].valid)
            continue;
        module->code_offset = code_offset;
        auto& code = module->sections[sec_code];
        auto pos = code.begin;
        read_leb(module->binary, pos);
        code_offset += code.end - pos;
    }
}

void allocate_globals(Linked& linked) {
    auto next_index = uint32_t{0};
    for (auto symbol : linked.unresolved_globals)
        if (symbol->is_marked)
            symbol->final_index = next_index++;
    for_each_public_linked_symbol(
        linked, [&](auto module, auto name, auto& linked_symbol) {
            auto definition = linked_symbol.definition;
            if (!linked_symbol.is_global || !definition ||
                !definition->module->is_marked)
                return;
            check(*definition->export_global_index >=
                      definition->module->num_imported_globals,
                  "global export malfunction");
            linked_symbol.final_index = next_index++;
            linked.export_globals.push_back(&linked_symbol);
        });
    for (auto& module : linked.modules) {
        if (!module->is_marked)
            continue;
        module->replacement_addresses.resize(module->globals.size());
        module->replacement_globals.resize(module->globals.size());
        uint32_t i = 0;
        for (; i < module->num_imported_globals; ++i) {
            auto& global = module->globals[i];
            check(global.import_symbol, "missing global.import_symbol");
            check(global.import_symbol->linked_symbol,
                  "missing global.import_symbol->linked_symbol");
            auto linked_symbol = global.import_symbol->linked_symbol;
            auto definition = linked_symbol->definition;
            if (definition) {
                auto orig_address =
                    definition->module
                        ->globals[*definition->export_global_index]
                        .init_u32;
                module->replacement_addresses[i] =
                    orig_address + definition->module->memory_offset;
            }
            module->replacement_globals[i] = *linked_symbol->final_index;
        }
        for (; i < module->globals.size(); ++i)
            module->replacement_addresses[i] =
                module->globals[i].init_u32 + module->memory_offset;
    }
} // allocate_globals

void allocate_elements(Linked& linked, uint32_t element_offset) {
    linked.element_offset = element_offset;
    for (auto& module : linked.modules) {
        if (!module->is_marked)
            continue;
        module->replacement_elements.reserve(module->elements.size());
        for (auto& element : module->elements) {
            auto function_index =
                module->replacement_functions[element.function_index];
            auto [it, inserted] = linked.function_element_map.insert(
                {function_index, linked.elements.size() + element_offset});
            if (inserted)
                linked.elements.push_back(function_index);
            module->replacement_elements.push_back(it->second);
        }
    }
}

void relocate(Linked& linked, Module& module) {
    for (auto& reloc : module.relocs) {
        check(reloc.section_id == sec_code || reloc.section_id == sec_data,
              "unsupported reloc section id");
        auto& section = module.sections[reloc.section_id];
        check(section.valid, "reloc missing section");

        auto reloc_memory = [&](auto f) {
            check(reloc.index < module.globals.size(),
                  "reloc invalid global index");
            auto replacement = module.replacement_addresses[reloc.index];
            if (replacement)
                f(*replacement + reloc.addend);
            else {
                check(reloc.section_id == sec_code,
                      "unresolved memory reloc not in code");
                // I thought I'd need to forward some memory relocs
                // to the loader, but didn't. The code below and
                // push_sec_code_reloc() are untested, so may corrupt
                // binaries.
                check(false, "unresolved memory reloc in code; this is "
                             "currently disabled");
                // push_counted always uses 5 bytes
                auto new_code_base = 5 + module.code_offset;
                auto& import_symbol = module.globals[reloc.index].import_symbol;
                auto final_index = *import_symbol->linked_symbol->final_index;
                auto count_size =
                    get_count_size(module.binary, module.sections[sec_code]);
                auto new_reloc = reloc;
                new_reloc.offset =
                    new_code_base + new_reloc.offset - count_size;
                new_reloc.index = final_index;
                linked.code_relocs.push_back(new_reloc);
            }
        };

        switch (reloc.type) {
        case reloc_function_index_leb: {
            check(reloc.index < module.functions.size(),
                  "reloc invalid function index");
            write_leb5(module.binary, section.begin + reloc.offset,
                       module.replacement_functions[reloc.index]);
            break;
        }
        case reloc_table_index_sleb:
            check(reloc.index < module.elements.size(),
                  "reloc invalid element index");
            write_sleb5(module.binary, section.begin + reloc.offset,
                        module.replacement_elements[reloc.index]);
            break;
        case reloc_table_index_i32:
            check(reloc.index < module.elements.size(),
                  "reloc invalid element index");
            write_i32(module.binary, section.begin + reloc.offset,
                      module.replacement_elements[reloc.index]);
            break;
        case reloc_memory_addr_leb:
            reloc_memory([&](auto new_address) {
                write_leb5(module.binary, section.begin + reloc.offset,
                           new_address);
            });
            break;
        case reloc_memory_addr_sleb:
            reloc_memory([&](auto new_address) {
                write_sleb5(module.binary, section.begin + reloc.offset,
                            new_address);
            });
            break;
        case reloc_memory_addr_i32:
            reloc_memory([&](auto new_address) {
                write_i32(module.binary, section.begin + reloc.offset,
                          new_address);
            });
            break;
        case reloc_type_index_leb:
            check(reloc.index < module.function_types.size(),
                  "reloc invalid type index");
            write_leb5(module.binary, section.begin + reloc.offset,
                       module.replacement_function_types[reloc.index]);
            break;
        case reloc_global_index_leb: {
            check(reloc.index < module.globals.size() &&
                      module.replacement_globals[reloc.index],
                  "reloc invalid global index");
            write_leb5(module.binary, section.begin + reloc.offset,
                       *module.replacement_globals[reloc.index]);
            break;
        }
        default:
            check(false, "unhandled reloc type " + std::to_string(reloc.type));
        } // switch(type)
    }     // for(reloc)
} // relocate

void relocate(Linked& linked) {
    for (auto& module : linked.modules)
        if (module->is_marked)
            relocate(linked, *module);
}

void fill_header(Linked& linked) {
    linked.binary.resize(8);
    write_i32(linked.binary, 0, 0x6d736100);
    write_i32(linked.binary, 4, 0x1);
}

void push_sec_type(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_type);
    push_sized(binary, [&] {
        push_leb5(binary, linked.function_types.size());
        for (auto& function_type : linked.function_types) {
            binary.push_back(type_func);
            push_leb5(binary, function_type.arg_types.size());
            for (auto type : function_type.arg_types)
                binary.push_back(type);
            check(function_type.return_types.size() < 2,
                  "too many return types");
            binary.push_back(function_type.return_types.size());
            for (auto type : function_type.return_types)
                binary.push_back(type);
        }
    });
}

void push_sec_import(Linked& linked, bool allow_mutable_imports,
                     bool import_table_memory) {
    auto& binary = linked.binary;
    binary.push_back(sec_import);
    push_sized_counted(binary, [&] {
        uint32_t count{};
        auto push_import = [&](std::string_view name, uint8_t kind) {
            ++count;
            push_str(binary, "env");
            push_str(binary, name);
            binary.push_back(kind);
        };

        if (import_table_memory) {
            push_import(table_name, external_table);
            binary.push_back(type_anyfunc);
            push_resizable_limits(
                binary, false, linked.element_offset + linked.elements.size(),
                0);

            push_import(memory_name, external_memory);
            push_resizable_limits(
                binary, false, (linked.memory_size + page_size - 1) / page_size,
                0);
        }

        for (auto& linked_symbol : linked.unresolved_functions) {
            if (!linked_symbol->is_marked)
                continue;
            auto symbol = linked_symbol->symbols[0];
            check(!!symbol->import_index, "missing symbol->import_index");
            check(!!symbol->import_function_index,
                  "missing symbol->import_function_index");
            auto& import = symbol->module->imports[*symbol->import_index];
            auto& function =
                symbol->module->functions[*symbol->import_function_index];
            auto type =
                symbol->module->replacement_function_types[function.type];
            push_import(import.name, external_function);
            push_leb5(binary, type);
        }
        for (auto& linked_symbol : linked.unresolved_globals) {
            if (!linked_symbol->is_marked)
                continue;
            auto symbol = linked_symbol->symbols[0];
            check(!!symbol->import_index, "missing symbol->import_index");
            check(!!symbol->import_global_index,
                  "missing symbol->import_global_index");
            auto& import = symbol->module->imports[*symbol->import_index];
            auto& global =
                symbol->module->globals[*symbol->import_global_index];
            push_import(import.name, external_global);
            binary.push_back(type_i32);
            binary.push_back(global.mutability && allow_mutable_imports);
        }
        return count;
    }); // push_sized_counted
} // push_sec_import

void push_sec_function(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_function);
    push_sized_counted(binary, [&] {
        uint32_t count{};
        for (auto& module : linked.modules) {
            if (!module->is_marked)
                continue;
            for (auto i = module->num_imported_functions;
                 i < module->functions.size(); ++i) {
                auto& function = module->functions[i];
                push_leb5(binary,
                          module->replacement_function_types[function.type]);
                ++count;
            }
        }
        return count;
    });
}

void push_sec_table(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_table);
    push_sized(binary, [&] {
        binary.push_back(1); // count
        binary.push_back(type_anyfunc);
        push_resizable_limits(
            binary, false, linked.element_offset + linked.elements.size(), 0);
    });
}

void push_sec_memory(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_memory);
    push_sized(binary, [&] {
        binary.push_back(1); // count
        push_resizable_limits(
            binary, false, (linked.memory_size + page_size - 1) / page_size, 0);
    });
}

void push_sec_global(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_global);
    push_sized_counted(binary, [&] {
        uint32_t count{};
        for (auto linked_symbol : linked.export_globals) {
            auto definition = linked_symbol->definition;
            auto& global =
                definition->module->globals[*definition->export_global_index];
            binary.push_back(type_i32);
            binary.push_back(global.mutability);
            if (global.is_memory_address)
                push_init_expr32(binary,
                                 *definition->module->replacement_addresses
                                      [*definition->export_global_index]);
            else
                push_init_expr32(binary, global.init_u32);
            ++count;
        }
        return count;
    });
}

void push_sec_export(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_export);
    push_sized_counted(binary, [&] {
        uint32_t count{};
        auto push_exports = [&](auto& linked_symbols, auto type) {
            for (auto linked_symbol : linked_symbols) {
                if (!linked_symbol->is_marked_export)
                    continue;
                auto definition = linked_symbol->definition;
                auto& exp =
                    definition->module->exports[*definition->export_index];
                push_str(binary, exp.name);
                binary.push_back(type);
                push_leb5(binary, *linked_symbol->final_index);
                ++count;
            }
        };
        push_exports(linked.export_functions, external_function);
        push_exports(linked.export_globals, external_global);
        return count;
    });
}

void push_sec_start(Linked& linked, uint32_t index) {
    auto& binary = linked.binary;
    binary.push_back(sec_start);
    push_sized(binary, [&] { push_leb5(binary, index); });
}

void push_sec_elem(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_elem);
    push_sized(binary, [&] {
        binary.push_back(1); // count
        binary.push_back(0); // index
        push_init_expr32(binary, linked.element_offset);
        push_leb5(binary, linked.elements.size());
        for (auto function_index : linked.elements)
            push_leb5(binary, function_index);
    });
}

void push_sec_code(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_code);
    push_sized_counted(binary, [&] {
        uint32_t count{};
        for (auto& module : linked.modules) {
            if (!module->is_marked || !module->sections[sec_code].valid)
                continue;
            auto& sec = module->sections[sec_code];
            auto pos = sec.begin;
            auto c = read_leb(module->binary, pos);
            binary.insert(binary.end(), module->binary.begin() + pos,
                          module->binary.begin() + sec.end);
            count += c;
        }
        return count;
    });
}

void push_sec_code_reloc(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_custom);
    push_sized(binary, [&] {
        push_str(binary, "reloc.CODE");
        binary.push_back(sec_code);
        push_counted(binary, [&] {
            for (auto& reloc : linked.code_relocs) {
                push_leb5(binary, reloc.type);
                push_leb5(binary, reloc.offset);
                push_leb5(binary, reloc.index);
                if (reloc.type == reloc_memory_addr_leb ||
                    reloc.type == reloc_memory_addr_sleb ||
                    reloc.type == reloc_memory_addr_i32)
                    push_leb5(binary, reloc.addend);
            }
            return linked.code_relocs.size();
        });
    });
}

void push_sec_data(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_data);
    push_sized_counted(binary, [&] {
        uint32_t count{};
        for (auto& module : linked.modules) {
            if (!module->is_marked)
                continue;
            for (auto& data_segment : module->data_segments) {
                binary.push_back(0); // index
                push_init_expr32(binary,
                                 data_segment.offset + module->memory_offset);
                push_leb5(binary, data_segment.size);
                binary.insert(binary.end(),
                              module->binary.begin() + data_segment.data_begin,
                              module->binary.begin() + data_segment.data_begin +
                                  data_segment.size);
                ++count;
            }
        }
        return count;
    });
}

// Here's where I cheat. This linker's output isn't
// relocatable, but it has a linking section, contrary to
// https://github.com/WebAssembly/tool-conventions/blob/master/Linking.md
//
// Why does it need it? The loader needs to know:
//  * The data size
//  * The init functions
//
// Why is this linker's output not relocatable?
//  * I want to reduce the loader's burden by not having a large number
//    of relocs.
//  * I don't export local symbols since several tools stop when they
//    see the duplicate names.
void push_sec_linking(Linked& linked) {
    auto& binary = linked.binary;
    binary.push_back(sec_custom);
    push_sized(binary, [&] {
        push_str(binary, "linking");
        binary.push_back(link_data_size);
        push_sized(binary, [&] { push_leb5(binary, linked.memory_size); });
        binary.push_back(link_init_funcs);
        push_sized(binary, [&] {
            push_counted(binary, [&] {
                auto count = uint32_t{};
                for (auto& module : linked.modules) {
                    for (auto& init_fuction : module->init_functions) {
                        push_leb5(binary, init_fuction.priority);
                        push_leb5(
                            binary,
                            module->replacement_functions[init_fuction.index]);
                        ++count;
                    }
                }
                return count;
            });
        });
    });
}

void link(Linked& linked, uint32_t memory_offset, uint32_t element_offset) {
    link_symbols(linked);
    mark_all(linked);
    map_function_types(linked);
    allocate_memory(linked, memory_offset);
    allocate_functions(linked);
    allocate_code(linked);
    allocate_globals(linked);
    allocate_elements(linked, element_offset);
    relocate(linked);
    fill_header(linked);
    push_sec_type(linked);
    push_sec_import(linked, true, true);
    push_sec_function(linked);
    push_sec_global(linked);
    push_sec_export(linked);
    push_sec_elem(linked);
    push_sec_code(linked);
    push_sec_code_reloc(linked);
    push_sec_data(linked);
    push_sec_linking(linked);
}

void linkEos(Linked& linked, Module& main_module, uint32_t stack_size) {
    auto* sp = create_sp_export(linked);
    auto& start_module = create_start_function(linked);
    link_symbols(linked);

    std::vector<LinkedSymbol*> queue;
    mark_module(linked, main_module, queue);
    mark_module(linked, start_module, queue);
    add_export_to_queue(linked, "init", queue);
    add_export_to_queue(linked, "apply", queue);
    mark_symbols_in_queue(linked, queue);

    map_function_types(linked);
    allocate_memory(linked, 16);

    if (sp->linked_symbol->is_marked) {
        linked.memory_size += stack_size;
        sp->module->globals[*sp->export_global_index].init_u32 =
            linked.memory_size;
    }

    allocate_functions(linked);
    auto need_start = fill_start_function_code(linked, start_module);
    allocate_code(linked);
    allocate_globals(linked);
    allocate_elements(linked, 1);
    relocate(linked);
    fill_header(linked);
    push_sec_type(linked);
    push_sec_import(linked, true, false);
    push_sec_function(linked);
    push_sec_table(linked);
    push_sec_memory(linked);
    push_sec_global(linked);
    push_sec_export(linked);
    if (need_start)
        push_sec_start(linked, start_module.replacement_functions[0]);
    push_sec_elem(linked);
    push_sec_code(linked);
    push_sec_data(linked);
}

} // namespace WasmTools
