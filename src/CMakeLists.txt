cmake_minimum_required (VERSION 3.5.1)

include_directories(
    ../repos/llvm/include
    ../repos/llvm/tools/clang/include
    ../repos/llvm/tools/clang/lib
    ../repos/llvm/tools/clang/lib/Basic
    ../repos/llvm/tools/clang/lib/Basic/Targets
    ${LLVM_BUILD}include
    ${LLVM_BUILD}tools/clang/include
    ${LLVM_BUILD}lib
)

link_directories(
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
add_executable (runtime runtime.cpp)

IF(EMSCRIPTEN)
    target_link_libraries(clang-format PRIVATE
        "-s MODULARIZE=1"
        "-s ALLOW_MEMORY_GROWTH=1"
        "-s DEMANGLE_SUPPORT=1"
        "-s NO_EXIT_RUNTIME=1"
        "-s EXPORTED_FUNCTIONS='[\"_main\", \"_formatCode\"]'"
        "-s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"FS\"]'"
    )
    target_compile_options(clang PRIVATE
        -DLIB_PREFIX=/usr/
        -DxFAKE_COMPILE
        -s DEMANGLE_SUPPORT=1
    )
    target_link_libraries(clang PRIVATE
        "--preload-file usr"
        "--no-heap-copy"
        "-s MODULARIZE=1"
        "-s ALLOW_MEMORY_GROWTH=1"
        "-s DEMANGLE_SUPPORT=1"
        "-s NO_EXIT_RUNTIME=1"
        "-s EXPORTED_FUNCTIONS='[\"_main\", \"_compile\"]'"
        "-s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"FS\"]'"
    )
    target_link_libraries(runtime PRIVATE
        "-s MODULARIZE=1"
        "-s ALLOW_MEMORY_GROWTH=1"
        "-s DEMANGLE_SUPPORT=1"
        "-s NO_EXIT_RUNTIME=1"
        "-s EXTRA_EXPORTED_RUNTIME_METHODS='[\"FS\"]'"
    )
ENDIF(EMSCRIPTEN)
