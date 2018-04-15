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

#include <stdio.h>

#include "clang/CodeGen/CodeGenAction.h"
#include "clang/Frontend/CompilerInstance.h"
#include "clang/Frontend/FrontendDiagnostic.h"
#include "clang/Frontend/TextDiagnosticBuffer.h"
#include "clang/Lex/PreprocessorOptions.h"
#include "llvm/Support/TargetSelect.h"

#include "wasm-tools.h"

using namespace llvm;
using namespace clang;
using namespace std::literals;

#define STRX(s) STR(s)
#define STR(s) #s

template <typename T, typename... A> IntrusiveRefCntPtr<T> make_intr(A&&... a) {
    return {new T{std::forward<A>(a)...}};
}

static auto triple = "wasm32-unknown-unknown-wasm";

#ifndef FAKE_COMPILE
extern "C" bool compile(const char* inputFilename, const char* outputFilename,
                        const char* sysDirs) {
    llvm::InitializeAllTargets();
    llvm::InitializeAllTargetMCs();
    llvm::InitializeAllAsmPrinters();
    llvm::InitializeAllAsmParsers();

    auto compiler = std::make_unique<CompilerInstance>();
    compiler->createDiagnostics();

    CompilerInvocation::setLangDefaults(
        compiler->getLangOpts(), InputKind{InputKind::CXX, InputKind::Source},
        Triple{triple}, compiler->getPreprocessorOpts(),
        LangStandard::lang_cxx2a);

    compiler->getFrontendOpts().Inputs.push_back(FrontendInputFile{
        inputFilename, InputKind{InputKind::CXX, InputKind::Source}});
    compiler->getFrontendOpts().OutputFile = outputFilename;

    auto& sOpts = compiler->getHeaderSearchOpts();
    sOpts.UseBuiltinIncludes = false;
    sOpts.UseStandardSystemIncludes = false;
    sOpts.UseStandardCXXIncludes = false;

    while (*sysDirs) {
        auto end = sysDirs;
        while (*end && *end != ':')
            ++end;
        if (sysDirs != end)
            sOpts.AddPath(std::string{sysDirs, end}, frontend::System, false,
                          true);
        if (*end == ':')
            ++end;
        sysDirs = end;
    }

#ifdef EOS_CLANG
    sOpts.AddPath(STRX(LIB_PREFIX) "repos/eos-libcxx/include", frontend::System,
                  false, true);
    sOpts.AddPath(
        STRX(LIB_PREFIX) "repos/emscripten/system/lib/libcxxabi/include",
        frontend::System, false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "src/rtl-eos", frontend::System, false,
                  true);
    sOpts.AddPath(STRX(LIB_PREFIX) "src/rtl-eos/libc", frontend::System, false,
                  true);
    sOpts.AddPath(STRX(LIB_PREFIX) "repos/eos-libcxx/include/support/musl",
                  frontend::System, false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "repos/eos-musl/include", frontend::System,
                  false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "repos/eos-musl/arch/eos", frontend::System,
                  false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "repos/eos-musl/src/internal",
                  frontend::System, false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "download/boost_1_66_0", frontend::System,
                  false, true);
    sOpts.AddPath(STRX(LIB_PREFIX) "repos/magic-get/include", frontend::System,
                  false, true);

    compiler->getPreprocessorOpts().addMacroDef("__EMSCRIPTEN__");
    compiler->getPreprocessorOpts().addMacroDef("_LIBCPP_ABI_VERSION=2");
    compiler->getPreprocessorOpts().addMacroDef("_LIBCPP_HAS_NO_THREADS");
#else
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

    compiler->getPreprocessorOpts().addMacroDef("__EMSCRIPTEN__");
    compiler->getPreprocessorOpts().addMacroDef("__EMSCRIPTEN_major__=1");
    compiler->getPreprocessorOpts().addMacroDef("__EMSCRIPTEN_minor__=37");
    compiler->getPreprocessorOpts().addMacroDef("__EMSCRIPTEN_tiny__=27");
    compiler->getPreprocessorOpts().addMacroDef("_LIBCPP_ABI_VERSION=2");
    compiler->getPreprocessorOpts().addMacroDef("unix");
    compiler->getPreprocessorOpts().addMacroDef("__unix");
    compiler->getPreprocessorOpts().addMacroDef("__unix__");
#endif

    compiler->getCodeGenOpts().CodeModel = "default";
    compiler->getCodeGenOpts().RelocationModel = "static";
    compiler->getCodeGenOpts().ThreadModel = "single";
    compiler->getCodeGenOpts().OptimizationLevel = 2; // -Os
    compiler->getCodeGenOpts().OptimizeSize = 1;      // -Os
    compiler->getLangOpts().Optimize = 1;
    compiler->getLangOpts().OptimizeSize = 1;

    compiler->getLangOpts().DollarIdents = false;
    compiler->getLangOpts().CoroutinesTS = true;
    compiler->getLangOpts().DoubleSquareBracketAttributes = true;
    compiler->getLangOpts().WCharIsSigned = true;
    compiler->getLangOpts().ConceptsTS = true;
    compiler->getLangOpts().MathErrno = false;
    compiler->getLangOpts().Deprecated = true;
    compiler->getLangOpts().setValueVisibilityMode(HiddenVisibility);
    compiler->getLangOpts().setTypeVisibilityMode(HiddenVisibility);

#ifdef EOS_CLANG
    compiler->getLangOpts().RTTI = false;
    compiler->getLangOpts().RTTIData = false;
    compiler->getLangOpts().Exceptions = false;
    compiler->getLangOpts().CXXExceptions = false;
#else
    compiler->getLangOpts().RTTI = true;
    compiler->getLangOpts().RTTIData = true;
    compiler->getLangOpts().Exceptions = true;
    compiler->getLangOpts().CXXExceptions = true;
#endif

    compiler->getTargetOpts().Triple = triple;
    compiler->getTargetOpts().HostTriple = triple;

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

#ifdef EOS_CLANG
extern "C" bool link_wasm(const char* prelinkedFile, const char* linkedFile,
                          uint32_t stackSize) {
    try {
        WasmTools::Linked linked;
        auto archive =
            WasmTools::File{STRX(LIB_PREFIX) "build/rtl-eos/rtl-eos", "rb"}
                .read();
        size_t pos = 0;
        while (pos < archive.size()) {
            auto sv = WasmTools::read_str(archive, pos);
            std::string name{begin(sv), end(sv)};
            auto size = WasmTools::read_leb(archive, pos);
            auto module = make_unique<WasmTools::Module>();
            module->filename = name;
            module->binary.insert(module->binary.end(), archive.begin() + pos,
                                  archive.begin() + pos + size);
            try {
                read_module(*module);
            } catch (std::exception& e) {
                throw std::runtime_error(name + ": "s + e.what());
            }
            linked.modules.push_back(move(module));
            pos += size;
        }

        auto module = make_unique<WasmTools::Module>();
        module->filename = prelinkedFile;
        module->binary = WasmTools::File{prelinkedFile, "rb"}.read();
        try {
            read_module(*module);
        } catch (std::exception& e) {
            throw std::runtime_error(prelinkedFile + ": "s + e.what());
        }
        linked.modules.push_back(move(module));

        linkEos(linked, *linked.modules.back(), stackSize);
        WasmTools::File{linkedFile, "wb"}.write(linked.binary);
        return true;
    } catch (std::exception& e) {
        printf("error: %s\n", e.what());
        return false;
    }
}

int main(int argc, const char* argv[]) {
    if (argc == 4) {
        if (!compile(argv[1], argv[2], ""))
            return 1;
        if (!link_wasm(argv[2], argv[3], 16 * 1024))
            return 1;
    } else if (argc > 1) {
        fprintf(stderr, "Usage: input_file.cpp prelinked.wasm linked.wasm\n");
        return 1;
    }
    return 0;
}

#else
int main(int argc, const char* argv[]) {
    if (argc == 3)
        return !compile(argv[1], argv[2], "");
    if (argc > 1) {
        fprintf(stderr, "Usage: input_file.cpp output_file.wasm\n");
        return 1;
    }
    return 0;
}
#endif
