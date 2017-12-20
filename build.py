#!/usr/bin/env python3

import argparse, os, subprocess, sys

llvmBuildType = 'Release'
llvmNo86BuildType = 'Release'
llvmBrowserBuildType = 'Release'
binaryenBuildType = 'Release'
appBuildType = 'Debug'

root = os.path.dirname(os.path.abspath(__file__)) + '/'
llvmBuild = root + 'build/llvm-' + llvmBuildType + '/'
llvmInstall = root + 'install/llvm-' + llvmBuildType + '/'
llvmNo86Build = root + 'build/llvm-no86-' + llvmNo86BuildType + '/'
llvmNo86Install = root + 'install/llvm-no86-' + llvmNo86BuildType + '/'
llvmBrowserBuild = root + 'build/llvm-browser-' + llvmBrowserBuildType + '/'
llvmBrowserInstall = root + 'install/llvm-browser-' + llvmBrowserBuildType + '/'
binaryenBuild = root + 'build/binaryen-' + binaryenBuildType + '/'
binaryenInstall = root + 'install/binaryen-' + binaryenBuildType + '/'
wabtInstall = root + 'repos/wabt/bin/'

llvmBrowserTargets = [
    'clangAnalysis',
    'clangAST',
    'clangBasic',
    'clangCodeGen',
    'clangDriver',
    'clangEdit',
    'clangFormat',
    'clangFrontend',
    'clangLex',
    'clangParse',
    'clangRewrite',
    'clangSema',
    'clangSerialization',
    'clangToolingCore',
    'LLVMAnalysis',
    'LLVMAsmParser',
    'LLVMAsmPrinter',
    'LLVMBinaryFormat',
    'LLVMBitReader',
    'LLVMBitWriter',
    'LLVMCodeGen',
    'LLVMCore',
    'LLVMCoroutines',
    'LLVMCoverage',
    'LLVMDebugInfoCodeView',
    'LLVMGlobalISel',
    'LLVMInstCombine',
    'LLVMInstrumentation',
    'LLVMipo',
    'LLVMIRReader',
    'LLVMLinker',
    'LLVMLTO',
    'LLVMMC',
    'LLVMMCDisassembler',
    'LLVMMCParser',
    'LLVMObjCARCOpts',
    'LLVMObject',
    'LLVMOption',
    'LLVMPasses',
    'LLVMProfileData',
    'LLVMScalarOpts',
    'LLVMSelectionDAG',
    'LLVMSupport',
    'LLVMTarget',
    'LLVMTransformUtils',
    'LLVMVectorize',
    'LLVMWebAssemblyAsmPrinter',
    'LLVMWebAssemblyCodeGen',
    'LLVMWebAssemblyDesc',
    'LLVMWebAssemblyInfo',
]

parallel = '-j ' + subprocess.check_output("grep 'processor' /proc/cpuinfo | wc -l", shell=True).decode('utf-8').strip()

os.environ["PATH"] = os.pathsep.join([
    root + 'repos/emscripten',
    llvmInstall + 'bin',
    wabtInstall,
    binaryenInstall + 'bin',
    os.environ["PATH"],
])

def run(args):
    print('build.py:', args)
    if subprocess.call(args, shell=True):
        print('build.py: exiting because of error')
        sys.exit()

repos = [
    ('repos/llvm', 'git@github.com:tbfleming/cib-llvm.git'),
    ('repos/llvm/tools/clang', 'git@github.com:tbfleming/cib-clang.git'),
    ('repos/llvm/tools/lld', 'git@github.com:tbfleming/cib-lld.git'),
    ('repos/emscripten', 'git@github.com:tbfleming/cib-emscripten.git'),
    ('repos/wabt', 'git@github.com:WebAssembly/wabt.git'),
    ('repos/binaryen', 'git@github.com:tbfleming/cib-binaryen.git'),
]

def clone():
    for (path, url) in repos:
        if os.path.isdir(path):
            continue
        dir = os.path.dirname(path)
        base = os.path.basename(path)
        run('mkdir -p ' + dir)
        run('cd ' + dir + ' && git clone ' + url + ' ' + base)

def llvm():
    if not os.path.isdir(llvmBuild):
        run('mkdir -p ' + llvmBuild)
        run('cd ' + llvmBuild + ' && time -p cmake -G "Ninja"' +
            ' -DCMAKE_INSTALL_PREFIX=' + llvmInstall +
            ' -DCMAKE_BUILD_TYPE=' + llvmBuildType +
            ' -DLLVM_TARGETS_TO_BUILD=X86' +
            ' -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly' +
            ' ' + root + 'repos/llvm')
    run('cd ' + llvmBuild + ' && time -p ninja')
    if not os.path.isdir(llvmInstall):
        run('mkdir -p ' + llvmInstall)
        run('cd ' + llvmBuild + ' && time -p ninja ' + parallel + ' install')

def llvmNo86():
    if not os.path.isdir(llvmNo86Build):
        run('mkdir -p ' + llvmNo86Build)
        run('cd ' + llvmNo86Build + ' && time -p cmake -G "Ninja"' +
            ' -DCMAKE_INSTALL_PREFIX=' + llvmNo86Install +
            ' -DCMAKE_BUILD_TYPE=' + llvmNo86BuildType +
            ' -DLLVM_TARGETS_TO_BUILD=' +
            ' -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly' +
            ' ' + root + 'repos/llvm')
    run('cd ' + llvmNo86Build + ' && time -p ninja')
    if not os.path.isdir(llvmNo86Install):
        run('mkdir -p ' + llvmNo86Install)
        run('cd ' + llvmNo86Build + ' && time -p ninja ' + parallel + ' install')

def wabt():
    if not os.path.isdir(wabtInstall):
        run('cd repos/wabt && time make clang-release-no-tests ' + parallel)

def binaryen():
    if not os.path.isdir(binaryenBuild):
        run('mkdir -p ' + binaryenBuild)
        run('cd ' + binaryenBuild + ' && time -p cmake -G "Ninja"' +
            ' -DCMAKE_INSTALL_PREFIX=' + binaryenInstall +
            ' -DCMAKE_BUILD_TYPE=' + binaryenBuildType +
            ' ' + root + 'repos/binaryen')
    run('cd ' + binaryenBuild + ' && time -p ninja')
    if not os.path.isdir(binaryenInstall):
        run('mkdir -p ' + binaryenInstall)
        run('cd ' + binaryenBuild + ' && time -p ninja ' + parallel + ' install')

def emscripten():
    if not os.path.exists(os.path.expanduser('~') + '/.emscripten'):
        run('em++')
    if not os.path.exists(os.path.expanduser('~') + '/.emscripten_ports/binaryen'):
        run('mkdir -p build/dummy')
        run('cd build/dummy && em++ ../../src/say-hello.cpp -o say-hello.html')

def llvmBrowser():
    if not os.path.isdir(llvmBrowserBuild):
        run('mkdir -p ' + llvmBrowserBuild)
        run('cd ' + llvmBrowserBuild + ' && ' +
            'time -p emcmake cmake -G "Ninja"' +
            ' -DCMAKE_INSTALL_PREFIX=' + llvmBrowserInstall + '' +
            ' -DCMAKE_BUILD_TYPE=' + llvmBrowserBuildType +
            ' -DLLVM_TARGETS_TO_BUILD=' +
            ' -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly' +
            ' -DLLVM_BUILD_TOOLS=OFF' +
            ' -DLLVM_ENABLE_THREADS=OFF' +
            ' -DLLVM_BUILD_LLVM_DYLIB=OFF' +
            ' -DLLVM_INCLUDE_TESTS=OFF' +
            ' -DLLVM_TABLEGEN=' + llvmInstall + 'bin/llvm-tblgen' +
            ' -DCLANG_TABLEGEN=' + llvmBuild + 'bin/clang-tblgen' +
            ' ' + root + 'repos/llvm')
    run('cd ' + llvmBrowserBuild + ' && time -p ninja ' + parallel + ' ' + ' '.join(llvmBrowserTargets))

def app(name, prepDir=None):
    if not os.path.isdir('build/apps-browser'):
        run('mkdir -p build/apps-browser')
        run('cd build/apps-browser &&' +
            ' CXX=' + llvmInstall + 'bin/clang++' +
            ' CXXFLAGS=--bind' +
            ' LDFLAGS=--bind' +
            ' emcmake cmake -G "Ninja"' +
            ' -DCMAKE_BUILD_TYPE=' + appBuildType +
            ' -DLLVM_BUILD=' + llvmBrowserBuild +
            ' -DEMSCRIPTEN=on'
            ' ../../src')
    if prepDir:
        prepDir()
    run('cd build/apps-browser && time -p ninja ' + name)
    if not os.path.isdir('dist'):
        run('mkdir -p dist')

def appClangFormat():
    app('clang-format')
    run('cp -au build/apps-browser/clang-format.js build/apps-browser/clang-format.wasm dist')
    run('cp -au src/clang-format.html dist/index.html')

def appClang():
    def prepDir():
        run('mkdir -p build/apps-browser/usr/lib/libcxxabi build/apps-browser/usr/lib/libc/musl/arch/emscripten')
        run('cp -auv repos/emscripten/system/include build/apps-browser/usr')
        run('cp -auv repos/emscripten/system/lib/libcxxabi/include build/apps-browser/usr/lib/libcxxabi')
        run('cp -auv repos/emscripten/system/lib/libc/musl/arch/emscripten build/apps-browser/usr/lib/libc/musl/arch')
    app('clang', prepDir)

def appClangNative():
    if not os.path.isdir('build/apps-native'):
        run('mkdir -p build/apps-native')
        run('cd build/apps-native &&' +
            ' CXX=' + root + 'install/llvm-Release/' + 'bin/clang++' +
            ' CXXFLAGS=-DLIB_PREFIX=' + root + 'repos/emscripten/system/' +
            ' cmake -G "Ninja"' +
            ' -DCMAKE_BUILD_TYPE=Debug' +
            ' -DLLVM_BUILD=' + llvmNo86Build +
            ' -DCMAKE_CXX_STANDARD_LIBRARIES="-lpthread -lncurses -ltinfo -lz"' +
            ' ../../src')
    run('cd build/apps-native && time -p ninja -v clang')
    #run('cd build/apps-native && ./clang')
    #run('cd build/apps-native && gdb -q -ex run --args ./clang')

parser = argparse.ArgumentParser()
parser.add_argument('-B', '--bash', action='store_true', help="Run bash with path set up")
parser.add_argument('-f', '--format', action='store_true', help="Format sources")
parser.add_argument('-a', '--all', action='store_true', help="Do everything marked with (*)")
parser.add_argument('-c', '--clone', action='store_true', help="(*) Clone repos. Doesn't touch ones which already exist.")
parser.add_argument('-l', '--llvm', action='store_true', help="(*) Build llvm toolchain if not already built")
parser.add_argument('-L', '--no86', action='store_true', help="Build llvm toolchain without X86 if not already built")
parser.add_argument('-w', '--wabt', action='store_true', help="Build wabt if not already built")
parser.add_argument('-y', '--binaryen', action='store_true', help="Build binaryen if not already built")
parser.add_argument('-e', '--emscripten', action='store_true', help="(*) Prepare emscripten by compiling say-hello.cpp")
parser.add_argument('-b', '--llvm-browser', action='store_true', help="(*) Build llvm in-browser components")
parser.add_argument('-1', '--app-1', action='store_true', help="(*) Build app 1: clang-format")
parser.add_argument('-2', '--app-2', action='store_true', help="    Build app 2: clang")
parser.add_argument('-n', '--app-n', action='store_true', help="    Build app 2: clang, native")
args = parser.parse_args()

haveArg = False
for k,v in vars(args).items():
    if v:
        haveArg = True
if not haveArg:
    print('build.py: Tell me what to do. -a does everything. -h shows options.')

if args.bash:
    run('bash')
if args.format:
    run('clang-format -i src/*.cpp')
if args.clone or args.all:
    clone()
if args.llvm or args.all:
    llvm()
if args.no86:
    llvmNo86()
if args.wabt:
    wabt()
if args.binaryen:
    binaryen()
if args.emscripten or args.all:
    emscripten()
if args.llvm_browser or args.all:
    llvmBrowser()
if args.app_1 or args.all:
    appClangFormat()
if args.app_2:
    appClang()
if args.app_n:
    appClangNative()
