## Clang In Browser (cib)

Try it at https://tbfleming.github.io/cib/

I'm trying to see how far wasm can go. Is it possible to compile clang to wasm and have it generate code within the browser?

Current status:
* Works in Firefox 57 and Chrome 63
* ```clang-format```: working
* ```clang```: working for simple cases
* Running generated wasm: working for simple cases

Recently fixed:
* The runtime now consumes much less memory with each press of the Run button
* Global constructors

Currently missing:
* Global destructors
* Standard library globals (e.g. ```cin```, ```cout```)
* RTTI, exception handling

## VM for building clang

* Create a fresh VM to build with. The build will probably fail if you already have emscripten or clang installed.
* Consider using a high thread-count VM; e.g. an EC2 c5.9xlarge.
* I put the repo in a dedicated volume while building; this aids using spot instances. 100 GB.

Ubuntu 16.04:

```
sudo apt update
sudo apt upgrade
sudo apt install build-essential cmake ninja-build python nodejs-legacy libncurses-dev
```

## Building WASM binaries

```
./build.py -a
```

This script:
* Clones needed repos
* Builds an llvm toolchain for targeting WASM
* Builds emscripten
* Invokes emscripten to:
  * set up environment
  * build emscripten's dependances
* Uses emscripten to build llvm libraries
* Builds the apps
