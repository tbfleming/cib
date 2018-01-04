#include "wasm-tools.h"

using namespace std;
using namespace WasmTools;

auto transform(const vector<uint8_t>& binary) {
    if (binary.size() < 8 || *(uint32_t*)(&binary[0]) != 0x6d736100)
        throw runtime_error("not a wasm file");
    auto new_binary = vector<uint8_t>(binary.begin(), binary.begin() + 8);
    auto pos = size_t{8};
    auto end = binary.size();
    while (pos != end) {
        auto s_begin = pos;
        auto id = binary[pos++];
        auto payload_len = read_leb(binary, pos);
        auto s_end = pos + payload_len;

        if (id == sec_data) {
            auto data = vector<uint8_t>{};
            auto count = read_leb(binary, pos);
            for (uint32_t i = 0; i < count; ++i) {
                check(read_leb(binary, pos) == 0, "data is not for memory 0");
                auto offset = get_init_expr32(binary, pos);
                auto size = read_leb(binary, pos);
                if (data.size() < offset + size)
                    data.resize(offset + size);
                copy(binary.begin() + pos, binary.begin() + pos + size,
                     data.begin() + offset);
                pos += size;
            }
            auto skip = size_t{0};
            while (skip < data.size() && !data[skip])
                ++skip;
            new_binary.push_back(sec_data);
            push_leb5(new_binary, 18 + data.size() - skip); // payload_len
            push_leb5(new_binary, 1);                       // count
            new_binary.push_back(0);                        // index
            new_binary.push_back(0x41);                     // i32.const
            push_leb5(new_binary, skip);                    // offset
            new_binary.push_back(0x0b);                     // end
            push_leb5(new_binary, data.size() - skip);      // size
            new_binary.insert(                              // data
                new_binary.end(), data.begin() + skip, data.end());
        } else {
            new_binary.insert( //
                new_binary.end(), binary.begin() + s_begin,
                binary.begin() + s_end);
            pos = s_end;
        }
    } // while(pos < end)
    return new_binary;
}

int main(int argc, const char* argv[]) {
    try {
        if (argc != 3) {
            printf("Usage: input_file.wasm output_file.wasm\n");
            return 1;
        }
        auto binary = File{argv[1], "rb"}.read();
        auto result = transform(binary);
        File{argv[2], "wb"}.write(result);
    } catch (exception& e) {
        printf("error: %s\n", e.what());
        return 1;
    }
    return 0;
}
