#include <map>
#include <memory>
#include <optional>
#include <stdexcept>
#include <stdint.h>
#include <stdio.h>
#include <string>
#include <string_view>
#include <tuple>
#include <vector>

namespace WasmTools {

using std::operator""s;

inline const bool debug_read = false;

inline const uint8_t sec_custom = 0;
inline const uint8_t sec_type = 1;
inline const uint8_t sec_import = 2;
inline const uint8_t sec_function = 3;
inline const uint8_t sec_table = 4;
inline const uint8_t sec_memory = 5;
inline const uint8_t sec_global = 6;
inline const uint8_t sec_export = 7;
inline const uint8_t sec_start = 8;
inline const uint8_t sec_elem = 9;
inline const uint8_t sec_code = 10;
inline const uint8_t sec_data = 11;
inline const uint8_t num_sections = 12;

inline const uint8_t external_function = 0;
inline const uint8_t external_table = 1;
inline const uint8_t external_memory = 2;
inline const uint8_t external_global = 3;

inline const uint8_t type_i32 = 0x7f;
inline const uint8_t type_i64 = 0x7e;
inline const uint8_t type_f32 = 0x7d;
inline const uint8_t type_f64 = 0x7c;
inline const uint8_t type_anyfunc = 0x70;
inline const uint8_t type_func = 0x60;
inline const uint8_t type_block = 0x40;

inline const uint8_t reloc_function_index_leb = 0;
inline const uint8_t reloc_table_index_sleb = 1;
inline const uint8_t reloc_table_index_i32 = 2;
inline const uint8_t reloc_memory_addr_leb = 3;
inline const uint8_t reloc_memory_addr_sleb = 4;
inline const uint8_t reloc_memory_addr_i32 = 5;
inline const uint8_t reloc_type_index_leb = 6;
inline const uint8_t reloc_global_index_leb = 7;

inline const uint8_t link_symbol_info = 0x2;
inline const uint8_t link_data_size = 0x3;
inline const uint8_t link_segment_info = 0x5;
inline const uint8_t link_init_funcs = 0x6;

inline const uint8_t sym_binding_weak = 1;
inline const uint8_t sym_binding_local = 2;
inline const uint8_t sym_visibility_hidden = 4;

auto type_str(uint8_t type) {
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

inline const uint8_t name_module = 0;
inline const uint8_t name_function = 1;
inline const uint8_t name_local = 2;

struct File {
    FILE* file;
    File(const char* name, const char* mode) {
        file = fopen(name, mode);
        if (!file)
            throw std::runtime_error{("can not open "s + name).c_str()};
    }
    ~File() { fclose(file); }

    size_t size() {
        fseek(file, 0, SEEK_END);
        auto result = ftell(file);
        fseek(file, 0, SEEK_SET);
        return result;
    }

    auto read() {
        auto s = size();
        auto buffer = std::vector<uint8_t>(s);
        if (fread(&buffer[0], s, 1, file) != 1)
            throw std::runtime_error{"Read failed"};
        return buffer;
    }

    void write(const std::vector<uint8_t>& buffer) {
        if (fwrite(&buffer[0], buffer.size(), 1, file) != 1)
            throw std::runtime_error{"Write failed"};
    }
};

inline void write_i32(std::vector<uint8_t>& binary, size_t pos,
                      uint32_t value) {
    binary[pos++] = value >> 0;
    binary[pos++] = value >> 8;
    binary[pos++] = value >> 16;
    binary[pos++] = value >> 24;
}

inline auto read_leb(const std::vector<uint8_t>& binary, size_t& pos) {
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

inline void write_leb5(std::vector<uint8_t>& binary, size_t pos,
                       uint32_t value) {
    binary[pos++] = ((value >> 0) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 7) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 14) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 21) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 28) & 0x1f) | 0;
}

inline void write_sleb5(std::vector<uint8_t>& binary, size_t pos,
                        int32_t value) {
    binary[pos++] = ((value >> 0) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 7) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 14) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 21) & 0x7f) | 0x80;
    binary[pos++] = ((value >> 28) & 0x7f) | 0;
}

inline void push_leb5(std::vector<uint8_t>& binary, uint32_t value) {
    binary.push_back(((value >> 0) & 0x7f) | 0x80);
    binary.push_back(((value >> 7) & 0x7f) | 0x80);
    binary.push_back(((value >> 14) & 0x7f) | 0x80);
    binary.push_back(((value >> 21) & 0x7f) | 0x80);
    binary.push_back(((value >> 28) & 0x1f) | 0);
}

inline std::string_view read_str(const std::vector<uint8_t>& binary,
                                 size_t& pos) {
    auto len = read_leb(binary, pos);
    auto str = std::string_view{(char*)&binary[0] + pos, len};
    pos += len;
    return str;
}

template <typename T> void check(bool cond, const T& msg) {
    if (!cond)
        throw std::runtime_error(msg);
}

inline auto get_init_expr32(const std::vector<uint8_t>& binary, size_t& pos) {
    check(binary[pos++] == 0x41, "init_expr is not i32.const");
    auto offset = read_leb(binary, pos);
    check(binary[pos++] == 0x0b, "init_expr missing end");
    return offset;
}

struct Section {
    bool valid{};
    size_t begin{};
    size_t end{};
};

struct Import {
    std::string_view name{};
    uint8_t kind{};
    uint32_t index{};
};

struct FunctionType {
    std::vector<uint8_t> arg_types{};
    std::vector<uint8_t> return_types{};
};

inline bool operator<(const FunctionType& a, const FunctionType& b) {
    return std::tie(a.arg_types, a.return_types) <
           std::tie(b.arg_types, b.return_types);
}

struct Function {
    uint32_t type{};
    struct Symbol* import_symbol{};
};

struct ResizableLimits {
    bool valid{};
    bool max_present{};
    uint32_t initial{};
    uint32_t maximum{};
};

struct Global {
    uint32_t init_u32{};
    struct Symbol* import_symbol{};
    bool has_symbols{};
};

struct Export {
    std::string_view name{};
    uint8_t kind{};
    uint32_t index{};
};

struct Element {
    bool valid{};
    uint32_t function_index{};
};

struct DataSegment {
    uint32_t offset;
    uint32_t size;
    uint32_t dataBegin;
};

struct Reloc {
    uint32_t section_id{};
    uint32_t type{};
    uint32_t offset{};
    uint32_t index{};
    uint32_t addend{};
};

struct Symbol {
    struct Module* module{};
    uint32_t flags{};
    std::optional<uint32_t> import_index{};
    std::optional<uint32_t> export_index{};
    std::optional<uint32_t> import_global_index{};
    std::optional<uint32_t> export_global_index{};
    std::optional<uint32_t> import_function_index{};
    std::optional<uint32_t> export_function_index{};
    struct LinkedSymbol* linked_symbol{};
    bool is_stack_ptr{};
    bool in_linking{};
};

struct Module {
    std::string filename{};
    std::vector<uint8_t> binary{};
    Section sections[num_sections]{};
    std::vector<Import> imports{};
    std::vector<ResizableLimits> tables{};
    std::vector<ResizableLimits> memories{};
    uint32_t num_imported_globals{};
    std::vector<Global> globals{};
    std::vector<FunctionType> function_types{};
    uint32_t num_imported_functions{};
    std::vector<Function> functions{};
    std::vector<Export> exports{};
    std::vector<Element> elements{};
    std::vector<DataSegment> data_segments{};
    std::vector<Reloc> relocs{};
    std::map<std::string_view, Symbol> symbols{};
    uint32_t data_size{};
    uint32_t memory_offset{};
    uint32_t global_offset{};
    uint32_t function_offset{};
    std::vector<uint32_t> replacement_function_types{};
    std::vector<uint32_t> replacement_globals{};
    std::vector<std::optional<uint32_t>> replacement_addresses{};
    std::vector<uint32_t> replacement_functions{};
    std::vector<uint32_t> replacement_elements{};
};

struct LinkedSymbol {
    std::vector<Symbol*> symbols{};
    Symbol* definition{};
    std::optional<uint32_t> final_index;
    bool is_stack_ptr{};
    bool is_global{};
    bool is_function{};
};

struct Linked {
    std::vector<std::unique_ptr<Module>> modules{};
    std::vector<FunctionType> function_types;
    std::map<FunctionType, uint32_t> function_type_map;
    std::map<std::tuple<Module*, std::string_view>, LinkedSymbol>
        linked_symbols{};
    std::vector<LinkedSymbol*> unresolved_functions;
    std::vector<LinkedSymbol*> unresolved_globals;
    std::vector<uint32_t> elements{};
    std::map<uint32_t, uint32_t> function_element_map;
};

inline ResizableLimits read_resizable_limits(const std::vector<uint8_t>& binary,
                                             size_t& pos) {
    auto max_present = !!(binary[pos++] & 1);
    auto initial = read_leb(binary, pos);
    uint32_t maximum{};
    if (max_present)
        maximum = read_leb(binary, pos);
    return {true, max_present, initial, maximum};
}

inline void read_sec_type(Module& module, size_t& pos, size_t s_end) {
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

inline void read_sec_import(Module& module, size_t& pos, size_t s_end) {
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
            add(field_name, kind, module.globals, Global{});
            break;
        }
        default:
            check(false, "unknown import kind");
        }
    }
    check(pos == s_end, "import section malformed");
} // read_sec_import

inline void read_sec_function(Module& module, size_t& pos, size_t s_end) {
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

inline void read_sec_table(Module& module, size_t& pos, size_t s_end) {
    check(module.binary[pos++] == type_anyfunc, "import table is not anyfunc");
    check(!module.tables.size(), "multiple tables");
    auto limits = read_resizable_limits(module.binary, pos);
    if (debug_read)
        printf("    [000] table  max_present:%u initial:%u max:%u\n",
               limits.max_present, limits.initial, limits.maximum);
    module.tables.push_back(limits);
    check(pos == s_end, "table section malformed");
}

inline void read_sec_memory(Module& module, size_t& pos, size_t s_end) {
    check(!module.memories.size(), "multiple memories");
    auto limits = read_resizable_limits(module.binary, pos);
    if (debug_read)
        printf("    [000] memory max_present:%u initial:%u max:%u\n",
               limits.max_present, limits.initial, limits.maximum);
    module.memories.push_back(limits);
    check(pos == s_end, "memory section malformed");
}

inline void read_sec_global(Module& module, size_t& pos, size_t s_end) {
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
        module.globals.push_back(Global{init_u32});
    }
    check(pos == s_end, "global section malformed");
}

inline void read_sec_export(Module& module, size_t& pos, size_t s_end) {
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

inline void read_sec_start(Module& module, size_t& pos, size_t s_end) {
    check(false, "start section unsupported");
}

inline void read_sec_elem(Module& module, size_t& pos, size_t s_end) {
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

inline void read_sec_code(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("code\n");
}

inline void read_sec_data(Module& module, size_t& pos, size_t s_end) {
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
    auto last_used = uint32_t{0};
    for (auto& seg : module.data_segments) {
        check(seg.offset >= last_used, "segments not ordered");
        last_used += seg.size;
    }
    check(pos == s_end, "data section malformed");
}

inline void read_sec_name(Module& module, size_t& pos, size_t s_end) {
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

inline void read_reloc(Module& module, std::string_view name, size_t& pos,
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

inline void read_linking(Module& module, size_t& pos, size_t s_end) {
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
                printf("    init    [%03d] func priority=%d\n", index,
                       priority);
            }
        } else {
            check(false,
                  "unhandled linking subsection " + std::to_string(type));
        }
    } // while (pos < s_end)
    check(pos == s_end, "linking section malformed");
} // read_linking

inline void prepare_symbols(Module& module) {
    auto& sp = module.symbols["__stack_pointer"];
    sp.is_stack_ptr = true;
    sp.module = &module;
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
            if (name.starts_with("reloc."))
                read_reloc(module, name, pos, s_end);
            else if (name == "linking")
                read_linking(module, pos, s_end);
        }
        pos = s_end;
    } // while (pos != end)

    prepare_symbols(module);
} // read_module

inline void map_function_types(Linked& linked) {
    for (auto& module : linked.modules) {
        module->replacement_function_types.reserve(
            module->function_types.size());
        for (auto& function_type : module->function_types) {
            auto [it, inserted] = linked.function_type_map.insert(
                {function_type, linked.function_types.size()});
            if (inserted)
                linked.function_types.push_back(function_type);
            module->replacement_function_types.push_back(it->second);
        }
    }
}

inline void link_symbols(Linked& linked) {
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
            if (symbol.is_stack_ptr)
                linked_symbol.is_stack_ptr = true;
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

inline void allocate_memory(Linked& linked, uint32_t memory_offset) {
    for (auto& module : linked.modules) {
        module->memory_offset = memory_offset;
        memory_offset = (memory_offset + module->data_size + 15) & -16;
    }
}

inline void allocate_globals(Linked& linked) {
    auto global_offset = uint32_t{0};
    for (auto symbol : linked.unresolved_globals)
        symbol->final_index = global_offset++;
    for (auto& module : linked.modules) {
        module->global_offset = global_offset;
        global_offset += module->globals.size() - module->num_imported_globals;
    }
    for (auto& [key, linked_symbol] : linked.linked_symbols) {
        auto definition = linked_symbol.definition;
        if (!linked_symbol.is_global || !definition)
            continue;
        check(*definition->export_global_index >=
                  definition->module->num_imported_globals,
              "global export malfunction");
        linked_symbol.final_index = *definition->export_global_index -
                                    definition->module->num_imported_globals +
                                    definition->module->global_offset;
    }
    for (auto& module : linked.modules) {
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
        for (; i < module->globals.size(); ++i) {
            module->replacement_addresses[i] =
                module->globals[i].init_u32 + module->memory_offset;
            module->replacement_globals[i] = module->global_offset + i;
        }
    }
} // allocate_globals

inline void allocate_functions(Linked& linked) {
    auto function_offset = uint32_t{0};
    for (auto symbol : linked.unresolved_functions)
        symbol->final_index = function_offset++;
    for (auto& module : linked.modules) {
        module->function_offset = function_offset;
        function_offset +=
            module->functions.size() - module->num_imported_functions;
    }
    for (auto& [key, linked_symbol] : linked.linked_symbols) {
        auto definition = linked_symbol.definition;
        if (!linked_symbol.is_function || !definition)
            continue;
        check(*definition->export_function_index >=
                  definition->module->num_imported_functions,
              "function export malfunction");
        linked_symbol.final_index = *definition->export_function_index -
                                    definition->module->num_imported_functions +
                                    definition->module->function_offset;
    }
    for (auto& module : linked.modules) {
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
            module->replacement_functions[i] = module->function_offset + i;
    }
} // allocate_functions

inline void allocate_elements(Linked& linked) {
    for (auto& module : linked.modules) {
        module->replacement_elements.reserve(module->elements.size());
        for (auto& element : module->elements) {
            auto function_index =
                module->replacement_functions[element.function_index];
            auto [it, inserted] = linked.function_element_map.insert(
                {function_index, linked.elements.size()});
            if (inserted)
                linked.elements.push_back(function_index);
            module->replacement_elements.push_back(it->second);
        }
    }
}

inline void relocate(Module& module) {
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
            check(reloc.index < module.globals.size(),
                  "reloc invalid global index");
            write_leb5(module.binary, section.begin + reloc.offset,
                       module.replacement_globals[reloc.index]);
            break;
        }
        default:
            check(false, "unhandled reloc type " + std::to_string(reloc.type));
        } // switch(type)
    }     // for(reloc)
} // relocate

inline void relocate(Linked& linked) {
    for (auto& module : linked.modules)
        relocate(*module);
}

} // namespace WasmTools
