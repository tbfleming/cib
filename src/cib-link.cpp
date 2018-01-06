#include "wasm-tools.h"

using namespace std;
using namespace WasmTools;

int main(int argc, const char* argv[]) {
    try {
        Linked linked;
        for (int i = 2; i < argc; ++i) {
            if (debug_read)
                printf("%d/%d\n", i, argc - 1);
            auto module = make_unique<Module>();
            module->filename = argv[i];
            module->binary = File{argv[i], "rb"}.read();
            try {
                read_module(linked, *module);
            } catch (exception& e) {
                throw std::runtime_error(argv[i] + ": "s + e.what());
            }
            linked.modules.push_back(move(module));
        }
        link(linked);
        File{argv[1], "wb"}.write(linked.binary);
    } catch (exception& e) {
        printf("error: %s\n", e.what());
        return 1;
    }
    return 0;
}
