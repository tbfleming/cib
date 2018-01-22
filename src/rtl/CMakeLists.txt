# Copyright 2017-2018 Todd Fleming
#
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
# FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.

cmake_minimum_required (VERSION 3.5.1)

SET(CMAKE_C_FLAGS
    --target=wasm32-unknown-unknown-wasm
    -c
    -nostdinc
    -Os
    -Werror
    -D__EMSCRIPTEN__ -D__EMSCRIPTEN_major__=1 -D__EMSCRIPTEN_minor__=37
    -D__EMSCRIPTEN_tiny__=27 -D_LIBCPP_ABI_VERSION=2 -Dunix -D__unix -D__unix__
    -isystem ../../repos/emscripten/system/include/libcxx
    -isystem ../../repos/emscripten/system/lib/libcxxabi/include
    -isystem ../../repos/emscripten/system/include/compat
    -isystem ../../repos/emscripten/system/include
    -isystem ../../repos/emscripten/system/include/SSE
    -isystem ../../repos/emscripten/system/include/libc
    -isystem ../../repos/emscripten/system/lib/libc/musl/arch/emscripten
    -isystem ../../repos/emscripten/system/local/include
    -isystem ../../repos/emscripten/system/include/SDL
    -I ../../repos/emscripten/system/lib/libc/musl/src/internal
    -I ../../repos/emscripten/system/lib/libc/musl/arch/js
)
string(REPLACE ";" " " CMAKE_C_FLAGS "${CMAKE_C_FLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_C_FLAGS}")

# blacklist from emscripten/tools/system_libs.py, but with files from
# create_wasm_libc() and create_wasm_libc_rt() removed
set(musl_blacklist
    /aio/ /conf/ /env/ /exit/ /ipc/ /ldso/ /legacy/ /linux/ /mq/ /passwd/ /process/ /sched/ /search/ /setjmp/ /signal/ /thread/ /time/
    /_exit.c /alarm.c /gai_strerror.c /getaddrinfo.c /gethostbyaddr_r.c /gethostbyaddr.c /gethostbyname_r.c /gethostbyname.c
    /gethostbyname2_r.c /gethostbyname2.c /getnameinfo.c /inet_addr.c /proto.c /res_query.c /syscall.c /usleep.c
    /abs.c /ceil.c /ceilf.c /ceill.c /fabs.c /fabsf.c /fabsl.c /floor.c /floorf.c /floorl.c /round.c /roundf.c
    /sqrt.c /sqrtf.c /sqrtl.c
)
string(REPLACE ";" "|" musl_blacklist "${musl_blacklist}")
string(REPLACE "." "\." musl_blacklist "${musl_blacklist}")
#message(STATUS "${musl_blacklist}")

file(GLOB_RECURSE all_musl_sources "../../repos/emscripten/system/lib/libc/musl/*.c")
foreach(file ${all_musl_sources})
    if (${file} MATCHES ${musl_blacklist})
    else()
        #message(STATUS "${file}")
        set(musl_sources "${musl_sources};${file}")
    endif()
endforeach()
#message(STATUS "${musl_sources}")

set(compiler_rt_sources
    addtf3.c ashlti3.c ashrti3.c atomic.c comparetf2.c divtf3.c divti3.c udivmodti4.c extenddftf2.c extendsftf2.c
    fixdfti.c fixsfti.c fixtfdi.c fixtfsi.c fixtfti.c fixunsdfti.c fixunssfti.c fixunstfdi.c fixunstfsi.c
    fixunstfti.c floatditf.c floatsitf.c floattidf.c floattisf.c floatunditf.c floatunsitf.c floatuntidf.c
    floatuntisf.c lshrti3.c modti3.c muldc3.c mulsc3 multf3.c multi3.c subtf3.c udivti3.c umodti3.c ashrdi3.c ashldi3.c fixdfdi.c
    floatdidf.c lshrdi3.c moddi3.c trunctfdf2.c trunctfsf2.c umoddi3.c fixunsdfdi.c muldi3.c divdi3.c divmoddi4.c
    udivdi3.c udivmoddi4.c ../../../../../../llvm/projects/compiler-rt/lib/builtins/clzti2.c
    )
string(REGEX REPLACE "([^;]+)" "../../repos/emscripten/system/lib/compiler-rt/lib/builtins/\\1" compiler_rt_sources "${compiler_rt_sources}")
string(REPLACE " " ";" compiler_rt_sources "${compiler_rt_sources}")
#message(STATUS "${compiler_rt_sources}")

file(GLOB libcxx_sources "../../repos/emscripten/system/lib/libcxx/*.cpp")
set(libcxxabi_sources 
    abort_message.cpp cxa_aux_runtime.cpp cxa_default_handlers.cpp cxa_demangle.cpp cxa_exception_storage.cpp 
    cxa_guard.cpp cxa_handlers.cpp cxa_new_delete.cpp exception.cpp private_typeinfo.cpp stdexcept.cpp typeinfo.cpp
    )
string(REGEX REPLACE "([^;]+)" "../../repos/emscripten/system/lib/libcxxabi/src/\\1" libcxxabi_sources "${libcxxabi_sources}")
string(REPLACE " " ";" libcxxabi_sources "${libcxxabi_sources}")
#message(STATUS "${libcxxabi_sources}")

#set(CMAKE_CXX_LINK_EXECUTABLE "${LLVM_INSTALL}/bin/wasm-ld --allow-undefined --no-entry --import-memory --strip-all --relocatable <OBJECTS> -o <TARGET>")
set(CMAKE_CXX_LINK_EXECUTABLE "../../build/tools/cib-link <TARGET> <OBJECTS>")

add_executable(rtl ../runtime-replacement.cpp)

function(addSource src flags)
    target_sources(rtl PRIVATE ${src})
    set_source_files_properties(${src} PROPERTIES COMPILE_FLAGS "${flags}")
endfunction(addSource)

function(addSources sources flags)
    foreach(src ${sources})
        #message(STATUS "src='${src}'")
        addSource("${src}" "${flags}")
    endforeach()
endfunction(addSources)

addSources("${musl_sources}" "-Wno-return-type -Wno-parentheses -Wno-ignored-attributes -Wno-shift-count-overflow -Wno-shift-negative-value -Wno-dangling-else -Wno-unknown-pragmas -Wno-shift-op-parentheses -Wno-string-plus-int -Wno-logical-op-parentheses -Wno-bitwise-op-parentheses -Wno-visibility -Wno-pointer-sign -Wno-absolute-value -Wno-empty-body")
addSources("${compiler_rt_sources}" "-isystem ../../repos/projects/compiler-rt/lib/")
addSources("${libcxx_sources}" "-std=c++11 -DLIBCXX_BUILDING_LIBCXXABI=1 -D_LIBCPP_BUILDING_LIBRARY")
addSources("${libcxxabi_sources}" "-std=c++11")
addSource(../../repos/emscripten/system/lib/dlmalloc.c "-Wno-tautological-constant-compare")
