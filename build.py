#!/usr/bin/env python3

import argparse, os, subprocess, sys

root = os.path.dirname(os.path.abspath(__file__)) + '/'
llvmBuild = root + 'build/llvm/'
llvmInstall = root + 'install/llvm/'
llvmBrowserBuild = root + 'build/llvm-browser/'
llvmBrowserInstall = root + 'install/llvm-browser/'

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
        run('cd ' + llvmBuild + ' && time -p cmake -G "Ninja" -DCMAKE_INSTALL_PREFIX=' + llvmInstall + ' -DLLVM_TARGETS_TO_BUILD= -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly ~/hmmm/llvm ' + root + 'repos/llvm')
    if not os.path.isdir(llvmInstall):
        run('cd ' + llvmBuild + ' && time -p ninja -j36')
        run('mkdir -p ' + llvmInstall)
        run('cd ' + llvmBuild + ' && time -p ninja -j36 install')

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
            ' -DLLVM_TARGETS_TO_BUILD=' +
            ' -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly' +
            ' -DLLVM_TABLEGEN=' + llvmInstall + 'bin/llvm-tblgen' +
            ' -DCLANG_TABLEGEN=' + llvmBuild + 'bin/clang-tblgen' +
            ' ' + root + 'repos/llvm')
    run('cd ' + llvmBrowserBuild + ' && time -p ninja -j36 clang-format')

parser = argparse.ArgumentParser()
parser.add_argument('-B', '--bash', action='store_true', help="Run bash with path set up")
parser.add_argument('-a', '--all', action='store_true', help="Do everything below")
parser.add_argument('-c', '--clone', action='store_true', help="Clone repos. Doesn't touch ones which already exist.")
parser.add_argument('-l', '--llvm', action='store_true', help="Build llvm toolchain if not already built")
parser.add_argument('-e', '--emscripten', action='store_true', help="Prepare emscripten by compiling say-hello.cpp")
parser.add_argument('-b', '--llvm-browser', action='store_true', help="Build llvm in-browser components")
args = parser.parse_args()

haveArg = False
for k,v in vars(args).items():
    if v:
        haveArg = True
if not haveArg:
    print('Use -h to get help')

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
