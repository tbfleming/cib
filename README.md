## Clang In Browser (cib)

Try it at https://tbfleming.github.io/cib/

I'm trying to see how far wasm can go. Is it possible to compile clang to wasm and have it generate code within the browser?

Current status:
* Works in Firefox 57 and Chrome 63

Change log:
* Build EOS contracts: https://tbfleming.github.io/cib/eos.html
* Integrate with user HTML
* Load gists
* Load header libraries in .zip files
* The runtime now consumes much less memory with each press of the Run button
* Standard library globals (e.g. ```cout```)
* Global constructors
* Function pointers and virtual functions
* RTTI

Currently missing:
* Global destructors
* Exception handling
* stdin / cin. Waiting on browsers to restore SharedArrayBuffer.

## VM for building clang

* Create a fresh VM to build with. The build will probably fail if you already have emscripten or clang installed.
* Consider using a high thread-count VM; e.g. an EC2 c5.9xlarge.
* I put the repo in a dedicated volume while building; this aids using spot instances. 100 GB.

Ubuntu 16.04:

```
sudo apt update
sudo apt upgrade
sudo apt install build-essential cmake ninja-build python nodejs-legacy libncurses-dev unzip libboost1.58-tools-dev
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
