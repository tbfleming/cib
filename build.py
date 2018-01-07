#!/usr/bin/env python3

import argparse, os, subprocess, sys
from urllib.parse import urlparse

useTag = 'cib-005'      # --clone and --checkout retrieve this tag
useTag = None          # --clone and --checkout retrieve branches

useFastcomp = False

llvmBuildType = 'Release'
llvmNo86BuildType = 'Release'
llvmBrowserBuildType = 'Release'
fastcompBuildType = 'RelWithDebInfo'
binaryenBuildType = 'RelWithDebInfo'
optimizerBuildType = 'RelWithDebInfo'
browserClangFormatBuildType = 'Release'
browserClangBuildType = 'Release'
browserRuntimeBuildType = 'Debug'

root = os.path.dirname(os.path.abspath(__file__)) + '/'
cmakeInstall = root + 'install/cmake/'
llvmBuild = root + 'build/llvm-' + llvmBuildType + '/'
llvmInstall = root + 'install/llvm-' + llvmBuildType + '/'
llvmNo86Build = root + 'build/llvm-no86-' + llvmNo86BuildType + '/'
llvmNo86Install = root + 'install/llvm-no86-' + llvmNo86BuildType + '/'
llvmBrowserBuild = root + 'build/llvm-browser-' + llvmBrowserBuildType + '/'
llvmBrowserInstall = root + 'install/llvm-browser-' + llvmBrowserBuildType + '/'
fastcompBuild = root + 'build/fastcomp-' + fastcompBuildType + '/'
fastcompInstall = root + 'install/fastcomp-' + fastcompBuildType + '/'
binaryenBuild = root + 'build/binaryen-' + binaryenBuildType + '/'
binaryenInstall = root + 'install/binaryen-' + binaryenBuildType + '/'
wabtInstall = root + 'repos/wabt/bin/'
optimizerBuild = root + 'build/optimizer-' + optimizerBuildType + '/'
rtlBuildDir = root + 'build/rtl/'
browserClangFormatBuild = root + 'build/clang-format-browser-' + browserClangFormatBuildType + '/'
browserClangBuild = root + 'build/clang-browser-' + browserClangBuildType + '/'
browserRuntimeBuild = root + 'build/runtime-browser-' + browserRuntimeBuildType + '/'

gitProtocol = 'git@github.com:'

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

cores = subprocess.check_output("grep 'processor' /proc/cpuinfo | wc -l", shell=True).decode('utf-8').strip()
parallel = '-j ' + cores

os.environ["PATH"] = os.pathsep.join([
    root + 'repos/emscripten',
    cmakeInstall + 'bin',
    (fastcompInstall if useFastcomp else llvmInstall) + 'bin',
    wabtInstall,
    binaryenInstall + 'bin',
    os.environ["PATH"],
])
os.environ['BINARYEN'] = binaryenInstall
os.environ['EMSCRIPTEN_NATIVE_OPTIMIZER'] = optimizerBuild + 'optimizer'
os.environ['LD_LIBRARY_PATH'] = llvmInstall + 'lib'

def run(args):
    print('build.py:', args)
    if subprocess.call(args, shell=True):
        print('build.py: exiting because of error')
        sys.exit(1)

def getOutput(args):
    print('build.py:', args)
    result = subprocess.run(args, shell=True, stdout=subprocess.PIPE)
    if result.returncode:
        print('build.py: exiting because of error')
        sys.exit(1)
    print(result.stdout.decode("utf-8"), end='')
    return result.stdout

def download(url):
    if not os.path.exists('download/' + os.path.basename(urlparse(url).path)):
        run('mkdir -p download')
        run('cd download && wget ' + url)

repos = [
    ('repos/llvm', 'tbfleming/cib-llvm.git', 'llvm-mirror/llvm.git', True, 'master', 'cib'),
    ('repos/llvm/tools/clang', 'tbfleming/cib-clang.git', 'llvm-mirror/clang.git', True, 'master', 'cib'),
    ('repos/llvm/tools/lld', 'tbfleming/cib-lld.git', 'llvm-mirror/lld.git', True, 'master', 'master'),
    ('repos/llvm/projects/compiler-rt', 'tbfleming/cib-compiler-rt.git', 'llvm-mirror/compiler-rt.git', True, 'master', 'master'),
    ('repos/llvm/projects/libcxx', 'tbfleming/cib-libcxx.git', 'llvm-mirror/libcxx.git', True, 'master', 'master'),
    ('repos/llvm/projects/libcxxabi', 'tbfleming/cib-libcxxabi.git', 'llvm-mirror/libcxxabi.git', True, 'master', 'master'),
    # ('repos/fastcomp', 'tbfleming/cib-emscripten-fastcomp.git', 'kripken/emscripten-fastcomp.git', True, 'incoming', 'incoming'),
    # ('repos/fastcomp/tools/clang', 'tbfleming/cib-emscripten-fastcomp-clang.git', 'kripken/emscripten-fastcomp-clang.git', True, 'incoming', 'incoming'),
    ('repos/emscripten', 'tbfleming/cib-emscripten.git', 'kripken/emscripten.git', True, 'incoming', 'cib'),
    ('repos/wabt', 'WebAssembly/wabt.git', 'WebAssembly/wabt.git', False, 'master', 'master'),
    ('repos/binaryen', 'tbfleming/cib-binaryen.git', 'WebAssembly/binaryen.git', True, 'master', 'cib'),
]

def bash():
    run('bash')

def format():
    run('clang-format -i src/*.h src/*.cpp')
    run('chmod a-x *.md .gitignore src/*.h src/*.cpp src/*.js src/*.html src/*.txt src/rtl/*')

def clone():
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        if os.path.isdir(path):
            continue
        if useTag and isPushable:
            branch = useTag
        dir = os.path.dirname(path)
        base = os.path.basename(path)
        run('mkdir -p ' + dir)
        run('cd ' + dir + ' && git clone ' + gitProtocol + url + ' ' + base)
        run('cd ' + path + ' && git remote add upstream ' + gitProtocol + upstream)
        run('cd ' + path + ' && git checkout ' + branch)

def status():
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        print('****************')
        run('cd ' + path + ' && git status')
    print('****************')

def pull():
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        if getOutput('cd ' + path + ' && git status --porcelain --untracked-files=no'):
            print('build.py: skip', path)
        else:
            run('cd ' + path + ' && git pull --no-edit')

def checkout():
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        if useTag and isPushable:
            branch = useTag
        if getOutput('cd ' + path + ' && git status --porcelain --untracked-files=no'):
            print('build.py: skip', path)
        else:
            run('cd ' + path + ' && git fetch && git checkout -q ' + branch)

def merge():
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        if getOutput('cd ' + path + ' && git status --porcelain --untracked-files=no'):
            print('build.py: skip', path)
        else:
            run('cd ' + path + ' && git fetch upstream && git merge --no-edit upstream/' + upstreamBranch)

def createTags():
    run('git tag -a ' + args.tag + ' -m "' + args.tag + '"')
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        if isPushable:
            run('cd ' + path + ' && git tag -a ' + args.tag + ' -m "' + args.tag + '"')
    run('git push origin ' + args.tag)
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        if isPushable:
            run('cd ' + path + ' && git push origin ' + args.tag)

def push():
    for (path, url, upstream, isPushable, upstreamBranch, branch) in repos:
        if isPushable:
            if getOutput('cd ' + path + ' && git status --porcelain --untracked-files=no'):
                print('build.py: skip', path)
            else:
                run('cd ' + path + ' && git push')

def cmake():
    download('https://cmake.org/files/v3.10/cmake-3.10.1.tar.gz')
    if not os.path.exists('build/cmake-3.10.1'):
        run('mkdir -p build')
        run('cd build && tar xf ../download/cmake-3.10.1.tar.gz')
        run('cd build/cmake-3.10.1 && ./bootstrap --prefix=' + cmakeInstall + ' --parallel=' + cores)
        run('cd build/cmake-3.10.1 && make ' + parallel)
        run('cd build/cmake-3.10.1 && make install ' + parallel)

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
        run('cd ' + llvmBuild + ' && time -p ninja install install-cxx install-cxxabi install-compiler-rt')

def fastcomp():
    if not os.path.isdir(fastcompBuild):
        run('mkdir -p ' + fastcompBuild)
        run('cd ' + fastcompBuild + ' && time -p cmake -G "Ninja"' +
            ' -DCMAKE_INSTALL_PREFIX=' + fastcompInstall +
            ' -DCMAKE_BUILD_TYPE=' + fastcompBuildType +
            ' "-DLLVM_TARGETS_TO_BUILD=X86;JSBackend"' +
            ' -DLLVM_INCLUDE_EXAMPLES=OFF' +
            ' -DLLVM_INCLUDE_TESTS=OFF' +
            ' -DCLANG_INCLUDE_TESTS=OFF' +
            ' -DLLVM_ENABLE_ASSERTIONS=ON' +
            ' ' + root + 'repos/fastcomp')
    run('cd ' + fastcompBuild + ' && time -p ninja')
    if not os.path.isdir(fastcompInstall):
        run('mkdir -p ' + fastcompInstall)
        run('cd ' + fastcompBuild + ' && time -p ninja install')

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
        run('cd ' + llvmNo86Build + ' && time -p ninja install')

def wabt():
    if not os.path.isdir(wabtInstall):
        run('cd repos/wabt && time -p make clang-release-no-tests ' + parallel)

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
        run('cd ' + binaryenBuild + ' && time -p ninja install')

def emscripten():
    configFile = os.path.expanduser('~') + '/.emscripten'
    if not os.path.isdir(optimizerBuild):
        run('mkdir -p ' + optimizerBuild)
        run('cd ' + optimizerBuild + ' && time -p cmake -G "Ninja"' +
            ' -DCMAKE_BUILD_TYPE=' + optimizerBuildType +
            ' ' + root + 'repos/emscripten/tools/optimizer')
    run('cd ' + optimizerBuild + ' && time -p ninja')
    if not os.path.exists(configFile):
        run('em++')
        with open(configFile, "a") as file:
            file.write("\nBINARYEN_ROOT='" + binaryenInstall + "'\n")
        run('mkdir -p build/dummy')
        run('cd build/dummy && em++ ../../src/say-hello.cpp -o say-hello.html')

def tools():
    if not os.path.isdir('build/tools'):
        run('mkdir -p build/tools')
        run('cd build/tools &&' +
            ' CXX=' + llvmInstall + 'bin/clang++' +
            ' cmake -G "Ninja"' +
            ' -DCMAKE_BUILD_TYPE=Debug' +
            ' ../../src')
    run('cd build/tools && ninja cib-link combine-data')

def llvmBrowser():
    if not os.path.isdir(llvmBrowserBuild):
        run('mkdir -p ' + llvmBrowserBuild)
        run('cd ' + llvmBrowserBuild + ' && ' +
            'time -p emcmake cmake -G "Ninja"' +
            ' -DCMAKE_CXX_FLAGS="' +
            #' -s ASSERTIONS=2' +
            #' -s STACK_OVERFLOW_CHECK=2' +
            #' -s SAFE_HEAP=1' +
            '"' +
            ' -DLIBCXXABI_LIBCXX_INCLUDES=' + llvmInstall + 'include/c++/v1' +
            #' -DLLVM_ENABLE_DUMP=ON' +
            ' -DLLVM_ENABLE_ASSERTIONS=ON' +
            #' -DLLVM_ENABLE_EXPENSIVE_CHECKS=ON' +
            ' -DLLVM_ENABLE_BACKTRACES=ON' +
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
    run('cd ' + llvmBrowserBuild + ' && time -p ninja ' + ' '.join(llvmBrowserTargets))

def dist():
    download('https://registry.npmjs.org/monaco-editor/-/monaco-editor-0.10.1.tgz')
    if not os.path.exists('download/monaco-editor-0.10.1'):
        run('mkdir -p download/monaco-editor-0.10.1')
        run('cd download/monaco-editor-0.10.1 && tar -xf ../monaco-editor-0.10.1.tgz')
    run('mkdir -p dist/monaco-editor')
    run('cp -au download/monaco-editor-0.10.1/package/LICENSE dist/monaco-editor')
    run('cp -au download/monaco-editor-0.10.1/package/README.md dist/monaco-editor')
    run('cp -au download/monaco-editor-0.10.1/package/ThirdPartyNotices.txt dist/monaco-editor')
    run('cp -auv download/monaco-editor-0.10.1/package/min dist/monaco-editor')
    download('https://registry.npmjs.org/split.js/-/split.js-1.3.5.tgz')
    if not os.path.exists('download/Split.js-1.3.5'):
        run('mkdir -p download/Split.js-1.3.5')
        run('cd download/Split.js-1.3.5 && tar -xf ../split.js-1.3.5.tgz')
    run('mkdir -p dist/split.js')
    run('cp -au download/Split.js-1.3.5/package/LICENSE.txt dist/split.js')
    run('cp -au download/Split.js-1.3.5/package/AUTHORS.md dist/split.js')
    run('cp -au download/Split.js-1.3.5/package/README.md dist/split.js')
    run('cp -au download/Split.js-1.3.5/package/split.min.js dist/split.js')
    run('cp -auv download/Split.js-1.3.5/package/grips dist/split.js')
    run('cp -au src/clang.html src/process.js src/process-manager.js src/process-clang-format.js src/wasm-tools.js dist')
    run('cp -au src/process-clang.js src/process-runtime.js dist')

def rtl():
    if not os.path.isdir(rtlBuildDir):
        run('mkdir -p ' + rtlBuildDir)
        run('cd ' + rtlBuildDir + ' &&' +
            ' cmake -G "Ninja"' +
            ' -DLLVM_INSTALL=' + llvmBuild +
            ' -DCMAKE_C_COMPILER=' + llvmBuild + 'bin/clang' +
            ' -DCMAKE_CXX_COMPILER=' + llvmBuild + 'bin/clang++' +
            ' ../../src/rtl')
    run('cd ' + rtlBuildDir + ' && ninja')
    #run('cd ' + rtlBuildDir + ' && ninja -v -j1 2>&1 | tee ../../x.txt')

def app(name, buildType, buildDir, prepBuildDir=None, env=''):
    if not os.path.isdir(buildDir):
        run('mkdir -p ' + buildDir)
        run('cd ' + buildDir + ' &&' +
            ' emcmake cmake -G "Ninja"' +
            ' -DCMAKE_BUILD_TYPE=' + buildType +
            ' -DLLVM_BUILD=' + llvmBrowserBuild +
            ' -DEMSCRIPTEN=on'
            ' ../../src')
    if prepBuildDir:
        prepBuildDir()
    run('cd ' + buildDir + ' && ' + env + ' time -p ninja ' + name)
    if not os.path.isdir('dist'):
        run('mkdir -p dist')

def appClangFormat():
    app('clang-format', browserClangFormatBuildType, browserClangFormatBuild)
    run('cp -au ' + browserClangFormatBuild + 'clang-format.js ' + browserClangFormatBuild + 'clang-format.wasm dist')

def appClang():
    def prepBuildDir():
        run('mkdir -p ' + browserClangBuild + 'usr/lib/libcxxabi ' + browserClangBuild + 'usr/lib/libc/musl/arch/emscripten')
        run('cp -auv repos/emscripten/system/include ' + browserClangBuild + 'usr')
        run('cp -auv repos/emscripten/system/lib/libcxxabi/include ' + browserClangBuild + 'usr/lib/libcxxabi')
        run('cp -auv repos/emscripten/system/lib/libc/musl/arch/emscripten ' + browserClangBuild + 'usr/lib/libc/musl/arch')
    app('clang', browserClangBuildType, browserClangBuild, prepBuildDir)
    run('cd ' + browserClangBuild + ' && wasm-opt -Os clang.wasm -o clang-opt.wasm')
    run('cd ' + browserClangBuild + ' && ../tools/combine-data clang-opt.wasm clang-combined.wasm')
    run('cp -au ' + browserClangBuild + 'clang.js ' + browserClangBuild + 'clang.data dist')
    run('cp -au ' + browserClangBuild + 'clang-combined.wasm dist/clang.wasm')

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

def appRuntime():
    app('runtime', browserRuntimeBuildType, browserRuntimeBuild, env='EMCC_FORCE_STDLIBS=1')
    run('cp -au ' + browserRuntimeBuild + 'runtime.js ' + browserRuntimeBuild + 'runtime.wasm dist')

def http():
    run('mkdir -p build/http')
    run('cd build/http && ln -sf ' +
        browserClangFormatBuild + 'clang-format.* ' +
        browserClangBuild + 'clang.data ' +
        browserClangBuild + 'clang.js ' +
        browserRuntimeBuild + 'runtime.* ' +
        '../../dist/monaco-editor ' +
        '../../dist/split.js ' +
        '../../src/clang.html ' +
        '../../src/process*.js ' +
        '../../src/wasm-tools.js ' +
        '.')
    run('cd build/http && ln -sf ' + browserClangBuild + 'clang-combined.wasm clang.wasm')
    try:
        if 'HTTP_SERVER' in os.environ:
            run('cd build/http && ' + os.environ['HTTP_SERVER'])
        else:
            run('cd build/http && http-server -c-1')
    except KeyboardInterrupt:
        pass

commands = [
    ('G', 'git-https',      None,           'store_true',   False,  "Use https for git clone"),
    ('B', 'bash',           bash,           'store_true',   False,  "Run bash with environment set up"),
    ('f', 'format',         format,         'store_true',   False,  "Format sources"),
    ('c', 'clone',          clone,          'store_true',   True,   "Clone repos. Doesn't touch ones which already exist."),
    ('s', 'status',         status,         'store_true',   False,  "git status"),
    ('',  'pull',           pull,           'store_true',   False,  "git pull"),
    ('',  'checkout',       checkout,       'store_true',   False,  "git checkout"),
    ('',  'merge',          merge,          'store_true',   False,  "git merge upstream"),
    ('',  'tag',            createTags,     'store',        False,  "create and push git tags"),
    ('',  'push',           push,           'store_true',   False,  "git push"),
    ('',  'cmake',          cmake,          'store_true',   False,  "Build cmake if not already built"),
    ('l', 'llvm',           llvm,           'store_true',   True,   "Build llvm if not already built"),
    ('',  'no86',           llvmNo86,       'store_true',   False,  "Build llvm without X86 if not already built"),
    ('',  'fastcomp',       fastcomp,       'store_true',   useFastcomp, "Build fastcomp if not already built"),
    ('',  'wabt',           wabt,           'store_true',   False,  "Build wabt if not already built"),
    ('y', 'binaryen',       binaryen,       'store_true',   True,   "Build binaryen if not already built"),
    ('e', 'emscripten',     emscripten,     'store_true',   True,   "Prepare emscripten by compiling say-hello.cpp"),
    ('t', 'tools',          tools,          'store_true',   True,   "Build tools if not already built"),
    ('b', 'llvm-browser',   llvmBrowser,    'store_true',   True,   "Build llvm in-browser components"),
    ('d', 'dist',           dist,           'store_true',   True,   "Fill dist/"),
    ('r', 'rtl',            rtl,            'store_true',   False,   "Build RTL"),
    ('1', 'app-1',          appClangFormat, 'store_true',   True,   "Build app 1: clang-format"),
    ('2', 'app-2',          appClang,       'store_true',   True,   "Build app 2: clang"),
    ('n', 'app-n',          appClangNative, 'store_true',   False,  "Build app 2: clang, native"),
    ('3', 'app-3',          appRuntime,     'store_true',   True,   "Build app 3: runtime"),
    ('H', 'http',           http,           'store_true',   False,  "http-server"),
]

parser = argparse.ArgumentParser()
parser.add_argument('-a', '--all', action='store_true', help="Do everything marked with (*)")
for (flag, command, function, action, inAll, help) in commands:
    if inAll:
        help = '(*) ' + help
    if flag:
        parser.add_argument('-' + flag, '--' + command, action=action, help=help, dest=command)
    else:
        parser.add_argument('--' + command, action=action, help=help, dest=command)
args = parser.parse_args()

haveCommand = False
for (flag, command, function, action, inAll, help) in commands:
    if getattr(args, command) or inAll and args.all:
        if function:
            haveCommand = True
            function()
        elif command == 'git-https':
            gitProtocol = 'https://github.com/'
if not haveCommand:
    print('build.py: Tell me what to do. -a does almost everything. -h shows options.')
