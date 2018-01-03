#include <stdexcept>
#include <stdint.h>
#include <stdio.h>
#include <string>
#include<string_view>
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

inline std::string_view getStr(const std::vector<uint8_t>& binary, size_t& pos) {
    auto len = readLeb(binary, pos);
    auto str = std::string_view{(char*)&binary[0]+pos, len};
    pos += len;
    return str;
}

inline void check(bool cond, const char* msg) {
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

struct Sections {
    Section sections[num_sections];
    CustomSection name;
    CustomSection linking;
    std::vector<CustomSection> reloc;
};

inline Sections getSections(const std::vector<uint8_t>& binary) {
    auto result = Sections{};
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
        if (id)
            result.sections[id] = {true, pos, sEnd};
        else {
            auto name = getStr(binary, pos);
            if(name=="name")
                result.name = CustomSection{true, name, pos, sEnd};
            else if(name == "linking")
                result.linking = CustomSection{true, name, pos, sEnd};
            else if(name.starts_with("reloc."))
                result.reloc.push_back(CustomSection{true, name, pos, sEnd});
        }
        pos = sEnd;
    }
    return result;
}

} // namespace WasmTools
