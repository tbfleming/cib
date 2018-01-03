#include <stdexcept>
#include <stdint.h>
#include <stdio.h>
#include <string>
#include <string_view>
#include <vector>

namespace WasmTools {

using std::operator""s;

inline const uint8_t wasm_sec_custom = 0;
inline const uint8_t wasm_sec_type = 1;
inline const uint8_t wasm_sec_import = 2;
inline const uint8_t wasm_sec_function = 3;
inline const uint8_t wasm_sec_table = 4;
inline const uint8_t wasm_sec_memory = 5;
inline const uint8_t wasm_sec_global = 6;
inline const uint8_t wasm_sec_export = 7;
inline const uint8_t wasm_sec_start = 8;
inline const uint8_t wasm_sec_elem = 9;
inline const uint8_t wasm_sec_code = 10;
inline const uint8_t wasm_sec_data = 11;
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

inline auto readLeb(const std::vector<uint8_t>& binary, size_t& pos) {
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

inline void pushLeb5(std::vector<uint8_t>& binary, uint32_t value) {
    binary.push_back(((value >> 0) & 0x7f) | 0x80);
    binary.push_back(((value >> 7) & 0x7f) | 0x80);
    binary.push_back(((value >> 14) & 0x7f) | 0x80);
    binary.push_back(((value >> 21) & 0x7f) | 0x80);
    binary.push_back(((value >> 28) & 0x1f) | 0);
}

inline std::string_view readStr(const std::vector<uint8_t>& binary,
                                size_t& pos) {
    auto len = readLeb(binary, pos);
    auto str = std::string_view{(char*)&binary[0] + pos, len};
    pos += len;
    return str;
}

template <typename T> void check(bool cond, const T& msg) {
    if (!cond)
        throw std::runtime_error(msg);
}

inline auto getInitExpr32(const std::vector<uint8_t>& binary, size_t& pos) {
    check(binary[pos++] == 0x41, "init_expr is not i32.const");
    auto offset = readLeb(binary, pos);
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

struct FunctionType {
    std::vector<uint8_t> argTypes{};
    std::vector<uint8_t> returnTypes{};
};

struct Function {
    uint32_t type{};
    std::string_view name{};
};

struct ResizableLimits {
    bool valid{};
    bool max_present{};
    uint32_t initial{};
    uint32_t maximum{};
};

struct Global {
    uint8_t type{};
    uint32_t initU32{};
};

struct Module {
    Section sections[num_sections];
    CustomSection linking{};
    std::vector<CustomSection> reloc{};

    std::vector<ResizableLimits> tables{};
    std::vector<ResizableLimits> memories{};
    uint32_t numImportedGlobals{};
    std::vector<Global> globals{};
    std::vector<FunctionType> functionTypes{};
    uint32_t numImportedFunctions{};
    std::vector<Function> functions{};
};

inline ResizableLimits read_resizable_limits(const std::vector<uint8_t>& binary,
                                             size_t& pos) {
    auto max_present = !!(binary[pos++] & 1);
    auto initial = readLeb(binary, pos);
    uint32_t maximum{};
    if (max_present)
        maximum = readLeb(binary, pos);
    return {true, max_present, initial, maximum};
}

inline void read_sec_type(Module& module, const std::vector<uint8_t>& binary,
                          size_t& pos, size_t sEnd) {
    printf("type\n");
    auto count = readLeb(binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        FunctionType functionType;
        check(binary[pos++] == type_func, "invalid form in type");
        printf("    [%03d] type (", i);
        auto param_count = readLeb(binary, pos);
        for (uint32_t j = 0; j < param_count; ++j) {
            functionType.argTypes.push_back(binary[pos++]);
            printf("%s ", type_str(functionType.argTypes.back()));
        }
        printf(") ==> (");
        auto return_count = readLeb(binary, pos);
        for (uint32_t j = 0; j < return_count; ++j) {
            functionType.returnTypes.push_back(binary[pos++]);
            printf("%s ", type_str(functionType.returnTypes.back()));
        }
        check(functionType.returnTypes.size() <= 1, "multiple return types");
        printf(")\n");
        module.functionTypes.push_back(std::move(functionType));
    }
}

inline void read_sec_import(Module& module, const std::vector<uint8_t>& binary,
                            size_t& pos, size_t sEnd) {
    printf("import\n");
    auto count = readLeb(binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        auto moduleName = readStr(binary, pos);
        auto fieldName = readStr(binary, pos);
        auto kind = binary[pos++];
        switch (kind) {
        case external_function: {
            auto type = readLeb(binary, pos);
            check(type < module.functionTypes.size(),
                  "function type doesn't exist");
            printf("    [%03zu] func   %s.%s type %d\n",
                   module.functions.size(), std::string{moduleName}.c_str(),
                   std::string{fieldName}.c_str(), type);
            ++module.numImportedFunctions;
            module.functions.push_back({type});
            break;
        }
        case external_table: {
            check(binary[pos++] == type_anyfunc, "import table is not anyfunc");
            check(!module.tables.size(), "multiple tables");
            auto limits = read_resizable_limits(binary, pos);
            printf("    [000] table  %s.%s max_present:%u initial:%u max:%u\n",
                   std::string{moduleName}.c_str(),
                   std::string{fieldName}.c_str(), limits.max_present,
                   limits.initial, limits.maximum);
            module.tables.push_back(limits);
            break;
        }
        case external_memory: {
            check(!module.memories.size(), "multiple memories");
            auto limits = read_resizable_limits(binary, pos);
            printf("    [000] memory %s.%s max_present:%u initial:%u max:%u\n",
                   std::string{moduleName}.c_str(),
                   std::string{fieldName}.c_str(), limits.max_present,
                   limits.initial, limits.maximum);
            module.memories.push_back(limits);
            break;
        }
        case external_global: {
            auto value_type = binary[pos++];
            if (value_type != type_i32 && value_type != type_i64 &&
                value_type != type_f32 && value_type != type_f64)
                check(false, "invalid external value_type " +
                                 std::to_string(value_type));
            auto mutability = binary[pos++];
            printf("    [%03zu] global %s.%s %s %s\n", module.globals.size(),
                   std::string{moduleName}.c_str(),
                   std::string{fieldName}.c_str(), type_str(value_type),
                   mutability ? "mut" : "");
            ++module.numImportedGlobals;
            module.globals.push_back({value_type});
            break;
        }
        default:
            check(false, "unknown import kind");
        }
    }
    check(pos == sEnd, "import section malformed");
} // read_sec_import

inline void read_sec_function(Module& module,
                              const std::vector<uint8_t>& binary, size_t& pos,
                              size_t sEnd) {
    printf("function\n");
    auto count = readLeb(binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        auto type = readLeb(binary, pos);
        check(type < module.functionTypes.size(),
              "function type doesn't exist");
        printf("    [%03zu] func type=%d\n", module.functions.size(), type);
        module.functions.push_back({type});
    }
    check(pos == sEnd, "function section malformed");
} // read_sec_function

inline void read_sec_table(Module& module, const std::vector<uint8_t>& binary,
                           size_t& pos, size_t sEnd) {
    check(binary[pos++] == type_anyfunc, "import table is not anyfunc");
    check(!module.tables.size(), "multiple tables");
    auto limits = read_resizable_limits(binary, pos);
    printf("    [000] table  max_present:%u initial:%u max:%u\n",
           limits.max_present, limits.initial, limits.maximum);
    module.tables.push_back(limits);
    check(pos == sEnd, "table section malformed");
}

inline void read_sec_memory(Module& module, const std::vector<uint8_t>& binary,
                            size_t& pos, size_t sEnd) {
    check(!module.memories.size(), "multiple memories");
    auto limits = read_resizable_limits(binary, pos);
    printf("    [000] memory max_present:%u initial:%u max:%u\n",
           limits.max_present, limits.initial, limits.maximum);
    module.memories.push_back(limits);
    check(pos == sEnd, "memory section malformed");
}

inline void read_sec_global(Module& module, const std::vector<uint8_t>& binary,
                            size_t& pos, size_t sEnd) {
    printf("global\n");
    auto count = readLeb(binary, pos);
    for (uint32_t i = 0; i < count; ++i) {
        auto value_type = binary[pos++];
        if (value_type != type_i32 && value_type != type_i64 &&
            value_type != type_f32 && value_type != type_f64)
            check(false,
                  "invalid global value_type " + std::to_string(value_type));
        auto mutability = binary[pos++];
        auto initU32 = getInitExpr32(binary, pos);
        printf("    [%03zu] global %s %s = %u\n", module.globals.size(),
               type_str(value_type), mutability ? "mut" : "", initU32);
        module.globals.push_back({value_type, initU32});
    }
    check(pos == sEnd, "global section malformed");
}

inline void read_sec_export(Module&, const std::vector<uint8_t>& binary,
                            size_t& pos, size_t sEnd) {}
inline void read_sec_start(Module&, const std::vector<uint8_t>& binary,
                           size_t& pos, size_t sEnd) {}
inline void read_sec_elem(Module&, const std::vector<uint8_t>& binary,
                          size_t& pos, size_t sEnd) {}
inline void read_sec_code(Module&, const std::vector<uint8_t>& binary,
                          size_t& pos, size_t sEnd) {}
inline void read_sec_data(Module&, const std::vector<uint8_t>& binary,
                          size_t& pos, size_t sEnd) {}

inline void read_sec_name(Module& module, const std::vector<uint8_t>& binary,
                          size_t& pos, size_t sEnd) {
    while (pos < sEnd) {
        auto type = binary[pos++];
        auto subLen = readLeb(binary, pos);
        auto subEnd = pos + subLen;
        printf("    type %d\n", type);
        if (type == name_function) {
            auto count = readLeb(binary, pos);
            for (uint32_t i = 0; i < count; ++i) {
                auto index = readLeb(binary, pos);
                auto name = readStr(binary, pos);
                printf("        %d %s\n", index, std::string{name}.c_str());
                check(index < module.functions.size(),
                      "invalid function index in name");
                module.functions[index].name = name;
            }
        } else {
            pos = subEnd;
        }
    }
    check(pos == sEnd, "name section malformed");
}

inline Module read_module(const std::vector<uint8_t>& binary) {
    auto module = Module{};
    check(binary.size() >= 8 && *(uint32_t*)(&binary[0]) == 0x6d736100,
          "not a wasm file");
    auto pos = size_t{8};
    auto end = binary.size();
    while (pos != end) {
        auto id = binary[pos++];
        check(id < num_sections, "invalid section id");
        auto payloadLen = readLeb(binary, pos);
        auto sEnd = pos + payloadLen;
        check(sEnd <= binary.size(), "section extends past file end");
        if (id) {
            module.sections[id] = {true, pos, sEnd};
            switch (id) {
            case wasm_sec_type:
                read_sec_type(module, binary, pos, sEnd);
                break;
            case wasm_sec_import:
                read_sec_import(module, binary, pos, sEnd);
                break;
            case wasm_sec_function:
                read_sec_function(module, binary, pos, sEnd);
                break;
            case wasm_sec_table:
                read_sec_table(module, binary, pos, sEnd);
                break;
            case wasm_sec_memory:
                read_sec_memory(module, binary, pos, sEnd);
                break;
            case wasm_sec_global:
                read_sec_global(module, binary, pos, sEnd);
                break;
            case wasm_sec_export:
                read_sec_export(module, binary, pos, sEnd);
                break;
            case wasm_sec_start:
                read_sec_start(module, binary, pos, sEnd);
                break;
            case wasm_sec_elem:
                read_sec_elem(module, binary, pos, sEnd);
                break;
            case wasm_sec_code:
                read_sec_code(module, binary, pos, sEnd);
                break;
            case wasm_sec_data:
                read_sec_data(module, binary, pos, sEnd);
                break;
            default:
                check(false, "unknown section id");
            }
        } else {
            auto name = readStr(binary, pos);
            printf("%s\n", std::string{name}.c_str());
            if (name == "name") {
                read_sec_name(module, binary, pos, sEnd);
            } else if (name == "linking")
                module.linking = CustomSection{true, name, pos, sEnd};
            else if (name.starts_with("reloc."))
                module.reloc.push_back(CustomSection{true, name, pos, sEnd});
        }
        pos = sEnd;
    }
    return module;
} // read_module

} // namespace WasmTools
