#include "wasm-tools.h"

using namespace std;
using namespace WasmTools;

int main(int argc, const char* argv[]) {
    try {
        Linked linked;
        for (int i = 1; i < argc; ++i) {
            if (debug_read)
                printf("%d/%d\n", i, argc - 1);
            auto module = make_unique<Module>();
            module->filename = argv[i];
            module->binary = File{argv[i], "rb"}.read();
            try {
                read_module(*module);
            } catch (exception& e) {
                throw std::runtime_error(argv[i] + ": "s + e.what());
            }
            linked.modules.push_back(move(module));
        }
        map_function_types(linked);
        link_symbols(linked);
        allocate_memory(linked, 2048);
        allocate_globals(linked);
        allocate_functions(linked);
        allocate_elements(linked);
        relocate(linked);
    } catch (exception& e) {
        printf("error: %s\n", e.what());
        return 1;
    }
    return 0;
}
