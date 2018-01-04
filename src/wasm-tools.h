#include <map>
#include <optional>
#include <stdexcept>
#include <stdint.h>
#include <stdio.h>
#include <string>
#include <string_view>
#include <vector>

namespace WasmTools {

using std::operator""s;

inline const bool debug_read = true;

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
inline const uint8_t link_data_alignment = 0x4;
inline const uint8_t link_segment_info = 0x5;

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

struct CustomSection {
    bool valid{};
    std::string_view name{};
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

struct Function {
    uint32_t type{};
};

struct ResizableLimits {
    bool valid{};
    bool max_present{};
    uint32_t initial{};
    uint32_t maximum{};
};

struct Global {
    bool is_stack{};
    uint32_t init_u32{};
};

struct Export {
    std::string_view name{};
    uint8_t kind{};
    uint32_t index{};
};

struct Element {
    bool valid{};
    uint32_t fIndex{};
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
    uint32_t flags{};
    std::optional<uint32_t> imports{};
    std::optional<uint32_t> exports{};
    bool in_linking{};
};

struct Module {
    std::vector<uint8_t> binary;
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
        if (symbol.imports)
            check(false,
                  "symbol " + std::string{name} + " has multiple imports");
        symbol.imports = module.imports.size();
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
            add(field_name, kind, module.globals,
                Global{field_name == "__stack_pointer"});
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
        module.functions.push_back({type});
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
        module.globals.push_back({false, init_u32});
    }
    check(pos == s_end, "global section malformed");
}

inline void read_sec_export(Module& module, size_t& pos, size_t s_end) {
    if (debug_read)
        printf("export\n");
    auto add = [&](auto name, auto kind, auto index) {
        auto& symbol = module.symbols[name];
        if (symbol.exports)
            check(false,
                  "symbol " + std::string{name} + " has multiple exports");
        symbol.exports = module.exports.size();
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
            auto fIndex = read_leb(module.binary, pos);
            check(fIndex < module.functions.size(),
                  "elem has invalid function index");
            if (debug_read)
                printf("    [%03u] = [%03u] func\n", eIndex, fIndex);
            if (eIndex >= module.elements.size())
                module.elements.resize(eIndex + 1);
            module.elements[eIndex] = {Element{true, fIndex}};
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
        check(seg.offset == last_used, "segments not contiguous");
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
        } else {
            check(false,
                  "unhandled linking subsection " + std::to_string(type));
        }
    }
    check(pos == s_end, "linking section malformed");
    for (auto& [name, symbol] : module.symbols)
        if (!symbol.in_linking && symbol.exports)
            check(false, "symbol " + std::string{name} +
                             " is exported, but not in linking section");
}

inline Module read_module(std::vector<uint8_t> bin) {
    auto module = Module{std::move(bin)};
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
    }
    return module;
} // read_module

} // namespace WasmTools
