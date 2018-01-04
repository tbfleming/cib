#include "wasm-tools.h"

using namespace std;
using namespace WasmTools;

int main(int argc, const char* argv[]) {
    try {
        Linked linked;
        for (int i = 1; i < argc; ++i) {
            printf("%d/%d\n", i, argc);
            auto module = make_unique<Module>();
            module->binary = File{argv[1], "rb"}.read();
            read_module(*module);
            linked.modules.push_back(move(module));
        }
        link_symbols(linked);
    } catch (exception& e) {
        printf("error: %s\n", e.what());
        return 1;
    }
    return 0;
}
