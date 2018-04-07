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

cmake_minimum_required (VERSION 3.11.0)

SET(CMAKE_C_FLAGS
    --target=wasm32-unknown-unknown-wasm
    -c
    -nostdinc
    -Os
    -Werror
    -fno-exceptions
    -D__EMSCRIPTEN__ 
    -D_LIBCPP_ABI_VERSION=2
    -D_LIBCPP_HAS_NO_THREADS
    -isystem ../../repos/eos-libcxx/include
    -isystem ../../repos/emscripten/system/lib/libcxxabi/include
    -isystem ${CMAKE_CURRENT_SOURCE_DIR}
    -isystem ${CMAKE_CURRENT_SOURCE_DIR}/libc
    -isystem ../../repos/eos-libcxx/include/support/musl
    -isystem ../../repos/eos-musl/include
    -isystem ../../repos/eos-musl/arch/eos
    -isystem ../../repos/eos-musl/src/internal
    -isystem ../../download/boost_1_66_0
    -isystem ../../repos/magic-get/include
)

string(REPLACE ";" " " CMAKE_C_FLAGS "${CMAKE_C_FLAGS}")
set(CMAKE_CXX_FLAGS "${CMAKE_C_FLAGS} -fno-cxx-exceptions -fno-rtti")

set(musl_blacklist
    /aio/ /compat-emscripten/ /complex/ /conf/ /dirent/ /fcntl/ /fenv/ /ipc/ /ldso/ /legacy/
    /linux/ /mman/ /mq/ /network/ /passwd/ /prng/ /process/ /regex/ /sched/ /select/ /setjmp/
    /signal/ /stat/ /temp/ /termios/ /unistd/     
    /procfdname.c /syscall.c /syscall_ret.c /vdso.c /version.c /fopencookie.c
)
string(REPLACE ";" "|" musl_blacklist "${musl_blacklist}")
string(REPLACE "." "\." musl_blacklist "${musl_blacklist}")
#message(STATUS "${musl_blacklist}")

file(GLOB_RECURSE all_musl_sources "../../repos/eos-musl/src/*.c")
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

file(GLOB all_libcxx_sources "../../repos/eos-libcxx/src/*.cpp")
foreach(file ${all_libcxx_sources})
    if (${file} MATCHES thread|mutex|random|system_error|ios\.cpp|iostream|strstream|locale)
    else()
        #message(STATUS "${file}")
        set(libcxx_sources "${libcxx_sources};${file}")
    endif()
endforeach()
#message(STATUS "${libcxx_sources}")

set(libcxxabi_sources 
    abort_message.cpp
    cxa_demangle.cpp
    cxa_guard.cpp 
    cxa_virtual.cpp 
    )
string(REGEX REPLACE "([^;]+)" "../../repos/emscripten/system/lib/libcxxabi/src/\\1" libcxxabi_sources "${libcxxabi_sources}")
string(REPLACE " " ";" libcxxabi_sources "${libcxxabi_sources}")
#message(STATUS "${libcxxabi_sources}")

set(CMAKE_CXX_LINK_EXECUTABLE "../../build/tools/cib-ar <TARGET> <OBJECTS>")

add_executable(rtl-eos)

function(addSource src flags)
    target_sources(rtl-eos PRIVATE ${src})
    set_source_files_properties(${src} PROPERTIES COMPILE_FLAGS "${flags}")
endfunction(addSource)

function(addSources sources flags)
    foreach(src ${sources})
        #message(STATUS "src='${src}'")
        addSource("${src}" "${flags}")
    endforeach()
endfunction(addSources)

addSources("${musl_sources}" "-D_INTERNAL_SYSCALL_H -Wno-format -Wno-tautological-unsigned-zero-compare -Wno-tautological-constant-out-of-range-compare -Wno-return-type -Wno-parentheses -Wno-ignored-attributes -Wno-shift-count-overflow -Wno-shift-negative-value -Wno-dangling-else -Wno-unknown-pragmas -Wno-shift-op-parentheses -Wno-string-plus-int -Wno-logical-op-parentheses -Wno-bitwise-op-parentheses -Wno-visibility -Wno-pointer-sign -Wno-absolute-value -Wno-empty-body")
addSources("../../repos/emscripten/system/lib/libc/musl/src/stdlib/strtod.c" "")
addSources("../../repos/emscripten/system/lib/libc/musl/src/stdlib/wcstod.c" "")
addSources("${compiler_rt_sources}" "-Wno-shift-count-overflow")
addSources("${libcxx_sources}" "-std=c++17 -Wno-error -D_LIBCPP_BUILDING_LIBRARY -Wno-tautological-constant-compare")
addSources("${libcxxabi_sources}" "-std=c++17 -DLIBCXX_BUILDING_LIBCXXABI=1")
addSources("terminate.cpp" "-std=c++17")
addSources("../../repos/eos/contracts/eosiolib/eosiolib.cpp" "-std=c++17 -Wno-pointer-bool-conversion")
