## Clang tools In Browser (cib)

Try it at https://tbfleming.github.io/cib/

I'm trying to see how far wasm can go. Is it possible to compile clang to wasm and have it generate code within the browser?

Right now this is at the first baby step: ```clang-format```.

## VM for building WASM binaries

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
