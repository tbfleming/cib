#include <stdexcept>
#include <stdint.h>
#include <stdio.h>
#include <vector>

using namespace std;

static const uint8_t wasm_sec_data = 11;

struct File {
    FILE* file;
    File(const char* name, const char* mode) {
        file = fopen(name, mode);
        if (!file)
            throw runtime_error{("can not open "s + name).c_str()};
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
        auto buffer = vector<uint8_t>(s);
        if (fread(&buffer[0], s, 1, file) != 1)
            throw runtime_error{"Read failed"};
        return buffer;
    }

    void write(const vector<uint8_t>& buffer) {
        if (fwrite(&buffer[0], buffer.size(), 1, file) != 1)
            throw runtime_error{"Write failed"};
    }
};

auto readLeb(const vector<uint8_t>& binary, size_t& pos) {
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

void pushLeb5(vector<uint8_t>& binary, uint32_t value) {
    binary.push_back(((value >> 0) & 0x7f) | 0x80);
    binary.push_back(((value >> 7) & 0x7f) | 0x80);
    binary.push_back(((value >> 14) & 0x7f) | 0x80);
    binary.push_back(((value >> 21) & 0x7f) | 0x80);
    binary.push_back(((value >> 28) & 0x1f) | 0);
}

void check(bool cond, const char* msg) {
    if (!cond)
        throw runtime_error(msg);
}

auto getInitExpr32(const vector<uint8_t>& binary, size_t& pos) {
    check(binary[pos++] == 0x41, "init_expr is not i32.const");
    auto offset = readLeb(binary, pos);
    check(binary[pos++] == 0x0b, "init_expr missing end");
    return offset;
}

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
            pushLeb5(newBinary, 22 + data.size() - skip); // payload_len
            pushLeb5(newBinary, 1);                       // count
            pushLeb5(newBinary, 0);                       // index
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
