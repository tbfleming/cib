#include <stdio.h>

#include "clang/CodeGen/CodeGenAction.h"
#include "clang/Frontend/CompilerInstance.h"
#include "clang/Frontend/FrontendDiagnostic.h"
#include "clang/Frontend/TextDiagnosticBuffer.h"
#include "llvm/Support/TargetSelect.h"

using namespace llvm;
using namespace clang;

#define STRX(s) STR(s)
#define STR(s) #s

template <typename T, typename... A> IntrusiveRefCntPtr<T> make_intr(A&&... a) {
    return {new T{std::forward<A>(a)...}};
}

#ifndef FAKE_COMPILE
extern "C" bool compile(const char* inputFilename, const char* outputFilename) {
    llvm::InitializeAllTargets();
    llvm::InitializeAllTargetMCs();
    llvm::InitializeAllAsmPrinters();
    llvm::InitializeAllAsmParsers();

    auto compiler = std::make_unique<CompilerInstance>();
    compiler->createDiagnostics();

    compiler->getFrontendOpts().Inputs.push_back(FrontendInputFile{
        inputFilename, InputKind{InputKind::CXX, InputKind::Source}});
    compiler->getFrontendOpts().OutputFile = outputFilename;

    auto& sOpts = compiler->getHeaderSearchOpts();
    sOpts.UseBuiltinIncludes = false;
    sOpts.UseStandardSystemIncludes = false;
    sOpts.UseStandardCXXIncludes = false;
    sOpts.AddPath(STRX(LIB_PREFIX) "include", frontend::System, false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "include/libcxx", frontend::System, false,
                  true);
    sOpts.AddPath(STRX(LIB_PREFIX) "include/compat", frontend::System, false,
                  true);
    sOpts.AddPath(STRX(LIB_PREFIX) "include/SSE", frontend::System, false,
                  true);
    sOpts.AddPath(STRX(LIB_PREFIX) "include/libc", frontend::System, false,
                  true);
    sOpts.AddPath(STRX(LIB_PREFIX) "lib/libcxxabi/include", frontend::System,
                  false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "lib/libc/musl/arch/emscripten",
                  frontend::System, false, true);

    compiler->getCodeGenOpts().CodeModel = "default";
    compiler->getCodeGenOpts().RelocationModel = "pic";
    compiler->getCodeGenOpts().ThreadModel = "single";
    compiler->getCodeGenOpts().OptimizationLevel = 2; // -Os
    compiler->getCodeGenOpts().OptimizeSize = 1;      // -Os

    compiler->getTargetOpts().Triple = "wasm32-unknown-unknown-wasm";
    compiler->getTargetOpts().HostTriple = "wasm32-unknown-unknown-wasm";

    auto act = std::make_unique<EmitObjAction>();
    return compiler->ExecuteAction(*act);
}
#endif

#ifdef FAKE_COMPILE
extern "C" bool compile(const char* inputFilename, const char* outputFilename) {
    puts(STRX(LIB_PREFIX) "include");
    printf("in:  %s\n", inputFilename);
    printf("out: %s\n", outputFilename);
    auto f = fopen(inputFilename, "r");
    printf("file: %p\n", f);
    if (f) {
        fseek(f, 0, SEEK_END);
        auto size = ftell(f);
        fseek(f, 0, SEEK_SET);
        auto content = std::make_unique<char[]>(size + 1);
        fread(&content[0], 1, size, f);
        content[size] = 0;
        puts(&content[0]);
        puts("\n");
        fclose(f);
    }
    return true;
}
#endif

int main(int argc, const char* argv[]) {
    if (argc == 3)
        return !compile(argv[1], argv[2]);
    if (argc > 1) {
        fprintf(stderr, "Usage: input_file.cpp output_file.wasm\n");
        return 1;
    }
    return 0;
}
