cmake_minimum_required (VERSION 3.5.1)

set(LLVM_INCLUDE
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

set(LLVM_LIBRARIES
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

set(RUNTIME_METHODS
    addFunction
    addOnExit
    addOnInit
    addOnPostRun
    addOnPreMain
    addOnPreRun
    addRunDependency
    alignFunctionTables
    ALLOC_DYNAMIC
    ALLOC_NONE
    ALLOC_NORMAL
    ALLOC_STACK
    ALLOC_STATIC
    allocate
    allocateUTF8
    AsciiToString
    ccall
    cwrap
    dynamicAlloc
    dynCall
    FS
    FS_createDataFile
    FS_createDevice
    FS_createFolder
    FS_createLazyFile
    FS_createLink
    FS_createPath
    FS_createPreloadedFile
    FS_unlink
    getFunctionTables
    getFuncWrapper
    getMemory
    getValue
    GL
    intArrayFromString
    intArrayToString
    lengthBytesUTF16
    lengthBytesUTF32
    loadDynamicLibrary
    loadWebAssemblyModule
    makeBigInt
    Pointer_stringify
    registerFunctions
    removeFunction
    removeRunDependency
    setValue
    stackTrace
    staticAlloc
    stringToAscii
    stringToUTF16
    stringToUTF32
    stringToUTF8
    stringToUTF8Array
    UTF16ToString
    UTF32ToString
    UTF8ArrayToString
    UTF8ToString
    warnOnce
    writeArrayToMemory
    writeAsciiToMemory
    writeStringToMemory
)
string(REGEX REPLACE "([^;]+);*" "\"\\1\"," RUNTIME_METHODS "${RUNTIME_METHODS}")

IF(EMSCRIPTEN)
    # https://gitlab.kitware.com/cmake/cmake/issues/15826
    # SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s SAFE_HEAP=1 -s DEMANGLE_SUPPORT=1")
ENDIF(EMSCRIPTEN)

add_compile_options(-std=c++2a -fcolor-diagnostics -Wall -Wextra -Wpedantic -Wno-unused-parameter)

add_executable (cib-link cib-link.cpp wasm-tools.cpp)
add_executable (combine-data combine-data.cpp wasm-tools.cpp)
add_executable (clang-format clang-format.cpp)
add_executable (clang clang.cpp)
add_executable (runtime runtime.cpp cxa_new_delete.cpp)

target_compile_options(cib-link PRIVATE -stdlib=libc++)
target_link_libraries(cib-link PRIVATE -stdlib=libc++)

target_compile_options(combine-data PRIVATE -stdlib=libc++)
target_link_libraries(combine-data PRIVATE -stdlib=libc++)

target_include_directories(clang-format PRIVATE ${LLVM_INCLUDE})
target_link_libraries(clang-format PRIVATE ${LLVM_LIBRARIES})

target_include_directories(clang PRIVATE ${LLVM_INCLUDE})
target_link_libraries(clang PRIVATE ${LLVM_LIBRARIES})

IF(EMSCRIPTEN)
    target_link_libraries(clang-format PRIVATE
        "-s MODULARIZE=1"
        #"-s SAFE_HEAP=1"
        #"-s ASSERTIONS=1"
        "-s ALLOW_MEMORY_GROWTH=1"
        #"-s DEMANGLE_SUPPORT=1"
        #"-s NO_EXIT_RUNTIME=1"
        "-s EXPORTED_FUNCTIONS='[\"_main\", \"_formatCode\"]'"
        "-s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"FS\"]'"
    )

    target_compile_options(clang PRIVATE
        -DLIB_PREFIX=/usr/
        -DxFAKE_COMPILE
    )
    target_link_libraries(clang PRIVATE
        "--preload-file usr"
        "--no-heap-copy"
        "-s MODULARIZE=1"
        "-s ALLOW_MEMORY_GROWTH=1"
        #"-s DEMANGLE_SUPPORT=1"
        #"-s NO_EXIT_RUNTIME=1"
        "-s EXPORTED_FUNCTIONS='[\"_main\", \"_compile\"]'"
        "-s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"FS\"]'"
        #"-s ASSERTIONS=2"
        #"-s STACK_OVERFLOW_CHECK=2"
        #"-s FS_LOG=1"
    )

    target_link_libraries(runtime PRIVATE
        "-s MODULARIZE=1"
        "-s ALLOW_MEMORY_GROWTH=1"
        #"-s DEMANGLE_SUPPORT=1"
        #"-s NO_EXIT_RUNTIME=1"
        "-s ASSERTIONS=0"
        "-s MAIN_MODULE=1"
        "-s EXTRA_EXPORTED_RUNTIME_METHODS='[${RUNTIME_METHODS}]'"
    )
ENDIF(EMSCRIPTEN)
