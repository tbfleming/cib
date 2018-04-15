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

#include <map>
#include <memory>
#include <optional>
#include <stdexcept>
#include <stdint.h>
#include <string>
#include <string_view>
#include <tuple>
#include <vector>

namespace WasmTools {

using std::operator""s;

static const bool debug_read = false;

inline const uint32_t page_size = 64 * 1024;
inline const uint32_t memory_alignment = 16;
inline const char* const stack_pointer_name = "__stack_pointer";
inline const char* const start_function_name = "__start_function";
inline const char* const memory_name = "__linear_memory";
inline const char* const table_name = "__indirect_function_table";

// emscripten's SP lives at 1024
inline const uint32_t default_memory_offset = 1024 + 16;

// leave a little space for null
inline const uint32_t default_element_offset = 10;

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

inline const uint8_t name_module = 0;
inline const uint8_t name_function = 1;
inline const uint8_t name_local = 2;

inline const uint8_t instr_end = 0x0b;
inline const uint8_t instr_call = 0x10;
inline const uint8_t instr_i32_const = 0x41;

const char* type_str(uint8_t type);

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

void write_i32(std::vector<uint8_t>& binary, size_t pos, uint32_t value);
uint32_t read_leb(const std::vector<uint8_t>& binary, size_t& pos);
void write_leb5(std::vector<uint8_t>& binary, size_t pos, uint32_t value);
void write_sleb5(std::vector<uint8_t>& binary, size_t pos, int32_t value);
void push_leb5(std::vector<uint8_t>& binary, uint32_t value);
std::string_view read_str(const std::vector<uint8_t>& binary, size_t& pos);
void push_str(std::vector<uint8_t>& binary, std::string_view str);
uint32_t get_init_expr32(const std::vector<uint8_t>& binary, size_t& pos);
void push_init_expr32(std::vector<uint8_t>& binary, uint32_t value);

template <typename T> void check(bool cond, const T& msg) {
    if (!cond)
        throw std::runtime_error(msg);
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
    uint8_t mutability{};
    uint32_t init_u32{};
    struct Symbol* import_symbol{};
    bool has_symbols{};
    bool is_memory_address{true};
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
    uint32_t data_begin;
};

struct Reloc {
    uint32_t section_id{};
    uint32_t type{};
    uint32_t offset{};
    uint32_t index{};
    uint32_t addend{};
};

struct InitFunction {
    uint32_t priority{};
    uint32_t index{};
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
    uint32_t code_offset{};
    uint32_t function_offset{};
    std::vector<InitFunction> init_functions{};
    std::vector<uint32_t> replacement_function_types{};
    std::vector<std::optional<uint32_t>> replacement_globals{};
    std::vector<std::optional<uint32_t>> replacement_addresses{};
    std::vector<uint32_t> replacement_functions{};
    std::vector<uint32_t> replacement_elements{};
    bool is_marked{};
};

struct LinkedSymbol {
    std::vector<Symbol*> symbols{};
    Symbol* definition{};
    std::optional<uint32_t> final_index{};
    bool is_global{};
    bool is_function{};
    bool is_marked{};
    bool is_marked_export{};
    bool in_queue{};
};

struct Linked {
    std::vector<std::unique_ptr<Module>> modules{};
    std::vector<uint8_t> binary{};
    std::vector<FunctionType> function_types{};
    std::map<FunctionType, uint32_t> function_type_map{};
    std::map<std::tuple<Module*, std::string_view>, LinkedSymbol>
        linked_symbols{};
    std::vector<LinkedSymbol*> unresolved_functions{};
    std::vector<LinkedSymbol*> unresolved_globals{};
    std::vector<LinkedSymbol*> export_functions{};
    std::vector<LinkedSymbol*> export_globals{};
    uint32_t memory_size{};
    uint32_t element_offset{};
    std::vector<uint32_t> elements{};
    std::map<uint32_t, uint32_t> function_element_map{};
    std::vector<Reloc> code_relocs{};
};

void read_module(Module& module);

void link(Linked& linked, uint32_t memory_offset = default_memory_offset,
          uint32_t element_offset = default_element_offset);

void linkEos(Linked& linked, Module& main_module, uint32_t stack_size);

} // namespace WasmTools
