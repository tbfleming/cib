#!/usr/bin/env python3

import argparse, os, subprocess, sys

root = os.path.dirname(os.path.abspath(__file__)) + '/'
llvmBuild = root + 'build/llvm/'
llvmInstall = root + 'install/llvm/'
llvmBrowserBuild = root + 'build/llvm-browser/'
llvmBrowserInstall = root + 'install/llvm-browser/'

llvmBrowserTargets = [
    'clangAST',
    'clangBasic',
    'clangBasic',
    'clangFormat',
    'clangLex',
    'clangRewrite',
    'clangRewrite',
    'clangToolingCore',
    'LLVMBinaryFormat',
    'LLVMCore',
    'LLVMMC',
    'LLVMSupport',
]

parallel = '-j ' + subprocess.check_output("grep 'processor' /proc/cpuinfo | wc -l", shell=True).decode('utf-8').strip()

os.environ["PATH"] = os.pathsep.join([
    root + 'repos/emscripten',
    llvmInstall + 'bin',
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
            ' -DCMAKE_BUILD_TYPE=Release' +
            ' -DLLVM_TARGETS_TO_BUILD=X86' +
            ' -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly' +
            ' ' + root + 'repos/llvm')
    if not os.path.isdir(llvmInstall):
        run('cd ' + llvmBuild + ' && time -p ninja ' + parallel)
        run('mkdir -p ' + llvmInstall)
        run('cd ' + llvmBuild + ' && time -p ninja ' + parallel + ' install')

def emscripten():
    if not os.path.exists(os.path.expanduser('~') + '/.emscripten'):
        run('em++')
    if not os.path.exists(os.path.expanduser('~') + '/.emscripten_ports/binaryen'):
        run('mkdir -p dummy/emscripten')
        run('cd dummy/emscripten && em++ ../../src/say-hello.cpp -o say-hello.html')

def llvmBrowser():
    if not os.path.isdir(llvmBrowserBuild):
        run('mkdir -p ' + llvmBrowserBuild)
        run('cd ' + llvmBrowserBuild + ' && ' +
            'time -p emcmake cmake -G "Ninja"' +
            ' -DCMAKE_INSTALL_PREFIX=' + llvmBrowserInstall + '' +
            ' -DCMAKE_BUILD_TYPE=Release' +
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

def appClangFormat():
    if not os.path.isdir('build/clang-format'):
        run('mkdir -p build/clang-format')
    run('cd build/clang-format && ' +
        'em++ ../../src/clang-format.cpp -o clang-format.js'
        ' -std=c++17' +
        ' -O3' +
        ' -DNDEBUG' +
        ' -fno-exceptions' +
        ' --bind' +
        ' -s ALLOW_MEMORY_GROWTH=1' +
        ' -I' + root + 'repos/llvm/include' +
        ' -I' + root + 'repos/llvm/tools/clang/include' +
        ' -I' + llvmBrowserBuild + 'include' +
        ' -I' + llvmBrowserBuild + 'tools/clang/include' +
        ' -L' + llvmBrowserBuild + 'lib' +
        ' -lclangBasic' +
        ' -lclangFormat' +
        ' -lclangRewrite' +
        ' -lclangRewrite' +
        ' -lclangToolingCore' +
        ' -lclangAST' +
        ' -lclangLex' +
        ' -lclangBasic' +
        ' -lLLVMCore' +
        ' -lLLVMBinaryFormat' +
        ' -lLLVMMC' +
        ' -lLLVMSupport')
    if not os.path.isdir('dist'):
        run('mkdir -p dist')
    run('cp -au build/clang-format/clang-format.js build/clang-format/clang-format.wasm dist')
    run('cp -au src/clang-format.html dist/index.html')

parser = argparse.ArgumentParser()
parser.add_argument('-B', '--bash', action='store_true', help="Run bash with path set up")
parser.add_argument('-a', '--all', action='store_true', help="Do everything below")
parser.add_argument('-c', '--clone', action='store_true', help="Clone repos. Doesn't touch ones which already exist.")
parser.add_argument('-l', '--llvm', action='store_true', help="Build llvm toolchain if not already built")
parser.add_argument('-e', '--emscripten', action='store_true', help="Prepare emscripten by compiling say-hello.cpp")
parser.add_argument('-b', '--llvm-browser', action='store_true', help="Build llvm in-browser components")
parser.add_argument('-1', '--app-1', action='store_true', help="Build app 1: clang-format")
args = parser.parse_args()

haveArg = False
for k,v in vars(args).items():
    if v:
        haveArg = True
if not haveArg:
    print('build.py: Tell me what to do. -a does everything. -h shows options.')

if args.bash:
    run('bash')
if args.clone or args.all:
    clone()
if args.llvm or args.all:
    llvm()
if args.emscripten or args.all:
    emscripten()
if args.llvm_browser or args.all:
    llvmBrowser()
if args.app_1 or args.all:
    appClangFormat()
