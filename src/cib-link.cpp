#include "wasm-tools.h"

using namespace std;
using namespace WasmTools;

int main(int argc, const char* argv[]) {
    try {
        for (int i = 1; i < argc; ++i) {
            auto binary = File{argv[1], "rb"}.read();
            auto module = read_module(binary);
        }
    } catch (exception& e) {
        printf("error: %s\n", e.what());
        return 1;
    }
    return 0;
}
