#include "wasm-tools.h"

using namespace std;
using namespace WasmTools;

auto transform(const vector<uint8_t>& binary) {
    if (binary.size() < 8 || *(uint32_t*)(&binary[0]) != 0x6d736100)
        throw runtime_error("not a wasm file");
    auto newBinary = vector<uint8_t>(binary.begin(), binary.begin() + 8);
    auto pos = size_t{8};
    auto end = binary.size();
    while (pos != end) {
        auto sBegin = pos;
        auto id = binary[pos++];
        auto payloadLen = readLeb(binary, pos);
        auto sEnd = pos + payloadLen;

        if (id == wasm_sec_data) {
            auto data = vector<uint8_t>{};
            auto count = readLeb(binary, pos);
            for (uint32_t i = 0; i < count; ++i) {
                check(readLeb(binary, pos) == 0, "data is not for memory 0");
                auto offset = getInitExpr32(binary, pos);
                auto size = readLeb(binary, pos);
                if (data.size() < offset + size)
                    data.resize(offset + size);
                copy(binary.begin() + pos, binary.begin() + pos + size,
                     data.begin() + offset);
                pos += size;
            }
            auto skip = size_t{0};
            while (skip < data.size() && !data[skip])
                ++skip;
            newBinary.push_back(wasm_sec_data);
            pushLeb5(newBinary, 18 + data.size() - skip); // payload_len
            pushLeb5(newBinary, 1);                       // count
            newBinary.push_back(0);                       // index
            newBinary.push_back(0x41);                    // i32.const
            pushLeb5(newBinary, skip);                    // offset
            newBinary.push_back(0x0b);                    // end
            pushLeb5(newBinary, data.size() - skip);      // size
            newBinary.insert(                             // data
                newBinary.end(), data.begin() + skip, data.end());
        } else {
            newBinary.insert( //
                newBinary.end(), binary.begin() + sBegin,
                binary.begin() + sEnd);
            pos = sEnd;
        }
    } // while(pos < end)
    return newBinary;
}

int main(int argc, const char* argv[]) {
    try {
        if (argc != 3) {
            printf("Usage: input_file.wasm output_file.wasm\n");
            return 1;
        }
        auto binary = File{argv[1], "rb"}.read();
        auto result = transform(binary);
        File{argv[2], "w"}.write(result);
    } catch (exception& e) {
        printf("error: %s\n", e.what());
        return 1;
    }
    return 0;
}
