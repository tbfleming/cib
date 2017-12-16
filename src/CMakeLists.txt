cmake_minimum_required (VERSION 3.5.1)

include_directories(BEFORE
    ../repos/llvm/include
    ../repos/llvm/tools/clang/include
    ../repos/llvm/tools/clang/lib
    ../repos/llvm/tools/clang/lib/Basic
    ../repos/llvm/tools/clang/lib/Basic/Targets
    ${LLVM_BUILD}include
    ${LLVM_BUILD}tools/clang/include
    ${LLVM_BUILD}lib
)

link_directories(BEFORE
    ${LLVM_BUILD}lib
)

link_libraries(
    clangFormat
    clangRewrite
    clangToolingCore
    clangCodeGen
    clangFrontend
    clangDriver
    clangParse
    clangSerialization
    clangSema
    clangEdit
    clangAnalysis
    clangAST
    clangLex
    clangBasic
    LLVMWebAssemblyCodeGen
    LLVMWebAssemblyDesc
    LLVMWebAssemblyInfo
    LLVMGlobalISel
    LLVMWebAssemblyAsmPrinter
    LLVMAsmPrinter
    LLVMDebugInfoCodeView
    LLVMSelectionDAG
    LLVMMCDisassembler
    LLVMCoroutines
    LLVMCoverage
    LLVMLTO
    LLVMObjCARCOpts
    LLVMPasses
    LLVMCodeGen
    LLVMTarget
    LLVMipo
    LLVMBitWriter
    LLVMIRReader
    LLVMAsmParser
    LLVMLinker
    LLVMInstrumentation
    LLVMScalarOpts
    LLVMInstCombine
    LLVMVectorize
    LLVMTransformUtils
    LLVMAnalysis
    LLVMObject
    LLVMOption
    LLVMProfileData
    LLVMMCParser
    LLVMBitReader
    LLVMCore
    LLVMBinaryFormat
    LLVMMC
    LLVMSupport
)

add_compile_options(-std=c++17)

add_executable (clang-format clang-format.cpp)
add_executable (clang clang.cpp)
