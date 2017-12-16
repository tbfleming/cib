#include <stdio.h>

#include "clang/CodeGen/CodeGenAction.h"
#include "clang/Frontend/CompilerInstance.h"
#include "clang/Frontend/FrontendDiagnostic.h"
#include "clang/Frontend/TextDiagnosticBuffer.h"
#include "llvm/Support/TargetSelect.h"

using namespace llvm;
using namespace clang;

template <typename T, typename... A> IntrusiveRefCntPtr<T> make_intr(A&&... a) {
    return {new T{std::forward<A>(a)...}};
}

void foo(const char* code) {
    llvm::InitializeAllTargets();
    llvm::InitializeAllTargetMCs();
    llvm::InitializeAllAsmPrinters();
    llvm::InitializeAllAsmParsers();

    auto compiler = std::make_unique<CompilerInstance>();
    compiler->createDiagnostics();

    auto fs = make_intr<vfs::InMemoryFileSystem>();
    fs->addFile("top.cpp", 0, llvm::MemoryBuffer::getMemBuffer(code));
    auto fileMgr = make_intr<FileManager>(compiler->getFileSystemOpts(), fs);
    compiler->setFileManager(&*fileMgr);

    compiler->getFrontendOpts().Inputs.push_back(FrontendInputFile{
        "top.cpp", InputKind{InputKind::CXX, InputKind::Source}});
    compiler->getFrontendOpts().OutputFile = "-";

    compiler->getCodeGenOpts().CodeModel = "default";
    compiler->getCodeGenOpts().RelocationModel = "pic";
    compiler->getCodeGenOpts().ThreadModel = "single";

    compiler->getTargetOpts().Triple = "wasm32-unknown-unknown-wasm";
    compiler->getTargetOpts().HostTriple = "wasm32-unknown-unknown-wasm";

    auto act = std::make_unique<EmitAssemblyAction>();
    auto ok = compiler->ExecuteAction(*act);

    printf("ok = %d\n", ok);
}

auto code = R".(
    void g(int);

    void f() {
        for (int i = 0; i < 10; ++i)
            g(i);
    }
).";

int main() {
    printf("<<<\n");
    foo(code);
    printf(">>>\n");
}
