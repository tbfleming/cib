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

using namespace llvm;
using namespace clang;

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
    compiler->getLangOpts().RTTI = true;
    compiler->getLangOpts().RTTIData = true;
    compiler->getLangOpts().Exceptions = true;
    compiler->getLangOpts().CXXExceptions = true;

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

int main(int argc, const char* argv[]) {
    if (argc == 3)
        return !compile(argv[1], argv[2], "");
    if (argc > 1) {
        fprintf(stderr, "Usage: input_file.cpp output_file.wasm\n");
        return 1;
    }
    return 0;
}
