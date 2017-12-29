var Module = function(Module) {
  Module = Module || {};

// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'clang.data';
    var REMOTE_PACKAGE_BASE = 'clang.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onerror = function(event) {
        throw new Error("NetworkError for: " + packageName);
      }
      xhr.onload = function(event) {
        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetchedCallback = null;
      var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

      if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'usr', true, true);
Module['FS_createPath']('/usr', 'include', true, true);
Module['FS_createPath']('/usr/include', 'KHR', true, true);
Module['FS_createPath']('/usr/include', 'GLFW', true, true);
Module['FS_createPath']('/usr/include', 'GLES', true, true);
Module['FS_createPath']('/usr/include', 'GLES3', true, true);
Module['FS_createPath']('/usr/include', 'GLES2', true, true);
Module['FS_createPath']('/usr/include', 'SSE', true, true);
Module['FS_createPath']('/usr/include', 'X11', true, true);
Module['FS_createPath']('/usr/include/X11', 'extensions', true, true);
Module['FS_createPath']('/usr/include', 'uuid', true, true);
Module['FS_createPath']('/usr/include', 'GL', true, true);
Module['FS_createPath']('/usr/include', 'SDL', true, true);
Module['FS_createPath']('/usr/include', 'AL', true, true);
Module['FS_createPath']('/usr/include', 'libcxx', true, true);
Module['FS_createPath']('/usr/include/libcxx', 'experimental', true, true);
Module['FS_createPath']('/usr/include/libcxx', 'ext', true, true);
Module['FS_createPath']('/usr/include/libcxx', 'support', true, true);
Module['FS_createPath']('/usr/include/libcxx/support', 'xlocale', true, true);
Module['FS_createPath']('/usr/include/libcxx/support', 'android', true, true);
Module['FS_createPath']('/usr/include/libcxx/support', 'win32', true, true);
Module['FS_createPath']('/usr/include/libcxx/support', 'musl', true, true);
Module['FS_createPath']('/usr/include/libcxx/support', 'solaris', true, true);
Module['FS_createPath']('/usr/include/libcxx/support', 'newlib', true, true);
Module['FS_createPath']('/usr/include/libcxx/support', 'ibm', true, true);
Module['FS_createPath']('/usr/include', 'libc', true, true);
Module['FS_createPath']('/usr/include/libc', 'arpa', true, true);
Module['FS_createPath']('/usr/include/libc', 'net', true, true);
Module['FS_createPath']('/usr/include/libc', 'netpacket', true, true);
Module['FS_createPath']('/usr/include/libc', 'sys', true, true);
Module['FS_createPath']('/usr/include/libc', 'scsi', true, true);
Module['FS_createPath']('/usr/include/libc', 'netinet', true, true);
Module['FS_createPath']('/usr/include', 'emscripten', true, true);
Module['FS_createPath']('/usr/include', 'EGL', true, true);
Module['FS_createPath']('/usr/include', 'compat', true, true);
Module['FS_createPath']('/usr/include/compat', 'sys', true, true);
Module['FS_createPath']('/usr', 'lib', true, true);
Module['FS_createPath']('/usr/lib', 'libcxxabi', true, true);
Module['FS_createPath']('/usr/lib/libcxxabi', 'include', true, true);
Module['FS_createPath']('/usr/lib/libcxxabi/include', 'mach-o', true, true);
Module['FS_createPath']('/usr/lib', 'libc', true, true);
Module['FS_createPath']('/usr/lib/libc', 'musl', true, true);
Module['FS_createPath']('/usr/lib/libc/musl', 'arch', true, true);
Module['FS_createPath']('/usr/lib/libc/musl/arch', 'emscripten', true, true);
Module['FS_createPath']('/usr/lib/libc/musl/arch/emscripten', 'bits', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      }
    };

        var files = metadata.files;
        for (var i = 0; i < files.length; ++i) {
          new DataRequest(files[i].start, files[i].end, files[i].crunched, files[i].audio).open('GET', files[i].filename);
        }

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
        // Reuse the bytearray from the XHR as the source for file reads.
        DataRequest.prototype.byteArray = byteArray;
  
          var files = metadata.files;
          for (var i = 0; i < files.length; ++i) {
            DataRequest.prototype.requests[files[i].filename].onload();
          }
              Module['removeRunDependency']('datafile_clang.data');

    };
    Module['addRunDependency']('datafile_clang.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 35, "filename": "/usr/include/emscripten.h"}, {"audio": 0, "start": 35, "crunched": 0, "end": 10002, "filename": "/usr/include/KHR/khrplatform.h"}, {"audio": 0, "start": 10002, "crunched": 0, "end": 162472, "filename": "/usr/include/GLFW/glfw3.h"}, {"audio": 0, "start": 162472, "crunched": 0, "end": 196804, "filename": "/usr/include/GLES/gl.h"}, {"audio": 0, "start": 196804, "crunched": 0, "end": 260826, "filename": "/usr/include/GLES/glext.h"}, {"audio": 0, "start": 260826, "crunched": 0, "end": 261727, "filename": "/usr/include/GLES/glplatform.h"}, {"audio": 0, "start": 261727, "crunched": 0, "end": 262304, "filename": "/usr/include/GLES3/gl2ext.h"}, {"audio": 0, "start": 262304, "crunched": 0, "end": 263213, "filename": "/usr/include/GLES3/gl3platform.h"}, {"audio": 0, "start": 263213, "crunched": 0, "end": 370676, "filename": "/usr/include/GLES3/gl31.h"}, {"audio": 0, "start": 370676, "crunched": 0, "end": 499019, "filename": "/usr/include/GLES3/gl32.h"}, {"audio": 0, "start": 499019, "crunched": 0, "end": 581741, "filename": "/usr/include/GLES3/gl3.h"}, {"audio": 0, "start": 581741, "crunched": 0, "end": 582650, "filename": "/usr/include/GLES2/gl2platform.h"}, {"audio": 0, "start": 582650, "crunched": 0, "end": 775887, "filename": "/usr/include/GLES2/gl2ext.h"}, {"audio": 0, "start": 775887, "crunched": 0, "end": 819933, "filename": "/usr/include/GLES2/gl2.h"}, {"audio": 0, "start": 819933, "crunched": 0, "end": 842316, "filename": "/usr/include/SSE/smmintrin.h"}, {"audio": 0, "start": 842316, "crunched": 0, "end": 842733, "filename": "/usr/include/SSE/x86intrin.h"}, {"audio": 0, "start": 842733, "crunched": 0, "end": 909139, "filename": "/usr/include/SSE/emmintrin.h"}, {"audio": 0, "start": 909139, "crunched": 0, "end": 909324, "filename": "/usr/include/SSE/immintrin.h"}, {"audio": 0, "start": 909324, "crunched": 0, "end": 913982, "filename": "/usr/include/SSE/pmmintrin.h"}, {"audio": 0, "start": 913982, "crunched": 0, "end": 932002, "filename": "/usr/include/SSE/xmmintrin.h"}, {"audio": 0, "start": 932002, "crunched": 0, "end": 943972, "filename": "/usr/include/SSE/tmmintrin.h"}, {"audio": 0, "start": 943972, "crunched": 0, "end": 950310, "filename": "/usr/include/X11/Xmd.h"}, {"audio": 0, "start": 950310, "crunched": 0, "end": 971322, "filename": "/usr/include/X11/Xutil.h"}, {"audio": 0, "start": 971322, "crunched": 0, "end": 974077, "filename": "/usr/include/X11/keysym.h"}, {"audio": 0, "start": 974077, "crunched": 0, "end": 975644, "filename": "/usr/include/X11/XlibConf.h"}, {"audio": 0, "start": 975644, "crunched": 0, "end": 1006639, "filename": "/usr/include/X11/XKBlib.h"}, {"audio": 0, "start": 1006639, "crunched": 0, "end": 1010672, "filename": "/usr/include/X11/Xfuncproto.h"}, {"audio": 0, "start": 1010672, "crunched": 0, "end": 1178893, "filename": "/usr/include/X11/keysymdef.h"}, {"audio": 0, "start": 1178893, "crunched": 0, "end": 1181698, "filename": "/usr/include/X11/Xprotostr.h"}, {"audio": 0, "start": 1181698, "crunched": 0, "end": 1184816, "filename": "/usr/include/X11/cursorfont.h"}, {"audio": 0, "start": 1184816, "crunched": 0, "end": 1284404, "filename": "/usr/include/X11/Xlib.h"}, {"audio": 0, "start": 1284404, "crunched": 0, "end": 1322979, "filename": "/usr/include/X11/Xlibint.h"}, {"audio": 0, "start": 1322979, "crunched": 0, "end": 1379656, "filename": "/usr/include/X11/Xproto.h"}, {"audio": 0, "start": 1379656, "crunched": 0, "end": 1382771, "filename": "/usr/include/X11/Xosdefs.h"}, {"audio": 0, "start": 1382771, "crunched": 0, "end": 1384971, "filename": "/usr/include/X11/Xfuncs.h"}, {"audio": 0, "start": 1384971, "crunched": 0, "end": 1387489, "filename": "/usr/include/X11/Xatom.h"}, {"audio": 0, "start": 1387489, "crunched": 0, "end": 1407694, "filename": "/usr/include/X11/X.h"}, {"audio": 0, "start": 1407694, "crunched": 0, "end": 1425910, "filename": "/usr/include/X11/extensions/XKBstr.h"}, {"audio": 0, "start": 1425910, "crunched": 0, "end": 1427555, "filename": "/usr/include/X11/extensions/shm.h"}, {"audio": 0, "start": 1427555, "crunched": 0, "end": 1433626, "filename": "/usr/include/X11/extensions/extutil.h"}, {"audio": 0, "start": 1433626, "crunched": 0, "end": 1461867, "filename": "/usr/include/X11/extensions/XKB.h"}, {"audio": 0, "start": 1461867, "crunched": 0, "end": 1465602, "filename": "/usr/include/X11/extensions/XShm.h"}, {"audio": 0, "start": 1465602, "crunched": 0, "end": 1467257, "filename": "/usr/include/X11/extensions/Xext.h"}, {"audio": 0, "start": 1467257, "crunched": 0, "end": 1468073, "filename": "/usr/include/uuid/uuid.h"}, {"audio": 0, "start": 1468073, "crunched": 0, "end": 1552743, "filename": "/usr/include/GL/gl.h"}, {"audio": 0, "start": 1552743, "crunched": 0, "end": 2354846, "filename": "/usr/include/GL/glext.h"}, {"audio": 0, "start": 2354846, "crunched": 0, "end": 2355485, "filename": "/usr/include/GL/glut.h"}, {"audio": 0, "start": 2355485, "crunched": 0, "end": 2375414, "filename": "/usr/include/GL/glfw.h"}, {"audio": 0, "start": 2375414, "crunched": 0, "end": 2401595, "filename": "/usr/include/GL/freeglut_std.h"}, {"audio": 0, "start": 2401595, "crunched": 0, "end": 2418850, "filename": "/usr/include/GL/glu.h"}, {"audio": 0, "start": 2418850, "crunched": 0, "end": 2469588, "filename": "/usr/include/GL/glew.h"}, {"audio": 0, "start": 2469588, "crunched": 0, "end": 2474720, "filename": "/usr/include/SDL/SDL_version.h"}, {"audio": 0, "start": 2474720, "crunched": 0, "end": 2501694, "filename": "/usr/include/SDL/SDL_video.h"}, {"audio": 0, "start": 2501694, "crunched": 0, "end": 2503927, "filename": "/usr/include/SDL/SDL_gesture.h"}, {"audio": 0, "start": 2503927, "crunched": 0, "end": 2504866, "filename": "/usr/include/SDL/SDL_copying.h"}, {"audio": 0, "start": 2504866, "crunched": 0, "end": 2508717, "filename": "/usr/include/SDL/SDL_platform.h"}, {"audio": 0, "start": 2508717, "crunched": 0, "end": 2510822, "filename": "/usr/include/SDL/SDL_error.h"}, {"audio": 0, "start": 2510822, "crunched": 0, "end": 2514682, "filename": "/usr/include/SDL/SDL_cpuinfo.h"}, {"audio": 0, "start": 2514682, "crunched": 0, "end": 2517785, "filename": "/usr/include/SDL/SDL_config_wiz.h"}, {"audio": 0, "start": 2517785, "crunched": 0, "end": 2555618, "filename": "/usr/include/SDL/SDL_haptic.h"}, {"audio": 0, "start": 2555618, "crunched": 0, "end": 2557210, "filename": "/usr/include/SDL/SDL_config.h"}, {"audio": 0, "start": 2557210, "crunched": 0, "end": 2561280, "filename": "/usr/include/SDL/SDL_rect.h"}, {"audio": 0, "start": 2561280, "crunched": 0, "end": 2579303, "filename": "/usr/include/SDL/SDL_surface.h"}, {"audio": 0, "start": 2579303, "crunched": 0, "end": 2585412, "filename": "/usr/include/SDL/SDL_joystick.h"}, {"audio": 0, "start": 2585412, "crunched": 0, "end": 2588002, "filename": "/usr/include/SDL/SDL_input.h"}, {"audio": 0, "start": 2588002, "crunched": 0, "end": 2602939, "filename": "/usr/include/SDL/SDL_scancode.h"}, {"audio": 0, "start": 2602939, "crunched": 0, "end": 2607771, "filename": "/usr/include/SDL/SDL_config_macosx.h"}, {"audio": 0, "start": 2607771, "crunched": 0, "end": 2613771, "filename": "/usr/include/SDL/SDL_log.h"}, {"audio": 0, "start": 2613771, "crunched": 0, "end": 2623156, "filename": "/usr/include/SDL/SDL_atomic.h"}, {"audio": 0, "start": 2623156, "crunched": 0, "end": 2625135, "filename": "/usr/include/SDL/SDL_clipboard.h"}, {"audio": 0, "start": 2625135, "crunched": 0, "end": 2640163, "filename": "/usr/include/SDL/SDL_keycode.h"}, {"audio": 0, "start": 2640163, "crunched": 0, "end": 2642563, "filename": "/usr/include/SDL/SDL_config_minimal.h"}, {"audio": 0, "start": 2642563, "crunched": 0, "end": 2644676, "filename": "/usr/include/SDL/SDL_quit.h"}, {"audio": 0, "start": 2644676, "crunched": 0, "end": 2651788, "filename": "/usr/include/SDL/SDL_mouse.h"}, {"audio": 0, "start": 2651788, "crunched": 0, "end": 2652819, "filename": "/usr/include/SDL/COPYING"}, {"audio": 0, "start": 2652819, "crunched": 0, "end": 2673097, "filename": "/usr/include/SDL/SDL_stdinc.h"}, {"audio": 0, "start": 2673097, "crunched": 0, "end": 2676285, "filename": "/usr/include/SDL/SDL_timer.h"}, {"audio": 0, "start": 2676285, "crunched": 0, "end": 2677521, "filename": "/usr/include/SDL/SDL_opengles2.h"}, {"audio": 0, "start": 2677521, "crunched": 0, "end": 2681084, "filename": "/usr/include/SDL/SDL_config_nintendods.h"}, {"audio": 0, "start": 2681084, "crunched": 0, "end": 2687940, "filename": "/usr/include/SDL/SDL_hints.h"}, {"audio": 0, "start": 2687940, "crunched": 0, "end": 2691876, "filename": "/usr/include/SDL/SDL_config_iphoneos.h"}, {"audio": 0, "start": 2691876, "crunched": 0, "end": 2698493, "filename": "/usr/include/SDL/SDL_rwops.h"}, {"audio": 0, "start": 2698493, "crunched": 0, "end": 2701038, "filename": "/usr/include/SDL/SDL_power.h"}, {"audio": 0, "start": 2701038, "crunched": 0, "end": 2713938, "filename": "/usr/include/SDL/SDL_compat.h"}, {"audio": 0, "start": 2713938, "crunched": 0, "end": 2736810, "filename": "/usr/include/SDL/SDL_events.h"}, {"audio": 0, "start": 2736810, "crunched": 0, "end": 2747796, "filename": "/usr/include/SDL/SDL_gfxPrimitives.h"}, {"audio": 0, "start": 2747796, "crunched": 0, "end": 3384260, "filename": "/usr/include/SDL/SDL_opengl.h"}, {"audio": 0, "start": 3384260, "crunched": 0, "end": 3390835, "filename": "/usr/include/SDL/SDL_mutex.h"}, {"audio": 0, "start": 3390835, "crunched": 0, "end": 3418569, "filename": "/usr/include/SDL/SDL_mixer.h"}, {"audio": 0, "start": 3418569, "crunched": 0, "end": 3433264, "filename": "/usr/include/SDL/SDL_pixels.h"}, {"audio": 0, "start": 3433264, "crunched": 0, "end": 3434297, "filename": "/usr/include/SDL/SDL_types.h"}, {"audio": 0, "start": 3434297, "crunched": 0, "end": 3434480, "filename": "/usr/include/SDL/SDL_name.h"}, {"audio": 0, "start": 3434480, "crunched": 0, "end": 3435899, "filename": "/usr/include/SDL/close_code.h"}, {"audio": 0, "start": 3435899, "crunched": 0, "end": 3441014, "filename": "/usr/include/SDL/SDL.h"}, {"audio": 0, "start": 3441014, "crunched": 0, "end": 3448612, "filename": "/usr/include/SDL/SDL_config.h.in"}, {"audio": 0, "start": 3448612, "crunched": 0, "end": 3470984, "filename": "/usr/include/SDL/SDL_render.h"}, {"audio": 0, "start": 3470984, "crunched": 0, "end": 3473968, "filename": "/usr/include/SDL/SDL_rotozoom.h"}, {"audio": 0, "start": 3473968, "crunched": 0, "end": 3480200, "filename": "/usr/include/SDL/SDL_syswm.h"}, {"audio": 0, "start": 3480200, "crunched": 0, "end": 3483400, "filename": "/usr/include/SDL/SDL_config_pandora.h"}, {"audio": 0, "start": 3483400, "crunched": 0, "end": 3485932, "filename": "/usr/include/SDL/SDL_touch.h"}, {"audio": 0, "start": 3485932, "crunched": 0, "end": 3486009, "filename": "/usr/include/SDL/SDL_revision.h"}, {"audio": 0, "start": 3486009, "crunched": 0, "end": 3505957, "filename": "/usr/include/SDL/SDL_audio.h"}, {"audio": 0, "start": 3505957, "crunched": 0, "end": 3516668, "filename": "/usr/include/SDL/SDL_ttf.h"}, {"audio": 0, "start": 3516668, "crunched": 0, "end": 3521881, "filename": "/usr/include/SDL/SDL_config_windows.h"}, {"audio": 0, "start": 3521881, "crunched": 0, "end": 3527394, "filename": "/usr/include/SDL/SDL_image.h"}, {"audio": 0, "start": 3527394, "crunched": 0, "end": 3530374, "filename": "/usr/include/SDL/SDL_loadso.h"}, {"audio": 0, "start": 3530374, "crunched": 0, "end": 3532218, "filename": "/usr/include/SDL/SDL_blendmode.h"}, {"audio": 0, "start": 3532218, "crunched": 0, "end": 3532295, "filename": "/usr/include/SDL/SDL_revision.h.orig"}, {"audio": 0, "start": 3532295, "crunched": 0, "end": 3536257, "filename": "/usr/include/SDL/begin_code.h"}, {"audio": 0, "start": 3536257, "crunched": 0, "end": 3539646, "filename": "/usr/include/SDL/SDL_config_android.h"}, {"audio": 0, "start": 3539646, "crunched": 0, "end": 3545937, "filename": "/usr/include/SDL/SDL_endian.h"}, {"audio": 0, "start": 3545937, "crunched": 0, "end": 3547169, "filename": "/usr/include/SDL/SDL_opengles.h"}, {"audio": 0, "start": 3547169, "crunched": 0, "end": 3552165, "filename": "/usr/include/SDL/SDL_keyboard.h"}, {"audio": 0, "start": 3552165, "crunched": 0, "end": 3554484, "filename": "/usr/include/SDL/SDL_main.h"}, {"audio": 0, "start": 3554484, "crunched": 0, "end": 3560207, "filename": "/usr/include/SDL/SDL_shape.h"}, {"audio": 0, "start": 3560207, "crunched": 0, "end": 3565908, "filename": "/usr/include/SDL/SDL_thread.h"}, {"audio": 0, "start": 3565908, "crunched": 0, "end": 3574715, "filename": "/usr/include/SDL/SDL_assert.h"}, {"audio": 0, "start": 3574715, "crunched": 0, "end": 3581983, "filename": "/usr/include/AL/al.h"}, {"audio": 0, "start": 3581983, "crunched": 0, "end": 3584920, "filename": "/usr/include/AL/alc.h"}, {"audio": 0, "start": 3584920, "crunched": 0, "end": 3678576, "filename": "/usr/include/libcxx/__hash_table"}, {"audio": 0, "start": 3678576, "crunched": 0, "end": 3679213, "filename": "/usr/include/libcxx/ctgmath"}, {"audio": 0, "start": 3679213, "crunched": 0, "end": 3724852, "filename": "/usr/include/libcxx/__locale"}, {"audio": 0, "start": 3724852, "crunched": 0, "end": 3725919, "filename": "/usr/include/libcxx/__undef_min_max"}, {"audio": 0, "start": 3725919, "crunched": 0, "end": 3726546, "filename": "/usr/include/libcxx/ccomplex"}, {"audio": 0, "start": 3726546, "crunched": 0, "end": 3734626, "filename": "/usr/include/libcxx/wchar.h"}, {"audio": 0, "start": 3734626, "crunched": 0, "end": 3736315, "filename": "/usr/include/libcxx/__nullptr"}, {"audio": 0, "start": 3736315, "crunched": 0, "end": 3741446, "filename": "/usr/include/libcxx/errno.h"}, {"audio": 0, "start": 3741446, "crunched": 0, "end": 3801810, "filename": "/usr/include/libcxx/forward_list"}, {"audio": 0, "start": 3801810, "crunched": 0, "end": 3802455, "filename": "/usr/include/libcxx/tgmath.h"}, {"audio": 0, "start": 3802455, "crunched": 0, "end": 3828024, "filename": "/usr/include/libcxx/scoped_allocator"}, {"audio": 0, "start": 3828024, "crunched": 0, "end": 3829444, "filename": "/usr/include/libcxx/ctype.h"}, {"audio": 0, "start": 3829444, "crunched": 0, "end": 3830857, "filename": "/usr/include/libcxx/ctime"}, {"audio": 0, "start": 3830857, "crunched": 0, "end": 3839587, "filename": "/usr/include/libcxx/numeric"}, {"audio": 0, "start": 3839587, "crunched": 0, "end": 3840243, "filename": "/usr/include/libcxx/cerrno"}, {"audio": 0, "start": 3840243, "crunched": 0, "end": 3868580, "filename": "/usr/include/libcxx/utility"}, {"audio": 0, "start": 3868580, "crunched": 0, "end": 3872188, "filename": "/usr/include/libcxx/stdio.h"}, {"audio": 0, "start": 3872188, "crunched": 0, "end": 3873322, "filename": "/usr/include/libcxx/cfloat"}, {"audio": 0, "start": 3873322, "crunched": 0, "end": 3874124, "filename": "/usr/include/libcxx/stdbool.h"}, {"audio": 0, "start": 3874124, "crunched": 0, "end": 3877721, "filename": "/usr/include/libcxx/inttypes.h"}, {"audio": 0, "start": 3877721, "crunched": 0, "end": 3881214, "filename": "/usr/include/libcxx/LICENSE.TXT"}, {"audio": 0, "start": 3881214, "crunched": 0, "end": 3882541, "filename": "/usr/include/libcxx/float.h"}, {"audio": 0, "start": 3882541, "crunched": 0, "end": 3883123, "filename": "/usr/include/libcxx/ciso646"}, {"audio": 0, "start": 3883123, "crunched": 0, "end": 3883167, "filename": "/usr/include/libcxx/readme.txt"}, {"audio": 0, "start": 3883167, "crunched": 0, "end": 3928145, "filename": "/usr/include/libcxx/fstream"}, {"audio": 0, "start": 3928145, "crunched": 0, "end": 3928908, "filename": "/usr/include/libcxx/locale.h"}, {"audio": 0, "start": 3928908, "crunched": 0, "end": 4086330, "filename": "/usr/include/libcxx/type_traits"}, {"audio": 0, "start": 4086330, "crunched": 0, "end": 4289166, "filename": "/usr/include/libcxx/algorithm"}, {"audio": 0, "start": 4289166, "crunched": 0, "end": 4290060, "filename": "/usr/include/libcxx/climits"}, {"audio": 0, "start": 4290060, "crunched": 0, "end": 4296620, "filename": "/usr/include/libcxx/stdexcept"}, {"audio": 0, "start": 4296620, "crunched": 0, "end": 4316865, "filename": "/usr/include/libcxx/__tuple"}, {"audio": 0, "start": 4316865, "crunched": 0, "end": 4321352, "filename": "/usr/include/libcxx/stdlib.h"}, {"audio": 0, "start": 4321352, "crunched": 0, "end": 4323817, "filename": "/usr/include/libcxx/__sso_allocator"}, {"audio": 0, "start": 4323817, "crunched": 0, "end": 4335089, "filename": "/usr/include/libcxx/strstream"}, {"audio": 0, "start": 4335089, "crunched": 0, "end": 4367470, "filename": "/usr/include/libcxx/ostream"}, {"audio": 0, "start": 4367470, "crunched": 0, "end": 4419504, "filename": "/usr/include/libcxx/__bit_reference"}, {"audio": 0, "start": 4419504, "crunched": 0, "end": 4425776, "filename": "/usr/include/libcxx/cwchar"}, {"audio": 0, "start": 4425776, "crunched": 0, "end": 4427317, "filename": "/usr/include/libcxx/wctype.h"}, {"audio": 0, "start": 4427317, "crunched": 0, "end": 4430412, "filename": "/usr/include/libcxx/CREDITS.TXT"}, {"audio": 0, "start": 4430412, "crunched": 0, "end": 4508827, "filename": "/usr/include/libcxx/list"}, {"audio": 0, "start": 4508827, "crunched": 0, "end": 4509553, "filename": "/usr/include/libcxx/complex.h"}, {"audio": 0, "start": 4509553, "crunched": 0, "end": 4542717, "filename": "/usr/include/libcxx/bitset"}, {"audio": 0, "start": 4542717, "crunched": 0, "end": 4553232, "filename": "/usr/include/libcxx/__std_stream"}, {"audio": 0, "start": 4553232, "crunched": 0, "end": 4569452, "filename": "/usr/include/libcxx/ratio"}, {"audio": 0, "start": 4569452, "crunched": 0, "end": 4570342, "filename": "/usr/include/libcxx/cstdarg"}, {"audio": 0, "start": 4570342, "crunched": 0, "end": 4573832, "filename": "/usr/include/libcxx/cinttypes"}, {"audio": 0, "start": 4573832, "crunched": 0, "end": 4655416, "filename": "/usr/include/libcxx/unordered_map"}, {"audio": 0, "start": 4655416, "crunched": 0, "end": 4658261, "filename": "/usr/include/libcxx/initializer_list"}, {"audio": 0, "start": 4658261, "crunched": 0, "end": 4792480, "filename": "/usr/include/libcxx/valarray"}, {"audio": 0, "start": 4792480, "crunched": 0, "end": 4796727, "filename": "/usr/include/libcxx/__bsd_locale_fallbacks.h"}, {"audio": 0, "start": 4796727, "crunched": 0, "end": 4803246, "filename": "/usr/include/libcxx/__functional_base_03"}, {"audio": 0, "start": 4803246, "crunched": 0, "end": 4828675, "filename": "/usr/include/libcxx/ios"}, {"audio": 0, "start": 4828675, "crunched": 0, "end": 4890014, "filename": "/usr/include/libcxx/atomic"}, {"audio": 0, "start": 4890014, "crunched": 0, "end": 4890722, "filename": "/usr/include/libcxx/cstdbool"}, {"audio": 0, "start": 4890722, "crunched": 0, "end": 4916359, "filename": "/usr/include/libcxx/queue"}, {"audio": 0, "start": 4916359, "crunched": 0, "end": 4925484, "filename": "/usr/include/libcxx/new"}, {"audio": 0, "start": 4925484, "crunched": 0, "end": 4934296, "filename": "/usr/include/libcxx/__debug"}, {"audio": 0, "start": 4934296, "crunched": 0, "end": 4935096, "filename": "/usr/include/libcxx/csetjmp"}, {"audio": 0, "start": 4935096, "crunched": 0, "end": 4998426, "filename": "/usr/include/libcxx/iterator"}, {"audio": 0, "start": 4998426, "crunched": 0, "end": 5003419, "filename": "/usr/include/libcxx/typeinfo"}, {"audio": 0, "start": 5003419, "crunched": 0, "end": 5229175, "filename": "/usr/include/libcxx/random"}, {"audio": 0, "start": 5229175, "crunched": 0, "end": 5284553, "filename": "/usr/include/libcxx/unordered_set"}, {"audio": 0, "start": 5284553, "crunched": 0, "end": 5296572, "filename": "/usr/include/libcxx/module.modulemap"}, {"audio": 0, "start": 5296572, "crunched": 0, "end": 5308531, "filename": "/usr/include/libcxx/array"}, {"audio": 0, "start": 5308531, "crunched": 0, "end": 5327061, "filename": "/usr/include/libcxx/any"}, {"audio": 0, "start": 5327061, "crunched": 0, "end": 5328439, "filename": "/usr/include/libcxx/iostream"}, {"audio": 0, "start": 5328439, "crunched": 0, "end": 5329390, "filename": "/usr/include/libcxx/csignal"}, {"audio": 0, "start": 5329390, "crunched": 0, "end": 5331135, "filename": "/usr/include/libcxx/cctype"}, {"audio": 0, "start": 5331135, "crunched": 0, "end": 5441927, "filename": "/usr/include/libcxx/vector"}, {"audio": 0, "start": 5441927, "crunched": 0, "end": 5591102, "filename": "/usr/include/libcxx/locale"}, {"audio": 0, "start": 5591102, "crunched": 0, "end": 5696532, "filename": "/usr/include/libcxx/deque"}, {"audio": 0, "start": 5696532, "crunched": 0, "end": 5701193, "filename": "/usr/include/libcxx/string.h"}, {"audio": 0, "start": 5701193, "crunched": 0, "end": 5747317, "filename": "/usr/include/libcxx/set"}, {"audio": 0, "start": 5747317, "crunched": 0, "end": 5748302, "filename": "/usr/include/libcxx/clocale"}, {"audio": 0, "start": 5748302, "crunched": 0, "end": 5928921, "filename": "/usr/include/libcxx/memory"}, {"audio": 0, "start": 5928921, "crunched": 0, "end": 5959173, "filename": "/usr/include/libcxx/__config"}, {"audio": 0, "start": 5959173, "crunched": 0, "end": 6017208, "filename": "/usr/include/libcxx/variant"}, {"audio": 0, "start": 6017208, "crunched": 0, "end": 6057721, "filename": "/usr/include/libcxx/limits"}, {"audio": 0, "start": 6057721, "crunched": 0, "end": 6087958, "filename": "/usr/include/libcxx/string_view"}, {"audio": 0, "start": 6087958, "crunched": 0, "end": 6089214, "filename": "/usr/include/libcxx/stddef.h"}, {"audio": 0, "start": 6089214, "crunched": 0, "end": 6093619, "filename": "/usr/include/libcxx/cstdio"}, {"audio": 0, "start": 6093619, "crunched": 0, "end": 6095948, "filename": "/usr/include/libcxx/CMakeLists.txt"}, {"audio": 0, "start": 6095948, "crunched": 0, "end": 6103423, "filename": "/usr/include/libcxx/condition_variable"}, {"audio": 0, "start": 6103423, "crunched": 0, "end": 6121674, "filename": "/usr/include/libcxx/iomanip"}, {"audio": 0, "start": 6121674, "crunched": 0, "end": 6124459, "filename": "/usr/include/libcxx/cstdint"}, {"audio": 0, "start": 6124459, "crunched": 0, "end": 6169749, "filename": "/usr/include/libcxx/complex"}, {"audio": 0, "start": 6169749, "crunched": 0, "end": 6171337, "filename": "/usr/include/libcxx/cfenv"}, {"audio": 0, "start": 6171337, "crunched": 0, "end": 6172126, "filename": "/usr/include/libcxx/setjmp.h"}, {"audio": 0, "start": 6172126, "crunched": 0, "end": 6174652, "filename": "/usr/include/libcxx/cstring"}, {"audio": 0, "start": 6174652, "crunched": 0, "end": 6176660, "filename": "/usr/include/libcxx/__bsd_locale_defaults.h"}, {"audio": 0, "start": 6176660, "crunched": 0, "end": 6193065, "filename": "/usr/include/libcxx/mutex"}, {"audio": 0, "start": 6193065, "crunched": 0, "end": 6215307, "filename": "/usr/include/libcxx/__split_buffer"}, {"audio": 0, "start": 6215307, "crunched": 0, "end": 6223130, "filename": "/usr/include/libcxx/exception"}, {"audio": 0, "start": 6223130, "crunched": 0, "end": 6237922, "filename": "/usr/include/libcxx/__threading_support"}, {"audio": 0, "start": 6237922, "crunched": 0, "end": 6245793, "filename": "/usr/include/libcxx/iosfwd"}, {"audio": 0, "start": 6245793, "crunched": 0, "end": 6294957, "filename": "/usr/include/libcxx/istream"}, {"audio": 0, "start": 6294957, "crunched": 0, "end": 6309309, "filename": "/usr/include/libcxx/shared_mutex"}, {"audio": 0, "start": 6309309, "crunched": 0, "end": 6312127, "filename": "/usr/include/libcxx/typeindex"}, {"audio": 0, "start": 6312127, "crunched": 0, "end": 6383753, "filename": "/usr/include/libcxx/future"}, {"audio": 0, "start": 6383753, "crunched": 0, "end": 6396752, "filename": "/usr/include/libcxx/thread"}, {"audio": 0, "start": 6396752, "crunched": 0, "end": 6409683, "filename": "/usr/include/libcxx/__mutex_base"}, {"audio": 0, "start": 6409683, "crunched": 0, "end": 6629215, "filename": "/usr/include/libcxx/regex"}, {"audio": 0, "start": 6629215, "crunched": 0, "end": 6647537, "filename": "/usr/include/libcxx/__functional_base"}, {"audio": 0, "start": 6647537, "crunched": 0, "end": 6661765, "filename": "/usr/include/libcxx/streambuf"}, {"audio": 0, "start": 6661765, "crunched": 0, "end": 6741262, "filename": "/usr/include/libcxx/functional"}, {"audio": 0, "start": 6741262, "crunched": 0, "end": 6741266, "filename": "/usr/include/libcxx/__libcpp_version"}, {"audio": 0, "start": 6741266, "crunched": 0, "end": 6892371, "filename": "/usr/include/libcxx/string"}, {"audio": 0, "start": 6892371, "crunched": 0, "end": 6895548, "filename": "/usr/include/libcxx/__refstring"}, {"audio": 0, "start": 6895548, "crunched": 0, "end": 6897226, "filename": "/usr/include/libcxx/cwctype"}, {"audio": 0, "start": 6897226, "crunched": 0, "end": 6968489, "filename": "/usr/include/libcxx/map"}, {"audio": 0, "start": 6968489, "crunched": 0, "end": 7009763, "filename": "/usr/include/libcxx/chrono"}, {"audio": 0, "start": 7009763, "crunched": 0, "end": 7048240, "filename": "/usr/include/libcxx/optional"}, {"audio": 0, "start": 7048240, "crunched": 0, "end": 7048786, "filename": "/usr/include/libcxx/cassert"}, {"audio": 0, "start": 7048786, "crunched": 0, "end": 7101946, "filename": "/usr/include/libcxx/tuple"}, {"audio": 0, "start": 7101946, "crunched": 0, "end": 7102964, "filename": "/usr/include/libcxx/__config_site.in"}, {"audio": 0, "start": 7102964, "crunched": 0, "end": 7105002, "filename": "/usr/include/libcxx/stdint.h"}, {"audio": 0, "start": 7105002, "crunched": 0, "end": 7203233, "filename": "/usr/include/libcxx/__tree"}, {"audio": 0, "start": 7203233, "crunched": 0, "end": 7236544, "filename": "/usr/include/libcxx/sstream"}, {"audio": 0, "start": 7236544, "crunched": 0, "end": 7264419, "filename": "/usr/include/libcxx/__string"}, {"audio": 0, "start": 7264419, "crunched": 0, "end": 7265565, "filename": "/usr/include/libcxx/cstddef"}, {"audio": 0, "start": 7265565, "crunched": 0, "end": 7309640, "filename": "/usr/include/libcxx/__functional_03"}, {"audio": 0, "start": 7309640, "crunched": 0, "end": 7332186, "filename": "/usr/include/libcxx/system_error"}, {"audio": 0, "start": 7332186, "crunched": 0, "end": 7352629, "filename": "/usr/include/libcxx/codecvt"}, {"audio": 0, "start": 7352629, "crunched": 0, "end": 7357313, "filename": "/usr/include/libcxx/cstdlib"}, {"audio": 0, "start": 7357313, "crunched": 0, "end": 7366869, "filename": "/usr/include/libcxx/stack"}, {"audio": 0, "start": 7366869, "crunched": 0, "end": 7412917, "filename": "/usr/include/libcxx/math.h"}, {"audio": 0, "start": 7412917, "crunched": 0, "end": 7414376, "filename": "/usr/include/libcxx/limits.h"}, {"audio": 0, "start": 7414376, "crunched": 0, "end": 7428922, "filename": "/usr/include/libcxx/cmath"}, {"audio": 0, "start": 7428922, "crunched": 0, "end": 7430122, "filename": "/usr/include/libcxx/experimental/forward_list"}, {"audio": 0, "start": 7430122, "crunched": 0, "end": 7433026, "filename": "/usr/include/libcxx/experimental/numeric"}, {"audio": 0, "start": 7433026, "crunched": 0, "end": 7434046, "filename": "/usr/include/libcxx/experimental/utility"}, {"audio": 0, "start": 7434046, "crunched": 0, "end": 7453788, "filename": "/usr/include/libcxx/experimental/type_traits"}, {"audio": 0, "start": 7453788, "crunched": 0, "end": 7455875, "filename": "/usr/include/libcxx/experimental/algorithm"}, {"audio": 0, "start": 7455875, "crunched": 0, "end": 7457002, "filename": "/usr/include/libcxx/experimental/list"}, {"audio": 0, "start": 7457002, "crunched": 0, "end": 7459273, "filename": "/usr/include/libcxx/experimental/ratio"}, {"audio": 0, "start": 7459273, "crunched": 0, "end": 7470292, "filename": "/usr/include/libcxx/experimental/dynarray"}, {"audio": 0, "start": 7470292, "crunched": 0, "end": 7472301, "filename": "/usr/include/libcxx/experimental/unordered_map"}, {"audio": 0, "start": 7472301, "crunched": 0, "end": 7475032, "filename": "/usr/include/libcxx/experimental/__memory"}, {"audio": 0, "start": 7475032, "crunched": 0, "end": 7478908, "filename": "/usr/include/libcxx/experimental/iterator"}, {"audio": 0, "start": 7478908, "crunched": 0, "end": 7499502, "filename": "/usr/include/libcxx/experimental/propagate_const"}, {"audio": 0, "start": 7499502, "crunched": 0, "end": 7501314, "filename": "/usr/include/libcxx/experimental/unordered_set"}, {"audio": 0, "start": 7501314, "crunched": 0, "end": 7516191, "filename": "/usr/include/libcxx/experimental/any"}, {"audio": 0, "start": 7516191, "crunched": 0, "end": 7517339, "filename": "/usr/include/libcxx/experimental/vector"}, {"audio": 0, "start": 7517339, "crunched": 0, "end": 7518476, "filename": "/usr/include/libcxx/experimental/deque"}, {"audio": 0, "start": 7518476, "crunched": 0, "end": 7520099, "filename": "/usr/include/libcxx/experimental/set"}, {"audio": 0, "start": 7520099, "crunched": 0, "end": 7521996, "filename": "/usr/include/libcxx/experimental/__config"}, {"audio": 0, "start": 7521996, "crunched": 0, "end": 7557185, "filename": "/usr/include/libcxx/experimental/string_view"}, {"audio": 0, "start": 7557185, "crunched": 0, "end": 7558965, "filename": "/usr/include/libcxx/experimental/regex"}, {"audio": 0, "start": 7558965, "crunched": 0, "end": 7576799, "filename": "/usr/include/libcxx/experimental/functional"}, {"audio": 0, "start": 7576799, "crunched": 0, "end": 7578567, "filename": "/usr/include/libcxx/experimental/string"}, {"audio": 0, "start": 7578567, "crunched": 0, "end": 7580259, "filename": "/usr/include/libcxx/experimental/map"}, {"audio": 0, "start": 7580259, "crunched": 0, "end": 7581629, "filename": "/usr/include/libcxx/experimental/chrono"}, {"audio": 0, "start": 7581629, "crunched": 0, "end": 7606716, "filename": "/usr/include/libcxx/experimental/optional"}, {"audio": 0, "start": 7606716, "crunched": 0, "end": 7608861, "filename": "/usr/include/libcxx/experimental/tuple"}, {"audio": 0, "start": 7608861, "crunched": 0, "end": 7610414, "filename": "/usr/include/libcxx/experimental/system_error"}, {"audio": 0, "start": 7610414, "crunched": 0, "end": 7649071, "filename": "/usr/include/libcxx/ext/hash_map"}, {"audio": 0, "start": 7649071, "crunched": 0, "end": 7652238, "filename": "/usr/include/libcxx/ext/__hash"}, {"audio": 0, "start": 7652238, "crunched": 0, "end": 7677101, "filename": "/usr/include/libcxx/ext/hash_set"}, {"audio": 0, "start": 7677101, "crunched": 0, "end": 7678515, "filename": "/usr/include/libcxx/support/xlocale/__nop_locale_mgmt.h"}, {"audio": 0, "start": 7678515, "crunched": 0, "end": 7682959, "filename": "/usr/include/libcxx/support/xlocale/__posix_l_fallback.h"}, {"audio": 0, "start": 7682959, "crunched": 0, "end": 7682959, "filename": "/usr/include/libcxx/support/xlocale/xlocale.h"}, {"audio": 0, "start": 7682959, "crunched": 0, "end": 7685256, "filename": "/usr/include/libcxx/support/xlocale/__strtonum_fallback.h"}, {"audio": 0, "start": 7685256, "crunched": 0, "end": 7686039, "filename": "/usr/include/libcxx/support/android/locale_bionic.h"}, {"audio": 0, "start": 7686039, "crunched": 0, "end": 7692257, "filename": "/usr/include/libcxx/support/win32/support.h"}, {"audio": 0, "start": 7692257, "crunched": 0, "end": 7693510, "filename": "/usr/include/libcxx/support/win32/locale_mgmt_win32.h"}, {"audio": 0, "start": 7693510, "crunched": 0, "end": 7697546, "filename": "/usr/include/libcxx/support/win32/locale_win32.h"}, {"audio": 0, "start": 7697546, "crunched": 0, "end": 7700394, "filename": "/usr/include/libcxx/support/win32/limits_win32.h"}, {"audio": 0, "start": 7700394, "crunched": 0, "end": 7702255, "filename": "/usr/include/libcxx/support/musl/xlocale.h"}, {"audio": 0, "start": 7702255, "crunched": 0, "end": 7703472, "filename": "/usr/include/libcxx/support/solaris/wchar.h"}, {"audio": 0, "start": 7703472, "crunched": 0, "end": 7705716, "filename": "/usr/include/libcxx/support/solaris/xlocale.h"}, {"audio": 0, "start": 7705716, "crunched": 0, "end": 7706179, "filename": "/usr/include/libcxx/support/solaris/floatingpoint.h"}, {"audio": 0, "start": 7706179, "crunched": 0, "end": 7706904, "filename": "/usr/include/libcxx/support/newlib/xlocale.h"}, {"audio": 0, "start": 7706904, "crunched": 0, "end": 7712597, "filename": "/usr/include/libcxx/support/ibm/xlocale.h"}, {"audio": 0, "start": 7712597, "crunched": 0, "end": 7714277, "filename": "/usr/include/libcxx/support/ibm/support.h"}, {"audio": 0, "start": 7714277, "crunched": 0, "end": 7716718, "filename": "/usr/include/libcxx/support/ibm/locale_mgmt_aix.h"}, {"audio": 0, "start": 7716718, "crunched": 0, "end": 7720315, "filename": "/usr/include/libcxx/support/ibm/limits.h"}, {"audio": 0, "start": 7720315, "crunched": 0, "end": 7726508, "filename": "/usr/include/libc/wchar.h"}, {"audio": 0, "start": 7726508, "crunched": 0, "end": 7726775, "filename": "/usr/include/libc/iso646.h"}, {"audio": 0, "start": 7726775, "crunched": 0, "end": 7728643, "filename": "/usr/include/libc/threads.h"}, {"audio": 0, "start": 7728643, "crunched": 0, "end": 7737626, "filename": "/usr/include/libc/pthread.h"}, {"audio": 0, "start": 7737626, "crunched": 0, "end": 7810242, "filename": "/usr/include/libc/elf.h"}, {"audio": 0, "start": 7810242, "crunched": 0, "end": 7810267, "filename": "/usr/include/libc/syscall.h"}, {"audio": 0, "start": 7810267, "crunched": 0, "end": 7810590, "filename": "/usr/include/libc/errno.h"}, {"audio": 0, "start": 7810590, "crunched": 0, "end": 7811020, "filename": "/usr/include/libc/sysexits.h"}, {"audio": 0, "start": 7811020, "crunched": 0, "end": 7811040, "filename": "/usr/include/libc/memory.h"}, {"audio": 0, "start": 7811040, "crunched": 0, "end": 7811512, "filename": "/usr/include/libc/err.h"}, {"audio": 0, "start": 7811512, "crunched": 0, "end": 7820070, "filename": "/usr/include/libc/tgmath.h"}, {"audio": 0, "start": 7820070, "crunched": 0, "end": 7821068, "filename": "/usr/include/libc/utmp.h"}, {"audio": 0, "start": 7821068, "crunched": 0, "end": 7822828, "filename": "/usr/include/libc/ctype.h"}, {"audio": 0, "start": 7822828, "crunched": 0, "end": 7823223, "filename": "/usr/include/libc/monetary.h"}, {"audio": 0, "start": 7823223, "crunched": 0, "end": 7823680, "filename": "/usr/include/libc/assert.h"}, {"audio": 0, "start": 7823680, "crunched": 0, "end": 7824582, "filename": "/usr/include/libc/paths.h"}, {"audio": 0, "start": 7824582, "crunched": 0, "end": 7828716, "filename": "/usr/include/libc/sched.h"}, {"audio": 0, "start": 7828716, "crunched": 0, "end": 7830458, "filename": "/usr/include/libc/dirent.h"}, {"audio": 0, "start": 7830458, "crunched": 0, "end": 7830774, "filename": "/usr/include/libc/nl_types.h"}, {"audio": 0, "start": 7830774, "crunched": 0, "end": 7836005, "filename": "/usr/include/libc/stdio.h"}, {"audio": 0, "start": 7836005, "crunched": 0, "end": 7836172, "filename": "/usr/include/libc/stdbool.h"}, {"audio": 0, "start": 7836172, "crunched": 0, "end": 7836190, "filename": "/usr/include/libc/lastlog.h"}, {"audio": 0, "start": 7836190, "crunched": 0, "end": 7840828, "filename": "/usr/include/libc/inttypes.h"}, {"audio": 0, "start": 7840828, "crunched": 0, "end": 7841070, "filename": "/usr/include/libc/alloca.h"}, {"audio": 0, "start": 7841070, "crunched": 0, "end": 7842130, "filename": "/usr/include/libc/float.h"}, {"audio": 0, "start": 7842130, "crunched": 0, "end": 7844529, "filename": "/usr/include/libc/stropts.h"}, {"audio": 0, "start": 7844529, "crunched": 0, "end": 7844690, "filename": "/usr/include/libc/libgen.h"}, {"audio": 0, "start": 7844690, "crunched": 0, "end": 7844967, "filename": "/usr/include/libc/crypt.h"}, {"audio": 0, "start": 7844967, "crunched": 0, "end": 7845050, "filename": "/usr/include/libc/readme.txt"}, {"audio": 0, "start": 7845050, "crunched": 0, "end": 7846699, "filename": "/usr/include/libc/locale.h"}, {"audio": 0, "start": 7846699, "crunched": 0, "end": 7848140, "filename": "/usr/include/libc/aio.h"}, {"audio": 0, "start": 7848140, "crunched": 0, "end": 7852825, "filename": "/usr/include/libc/stdlib.h"}, {"audio": 0, "start": 7852825, "crunched": 0, "end": 7853376, "filename": "/usr/include/libc/cpio.h"}, {"audio": 0, "start": 7853376, "crunched": 0, "end": 7853877, "filename": "/usr/include/libc/byteswap.h"}, {"audio": 0, "start": 7853877, "crunched": 0, "end": 7856621, "filename": "/usr/include/libc/syslog.h"}, {"audio": 0, "start": 7856621, "crunched": 0, "end": 7858536, "filename": "/usr/include/libc/wctype.h"}, {"audio": 0, "start": 7858536, "crunched": 0, "end": 7858922, "filename": "/usr/include/libc/fnmatch.h"}, {"audio": 0, "start": 7858922, "crunched": 0, "end": 7859189, "filename": "/usr/include/libc/utime.h"}, {"audio": 0, "start": 7859189, "crunched": 0, "end": 7860131, "filename": "/usr/include/libc/strings.h"}, {"audio": 0, "start": 7860131, "crunched": 0, "end": 7861012, "filename": "/usr/include/libc/libintl.h"}, {"audio": 0, "start": 7861012, "crunched": 0, "end": 7864717, "filename": "/usr/include/libc/complex.h"}, {"audio": 0, "start": 7864717, "crunched": 0, "end": 7865462, "filename": "/usr/include/libc/dlfcn.h"}, {"audio": 0, "start": 7865462, "crunched": 0, "end": 7872084, "filename": "/usr/include/libc/signal.h"}, {"audio": 0, "start": 7872084, "crunched": 0, "end": 7872820, "filename": "/usr/include/libc/semaphore.h"}, {"audio": 0, "start": 7872820, "crunched": 0, "end": 7873667, "filename": "/usr/include/libc/termios.h"}, {"audio": 0, "start": 7873667, "crunched": 0, "end": 7874484, "filename": "/usr/include/libc/pwd.h"}, {"audio": 0, "start": 7874484, "crunched": 0, "end": 7874846, "filename": "/usr/include/libc/malloc.h"}, {"audio": 0, "start": 7874846, "crunched": 0, "end": 7874975, "filename": "/usr/include/libc/stdnoreturn.h"}, {"audio": 0, "start": 7874975, "crunched": 0, "end": 7875576, "filename": "/usr/include/libc/uchar.h"}, {"audio": 0, "start": 7875576, "crunched": 0, "end": 7888799, "filename": "/usr/include/libc/unistd.h"}, {"audio": 0, "start": 7888799, "crunched": 0, "end": 7889649, "filename": "/usr/include/libc/poll.h"}, {"audio": 0, "start": 7889649, "crunched": 0, "end": 7891027, "filename": "/usr/include/libc/search.h"}, {"audio": 0, "start": 7891027, "crunched": 0, "end": 7891526, "filename": "/usr/include/libc/ucontext.h"}, {"audio": 0, "start": 7891526, "crunched": 0, "end": 7894101, "filename": "/usr/include/libc/spawn.h"}, {"audio": 0, "start": 7894101, "crunched": 0, "end": 7894660, "filename": "/usr/include/libc/getopt.h"}, {"audio": 0, "start": 7894660, "crunched": 0, "end": 7895867, "filename": "/usr/include/libc/utmpx.h"}, {"audio": 0, "start": 7895867, "crunched": 0, "end": 7896640, "filename": "/usr/include/libc/features.h"}, {"audio": 0, "start": 7896640, "crunched": 0, "end": 7896727, "filename": "/usr/include/libc/wait.h"}, {"audio": 0, "start": 7896727, "crunched": 0, "end": 7897305, "filename": "/usr/include/libc/tar.h"}, {"audio": 0, "start": 7897305, "crunched": 0, "end": 7897955, "filename": "/usr/include/libc/wordexp.h"}, {"audio": 0, "start": 7897955, "crunched": 0, "end": 7898938, "filename": "/usr/include/libc/link.h"}, {"audio": 0, "start": 7898938, "crunched": 0, "end": 7900945, "filename": "/usr/include/libc/alltypes.h.in"}, {"audio": 0, "start": 7900945, "crunched": 0, "end": 7901257, "filename": "/usr/include/libc/pty.h"}, {"audio": 0, "start": 7901257, "crunched": 0, "end": 7902206, "filename": "/usr/include/libc/grp.h"}, {"audio": 0, "start": 7902206, "crunched": 0, "end": 7902613, "filename": "/usr/include/libc/stdarg.h"}, {"audio": 0, "start": 7902613, "crunched": 0, "end": 7906572, "filename": "/usr/include/libc/netdb.h"}, {"audio": 0, "start": 7906572, "crunched": 0, "end": 7909659, "filename": "/usr/include/libc/string.h"}, {"audio": 0, "start": 7909659, "crunched": 0, "end": 7910258, "filename": "/usr/include/libc/ifaddrs.h"}, {"audio": 0, "start": 7910258, "crunched": 0, "end": 7913689, "filename": "/usr/include/libc/time.h"}, {"audio": 0, "start": 7913689, "crunched": 0, "end": 7914367, "filename": "/usr/include/libc/ftw.h"}, {"audio": 0, "start": 7914367, "crunched": 0, "end": 7915088, "filename": "/usr/include/libc/shadow.h"}, {"audio": 0, "start": 7915088, "crunched": 0, "end": 7915579, "filename": "/usr/include/libc/stddef.h"}, {"audio": 0, "start": 7915579, "crunched": 0, "end": 7916190, "filename": "/usr/include/libc/stdio_ext.h"}, {"audio": 0, "start": 7916190, "crunched": 0, "end": 7917138, "filename": "/usr/include/libc/setjmp.h"}, {"audio": 0, "start": 7917138, "crunched": 0, "end": 7920970, "filename": "/usr/include/libc/fcntl.h"}, {"audio": 0, "start": 7920970, "crunched": 0, "end": 7922979, "filename": "/usr/include/libc/endian.h"}, {"audio": 0, "start": 7922979, "crunched": 0, "end": 7924664, "filename": "/usr/include/libc/langinfo.h"}, {"audio": 0, "start": 7924664, "crunched": 0, "end": 7924975, "filename": "/usr/include/libc/ar.h"}, {"audio": 0, "start": 7924975, "crunched": 0, "end": 7925384, "filename": "/usr/include/libc/stdalign.h"}, {"audio": 0, "start": 7925384, "crunched": 0, "end": 7926230, "filename": "/usr/include/libc/values.h"}, {"audio": 0, "start": 7926230, "crunched": 0, "end": 7926615, "filename": "/usr/include/libc/iconv.h"}, {"audio": 0, "start": 7926615, "crunched": 0, "end": 7927064, "filename": "/usr/include/libc/fenv.h"}, {"audio": 0, "start": 7927064, "crunched": 0, "end": 7930651, "filename": "/usr/include/libc/resolv.h"}, {"audio": 0, "start": 7930651, "crunched": 0, "end": 7931392, "filename": "/usr/include/libc/fmtmsg.h"}, {"audio": 0, "start": 7931392, "crunched": 0, "end": 7932229, "filename": "/usr/include/libc/mntent.h"}, {"audio": 0, "start": 7932229, "crunched": 0, "end": 7932412, "filename": "/usr/include/libc/ulimit.h"}, {"audio": 0, "start": 7932412, "crunched": 0, "end": 7933390, "filename": "/usr/include/libc/mqueue.h"}, {"audio": 0, "start": 7933390, "crunched": 0, "end": 7933564, "filename": "/usr/include/libc/stdc-predef.h"}, {"audio": 0, "start": 7933564, "crunched": 0, "end": 7936142, "filename": "/usr/include/libc/stdint.h"}, {"audio": 0, "start": 7936142, "crunched": 0, "end": 7937369, "filename": "/usr/include/libc/regex.h"}, {"audio": 0, "start": 7937369, "crunched": 0, "end": 7948717, "filename": "/usr/include/libc/math.h"}, {"audio": 0, "start": 7948717, "crunched": 0, "end": 7949577, "filename": "/usr/include/libc/glob.h"}, {"audio": 0, "start": 7949577, "crunched": 0, "end": 7953551, "filename": "/usr/include/libc/limits.h"}, {"audio": 0, "start": 7953551, "crunched": 0, "end": 7959303, "filename": "/usr/include/libc/arpa/telnet.h"}, {"audio": 0, "start": 7959303, "crunched": 0, "end": 7970050, "filename": "/usr/include/libc/arpa/nameser.h"}, {"audio": 0, "start": 7970050, "crunched": 0, "end": 7970077, "filename": "/usr/include/libc/arpa/nameser_compat.h"}, {"audio": 0, "start": 7970077, "crunched": 0, "end": 7970898, "filename": "/usr/include/libc/arpa/ftp.h"}, {"audio": 0, "start": 7970898, "crunched": 0, "end": 7971442, "filename": "/usr/include/libc/arpa/tftp.h"}, {"audio": 0, "start": 7971442, "crunched": 0, "end": 7972249, "filename": "/usr/include/libc/arpa/inet.h"}, {"audio": 0, "start": 7972249, "crunched": 0, "end": 7975093, "filename": "/usr/include/libc/net/if_arp.h"}, {"audio": 0, "start": 7975093, "crunched": 0, "end": 7976270, "filename": "/usr/include/libc/net/ethernet.h"}, {"audio": 0, "start": 7976270, "crunched": 0, "end": 7978898, "filename": "/usr/include/libc/net/route.h"}, {"audio": 0, "start": 7978898, "crunched": 0, "end": 7981989, "filename": "/usr/include/libc/net/if.h"}, {"audio": 0, "start": 7981989, "crunched": 0, "end": 7983333, "filename": "/usr/include/libc/netpacket/packet.h"}, {"audio": 0, "start": 7983333, "crunched": 0, "end": 7984444, "filename": "/usr/include/libc/sys/acct.h"}, {"audio": 0, "start": 7984444, "crunched": 0, "end": 7984473, "filename": "/usr/include/libc/sys/soundcard.h"}, {"audio": 0, "start": 7984473, "crunched": 0, "end": 7987254, "filename": "/usr/include/libc/sys/stat.h"}, {"audio": 0, "start": 7987254, "crunched": 0, "end": 7987335, "filename": "/usr/include/libc/sys/syscall.h"}, {"audio": 0, "start": 7987335, "crunched": 0, "end": 7987421, "filename": "/usr/include/libc/sys/errno.h"}, {"audio": 0, "start": 7987421, "crunched": 0, "end": 7988288, "filename": "/usr/include/libc/sys/msg.h"}, {"audio": 0, "start": 7988288, "crunched": 0, "end": 7989044, "filename": "/usr/include/libc/sys/param.h"}, {"audio": 0, "start": 7989044, "crunched": 0, "end": 7991488, "filename": "/usr/include/libc/sys/fanotify.h"}, {"audio": 0, "start": 7991488, "crunched": 0, "end": 7992555, "filename": "/usr/include/libc/sys/uio.h"}, {"audio": 0, "start": 7992555, "crunched": 0, "end": 7992927, "filename": "/usr/include/libc/sys/utsname.h"}, {"audio": 0, "start": 7992927, "crunched": 0, "end": 7994308, "filename": "/usr/include/libc/sys/personality.h"}, {"audio": 0, "start": 7994308, "crunched": 0, "end": 7999499, "filename": "/usr/include/libc/sys/mtio.h"}, {"audio": 0, "start": 7999499, "crunched": 0, "end": 7999611, "filename": "/usr/include/libc/sys/kd.h"}, {"audio": 0, "start": 7999611, "crunched": 0, "end": 7999912, "filename": "/usr/include/libc/sys/times.h"}, {"audio": 0, "start": 7999912, "crunched": 0, "end": 7999933, "filename": "/usr/include/libc/sys/stropts.h"}, {"audio": 0, "start": 7999933, "crunched": 0, "end": 8000109, "filename": "/usr/include/libc/sys/auxv.h"}, {"audio": 0, "start": 8000109, "crunched": 0, "end": 8000860, "filename": "/usr/include/libc/sys/signalfd.h"}, {"audio": 0, "start": 8000860, "crunched": 0, "end": 8000880, "filename": "/usr/include/libc/sys/syslog.h"}, {"audio": 0, "start": 8000880, "crunched": 0, "end": 8002055, "filename": "/usr/include/libc/sys/procfs.h"}, {"audio": 0, "start": 8002055, "crunched": 0, "end": 8002205, "filename": "/usr/include/libc/sys/klog.h"}, {"audio": 0, "start": 8002205, "crunched": 0, "end": 8003131, "filename": "/usr/include/libc/sys/ttydefaults.h"}, {"audio": 0, "start": 8003131, "crunched": 0, "end": 8003331, "filename": "/usr/include/libc/sys/user.h"}, {"audio": 0, "start": 8003331, "crunched": 0, "end": 8003501, "filename": "/usr/include/libc/sys/ioctl.h"}, {"audio": 0, "start": 8003501, "crunched": 0, "end": 8004737, "filename": "/usr/include/libc/sys/select.h"}, {"audio": 0, "start": 8004737, "crunched": 0, "end": 8004826, "filename": "/usr/include/libc/sys/signal.h"}, {"audio": 0, "start": 8004826, "crunched": 0, "end": 8004918, "filename": "/usr/include/libc/sys/termios.h"}, {"audio": 0, "start": 8004918, "crunched": 0, "end": 8005292, "filename": "/usr/include/libc/sys/reboot.h"}, {"audio": 0, "start": 8005292, "crunched": 0, "end": 8005639, "filename": "/usr/include/libc/sys/cachectl.h"}, {"audio": 0, "start": 8005639, "crunched": 0, "end": 8005749, "filename": "/usr/include/libc/sys/reg.h"}, {"audio": 0, "start": 8005749, "crunched": 0, "end": 8005832, "filename": "/usr/include/libc/sys/poll.h"}, {"audio": 0, "start": 8005832, "crunched": 0, "end": 8006742, "filename": "/usr/include/libc/sys/shm.h"}, {"audio": 0, "start": 8006742, "crunched": 0, "end": 8006764, "filename": "/usr/include/libc/sys/ucontext.h"}, {"audio": 0, "start": 8006764, "crunched": 0, "end": 8006786, "filename": "/usr/include/libc/sys/vt.h"}, {"audio": 0, "start": 8006786, "crunched": 0, "end": 8008654, "filename": "/usr/include/libc/sys/mount.h"}, {"audio": 0, "start": 8008654, "crunched": 0, "end": 8010591, "filename": "/usr/include/libc/sys/types.h"}, {"audio": 0, "start": 8010591, "crunched": 0, "end": 8011876, "filename": "/usr/include/libc/sys/wait.h"}, {"audio": 0, "start": 8011876, "crunched": 0, "end": 8021381, "filename": "/usr/include/libc/sys/socket.h"}, {"audio": 0, "start": 8021381, "crunched": 0, "end": 8023530, "filename": "/usr/include/libc/sys/resource.h"}, {"audio": 0, "start": 8023530, "crunched": 0, "end": 8026195, "filename": "/usr/include/libc/sys/mman.h"}, {"audio": 0, "start": 8026195, "crunched": 0, "end": 8026219, "filename": "/usr/include/libc/sys/vfs.h"}, {"audio": 0, "start": 8026219, "crunched": 0, "end": 8027567, "filename": "/usr/include/libc/sys/inotify.h"}, {"audio": 0, "start": 8027567, "crunched": 0, "end": 8027786, "filename": "/usr/include/libc/sys/io.h"}, {"audio": 0, "start": 8027786, "crunched": 0, "end": 8028294, "filename": "/usr/include/libc/sys/statfs.h"}, {"audio": 0, "start": 8028294, "crunched": 0, "end": 8030347, "filename": "/usr/include/libc/sys/timex.h"}, {"audio": 0, "start": 8030347, "crunched": 0, "end": 8030580, "filename": "/usr/include/libc/sys/fsuid.h"}, {"audio": 0, "start": 8030580, "crunched": 0, "end": 8031224, "filename": "/usr/include/libc/sys/ipc.h"}, {"audio": 0, "start": 8031224, "crunched": 0, "end": 8031618, "filename": "/usr/include/libc/sys/sysmacros.h"}, {"audio": 0, "start": 8031618, "crunched": 0, "end": 8032794, "filename": "/usr/include/libc/sys/statvfs.h"}, {"audio": 0, "start": 8032794, "crunched": 0, "end": 8033808, "filename": "/usr/include/libc/sys/sem.h"}, {"audio": 0, "start": 8033808, "crunched": 0, "end": 8035718, "filename": "/usr/include/libc/sys/time.h"}, {"audio": 0, "start": 8035718, "crunched": 0, "end": 8037994, "filename": "/usr/include/libc/sys/quota.h"}, {"audio": 0, "start": 8037994, "crunched": 0, "end": 8038080, "filename": "/usr/include/libc/sys/fcntl.h"}, {"audio": 0, "start": 8038080, "crunched": 0, "end": 8038412, "filename": "/usr/include/libc/sys/swap.h"}, {"audio": 0, "start": 8038412, "crunched": 0, "end": 8038741, "filename": "/usr/include/libc/sys/sendfile.h"}, {"audio": 0, "start": 8038741, "crunched": 0, "end": 8039145, "filename": "/usr/include/libc/sys/eventfd.h"}, {"audio": 0, "start": 8039145, "crunched": 0, "end": 8040047, "filename": "/usr/include/libc/sys/xattr.h"}, {"audio": 0, "start": 8040047, "crunched": 0, "end": 8040089, "filename": "/usr/include/libc/sys/dir.h"}, {"audio": 0, "start": 8040089, "crunched": 0, "end": 8040723, "filename": "/usr/include/libc/sys/sysinfo.h"}, {"audio": 0, "start": 8040723, "crunched": 0, "end": 8041003, "filename": "/usr/include/libc/sys/timeb.h"}, {"audio": 0, "start": 8041003, "crunched": 0, "end": 8041475, "filename": "/usr/include/libc/sys/un.h"}, {"audio": 0, "start": 8041475, "crunched": 0, "end": 8042729, "filename": "/usr/include/libc/sys/epoll.h"}, {"audio": 0, "start": 8042729, "crunched": 0, "end": 8045440, "filename": "/usr/include/libc/sys/ptrace.h"}, {"audio": 0, "start": 8045440, "crunched": 0, "end": 8045870, "filename": "/usr/include/libc/sys/timerfd.h"}, {"audio": 0, "start": 8045870, "crunched": 0, "end": 8049356, "filename": "/usr/include/libc/sys/prctl.h"}, {"audio": 0, "start": 8049356, "crunched": 0, "end": 8049617, "filename": "/usr/include/libc/sys/file.h"}, {"audio": 0, "start": 8049617, "crunched": 0, "end": 8053522, "filename": "/usr/include/libc/scsi/scsi.h"}, {"audio": 0, "start": 8053522, "crunched": 0, "end": 8056607, "filename": "/usr/include/libc/scsi/sg.h"}, {"audio": 0, "start": 8056607, "crunched": 0, "end": 8056929, "filename": "/usr/include/libc/scsi/scsi_ioctl.h"}, {"audio": 0, "start": 8056929, "crunched": 0, "end": 8060104, "filename": "/usr/include/libc/netinet/if_ether.h"}, {"audio": 0, "start": 8060104, "crunched": 0, "end": 8064741, "filename": "/usr/include/libc/netinet/ip_icmp.h"}, {"audio": 0, "start": 8064741, "crunched": 0, "end": 8065771, "filename": "/usr/include/libc/netinet/igmp.h"}, {"audio": 0, "start": 8065771, "crunched": 0, "end": 8066318, "filename": "/usr/include/libc/netinet/udp.h"}, {"audio": 0, "start": 8066318, "crunched": 0, "end": 8070558, "filename": "/usr/include/libc/netinet/tcp.h"}, {"audio": 0, "start": 8070558, "crunched": 0, "end": 8079190, "filename": "/usr/include/libc/netinet/icmp6.h"}, {"audio": 0, "start": 8079190, "crunched": 0, "end": 8083543, "filename": "/usr/include/libc/netinet/ip.h"}, {"audio": 0, "start": 8083543, "crunched": 0, "end": 8083688, "filename": "/usr/include/libc/netinet/in_systm.h"}, {"audio": 0, "start": 8083688, "crunched": 0, "end": 8084231, "filename": "/usr/include/libc/netinet/ether.h"}, {"audio": 0, "start": 8084231, "crunched": 0, "end": 8095583, "filename": "/usr/include/libc/netinet/in.h"}, {"audio": 0, "start": 8095583, "crunched": 0, "end": 8098277, "filename": "/usr/include/libc/netinet/ip6.h"}, {"audio": 0, "start": 8098277, "crunched": 0, "end": 8109949, "filename": "/usr/include/emscripten/dom_pk_codes.h"}, {"audio": 0, "start": 8109949, "crunched": 0, "end": 8125118, "filename": "/usr/include/emscripten/wire.h"}, {"audio": 0, "start": 8125118, "crunched": 0, "end": 8138326, "filename": "/usr/include/emscripten/threading.h"}, {"audio": 0, "start": 8138326, "crunched": 0, "end": 8146462, "filename": "/usr/include/emscripten/fetch.h"}, {"audio": 0, "start": 8146462, "crunched": 0, "end": 8151575, "filename": "/usr/include/emscripten/em_asm.h"}, {"audio": 0, "start": 8151575, "crunched": 0, "end": 8156641, "filename": "/usr/include/emscripten/vr.h"}, {"audio": 0, "start": 8156641, "crunched": 0, "end": 8176840, "filename": "/usr/include/emscripten/html5.h"}, {"audio": 0, "start": 8176840, "crunched": 0, "end": 8184777, "filename": "/usr/include/emscripten/key_codes.h"}, {"audio": 0, "start": 8184777, "crunched": 0, "end": 8243431, "filename": "/usr/include/emscripten/bind.h"}, {"audio": 0, "start": 8243431, "crunched": 0, "end": 8254591, "filename": "/usr/include/emscripten/emscripten.h"}, {"audio": 0, "start": 8254591, "crunched": 0, "end": 8257691, "filename": "/usr/include/emscripten/trace.h"}, {"audio": 0, "start": 8257691, "crunched": 0, "end": 8273808, "filename": "/usr/include/emscripten/val.h"}, {"audio": 0, "start": 8273808, "crunched": 0, "end": 8327413, "filename": "/usr/include/emscripten/vector.h"}, {"audio": 0, "start": 8327413, "crunched": 0, "end": 8332206, "filename": "/usr/include/EGL/eglplatform.h"}, {"audio": 0, "start": 8332206, "crunched": 0, "end": 8350901, "filename": "/usr/include/EGL/eglext.h"}, {"audio": 0, "start": 8350901, "crunched": 0, "end": 8363254, "filename": "/usr/include/EGL/egl.h"}, {"audio": 0, "start": 8363254, "crunched": 0, "end": 8363689, "filename": "/usr/include/compat/wchar.h"}, {"audio": 0, "start": 8363689, "crunched": 0, "end": 8364547, "filename": "/usr/include/compat/ctype.h"}, {"audio": 0, "start": 8364547, "crunched": 0, "end": 8364956, "filename": "/usr/include/compat/xlocale.h"}, {"audio": 0, "start": 8364956, "crunched": 0, "end": 8365155, "filename": "/usr/include/compat/stdlib.h"}, {"audio": 0, "start": 8365155, "crunched": 0, "end": 8365594, "filename": "/usr/include/compat/wctype.h"}, {"audio": 0, "start": 8365594, "crunched": 0, "end": 8366681, "filename": "/usr/include/compat/malloc.h"}, {"audio": 0, "start": 8366681, "crunched": 0, "end": 8366881, "filename": "/usr/include/compat/stdarg.h"}, {"audio": 0, "start": 8366881, "crunched": 0, "end": 8367418, "filename": "/usr/include/compat/netdb.h"}, {"audio": 0, "start": 8367418, "crunched": 0, "end": 8367630, "filename": "/usr/include/compat/string.h"}, {"audio": 0, "start": 8367630, "crunched": 0, "end": 8367854, "filename": "/usr/include/compat/time.h"}, {"audio": 0, "start": 8367854, "crunched": 0, "end": 8368050, "filename": "/usr/include/compat/math.h"}, {"audio": 0, "start": 8368050, "crunched": 0, "end": 8368462, "filename": "/usr/include/compat/sys/stat.h"}, {"audio": 0, "start": 8368462, "crunched": 0, "end": 8368482, "filename": "/usr/include/compat/sys/unistd.h"}, {"audio": 0, "start": 8368482, "crunched": 0, "end": 8368713, "filename": "/usr/include/compat/sys/sysctl.h"}, {"audio": 0, "start": 8368713, "crunched": 0, "end": 8368871, "filename": "/usr/include/compat/sys/socketvar.h"}, {"audio": 0, "start": 8368871, "crunched": 0, "end": 8369533, "filename": "/usr/include/compat/sys/timeb.h"}, {"audio": 0, "start": 8369533, "crunched": 0, "end": 8377669, "filename": "/usr/lib/libcxxabi/include/unwind.h"}, {"audio": 0, "start": 8377669, "crunched": 0, "end": 8390383, "filename": "/usr/lib/libcxxabi/include/libunwind.h"}, {"audio": 0, "start": 8390383, "crunched": 0, "end": 8396388, "filename": "/usr/lib/libcxxabi/include/cxxabi.h"}, {"audio": 0, "start": 8396388, "crunched": 0, "end": 8415832, "filename": "/usr/lib/libcxxabi/include/mach-o/compact_unwind_encoding.h"}, {"audio": 0, "start": 8415832, "crunched": 0, "end": 8415832, "filename": "/usr/lib/libc/musl/arch/emscripten/crt_arch.h"}, {"audio": 0, "start": 8415832, "crunched": 0, "end": 8419657, "filename": "/usr/lib/libc/musl/arch/emscripten/atomic_arch.h"}, {"audio": 0, "start": 8419657, "crunched": 0, "end": 8424529, "filename": "/usr/lib/libc/musl/arch/emscripten/syscall_arch.h"}, {"audio": 0, "start": 8424529, "crunched": 0, "end": 8424656, "filename": "/usr/lib/libc/musl/arch/emscripten/pthread_arch.h"}, {"audio": 0, "start": 8424656, "crunched": 0, "end": 8425117, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/stat.h"}, {"audio": 0, "start": 8425117, "crunched": 0, "end": 8444248, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/syscall.h"}, {"audio": 0, "start": 8444248, "crunched": 0, "end": 8447917, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/errno.h"}, {"audio": 0, "start": 8447917, "crunched": 0, "end": 8448204, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/msg.h"}, {"audio": 0, "start": 8448204, "crunched": 0, "end": 8448683, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/float.h"}, {"audio": 0, "start": 8448683, "crunched": 0, "end": 8449837, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/user.h"}, {"audio": 0, "start": 8449837, "crunched": 0, "end": 8454962, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/ioctl.h"}, {"audio": 0, "start": 8454962, "crunched": 0, "end": 8457758, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/signal.h"}, {"audio": 0, "start": 8457758, "crunched": 0, "end": 8461002, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/termios.h"}, {"audio": 0, "start": 8461002, "crunched": 0, "end": 8461287, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/reg.h"}, {"audio": 0, "start": 8461287, "crunched": 0, "end": 8461287, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/poll.h"}, {"audio": 0, "start": 8461287, "crunched": 0, "end": 8461587, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/shm.h"}, {"audio": 0, "start": 8461587, "crunched": 0, "end": 8472477, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/alltypes.h"}, {"audio": 0, "start": 8472477, "crunched": 0, "end": 8472716, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/socket.h"}, {"audio": 0, "start": 8472716, "crunched": 0, "end": 8473425, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/alltypes.h.in"}, {"audio": 0, "start": 8473425, "crunched": 0, "end": 8473427, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/resource.h"}, {"audio": 0, "start": 8473427, "crunched": 0, "end": 8474990, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/mman.h"}, {"audio": 0, "start": 8474990, "crunched": 0, "end": 8474990, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/io.h"}, {"audio": 0, "start": 8474990, "crunched": 0, "end": 8475185, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/statfs.h"}, {"audio": 0, "start": 8475185, "crunched": 0, "end": 8475370, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/stdarg.h"}, {"audio": 0, "start": 8475370, "crunched": 0, "end": 8475549, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/ipc.h"}, {"audio": 0, "start": 8475549, "crunched": 0, "end": 8475791, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/sem.h"}, {"audio": 0, "start": 8475791, "crunched": 0, "end": 8475827, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/setjmp.h"}, {"audio": 0, "start": 8475827, "crunched": 0, "end": 8476669, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/fcntl.h"}, {"audio": 0, "start": 8476669, "crunched": 0, "end": 8476706, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/endian.h"}, {"audio": 0, "start": 8476706, "crunched": 0, "end": 8477483, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/fenv.h"}, {"audio": 0, "start": 8477483, "crunched": 0, "end": 8477551, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/posix.h"}, {"audio": 0, "start": 8477551, "crunched": 0, "end": 8478091, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/stdint.h"}, {"audio": 0, "start": 8478091, "crunched": 0, "end": 8478345, "filename": "/usr/lib/libc/musl/arch/emscripten/bits/limits.h"}], "remote_package_size": 8478345, "package_uuid": "ae55fc8a-1c5e-4ad1-a07a-8b4591008c5c"});

})();



// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() thread proxied to worker. (with Emscripten -s PROXY_TO_WORKER=1) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)

if (Module['ENVIRONMENT']) {
  if (Module['ENVIRONMENT'] === 'WEB') {
    ENVIRONMENT_IS_WEB = true;
  } else if (Module['ENVIRONMENT'] === 'WORKER') {
    ENVIRONMENT_IS_WORKER = true;
  } else if (Module['ENVIRONMENT'] === 'NODE') {
    ENVIRONMENT_IS_NODE = true;
  } else if (Module['ENVIRONMENT'] === 'SHELL') {
    ENVIRONMENT_IS_SHELL = true;
  } else {
    throw new Error('The provided Module[\'ENVIRONMENT\'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.');
  }
} else {
  ENVIRONMENT_IS_WEB = typeof window === 'object';
  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function' && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
}


if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = console.log;
  if (!Module['printErr']) Module['printErr'] = console.warn;

  var nodeFS;
  var nodePath;

  Module['read'] = function shell_read(filename, binary) {
    var ret;
      if (!nodeFS) nodeFS = require('fs');
      if (!nodePath) nodePath = require('path');
      filename = nodePath['normalize'](filename);
      ret = nodeFS['readFileSync'](filename);
    return binary ? ret : ret.toString();
  };

  Module['readBinary'] = function readBinary(filename) {
    var ret = Module['read'](filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };

  if (!Module['thisProgram']) {
    if (process['argv'].length > 1) {
      Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
    } else {
      Module['thisProgram'] = 'unknown-program';
    }
  }

  Module['arguments'] = process['argv'].slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
  // Currently node will swallow unhandled rejections, but this behavior is
  // deprecated, and in the future it will exit with error status.
  process['on']('unhandledRejection', function(reason, p) {
    Module['printErr']('node.js exiting due to unhandled promise rejection');
    process['exit'](1);
  });

  Module['inspect'] = function () { return '[Emscripten Module object]'; };
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = function shell_read(f) {
      return read(f);
    };
  } else {
    Module['read'] = function shell_read() { throw 'no read() available' };
  }

  Module['readBinary'] = function readBinary(f) {
    var data;
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof quit === 'function') {
    Module['quit'] = function(status, toThrow) {
      quit(status);
    }
  }
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function shell_read(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
  };

  if (ENVIRONMENT_IS_WORKER) {
    Module['readBinary'] = function readBinary(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(xhr.response);
    };
  }

  Module['readAsync'] = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function shell_print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function shell_printErr(x) {
      console.warn(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (typeof Module['setWindowTitle'] === 'undefined') {
    Module['setWindowTitle'] = function(title) { document.title = title };
  }
}
else {
  // Unreachable because SHELL is dependent on the others
  throw new Error('Unknown runtime environment. Where are we?');
}

if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
if (!Module['thisProgram']) {
  Module['thisProgram'] = './this.program';
}
if (!Module['quit']) {
  Module['quit'] = function(status, toThrow) {
    throw toThrow;
  }
}

// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = undefined;



// {{PREAMBLE_ADDITIONS}}

var STACK_ALIGN = 16;

// stack management, and other functionality that is provided by the compiled code,
// should not be used before it is ready
stackSave = stackRestore = stackAlloc = setTempRet0 = getTempRet0 = function() {
  abort('cannot use the stack before compiled code is ready to run, and has provided stack access');
};

function staticAlloc(size) {
  assert(!staticSealed);
  var ret = STATICTOP;
  STATICTOP = (STATICTOP + size + 15) & -16;
  return ret;
}

function dynamicAlloc(size) {
  assert(DYNAMICTOP_PTR);
  var ret = HEAP32[DYNAMICTOP_PTR>>2];
  var end = (ret + size + 15) & -16;
  HEAP32[DYNAMICTOP_PTR>>2] = end;
  if (end >= TOTAL_MEMORY) {
    var success = enlargeMemory();
    if (!success) {
      HEAP32[DYNAMICTOP_PTR>>2] = ret;
      return 0;
    }
  }
  return ret;
}

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  var ret = size = Math.ceil(size / factor) * factor;
  return ret;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 === 0);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    Module.printErr(text);
  }
}



var functionPointers = new Array(0);

function addFunction(func) {
  for (var i = 0; i < functionPointers.length; i++) {
    if (!functionPointers[i]) {
      functionPointers[i] = func;
      return 2*(1 + i);
    }
  }
  throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
}

function removeFunction(index) {
  functionPointers[(index-2)/2] = null;
}

var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}


function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

function dynCall(sig, ptr, args) {
  if (args && args.length) {
    assert(args.length == sig.length-1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    assert(sig.length == 1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].call(null, ptr);
  }
}


function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}

var Runtime = {
  // FIXME backwards compatibility layer for ports. Support some Runtime.*
  //       for now, fix it there, then remove it from here. That way we
  //       can minimize any period of breakage.
  dynCall: dynCall, // for SDL2 port
  // helpful errors
  getTempRet0: function() { abort('getTempRet0() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  staticAlloc: function() { abort('staticAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  stackAlloc: function() { abort('stackAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
};

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 1024;



// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html


function getSafeHeapType(bytes, isFloat) {
  switch (bytes) {
    case 1: return 'i8';
    case 2: return 'i16';
    case 4: return isFloat ? 'float' : 'i32';
    case 8: return 'double';
    default: assert(0);
  }
}


function SAFE_HEAP_STORE(dest, value, bytes, isFloat) {
  if (dest <= 0) abort('segmentation fault storing ' + bytes + ' bytes to address ' + dest);
  if (dest % bytes !== 0) abort('alignment error storing to address ' + dest + ', which was expected to be aligned to a multiple of ' + bytes);
  if (staticSealed) {
    if (dest + bytes > HEAP32[DYNAMICTOP_PTR>>2]) abort('segmentation fault, exceeded the top of the available dynamic heap when storing ' + bytes + ' bytes to address ' + dest + '. STATICTOP=' + STATICTOP + ', DYNAMICTOP=' + HEAP32[DYNAMICTOP_PTR>>2]);
    assert(DYNAMICTOP_PTR);
    assert(HEAP32[DYNAMICTOP_PTR>>2] <= TOTAL_MEMORY);
  } else {
    if (dest + bytes > STATICTOP) abort('segmentation fault, exceeded the top of the available static heap when storing ' + bytes + ' bytes to address ' + dest + '. STATICTOP=' + STATICTOP);
  }
  setValue(dest, value, getSafeHeapType(bytes, isFloat), 1);
}
function SAFE_HEAP_STORE_D(dest, value, bytes) {
  SAFE_HEAP_STORE(dest, value, bytes, true);
}

function SAFE_HEAP_LOAD(dest, bytes, unsigned, isFloat) {
  if (dest <= 0) abort('segmentation fault loading ' + bytes + ' bytes from address ' + dest);
  if (dest % bytes !== 0) abort('alignment error loading from address ' + dest + ', which was expected to be aligned to a multiple of ' + bytes);
  if (staticSealed) {
    if (dest + bytes > HEAP32[DYNAMICTOP_PTR>>2]) abort('segmentation fault, exceeded the top of the available dynamic heap when loading ' + bytes + ' bytes from address ' + dest + '. STATICTOP=' + STATICTOP + ', DYNAMICTOP=' + HEAP32[DYNAMICTOP_PTR>>2]);
    assert(DYNAMICTOP_PTR);
    assert(HEAP32[DYNAMICTOP_PTR>>2] <= TOTAL_MEMORY);
  } else {
    if (dest + bytes > STATICTOP) abort('segmentation fault, exceeded the top of the available static heap when loading ' + bytes + ' bytes from address ' + dest + '. STATICTOP=' + STATICTOP);
  }
  var type = getSafeHeapType(bytes, isFloat);
  var ret = getValue(dest, type, 1);
  if (unsigned) ret = unSign(ret, parseInt(type.substr(1)), 1);
  return ret;
}
function SAFE_HEAP_LOAD_D(dest, bytes, unsigned) {
  return SAFE_HEAP_LOAD(dest, bytes, unsigned, true);
}

function SAFE_FT_MASK(value, mask) {
  var ret = value & mask;
  if (ret !== value) {
    abort('Function table mask error: function pointer is ' + value + ' which is masked by ' + mask + ', the likely cause of this is that the function pointer is being called by the wrong type.');
  }
  return ret;
}

function segfault() {
  abort('segmentation fault');
}
function alignfault() {
  abort('alignment fault');
}
function ftfault() {
  abort('Function table mask error');
}

//========================================
// Runtime essentials
//========================================

var ABORT = 0; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

var JSfuncs = {
  // Helpers for cwrap -- it can't refer to Runtime directly because it might
  // be renamed by closure, instead it calls JSfuncs['stackSave'].body to find
  // out what the minified function name is.
  'stackSave': function() {
    stackSave()
  },
  'stackRestore': function() {
    stackRestore()
  },
  // type conversion from js to c
  'arrayToC' : function(arr) {
    var ret = stackAlloc(arr.length);
    writeArrayToMemory(arr, ret);
    return ret;
  },
  'stringToC' : function(str) {
    var ret = 0;
    if (str !== null && str !== undefined && str !== 0) { // null string
      // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
      var len = (str.length << 2) + 1;
      ret = stackAlloc(len);
      stringToUTF8(str, ret, len);
    }
    return ret;
  }
};
// For fast lookup of conversion functions
var toC = {'string' : JSfuncs['stringToC'], 'array' : JSfuncs['arrayToC']};

// C calling interface.
function ccall (ident, returnType, argTypes, args, opts) {
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  if (returnType === 'string') ret = Pointer_stringify(ret);
  if (stack !== 0) {
    stackRestore(stack);
  }
  return ret;
}

function cwrap (ident, returnType, argTypes) {
  argTypes = argTypes || [];
  var cfunc = getCFunc(ident);
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs = argTypes.every(function(type){ return type === 'number'});
  var numericRet = returnType !== 'string';
  if (numericRet && numericArgs) {
    return cfunc;
  }
  return function() {
    return ccall(ident, returnType, argTypes, arguments);
  }
}

Module["ccall"] = ccall;
if (!Module["cwrap"]) Module["cwrap"] = function() { abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

/** @type {function(number, number, string, boolean=)} */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
  if (noSafe) {
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
  } else {
    switch(type) {
      case 'i1': SAFE_HEAP_STORE(((ptr)|0), ((value)|0), 1); break;
      case 'i8': SAFE_HEAP_STORE(((ptr)|0), ((value)|0), 1); break;
      case 'i16': SAFE_HEAP_STORE(((ptr)|0), ((value)|0), 2); break;
      case 'i32': SAFE_HEAP_STORE(((ptr)|0), ((value)|0), 4); break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],SAFE_HEAP_STORE(((ptr)|0), ((tempI64[0])|0), 4),SAFE_HEAP_STORE((((ptr)+(4))|0), ((tempI64[1])|0), 4)); break;
      case 'float': SAFE_HEAP_STORE_D(((ptr)|0), Math_fround(value), 4); break;
      case 'double': SAFE_HEAP_STORE_D(((ptr)|0), (+(value)), 8); break;
      default: abort('invalid type for setValue: ' + type);
    }
  }
}
if (!Module["setValue"]) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

/** @type {function(number, string, boolean=)} */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
  if (noSafe) {
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  } else {
    switch(type) {
      case 'i1': return ((SAFE_HEAP_LOAD(((ptr)|0), 1, 0))|0);
      case 'i8': return ((SAFE_HEAP_LOAD(((ptr)|0), 1, 0))|0);
      case 'i16': return ((SAFE_HEAP_LOAD(((ptr)|0), 2, 0))|0);
      case 'i32': return ((SAFE_HEAP_LOAD(((ptr)|0), 4, 0))|0);
      case 'i64': return ((SAFE_HEAP_LOAD(((ptr)|0), 8, 0))|0);
      case 'float': return Math_fround(SAFE_HEAP_LOAD_D(((ptr)|0), 4, 0));
      case 'double': return (+(SAFE_HEAP_LOAD_D(((ptr)|0), 8, 0)));
      default: abort('invalid type for getValue: ' + type);
    }
  }
  return null;
}
if (!Module["getValue"]) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
if (!Module["ALLOC_NORMAL"]) Object.defineProperty(Module, "ALLOC_NORMAL", { get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_STACK"]) Object.defineProperty(Module, "ALLOC_STACK", { get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_STATIC"]) Object.defineProperty(Module, "ALLOC_STATIC", { get: function() { abort("'ALLOC_STATIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_DYNAMIC"]) Object.defineProperty(Module, "ALLOC_DYNAMIC", { get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_NONE"]) Object.defineProperty(Module, "ALLOC_NONE", { get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [typeof _malloc === 'function' ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
if (!Module["allocate"]) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!staticSealed) return staticAlloc(size);
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}
Module["getMemory"] = getMemory;

/** @type {function(number, number=)} */
function Pointer_stringify(ptr, length) {
  if (length === 0 || !ptr) return '';
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = 0;
  var t;
  var i = 0;
  while (1) {
    assert(ptr + i < TOTAL_MEMORY);
    t = ((SAFE_HEAP_LOAD((((ptr)+(i))|0), 1, 1))|0);
    hasUtf |= t;
    if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (hasUtf < 128) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  return UTF8ToString(ptr);
}
if (!Module["Pointer_stringify"]) Module["Pointer_stringify"] = function() { abort("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = ((SAFE_HEAP_LOAD(((ptr++)|0), 1, 0))|0);
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}
if (!Module["AsciiToString"]) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}
if (!Module["stringToAscii"]) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
function UTF8ArrayToString(u8Array, idx) {
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  while (u8Array[endPtr]) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var u0, u1, u2, u3, u4, u5;

    var str = '';
    while (1) {
      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
      u0 = u8Array[idx++];
      if (!u0) return str;
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u3 = u8Array[idx++] & 63;
        if ((u0 & 0xF8) == 0xF0) {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
        } else {
          u4 = u8Array[idx++] & 63;
          if ((u0 & 0xFC) == 0xF8) {
            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
          } else {
            u5 = u8Array[idx++] & 63;
            u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
          }
        }
      }
      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
}
if (!Module["UTF8ArrayToString"]) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function UTF8ToString(ptr) {
  return UTF8ArrayToString(HEAPU8,ptr);
}
if (!Module["UTF8ToString"]) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x1FFFFF) {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x3FFFFFF) {
      if (outIdx + 4 >= endIdx) break;
      outU8Array[outIdx++] = 0xF8 | (u >> 24);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 5 >= endIdx) break;
      outU8Array[outIdx++] = 0xFC | (u >> 30);
      outU8Array[outIdx++] = 0x80 | ((u >> 24) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}
if (!Module["stringToUTF8Array"]) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}
if (!Module["stringToUTF8"]) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      ++len;
    } else if (u <= 0x7FF) {
      len += 2;
    } else if (u <= 0xFFFF) {
      len += 3;
    } else if (u <= 0x1FFFFF) {
      len += 4;
    } else if (u <= 0x3FFFFFF) {
      len += 5;
    } else {
      len += 6;
    }
  }
  return len;
}
if (!Module["lengthBytesUTF8"]) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = ((SAFE_HEAP_LOAD((((ptr)+(i*2))|0), 2, 0))|0);
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}
if (!Module["UTF16ToString"]) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    SAFE_HEAP_STORE(((outPtr)|0), ((codeUnit)|0), 2);
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  SAFE_HEAP_STORE(((outPtr)|0), ((0)|0), 2);
  return outPtr - startPtr;
}
if (!Module["stringToUTF16"]) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}
if (!Module["lengthBytesUTF16"]) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function UTF32ToString(ptr) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = ((SAFE_HEAP_LOAD((((ptr)+(i*4))|0), 4, 0))|0);
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
if (!Module["UTF32ToString"]) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    SAFE_HEAP_STORE(((outPtr)|0), ((codeUnit)|0), 4);
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  SAFE_HEAP_STORE(((outPtr)|0), ((0)|0), 4);
  return outPtr - startPtr;
}
if (!Module["stringToUTF32"]) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}
if (!Module["lengthBytesUTF32"]) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function demangle(func) {
  var __cxa_demangle_func = Module['___cxa_demangle'] || Module['__cxa_demangle'];
  assert(__cxa_demangle_func);
  try {
    var s =
      func;
    var len = lengthBytesUTF8(s)+1;
    var buf = _malloc(len);
    stringToUTF8(s, buf, len);
    var status = _malloc(4);
    var ret = __cxa_demangle_func(buf, 0, 0, status);
    if (((SAFE_HEAP_LOAD(((status)|0), 4, 0))|0) === 0 && ret) {
      return Pointer_stringify(ret);
    }
    // otherwise, libcxxabi failed
  } catch(e) {
    // ignore problems here
  } finally {
    if (buf) _free(buf);
    if (status) _free(status);
    if (ret) _free(ret);
  }
  // failure when using libcxxabi, don't demangle
  return func;
}

function demangleAll(text) {
  var regex =
    /_Z[\w\d_]+/g;
  return text.replace(regex,
    function(x) {
      var y = demangle(x);
      return x === y ? x : (x + ' [' + y + ']');
    });
}

function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
    // so try that as a special-case.
    try {
      throw new Error(0);
    } catch(e) {
      err = e;
    }
    if (!err.stack) {
      return '(no stack trace available)';
    }
  }
  return err.stack.toString();
}

function stackTrace() {
  var js = jsStackTrace();
  if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
  return demangleAll(js);
}
if (!Module["stackTrace"]) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
var MIN_TOTAL_MEMORY = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBuffer(buf) {
  Module['buffer'] = buffer = buf;
}

function updateGlobalBufferViews() {
  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
}

var STATIC_BASE, STATICTOP, staticSealed; // static area
var STACK_BASE, STACKTOP, STACK_MAX; // stack area
var DYNAMIC_BASE, DYNAMICTOP_PTR; // dynamic area handled by sbrk

  STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
  staticSealed = false;


// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  HEAPU32[(STACK_MAX >> 2)-1] = 0x02135467;
  HEAPU32[(STACK_MAX >> 2)-2] = 0x89BACDFE;
}

function checkStackCookie() {
  if (HEAPU32[(STACK_MAX >> 2)-1] != 0x02135467 || HEAPU32[(STACK_MAX >> 2)-2] != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x' + HEAPU32[(STACK_MAX >> 2)-2].toString(16) + ' ' + HEAPU32[(STACK_MAX >> 2)-1].toString(16));
  }
  // Also test the global address 0 for integrity. This check is not compatible with SAFE_SPLIT_MEMORY though, since that mode already tests all address 0 accesses on its own.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) throw 'Runtime error: The application has corrupted its heap memory area (address zero)!';
}

function abortStackOverflow(allocSize) {
  abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
}

function abortOnCannotGrowMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
}

if (!Module['reallocBuffer']) Module['reallocBuffer'] = function(size) {
  var ret;
  try {
    if (ArrayBuffer.transfer) {
      ret = ArrayBuffer.transfer(buffer, size);
    } else {
      var oldHEAP8 = HEAP8;
      ret = new ArrayBuffer(size);
      var temp = new Int8Array(ret);
      temp.set(oldHEAP8);
    }
  } catch(e) {
    return false;
  }
  var success = _emscripten_replace_memory(ret);
  if (!success) return false;
  return ret;
};

function enlargeMemory() {
  // TOTAL_MEMORY is the current size of the actual array, and DYNAMICTOP is the new top.
  assert(HEAP32[DYNAMICTOP_PTR>>2] > TOTAL_MEMORY); // This function should only ever be called after the ceiling of the dynamic heap has already been bumped to exceed the current total size of the asm.js heap.


  var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; // In wasm, heap size must be a multiple of 64KB. In asm.js, they need to be multiples of 16MB.
  var LIMIT = 2147483648 - PAGE_MULTIPLE; // We can do one page short of 2GB as theoretical maximum.

  if (HEAP32[DYNAMICTOP_PTR>>2] > LIMIT) {
    Module.printErr('Cannot enlarge memory, asked to go up to ' + HEAP32[DYNAMICTOP_PTR>>2] + ' bytes, but the limit is ' + LIMIT + ' bytes!');
    return false;
  }

  var OLD_TOTAL_MEMORY = TOTAL_MEMORY;
  TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY); // So the loop below will not be infinite, and minimum asm.js memory size is 16MB.

  while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR>>2]) { // Keep incrementing the heap size as long as it's less than what is requested.
    if (TOTAL_MEMORY <= 536870912) {
      TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE); // Simple heuristic: double until 1GB...
    } else {
      TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT); // ..., but after that, add smaller increments towards 2GB, which we cannot reach
    }
  }

  var start = Date.now();

  var replacement = Module['reallocBuffer'](TOTAL_MEMORY);
  if (!replacement || replacement.byteLength != TOTAL_MEMORY) {
    Module.printErr('Failed to grow the heap from ' + OLD_TOTAL_MEMORY + ' bytes to ' + TOTAL_MEMORY + ' bytes, not enough memory!');
    if (replacement) {
      Module.printErr('Expected to get back a buffer of size ' + TOTAL_MEMORY + ' bytes, but instead got back a buffer of size ' + replacement.byteLength);
    }
    // restore the state to before this call, we failed
    TOTAL_MEMORY = OLD_TOTAL_MEMORY;
    return false;
  }

  // everything worked

  updateGlobalBuffer(replacement);
  updateGlobalBufferViews();

  Module.printErr('enlarged memory arrays from ' + OLD_TOTAL_MEMORY + ' to ' + TOTAL_MEMORY + ', took ' + (Date.now() - start) + ' ms (has ArrayBuffer.transfer? ' + (!!ArrayBuffer.transfer) + ')');

  if (!Module["usingWasm"]) {
    Module.printErr('Warning: Enlarging memory arrays, this is not fast! ' + [OLD_TOTAL_MEMORY, TOTAL_MEMORY]);
  }


  return true;
}

var byteLength;
try {
  byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get);
  byteLength(new ArrayBuffer(4)); // can fail on older ie
} catch(e) { // can fail on older node/v8
  byteLength = function(buffer) { return buffer.byteLength; };
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr('TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
       'JS engine does not provide full typed array support');



// Use a provided buffer, if there is one, or else allocate a new one
if (Module['buffer']) {
  buffer = Module['buffer'];
  assert(buffer.byteLength === TOTAL_MEMORY, 'provided buffer should be ' + TOTAL_MEMORY + ' bytes, but it is ' + buffer.byteLength);
} else {
  // Use a WebAssembly memory where available
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    assert(TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
    Module['wasmMemory'] = new WebAssembly.Memory({ 'initial': TOTAL_MEMORY / WASM_PAGE_SIZE });
    buffer = Module['wasmMemory'].buffer;
  } else
  {
    buffer = new ArrayBuffer(TOTAL_MEMORY);
  }
  assert(buffer.byteLength === TOTAL_MEMORY);
}
updateGlobalBufferViews();


function getTotalMemory() {
  return TOTAL_MEMORY;
}

// Endianness check (note: assumes compiler arch was little-endian)
  HEAP32[0] = 0x63736d65; /* 'emsc' */
HEAP16[1] = 0x6373;
if (HEAPU8[2] !== 0x73 || HEAPU8[3] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';

Module['HEAP'] = HEAP;
Module['buffer'] = buffer;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  checkStackCookie();
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  callRuntimeCallbacks(__ATEXIT__);
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
if (!Module["addOnPreRun"]) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
if (!Module["addOnInit"]) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
if (!Module["addOnPreMain"]) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
if (!Module["addOnExit"]) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
if (!Module["addOnPostRun"]) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}
if (!Module["writeStringToMemory"]) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}
if (!Module["writeArrayToMemory"]) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    SAFE_HEAP_STORE(((buffer++)|0), ((str.charCodeAt(i))|0), 1);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) SAFE_HEAP_STORE(((buffer)|0), ((0)|0), 1);
}
if (!Module["writeAsciiToMemory"]) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

assert(Math['imul'] && Math['fround'] && Math['clz32'] && Math['trunc'], 'this is a legacy browser, build with LEGACY_VM_SUPPORT');

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
  return id;
}

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 10000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}
Module["addRunDependency"] = addRunDependency;

function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module["removeRunDependency"] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data



var memoryInitializer = null;






// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return String.prototype.startsWith ?
      filename.startsWith(dataURIPrefix) :
      filename.indexOf(dataURIPrefix) === 0;
}




function integrateWasmJS() {
  // wasm.js has several methods for creating the compiled code module here:
  //  * 'native-wasm' : use native WebAssembly support in the browser
  //  * 'interpret-s-expr': load s-expression code from a .wast and interpret
  //  * 'interpret-binary': load binary wasm and interpret
  //  * 'interpret-asm2wasm': load asm.js code, translate to wasm, and interpret
  //  * 'asmjs': no wasm, just load the asm.js code and use that (good for testing)
  // The method is set at compile time (BINARYEN_METHOD)
  // The method can be a comma-separated list, in which case, we will try the
  // options one by one. Some of them can fail gracefully, and then we can try
  // the next.

  // inputs

  var method = 'native-wasm';

  var wasmTextFile = 'clang.wast';
  var wasmBinaryFile = 'clang.wasm';
  var asmjsCodeFile = 'clang.asm.js';

  if (typeof Module['locateFile'] === 'function') {
    if (!isDataURI(wasmTextFile)) {
      wasmTextFile = Module['locateFile'](wasmTextFile);
    }
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = Module['locateFile'](wasmBinaryFile);
    }
    if (!isDataURI(asmjsCodeFile)) {
      asmjsCodeFile = Module['locateFile'](asmjsCodeFile);
    }
  }

  // utilities

  var wasmPageSize = 64*1024;

  var info = {
    'global': null,
    'env': null,
    'asm2wasm': { // special asm2wasm imports
      "f64-rem": function(x, y) {
        return x % y;
      },
      "debugger": function() {
        debugger;
      }
    },
    'parent': Module // Module inside wasm-js.cpp refers to wasm-js.cpp; this allows access to the outside program.
  };

  var exports = null;


  function mergeMemory(newBuffer) {
    // The wasm instance creates its memory. But static init code might have written to
    // buffer already, including the mem init file, and we must copy it over in a proper merge.
    // TODO: avoid this copy, by avoiding such static init writes
    // TODO: in shorter term, just copy up to the last static init write
    var oldBuffer = Module['buffer'];
    if (newBuffer.byteLength < oldBuffer.byteLength) {
      Module['printErr']('the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here');
    }
    var oldView = new Int8Array(oldBuffer);
    var newView = new Int8Array(newBuffer);


    newView.set(oldView);
    updateGlobalBuffer(newBuffer);
    updateGlobalBufferViews();
  }

  function fixImports(imports) {
    var ret = {};
    for (var i in imports) {
      var fixed = i;
      if (fixed[0] == '_') fixed = fixed.substr(1);
      ret[fixed] = imports[i];
    }
    return ret;
  }

  function getBinary() {
    try {
      if (Module['wasmBinary']) {
        return new Uint8Array(Module['wasmBinary']);
      }
      if (Module['readBinary']) {
        return Module['readBinary'](wasmBinaryFile);
      } else {
        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
      }
    }
    catch (err) {
      abort(err);
    }
  }

  function getBinaryPromise() {
    // if we don't have the binary yet, and have the Fetch api, use that
    // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
    if (!Module['wasmBinary'] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
        return getBinary();
      });
    }
    // Otherwise, getBinary should be able to get it synchronously
    return new Promise(function(resolve, reject) {
      resolve(getBinary());
    });
  }

  // do-method functions


  function doNativeWasm(global, env, providedBuffer) {
    if (typeof WebAssembly !== 'object') {
      Module['printErr']('no native wasm support detected');
      return false;
    }
    // prepare memory import
    if (!(Module['wasmMemory'] instanceof WebAssembly.Memory)) {
      Module['printErr']('no native wasm Memory in use');
      return false;
    }
    env['memory'] = Module['wasmMemory'];
    // Load the wasm module and create an instance of using native support in the JS engine.
    info['global'] = {
      'NaN': NaN,
      'Infinity': Infinity
    };
    info['global.Math'] = Math;
    info['env'] = env;
    // handle a generated wasm instance, receiving its exports and
    // performing other necessary setup
    function receiveInstance(instance, module) {
      exports = instance.exports;
      if (exports.memory) mergeMemory(exports.memory);
      Module['asm'] = exports;
      Module["usingWasm"] = true;
      removeRunDependency('wasm-instantiate');
    }
    addRunDependency('wasm-instantiate');

    // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
    // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
    // to any other async startup actions they are performing.
    if (Module['instantiateWasm']) {
      try {
        return Module['instantiateWasm'](info, receiveInstance);
      } catch(e) {
        Module['printErr']('Module.instantiateWasm callback failed with error: ' + e);
        return false;
      }
    }

    // Async compilation can be confusing when an error on the page overwrites Module
    // (for example, if the order of elements is wrong, and the one defining Module is
    // later), so we save Module and check it later.
    var trueModule = Module;
    function receiveInstantiatedSource(output) {
      // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
      // receiveInstance() will swap in the exports (to Module.asm) so they can be called
      assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
      trueModule = null;
      receiveInstance(output['instance'], output['module']);
    }
    function instantiateArrayBuffer(receiver) {
      getBinaryPromise().then(function(binary) {
        return WebAssembly.instantiate(binary, info);
      }).then(receiver).catch(function(reason) {
        Module['printErr']('failed to asynchronously prepare wasm: ' + reason);
        abort(reason);
      });
    }
    // Prefer streaming instantiation if available.
    if (!Module['wasmBinary'] &&
        typeof WebAssembly.instantiateStreaming === 'function' &&
        !isDataURI(wasmBinaryFile) &&
        typeof fetch === 'function') {
      WebAssembly.instantiateStreaming(fetch(wasmBinaryFile, { credentials: 'same-origin' }), info)
        .then(receiveInstantiatedSource)
        .catch(function(reason) {
          // We expect the most common failure cause to be a bad MIME type for the binary,
          // in which case falling back to ArrayBuffer instantiation should work.
          Module['printErr']('wasm streaming compile failed: ' + reason);
          Module['printErr']('falling back to ArrayBuffer instantiation');
          instantiateArrayBuffer(receiveInstantiatedSource);
        });
    } else {
      instantiateArrayBuffer(receiveInstantiatedSource);
    }
    return {}; // no exports yet; we'll fill them in later
  }


  // We may have a preloaded value in Module.asm, save it
  Module['asmPreload'] = Module['asm'];

  // Memory growth integration code

  var asmjsReallocBuffer = Module['reallocBuffer'];

  var wasmReallocBuffer = function(size) {
    var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE; // In wasm, heap size must be a multiple of 64KB. In asm.js, they need to be multiples of 16MB.
    size = alignUp(size, PAGE_MULTIPLE); // round up to wasm page size
    var old = Module['buffer'];
    var oldSize = old.byteLength;
    if (Module["usingWasm"]) {
      // native wasm support
      try {
        var result = Module['wasmMemory'].grow((size - oldSize) / wasmPageSize); // .grow() takes a delta compared to the previous size
        if (result !== (-1 | 0)) {
          // success in native wasm memory growth, get the buffer from the memory
          return Module['buffer'] = Module['wasmMemory'].buffer;
        } else {
          return null;
        }
      } catch(e) {
        console.error('Module.reallocBuffer: Attempted to grow from ' + oldSize  + ' bytes to ' + size + ' bytes, but got error: ' + e);
        return null;
      }
    }
  };

  Module['reallocBuffer'] = function(size) {
    if (finalMethod === 'asmjs') {
      return asmjsReallocBuffer(size);
    } else {
      return wasmReallocBuffer(size);
    }
  };

  // we may try more than one; this is the final one, that worked and we are using
  var finalMethod = '';

  // Provide an "asm.js function" for the application, called to "link" the asm.js module. We instantiate
  // the wasm module at that time, and it receives imports and provides exports and so forth, the app
  // doesn't need to care that it is wasm or olyfilled wasm or asm.js.

  Module['asm'] = function(global, env, providedBuffer) {
    env = fixImports(env);

    // import table
    if (!env['table']) {
      var TABLE_SIZE = Module['wasmTableSize'];
      if (TABLE_SIZE === undefined) TABLE_SIZE = 1024; // works in binaryen interpreter at least
      var MAX_TABLE_SIZE = Module['wasmMaxTableSize'];
      if (typeof WebAssembly === 'object' && typeof WebAssembly.Table === 'function') {
        if (MAX_TABLE_SIZE !== undefined) {
          env['table'] = new WebAssembly.Table({ 'initial': TABLE_SIZE, 'maximum': MAX_TABLE_SIZE, 'element': 'anyfunc' });
        } else {
          env['table'] = new WebAssembly.Table({ 'initial': TABLE_SIZE, element: 'anyfunc' });
        }
      } else {
        env['table'] = new Array(TABLE_SIZE); // works in binaryen interpreter at least
      }
      Module['wasmTable'] = env['table'];
    }

    if (!env['memoryBase']) {
      env['memoryBase'] = Module['STATIC_BASE']; // tell the memory segments where to place themselves
    }
    if (!env['tableBase']) {
      env['tableBase'] = 0; // table starts at 0 by default, in dynamic linking this will change
    }

    // try the methods. each should return the exports if it succeeded

    var exports;
    exports = doNativeWasm(global, env, providedBuffer);

    if (!exports) abort('no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods');


    return exports;
  };

  var methodHandler = Module['asm']; // note our method handler, as we may modify Module['asm'] later
}

integrateWasmJS();

// === Body ===

var ASM_CONSTS = [];




STATIC_BASE = GLOBAL_BASE;

STATICTOP = STATIC_BASE + 5606768;
/* global initializers */  __ATINIT__.push({ func: function() { __GLOBAL__sub_I_CodeGenModule_cpp() } }, { func: function() { __GLOBAL__sub_I_CodeGenPGO_cpp() } }, { func: function() { __GLOBAL__sub_I_WebAssemblyTargetMachine_cpp() } }, { func: function() { __GLOBAL__sub_I_WebAssemblyExplicitLocals_cpp() } }, { func: function() { __GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts_cpp() } }, { func: function() { __GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj_cpp() } }, { func: function() { __GLOBAL__sub_I_WebAssemblyPeephole_cpp() } }, { func: function() { __GLOBAL__sub_I_AsmPrinter_cpp() } }, { func: function() { __GLOBAL__sub_I_DwarfDebug_cpp() } }, { func: function() { __GLOBAL__sub_I_DwarfUnit_cpp() } }, { func: function() { __GLOBAL__sub_I_CodeViewDebug_cpp() } }, { func: function() { __GLOBAL__sub_I_ContinuationRecordBuilder_cpp() } }, { func: function() { __GLOBAL__sub_I_TypeDumpVisitor_cpp() } }, { func: function() { __GLOBAL__sub_I_TypeHashing_cpp() } }, { func: function() { __GLOBAL__sub_I_SelectionDAGBuilder_cpp() } }, { func: function() { __GLOBAL__sub_I_SelectionDAGDumper_cpp() } }, { func: function() { __GLOBAL__sub_I_SelectionDAGISel_cpp() } }, { func: function() { __GLOBAL__sub_I_DAGCombiner_cpp() } }, { func: function() { __GLOBAL__sub_I_LegalizeTypes_cpp() } }, { func: function() { __GLOBAL__sub_I_ScheduleDAGRRList_cpp() } }, { func: function() { __GLOBAL__sub_I_ScheduleDAGSDNodes_cpp() } }, { func: function() { __GLOBAL__sub_I_ScheduleDAGVLIW_cpp() } }, { func: function() { __GLOBAL__sub_I_ResourcePriorityQueue_cpp() } }, { func: function() { __GLOBAL__sub_I_PassBuilder_cpp() } }, { func: function() { __GLOBAL__sub_I_BasicTargetTransformInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_DFAPacketizer_cpp() } }, { func: function() { __GLOBAL__sub_I_LiveIntervals_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineBlockFrequencyInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineBranchProbabilityInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineDominators_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineFunction_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineOperand_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineRegisterInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_PostRASchedulerList_cpp() } }, { func: function() { __GLOBAL__sub_I_RegisterClassInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_RegisterCoalescer_cpp() } }, { func: function() { __GLOBAL__sub_I_ScheduleDAG_cpp() } }, { func: function() { __GLOBAL__sub_I_ScheduleDAGInstrs_cpp() } }, { func: function() { __GLOBAL__sub_I_ShrinkWrap_cpp() } }, { func: function() { __GLOBAL__sub_I_StackMapLivenessAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_StackProtector_cpp() } }, { func: function() { __GLOBAL__sub_I_TargetInstrInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_TargetLoweringBase_cpp() } }, { func: function() { __GLOBAL__sub_I_TargetPassConfig_cpp() } }, { func: function() { __GLOBAL__sub_I_TargetSchedule_cpp() } }, { func: function() { __GLOBAL__sub_I_TwoAddressInstructionPass_cpp() } }, { func: function() { __GLOBAL__sub_I_WinEHPrepare_cpp() } }, { func: function() { __GLOBAL__sub_I_AggressiveAntiDepBreaker_cpp() } }, { func: function() { __GLOBAL__sub_I_BranchFolding_cpp() } }, { func: function() { __GLOBAL__sub_I_CodeGenPrepare_cpp() } }, { func: function() { __GLOBAL__sub_I_EarlyIfConversion_cpp() } }, { func: function() { __GLOBAL__sub_I_ExpandMemCmp_cpp() } }, { func: function() { __GLOBAL__sub_I_IfConversion_cpp() } }, { func: function() { __GLOBAL__sub_I_ImplicitNullChecks_cpp() } }, { func: function() { __GLOBAL__sub_I_InterleavedAccessPass_cpp() } }, { func: function() { __GLOBAL__sub_I_LiveDebugVariables_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineBlockPlacement_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineCombiner_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineLICM_cpp() } }, { func: function() { __GLOBAL__sub_I_MachinePipeliner_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineScheduler_cpp() } }, { func: function() { __GLOBAL__sub_I_MachineSink_cpp() } }, { func: function() { __GLOBAL__sub_I_MIRPrinter_cpp() } }, { func: function() { __GLOBAL__sub_I_PeepholeOptimizer_cpp() } }, { func: function() { __GLOBAL__sub_I_PHIElimination_cpp() } }, { func: function() { __GLOBAL__sub_I_PrologEpilogInserter_cpp() } }, { func: function() { __GLOBAL__sub_I_RegAllocBasic_cpp() } }, { func: function() { __GLOBAL__sub_I_RegAllocFast_cpp() } }, { func: function() { __GLOBAL__sub_I_RegAllocGreedy_cpp() } }, { func: function() { __GLOBAL__sub_I_MIRCanonicalizerPass_cpp() } }, { func: function() { __GLOBAL__sub_I_SafeStackColoring_cpp() } }, { func: function() { __GLOBAL__sub_I_SafeStackLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_StackColoring_cpp() } }, { func: function() { __GLOBAL__sub_I_StackMaps_cpp() } }, { func: function() { __GLOBAL__sub_I_StackSlotColoring_cpp() } }, { func: function() { __GLOBAL__sub_I_TailDuplicator_cpp() } }, { func: function() { __GLOBAL__sub_I_EdgeBundles_cpp() } }, { func: function() { __GLOBAL__sub_I_InlineSpiller_cpp() } }, { func: function() { __GLOBAL__sub_I_RegAllocBase_cpp() } }, { func: function() { __GLOBAL__sub_I_RegisterUsageInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_CalledValuePropagation_cpp() } }, { func: function() { __GLOBAL__sub_I_ForceFunctionAttrs_cpp() } }, { func: function() { __GLOBAL__sub_I_FunctionAttrs_cpp() } }, { func: function() { __GLOBAL__sub_I_FunctionImport_cpp() } }, { func: function() { __GLOBAL__sub_I_Inliner_cpp() } }, { func: function() { __GLOBAL__sub_I_Internalize_cpp() } }, { func: function() { __GLOBAL__sub_I_LowerTypeTests_cpp() } }, { func: function() { __GLOBAL__sub_I_PartialInlining_cpp() } }, { func: function() { __GLOBAL__sub_I_PassManagerBuilder_cpp() } }, { func: function() { __GLOBAL__sub_I_SampleProfile_cpp() } }, { func: function() { __GLOBAL__sub_I_WholeProgramDevirt_cpp() } }, { func: function() { __GLOBAL__sub_I_MergeFunctions_cpp() } }, { func: function() { __GLOBAL__sub_I_BitcodeWriter_cpp() } }, { func: function() { __GLOBAL__sub_I_AddressSanitizer_cpp() } }, { func: function() { __GLOBAL__sub_I_BoundsChecking_cpp() } }, { func: function() { __GLOBAL__sub_I_DataFlowSanitizer_cpp() } }, { func: function() { __GLOBAL__sub_I_GCOVProfiling_cpp() } }, { func: function() { __GLOBAL__sub_I_MemorySanitizer_cpp() } }, { func: function() { __GLOBAL__sub_I_IndirectCallPromotion_cpp() } }, { func: function() { __GLOBAL__sub_I_InstrProfiling_cpp() } }, { func: function() { __GLOBAL__sub_I_PGOInstrumentation_cpp() } }, { func: function() { __GLOBAL__sub_I_PGOMemOPSizeOpt_cpp() } }, { func: function() { __GLOBAL__sub_I_SanitizerCoverage_cpp() } }, { func: function() { __GLOBAL__sub_I_ThreadSanitizer_cpp() } }, { func: function() { __GLOBAL__sub_I_EfficiencySanitizer_cpp() } }, { func: function() { __GLOBAL__sub_I_HWAddressSanitizer_cpp() } }, { func: function() { __GLOBAL__sub_I_ADCE_cpp() } }, { func: function() { __GLOBAL__sub_I_ConstantHoisting_cpp() } }, { func: function() { __GLOBAL__sub_I_CorrelatedValuePropagation_cpp() } }, { func: function() { __GLOBAL__sub_I_DeadStoreElimination_cpp() } }, { func: function() { __GLOBAL__sub_I_Float2Int_cpp() } }, { func: function() { __GLOBAL__sub_I_GVN_cpp() } }, { func: function() { __GLOBAL__sub_I_GVNHoist_cpp() } }, { func: function() { __GLOBAL__sub_I_IndVarSimplify_cpp() } }, { func: function() { __GLOBAL__sub_I_JumpThreading_cpp() } }, { func: function() { __GLOBAL__sub_I_LICM_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopSink_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopDataPrefetch_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopDistribute_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopIdiomRecognize_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopInterchange_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopLoadElimination_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopPredication_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopRerollPass_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopRotation_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopStrengthReduce_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopUnrollPass_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopUnswitch_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopVersioningLICM_cpp() } }, { func: function() { __GLOBAL__sub_I_LowerExpectIntrinsic_cpp() } }, { func: function() { __GLOBAL__sub_I_LowerGuardIntrinsic_cpp() } }, { func: function() { __GLOBAL__sub_I_NewGVN_cpp() } }, { func: function() { __GLOBAL__sub_I_RewriteStatepointsForGC_cpp() } }, { func: function() { __GLOBAL__sub_I_SROA_cpp() } }, { func: function() { __GLOBAL__sub_I_SimpleLoopUnswitch_cpp() } }, { func: function() { __GLOBAL__sub_I_SimplifyCFGPass_cpp() } }, { func: function() { __GLOBAL__sub_I_SpeculativeExecution_cpp() } }, { func: function() { __GLOBAL__sub_I_InstructionCombining_cpp() } }, { func: function() { __GLOBAL__sub_I_InstCombineCalls_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopVectorize_cpp() } }, { func: function() { __GLOBAL__sub_I_SLPVectorizer_cpp() } }, { func: function() { __GLOBAL__sub_I_AddDiscriminators_cpp() } }, { func: function() { __GLOBAL__sub_I_CodeExtractor_cpp() } }, { func: function() { __GLOBAL__sub_I_InlineFunction_cpp() } }, { func: function() { __GLOBAL__sub_I_LCSSA_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopUnroll_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopUnrollPeel_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopUnrollRuntime_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopVersioning_cpp() } }, { func: function() { __GLOBAL__sub_I_PredicateInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_SimplifyCFG_cpp() } }, { func: function() { __GLOBAL__sub_I_SimplifyLibCalls_cpp() } }, { func: function() { __GLOBAL__sub_I_SymbolRewriter_cpp() } }, { func: function() { __GLOBAL__sub_I_AliasAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_AliasAnalysisEvaluator_cpp() } }, { func: function() { __GLOBAL__sub_I_AliasSetTracker_cpp() } }, { func: function() { __GLOBAL__sub_I_AssumptionCache_cpp() } }, { func: function() { __GLOBAL__sub_I_BasicAliasAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_BlockFrequencyInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_BranchProbabilityInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_CallGraphSCCPass_cpp() } }, { func: function() { __GLOBAL__sub_I_DependenceAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_GlobalsModRef_cpp() } }, { func: function() { __GLOBAL__sub_I_IndirectCallPromotionAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_InlineCost_cpp() } }, { func: function() { __GLOBAL__sub_I_Loads_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopAccessAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopAnalysisManager_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_MemoryBuiltins_cpp() } }, { func: function() { __GLOBAL__sub_I_MemoryDependenceAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_MemorySSA_cpp() } }, { func: function() { __GLOBAL__sub_I_ObjCARCAnalysisUtils_cpp() } }, { func: function() { __GLOBAL__sub_I_ProfileSummaryInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_RegionInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_RegionPrinter_cpp() } }, { func: function() { __GLOBAL__sub_I_ScalarEvolution_cpp() } }, { func: function() { __GLOBAL__sub_I_TargetLibraryInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_TargetTransformInfo_cpp() } }, { func: function() { __GLOBAL__sub_I_TypeBasedAliasAnalysis_cpp() } }, { func: function() { __GLOBAL__sub_I_ScopedNoAliasAA_cpp() } }, { func: function() { __GLOBAL__sub_I_ValueTracking_cpp() } }, { func: function() { __GLOBAL__sub_I_IRSymtab_cpp() } }, { func: function() { __GLOBAL__sub_I_InstrProf_cpp() } }, { func: function() { __GLOBAL__sub_I_AsmParser_cpp() } }, { func: function() { __GLOBAL__sub_I_BitcodeReader_cpp() } }, { func: function() { __GLOBAL__sub_I_MetadataLoader_cpp() } }, { func: function() { __GLOBAL__sub_I_DIBuilder_cpp() } }, { func: function() { __GLOBAL__sub_I_DiagnosticHandler_cpp() } }, { func: function() { __GLOBAL__sub_I_Dominators_cpp() } }, { func: function() { __GLOBAL__sub_I_LegacyPassManager_cpp() } }, { func: function() { __GLOBAL__sub_I_OptBisect_cpp() } }, { func: function() { __GLOBAL__sub_I_MCContext_cpp() } }, { func: function() { __GLOBAL__sub_I_MCSymbol_cpp() } }, { func: function() { __GLOBAL__sub_I_ARMAttributeParser_cpp() } }, { func: function() { __GLOBAL__sub_I_CommandLine_cpp() } }, { func: function() { __GLOBAL__sub_I_Debug_cpp() } }, { func: function() { __GLOBAL__sub_I_DebugCounter_cpp() } }, { func: function() { __GLOBAL__sub_I_GraphWriter_cpp() } }, { func: function() { __GLOBAL__sub_I_RandomNumberGenerator_cpp() } }, { func: function() { __GLOBAL__sub_I_Statistic_cpp() } }, { func: function() { __GLOBAL__sub_I_Timer_cpp() } }, { func: function() { __GLOBAL__sub_I_Signals_cpp() } });


var STATIC_BUMP = 5606768;
Module["STATIC_BASE"] = STATIC_BASE;
Module["STATIC_BUMP"] = STATIC_BUMP;

/* no memory initializer */
var tempDoublePtr = STATICTOP; STATICTOP += 16;

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}

// {{PRE_LIBRARY}}


  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }

  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }

  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }

  
  function _atexit(func, arg) {
      warnOnce('atexit() called, but NO_EXIT_RUNTIME is set, so atexits() will not be called. set NO_EXIT_RUNTIME to 0 (see the FAQ)');
      __ATEXIT__.unshift({ func: func, arg: arg });
    }function ___cxa_atexit() {
  return _atexit.apply(null, arguments)
  }

  
  var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:function (adjusted) {
        if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
        for (var ptr in EXCEPTIONS.infos) {
          var info = EXCEPTIONS.infos[ptr];
          if (info.adjusted === adjusted) {
            return ptr;
          }
        }
        return adjusted;
      },addRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount++;
      },decRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        assert(info.refcount > 0);
        info.refcount--;
        // A rethrown exception can reach refcount 0; it must not be discarded
        // Its next handler will clear the rethrown flag and addRef it, prior to
        // final decRef and destruction here
        if (info.refcount === 0 && !info.rethrown) {
          if (info.destructor) {
            // In Wasm, destructors return 'this' as in ARM
            Module['dynCall_ii'](info.destructor, ptr);
          }
          delete EXCEPTIONS.infos[ptr];
          ___cxa_free_exception(ptr);
        }
      },clearRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount = 0;
      }};function ___cxa_begin_catch(ptr) {
      var info = EXCEPTIONS.infos[ptr];
      if (info && !info.caught) {
        info.caught = true;
        __ZSt18uncaught_exceptionv.uncaught_exception--;
      }
      if (info) info.rethrown = false;
      EXCEPTIONS.caught.push(ptr);
      EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));
      return ptr;
    }

  
  function ___cxa_free_exception(ptr) {
      try {
        return _free(ptr);
      } catch(e) { // XXX FIXME
        Module.printErr('exception during cxa_free_exception: ' + e);
      }
    }function ___cxa_end_catch() {
      // Clear state flag.
      Module['setThrew'](0);
      // Call destructor if one is registered then clear it.
      var ptr = EXCEPTIONS.caught.pop();
      if (ptr) {
        EXCEPTIONS.decRef(EXCEPTIONS.deAdjust(ptr));
        EXCEPTIONS.last = 0; // XXX in decRef?
      }
    }

  function ___cxa_find_matching_catch_2() {
          return ___cxa_find_matching_catch.apply(null, arguments);
        }

  function ___cxa_find_matching_catch_3() {
          return ___cxa_find_matching_catch.apply(null, arguments);
        }


  function ___cxa_pure_virtual() {
      ABORT = true;
      throw 'Pure virtual function called!';
    }

  function ___cxa_rethrow() {
      var ptr = EXCEPTIONS.caught.pop();
      if (!EXCEPTIONS.infos[ptr].rethrown) {
        // Only pop if the corresponding push was through rethrow_primary_exception
        EXCEPTIONS.caught.push(ptr)
        EXCEPTIONS.infos[ptr].rethrown = true;
      }
      EXCEPTIONS.last = ptr;
      throw ptr;
    }

  
  
  function ___resumeException(ptr) {
      if (!EXCEPTIONS.last) { EXCEPTIONS.last = ptr; }
      throw ptr;
    }function ___cxa_find_matching_catch() {
      var thrown = EXCEPTIONS.last;
      if (!thrown) {
        // just pass through the null ptr
        return ((setTempRet0(0),0)|0);
      }
      var info = EXCEPTIONS.infos[thrown];
      var throwntype = info.type;
      if (!throwntype) {
        // just pass through the thrown ptr
        return ((setTempRet0(0),thrown)|0);
      }
      var typeArray = Array.prototype.slice.call(arguments);
  
      var pointer = Module['___cxa_is_pointer_type'](throwntype);
      // can_catch receives a **, add indirection
      if (!___cxa_find_matching_catch.buffer) ___cxa_find_matching_catch.buffer = _malloc(4);
      SAFE_HEAP_STORE(((___cxa_find_matching_catch.buffer)|0), ((thrown)|0), 4);
      thrown = ___cxa_find_matching_catch.buffer;
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (typeArray[i] && Module['___cxa_can_catch'](typeArray[i], throwntype, thrown)) {
          thrown = ((SAFE_HEAP_LOAD(((thrown)|0), 4, 0))|0); // undo indirection
          info.adjusted = thrown;
          return ((setTempRet0(typeArray[i]),thrown)|0);
        }
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      thrown = ((SAFE_HEAP_LOAD(((thrown)|0), 4, 0))|0); // undo indirection
      return ((setTempRet0(throwntype),thrown)|0);
    }function ___cxa_throw(ptr, type, destructor) {
      EXCEPTIONS.infos[ptr] = {
        ptr: ptr,
        adjusted: ptr,
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
      };
      EXCEPTIONS.last = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr;
    }

  function ___lock() {}

  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  function ___setErrNo(value) {
      if (Module['___errno_location']) SAFE_HEAP_STORE(((Module['___errno_location']())|0), ((value)|0), 4);
      else Module.printErr('failed to set errno from JS');
      return value;
    }function ___map_file(pathname, size) {
      ___setErrNo(ERRNO_CODES.EPERM);
      return -1;
    }


  
  
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          stream.tty.ops.flush(stream.tty);
        },flush:function (stream) {
          stream.tty.ops.flush(stream.tty);
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = new Buffer(BUFSIZE);
              var bytesRead = 0;
  
              var isPosixPlatform = (process.platform != 'win32'); // Node doesn't offer a direct check, so test by exclusion
  
              var fd = process.stdin.fd;
              if (isPosixPlatform) {
                // Linux and Mac cannot use process.stdin.fd (which isn't set up as sync)
                var usingDevice = false;
                try {
                  fd = fs.openSync('/dev/stdin', 'r');
                  usingDevice = true;
                } catch (e) {}
              }
  
              try {
                bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                else throw e;
              }
  
              if (usingDevice) { fs.closeSync(fd); }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
  
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },flush:function (tty) {
          if (tty.output && tty.output.length > 0) {
            Module['print'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },flush:function (tty) {
          if (tty.output && tty.output.length > 0) {
            Module['printErr'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  var MEMFS={ops_table:null,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },getFileDataAsRegularArray:function (node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
          return arr; // Returns a copy of the original data.
        }
        return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
      },getFileDataAsTypedArray:function (node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function (node, newCapacity) {
        // If we are asked to expand the size of a file that already exists, revert to using a standard JS array to store the file
        // instead of a typed array. This makes resizing the array more flexible because we can just .push() elements at the back to
        // increase the size.
        if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
          node.contents = MEMFS.getFileDataAsRegularArray(node);
          node.usedBytes = node.contents.length; // We might be writing to a lazy-loaded file which had overridden this property, so force-reset it.
        }
  
        if (!node.contents || node.contents.subarray) { // Keep using a typed array if creating a new storage, or if old one was a typed array as well.
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
          // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
          // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
          // avoid overshooting the allocation cap by a very large margin.
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) | 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity); // Allocate new storage.
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
          return;
        }
        // Not using a typed array to back the file storage. Use a standard JS array instead.
        if (!node.contents && newCapacity > 0) node.contents = [];
        while (node.contents.length < newCapacity) node.contents.push(0);
      },resizeFileStorage:function (node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
          return;
        }
        if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
          var oldContents = node.contents;
          node.contents = new Uint8Array(new ArrayBuffer(newSize)); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
          return;
        }
        // Backing with a JS array.
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); // Use typed array write if available.
          else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position+length);
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < stream.node.usedBytes) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function (stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          if (mmapFlags & 2) {
            // MAP_PRIVATE calls need not to be synced back to underlying fs
            return 0;
          }
  
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        if (typeof indexedDB !== 'undefined') return indexedDB;
        var ret = null;
        if (typeof window === 'object') ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, 'IDBFS used, but indexedDB not supported');
        return ret;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        if (!req) {
          return callback("Unable to connect to IndexedDB");
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          if (!fileStore.indexNames.contains('timestamp')) {
            fileStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          try {
            var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
            transaction.onerror = function(e) {
              callback(this.error);
              e.preventDefault();
            };
  
            var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
            var index = store.index('timestamp');
  
            index.openKeyCursor().onsuccess = function(event) {
              var cursor = event.target.result;
  
              if (!cursor) {
                return callback(null, { type: 'remote', db: db, entries: entries });
              }
  
              entries[cursor.primaryKey] = { timestamp: cursor.key };
  
              cursor.continue();
            };
          } catch (e) {
            return callback(e);
          }
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
          // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
          node.contents = MEMFS.getFileDataAsTypedArray(node);
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.chmod(path, entry.mode);
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function(e) {
          done(this.error);
          e.preventDefault();
        };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        flags &= ~0x200000 /*O_PATH*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x800 /*O_NONBLOCK*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x8000 /*O_LARGEFILE*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x80000 /*O_CLOEXEC*/; // Some applications may pass it; it makes no sense for a single process.
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            path = fs.readlinkSync(path);
            path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
            return path;
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          if (length === 0) return 0; // node errors on 0 length reads
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          return position;
        }}};
  
  var WORKERFS={DIR_MODE:16895,FILE_MODE:33279,reader:null,mount:function (mount) {
        assert(ENVIRONMENT_IS_WORKER);
        if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync();
        var root = WORKERFS.createNode(null, '/', WORKERFS.DIR_MODE, 0);
        var createdParents = {};
        function ensureParent(path) {
          // return the parent node, creating subdirs as necessary
          var parts = path.split('/');
          var parent = root;
          for (var i = 0; i < parts.length-1; i++) {
            var curr = parts.slice(0, i+1).join('/');
            // Issue 4254: Using curr as a node name will prevent the node
            // from being found in FS.nameTable when FS.open is called on
            // a path which holds a child of this node,
            // given that all FS functions assume node names
            // are just their corresponding parts within their given path,
            // rather than incremental aggregates which include their parent's
            // directories.
            if (!createdParents[curr]) {
              createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0);
            }
            parent = createdParents[curr];
          }
          return parent;
        }
        function base(path) {
          var parts = path.split('/');
          return parts[parts.length-1];
        }
        // We also accept FileList here, by using Array.prototype
        Array.prototype.forEach.call(mount.opts["files"] || [], function(file) {
          WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
        });
        (mount.opts["blobs"] || []).forEach(function(obj) {
          WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
        });
        (mount.opts["packages"] || []).forEach(function(pack) {
          pack['metadata'].files.forEach(function(file) {
            var name = file.filename.substr(1); // remove initial slash
            WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack['blob'].slice(file.start, file.end));
          });
        });
        return root;
      },createNode:function (parent, name, mode, dev, contents, mtime) {
        var node = FS.createNode(parent, name, mode);
        node.mode = mode;
        node.node_ops = WORKERFS.node_ops;
        node.stream_ops = WORKERFS.stream_ops;
        node.timestamp = (mtime || new Date).getTime();
        assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
        if (mode === WORKERFS.FILE_MODE) {
          node.size = contents.size;
          node.contents = contents;
        } else {
          node.size = 4096;
          node.contents = {};
        }
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },node_ops:{getattr:function (node) {
          return {
            dev: 1,
            ino: undefined,
            mode: node.mode,
            nlink: 1,
            uid: 0,
            gid: 0,
            rdev: undefined,
            size: node.size,
            atime: new Date(node.timestamp),
            mtime: new Date(node.timestamp),
            ctime: new Date(node.timestamp),
            blksize: 4096,
            blocks: Math.ceil(node.size / 4096),
          };
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
        },lookup:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },mknod:function (parent, name, mode, dev) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rename:function (oldNode, newDir, newName) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },unlink:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rmdir:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readdir:function (node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newName, oldPath) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readlink:function (node) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          if (position >= stream.node.size) return 0;
          var chunk = stream.node.contents.slice(position, position + length);
          var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
          buffer.set(new Uint8Array(ab), offset);
          return chunk.size;
        },write:function (stream, buffer, offset, length, position) {
          throw new FS.ErrnoError(ERRNO_CODES.EIO);
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.size;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return position;
        }}};
  
  var _stdin=STATICTOP; STATICTOP += 16;;
  
  var _stdout=STATICTOP; STATICTOP += 16;;
  
  var _stderr=STATICTOP; STATICTOP += 16;;var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); }
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); }
            }
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        var err = FS.nodePermissions(dir, 'x');
        if (err) return err;
        if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
        return 0;
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          console.log('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(err) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(err);
        }
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:function (path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != ERRNO_CODES.EEXIST) throw e;
          }
        }
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        if (!PATH.resolve(oldpath)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        try {
          if (FS.trackingDelegate['willMovePath']) {
            FS.trackingDelegate['willMovePath'](old_path, new_path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
        try {
          if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch(e) {
          console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var err = FS.mayOpen(node, flags);
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        try {
          if (FS.trackingDelegate['onOpenFile']) {
            var trackingFlags = 0;
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }
            FS.trackingDelegate['onOpenFile'](path, trackingFlags);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
        }
        return stream;
      },close:function (stream) {
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
          if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch(e) {
          console.log("FS.trackingDelegate['onWriteToFile']('"+path+"') threw an exception: " + e.message);
        }
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },msync:function (stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:function (stream) {
        return 0;
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function(stream, buffer, offset, length, pos) { return length; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto !== 'undefined') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          random_device = function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else if (ENVIRONMENT_IS_NODE) {
          // for nodejs
          random_device = function() { return require('crypto')['randomBytes'](1)[0]; };
        } else {
          // default for ES5 platforms
          random_device = function() { return (Math.random()*256)|0; };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:function () {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: function() {
            var node = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: function(parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: function() { return stream.path } }
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          //Module.printErr(stackTrace()); // useful for debugging
          this.node = node;
          this.setErrno = function(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
          // Node.js compatibility: assigning on this.stack fails on Node 4 (but fixed on Node 8)
          if (this.stack) Object.defineProperty(this, "stack", { value: (new Error).stack });
          if (this.stack) this.stack = demangleAll(this.stack);
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
          'IDBFS': IDBFS,
          'NODEFS': NODEFS,
          'WORKERFS': WORKERFS,
        };
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        var fflush = Module['_fflush'];
        if (fflush) fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        }
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        }
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = this;
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        }
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init(); // XXX perhaps this method should move onto Browser?
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};var SYSCALLS={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:function (dirfd, path) {
        if (path[0] !== '/') {
          // relative path
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            dir = dirstream.path;
          }
          path = PATH.join2(dir, path);
        }
        return path;
      },doStat:function (func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -ERRNO_CODES.ENOTDIR;
          }
          throw e;
        }
        SAFE_HEAP_STORE(((buf)|0), ((stat.dev)|0), 4);
        SAFE_HEAP_STORE((((buf)+(4))|0), ((0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(8))|0), ((stat.ino)|0), 4);
        SAFE_HEAP_STORE((((buf)+(12))|0), ((stat.mode)|0), 4);
        SAFE_HEAP_STORE((((buf)+(16))|0), ((stat.nlink)|0), 4);
        SAFE_HEAP_STORE((((buf)+(20))|0), ((stat.uid)|0), 4);
        SAFE_HEAP_STORE((((buf)+(24))|0), ((stat.gid)|0), 4);
        SAFE_HEAP_STORE((((buf)+(28))|0), ((stat.rdev)|0), 4);
        SAFE_HEAP_STORE((((buf)+(32))|0), ((0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(36))|0), ((stat.size)|0), 4);
        SAFE_HEAP_STORE((((buf)+(40))|0), ((4096)|0), 4);
        SAFE_HEAP_STORE((((buf)+(44))|0), ((stat.blocks)|0), 4);
        SAFE_HEAP_STORE((((buf)+(48))|0), (((stat.atime.getTime() / 1000)|0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(52))|0), ((0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(56))|0), (((stat.mtime.getTime() / 1000)|0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(60))|0), ((0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(64))|0), (((stat.ctime.getTime() / 1000)|0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(68))|0), ((0)|0), 4);
        SAFE_HEAP_STORE((((buf)+(72))|0), ((stat.ino)|0), 4);
        return 0;
      },doMsync:function (addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags);
      },doMkdir:function (path, mode) {
        // remove a trailing slash, if one - /a/b/ has basename of '', but
        // we want to create b in the context of this function
        path = PATH.normalize(path);
        if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
        FS.mkdir(path, mode, 0);
        return 0;
      },doMknod:function (path, mode, dev) {
        // we don't want this in the JS API as it uses mknod to create all nodes.
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default: return -ERRNO_CODES.EINVAL;
        }
        FS.mknod(path, mode, dev);
        return 0;
      },doReadlink:function (path, buf, bufsize) {
        if (bufsize <= 0) return -ERRNO_CODES.EINVAL;
        var ret = FS.readlink(path);
  
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf+len];
        stringToUTF8(ret, buf, bufsize+1);
        // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
        // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
        HEAP8[buf+len] = endChar;
  
        return len;
      },doAccess:function (path, amode) {
        if (amode & ~7) {
          // need a valid mode
          return -ERRNO_CODES.EINVAL;
        }
        var node;
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
        var perms = '';
        if (amode & 4) perms += 'r';
        if (amode & 2) perms += 'w';
        if (amode & 1) perms += 'x';
        if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
          return -ERRNO_CODES.EACCES;
        }
        return 0;
      },doDup:function (path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
      },doReadv:function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = ((SAFE_HEAP_LOAD((((iov)+(i*8))|0), 4, 0))|0);
          var len = ((SAFE_HEAP_LOAD((((iov)+(i*8 + 4))|0), 4, 0))|0);
          var curr = FS.read(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break; // nothing more to read
        }
        return ret;
      },doWritev:function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = ((SAFE_HEAP_LOAD((((iov)+(i*8))|0), 4, 0))|0);
          var len = ((SAFE_HEAP_LOAD((((iov)+(i*8 + 4))|0), 4, 0))|0);
          var curr = FS.write(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
        }
        return ret;
      },varargs:0,get:function (varargs) {
        SYSCALLS.varargs += 4;
        var ret = ((SAFE_HEAP_LOAD((((SYSCALLS.varargs)-(4))|0), 4, 0))|0);
        return ret;
      },getStr:function () {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret;
      },getStreamFromFD:function () {
        var stream = FS.getStream(SYSCALLS.get());
        if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return stream;
      },getSocketFromFD:function () {
        var socket = SOCKFS.getSocket(SYSCALLS.get());
        if (!socket) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return socket;
      },getSocketAddress:function (allowNull) {
        var addrp = SYSCALLS.get(), addrlen = SYSCALLS.get();
        if (allowNull && addrp === 0) return null;
        var info = __read_sockaddr(addrp, addrlen);
        if (info.errno) throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info;
      },get64:function () {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },getZero:function () {
        assert(SYSCALLS.get() === 0);
      }};function ___syscall10(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // unlink
      var path = SYSCALLS.getStr();
      FS.unlink(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall12(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // chdir
      var path = SYSCALLS.getStr();
      FS.chdir(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall122(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // uname
      var buf = SYSCALLS.get();
      if (!buf) return -ERRNO_CODES.EFAULT
      var layout = {"sysname":0,"nodename":65,"domainname":325,"machine":260,"version":195,"release":130,"__size__":390};
      function copyString(element, value) {
        var offset = layout[element];
        writeAsciiToMemory(value, buf + offset);
      }
      copyString('sysname', 'Emscripten');
      copyString('nodename', 'emscripten');
      copyString('release', '1.0');
      copyString('version', '#1');
      copyString('machine', 'x86-JS');
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall140(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // llseek
      var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
      // NOTE: offset_high is unused - Emscripten's off_t is 32-bit
      var offset = offset_low;
      FS.llseek(stream, offset, whence);
      SAFE_HEAP_STORE(((result)|0), ((stream.position)|0), 4);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall145(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // readv
      var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      return SYSCALLS.doReadv(stream, iov, iovcnt);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // writev
      var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      return SYSCALLS.doWritev(stream, iov, iovcnt);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  var PROCINFO={ppid:1,pid:42,sid:42,pgid:42};function ___syscall147(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // getsid
      var pid = SYSCALLS.get();
      if (pid && pid !== PROCINFO.pid) return -ERRNO_CODES.ESRCH;
      return PROCINFO.sid;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall180(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // pread64
      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get(), zero = SYSCALLS.getZero(), offset = SYSCALLS.get64();
      return FS.read(stream, HEAP8,buf, count, offset);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall183(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // getcwd
      var buf = SYSCALLS.get(), size = SYSCALLS.get();
      if (size === 0) return -ERRNO_CODES.EINVAL;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd);
      if (size < cwdLengthInBytes + 1) return -ERRNO_CODES.ERANGE;
      stringToUTF8(cwd, buf, size);
      return buf;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall191(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // ugetrlimit
      var resource = SYSCALLS.get(), rlim = SYSCALLS.get();
      SAFE_HEAP_STORE(((rlim)|0), ((-1)|0), 4);  // RLIM_INFINITY
      SAFE_HEAP_STORE((((rlim)+(4))|0), ((-1)|0), 4);  // RLIM_INFINITY
      SAFE_HEAP_STORE((((rlim)+(8))|0), ((-1)|0), 4);  // RLIM_INFINITY
      SAFE_HEAP_STORE((((rlim)+(12))|0), ((-1)|0), 4);  // RLIM_INFINITY
      return 0; // just report no limits
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall192(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // mmap2
      var addr = SYSCALLS.get(), len = SYSCALLS.get(), prot = SYSCALLS.get(), flags = SYSCALLS.get(), fd = SYSCALLS.get(), off = SYSCALLS.get()
      off <<= 12; // undo pgoffset
      var ptr;
      var allocated = false;
      if (fd === -1) {
        ptr = _memalign(PAGE_SIZE, len);
        if (!ptr) return -ERRNO_CODES.ENOMEM;
        _memset(ptr, 0, len);
        allocated = true;
      } else {
        var info = FS.getStream(fd);
        if (!info) return -ERRNO_CODES.EBADF;
        var res = FS.mmap(info, HEAPU8, addr, len, off, prot, flags);
        ptr = res.ptr;
        allocated = res.allocated;
      }
      SYSCALLS.mappings[ptr] = { malloc: ptr, len: len, allocated: allocated, fd: fd, flags: flags };
      return ptr;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall195(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // SYS_stat64
      var path = SYSCALLS.getStr(), buf = SYSCALLS.get();
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall196(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // SYS_lstat64
      var path = SYSCALLS.getStr(), buf = SYSCALLS.get();
      return SYSCALLS.doStat(FS.lstat, path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall197(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // SYS_fstat64
      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get();
      return SYSCALLS.doStat(FS.stat, stream.path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  function ___syscall202(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // getgid32
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }function ___syscall199() {
  return ___syscall202.apply(null, arguments)
  }

  function ___syscall20(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // getpid
      return PROCINFO.pid;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall220(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // SYS_getdents64
      var stream = SYSCALLS.getStreamFromFD(), dirp = SYSCALLS.get(), count = SYSCALLS.get();
      if (!stream.getdents) {
        stream.getdents = FS.readdir(stream.path);
      }
      var pos = 0;
      while (stream.getdents.length > 0 && pos + 268 <= count) {
        var id;
        var type;
        var name = stream.getdents.pop();
        if (name[0] === '.') {
          id = 1;
          type = 4; // DT_DIR
        } else {
          var child = FS.lookupNode(stream.node, name);
          id = child.id;
          type = FS.isChrdev(child.mode) ? 2 :  // DT_CHR, character device.
                 FS.isDir(child.mode) ? 4 :     // DT_DIR, directory.
                 FS.isLink(child.mode) ? 10 :   // DT_LNK, symbolic link.
                 8;                             // DT_REG, regular file.
        }
        SAFE_HEAP_STORE(((dirp + pos)|0), ((id)|0), 4);
        SAFE_HEAP_STORE((((dirp + pos)+(4))|0), ((stream.position)|0), 4);
        SAFE_HEAP_STORE((((dirp + pos)+(8))|0), ((268)|0), 2);
        SAFE_HEAP_STORE((((dirp + pos)+(10))|0), ((type)|0), 1);
        stringToUTF8(name, dirp + pos + 11, 256);
        pos += 268;
      }
      return pos;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall221(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // fcntl64
      var stream = SYSCALLS.getStreamFromFD(), cmd = SYSCALLS.get();
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -ERRNO_CODES.EINVAL;
          }
          var newStream;
          newStream = FS.open(stream.path, stream.flags, 0, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 12:
        case 12: {
          var arg = SYSCALLS.get();
          var offset = 0;
          // We're always unlocked.
          SAFE_HEAP_STORE((((arg)+(offset))|0), ((2)|0), 2);
          return 0;
        }
        case 13:
        case 14:
        case 13:
        case 14:
          return 0; // Pretend that the locking is successful.
        case 16:
        case 8:
          return -ERRNO_CODES.EINVAL; // These are for sockets. We don't have them fully implemented yet.
        case 9:
          // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
        default: {
          return -ERRNO_CODES.EINVAL;
        }
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall3(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // read
      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get();
      return FS.read(stream, HEAP8,buf, count);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall33(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // access
      var path = SYSCALLS.getStr(), amode = SYSCALLS.get();
      return SYSCALLS.doAccess(path, amode);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall340(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // prlimit64
      var pid = SYSCALLS.get(), resource = SYSCALLS.get(), new_limit = SYSCALLS.get(), old_limit = SYSCALLS.get();
      if (old_limit) { // just report no limits
        SAFE_HEAP_STORE(((old_limit)|0), ((-1)|0), 4);  // RLIM_INFINITY
        SAFE_HEAP_STORE((((old_limit)+(4))|0), ((-1)|0), 4);  // RLIM_INFINITY
        SAFE_HEAP_STORE((((old_limit)+(8))|0), ((-1)|0), 4);  // RLIM_INFINITY
        SAFE_HEAP_STORE((((old_limit)+(12))|0), ((-1)|0), 4);  // RLIM_INFINITY
      }
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall38(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // rename
      var old_path = SYSCALLS.getStr(), new_path = SYSCALLS.getStr();
      FS.rename(old_path, new_path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall39(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // mkdir
      var path = SYSCALLS.getStr(), mode = SYSCALLS.get();
      return SYSCALLS.doMkdir(path, mode);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall4(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // write
      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get();
      return FS.write(stream, HEAP8,buf, count);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall40(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // rmdir
      var path = SYSCALLS.getStr();
      FS.rmdir(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall5(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // open
      var pathname = SYSCALLS.getStr(), flags = SYSCALLS.get(), mode = SYSCALLS.get() // optional TODO
      var stream = FS.open(pathname, flags, mode);
      return stream.fd;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // ioctl
      var stream = SYSCALLS.getStreamFromFD(), op = SYSCALLS.get();
      switch (op) {
        case 21505: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0;
        }
        case 21506: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          var argp = SYSCALLS.get();
          SAFE_HEAP_STORE(((argp)|0), ((0)|0), 4);
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return -ERRNO_CODES.EINVAL; // not supported
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0;
        }
        default: abort('bad ioctl syscall ' + op);
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall6(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // close
      var stream = SYSCALLS.getStreamFromFD();
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall63(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // dup2
      var old = SYSCALLS.getStreamFromFD(), suggestFD = SYSCALLS.get();
      if (old.fd === suggestFD) return suggestFD;
      return SYSCALLS.doDup(old.path, old.flags, suggestFD);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall75(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // setrlimit
      return 0; // no-op
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall77(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // getrusage
      var who = SYSCALLS.get(), usage = SYSCALLS.get();
      _memset(usage, 0, 136);
      SAFE_HEAP_STORE(((usage)|0), ((1)|0), 4); // fake some values
      SAFE_HEAP_STORE((((usage)+(4))|0), ((2)|0), 4);
      SAFE_HEAP_STORE((((usage)+(8))|0), ((3)|0), 4);
      SAFE_HEAP_STORE((((usage)+(12))|0), ((4)|0), 4);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall83(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // symlink
      var target = SYSCALLS.getStr(), linkpath = SYSCALLS.getStr();
      FS.symlink(target, linkpath);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall85(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // readlink
      var path = SYSCALLS.getStr(), buf = SYSCALLS.get(), bufsize = SYSCALLS.get();
      return SYSCALLS.doReadlink(path, buf, bufsize);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall91(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // munmap
      var addr = SYSCALLS.get(), len = SYSCALLS.get();
      // TODO: support unmmap'ing parts of allocations
      var info = SYSCALLS.mappings[addr];
      if (!info) return 0;
      if (len === info.len) {
        var stream = FS.getStream(info.fd);
        SYSCALLS.doMsync(addr, stream, len, info.flags)
        FS.munmap(stream);
        SYSCALLS.mappings[addr] = null;
        if (info.allocated) {
          _free(info.malloc);
        }
      }
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___unlock() {}

  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }

  function _abort() {
      Module['abort']();
    }

  
  var __sigalrm_handler=0;function _alarm(seconds) {
      setTimeout(function() {
        if (__sigalrm_handler) Module['dynCall_vi'](__sigalrm_handler, 0);
      }, seconds*1000);
    }

  
  var ___tm_formatted=STATICTOP; STATICTOP += 48;;
  
  
  
  
  var _tzname=STATICTOP; STATICTOP += 16;;
  
  var _daylight=STATICTOP; STATICTOP += 16;;
  
  var _timezone=STATICTOP; STATICTOP += 16;;function _tzset() {
      // TODO: Use (malleable) environment variables instead of system settings.
      if (_tzset.called) return;
      _tzset.called = true;
  
      SAFE_HEAP_STORE(((_timezone)|0), ((-(new Date()).getTimezoneOffset() * 60)|0), 4);
  
      var winter = new Date(2000, 0, 1);
      var summer = new Date(2000, 6, 1);
      SAFE_HEAP_STORE(((_daylight)|0), ((Number(winter.getTimezoneOffset() != summer.getTimezoneOffset()))|0), 4);
  
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      };
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocate(intArrayFromString(winterName), 'i8', ALLOC_NORMAL);
      var summerNamePtr = allocate(intArrayFromString(summerName), 'i8', ALLOC_NORMAL);
      if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
        // Northern hemisphere
        SAFE_HEAP_STORE(((_tzname)|0), ((winterNamePtr)|0), 4);
        SAFE_HEAP_STORE((((_tzname)+(4))|0), ((summerNamePtr)|0), 4);
      } else {
        SAFE_HEAP_STORE(((_tzname)|0), ((summerNamePtr)|0), 4);
        SAFE_HEAP_STORE((((_tzname)+(4))|0), ((winterNamePtr)|0), 4);
      }
    }function _mktime(tmPtr) {
      _tzset();
      var date = new Date(((SAFE_HEAP_LOAD((((tmPtr)+(20))|0), 4, 0))|0) + 1900,
                          ((SAFE_HEAP_LOAD((((tmPtr)+(16))|0), 4, 0))|0),
                          ((SAFE_HEAP_LOAD((((tmPtr)+(12))|0), 4, 0))|0),
                          ((SAFE_HEAP_LOAD((((tmPtr)+(8))|0), 4, 0))|0),
                          ((SAFE_HEAP_LOAD((((tmPtr)+(4))|0), 4, 0))|0),
                          ((SAFE_HEAP_LOAD(((tmPtr)|0), 4, 0))|0),
                          0);
  
      // There's an ambiguous hour when the time goes back; the tm_isdst field is
      // used to disambiguate it.  Date() basically guesses, so we fix it up if it
      // guessed wrong, or fill in tm_isdst with the guess if it's -1.
      var dst = ((SAFE_HEAP_LOAD((((tmPtr)+(32))|0), 4, 0))|0);
      var guessedOffset = date.getTimezoneOffset();
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(2000, 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
      if (dst < 0) {
        // Attention: some regions don't have DST at all.
        SAFE_HEAP_STORE((((tmPtr)+(32))|0), ((Number(summerOffset != winterOffset && dstOffset == guessedOffset))|0), 4);
      } else if ((dst > 0) != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
        date.setTime(date.getTime() + (trueOffset - guessedOffset)*60000);
      }
  
      SAFE_HEAP_STORE((((tmPtr)+(24))|0), ((date.getDay())|0), 4);
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      SAFE_HEAP_STORE((((tmPtr)+(28))|0), ((yday)|0), 4);
  
      return (date.getTime() / 1000)|0;
    }function _asctime_r(tmPtr, buf) {
      var date = {
        tm_sec: ((SAFE_HEAP_LOAD(((tmPtr)|0), 4, 0))|0),
        tm_min: ((SAFE_HEAP_LOAD((((tmPtr)+(4))|0), 4, 0))|0),
        tm_hour: ((SAFE_HEAP_LOAD((((tmPtr)+(8))|0), 4, 0))|0),
        tm_mday: ((SAFE_HEAP_LOAD((((tmPtr)+(12))|0), 4, 0))|0),
        tm_mon: ((SAFE_HEAP_LOAD((((tmPtr)+(16))|0), 4, 0))|0),
        tm_year: ((SAFE_HEAP_LOAD((((tmPtr)+(20))|0), 4, 0))|0),
        tm_wday: ((SAFE_HEAP_LOAD((((tmPtr)+(24))|0), 4, 0))|0)
      };
      var days = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
      var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      var s = days[date.tm_wday] + ' ' + months[date.tm_mon] +
          (date.tm_mday < 10 ? '  ' : ' ') + date.tm_mday +
          (date.tm_hour < 10 ? ' 0' : ' ') + date.tm_hour +
          (date.tm_min < 10 ? ':0' : ':') + date.tm_min +
          (date.tm_sec < 10 ? ':0' : ':') + date.tm_sec +
          ' ' + (1900 + date.tm_year) + "\n";
  
      // asctime_r is specced to behave in an undefined manner if the algorithm would attempt
      // to write out more than 26 bytes (including the null terminator).
      // See http://pubs.opengroup.org/onlinepubs/9699919799/functions/asctime.html
      // Our undefined behavior is to truncate the write to at most 26 bytes, including null terminator.
      stringToUTF8(s, buf, 26);
      return buf;
    }function _asctime(tmPtr) {
      return _asctime_r(tmPtr, ___tm_formatted);
    }

  
  function _emscripten_get_now() { abort() }
  
  function _emscripten_get_now_is_monotonic() {
      // return whether emscripten_get_now is guaranteed monotonic; the Date.now
      // implementation is not :(
      return ENVIRONMENT_IS_NODE || (typeof dateNow !== 'undefined') ||
          ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self['performance'] && self['performance']['now']);
    }function _clock_gettime(clk_id, tp) {
      // int clock_gettime(clockid_t clk_id, struct timespec *tp);
      var now;
      if (clk_id === 0) {
        now = Date.now();
      } else if (clk_id === 1 && _emscripten_get_now_is_monotonic()) {
        now = _emscripten_get_now();
      } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1;
      }
      SAFE_HEAP_STORE(((tp)|0), (((now/1000)|0)|0), 4); // seconds
      SAFE_HEAP_STORE((((tp)+(4))|0), ((((now % 1000)*1000*1000)|0)|0), 4); // nanoseconds
      return 0;
    }

  function _dladdr(addr, info) {
      // report all function pointers as coming from this program itself XXX not really correct in any way
      var fname = allocate(intArrayFromString(Module['thisProgram'] || './this.program'), 'i8', ALLOC_NORMAL); // XXX leak
      SAFE_HEAP_STORE(((addr)|0), ((fname)|0), 4);
      SAFE_HEAP_STORE((((addr)+(4))|0), ((0)|0), 4);
      SAFE_HEAP_STORE((((addr)+(8))|0), ((0)|0), 4);
      SAFE_HEAP_STORE((((addr)+(12))|0), ((0)|0), 4);
      return 1;
    }

  
  
  
  var setjmpId=0;function _saveSetjmp(env, label, table, size) {
      // Not particularly fast: slow table lookup of setjmpId to label. But setjmp
      // prevents relooping anyhow, so slowness is to be expected. And typical case
      // is 1 setjmp per invocation, or less.
      env = env|0;
      label = label|0;
      table = table|0;
      size = size|0;
      var i = 0;
      setjmpId = (setjmpId+1)|0;
      SAFE_HEAP_STORE(((env)|0), ((setjmpId)|0), 4);
      while ((i|0) < (size|0)) {
        if (((SAFE_HEAP_LOAD((((table)+((i<<3)))|0), 4, 0))|0) == 0) {
          SAFE_HEAP_STORE((((table)+((i<<3)))|0), ((setjmpId)|0), 4);
          SAFE_HEAP_STORE((((table)+((i<<3)+4))|0), ((label)|0), 4);
          // prepare next slot
          SAFE_HEAP_STORE((((table)+((i<<3)+8))|0), ((0)|0), 4);
          Module["asm"]["setTempRet0"](size);
          return table | 0;
        }
        i = i+1|0;
      }
      // grow the table
      size = (size*2)|0;
      table = _realloc(table|0, 8*(size+1|0)|0) | 0;
      table = _saveSetjmp(env|0, label|0, table|0, size|0) | 0;
      Module["asm"]["setTempRet0"](size);
      return table | 0;
    }
  
  function _testSetjmp(id, table, size) {
      id = id|0;
      table = table|0;
      size = size|0;
      var i = 0, curr = 0;
      while ((i|0) < (size|0)) {
        curr = ((SAFE_HEAP_LOAD((((table)+((i<<3)))|0), 4, 0))|0);
        if ((curr|0) == 0) break;
        if ((curr|0) == (id|0)) {
          return ((SAFE_HEAP_LOAD((((table)+((i<<3)+4))|0), 4, 0))|0);
        }
        i = i+1|0;
      }
      return 0;
    }function _longjmp(env, value) {
      Module['setThrew'](env, value || 1);
      throw 'longjmp';
    }function _emscripten_longjmp(env, value) {
      _longjmp(env, value);
    }

  
  function _execl(/* ... */) {
      // int execl(const char *path, const char *arg0, ... /*, (char *)0 */);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/exec.html
      // We don't support executing external code.
      ___setErrNo(ERRNO_CODES.ENOEXEC);
      return -1;
    }function _execv() {
  return _execl.apply(null, arguments)
  }

  function _execve() {
  return _execl.apply(null, arguments)
  }

  function _exit(status) {
      __exit(status);
    }

  function _fork() {
      // pid_t fork(void);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fork.html
      // We don't support multiple processes.
      ___setErrNo(ERRNO_CODES.EAGAIN);
      return -1;
    }

  
  
  
  
  var _environ=STATICTOP; STATICTOP += 16;;var ___environ=_environ;function ___buildEnvironment(env) {
      // WARNING: Arbitrary limit!
      var MAX_ENV_VALUES = 64;
      var TOTAL_ENV_SIZE = 1024;
  
      // Statically allocate memory for the environment.
      var poolPtr;
      var envPtr;
      if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        // Set default values. Use string keys for Closure Compiler compatibility.
        ENV['USER'] = ENV['LOGNAME'] = 'web_user';
        ENV['PATH'] = '/';
        ENV['PWD'] = '/';
        ENV['HOME'] = '/home/web_user';
        ENV['LANG'] = 'C.UTF-8';
        ENV['_'] = Module['thisProgram'];
        // Allocate memory.
        poolPtr = allocate(TOTAL_ENV_SIZE, 'i8', ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4,
                          'i8*', ALLOC_STATIC);
        SAFE_HEAP_STORE(((envPtr)|0), ((poolPtr)|0), 4);
        SAFE_HEAP_STORE(((_environ)|0), ((envPtr)|0), 4);
      } else {
        envPtr = ((SAFE_HEAP_LOAD(((_environ)|0), 4, 0))|0);
        poolPtr = ((SAFE_HEAP_LOAD(((envPtr)|0), 4, 0))|0);
      }
  
      // Collect key=value lines.
      var strings = [];
      var totalSize = 0;
      for (var key in env) {
        if (typeof env[key] === 'string') {
          var line = key + '=' + env[key];
          strings.push(line);
          totalSize += line.length;
        }
      }
      if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
      }
  
      // Make new.
      var ptrSize = 4;
      for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        SAFE_HEAP_STORE((((envPtr)+(i * ptrSize))|0), ((poolPtr)|0), 4);
        poolPtr += line.length + 1;
      }
      SAFE_HEAP_STORE((((envPtr)+(strings.length * ptrSize))|0), ((0)|0), 4);
    }var ENV={};function _getenv(name) {
      // char *getenv(const char *name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/getenv.html
      if (name === 0) return 0;
      name = Pointer_stringify(name);
      if (!ENV.hasOwnProperty(name)) return 0;
  
      if (_getenv.ret) _free(_getenv.ret);
      _getenv.ret = allocate(intArrayFromString(ENV[name]), 'i8', ALLOC_NORMAL);
      return _getenv.ret;
    }

  function _getpagesize() {
      // int getpagesize(void);
      return PAGE_SIZE;
    }

  function _getpwuid(uid) {
      return 0; // NULL
    }

  function _kill(pid, sig) {
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/kill.html
      // Makes no sense in a single-process environment.
  	  // Should kill itself somtimes depending on `pid`
      Module.printErr('Calling stub instead of kill()');
      ___setErrNo(ERRNO_CODES.EPERM);
      return -1;
    }

  
  var ___tm_current=STATICTOP; STATICTOP += 48;;
  
  
  var ___tm_timezone=allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);function _localtime_r(time, tmPtr) {
      _tzset();
      var date = new Date(((SAFE_HEAP_LOAD(((time)|0), 4, 0))|0)*1000);
      SAFE_HEAP_STORE(((tmPtr)|0), ((date.getSeconds())|0), 4);
      SAFE_HEAP_STORE((((tmPtr)+(4))|0), ((date.getMinutes())|0), 4);
      SAFE_HEAP_STORE((((tmPtr)+(8))|0), ((date.getHours())|0), 4);
      SAFE_HEAP_STORE((((tmPtr)+(12))|0), ((date.getDate())|0), 4);
      SAFE_HEAP_STORE((((tmPtr)+(16))|0), ((date.getMonth())|0), 4);
      SAFE_HEAP_STORE((((tmPtr)+(20))|0), ((date.getFullYear()-1900)|0), 4);
      SAFE_HEAP_STORE((((tmPtr)+(24))|0), ((date.getDay())|0), 4);
  
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      SAFE_HEAP_STORE((((tmPtr)+(28))|0), ((yday)|0), 4);
      SAFE_HEAP_STORE((((tmPtr)+(36))|0), ((-(date.getTimezoneOffset() * 60))|0), 4);
  
      // Attention: DST is in December in South, and some regions don't have DST at all.
      var summerOffset = new Date(2000, 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      SAFE_HEAP_STORE((((tmPtr)+(32))|0), ((dst)|0), 4);
  
      var zonePtr = ((SAFE_HEAP_LOAD((((_tzname)+(dst ? 4 : 0))|0), 4, 0))|0);
      SAFE_HEAP_STORE((((tmPtr)+(40))|0), ((zonePtr)|0), 4);
  
      return tmPtr;
    }function _localtime(time) {
      return _localtime_r(time, ___tm_current);
    }


  function _log2() {
  Module['printErr']('missing function: log2'); abort(-1);
  }

  
  function _usleep(useconds) {
      // int usleep(useconds_t useconds);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/usleep.html
      // We're single-threaded, so use a busy loop. Super-ugly.
      var msec = useconds / 1000;
      if ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self['performance'] && self['performance']['now']) {
        var start = self['performance']['now']();
        while (self['performance']['now']() - start < msec) {
          // Do nothing.
        }
      } else {
        var start = Date.now();
        while (Date.now() - start < msec) {
          // Do nothing.
        }
      }
      return 0;
    }function _nanosleep(rqtp, rmtp) {
      // int nanosleep(const struct timespec  *rqtp, struct timespec *rmtp);
      var seconds = ((SAFE_HEAP_LOAD(((rqtp)|0), 4, 0))|0);
      var nanoseconds = ((SAFE_HEAP_LOAD((((rqtp)+(4))|0), 4, 0))|0);
      if (rmtp !== 0) {
        SAFE_HEAP_STORE(((rmtp)|0), ((0)|0), 4);
        SAFE_HEAP_STORE((((rmtp)+(4))|0), ((0)|0), 4);
      }
      return _usleep((seconds * 1e6) + (nanoseconds / 1000));
    }

  function _posix_spawn() {
  return _fork.apply(null, arguments)
  }

  function _posix_spawn_file_actions_adddup2() {
  Module['printErr']('missing function: posix_spawn_file_actions_adddup2'); abort(-1);
  }

  function _posix_spawn_file_actions_addopen() {
  Module['printErr']('missing function: posix_spawn_file_actions_addopen'); abort(-1);
  }

  function _posix_spawn_file_actions_destroy() {
  Module['printErr']('missing function: posix_spawn_file_actions_destroy'); abort(-1);
  }

  function _posix_spawn_file_actions_init() {
  Module['printErr']('missing function: posix_spawn_file_actions_init'); abort(-1);
  }

  function _pthread_cond_broadcast(x) {
      x = x | 0;
      return 0;
    }

  function _pthread_cond_wait() { return 0; }

  
  var PTHREAD_SPECIFIC={};function _pthread_getspecific(key) {
      return PTHREAD_SPECIFIC[key] || 0;
    }

  
  var PTHREAD_SPECIFIC_NEXT_KEY=1;function _pthread_key_create(key, destructor) {
      if (key == 0) {
        return ERRNO_CODES.EINVAL;
      }
      SAFE_HEAP_STORE(((key)|0), ((PTHREAD_SPECIFIC_NEXT_KEY)|0), 4);
      // values start at 0
      PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY] = 0;
      PTHREAD_SPECIFIC_NEXT_KEY++;
      return 0;
    }

  function _pthread_mutex_lock(x) {
      x = x | 0;
      return 0;
    }

  function _pthread_mutex_unlock(x) {
      x = x | 0;
      return 0;
    }

  function _pthread_once(ptr, func) {
      if (!_pthread_once.seen) _pthread_once.seen = {};
      if (ptr in _pthread_once.seen) return;
      Module['dynCall_v'](func);
      _pthread_once.seen[ptr] = 1;
    }

  function _pthread_setspecific(key, value) {
      if (!(key in PTHREAD_SPECIFIC)) {
        return ERRNO_CODES.EINVAL;
      }
      PTHREAD_SPECIFIC[key] = value;
      return 0;
    }

  function _raise(sig) {
      Module.printErr('Calling stub instead of raise()');
    ___setErrNo(ERRNO_CODES.ENOSYS);
      warnOnce('raise() returning an error as we do not support it');
      return -1;
    }

  function _round(d) {
      d = +d;
      return d >= +0 ? +Math_floor(d + +0.5) : +Math_ceil(d - +0.5);
    }


  function _sbrk(increment) {
      increment = increment|0;
      var oldDynamicTop = 0;
      var oldDynamicTopOnChange = 0;
      var newDynamicTop = 0;
      var totalMemory = 0;
      increment = ((increment + 15) & -16)|0;
      oldDynamicTop = HEAP32[DYNAMICTOP_PTR>>2]|0;
      newDynamicTop = oldDynamicTop + increment | 0;
  
      if (((increment|0) > 0 & (newDynamicTop|0) < (oldDynamicTop|0)) // Detect and fail if we would wrap around signed 32-bit int.
        | (newDynamicTop|0) < 0) { // Also underflow, sbrk() should be able to be used to subtract.
        abortOnCannotGrowMemory()|0;
        ___setErrNo(12);
        return -1;
      }
  
      HEAP32[DYNAMICTOP_PTR>>2] = newDynamicTop;
      totalMemory = getTotalMemory()|0;
      if ((newDynamicTop|0) > (totalMemory|0)) {
        if ((enlargeMemory()|0) == 0) {
          HEAP32[DYNAMICTOP_PTR>>2] = oldDynamicTop;
          ___setErrNo(12);
          return -1;
        }
      }
      return oldDynamicTop|0;
    }

  function _sigaction(signum, act, oldact) {
      //int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);
      Module.printErr('Calling stub instead of sigaction()');
      return 0;
    }

  function _sigemptyset(set) {
      SAFE_HEAP_STORE(((set)|0), ((0)|0), 4);
      return 0;
    }

  function _sigfillset(set) {
      SAFE_HEAP_STORE(((set)|0), ((-1>>>0)|0), 4);
      return 0;
    }

  function _sigprocmask() {
      Module.printErr('Calling stub instead of sigprocmask()');
      return 0;
    }

  
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]);
      return sum;
    }
  
  
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month 
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
  
      var tm_zone = ((SAFE_HEAP_LOAD((((tm)+(40))|0), 4, 0))|0);
  
      var date = {
        tm_sec: ((SAFE_HEAP_LOAD(((tm)|0), 4, 0))|0),
        tm_min: ((SAFE_HEAP_LOAD((((tm)+(4))|0), 4, 0))|0),
        tm_hour: ((SAFE_HEAP_LOAD((((tm)+(8))|0), 4, 0))|0),
        tm_mday: ((SAFE_HEAP_LOAD((((tm)+(12))|0), 4, 0))|0),
        tm_mon: ((SAFE_HEAP_LOAD((((tm)+(16))|0), 4, 0))|0),
        tm_year: ((SAFE_HEAP_LOAD((((tm)+(20))|0), 4, 0))|0),
        tm_wday: ((SAFE_HEAP_LOAD((((tm)+(24))|0), 4, 0))|0),
        tm_yday: ((SAFE_HEAP_LOAD((((tm)+(28))|0), 4, 0))|0),
        tm_isdst: ((SAFE_HEAP_LOAD((((tm)+(32))|0), 4, 0))|0),
        tm_gmtoff: ((SAFE_HEAP_LOAD((((tm)+(36))|0), 4, 0))|0),
        tm_zone: tm_zone ? Pointer_stringify(tm_zone) : ''
      };
  
      var pattern = Pointer_stringify(format);
  
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S'                  // Replaced by the locale's appropriate date representation
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
  
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      function leadingSomething(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      };
  
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      };
  
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        };
  
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      };
  
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      };
  
      function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else { 
            return thisDate.getFullYear()-1;
          }
      };
  
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls((year/100)|0,2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year. 
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes 
          // January 4th, which is also the week that includes the first Thursday of the year, and 
          // is also the first week that contains at least four days in the year. 
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of 
          // the last week of the preceding year; thus, for Saturday 2nd January 1999, 
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th, 
          // or 31st is a Monday, it and any following days are part of week 1 of the following year. 
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
          
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay() || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Sunday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
          
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
  
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week) 
          // as a decimal number [01,53]. If the week containing 1 January has four 
          // or more days in the new year, then it is considered week 1. 
          // Otherwise, it is the last week of the previous year, and the next week is week 1. 
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          } 
  
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
  
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay();
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Monday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          // convert from minutes into hhmm format (which means 60 minutes = 100 units)
          off = (off / 60)*100 + (off % 60);
          return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
        },
        '%Z': function(date) {
          return date.tm_zone;
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
  
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      } 
  
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }

  function _strftime_l(s, maxsize, format, tm) {
      return _strftime(s, maxsize, format, tm); // no locale support yet
    }


  function _time(ptr) {
      var ret = (Date.now()/1000)|0;
      if (ptr) {
        SAFE_HEAP_STORE(((ptr)|0), ((ret)|0), 4);
      }
      return ret;
    }

  function _wait(stat_loc) {
      // pid_t wait(int *stat_loc);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/wait.html
      // Makes no sense in a single-process environment.
      ___setErrNo(ERRNO_CODES.ECHILD);
      return -1;
    }

  function _waitpid() {
  return _wait.apply(null, arguments)
  }

  var ___dso_handle=STATICTOP; STATICTOP += 16;;


FS.staticInit();__ATINIT__.unshift(function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() });__ATMAIN__.push(function() { FS.ignorePermissions = false });__ATEXIT__.push(function() { FS.quit() });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;Module["FS_unlink"] = FS.unlink;;
__ATINIT__.unshift(function() { TTY.init() });__ATEXIT__.push(function() { TTY.shutdown() });;
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); var NODEJS_PATH = require("path"); NODEFS.staticInit(); };
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
      var t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else if (typeof dateNow !== 'undefined') {
    _emscripten_get_now = dateNow;
  } else if (typeof self === 'object' && self['performance'] && typeof self['performance']['now'] === 'function') {
    _emscripten_get_now = function() { return self['performance']['now'](); };
  } else if (typeof performance === 'object' && typeof performance['now'] === 'function') {
    _emscripten_get_now = function() { return performance['now'](); };
  } else {
    _emscripten_get_now = Date.now;
  };
___buildEnvironment(ENV);;
DYNAMICTOP_PTR = staticAlloc(4);

STACK_BASE = STACKTOP = alignMemory(STATICTOP);

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = alignMemory(STACK_MAX);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;

staticSealed = true; // seal the static portion of memory

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

var ASSERTIONS = true;

// All functions here should be maybeExported from jsifier.js

/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}


if (!Module["intArrayFromString"]) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["intArrayToString"]) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };

Module.asmGlobalArg = {};

Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "segfault": segfault, "alignfault": alignfault, "invoke_diii": invoke_diii, "invoke_fiii": invoke_fiii, "invoke_i": invoke_i, "invoke_ii": invoke_ii, "invoke_iii": invoke_iii, "invoke_iiii": invoke_iiii, "invoke_iiiii": invoke_iiiii, "invoke_iiiiid": invoke_iiiiid, "invoke_iiiiii": invoke_iiiiii, "invoke_iiiiiii": invoke_iiiiiii, "invoke_iiiiiiii": invoke_iiiiiiii, "invoke_iiiiiiiii": invoke_iiiiiiiii, "invoke_iiiiiiiiiii": invoke_iiiiiiiiiii, "invoke_iiiiiiiiiiii": invoke_iiiiiiiiiiii, "invoke_iiiiiiiiiiiii": invoke_iiiiiiiiiiiii, "invoke_iiiiij": invoke_iiiiij, "invoke_jiiii": invoke_jiiii, "invoke_v": invoke_v, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_viii": invoke_viii, "invoke_viiii": invoke_viiii, "invoke_viiiii": invoke_viiiii, "invoke_viiiiiii": invoke_viiiiiii, "invoke_viiiiiiiiii": invoke_viiiiiiiiii, "invoke_viiiiiiiiiiiiiii": invoke_viiiiiiiiiiiiiii, "___syscall221": ___syscall221, "___syscall220": ___syscall220, "___syscall63": ___syscall63, "___assert_fail": ___assert_fail, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "_longjmp": _longjmp, "_execv": _execv, "_clock_gettime": _clock_gettime, "_sbrk": _sbrk, "_sigfillset": _sigfillset, "___cxa_begin_catch": ___cxa_begin_catch, "__addDays": __addDays, "_execl": _execl, "___syscall75": ___syscall75, "___syscall77": ___syscall77, "__isLeapYear": __isLeapYear, "___cxa_atexit": ___cxa_atexit, "_round": _round, "___cxa_rethrow": ___cxa_rethrow, "___syscall140": ___syscall140, "_posix_spawn_file_actions_adddup2": _posix_spawn_file_actions_adddup2, "___syscall145": ___syscall145, "___syscall146": ___syscall146, "___syscall147": ___syscall147, "___syscall85": ___syscall85, "_execve": _execve, "_emscripten_get_now_is_monotonic": _emscripten_get_now_is_monotonic, "___syscall83": ___syscall83, "___syscall122": ___syscall122, "_log2": _log2, "___cxa_free_exception": ___cxa_free_exception, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_wait": _wait, "___setErrNo": ___setErrNo, "_alarm": _alarm, "___resumeException": ___resumeException, "_mktime": _mktime, "_nanosleep": _nanosleep, "___syscall91": ___syscall91, "_kill": _kill, "_dladdr": _dladdr, "_pthread_once": _pthread_once, "___syscall12": ___syscall12, "_emscripten_get_now": _emscripten_get_now, "___syscall10": ___syscall10, "___syscall3": ___syscall3, "_asctime": _asctime, "___lock": ___lock, "___syscall6": ___syscall6, "___syscall5": ___syscall5, "___syscall4": ___syscall4, "_time": _time, "_pthread_mutex_lock": _pthread_mutex_lock, "_exit": _exit, "_posix_spawn_file_actions_addopen": _posix_spawn_file_actions_addopen, "___syscall202": ___syscall202, "___syscall20": ___syscall20, "___cxa_allocate_exception": ___cxa_allocate_exception, "___buildEnvironment": ___buildEnvironment, "_localtime_r": _localtime_r, "_tzset": _tzset, "___syscall192": ___syscall192, "___syscall191": ___syscall191, "___syscall197": ___syscall197, "___syscall196": ___syscall196, "___syscall195": ___syscall195, "___cxa_end_catch": ___cxa_end_catch, "___syscall199": ___syscall199, "_sigemptyset": _sigemptyset, "_raise": _raise, "_pthread_getspecific": _pthread_getspecific, "_asctime_r": _asctime_r, "_getenv": _getenv, "___map_file": ___map_file, "___syscall33": ___syscall33, "_pthread_key_create": _pthread_key_create, "_pthread_cond_broadcast": _pthread_cond_broadcast, "___syscall39": ___syscall39, "___syscall38": ___syscall38, "_testSetjmp": _testSetjmp, "___syscall340": ___syscall340, "___syscall180": ___syscall180, "_abort": _abort, "___syscall183": ___syscall183, "_localtime": _localtime, "___cxa_pure_virtual": ___cxa_pure_virtual, "_waitpid": _waitpid, "_strftime": _strftime, "_pthread_cond_wait": _pthread_cond_wait, "___syscall40": ___syscall40, "_sigaction": _sigaction, "_fork": _fork, "___cxa_find_matching_catch_2": ___cxa_find_matching_catch_2, "___cxa_find_matching_catch_3": ___cxa_find_matching_catch_3, "_posix_spawn_file_actions_destroy": _posix_spawn_file_actions_destroy, "_strftime_l": _strftime_l, "_getpagesize": _getpagesize, "_usleep": _usleep, "__exit": __exit, "_posix_spawn_file_actions_init": _posix_spawn_file_actions_init, "__arraySum": __arraySum, "_posix_spawn": _posix_spawn, "_pthread_mutex_unlock": _pthread_mutex_unlock, "___syscall54": ___syscall54, "___unlock": ___unlock, "_saveSetjmp": _saveSetjmp, "_pthread_setspecific": _pthread_setspecific, "_getpwuid": _getpwuid, "___cxa_throw": ___cxa_throw, "_sigprocmask": _sigprocmask, "_emscripten_longjmp": _emscripten_longjmp, "_atexit": _atexit, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "ABORT": ABORT, "___dso_handle": ___dso_handle, "_environ": _environ };

var asm = Module['asm'](Module.asmGlobalArg, Module.asmLibraryArg, buffer);
var real___ZNK5clang16TemplateArgument4dumpEv = asm["_ZNK5clang16TemplateArgument4dumpEv"]; asm["_ZNK5clang16TemplateArgument4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang16TemplateArgument4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_AssumptionCache_cpp = asm["_GLOBAL__sub_I_AssumptionCache.cpp"]; asm["_GLOBAL__sub_I_AssumptionCache.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AssumptionCache_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_EarlyIfConversion_cpp = asm["_GLOBAL__sub_I_EarlyIfConversion.cpp"]; asm["_GLOBAL__sub_I_EarlyIfConversion.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_EarlyIfConversion_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MemoryBuiltins_cpp = asm["_GLOBAL__sub_I_MemoryBuiltins.cpp"]; asm["_GLOBAL__sub_I_MemoryBuiltins.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MemoryBuiltins_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_PostRASchedulerList_cpp = asm["_GLOBAL__sub_I_PostRASchedulerList.cpp"]; asm["_GLOBAL__sub_I_PostRASchedulerList.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PostRASchedulerList_cpp.apply(null, arguments);
};

var real___ZNK4llvm6SDNode9dumprFullEPKNS_12SelectionDAGE = asm["_ZNK4llvm6SDNode9dumprFullEPKNS_12SelectionDAGE"]; asm["_ZNK4llvm6SDNode9dumprFullEPKNS_12SelectionDAGE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6SDNode9dumprFullEPKNS_12SelectionDAGE.apply(null, arguments);
};

var real___GLOBAL__sub_I_PeepholeOptimizer_cpp = asm["_GLOBAL__sub_I_PeepholeOptimizer.cpp"]; asm["_GLOBAL__sub_I_PeepholeOptimizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PeepholeOptimizer_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_WebAssemblyTargetMachine_cpp = asm["_GLOBAL__sub_I_WebAssemblyTargetMachine.cpp"]; asm["_GLOBAL__sub_I_WebAssemblyTargetMachine.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_WebAssemblyTargetMachine_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_CodeExtractor_cpp = asm["_GLOBAL__sub_I_CodeExtractor.cpp"]; asm["_GLOBAL__sub_I_CodeExtractor.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CodeExtractor_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_TwoAddressInstructionPass_cpp = asm["_GLOBAL__sub_I_TwoAddressInstructionPass.cpp"]; asm["_GLOBAL__sub_I_TwoAddressInstructionPass.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TwoAddressInstructionPass_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_FunctionAttrs_cpp = asm["_GLOBAL__sub_I_FunctionAttrs.cpp"]; asm["_GLOBAL__sub_I_FunctionAttrs.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_FunctionAttrs_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_IndirectCallPromotion_cpp = asm["_GLOBAL__sub_I_IndirectCallPromotion.cpp"]; asm["_GLOBAL__sub_I_IndirectCallPromotion.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_IndirectCallPromotion_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopAnalysisManager_cpp = asm["_GLOBAL__sub_I_LoopAnalysisManager.cpp"]; asm["_GLOBAL__sub_I_LoopAnalysisManager.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopAnalysisManager_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_PGOInstrumentation_cpp = asm["_GLOBAL__sub_I_PGOInstrumentation.cpp"]; asm["_GLOBAL__sub_I_PGOInstrumentation.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PGOInstrumentation_cpp.apply(null, arguments);
};

var real__emscripten_get_global_libc = asm["emscripten_get_global_libc"]; asm["emscripten_get_global_libc"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__emscripten_get_global_libc.apply(null, arguments);
};

var real___ZNK4llvm12PressureDiff4dumpERKNS_18TargetRegisterInfoE = asm["_ZNK4llvm12PressureDiff4dumpERKNS_18TargetRegisterInfoE"]; asm["_ZNK4llvm12PressureDiff4dumpERKNS_18TargetRegisterInfoE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12PressureDiff4dumpERKNS_18TargetRegisterInfoE.apply(null, arguments);
};

var real__stackSave = asm["stackSave"]; asm["stackSave"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__stackSave.apply(null, arguments);
};

var real___GLOBAL__sub_I_ScopedNoAliasAA_cpp = asm["_GLOBAL__sub_I_ScopedNoAliasAA.cpp"]; asm["_GLOBAL__sub_I_ScopedNoAliasAA.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ScopedNoAliasAA_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_CodeGenModule_cpp = asm["_GLOBAL__sub_I_CodeGenModule.cpp"]; asm["_GLOBAL__sub_I_CodeGenModule.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CodeGenModule_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopUnswitch_cpp = asm["_GLOBAL__sub_I_LoopUnswitch.cpp"]; asm["_GLOBAL__sub_I_LoopUnswitch.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopUnswitch_cpp.apply(null, arguments);
};

var real___ZNK4llvm16MachineFrameInfo4dumpERKNS_15MachineFunctionE = asm["_ZNK4llvm16MachineFrameInfo4dumpERKNS_15MachineFunctionE"]; asm["_ZNK4llvm16MachineFrameInfo4dumpERKNS_15MachineFunctionE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm16MachineFrameInfo4dumpERKNS_15MachineFunctionE.apply(null, arguments);
};

var real___ZNK5clang5Scope4dumpEv = asm["_ZNK5clang5Scope4dumpEv"]; asm["_ZNK5clang5Scope4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang5Scope4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_StackMapLivenessAnalysis_cpp = asm["_GLOBAL__sub_I_StackMapLivenessAnalysis.cpp"]; asm["_GLOBAL__sub_I_StackMapLivenessAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_StackMapLivenessAnalysis_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LCSSA_cpp = asm["_GLOBAL__sub_I_LCSSA.cpp"]; asm["_GLOBAL__sub_I_LCSSA.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LCSSA_cpp.apply(null, arguments);
};

var real___main = asm["_main"]; asm["_main"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___main.apply(null, arguments);
};

var real__memset = asm["memset"]; asm["memset"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__memset.apply(null, arguments);
};

var real___GLOBAL__sub_I_ContinuationRecordBuilder_cpp = asm["_GLOBAL__sub_I_ContinuationRecordBuilder.cpp"]; asm["_GLOBAL__sub_I_ContinuationRecordBuilder.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ContinuationRecordBuilder_cpp.apply(null, arguments);
};

var real___ZNK5clang4Type4dumpEv = asm["_ZNK5clang4Type4dumpEv"]; asm["_ZNK5clang4Type4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Type4dumpEv.apply(null, arguments);
};

var real___ZN5clang12LookupResult4dumpEv = asm["_ZN5clang12LookupResult4dumpEv"]; asm["_ZN5clang12LookupResult4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN5clang12LookupResult4dumpEv.apply(null, arguments);
};

var real_setThrew = asm["setThrew"]; asm["setThrew"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_setThrew.apply(null, arguments);
};

var real___GLOBAL__sub_I_SimplifyCFG_cpp = asm["_GLOBAL__sub_I_SimplifyCFG.cpp"]; asm["_GLOBAL__sub_I_SimplifyCFG.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SimplifyCFG_cpp.apply(null, arguments);
};

var real___ZNK4llvm8ILPValue5printERNS_11raw_ostreamE = asm["_ZNK4llvm8ILPValue5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm8ILPValue5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8ILPValue5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___ZNK4llvm9CallGraph4dumpEv = asm["_ZNK4llvm9CallGraph4dumpEv"]; asm["_ZNK4llvm9CallGraph4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9CallGraph4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm16ValueSymbolTable4dumpEv = asm["_ZNK4llvm16ValueSymbolTable4dumpEv"]; asm["_ZNK4llvm16ValueSymbolTable4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm16ValueSymbolTable4dumpEv.apply(null, arguments);
};

var real_dynCall_viiiiiiiiiiiii = asm["dynCall_viiiiiiiiiiiii"]; asm["dynCall_viiiiiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiiiiiiiii.apply(null, arguments);
};

var real__stackAlloc = asm["stackAlloc"]; asm["stackAlloc"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__stackAlloc.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopRotation_cpp = asm["_GLOBAL__sub_I_LoopRotation.cpp"]; asm["_GLOBAL__sub_I_LoopRotation.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopRotation_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_ScheduleDAG_cpp = asm["_GLOBAL__sub_I_ScheduleDAG.cpp"]; asm["_GLOBAL__sub_I_ScheduleDAG.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ScheduleDAG_cpp.apply(null, arguments);
};

var real___ZNK4llvm12LivePhysRegs4dumpEv = asm["_ZNK4llvm12LivePhysRegs4dumpEv"]; asm["_ZNK4llvm12LivePhysRegs4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12LivePhysRegs4dumpEv.apply(null, arguments);
};

var real___ZNK5clang8QualType4dumpERN4llvm11raw_ostreamE = asm["_ZNK5clang8QualType4dumpERN4llvm11raw_ostreamE"]; asm["_ZNK5clang8QualType4dumpERN4llvm11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang8QualType4dumpERN4llvm11raw_ostreamE.apply(null, arguments);
};

var real___ZNK5clang7CodeGen14CGRecordLayout4dumpEv = asm["_ZNK5clang7CodeGen14CGRecordLayout4dumpEv"]; asm["_ZNK5clang7CodeGen14CGRecordLayout4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang7CodeGen14CGRecordLayout4dumpEv.apply(null, arguments);
};

var real__free = asm["free"]; asm["free"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__free.apply(null, arguments);
};

var real___GLOBAL__sub_I_ThreadSanitizer_cpp = asm["_GLOBAL__sub_I_ThreadSanitizer.cpp"]; asm["_GLOBAL__sub_I_ThreadSanitizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ThreadSanitizer_cpp.apply(null, arguments);
};

var real___ZNK4llvm12MachineInstr4dumpEv = asm["_ZNK4llvm12MachineInstr4dumpEv"]; asm["_ZNK4llvm12MachineInstr4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12MachineInstr4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_BlockFrequencyInfo_cpp = asm["_GLOBAL__sub_I_BlockFrequencyInfo.cpp"]; asm["_GLOBAL__sub_I_BlockFrequencyInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BlockFrequencyInfo_cpp.apply(null, arguments);
};

var real___ZNK4llvm3DIE4dumpEv = asm["_ZNK4llvm3DIE4dumpEv"]; asm["_ZNK4llvm3DIE4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm3DIE4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_CalledValuePropagation_cpp = asm["_GLOBAL__sub_I_CalledValuePropagation.cpp"]; asm["_GLOBAL__sub_I_CalledValuePropagation.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CalledValuePropagation_cpp.apply(null, arguments);
};

var real_dynCall_viiiiiiiiiii = asm["dynCall_viiiiiiiiiii"]; asm["dynCall_viiiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiiiiiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_InstrProf_cpp = asm["_GLOBAL__sub_I_InstrProf.cpp"]; asm["_GLOBAL__sub_I_InstrProf.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InstrProf_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_SelectionDAGDumper_cpp = asm["_GLOBAL__sub_I_SelectionDAGDumper.cpp"]; asm["_GLOBAL__sub_I_SelectionDAGDumper.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SelectionDAGDumper_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_PHIElimination_cpp = asm["_GLOBAL__sub_I_PHIElimination.cpp"]; asm["_GLOBAL__sub_I_PHIElimination.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PHIElimination_cpp.apply(null, arguments);
};

var real___ZNK4llvm20MachineJumpTableInfo4dumpEv = asm["_ZNK4llvm20MachineJumpTableInfo4dumpEv"]; asm["_ZNK4llvm20MachineJumpTableInfo4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm20MachineJumpTableInfo4dumpEv.apply(null, arguments);
};

var real__realloc = asm["realloc"]; asm["realloc"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__realloc.apply(null, arguments);
};

var real___ZNK4llvm4sroa12AllocaSlices4dumpEv = asm["_ZNK4llvm4sroa12AllocaSlices4dumpEv"]; asm["_ZNK4llvm4sroa12AllocaSlices4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm4sroa12AllocaSlices4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm8DIEValue4dumpEv = asm["_ZNK4llvm8DIEValue4dumpEv"]; asm["_ZNK4llvm8DIEValue4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8DIEValue4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_TargetSchedule_cpp = asm["_GLOBAL__sub_I_TargetSchedule.cpp"]; asm["_GLOBAL__sub_I_TargetSchedule.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TargetSchedule_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineFunction_cpp = asm["_GLOBAL__sub_I_MachineFunction.cpp"]; asm["_GLOBAL__sub_I_MachineFunction.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineFunction_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MemorySanitizer_cpp = asm["_GLOBAL__sub_I_MemorySanitizer.cpp"]; asm["_GLOBAL__sub_I_MemorySanitizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MemorySanitizer_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_GlobalsModRef_cpp = asm["_GLOBAL__sub_I_GlobalsModRef.cpp"]; asm["_GLOBAL__sub_I_GlobalsModRef.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_GlobalsModRef_cpp.apply(null, arguments);
};

var real____floatunsitf = asm["__floatunsitf"]; asm["__floatunsitf"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____floatunsitf.apply(null, arguments);
};

var real___GLOBAL__sub_I_IRSymtab_cpp = asm["_GLOBAL__sub_I_IRSymtab.cpp"]; asm["_GLOBAL__sub_I_IRSymtab.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_IRSymtab_cpp.apply(null, arguments);
};

var real_dynCall_ffii = asm["dynCall_ffii"]; asm["dynCall_ffii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_ffii.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopInterchange_cpp = asm["_GLOBAL__sub_I_LoopInterchange.cpp"]; asm["_GLOBAL__sub_I_LoopInterchange.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopInterchange_cpp.apply(null, arguments);
};

var real_dynCall_viiiiiiiii = asm["dynCall_viiiiiiiii"]; asm["dynCall_viiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiiiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_GVNHoist_cpp = asm["_GLOBAL__sub_I_GVNHoist.cpp"]; asm["_GLOBAL__sub_I_GVNHoist.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_GVNHoist_cpp.apply(null, arguments);
};

var real_dynCall_fiii = asm["dynCall_fiii"]; asm["dynCall_fiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_fiii.apply(null, arguments);
};

var real_dynCall_viiiiiiiiiiii = asm["dynCall_viiiiiiiiiiii"]; asm["dynCall_viiiiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiiiiiiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_LowerGuardIntrinsic_cpp = asm["_GLOBAL__sub_I_LowerGuardIntrinsic.cpp"]; asm["_GLOBAL__sub_I_LowerGuardIntrinsic.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LowerGuardIntrinsic_cpp.apply(null, arguments);
};

var real___ZN4llvmlsERNS_11raw_ostreamERKNS_8ILPValueE = asm["_ZN4llvmlsERNS_11raw_ostreamERKNS_8ILPValueE"]; asm["_ZN4llvmlsERNS_11raw_ostreamERKNS_8ILPValueE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN4llvmlsERNS_11raw_ostreamERKNS_8ILPValueE.apply(null, arguments);
};

var real___ZNK4llvm12AttributeSet4dumpEv = asm["_ZNK4llvm12AttributeSet4dumpEv"]; asm["_ZNK4llvm12AttributeSet4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12AttributeSet4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm5Value4dumpEv = asm["_ZNK4llvm5Value4dumpEv"]; asm["_ZNK4llvm5Value4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5Value4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm17BranchProbability4dumpEv = asm["_ZNK4llvm17BranchProbability4dumpEv"]; asm["_ZNK4llvm17BranchProbability4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm17BranchProbability4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_MCContext_cpp = asm["_GLOBAL__sub_I_MCContext.cpp"]; asm["_GLOBAL__sub_I_MCContext.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MCContext_cpp.apply(null, arguments);
};

var real_dynCall_i = asm["dynCall_i"]; asm["dynCall_i"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_i.apply(null, arguments);
};

var real____multf3 = asm["__multf3"]; asm["__multf3"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____multf3.apply(null, arguments);
};

var real___ZNK4llvm13LazyCallGraph4Node4dumpEv = asm["_ZNK4llvm13LazyCallGraph4Node4dumpEv"]; asm["_ZNK4llvm13LazyCallGraph4Node4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13LazyCallGraph4Node4dumpEv.apply(null, arguments);
};

var real____errno_location = asm["__errno_location"]; asm["__errno_location"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____errno_location.apply(null, arguments);
};

var real___malloc = asm["_malloc"]; asm["_malloc"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___malloc.apply(null, arguments);
};

var real_dynCall_v = asm["dynCall_v"]; asm["dynCall_v"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_v.apply(null, arguments);
};

var real___ZNK5clang11DeclContext15dumpDeclContextEv = asm["_ZNK5clang11DeclContext15dumpDeclContextEv"]; asm["_ZNK5clang11DeclContext15dumpDeclContextEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang11DeclContext15dumpDeclContextEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopAccessAnalysis_cpp = asm["_GLOBAL__sub_I_LoopAccessAnalysis.cpp"]; asm["_GLOBAL__sub_I_LoopAccessAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopAccessAnalysis_cpp.apply(null, arguments);
};

var real___ZNK4llvm10sampleprof12LineLocation4dumpEv = asm["_ZNK4llvm10sampleprof12LineLocation4dumpEv"]; asm["_ZNK4llvm10sampleprof12LineLocation4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10sampleprof12LineLocation4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineDominators_cpp = asm["_GLOBAL__sub_I_MachineDominators.cpp"]; asm["_GLOBAL__sub_I_MachineDominators.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineDominators_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_SimpleLoopUnswitch_cpp = asm["_GLOBAL__sub_I_SimpleLoopUnswitch.cpp"]; asm["_GLOBAL__sub_I_SimpleLoopUnswitch.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SimpleLoopUnswitch_cpp.apply(null, arguments);
};

var real____divtf3 = asm["__divtf3"]; asm["__divtf3"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____divtf3.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineScheduler_cpp = asm["_GLOBAL__sub_I_MachineScheduler.cpp"]; asm["_GLOBAL__sub_I_MachineScheduler.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineScheduler_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_ADCE_cpp = asm["_GLOBAL__sub_I_ADCE.cpp"]; asm["_GLOBAL__sub_I_ADCE.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ADCE_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_ObjCARCAnalysisUtils_cpp = asm["_GLOBAL__sub_I_ObjCARCAnalysisUtils.cpp"]; asm["_GLOBAL__sub_I_ObjCARCAnalysisUtils.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ObjCARCAnalysisUtils_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_SafeStackColoring_cpp = asm["_GLOBAL__sub_I_SafeStackColoring.cpp"]; asm["_GLOBAL__sub_I_SafeStackColoring.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SafeStackColoring_cpp.apply(null, arguments);
};

var real___ZN4llvm9safestack13StackColoring17dumpBlockLivenessEv = asm["_ZN4llvm9safestack13StackColoring17dumpBlockLivenessEv"]; asm["_ZN4llvm9safestack13StackColoring17dumpBlockLivenessEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN4llvm9safestack13StackColoring17dumpBlockLivenessEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_SimplifyCFGPass_cpp = asm["_GLOBAL__sub_I_SimplifyCFGPass.cpp"]; asm["_GLOBAL__sub_I_SimplifyCFGPass.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SimplifyCFGPass_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LiveDebugVariables_cpp = asm["_GLOBAL__sub_I_LiveDebugVariables.cpp"]; asm["_GLOBAL__sub_I_LiveDebugVariables.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LiveDebugVariables_cpp.apply(null, arguments);
};

var real___ZNK4llvm6SDNode4dumpEv = asm["_ZNK4llvm6SDNode4dumpEv"]; asm["_ZNK4llvm6SDNode4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6SDNode4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegisterUsageInfo_cpp = asm["_GLOBAL__sub_I_RegisterUsageInfo.cpp"]; asm["_GLOBAL__sub_I_RegisterUsageInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegisterUsageInfo_cpp.apply(null, arguments);
};

var real__stackRestore = asm["stackRestore"]; asm["stackRestore"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__stackRestore.apply(null, arguments);
};

var real___ZNK5clang14SourceLocation4dumpERKNS_13SourceManagerE = asm["_ZNK5clang14SourceLocation4dumpERKNS_13SourceManagerE"]; asm["_ZNK5clang14SourceLocation4dumpERKNS_13SourceManagerE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang14SourceLocation4dumpERKNS_13SourceManagerE.apply(null, arguments);
};

var real___ZNK5clang13SourceManager4dumpEv = asm["_ZNK5clang13SourceManager4dumpEv"]; asm["_ZNK5clang13SourceManager4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang13SourceManager4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm3opt3Arg4dumpEv = asm["_ZNK4llvm3opt3Arg4dumpEv"]; asm["_ZNK4llvm3opt3Arg4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm3opt3Arg4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_MIRCanonicalizerPass_cpp = asm["_GLOBAL__sub_I_MIRCanonicalizerPass.cpp"]; asm["_GLOBAL__sub_I_MIRCanonicalizerPass.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MIRCanonicalizerPass_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_Statistic_cpp = asm["_GLOBAL__sub_I_Statistic.cpp"]; asm["_GLOBAL__sub_I_Statistic.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Statistic_cpp.apply(null, arguments);
};

var real____trunctfsf2 = asm["__trunctfsf2"]; asm["__trunctfsf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____trunctfsf2.apply(null, arguments);
};

var real___ZNK5clang9MacroInfo4dumpEv = asm["_ZNK5clang9MacroInfo4dumpEv"]; asm["_ZNK5clang9MacroInfo4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang9MacroInfo4dumpEv.apply(null, arguments);
};

var real_dynCall_ii = asm["dynCall_ii"]; asm["dynCall_ii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_ii.apply(null, arguments);
};

var real___ZNK4llvm10ReadyQueue4dumpEv = asm["_ZNK4llvm10ReadyQueue4dumpEv"]; asm["_ZNK4llvm10ReadyQueue4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10ReadyQueue4dumpEv.apply(null, arguments);
};

var real___ZNK5clang17InitializedEntity4dumpEv = asm["_ZNK5clang17InitializedEntity4dumpEv"]; asm["_ZNK5clang17InitializedEntity4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang17InitializedEntity4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm6MCInst4dumpEv = asm["_ZNK4llvm6MCInst4dumpEv"]; asm["_ZNK4llvm6MCInst4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6MCInst4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm19MachineRegisterInfo8dumpUsesEj = asm["_ZNK4llvm19MachineRegisterInfo8dumpUsesEj"]; asm["_ZNK4llvm19MachineRegisterInfo8dumpUsesEj"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm19MachineRegisterInfo8dumpUsesEj.apply(null, arguments);
};

var real___ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamE = asm["_ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamE"]; asm["_ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamE.apply(null, arguments);
};

var real____cxa_can_catch = asm["__cxa_can_catch"]; asm["__cxa_can_catch"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____cxa_can_catch.apply(null, arguments);
};

var real___GLOBAL__sub_I_AddDiscriminators_cpp = asm["_GLOBAL__sub_I_AddDiscriminators.cpp"]; asm["_GLOBAL__sub_I_AddDiscriminators.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AddDiscriminators_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_AliasAnalysisEvaluator_cpp = asm["_GLOBAL__sub_I_AliasAnalysisEvaluator.cpp"]; asm["_GLOBAL__sub_I_AliasAnalysisEvaluator.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AliasAnalysisEvaluator_cpp.apply(null, arguments);
};

var real___ZNK4llvm16LiveRangeUpdater4dumpEv = asm["_ZNK4llvm16LiveRangeUpdater4dumpEv"]; asm["_ZNK4llvm16LiveRangeUpdater4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm16LiveRangeUpdater4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm10bfi_detail9BlockMass4dumpEv = asm["_ZNK4llvm10bfi_detail9BlockMass4dumpEv"]; asm["_ZNK4llvm10bfi_detail9BlockMass4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10bfi_detail9BlockMass4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm7PMStack4dumpEv = asm["_ZNK4llvm7PMStack4dumpEv"]; asm["_ZNK4llvm7PMStack4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm7PMStack4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegAllocBasic_cpp = asm["_GLOBAL__sub_I_RegAllocBasic.cpp"]; asm["_GLOBAL__sub_I_RegAllocBasic.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegAllocBasic_cpp.apply(null, arguments);
};

var real____extendsftf2 = asm["__extendsftf2"]; asm["__extendsftf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____extendsftf2.apply(null, arguments);
};

var real___ZN4llvm9safestack13StackColoring14dumpLiveRangesEv = asm["_ZN4llvm9safestack13StackColoring14dumpLiveRangesEv"]; asm["_ZN4llvm9safestack13StackColoring14dumpLiveRangesEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN4llvm9safestack13StackColoring14dumpLiveRangesEv.apply(null, arguments);
};

var real___ZNK4llvm9MCSection4dumpEv = asm["_ZNK4llvm9MCSection4dumpEv"]; asm["_ZNK4llvm9MCSection4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9MCSection4dumpEv.apply(null, arguments);
};

var real_____cxa_demangle = asm["___cxa_demangle"]; asm["___cxa_demangle"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_____cxa_demangle.apply(null, arguments);
};

var real___ZNK5clang4Decl4dumpERN4llvm11raw_ostreamEb = asm["_ZNK5clang4Decl4dumpERN4llvm11raw_ostreamEb"]; asm["_ZNK5clang4Decl4dumpERN4llvm11raw_ostreamEb"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Decl4dumpERN4llvm11raw_ostreamEb.apply(null, arguments);
};

var real___GLOBAL__sub_I_JumpThreading_cpp = asm["_GLOBAL__sub_I_JumpThreading.cpp"]; asm["_GLOBAL__sub_I_JumpThreading.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_JumpThreading_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_DIBuilder_cpp = asm["_GLOBAL__sub_I_DIBuilder.cpp"]; asm["_GLOBAL__sub_I_DIBuilder.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DIBuilder_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegisterCoalescer_cpp = asm["_GLOBAL__sub_I_RegisterCoalescer.cpp"]; asm["_GLOBAL__sub_I_RegisterCoalescer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegisterCoalescer_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_InlineSpiller_cpp = asm["_GLOBAL__sub_I_InlineSpiller.cpp"]; asm["_GLOBAL__sub_I_InlineSpiller.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InlineSpiller_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_InstructionCombining_cpp = asm["_GLOBAL__sub_I_InstructionCombining.cpp"]; asm["_GLOBAL__sub_I_InstructionCombining.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InstructionCombining_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineLICM_cpp = asm["_GLOBAL__sub_I_MachineLICM.cpp"]; asm["_GLOBAL__sub_I_MachineLICM.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineLICM_cpp.apply(null, arguments);
};

var real__main = asm["main"]; asm["main"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__main.apply(null, arguments);
};

var real___ZNK4llvm20CallGraphWrapperPass4dumpEv = asm["_ZNK4llvm20CallGraphWrapperPass4dumpEv"]; asm["_ZNK4llvm20CallGraphWrapperPass4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm20CallGraphWrapperPass4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_RandomNumberGenerator_cpp = asm["_GLOBAL__sub_I_RandomNumberGenerator.cpp"]; asm["_GLOBAL__sub_I_RandomNumberGenerator.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RandomNumberGenerator_cpp.apply(null, arguments);
};

var real___ZNK4llvm15MachineFunction4dumpEv = asm["_ZNK4llvm15MachineFunction4dumpEv"]; asm["_ZNK4llvm15MachineFunction4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm15MachineFunction4dumpEv.apply(null, arguments);
};

var real___ZN5clang17GlobalModuleIndex4dumpEv = asm["_ZN5clang17GlobalModuleIndex4dumpEv"]; asm["_ZN5clang17GlobalModuleIndex4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN5clang17GlobalModuleIndex4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_AsmParser_cpp = asm["_GLOBAL__sub_I_AsmParser.cpp"]; asm["_GLOBAL__sub_I_AsmParser.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AsmParser_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_IndirectCallPromotionAnalysis_cpp = asm["_GLOBAL__sub_I_IndirectCallPromotionAnalysis.cpp"]; asm["_GLOBAL__sub_I_IndirectCallPromotionAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_IndirectCallPromotionAnalysis_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MemoryDependenceAnalysis_cpp = asm["_GLOBAL__sub_I_MemoryDependenceAnalysis.cpp"]; asm["_GLOBAL__sub_I_MemoryDependenceAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MemoryDependenceAnalysis_cpp.apply(null, arguments);
};

var real_dynCall_iiiiiiiiiiii = asm["dynCall_iiiiiiiiiiii"]; asm["dynCall_iiiiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiiiiiiiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_ImplicitNullChecks_cpp = asm["_GLOBAL__sub_I_ImplicitNullChecks.cpp"]; asm["_GLOBAL__sub_I_ImplicitNullChecks.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ImplicitNullChecks_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MIRPrinter_cpp = asm["_GLOBAL__sub_I_MIRPrinter.cpp"]; asm["_GLOBAL__sub_I_MIRPrinter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MIRPrinter_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_TypeHashing_cpp = asm["_GLOBAL__sub_I_TypeHashing.cpp"]; asm["_GLOBAL__sub_I_TypeHashing.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TypeHashing_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_DwarfDebug_cpp = asm["_GLOBAL__sub_I_DwarfDebug.cpp"]; asm["_GLOBAL__sub_I_DwarfDebug.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DwarfDebug_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_SROA_cpp = asm["_GLOBAL__sub_I_SROA.cpp"]; asm["_GLOBAL__sub_I_SROA.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SROA_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_StackProtector_cpp = asm["_GLOBAL__sub_I_StackProtector.cpp"]; asm["_GLOBAL__sub_I_StackProtector.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_StackProtector_cpp.apply(null, arguments);
};

var real___ZN5clang9ASTReader4dumpEv = asm["_ZN5clang9ASTReader4dumpEv"]; asm["_ZN5clang9ASTReader4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN5clang9ASTReader4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm8ILPValue4dumpEv = asm["_ZNK4llvm8ILPValue4dumpEv"]; asm["_ZNK4llvm8ILPValue4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8ILPValue4dumpEv.apply(null, arguments);
};

var real___ZN5clang13serialization10ModuleFile4dumpEv = asm["_ZN5clang13serialization10ModuleFile4dumpEv"]; asm["_ZN5clang13serialization10ModuleFile4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN5clang13serialization10ModuleFile4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegionPrinter_cpp = asm["_GLOBAL__sub_I_RegionPrinter.cpp"]; asm["_GLOBAL__sub_I_RegionPrinter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegionPrinter_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineBranchProbabilityInfo_cpp = asm["_GLOBAL__sub_I_MachineBranchProbabilityInfo.cpp"]; asm["_GLOBAL__sub_I_MachineBranchProbabilityInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineBranchProbabilityInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_AddressSanitizer_cpp = asm["_GLOBAL__sub_I_AddressSanitizer.cpp"]; asm["_GLOBAL__sub_I_AddressSanitizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AddressSanitizer_cpp.apply(null, arguments);
};

var real____cxa_is_pointer_type = asm["__cxa_is_pointer_type"]; asm["__cxa_is_pointer_type"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____cxa_is_pointer_type.apply(null, arguments);
};

var real___GLOBAL__sub_I_PassBuilder_cpp = asm["_GLOBAL__sub_I_PassBuilder.cpp"]; asm["_GLOBAL__sub_I_PassBuilder.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PassBuilder_cpp.apply(null, arguments);
};

var real_dynCall_iiiii = asm["dynCall_iiiii"]; asm["dynCall_iiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiii.apply(null, arguments);
};

var real___ZNK4llvm6Comdat4dumpEv = asm["_ZNK4llvm6Comdat4dumpEv"]; asm["_ZNK4llvm6Comdat4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6Comdat4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_CallGraphSCCPass_cpp = asm["_GLOBAL__sub_I_CallGraphSCCPass.cpp"]; asm["_GLOBAL__sub_I_CallGraphSCCPass.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CallGraphSCCPass_cpp.apply(null, arguments);
};

var real___ZNK5clang11DeclContext11dumpLookupsERN4llvm11raw_ostreamEbb = asm["_ZNK5clang11DeclContext11dumpLookupsERN4llvm11raw_ostreamEbb"]; asm["_ZNK5clang11DeclContext11dumpLookupsERN4llvm11raw_ostreamEbb"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang11DeclContext11dumpLookupsERN4llvm11raw_ostreamEbb.apply(null, arguments);
};

var real___GLOBAL__sub_I_SampleProfile_cpp = asm["_GLOBAL__sub_I_SampleProfile.cpp"]; asm["_GLOBAL__sub_I_SampleProfile.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SampleProfile_cpp.apply(null, arguments);
};

var real___ZNK4llvm10DIEInteger5printERNS_11raw_ostreamE = asm["_ZNK4llvm10DIEInteger5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm10DIEInteger5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10DIEInteger5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real____eqtf2 = asm["__eqtf2"]; asm["__eqtf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____eqtf2.apply(null, arguments);
};

var real____unordtf2 = asm["__unordtf2"]; asm["__unordtf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____unordtf2.apply(null, arguments);
};

var real___ZNK5clang14SourceLocation13printToStringERKNS_13SourceManagerE = asm["_ZNK5clang14SourceLocation13printToStringERKNS_13SourceManagerE"]; asm["_ZNK5clang14SourceLocation13printToStringERKNS_13SourceManagerE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang14SourceLocation13printToStringERKNS_13SourceManagerE.apply(null, arguments);
};

var real___ZNK5clang4Stmt4dumpEv = asm["_ZNK5clang4Stmt4dumpEv"]; asm["_ZNK5clang4Stmt4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Stmt4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_CorrelatedValuePropagation_cpp = asm["_GLOBAL__sub_I_CorrelatedValuePropagation.cpp"]; asm["_GLOBAL__sub_I_CorrelatedValuePropagation.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CorrelatedValuePropagation_cpp.apply(null, arguments);
};

var real___ZNK4llvm13LazyCallGraph6RefSCC4dumpEv = asm["_ZNK4llvm13LazyCallGraph6RefSCC4dumpEv"]; asm["_ZNK4llvm13LazyCallGraph6RefSCC4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13LazyCallGraph6RefSCC4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm28DominanceFrontierWrapperPass4dumpEv = asm["_ZNK4llvm28DominanceFrontierWrapperPass4dumpEv"]; asm["_ZNK4llvm28DominanceFrontierWrapperPass4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm28DominanceFrontierWrapperPass4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_GraphWriter_cpp = asm["_GLOBAL__sub_I_GraphWriter.cpp"]; asm["_GLOBAL__sub_I_GraphWriter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_GraphWriter_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_SimplifyLibCalls_cpp = asm["_GLOBAL__sub_I_SimplifyLibCalls.cpp"]; asm["_GLOBAL__sub_I_SimplifyLibCalls.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SimplifyLibCalls_cpp.apply(null, arguments);
};

var real___ZNK4llvm12SelectionDAG4dumpEv = asm["_ZNK4llvm12SelectionDAG4dumpEv"]; asm["_ZNK4llvm12SelectionDAG4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12SelectionDAG4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopDistribute_cpp = asm["_GLOBAL__sub_I_LoopDistribute.cpp"]; asm["_GLOBAL__sub_I_LoopDistribute.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopDistribute_cpp.apply(null, arguments);
};

var real___ZNK4llvm15AliasSetTracker4dumpEv = asm["_ZNK4llvm15AliasSetTracker4dumpEv"]; asm["_ZNK4llvm15AliasSetTracker4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm15AliasSetTracker4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm5Twine8dumpReprEv = asm["_ZNK4llvm5Twine8dumpReprEv"]; asm["_ZNK4llvm5Twine8dumpReprEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5Twine8dumpReprEv.apply(null, arguments);
};

var real___ZNK4llvm6SDNode14dumprWithDepthEPKNS_12SelectionDAGEj = asm["_ZNK4llvm6SDNode14dumprWithDepthEPKNS_12SelectionDAGEj"]; asm["_ZNK4llvm6SDNode14dumprWithDepthEPKNS_12SelectionDAGEj"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6SDNode14dumprWithDepthEPKNS_12SelectionDAGEj.apply(null, arguments);
};

var real___GLOBAL__sub_I_CodeGenPGO_cpp = asm["_GLOBAL__sub_I_CodeGenPGO.cpp"]; asm["_GLOBAL__sub_I_CodeGenPGO.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CodeGenPGO_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_StackSlotColoring_cpp = asm["_GLOBAL__sub_I_StackSlotColoring.cpp"]; asm["_GLOBAL__sub_I_StackSlotColoring.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_StackSlotColoring_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_WinEHPrepare_cpp = asm["_GLOBAL__sub_I_WinEHPrepare.cpp"]; asm["_GLOBAL__sub_I_WinEHPrepare.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_WinEHPrepare_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_InterleavedAccessPass_cpp = asm["_GLOBAL__sub_I_InterleavedAccessPass.cpp"]; asm["_GLOBAL__sub_I_InterleavedAccessPass.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InterleavedAccessPass_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_PredicateInfo_cpp = asm["_GLOBAL__sub_I_PredicateInfo.cpp"]; asm["_GLOBAL__sub_I_PredicateInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PredicateInfo_cpp.apply(null, arguments);
};

var real___ZNK4llvm12LiveInterval4dumpEv = asm["_ZNK4llvm12LiveInterval4dumpEv"]; asm["_ZNK4llvm12LiveInterval4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12LiveInterval4dumpEv.apply(null, arguments);
};

var real___realloc = asm["_realloc"]; asm["_realloc"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___realloc.apply(null, arguments);
};

var real___ZNK5clang15LocationContext9dumpStackEv = asm["_ZNK5clang15LocationContext9dumpStackEv"]; asm["_ZNK5clang15LocationContext9dumpStackEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang15LocationContext9dumpStackEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_Signals_cpp = asm["_GLOBAL__sub_I_Signals.cpp"]; asm["_GLOBAL__sub_I_Signals.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Signals_cpp.apply(null, arguments);
};

var real___ZNK4llvm11NamedMDNode4dumpEv = asm["_ZNK4llvm11NamedMDNode4dumpEv"]; asm["_ZNK4llvm11NamedMDNode4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm11NamedMDNode4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_MergeFunctions_cpp = asm["_GLOBAL__sub_I_MergeFunctions.cpp"]; asm["_GLOBAL__sub_I_MergeFunctions.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MergeFunctions_cpp.apply(null, arguments);
};

var real___ZNK4llvm13ScheduleDAGMI12dumpScheduleEv = asm["_ZNK4llvm13ScheduleDAGMI12dumpScheduleEv"]; asm["_ZNK4llvm13ScheduleDAGMI12dumpScheduleEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13ScheduleDAGMI12dumpScheduleEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_SanitizerCoverage_cpp = asm["_GLOBAL__sub_I_SanitizerCoverage.cpp"]; asm["_GLOBAL__sub_I_SanitizerCoverage.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SanitizerCoverage_cpp.apply(null, arguments);
};

var real___ZNK4llvm14DependenceInfo10Constraint4dumpERNS_11raw_ostreamE = asm["_ZNK4llvm14DependenceInfo10Constraint4dumpERNS_11raw_ostreamE"]; asm["_ZNK4llvm14DependenceInfo10Constraint4dumpERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm14DependenceInfo10Constraint4dumpERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_BranchProbabilityInfo_cpp = asm["_GLOBAL__sub_I_BranchProbabilityInfo.cpp"]; asm["_GLOBAL__sub_I_BranchProbabilityInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BranchProbabilityInfo_cpp.apply(null, arguments);
};

var real___ZNK4llvm8DebugLoc4dumpEv = asm["_ZNK4llvm8DebugLoc4dumpEv"]; asm["_ZNK4llvm8DebugLoc4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8DebugLoc4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_ScheduleDAGInstrs_cpp = asm["_GLOBAL__sub_I_ScheduleDAGInstrs.cpp"]; asm["_GLOBAL__sub_I_ScheduleDAGInstrs.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ScheduleDAGInstrs_cpp.apply(null, arguments);
};

var real_setTempRet0 = asm["setTempRet0"]; asm["setTempRet0"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_setTempRet0.apply(null, arguments);
};

var real_dynCall_viiiiiiiiiiiiiii = asm["dynCall_viiiiiiiiiiiiiii"]; asm["dynCall_viiiiiiiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiiiiiiiiiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopStrengthReduce_cpp = asm["_GLOBAL__sub_I_LoopStrengthReduce.cpp"]; asm["_GLOBAL__sub_I_LoopStrengthReduce.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopStrengthReduce_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_HWAddressSanitizer_cpp = asm["_GLOBAL__sub_I_HWAddressSanitizer.cpp"]; asm["_GLOBAL__sub_I_HWAddressSanitizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_HWAddressSanitizer_cpp.apply(null, arguments);
};

var real___ZNK5clang12TemplateName4dumpEv = asm["_ZNK5clang12TemplateName4dumpEv"]; asm["_ZNK5clang12TemplateName4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang12TemplateName4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_BitcodeReader_cpp = asm["_GLOBAL__sub_I_BitcodeReader.cpp"]; asm["_GLOBAL__sub_I_BitcodeReader.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BitcodeReader_cpp.apply(null, arguments);
};

var real___ZNK4llvm21MachineRegionInfoPass4dumpEv = asm["_ZNK4llvm21MachineRegionInfoPass4dumpEv"]; asm["_ZNK4llvm21MachineRegionInfoPass4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm21MachineRegionInfoPass4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineRegisterInfo_cpp = asm["_GLOBAL__sub_I_MachineRegisterInfo.cpp"]; asm["_GLOBAL__sub_I_MachineRegisterInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineRegisterInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_AsmPrinter_cpp = asm["_GLOBAL__sub_I_AsmPrinter.cpp"]; asm["_GLOBAL__sub_I_AsmPrinter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AsmPrinter_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_PrologEpilogInserter_cpp = asm["_GLOBAL__sub_I_PrologEpilogInserter.cpp"]; asm["_GLOBAL__sub_I_PrologEpilogInserter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PrologEpilogInserter_cpp.apply(null, arguments);
};

var real___ZNK4llvm3GVN4dumpERNS_8DenseMapIjPNS_5ValueENS_12DenseMapInfoIjEENS_6detail12DenseMapPairIjS3_EEEE = asm["_ZNK4llvm3GVN4dumpERNS_8DenseMapIjPNS_5ValueENS_12DenseMapInfoIjEENS_6detail12DenseMapPairIjS3_EEEE"]; asm["_ZNK4llvm3GVN4dumpERNS_8DenseMapIjPNS_5ValueENS_12DenseMapInfoIjEENS_6detail12DenseMapPairIjS3_EEEE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm3GVN4dumpERNS_8DenseMapIjPNS_5ValueENS_12DenseMapInfoIjEENS_6detail12DenseMapPairIjS3_EEEE.apply(null, arguments);
};

var real___free = asm["_free"]; asm["_free"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___free.apply(null, arguments);
};

var real___GLOBAL__sub_I_LowerTypeTests_cpp = asm["_GLOBAL__sub_I_LowerTypeTests.cpp"]; asm["_GLOBAL__sub_I_LowerTypeTests.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LowerTypeTests_cpp.apply(null, arguments);
};

var real___ZNK4llvm5SUnit4dumpEPKNS_11ScheduleDAGE = asm["_ZNK4llvm5SUnit4dumpEPKNS_11ScheduleDAGE"]; asm["_ZNK4llvm5SUnit4dumpEPKNS_11ScheduleDAGE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5SUnit4dumpEPKNS_11ScheduleDAGE.apply(null, arguments);
};

var real_dynCall_vii = asm["dynCall_vii"]; asm["dynCall_vii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_vii.apply(null, arguments);
};

var real___ZN4llvm9safestack11StackLayout5printERNS_11raw_ostreamE = asm["_ZN4llvm9safestack11StackLayout5printERNS_11raw_ostreamE"]; asm["_ZN4llvm9safestack11StackLayout5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN4llvm9safestack11StackLayout5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___fflush = asm["_fflush"]; asm["_fflush"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___fflush.apply(null, arguments);
};

var real____floatsitf = asm["__floatsitf"]; asm["__floatsitf"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____floatsitf.apply(null, arguments);
};

var real___GLOBAL__sub_I_ExpandMemCmp_cpp = asm["_GLOBAL__sub_I_ExpandMemCmp.cpp"]; asm["_GLOBAL__sub_I_ExpandMemCmp.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ExpandMemCmp_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_Inliner_cpp = asm["_GLOBAL__sub_I_Inliner.cpp"]; asm["_GLOBAL__sub_I_Inliner.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Inliner_cpp.apply(null, arguments);
};

var real___ZNK4llvm9LiveRange4dumpEv = asm["_ZNK4llvm9LiveRange4dumpEv"]; asm["_ZNK4llvm9LiveRange4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9LiveRange4dumpEv.apply(null, arguments);
};

var real___ZNK5clang15DeclarationName4dumpEv = asm["_ZNK5clang15DeclarationName4dumpEv"]; asm["_ZNK5clang15DeclarationName4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang15DeclarationName4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm18LiveDebugVariables4dumpEv = asm["_ZNK4llvm18LiveDebugVariables4dumpEv"]; asm["_ZNK4llvm18LiveDebugVariables4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm18LiveDebugVariables4dumpEv.apply(null, arguments);
};

var real___ZNK5clang4Decl4dumpEv = asm["_ZNK5clang4Decl4dumpEv"]; asm["_ZNK5clang4Decl4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Decl4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_CommandLine_cpp = asm["_GLOBAL__sub_I_CommandLine.cpp"]; asm["_GLOBAL__sub_I_CommandLine.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CommandLine_cpp.apply(null, arguments);
};

var real___ZNK4llvm17AttributeListImpl4dumpEv = asm["_ZNK4llvm17AttributeListImpl4dumpEv"]; asm["_ZNK4llvm17AttributeListImpl4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm17AttributeListImpl4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_MCSymbol_cpp = asm["_GLOBAL__sub_I_MCSymbol.cpp"]; asm["_GLOBAL__sub_I_MCSymbol.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MCSymbol_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_DebugCounter_cpp = asm["_GLOBAL__sub_I_DebugCounter.cpp"]; asm["_GLOBAL__sub_I_DebugCounter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DebugCounter_cpp.apply(null, arguments);
};

var real___ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKS0_S4_ = asm["_ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKS0_S4_"]; asm["_ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKS0_S4_"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKS0_S4_.apply(null, arguments);
};

var real___GLOBAL__sub_I_WholeProgramDevirt_cpp = asm["_GLOBAL__sub_I_WholeProgramDevirt.cpp"]; asm["_GLOBAL__sub_I_WholeProgramDevirt.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_WholeProgramDevirt_cpp.apply(null, arguments);
};

var real_____errno_location = asm["___errno_location"]; asm["___errno_location"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_____errno_location.apply(null, arguments);
};

var real___ZNK4llvm6Module4dumpEv = asm["_ZNK4llvm6Module4dumpEv"]; asm["_ZNK4llvm6Module4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6Module4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm12PHITransAddr4dumpEv = asm["_ZNK4llvm12PHITransAddr4dumpEv"]; asm["_ZNK4llvm12PHITransAddr4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12PHITransAddr4dumpEv.apply(null, arguments);
};

var real____subtf3 = asm["__subtf3"]; asm["__subtf3"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____subtf3.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopUnrollPass_cpp = asm["_GLOBAL__sub_I_LoopUnrollPass.cpp"]; asm["_GLOBAL__sub_I_LoopUnrollPass.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopUnrollPass_cpp.apply(null, arguments);
};

var real___ZN4llvm18TargetRegisterInfo7dumpRegEjjPKS0_ = asm["_ZN4llvm18TargetRegisterInfo7dumpRegEjjPKS0_"]; asm["_ZN4llvm18TargetRegisterInfo7dumpRegEjjPKS0_"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN4llvm18TargetRegisterInfo7dumpRegEjjPKS0_.apply(null, arguments);
};

var real___ZNK4llvm7IVUsers4dumpEv = asm["_ZNK4llvm7IVUsers4dumpEv"]; asm["_ZNK4llvm7IVUsers4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm7IVUsers4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_ScheduleDAGRRList_cpp = asm["_GLOBAL__sub_I_ScheduleDAGRRList.cpp"]; asm["_GLOBAL__sub_I_ScheduleDAGRRList.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ScheduleDAGRRList_cpp.apply(null, arguments);
};

var real___ZNK4llvm8DIEBlock5printERNS_11raw_ostreamE = asm["_ZNK4llvm8DIEBlock5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm8DIEBlock5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8DIEBlock5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_Timer_cpp = asm["_GLOBAL__sub_I_Timer.cpp"]; asm["_GLOBAL__sub_I_Timer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Timer_cpp.apply(null, arguments);
};

var real____trunctfdf2 = asm["__trunctfdf2"]; asm["__trunctfdf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____trunctfdf2.apply(null, arguments);
};

var real___GLOBAL__sub_I_PassManagerBuilder_cpp = asm["_GLOBAL__sub_I_PassManagerBuilder.cpp"]; asm["_GLOBAL__sub_I_PassManagerBuilder.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PassManagerBuilder_cpp.apply(null, arguments);
};

var real___ZNK4llvm10VirtRegMap4dumpEv = asm["_ZNK4llvm10VirtRegMap4dumpEv"]; asm["_ZNK4llvm10VirtRegMap4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10VirtRegMap4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_WebAssemblyPeephole_cpp = asm["_GLOBAL__sub_I_WebAssemblyPeephole.cpp"]; asm["_GLOBAL__sub_I_WebAssemblyPeephole.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_WebAssemblyPeephole_cpp.apply(null, arguments);
};

var real___ZNK4llvm6MCExpr4dumpEv = asm["_ZNK4llvm6MCExpr4dumpEv"]; asm["_ZNK4llvm6MCExpr4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6MCExpr4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopLoadElimination_cpp = asm["_GLOBAL__sub_I_LoopLoadElimination.cpp"]; asm["_GLOBAL__sub_I_LoopLoadElimination.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopLoadElimination_cpp.apply(null, arguments);
};

var real___ZNK4llvm3opt7ArgList4dumpEv = asm["_ZNK4llvm3opt7ArgList4dumpEv"]; asm["_ZNK4llvm3opt7ArgList4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm3opt7ArgList4dumpEv.apply(null, arguments);
};

var real____growWasmMemory = asm["__growWasmMemory"]; asm["__growWasmMemory"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____growWasmMemory.apply(null, arguments);
};

var real___ZNK4llvm10sampleprof15FunctionSamples4dumpEv = asm["_ZNK4llvm10sampleprof15FunctionSamples4dumpEv"]; asm["_ZNK4llvm10sampleprof15FunctionSamples4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10sampleprof15FunctionSamples4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_TailDuplicator_cpp = asm["_GLOBAL__sub_I_TailDuplicator.cpp"]; asm["_GLOBAL__sub_I_TailDuplicator.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TailDuplicator_cpp.apply(null, arguments);
};

var real___ZNK4llvm4Loop4dumpEv = asm["_ZNK4llvm4Loop4dumpEv"]; asm["_ZNK4llvm4Loop4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm4Loop4dumpEv.apply(null, arguments);
};

var real_dynCall_diii = asm["dynCall_diii"]; asm["dynCall_diii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_diii.apply(null, arguments);
};

var real___GLOBAL__sub_I_ScheduleDAGVLIW_cpp = asm["_GLOBAL__sub_I_ScheduleDAGVLIW.cpp"]; asm["_GLOBAL__sub_I_ScheduleDAGVLIW.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ScheduleDAGVLIW_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopPredication_cpp = asm["_GLOBAL__sub_I_LoopPredication.cpp"]; asm["_GLOBAL__sub_I_LoopPredication.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopPredication_cpp.apply(null, arguments);
};

var real___ZNK5clang11DeclContext11dumpLookupsEv = asm["_ZNK5clang11DeclContext11dumpLookupsEv"]; asm["_ZNK5clang11DeclContext11dumpLookupsEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang11DeclContext11dumpLookupsEv.apply(null, arguments);
};

var real_dynCall_viiiiiiii = asm["dynCall_viiiiiiii"]; asm["dynCall_viiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_CodeGenPrepare_cpp = asm["_GLOBAL__sub_I_CodeGenPrepare.cpp"]; asm["_GLOBAL__sub_I_CodeGenPrepare.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CodeGenPrepare_cpp.apply(null, arguments);
};

var real_dynCall_iiiiid = asm["dynCall_iiiiid"]; asm["dynCall_iiiiid"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiid.apply(null, arguments);
};

var real___GLOBAL__sub_I_LICM_cpp = asm["_GLOBAL__sub_I_LICM.cpp"]; asm["_GLOBAL__sub_I_LICM.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LICM_cpp.apply(null, arguments);
};

var real_dynCall_iiiiii = asm["dynCall_iiiiii"]; asm["dynCall_iiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiii.apply(null, arguments);
};

var real__memcpy = asm["memcpy"]; asm["memcpy"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__memcpy.apply(null, arguments);
};

var real___ZNK4llvm8Metadata4dumpEv = asm["_ZNK4llvm8Metadata4dumpEv"]; asm["_ZNK4llvm8Metadata4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8Metadata4dumpEv.apply(null, arguments);
};

var real_dynCall_viiiiii = asm["dynCall_viiiiii"]; asm["dynCall_viiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiii.apply(null, arguments);
};

var real___ZNK4llvm8DIEDelta5printERNS_11raw_ostreamE = asm["_ZNK4llvm8DIEDelta5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm8DIEDelta5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8DIEDelta5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_EfficiencySanitizer_cpp = asm["_GLOBAL__sub_I_EfficiencySanitizer.cpp"]; asm["_GLOBAL__sub_I_EfficiencySanitizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_EfficiencySanitizer_cpp.apply(null, arguments);
};

var real____extenddftf2 = asm["__extenddftf2"]; asm["__extenddftf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____extenddftf2.apply(null, arguments);
};

var real___ZNK4llvm15ValueEnumerator4dumpEv = asm["_ZNK4llvm15ValueEnumerator4dumpEv"]; asm["_ZNK4llvm15ValueEnumerator4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm15ValueEnumerator4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_Debug_cpp = asm["_GLOBAL__sub_I_Debug.cpp"]; asm["_GLOBAL__sub_I_Debug.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Debug_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_ScheduleDAGSDNodes_cpp = asm["_GLOBAL__sub_I_ScheduleDAGSDNodes.cpp"]; asm["_GLOBAL__sub_I_ScheduleDAGSDNodes.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ScheduleDAGSDNodes_cpp.apply(null, arguments);
};

var real___memalign = asm["_memalign"]; asm["_memalign"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___memalign.apply(null, arguments);
};

var real___GLOBAL__sub_I_MetadataLoader_cpp = asm["_GLOBAL__sub_I_MetadataLoader.cpp"]; asm["_GLOBAL__sub_I_MetadataLoader.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MetadataLoader_cpp.apply(null, arguments);
};

var real___ZNK4llvm7DIEExpr5printERNS_11raw_ostreamE = asm["_ZNK4llvm7DIEExpr5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm7DIEExpr5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm7DIEExpr5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___ZNK4llvm11MachineLoop4dumpEv = asm["_ZNK4llvm11MachineLoop4dumpEv"]; asm["_ZNK4llvm11MachineLoop4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm11MachineLoop4dumpEv.apply(null, arguments);
};

var real____fixunstfsi = asm["__fixunstfsi"]; asm["__fixunstfsi"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____fixunstfsi.apply(null, arguments);
};

var real_dynCall_iiiiiiiiiiiii = asm["dynCall_iiiiiiiiiiiii"]; asm["dynCall_iiiiiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiiiiiiiiii.apply(null, arguments);
};

var real___ZNK4llvm18RegPressureTracker4dumpEv = asm["_ZNK4llvm18RegPressureTracker4dumpEv"]; asm["_ZNK4llvm18RegPressureTracker4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm18RegPressureTracker4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_RewriteStatepointsForGC_cpp = asm["_GLOBAL__sub_I_RewriteStatepointsForGC.cpp"]; asm["_GLOBAL__sub_I_RewriteStatepointsForGC.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RewriteStatepointsForGC_cpp.apply(null, arguments);
};

var real___ZNK5clang13HeaderMapImpl4dumpEv = asm["_ZNK5clang13HeaderMapImpl4dumpEv"]; asm["_ZNK5clang13HeaderMapImpl4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang13HeaderMapImpl4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_SelectionDAGBuilder_cpp = asm["_GLOBAL__sub_I_SelectionDAGBuilder.cpp"]; asm["_GLOBAL__sub_I_SelectionDAGBuilder.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SelectionDAGBuilder_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_BranchFolding_cpp = asm["_GLOBAL__sub_I_BranchFolding.cpp"]; asm["_GLOBAL__sub_I_BranchFolding.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BranchFolding_cpp.apply(null, arguments);
};

var real___ZNK4llvm9SlotIndex4dumpEv = asm["_ZNK4llvm9SlotIndex4dumpEv"]; asm["_ZNK4llvm9SlotIndex4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9SlotIndex4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm15DIEInlineString5printERNS_11raw_ostreamE = asm["_ZNK4llvm15DIEInlineString5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm15DIEInlineString5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm15DIEInlineString5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real____cxa_demangle = asm["__cxa_demangle"]; asm["__cxa_demangle"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____cxa_demangle.apply(null, arguments);
};

var real___ZNK4llvm8MCSymbol4dumpEv = asm["_ZNK4llvm8MCSymbol4dumpEv"]; asm["_ZNK4llvm8MCSymbol4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8MCSymbol4dumpEv.apply(null, arguments);
};

var real___ZNK5clang6driver11MultilibSet4dumpEv = asm["_ZNK5clang6driver11MultilibSet4dumpEv"]; asm["_ZNK5clang6driver11MultilibSet4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang6driver11MultilibSet4dumpEv.apply(null, arguments);
};

var real_____cxa_is_pointer_type = asm["___cxa_is_pointer_type"]; asm["___cxa_is_pointer_type"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_____cxa_is_pointer_type.apply(null, arguments);
};

var real___ZNK4llvm4Pass4dumpEv = asm["_ZNK4llvm4Pass4dumpEv"]; asm["_ZNK4llvm4Pass4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm4Pass4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm13LazyCallGraph3SCC4dumpEv = asm["_ZNK4llvm13LazyCallGraph3SCC4dumpEv"]; asm["_ZNK4llvm13LazyCallGraph3SCC4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13LazyCallGraph3SCC4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopIdiomRecognize_cpp = asm["_GLOBAL__sub_I_LoopIdiomRecognize.cpp"]; asm["_GLOBAL__sub_I_LoopIdiomRecognize.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopIdiomRecognize_cpp.apply(null, arguments);
};

var real_dynCall_vi = asm["dynCall_vi"]; asm["dynCall_vi"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_vi.apply(null, arguments);
};

var real___GLOBAL__sub_I_DwarfUnit_cpp = asm["_GLOBAL__sub_I_DwarfUnit.cpp"]; asm["_GLOBAL__sub_I_DwarfUnit.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DwarfUnit_cpp.apply(null, arguments);
};

var real___ZNK5clang19NestedNameSpecifier4dumpEv = asm["_ZNK5clang19NestedNameSpecifier4dumpEv"]; asm["_ZNK5clang19NestedNameSpecifier4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang19NestedNameSpecifier4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_OptBisect_cpp = asm["_GLOBAL__sub_I_OptBisect.cpp"]; asm["_GLOBAL__sub_I_OptBisect.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_OptBisect_cpp.apply(null, arguments);
};

var real__memalign = asm["memalign"]; asm["memalign"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__memalign.apply(null, arguments);
};

var real___ZNK5clang13FullSourceLoc4dumpEv = asm["_ZNK5clang13FullSourceLoc4dumpEv"]; asm["_ZNK5clang13FullSourceLoc4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang13FullSourceLoc4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_PartialInlining_cpp = asm["_GLOBAL__sub_I_PartialInlining.cpp"]; asm["_GLOBAL__sub_I_PartialInlining.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PartialInlining_cpp.apply(null, arguments);
};

var real___ZNK4llvm11SplitEditor4dumpEv = asm["_ZNK4llvm11SplitEditor4dumpEv"]; asm["_ZNK4llvm11SplitEditor4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm11SplitEditor4dumpEv.apply(null, arguments);
};

var real___ZNK5clang4Stmt9dumpColorEv = asm["_ZNK5clang4Stmt9dumpColorEv"]; asm["_ZNK5clang4Stmt9dumpColorEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Stmt9dumpColorEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_TargetPassConfig_cpp = asm["_GLOBAL__sub_I_TargetPassConfig.cpp"]; asm["_GLOBAL__sub_I_TargetPassConfig.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TargetPassConfig_cpp.apply(null, arguments);
};

var real___ZNK4llvm9DIEAbbrev5printERNS_11raw_ostreamE = asm["_ZNK4llvm9DIEAbbrev5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm9DIEAbbrev5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9DIEAbbrev5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___ZNK5clang26StandardConversionSequence4dumpEv = asm["_ZNK5clang26StandardConversionSequence4dumpEv"]; asm["_ZNK5clang26StandardConversionSequence4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang26StandardConversionSequence4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegAllocGreedy_cpp = asm["_GLOBAL__sub_I_RegAllocGreedy.cpp"]; asm["_GLOBAL__sub_I_RegAllocGreedy.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegAllocGreedy_cpp.apply(null, arguments);
};

var real___ZNK4llvm14RegionInfoPass4dumpEv = asm["_ZNK4llvm14RegionInfoPass4dumpEv"]; asm["_ZNK4llvm14RegionInfoPass4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm14RegionInfoPass4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm9DIEString5printERNS_11raw_ostreamE = asm["_ZNK4llvm9DIEString5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm9DIEString5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9DIEString5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_DependenceAnalysis_cpp = asm["_GLOBAL__sub_I_DependenceAnalysis.cpp"]; asm["_GLOBAL__sub_I_DependenceAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DependenceAnalysis_cpp.apply(null, arguments);
};

var real___ZNK5clang7APValue4dumpEv = asm["_ZNK5clang7APValue4dumpEv"]; asm["_ZNK5clang7APValue4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang7APValue4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm4SDep5printERNS_11raw_ostreamEPKNS_18TargetRegisterInfoE = asm["_ZNK4llvm4SDep5printERNS_11raw_ostreamEPKNS_18TargetRegisterInfoE"]; asm["_ZNK4llvm4SDep5printERNS_11raw_ostreamEPKNS_18TargetRegisterInfoE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm4SDep5printERNS_11raw_ostreamEPKNS_18TargetRegisterInfoE.apply(null, arguments);
};

var real_dynCall_iiiiiii = asm["dynCall_iiiiiii"]; asm["dynCall_iiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiiii.apply(null, arguments);
};

var real___ZNK4llvm16RegisterPressure4dumpEPKNS_18TargetRegisterInfoE = asm["_ZNK4llvm16RegisterPressure4dumpEPKNS_18TargetRegisterInfoE"]; asm["_ZNK4llvm16RegisterPressure4dumpEPKNS_18TargetRegisterInfoE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm16RegisterPressure4dumpEPKNS_18TargetRegisterInfoE.apply(null, arguments);
};

var real___ZNK4llvm12LiveInterval8SubRange4dumpEv = asm["_ZNK4llvm12LiveInterval8SubRange4dumpEv"]; asm["_ZNK4llvm12LiveInterval8SubRange4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12LiveInterval8SubRange4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_ValueTracking_cpp = asm["_GLOBAL__sub_I_ValueTracking.cpp"]; asm["_GLOBAL__sub_I_ValueTracking.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ValueTracking_cpp.apply(null, arguments);
};

var real____netf2 = asm["__netf2"]; asm["__netf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____netf2.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineCombiner_cpp = asm["_GLOBAL__sub_I_MachineCombiner.cpp"]; asm["_GLOBAL__sub_I_MachineCombiner.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineCombiner_cpp.apply(null, arguments);
};

var real____addtf3 = asm["__addtf3"]; asm["__addtf3"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____addtf3.apply(null, arguments);
};

var real_dynCall_iid = asm["dynCall_iid"]; asm["dynCall_iid"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iid.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopRerollPass_cpp = asm["_GLOBAL__sub_I_LoopRerollPass.cpp"]; asm["_GLOBAL__sub_I_LoopRerollPass.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopRerollPass_cpp.apply(null, arguments);
};

var real_dynCall_iii = asm["dynCall_iii"]; asm["dynCall_iii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iii.apply(null, arguments);
};

var real___ZNK4llvm4Type4dumpEv = asm["_ZNK4llvm4Type4dumpEv"]; asm["_ZNK4llvm4Type4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm4Type4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm4Loop11dumpVerboseEv = asm["_ZNK4llvm4Loop11dumpVerboseEv"]; asm["_ZNK4llvm4Loop11dumpVerboseEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm4Loop11dumpVerboseEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_BasicTargetTransformInfo_cpp = asm["_GLOBAL__sub_I_BasicTargetTransformInfo.cpp"]; asm["_GLOBAL__sub_I_BasicTargetTransformInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BasicTargetTransformInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_TypeBasedAliasAnalysis_cpp = asm["_GLOBAL__sub_I_TypeBasedAliasAnalysis.cpp"]; asm["_GLOBAL__sub_I_TypeBasedAliasAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TypeBasedAliasAnalysis_cpp.apply(null, arguments);
};

var real___ZNK4llvm5APInt4dumpEv = asm["_ZNK4llvm5APInt4dumpEv"]; asm["_ZNK4llvm5APInt4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5APInt4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_ForceFunctionAttrs_cpp = asm["_GLOBAL__sub_I_ForceFunctionAttrs.cpp"]; asm["_GLOBAL__sub_I_ForceFunctionAttrs.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ForceFunctionAttrs_cpp.apply(null, arguments);
};

var real_dynCall_iiiiiiii = asm["dynCall_iiiiiiii"]; asm["dynCall_iiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiiiii.apply(null, arguments);
};

var real___ZNK4llvm17MachineBasicBlock4dumpEv = asm["_ZNK4llvm17MachineBasicBlock4dumpEv"]; asm["_ZNK4llvm17MachineBasicBlock4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm17MachineBasicBlock4dumpEv.apply(null, arguments);
};

var real___ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamERNS_13SourceManagerE = asm["_ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamERNS_13SourceManagerE"]; asm["_ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamERNS_13SourceManagerE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamERNS_13SourceManagerE.apply(null, arguments);
};

var real__compile = asm["compile"]; asm["compile"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__compile.apply(null, arguments);
};

var real___GLOBAL__sub_I_MemorySSA_cpp = asm["_GLOBAL__sub_I_MemorySSA.cpp"]; asm["_GLOBAL__sub_I_MemorySSA.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MemorySSA_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_FunctionImport_cpp = asm["_GLOBAL__sub_I_FunctionImport.cpp"]; asm["_GLOBAL__sub_I_FunctionImport.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_FunctionImport_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopVectorize_cpp = asm["_GLOBAL__sub_I_LoopVectorize.cpp"]; asm["_GLOBAL__sub_I_LoopVectorize.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopVectorize_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_ProfileSummaryInfo_cpp = asm["_GLOBAL__sub_I_ProfileSummaryInfo.cpp"]; asm["_GLOBAL__sub_I_ProfileSummaryInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ProfileSummaryInfo_cpp.apply(null, arguments);
};

var real___ZNK4llvm8DIEEntry5printERNS_11raw_ostreamE = asm["_ZNK4llvm8DIEEntry5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm8DIEEntry5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8DIEEntry5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_StackColoring_cpp = asm["_GLOBAL__sub_I_StackColoring.cpp"]; asm["_GLOBAL__sub_I_StackColoring.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_StackColoring_cpp.apply(null, arguments);
};

var real__malloc = asm["malloc"]; asm["malloc"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__malloc.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegisterClassInfo_cpp = asm["_GLOBAL__sub_I_RegisterClassInfo.cpp"]; asm["_GLOBAL__sub_I_RegisterClassInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegisterClassInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_DAGCombiner_cpp = asm["_GLOBAL__sub_I_DAGCombiner.cpp"]; asm["_GLOBAL__sub_I_DAGCombiner.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DAGCombiner_cpp.apply(null, arguments);
};

var real___ZNK4llvm7APFloat4dumpEv = asm["_ZNK4llvm7APFloat4dumpEv"]; asm["_ZNK4llvm7APFloat4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm7APFloat4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_DiagnosticHandler_cpp = asm["_GLOBAL__sub_I_DiagnosticHandler.cpp"]; asm["_GLOBAL__sub_I_DiagnosticHandler.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DiagnosticHandler_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LiveIntervals_cpp = asm["_GLOBAL__sub_I_LiveIntervals.cpp"]; asm["_GLOBAL__sub_I_LiveIntervals.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LiveIntervals_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_TargetTransformInfo_cpp = asm["_GLOBAL__sub_I_TargetTransformInfo.cpp"]; asm["_GLOBAL__sub_I_TargetTransformInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TargetTransformInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_DFAPacketizer_cpp = asm["_GLOBAL__sub_I_DFAPacketizer.cpp"]; asm["_GLOBAL__sub_I_DFAPacketizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DFAPacketizer_cpp.apply(null, arguments);
};

var real___ZNK5clang8comments7Comment4dumpERKNS_10ASTContextE = asm["_ZNK5clang8comments7Comment4dumpERKNS_10ASTContextE"]; asm["_ZNK5clang8comments7Comment4dumpERKNS_10ASTContextE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang8comments7Comment4dumpERKNS_10ASTContextE.apply(null, arguments);
};

var real___GLOBAL__sub_I_GCOVProfiling_cpp = asm["_GLOBAL__sub_I_GCOVProfiling.cpp"]; asm["_GLOBAL__sub_I_GCOVProfiling.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_GCOVProfiling_cpp.apply(null, arguments);
};

var real___ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKNS_11ScheduleDAGE = asm["_ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKNS_11ScheduleDAGE"]; asm["_ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKNS_11ScheduleDAGE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKNS_11ScheduleDAGE.apply(null, arguments);
};

var real_dynCall_iiiiiiiiiii = asm["dynCall_iiiiiiiiiii"]; asm["dynCall_iiiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiiiiiiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_TargetLibraryInfo_cpp = asm["_GLOBAL__sub_I_TargetLibraryInfo.cpp"]; asm["_GLOBAL__sub_I_TargetLibraryInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TargetLibraryInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LegalizeTypes_cpp = asm["_GLOBAL__sub_I_LegalizeTypes.cpp"]; asm["_GLOBAL__sub_I_LegalizeTypes.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LegalizeTypes_cpp.apply(null, arguments);
};

var real___ZNK4llvm13ConstantRange4dumpEv = asm["_ZNK4llvm13ConstantRange4dumpEv"]; asm["_ZNK4llvm13ConstantRange4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13ConstantRange4dumpEv.apply(null, arguments);
};

var real_____cxa_can_catch = asm["___cxa_can_catch"]; asm["___cxa_can_catch"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_____cxa_can_catch.apply(null, arguments);
};

var real___ZNK5clang7CodeGen10ABIArgInfo4dumpEv = asm["_ZNK5clang7CodeGen10ABIArgInfo4dumpEv"]; asm["_ZNK5clang7CodeGen10ABIArgInfo4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang7CodeGen10ABIArgInfo4dumpEv.apply(null, arguments);
};

var real____lttf2 = asm["__lttf2"]; asm["__lttf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____lttf2.apply(null, arguments);
};

var real___GLOBAL__sub_I_BasicAliasAnalysis_cpp = asm["_GLOBAL__sub_I_BasicAliasAnalysis.cpp"]; asm["_GLOBAL__sub_I_BasicAliasAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BasicAliasAnalysis_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj_cpp = asm["_GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj.cpp"]; asm["_GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj_cpp.apply(null, arguments);
};

var real___ZNK4llvm6SDNode5dumprEv = asm["_ZNK4llvm6SDNode5dumprEv"]; asm["_ZNK4llvm6SDNode5dumprEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6SDNode5dumprEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_GVN_cpp = asm["_GLOBAL__sub_I_GVN.cpp"]; asm["_GLOBAL__sub_I_GVN.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_GVN_cpp.apply(null, arguments);
};

var real___ZNK4llvm17SubtargetFeatures4dumpEv = asm["_ZNK4llvm17SubtargetFeatures4dumpEv"]; asm["_ZNK4llvm17SubtargetFeatures4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm17SubtargetFeatures4dumpEv.apply(null, arguments);
};

var real__fflush = asm["fflush"]; asm["fflush"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__fflush.apply(null, arguments);
};

var real___GLOBAL__sub_I_BoundsChecking_cpp = asm["_GLOBAL__sub_I_BoundsChecking.cpp"]; asm["_GLOBAL__sub_I_BoundsChecking.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BoundsChecking_cpp.apply(null, arguments);
};

var real___ZNK4llvm12LexicalScope4dumpEj = asm["_ZNK4llvm12LexicalScope4dumpEj"]; asm["_ZNK4llvm12LexicalScope4dumpEj"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12LexicalScope4dumpEj.apply(null, arguments);
};

var real___ZNK4llvm10DIELocList5printERNS_11raw_ostreamE = asm["_ZNK4llvm10DIELocList5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm10DIELocList5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10DIELocList5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_InlineFunction_cpp = asm["_GLOBAL__sub_I_InlineFunction.cpp"]; asm["_GLOBAL__sub_I_InlineFunction.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InlineFunction_cpp.apply(null, arguments);
};

var real___ZNK4llvm11MCAssembler4dumpEv = asm["_ZNK4llvm11MCAssembler4dumpEv"]; asm["_ZNK4llvm11MCAssembler4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm11MCAssembler4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm13LiveIntervals10dumpInstrsEv = asm["_ZNK4llvm13LiveIntervals10dumpInstrsEv"]; asm["_ZNK4llvm13LiveIntervals10dumpInstrsEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13LiveIntervals10dumpInstrsEv.apply(null, arguments);
};

var real____letf2 = asm["__letf2"]; asm["__letf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____letf2.apply(null, arguments);
};

var real____multi3 = asm["__multi3"]; asm["__multi3"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____multi3.apply(null, arguments);
};

var real___ZNK4llvm4SCEV4dumpEv = asm["_ZNK4llvm4SCEV4dumpEv"]; asm["_ZNK4llvm4SCEV4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm4SCEV4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm3DIE5printERNS_11raw_ostreamEj = asm["_ZNK4llvm3DIE5printERNS_11raw_ostreamEj"]; asm["_ZNK4llvm3DIE5printERNS_11raw_ostreamEj"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm3DIE5printERNS_11raw_ostreamEj.apply(null, arguments);
};

var real___GLOBAL__sub_I_PGOMemOPSizeOpt_cpp = asm["_GLOBAL__sub_I_PGOMemOPSizeOpt.cpp"]; asm["_GLOBAL__sub_I_PGOMemOPSizeOpt.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_PGOMemOPSizeOpt_cpp.apply(null, arguments);
};

var real____fixtfsi = asm["__fixtfsi"]; asm["__fixtfsi"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____fixtfsi.apply(null, arguments);
};

var real___ZNK5clang8comments7Comment4dumpEv = asm["_ZNK5clang8comments7Comment4dumpEv"]; asm["_ZNK5clang8comments7Comment4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang8comments7Comment4dumpEv.apply(null, arguments);
};

var real____getf2 = asm["__getf2"]; asm["__getf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____getf2.apply(null, arguments);
};

var real_dynCall_iiii = asm["dynCall_iiii"]; asm["dynCall_iiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiii.apply(null, arguments);
};

var real___ZNK5clang14MacroDirective4dumpEv = asm["_ZNK5clang14MacroDirective4dumpEv"]; asm["_ZNK5clang14MacroDirective4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang14MacroDirective4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopUnrollPeel_cpp = asm["_GLOBAL__sub_I_LoopUnrollPeel.cpp"]; asm["_GLOBAL__sub_I_LoopUnrollPeel.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopUnrollPeel_cpp.apply(null, arguments);
};

var real___ZNK5clang4Stmt4dumpERNS_13SourceManagerE = asm["_ZNK5clang4Stmt4dumpERNS_13SourceManagerE"]; asm["_ZNK5clang4Stmt4dumpERNS_13SourceManagerE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Stmt4dumpERNS_13SourceManagerE.apply(null, arguments);
};

var real___ZNK4llvm10sampleprof12SampleRecord4dumpEv = asm["_ZNK4llvm10sampleprof12SampleRecord4dumpEv"]; asm["_ZNK4llvm10sampleprof12SampleRecord4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10sampleprof12SampleRecord4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_AliasSetTracker_cpp = asm["_GLOBAL__sub_I_AliasSetTracker.cpp"]; asm["_GLOBAL__sub_I_AliasSetTracker.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AliasSetTracker_cpp.apply(null, arguments);
};

var real___ZNK4llvm26ScoreboardHazardRecognizer10Scoreboard4dumpEv = asm["_ZNK4llvm26ScoreboardHazardRecognizer10Scoreboard4dumpEv"]; asm["_ZNK4llvm26ScoreboardHazardRecognizer10Scoreboard4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm26ScoreboardHazardRecognizer10Scoreboard4dumpEv.apply(null, arguments);
};

var real_dynCall_viiiii = asm["dynCall_viiiii"]; asm["dynCall_viiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiii.apply(null, arguments);
};

var real__memmove = asm["memmove"]; asm["memmove"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__memmove.apply(null, arguments);
};

var real___GLOBAL__sub_I_NewGVN_cpp = asm["_GLOBAL__sub_I_NewGVN.cpp"]; asm["_GLOBAL__sub_I_NewGVN.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_NewGVN_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineOperand_cpp = asm["_GLOBAL__sub_I_MachineOperand.cpp"]; asm["_GLOBAL__sub_I_MachineOperand.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineOperand_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_StackMaps_cpp = asm["_GLOBAL__sub_I_StackMaps.cpp"]; asm["_GLOBAL__sub_I_StackMaps.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_StackMaps_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegionInfo_cpp = asm["_GLOBAL__sub_I_RegionInfo.cpp"]; asm["_GLOBAL__sub_I_RegionInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegionInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_IndVarSimplify_cpp = asm["_GLOBAL__sub_I_IndVarSimplify.cpp"]; asm["_GLOBAL__sub_I_IndVarSimplify.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_IndVarSimplify_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineBlockFrequencyInfo_cpp = asm["_GLOBAL__sub_I_MachineBlockFrequencyInfo.cpp"]; asm["_GLOBAL__sub_I_MachineBlockFrequencyInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineBlockFrequencyInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_CodeViewDebug_cpp = asm["_GLOBAL__sub_I_CodeViewDebug.cpp"]; asm["_GLOBAL__sub_I_CodeViewDebug.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_CodeViewDebug_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopSink_cpp = asm["_GLOBAL__sub_I_LoopSink.cpp"]; asm["_GLOBAL__sub_I_LoopSink.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopSink_cpp.apply(null, arguments);
};

var real___ZNK4llvm3opt6Option4dumpEv = asm["_ZNK4llvm3opt6Option4dumpEv"]; asm["_ZNK4llvm3opt6Option4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm3opt6Option4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_SafeStackLayout_cpp = asm["_GLOBAL__sub_I_SafeStackLayout.cpp"]; asm["_GLOBAL__sub_I_SafeStackLayout.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SafeStackLayout_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_AggressiveAntiDepBreaker_cpp = asm["_GLOBAL__sub_I_AggressiveAntiDepBreaker.cpp"]; asm["_GLOBAL__sub_I_AggressiveAntiDepBreaker.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AggressiveAntiDepBreaker_cpp.apply(null, arguments);
};

var real___ZNK4llvm10MCFragment4dumpEv = asm["_ZNK4llvm10MCFragment4dumpEv"]; asm["_ZNK4llvm10MCFragment4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm10MCFragment4dumpEv.apply(null, arguments);
};

var real_dynCall_iiiiiiiiii = asm["dynCall_iiiiiiiiii"]; asm["dynCall_iiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiiiiiii.apply(null, arguments);
};

var real___ZNK5clang8QualType4dumpEv = asm["_ZNK5clang8QualType4dumpEv"]; asm["_ZNK5clang8QualType4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang8QualType4dumpEv.apply(null, arguments);
};

var real____gttf2 = asm["__gttf2"]; asm["__gttf2"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____gttf2.apply(null, arguments);
};

var real___GLOBAL__sub_I_ScalarEvolution_cpp = asm["_GLOBAL__sub_I_ScalarEvolution.cpp"]; asm["_GLOBAL__sub_I_ScalarEvolution.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ScalarEvolution_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopInfo_cpp = asm["_GLOBAL__sub_I_LoopInfo.cpp"]; asm["_GLOBAL__sub_I_LoopInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_SelectionDAGISel_cpp = asm["_GLOBAL__sub_I_SelectionDAGISel.cpp"]; asm["_GLOBAL__sub_I_SelectionDAGISel.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SelectionDAGISel_cpp.apply(null, arguments);
};

var real___ZNK5clang8comments7Comment9dumpColorEv = asm["_ZNK5clang8comments7Comment9dumpColorEv"]; asm["_ZNK5clang8comments7Comment9dumpColorEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang8comments7Comment9dumpColorEv.apply(null, arguments);
};

var real___ZNK4llvm13AttributeList4dumpEv = asm["_ZNK4llvm13AttributeList4dumpEv"]; asm["_ZNK4llvm13AttributeList4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13AttributeList4dumpEv.apply(null, arguments);
};

var real___compile = asm["_compile"]; asm["_compile"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___compile.apply(null, arguments);
};

var real___GLOBAL__sub_I_Dominators_cpp = asm["_GLOBAL__sub_I_Dominators.cpp"]; asm["_GLOBAL__sub_I_Dominators.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Dominators_cpp.apply(null, arguments);
};

var real___ZN4llvm9safestack13StackColoring11dumpAllocasEv = asm["_ZN4llvm9safestack13StackColoring11dumpAllocasEv"]; asm["_ZN4llvm9safestack13StackColoring11dumpAllocasEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN4llvm9safestack13StackColoring11dumpAllocasEv.apply(null, arguments);
};

var real___ZNK4llvm5Twine4dumpEv = asm["_ZNK4llvm5Twine4dumpEv"]; asm["_ZNK4llvm5Twine4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5Twine4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm8DIEValue5printERNS_11raw_ostreamE = asm["_ZNK4llvm8DIEValue5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm8DIEValue5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8DIEValue5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineSink_cpp = asm["_GLOBAL__sub_I_MachineSink.cpp"]; asm["_GLOBAL__sub_I_MachineSink.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineSink_cpp.apply(null, arguments);
};

var real___ZNK4llvm13CallGraphNode4dumpEv = asm["_ZNK4llvm13CallGraphNode4dumpEv"]; asm["_ZNK4llvm13CallGraphNode4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13CallGraphNode4dumpEv.apply(null, arguments);
};

var real_dynCall_iiiiiiiii = asm["dynCall_iiiiiiiii"]; asm["dynCall_iiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_iiiiiiiii.apply(null, arguments);
};

var real_dynCall_viiii = asm["dynCall_viiii"]; asm["dynCall_viiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiii.apply(null, arguments);
};

var real___GLOBAL__sub_I_SLPVectorizer_cpp = asm["_GLOBAL__sub_I_SLPVectorizer.cpp"]; asm["_GLOBAL__sub_I_SLPVectorizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SLPVectorizer_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_ConstantHoisting_cpp = asm["_GLOBAL__sub_I_ConstantHoisting.cpp"]; asm["_GLOBAL__sub_I_ConstantHoisting.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ConstantHoisting_cpp.apply(null, arguments);
};

var real___ZNK4llvm9MemorySSA4dumpEv = asm["_ZNK4llvm9MemorySSA4dumpEv"]; asm["_ZNK4llvm9MemorySSA4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9MemorySSA4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopUnroll_cpp = asm["_GLOBAL__sub_I_LoopUnroll.cpp"]; asm["_GLOBAL__sub_I_LoopUnroll.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopUnroll_cpp.apply(null, arguments);
};

var real___ZNK4llvm6SDNode5dumprEPKNS_12SelectionDAGE = asm["_ZNK4llvm6SDNode5dumprEPKNS_12SelectionDAGE"]; asm["_ZNK4llvm6SDNode5dumprEPKNS_12SelectionDAGE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6SDNode5dumprEPKNS_12SelectionDAGE.apply(null, arguments);
};

var real___ZNK4llvm8AliasSet4dumpEv = asm["_ZNK4llvm8AliasSet4dumpEv"]; asm["_ZNK4llvm8AliasSet4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8AliasSet4dumpEv.apply(null, arguments);
};

var real___ZNK5clang6driver8Multilib4dumpEv = asm["_ZNK5clang6driver8Multilib4dumpEv"]; asm["_ZNK5clang6driver8Multilib4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang6driver8Multilib4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LegacyPassManager_cpp = asm["_GLOBAL__sub_I_LegacyPassManager.cpp"]; asm["_GLOBAL__sub_I_LegacyPassManager.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LegacyPassManager_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_TargetLoweringBase_cpp = asm["_GLOBAL__sub_I_TargetLoweringBase.cpp"]; asm["_GLOBAL__sub_I_TargetLoweringBase.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TargetLoweringBase_cpp.apply(null, arguments);
};

var real___ZNK4llvm12DebugCounter4dumpEv = asm["_ZNK4llvm12DebugCounter4dumpEv"]; asm["_ZNK4llvm12DebugCounter4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm12DebugCounter4dumpEv.apply(null, arguments);
};

var real___ZNK5clang4Type4dumpERN4llvm11raw_ostreamE = asm["_ZNK5clang4Type4dumpERN4llvm11raw_ostreamE"]; asm["_ZNK5clang4Type4dumpERN4llvm11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Type4dumpERN4llvm11raw_ostreamE.apply(null, arguments);
};

var real___ZNK4llvm13SchedBoundary18dumpScheduledStateEv = asm["_ZNK4llvm13SchedBoundary18dumpScheduledStateEv"]; asm["_ZNK4llvm13SchedBoundary18dumpScheduledStateEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13SchedBoundary18dumpScheduledStateEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_SpeculativeExecution_cpp = asm["_GLOBAL__sub_I_SpeculativeExecution.cpp"]; asm["_GLOBAL__sub_I_SpeculativeExecution.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SpeculativeExecution_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LowerExpectIntrinsic_cpp = asm["_GLOBAL__sub_I_LowerExpectIntrinsic.cpp"]; asm["_GLOBAL__sub_I_LowerExpectIntrinsic.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LowerExpectIntrinsic_cpp.apply(null, arguments);
};

var real___ZNK5clang8CFGBlock4dumpEv = asm["_ZNK5clang8CFGBlock4dumpEv"]; asm["_ZNK5clang8CFGBlock4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang8CFGBlock4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts_cpp = asm["_GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts.cpp"]; asm["_GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts_cpp.apply(null, arguments);
};

var real___ZNK4llvm8Metadata4dumpEPKNS_6ModuleE = asm["_ZNK4llvm8Metadata4dumpEPKNS_6ModuleE"]; asm["_ZNK4llvm8Metadata4dumpEPKNS_6ModuleE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8Metadata4dumpEPKNS_6ModuleE.apply(null, arguments);
};

var real___ZNK5clang4Decl9dumpColorEv = asm["_ZNK5clang4Decl9dumpColorEv"]; asm["_ZNK5clang4Decl9dumpColorEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang4Decl9dumpColorEv.apply(null, arguments);
};

var real___ZNK4llvm11SlotIndexes4dumpEv = asm["_ZNK4llvm11SlotIndexes4dumpEv"]; asm["_ZNK4llvm11SlotIndexes4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm11SlotIndexes4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_TargetInstrInfo_cpp = asm["_GLOBAL__sub_I_TargetInstrInfo.cpp"]; asm["_GLOBAL__sub_I_TargetInstrInfo.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TargetInstrInfo_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopVersioningLICM_cpp = asm["_GLOBAL__sub_I_LoopVersioningLICM.cpp"]; asm["_GLOBAL__sub_I_LoopVersioningLICM.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopVersioningLICM_cpp.apply(null, arguments);
};

var real_dynCall_viiiiiii = asm["dynCall_viiiiiii"]; asm["dynCall_viiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiii.apply(null, arguments);
};

var real___ZNK4llvm9LiveRange7Segment4dumpEv = asm["_ZNK4llvm9LiveRange7Segment4dumpEv"]; asm["_ZNK4llvm9LiveRange7Segment4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9LiveRange7Segment4dumpEv.apply(null, arguments);
};

var real____ashlti3 = asm["__ashlti3"]; asm["__ashlti3"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____ashlti3.apply(null, arguments);
};

var real___GLOBAL__sub_I_ResourcePriorityQueue_cpp = asm["_GLOBAL__sub_I_ResourcePriorityQueue.cpp"]; asm["_GLOBAL__sub_I_ResourcePriorityQueue.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ResourcePriorityQueue_cpp.apply(null, arguments);
};

var real___ZNK4llvm5SUnit7dumpAllEPKNS_11ScheduleDAGE = asm["_ZNK4llvm5SUnit7dumpAllEPKNS_11ScheduleDAGE"]; asm["_ZNK4llvm5SUnit7dumpAllEPKNS_11ScheduleDAGE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm5SUnit7dumpAllEPKNS_11ScheduleDAGE.apply(null, arguments);
};

var real___GLOBAL__sub_I_InstCombineCalls_cpp = asm["_GLOBAL__sub_I_InstCombineCalls.cpp"]; asm["_GLOBAL__sub_I_InstCombineCalls.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InstCombineCalls_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_EdgeBundles_cpp = asm["_GLOBAL__sub_I_EdgeBundles.cpp"]; asm["_GLOBAL__sub_I_EdgeBundles.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_EdgeBundles_cpp.apply(null, arguments);
};

var real___ZNK4llvm13LiveVariables7VarInfo4dumpEv = asm["_ZNK4llvm13LiveVariables7VarInfo4dumpEv"]; asm["_ZNK4llvm13LiveVariables7VarInfo4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13LiveVariables7VarInfo4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_Loads_cpp = asm["_GLOBAL__sub_I_Loads.cpp"]; asm["_GLOBAL__sub_I_Loads.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Loads_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopVersioning_cpp = asm["_GLOBAL__sub_I_LoopVersioning.cpp"]; asm["_GLOBAL__sub_I_LoopVersioning.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopVersioning_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_WebAssemblyExplicitLocals_cpp = asm["_GLOBAL__sub_I_WebAssemblyExplicitLocals.cpp"]; asm["_GLOBAL__sub_I_WebAssemblyExplicitLocals.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_WebAssemblyExplicitLocals_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachineBlockPlacement_cpp = asm["_GLOBAL__sub_I_MachineBlockPlacement.cpp"]; asm["_GLOBAL__sub_I_MachineBlockPlacement.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachineBlockPlacement_cpp.apply(null, arguments);
};

var real___ZNK4llvm19MachineConstantPool4dumpEv = asm["_ZNK4llvm19MachineConstantPool4dumpEv"]; asm["_ZNK4llvm19MachineConstantPool4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm19MachineConstantPool4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_InlineCost_cpp = asm["_GLOBAL__sub_I_InlineCost.cpp"]; asm["_GLOBAL__sub_I_InlineCost.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InlineCost_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_DeadStoreElimination_cpp = asm["_GLOBAL__sub_I_DeadStoreElimination.cpp"]; asm["_GLOBAL__sub_I_DeadStoreElimination.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DeadStoreElimination_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_Float2Int_cpp = asm["_GLOBAL__sub_I_Float2Int.cpp"]; asm["_GLOBAL__sub_I_Float2Int.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Float2Int_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_IfConversion_cpp = asm["_GLOBAL__sub_I_IfConversion.cpp"]; asm["_GLOBAL__sub_I_IfConversion.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_IfConversion_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegAllocFast_cpp = asm["_GLOBAL__sub_I_RegAllocFast.cpp"]; asm["_GLOBAL__sub_I_RegAllocFast.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegAllocFast_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_Internalize_cpp = asm["_GLOBAL__sub_I_Internalize.cpp"]; asm["_GLOBAL__sub_I_Internalize.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_Internalize_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_BitcodeWriter_cpp = asm["_GLOBAL__sub_I_BitcodeWriter.cpp"]; asm["_GLOBAL__sub_I_BitcodeWriter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_BitcodeWriter_cpp.apply(null, arguments);
};

var real___ZNK5clang6Module4dumpEv = asm["_ZNK5clang6Module4dumpEv"]; asm["_ZNK5clang6Module4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang6Module4dumpEv.apply(null, arguments);
};

var real_dynCall_viiiiiiiiii = asm["dynCall_viiiiiiiiii"]; asm["dynCall_viiiiiiiiii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viiiiiiiiii.apply(null, arguments);
};

var real___ZN5clang9ModuleMap4dumpEv = asm["_ZN5clang9ModuleMap4dumpEv"]; asm["_ZN5clang9ModuleMap4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN5clang9ModuleMap4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm9MCOperand4dumpEv = asm["_ZNK4llvm9MCOperand4dumpEv"]; asm["_ZNK4llvm9MCOperand4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9MCOperand4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopDataPrefetch_cpp = asm["_GLOBAL__sub_I_LoopDataPrefetch.cpp"]; asm["_GLOBAL__sub_I_LoopDataPrefetch.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopDataPrefetch_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_LoopUnrollRuntime_cpp = asm["_GLOBAL__sub_I_LoopUnrollRuntime.cpp"]; asm["_GLOBAL__sub_I_LoopUnrollRuntime.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_LoopUnrollRuntime_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_MachinePipeliner_cpp = asm["_GLOBAL__sub_I_MachinePipeliner.cpp"]; asm["_GLOBAL__sub_I_MachinePipeliner.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_MachinePipeliner_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_AliasAnalysis_cpp = asm["_GLOBAL__sub_I_AliasAnalysis.cpp"]; asm["_GLOBAL__sub_I_AliasAnalysis.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_AliasAnalysis_cpp.apply(null, arguments);
};

var real___GLOBAL__sub_I_RegAllocBase_cpp = asm["_GLOBAL__sub_I_RegAllocBase.cpp"]; asm["_GLOBAL__sub_I_RegAllocBase.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_RegAllocBase_cpp.apply(null, arguments);
};

var real___ZNK4llvm9DIEAbbrev4dumpEv = asm["_ZNK4llvm9DIEAbbrev4dumpEv"]; asm["_ZNK4llvm9DIEAbbrev4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm9DIEAbbrev4dumpEv.apply(null, arguments);
};

var real___ZNK4llvm6SDNode4dumpEPKNS_12SelectionDAGE = asm["_ZNK4llvm6SDNode4dumpEPKNS_12SelectionDAGE"]; asm["_ZNK4llvm6SDNode4dumpEPKNS_12SelectionDAGE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6SDNode4dumpEPKNS_12SelectionDAGE.apply(null, arguments);
};

var real___ZN4llvm18dumpRegSetPressureENS_8ArrayRefIjEEPKNS_18TargetRegisterInfoE = asm["_ZN4llvm18dumpRegSetPressureENS_8ArrayRefIjEEPKNS_18TargetRegisterInfoE"]; asm["_ZN4llvm18dumpRegSetPressureENS_8ArrayRefIjEEPKNS_18TargetRegisterInfoE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN4llvm18dumpRegSetPressureENS_8ArrayRefIjEEPKNS_18TargetRegisterInfoE.apply(null, arguments);
};

var real___ZNK4llvm13GVNExpression10Expression4dumpEv = asm["_ZNK4llvm13GVNExpression10Expression4dumpEv"]; asm["_ZNK4llvm13GVNExpression10Expression4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm13GVNExpression10Expression4dumpEv.apply(null, arguments);
};

var real__fmodl = asm["fmodl"]; asm["fmodl"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real__fmodl.apply(null, arguments);
};

var real___GLOBAL__sub_I_SymbolRewriter_cpp = asm["_GLOBAL__sub_I_SymbolRewriter.cpp"]; asm["_GLOBAL__sub_I_SymbolRewriter.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_SymbolRewriter_cpp.apply(null, arguments);
};

var real___ZNK4llvm6DIELoc5printERNS_11raw_ostreamE = asm["_ZNK4llvm6DIELoc5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm6DIELoc5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm6DIELoc5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real___GLOBAL__sub_I_ARMAttributeParser_cpp = asm["_GLOBAL__sub_I_ARMAttributeParser.cpp"]; asm["_GLOBAL__sub_I_ARMAttributeParser.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ARMAttributeParser_cpp.apply(null, arguments);
};

var real___ZNK4llvm14MachineOperand4dumpEv = asm["_ZNK4llvm14MachineOperand4dumpEv"]; asm["_ZNK4llvm14MachineOperand4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm14MachineOperand4dumpEv.apply(null, arguments);
};

var real____lshrti3 = asm["__lshrti3"]; asm["__lshrti3"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real____lshrti3.apply(null, arguments);
};

var real___GLOBAL__sub_I_TypeDumpVisitor_cpp = asm["_GLOBAL__sub_I_TypeDumpVisitor.cpp"]; asm["_GLOBAL__sub_I_TypeDumpVisitor.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_TypeDumpVisitor_cpp.apply(null, arguments);
};

var real___ZNK4llvm8DIELabel5printERNS_11raw_ostreamE = asm["_ZNK4llvm8DIELabel5printERNS_11raw_ostreamE"]; asm["_ZNK4llvm8DIELabel5printERNS_11raw_ostreamE"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK4llvm8DIELabel5printERNS_11raw_ostreamE.apply(null, arguments);
};

var real_dynCall_viii = asm["dynCall_viii"]; asm["dynCall_viii"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real_dynCall_viii.apply(null, arguments);
};

var real___GLOBAL__sub_I_InstrProfiling_cpp = asm["_GLOBAL__sub_I_InstrProfiling.cpp"]; asm["_GLOBAL__sub_I_InstrProfiling.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_InstrProfiling_cpp.apply(null, arguments);
};

var real___ZNK5clang7CodeGen14CGBitFieldInfo4dumpEv = asm["_ZNK5clang7CodeGen14CGBitFieldInfo4dumpEv"]; asm["_ZNK5clang7CodeGen14CGBitFieldInfo4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZNK5clang7CodeGen14CGBitFieldInfo4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_ShrinkWrap_cpp = asm["_GLOBAL__sub_I_ShrinkWrap.cpp"]; asm["_GLOBAL__sub_I_ShrinkWrap.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_ShrinkWrap_cpp.apply(null, arguments);
};

var real___ZN5clang20LayoutOverrideSource4dumpEv = asm["_ZN5clang20LayoutOverrideSource4dumpEv"]; asm["_ZN5clang20LayoutOverrideSource4dumpEv"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___ZN5clang20LayoutOverrideSource4dumpEv.apply(null, arguments);
};

var real___GLOBAL__sub_I_DataFlowSanitizer_cpp = asm["_GLOBAL__sub_I_DataFlowSanitizer.cpp"]; asm["_GLOBAL__sub_I_DataFlowSanitizer.cpp"] = function() {
assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
return real___GLOBAL__sub_I_DataFlowSanitizer_cpp.apply(null, arguments);
};
Module["asm"] = asm;
var __ZNK5clang16TemplateArgument4dumpEv = Module["__ZNK5clang16TemplateArgument4dumpEv"] = function() { return Module["asm"]["_ZNK5clang16TemplateArgument4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_AssumptionCache_cpp = Module["__GLOBAL__sub_I_AssumptionCache_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AssumptionCache.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_EarlyIfConversion_cpp = Module["__GLOBAL__sub_I_EarlyIfConversion_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_EarlyIfConversion.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MemoryBuiltins_cpp = Module["__GLOBAL__sub_I_MemoryBuiltins_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MemoryBuiltins.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_PostRASchedulerList_cpp = Module["__GLOBAL__sub_I_PostRASchedulerList_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PostRASchedulerList.cpp"].apply(null, arguments) };
var __ZNK4llvm6SDNode9dumprFullEPKNS_12SelectionDAGE = Module["__ZNK4llvm6SDNode9dumprFullEPKNS_12SelectionDAGE"] = function() { return Module["asm"]["_ZNK4llvm6SDNode9dumprFullEPKNS_12SelectionDAGE"].apply(null, arguments) };
var __GLOBAL__sub_I_PeepholeOptimizer_cpp = Module["__GLOBAL__sub_I_PeepholeOptimizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PeepholeOptimizer.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_WebAssemblyTargetMachine_cpp = Module["__GLOBAL__sub_I_WebAssemblyTargetMachine_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_WebAssemblyTargetMachine.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_CodeExtractor_cpp = Module["__GLOBAL__sub_I_CodeExtractor_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CodeExtractor.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_TwoAddressInstructionPass_cpp = Module["__GLOBAL__sub_I_TwoAddressInstructionPass_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TwoAddressInstructionPass.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_FunctionAttrs_cpp = Module["__GLOBAL__sub_I_FunctionAttrs_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_FunctionAttrs.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_IndirectCallPromotion_cpp = Module["__GLOBAL__sub_I_IndirectCallPromotion_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_IndirectCallPromotion.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopAnalysisManager_cpp = Module["__GLOBAL__sub_I_LoopAnalysisManager_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopAnalysisManager.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_PGOInstrumentation_cpp = Module["__GLOBAL__sub_I_PGOInstrumentation_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PGOInstrumentation.cpp"].apply(null, arguments) };
var _emscripten_get_global_libc = Module["_emscripten_get_global_libc"] = function() { return Module["asm"]["emscripten_get_global_libc"].apply(null, arguments) };
var __ZNK4llvm12PressureDiff4dumpERKNS_18TargetRegisterInfoE = Module["__ZNK4llvm12PressureDiff4dumpERKNS_18TargetRegisterInfoE"] = function() { return Module["asm"]["_ZNK4llvm12PressureDiff4dumpERKNS_18TargetRegisterInfoE"].apply(null, arguments) };
var _stackSave = Module["_stackSave"] = function() { return Module["asm"]["stackSave"].apply(null, arguments) };
var __GLOBAL__sub_I_ScopedNoAliasAA_cpp = Module["__GLOBAL__sub_I_ScopedNoAliasAA_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ScopedNoAliasAA.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_CodeGenModule_cpp = Module["__GLOBAL__sub_I_CodeGenModule_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CodeGenModule.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopUnswitch_cpp = Module["__GLOBAL__sub_I_LoopUnswitch_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopUnswitch.cpp"].apply(null, arguments) };
var __ZNK4llvm16MachineFrameInfo4dumpERKNS_15MachineFunctionE = Module["__ZNK4llvm16MachineFrameInfo4dumpERKNS_15MachineFunctionE"] = function() { return Module["asm"]["_ZNK4llvm16MachineFrameInfo4dumpERKNS_15MachineFunctionE"].apply(null, arguments) };
var __ZNK5clang5Scope4dumpEv = Module["__ZNK5clang5Scope4dumpEv"] = function() { return Module["asm"]["_ZNK5clang5Scope4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_StackMapLivenessAnalysis_cpp = Module["__GLOBAL__sub_I_StackMapLivenessAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_StackMapLivenessAnalysis.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LCSSA_cpp = Module["__GLOBAL__sub_I_LCSSA_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LCSSA.cpp"].apply(null, arguments) };
var __main = Module["__main"] = function() { return Module["asm"]["_main"].apply(null, arguments) };
var _memset = Module["_memset"] = function() { return Module["asm"]["memset"].apply(null, arguments) };
var __GLOBAL__sub_I_ContinuationRecordBuilder_cpp = Module["__GLOBAL__sub_I_ContinuationRecordBuilder_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ContinuationRecordBuilder.cpp"].apply(null, arguments) };
var __ZNK5clang4Type4dumpEv = Module["__ZNK5clang4Type4dumpEv"] = function() { return Module["asm"]["_ZNK5clang4Type4dumpEv"].apply(null, arguments) };
var __ZN5clang12LookupResult4dumpEv = Module["__ZN5clang12LookupResult4dumpEv"] = function() { return Module["asm"]["_ZN5clang12LookupResult4dumpEv"].apply(null, arguments) };
var setThrew = Module["setThrew"] = function() { return Module["asm"]["setThrew"].apply(null, arguments) };
var __GLOBAL__sub_I_SimplifyCFG_cpp = Module["__GLOBAL__sub_I_SimplifyCFG_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SimplifyCFG.cpp"].apply(null, arguments) };
var __ZNK4llvm8ILPValue5printERNS_11raw_ostreamE = Module["__ZNK4llvm8ILPValue5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm8ILPValue5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __ZNK4llvm9CallGraph4dumpEv = Module["__ZNK4llvm9CallGraph4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9CallGraph4dumpEv"].apply(null, arguments) };
var __ZNK4llvm16ValueSymbolTable4dumpEv = Module["__ZNK4llvm16ValueSymbolTable4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm16ValueSymbolTable4dumpEv"].apply(null, arguments) };
var dynCall_viiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiiiiiiiii"].apply(null, arguments) };
var _stackAlloc = Module["_stackAlloc"] = function() { return Module["asm"]["stackAlloc"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopRotation_cpp = Module["__GLOBAL__sub_I_LoopRotation_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopRotation.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_ScheduleDAG_cpp = Module["__GLOBAL__sub_I_ScheduleDAG_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ScheduleDAG.cpp"].apply(null, arguments) };
var __ZNK4llvm12LivePhysRegs4dumpEv = Module["__ZNK4llvm12LivePhysRegs4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12LivePhysRegs4dumpEv"].apply(null, arguments) };
var __ZNK5clang8QualType4dumpERN4llvm11raw_ostreamE = Module["__ZNK5clang8QualType4dumpERN4llvm11raw_ostreamE"] = function() { return Module["asm"]["_ZNK5clang8QualType4dumpERN4llvm11raw_ostreamE"].apply(null, arguments) };
var __ZNK5clang7CodeGen14CGRecordLayout4dumpEv = Module["__ZNK5clang7CodeGen14CGRecordLayout4dumpEv"] = function() { return Module["asm"]["_ZNK5clang7CodeGen14CGRecordLayout4dumpEv"].apply(null, arguments) };
var _free = Module["_free"] = function() { return Module["asm"]["free"].apply(null, arguments) };
var __GLOBAL__sub_I_ThreadSanitizer_cpp = Module["__GLOBAL__sub_I_ThreadSanitizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ThreadSanitizer.cpp"].apply(null, arguments) };
var __ZNK4llvm12MachineInstr4dumpEv = Module["__ZNK4llvm12MachineInstr4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12MachineInstr4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_BlockFrequencyInfo_cpp = Module["__GLOBAL__sub_I_BlockFrequencyInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BlockFrequencyInfo.cpp"].apply(null, arguments) };
var __ZNK4llvm3DIE4dumpEv = Module["__ZNK4llvm3DIE4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm3DIE4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_CalledValuePropagation_cpp = Module["__GLOBAL__sub_I_CalledValuePropagation_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CalledValuePropagation.cpp"].apply(null, arguments) };
var dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiiiiiii"].apply(null, arguments) };
var __GLOBAL__sub_I_InstrProf_cpp = Module["__GLOBAL__sub_I_InstrProf_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InstrProf.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_SelectionDAGDumper_cpp = Module["__GLOBAL__sub_I_SelectionDAGDumper_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SelectionDAGDumper.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_PHIElimination_cpp = Module["__GLOBAL__sub_I_PHIElimination_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PHIElimination.cpp"].apply(null, arguments) };
var __ZNK4llvm20MachineJumpTableInfo4dumpEv = Module["__ZNK4llvm20MachineJumpTableInfo4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm20MachineJumpTableInfo4dumpEv"].apply(null, arguments) };
var _realloc = Module["_realloc"] = function() { return Module["asm"]["realloc"].apply(null, arguments) };
var __ZNK4llvm4sroa12AllocaSlices4dumpEv = Module["__ZNK4llvm4sroa12AllocaSlices4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm4sroa12AllocaSlices4dumpEv"].apply(null, arguments) };
var __ZNK4llvm8DIEValue4dumpEv = Module["__ZNK4llvm8DIEValue4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm8DIEValue4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_TargetSchedule_cpp = Module["__GLOBAL__sub_I_TargetSchedule_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TargetSchedule.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineFunction_cpp = Module["__GLOBAL__sub_I_MachineFunction_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineFunction.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MemorySanitizer_cpp = Module["__GLOBAL__sub_I_MemorySanitizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MemorySanitizer.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_GlobalsModRef_cpp = Module["__GLOBAL__sub_I_GlobalsModRef_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_GlobalsModRef.cpp"].apply(null, arguments) };
var ___floatunsitf = Module["___floatunsitf"] = function() { return Module["asm"]["__floatunsitf"].apply(null, arguments) };
var __GLOBAL__sub_I_IRSymtab_cpp = Module["__GLOBAL__sub_I_IRSymtab_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_IRSymtab.cpp"].apply(null, arguments) };
var dynCall_ffii = Module["dynCall_ffii"] = function() { return Module["asm"]["dynCall_ffii"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopInterchange_cpp = Module["__GLOBAL__sub_I_LoopInterchange_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopInterchange.cpp"].apply(null, arguments) };
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiiiii"].apply(null, arguments) };
var __GLOBAL__sub_I_GVNHoist_cpp = Module["__GLOBAL__sub_I_GVNHoist_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_GVNHoist.cpp"].apply(null, arguments) };
var dynCall_fiii = Module["dynCall_fiii"] = function() { return Module["asm"]["dynCall_fiii"].apply(null, arguments) };
var dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiiiiiiii"].apply(null, arguments) };
var __GLOBAL__sub_I_LowerGuardIntrinsic_cpp = Module["__GLOBAL__sub_I_LowerGuardIntrinsic_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LowerGuardIntrinsic.cpp"].apply(null, arguments) };
var __ZN4llvmlsERNS_11raw_ostreamERKNS_8ILPValueE = Module["__ZN4llvmlsERNS_11raw_ostreamERKNS_8ILPValueE"] = function() { return Module["asm"]["_ZN4llvmlsERNS_11raw_ostreamERKNS_8ILPValueE"].apply(null, arguments) };
var __ZNK4llvm12AttributeSet4dumpEv = Module["__ZNK4llvm12AttributeSet4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12AttributeSet4dumpEv"].apply(null, arguments) };
var __ZNK4llvm5Value4dumpEv = Module["__ZNK4llvm5Value4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm5Value4dumpEv"].apply(null, arguments) };
var __ZNK4llvm17BranchProbability4dumpEv = Module["__ZNK4llvm17BranchProbability4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm17BranchProbability4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_MCContext_cpp = Module["__GLOBAL__sub_I_MCContext_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MCContext.cpp"].apply(null, arguments) };
var dynCall_i = Module["dynCall_i"] = function() { return Module["asm"]["dynCall_i"].apply(null, arguments) };
var ___multf3 = Module["___multf3"] = function() { return Module["asm"]["__multf3"].apply(null, arguments) };
var __ZNK4llvm13LazyCallGraph4Node4dumpEv = Module["__ZNK4llvm13LazyCallGraph4Node4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13LazyCallGraph4Node4dumpEv"].apply(null, arguments) };
var ___errno_location = Module["___errno_location"] = function() { return Module["asm"]["__errno_location"].apply(null, arguments) };
var __malloc = Module["__malloc"] = function() { return Module["asm"]["_malloc"].apply(null, arguments) };
var dynCall_v = Module["dynCall_v"] = function() { return Module["asm"]["dynCall_v"].apply(null, arguments) };
var __ZNK5clang11DeclContext15dumpDeclContextEv = Module["__ZNK5clang11DeclContext15dumpDeclContextEv"] = function() { return Module["asm"]["_ZNK5clang11DeclContext15dumpDeclContextEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopAccessAnalysis_cpp = Module["__GLOBAL__sub_I_LoopAccessAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopAccessAnalysis.cpp"].apply(null, arguments) };
var __ZNK4llvm10sampleprof12LineLocation4dumpEv = Module["__ZNK4llvm10sampleprof12LineLocation4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm10sampleprof12LineLocation4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineDominators_cpp = Module["__GLOBAL__sub_I_MachineDominators_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineDominators.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_SimpleLoopUnswitch_cpp = Module["__GLOBAL__sub_I_SimpleLoopUnswitch_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SimpleLoopUnswitch.cpp"].apply(null, arguments) };
var ___divtf3 = Module["___divtf3"] = function() { return Module["asm"]["__divtf3"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineScheduler_cpp = Module["__GLOBAL__sub_I_MachineScheduler_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineScheduler.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_ADCE_cpp = Module["__GLOBAL__sub_I_ADCE_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ADCE.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_ObjCARCAnalysisUtils_cpp = Module["__GLOBAL__sub_I_ObjCARCAnalysisUtils_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ObjCARCAnalysisUtils.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_SafeStackColoring_cpp = Module["__GLOBAL__sub_I_SafeStackColoring_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SafeStackColoring.cpp"].apply(null, arguments) };
var __ZN4llvm9safestack13StackColoring17dumpBlockLivenessEv = Module["__ZN4llvm9safestack13StackColoring17dumpBlockLivenessEv"] = function() { return Module["asm"]["_ZN4llvm9safestack13StackColoring17dumpBlockLivenessEv"].apply(null, arguments) };
var __GLOBAL__sub_I_SimplifyCFGPass_cpp = Module["__GLOBAL__sub_I_SimplifyCFGPass_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SimplifyCFGPass.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LiveDebugVariables_cpp = Module["__GLOBAL__sub_I_LiveDebugVariables_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LiveDebugVariables.cpp"].apply(null, arguments) };
var __ZNK4llvm6SDNode4dumpEv = Module["__ZNK4llvm6SDNode4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm6SDNode4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_RegisterUsageInfo_cpp = Module["__GLOBAL__sub_I_RegisterUsageInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegisterUsageInfo.cpp"].apply(null, arguments) };
var _stackRestore = Module["_stackRestore"] = function() { return Module["asm"]["stackRestore"].apply(null, arguments) };
var __ZNK5clang14SourceLocation4dumpERKNS_13SourceManagerE = Module["__ZNK5clang14SourceLocation4dumpERKNS_13SourceManagerE"] = function() { return Module["asm"]["_ZNK5clang14SourceLocation4dumpERKNS_13SourceManagerE"].apply(null, arguments) };
var __ZNK5clang13SourceManager4dumpEv = Module["__ZNK5clang13SourceManager4dumpEv"] = function() { return Module["asm"]["_ZNK5clang13SourceManager4dumpEv"].apply(null, arguments) };
var __ZNK4llvm3opt3Arg4dumpEv = Module["__ZNK4llvm3opt3Arg4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm3opt3Arg4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_MIRCanonicalizerPass_cpp = Module["__GLOBAL__sub_I_MIRCanonicalizerPass_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MIRCanonicalizerPass.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_Statistic_cpp = Module["__GLOBAL__sub_I_Statistic_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Statistic.cpp"].apply(null, arguments) };
var ___trunctfsf2 = Module["___trunctfsf2"] = function() { return Module["asm"]["__trunctfsf2"].apply(null, arguments) };
var __ZNK5clang9MacroInfo4dumpEv = Module["__ZNK5clang9MacroInfo4dumpEv"] = function() { return Module["asm"]["_ZNK5clang9MacroInfo4dumpEv"].apply(null, arguments) };
var dynCall_ii = Module["dynCall_ii"] = function() { return Module["asm"]["dynCall_ii"].apply(null, arguments) };
var __ZNK4llvm10ReadyQueue4dumpEv = Module["__ZNK4llvm10ReadyQueue4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm10ReadyQueue4dumpEv"].apply(null, arguments) };
var __ZNK5clang17InitializedEntity4dumpEv = Module["__ZNK5clang17InitializedEntity4dumpEv"] = function() { return Module["asm"]["_ZNK5clang17InitializedEntity4dumpEv"].apply(null, arguments) };
var __ZNK4llvm6MCInst4dumpEv = Module["__ZNK4llvm6MCInst4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm6MCInst4dumpEv"].apply(null, arguments) };
var __ZNK4llvm19MachineRegisterInfo8dumpUsesEj = Module["__ZNK4llvm19MachineRegisterInfo8dumpUsesEj"] = function() { return Module["asm"]["_ZNK4llvm19MachineRegisterInfo8dumpUsesEj"].apply(null, arguments) };
var __ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamE = Module["__ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamE"] = function() { return Module["asm"]["_ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamE"].apply(null, arguments) };
var ___cxa_can_catch = Module["___cxa_can_catch"] = function() { return Module["asm"]["__cxa_can_catch"].apply(null, arguments) };
var __GLOBAL__sub_I_AddDiscriminators_cpp = Module["__GLOBAL__sub_I_AddDiscriminators_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AddDiscriminators.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_AliasAnalysisEvaluator_cpp = Module["__GLOBAL__sub_I_AliasAnalysisEvaluator_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AliasAnalysisEvaluator.cpp"].apply(null, arguments) };
var __ZNK4llvm16LiveRangeUpdater4dumpEv = Module["__ZNK4llvm16LiveRangeUpdater4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm16LiveRangeUpdater4dumpEv"].apply(null, arguments) };
var __ZNK4llvm10bfi_detail9BlockMass4dumpEv = Module["__ZNK4llvm10bfi_detail9BlockMass4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm10bfi_detail9BlockMass4dumpEv"].apply(null, arguments) };
var __ZNK4llvm7PMStack4dumpEv = Module["__ZNK4llvm7PMStack4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm7PMStack4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_RegAllocBasic_cpp = Module["__GLOBAL__sub_I_RegAllocBasic_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegAllocBasic.cpp"].apply(null, arguments) };
var ___extendsftf2 = Module["___extendsftf2"] = function() { return Module["asm"]["__extendsftf2"].apply(null, arguments) };
var __ZN4llvm9safestack13StackColoring14dumpLiveRangesEv = Module["__ZN4llvm9safestack13StackColoring14dumpLiveRangesEv"] = function() { return Module["asm"]["_ZN4llvm9safestack13StackColoring14dumpLiveRangesEv"].apply(null, arguments) };
var __ZNK4llvm9MCSection4dumpEv = Module["__ZNK4llvm9MCSection4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9MCSection4dumpEv"].apply(null, arguments) };
var ____cxa_demangle = Module["____cxa_demangle"] = function() { return Module["asm"]["___cxa_demangle"].apply(null, arguments) };
var __ZNK5clang4Decl4dumpERN4llvm11raw_ostreamEb = Module["__ZNK5clang4Decl4dumpERN4llvm11raw_ostreamEb"] = function() { return Module["asm"]["_ZNK5clang4Decl4dumpERN4llvm11raw_ostreamEb"].apply(null, arguments) };
var __GLOBAL__sub_I_JumpThreading_cpp = Module["__GLOBAL__sub_I_JumpThreading_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_JumpThreading.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_DIBuilder_cpp = Module["__GLOBAL__sub_I_DIBuilder_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DIBuilder.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_RegisterCoalescer_cpp = Module["__GLOBAL__sub_I_RegisterCoalescer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegisterCoalescer.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_InlineSpiller_cpp = Module["__GLOBAL__sub_I_InlineSpiller_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InlineSpiller.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_InstructionCombining_cpp = Module["__GLOBAL__sub_I_InstructionCombining_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InstructionCombining.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineLICM_cpp = Module["__GLOBAL__sub_I_MachineLICM_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineLICM.cpp"].apply(null, arguments) };
var _main = Module["_main"] = function() { return Module["asm"]["main"].apply(null, arguments) };
var __ZNK4llvm20CallGraphWrapperPass4dumpEv = Module["__ZNK4llvm20CallGraphWrapperPass4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm20CallGraphWrapperPass4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_RandomNumberGenerator_cpp = Module["__GLOBAL__sub_I_RandomNumberGenerator_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RandomNumberGenerator.cpp"].apply(null, arguments) };
var __ZNK4llvm15MachineFunction4dumpEv = Module["__ZNK4llvm15MachineFunction4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm15MachineFunction4dumpEv"].apply(null, arguments) };
var __ZN5clang17GlobalModuleIndex4dumpEv = Module["__ZN5clang17GlobalModuleIndex4dumpEv"] = function() { return Module["asm"]["_ZN5clang17GlobalModuleIndex4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_AsmParser_cpp = Module["__GLOBAL__sub_I_AsmParser_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AsmParser.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_IndirectCallPromotionAnalysis_cpp = Module["__GLOBAL__sub_I_IndirectCallPromotionAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_IndirectCallPromotionAnalysis.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MemoryDependenceAnalysis_cpp = Module["__GLOBAL__sub_I_MemoryDependenceAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MemoryDependenceAnalysis.cpp"].apply(null, arguments) };
var dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] = function() { return Module["asm"]["dynCall_iiiiiiiiiiii"].apply(null, arguments) };
var __GLOBAL__sub_I_ImplicitNullChecks_cpp = Module["__GLOBAL__sub_I_ImplicitNullChecks_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ImplicitNullChecks.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MIRPrinter_cpp = Module["__GLOBAL__sub_I_MIRPrinter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MIRPrinter.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_TypeHashing_cpp = Module["__GLOBAL__sub_I_TypeHashing_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TypeHashing.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_DwarfDebug_cpp = Module["__GLOBAL__sub_I_DwarfDebug_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DwarfDebug.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_SROA_cpp = Module["__GLOBAL__sub_I_SROA_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SROA.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_StackProtector_cpp = Module["__GLOBAL__sub_I_StackProtector_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_StackProtector.cpp"].apply(null, arguments) };
var __ZN5clang9ASTReader4dumpEv = Module["__ZN5clang9ASTReader4dumpEv"] = function() { return Module["asm"]["_ZN5clang9ASTReader4dumpEv"].apply(null, arguments) };
var __ZNK4llvm8ILPValue4dumpEv = Module["__ZNK4llvm8ILPValue4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm8ILPValue4dumpEv"].apply(null, arguments) };
var __ZN5clang13serialization10ModuleFile4dumpEv = Module["__ZN5clang13serialization10ModuleFile4dumpEv"] = function() { return Module["asm"]["_ZN5clang13serialization10ModuleFile4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_RegionPrinter_cpp = Module["__GLOBAL__sub_I_RegionPrinter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegionPrinter.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineBranchProbabilityInfo_cpp = Module["__GLOBAL__sub_I_MachineBranchProbabilityInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineBranchProbabilityInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_AddressSanitizer_cpp = Module["__GLOBAL__sub_I_AddressSanitizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AddressSanitizer.cpp"].apply(null, arguments) };
var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = function() { return Module["asm"]["__cxa_is_pointer_type"].apply(null, arguments) };
var __GLOBAL__sub_I_PassBuilder_cpp = Module["__GLOBAL__sub_I_PassBuilder_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PassBuilder.cpp"].apply(null, arguments) };
var dynCall_iiiii = Module["dynCall_iiiii"] = function() { return Module["asm"]["dynCall_iiiii"].apply(null, arguments) };
var __ZNK4llvm6Comdat4dumpEv = Module["__ZNK4llvm6Comdat4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm6Comdat4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_CallGraphSCCPass_cpp = Module["__GLOBAL__sub_I_CallGraphSCCPass_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CallGraphSCCPass.cpp"].apply(null, arguments) };
var __ZNK5clang11DeclContext11dumpLookupsERN4llvm11raw_ostreamEbb = Module["__ZNK5clang11DeclContext11dumpLookupsERN4llvm11raw_ostreamEbb"] = function() { return Module["asm"]["_ZNK5clang11DeclContext11dumpLookupsERN4llvm11raw_ostreamEbb"].apply(null, arguments) };
var __GLOBAL__sub_I_SampleProfile_cpp = Module["__GLOBAL__sub_I_SampleProfile_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SampleProfile.cpp"].apply(null, arguments) };
var __ZNK4llvm10DIEInteger5printERNS_11raw_ostreamE = Module["__ZNK4llvm10DIEInteger5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm10DIEInteger5printERNS_11raw_ostreamE"].apply(null, arguments) };
var ___eqtf2 = Module["___eqtf2"] = function() { return Module["asm"]["__eqtf2"].apply(null, arguments) };
var ___unordtf2 = Module["___unordtf2"] = function() { return Module["asm"]["__unordtf2"].apply(null, arguments) };
var __ZNK5clang14SourceLocation13printToStringERKNS_13SourceManagerE = Module["__ZNK5clang14SourceLocation13printToStringERKNS_13SourceManagerE"] = function() { return Module["asm"]["_ZNK5clang14SourceLocation13printToStringERKNS_13SourceManagerE"].apply(null, arguments) };
var __ZNK5clang4Stmt4dumpEv = Module["__ZNK5clang4Stmt4dumpEv"] = function() { return Module["asm"]["_ZNK5clang4Stmt4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_CorrelatedValuePropagation_cpp = Module["__GLOBAL__sub_I_CorrelatedValuePropagation_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CorrelatedValuePropagation.cpp"].apply(null, arguments) };
var __ZNK4llvm13LazyCallGraph6RefSCC4dumpEv = Module["__ZNK4llvm13LazyCallGraph6RefSCC4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13LazyCallGraph6RefSCC4dumpEv"].apply(null, arguments) };
var __ZNK4llvm28DominanceFrontierWrapperPass4dumpEv = Module["__ZNK4llvm28DominanceFrontierWrapperPass4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm28DominanceFrontierWrapperPass4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_GraphWriter_cpp = Module["__GLOBAL__sub_I_GraphWriter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_GraphWriter.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_SimplifyLibCalls_cpp = Module["__GLOBAL__sub_I_SimplifyLibCalls_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SimplifyLibCalls.cpp"].apply(null, arguments) };
var __ZNK4llvm12SelectionDAG4dumpEv = Module["__ZNK4llvm12SelectionDAG4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12SelectionDAG4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopDistribute_cpp = Module["__GLOBAL__sub_I_LoopDistribute_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopDistribute.cpp"].apply(null, arguments) };
var __ZNK4llvm15AliasSetTracker4dumpEv = Module["__ZNK4llvm15AliasSetTracker4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm15AliasSetTracker4dumpEv"].apply(null, arguments) };
var __ZNK4llvm5Twine8dumpReprEv = Module["__ZNK4llvm5Twine8dumpReprEv"] = function() { return Module["asm"]["_ZNK4llvm5Twine8dumpReprEv"].apply(null, arguments) };
var __ZNK4llvm6SDNode14dumprWithDepthEPKNS_12SelectionDAGEj = Module["__ZNK4llvm6SDNode14dumprWithDepthEPKNS_12SelectionDAGEj"] = function() { return Module["asm"]["_ZNK4llvm6SDNode14dumprWithDepthEPKNS_12SelectionDAGEj"].apply(null, arguments) };
var __GLOBAL__sub_I_CodeGenPGO_cpp = Module["__GLOBAL__sub_I_CodeGenPGO_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CodeGenPGO.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_StackSlotColoring_cpp = Module["__GLOBAL__sub_I_StackSlotColoring_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_StackSlotColoring.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_WinEHPrepare_cpp = Module["__GLOBAL__sub_I_WinEHPrepare_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_WinEHPrepare.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_InterleavedAccessPass_cpp = Module["__GLOBAL__sub_I_InterleavedAccessPass_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InterleavedAccessPass.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_PredicateInfo_cpp = Module["__GLOBAL__sub_I_PredicateInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PredicateInfo.cpp"].apply(null, arguments) };
var __ZNK4llvm12LiveInterval4dumpEv = Module["__ZNK4llvm12LiveInterval4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12LiveInterval4dumpEv"].apply(null, arguments) };
var __realloc = Module["__realloc"] = function() { return Module["asm"]["_realloc"].apply(null, arguments) };
var __ZNK5clang15LocationContext9dumpStackEv = Module["__ZNK5clang15LocationContext9dumpStackEv"] = function() { return Module["asm"]["_ZNK5clang15LocationContext9dumpStackEv"].apply(null, arguments) };
var __GLOBAL__sub_I_Signals_cpp = Module["__GLOBAL__sub_I_Signals_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Signals.cpp"].apply(null, arguments) };
var __ZNK4llvm11NamedMDNode4dumpEv = Module["__ZNK4llvm11NamedMDNode4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm11NamedMDNode4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_MergeFunctions_cpp = Module["__GLOBAL__sub_I_MergeFunctions_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MergeFunctions.cpp"].apply(null, arguments) };
var __ZNK4llvm13ScheduleDAGMI12dumpScheduleEv = Module["__ZNK4llvm13ScheduleDAGMI12dumpScheduleEv"] = function() { return Module["asm"]["_ZNK4llvm13ScheduleDAGMI12dumpScheduleEv"].apply(null, arguments) };
var __GLOBAL__sub_I_SanitizerCoverage_cpp = Module["__GLOBAL__sub_I_SanitizerCoverage_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SanitizerCoverage.cpp"].apply(null, arguments) };
var __ZNK4llvm14DependenceInfo10Constraint4dumpERNS_11raw_ostreamE = Module["__ZNK4llvm14DependenceInfo10Constraint4dumpERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm14DependenceInfo10Constraint4dumpERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_BranchProbabilityInfo_cpp = Module["__GLOBAL__sub_I_BranchProbabilityInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BranchProbabilityInfo.cpp"].apply(null, arguments) };
var __ZNK4llvm8DebugLoc4dumpEv = Module["__ZNK4llvm8DebugLoc4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm8DebugLoc4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_ScheduleDAGInstrs_cpp = Module["__GLOBAL__sub_I_ScheduleDAGInstrs_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ScheduleDAGInstrs.cpp"].apply(null, arguments) };
var setTempRet0 = Module["setTempRet0"] = function() { return Module["asm"]["setTempRet0"].apply(null, arguments) };
var dynCall_viiiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiiiiiiiiiii"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopStrengthReduce_cpp = Module["__GLOBAL__sub_I_LoopStrengthReduce_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopStrengthReduce.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_HWAddressSanitizer_cpp = Module["__GLOBAL__sub_I_HWAddressSanitizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_HWAddressSanitizer.cpp"].apply(null, arguments) };
var __ZNK5clang12TemplateName4dumpEv = Module["__ZNK5clang12TemplateName4dumpEv"] = function() { return Module["asm"]["_ZNK5clang12TemplateName4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_BitcodeReader_cpp = Module["__GLOBAL__sub_I_BitcodeReader_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BitcodeReader.cpp"].apply(null, arguments) };
var __ZNK4llvm21MachineRegionInfoPass4dumpEv = Module["__ZNK4llvm21MachineRegionInfoPass4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm21MachineRegionInfoPass4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineRegisterInfo_cpp = Module["__GLOBAL__sub_I_MachineRegisterInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineRegisterInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_AsmPrinter_cpp = Module["__GLOBAL__sub_I_AsmPrinter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AsmPrinter.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_PrologEpilogInserter_cpp = Module["__GLOBAL__sub_I_PrologEpilogInserter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PrologEpilogInserter.cpp"].apply(null, arguments) };
var __ZNK4llvm3GVN4dumpERNS_8DenseMapIjPNS_5ValueENS_12DenseMapInfoIjEENS_6detail12DenseMapPairIjS3_EEEE = Module["__ZNK4llvm3GVN4dumpERNS_8DenseMapIjPNS_5ValueENS_12DenseMapInfoIjEENS_6detail12DenseMapPairIjS3_EEEE"] = function() { return Module["asm"]["_ZNK4llvm3GVN4dumpERNS_8DenseMapIjPNS_5ValueENS_12DenseMapInfoIjEENS_6detail12DenseMapPairIjS3_EEEE"].apply(null, arguments) };
var __free = Module["__free"] = function() { return Module["asm"]["_free"].apply(null, arguments) };
var __GLOBAL__sub_I_LowerTypeTests_cpp = Module["__GLOBAL__sub_I_LowerTypeTests_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LowerTypeTests.cpp"].apply(null, arguments) };
var __ZNK4llvm5SUnit4dumpEPKNS_11ScheduleDAGE = Module["__ZNK4llvm5SUnit4dumpEPKNS_11ScheduleDAGE"] = function() { return Module["asm"]["_ZNK4llvm5SUnit4dumpEPKNS_11ScheduleDAGE"].apply(null, arguments) };
var dynCall_vii = Module["dynCall_vii"] = function() { return Module["asm"]["dynCall_vii"].apply(null, arguments) };
var __ZN4llvm9safestack11StackLayout5printERNS_11raw_ostreamE = Module["__ZN4llvm9safestack11StackLayout5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZN4llvm9safestack11StackLayout5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __fflush = Module["__fflush"] = function() { return Module["asm"]["_fflush"].apply(null, arguments) };
var ___floatsitf = Module["___floatsitf"] = function() { return Module["asm"]["__floatsitf"].apply(null, arguments) };
var __GLOBAL__sub_I_ExpandMemCmp_cpp = Module["__GLOBAL__sub_I_ExpandMemCmp_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ExpandMemCmp.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_Inliner_cpp = Module["__GLOBAL__sub_I_Inliner_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Inliner.cpp"].apply(null, arguments) };
var __ZNK4llvm9LiveRange4dumpEv = Module["__ZNK4llvm9LiveRange4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9LiveRange4dumpEv"].apply(null, arguments) };
var __ZNK5clang15DeclarationName4dumpEv = Module["__ZNK5clang15DeclarationName4dumpEv"] = function() { return Module["asm"]["_ZNK5clang15DeclarationName4dumpEv"].apply(null, arguments) };
var __ZNK4llvm18LiveDebugVariables4dumpEv = Module["__ZNK4llvm18LiveDebugVariables4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm18LiveDebugVariables4dumpEv"].apply(null, arguments) };
var __ZNK5clang4Decl4dumpEv = Module["__ZNK5clang4Decl4dumpEv"] = function() { return Module["asm"]["_ZNK5clang4Decl4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_CommandLine_cpp = Module["__GLOBAL__sub_I_CommandLine_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CommandLine.cpp"].apply(null, arguments) };
var __ZNK4llvm17AttributeListImpl4dumpEv = Module["__ZNK4llvm17AttributeListImpl4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm17AttributeListImpl4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_MCSymbol_cpp = Module["__GLOBAL__sub_I_MCSymbol_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MCSymbol.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_DebugCounter_cpp = Module["__GLOBAL__sub_I_DebugCounter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DebugCounter.cpp"].apply(null, arguments) };
var __ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKS0_S4_ = Module["__ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKS0_S4_"] = function() { return Module["asm"]["_ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKS0_S4_"].apply(null, arguments) };
var __GLOBAL__sub_I_WholeProgramDevirt_cpp = Module["__GLOBAL__sub_I_WholeProgramDevirt_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_WholeProgramDevirt.cpp"].apply(null, arguments) };
var ____errno_location = Module["____errno_location"] = function() { return Module["asm"]["___errno_location"].apply(null, arguments) };
var __ZNK4llvm6Module4dumpEv = Module["__ZNK4llvm6Module4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm6Module4dumpEv"].apply(null, arguments) };
var __ZNK4llvm12PHITransAddr4dumpEv = Module["__ZNK4llvm12PHITransAddr4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12PHITransAddr4dumpEv"].apply(null, arguments) };
var ___subtf3 = Module["___subtf3"] = function() { return Module["asm"]["__subtf3"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopUnrollPass_cpp = Module["__GLOBAL__sub_I_LoopUnrollPass_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopUnrollPass.cpp"].apply(null, arguments) };
var __ZN4llvm18TargetRegisterInfo7dumpRegEjjPKS0_ = Module["__ZN4llvm18TargetRegisterInfo7dumpRegEjjPKS0_"] = function() { return Module["asm"]["_ZN4llvm18TargetRegisterInfo7dumpRegEjjPKS0_"].apply(null, arguments) };
var __ZNK4llvm7IVUsers4dumpEv = Module["__ZNK4llvm7IVUsers4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm7IVUsers4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_ScheduleDAGRRList_cpp = Module["__GLOBAL__sub_I_ScheduleDAGRRList_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ScheduleDAGRRList.cpp"].apply(null, arguments) };
var __ZNK4llvm8DIEBlock5printERNS_11raw_ostreamE = Module["__ZNK4llvm8DIEBlock5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm8DIEBlock5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_Timer_cpp = Module["__GLOBAL__sub_I_Timer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Timer.cpp"].apply(null, arguments) };
var ___trunctfdf2 = Module["___trunctfdf2"] = function() { return Module["asm"]["__trunctfdf2"].apply(null, arguments) };
var __GLOBAL__sub_I_PassManagerBuilder_cpp = Module["__GLOBAL__sub_I_PassManagerBuilder_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PassManagerBuilder.cpp"].apply(null, arguments) };
var __ZNK4llvm10VirtRegMap4dumpEv = Module["__ZNK4llvm10VirtRegMap4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm10VirtRegMap4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_WebAssemblyPeephole_cpp = Module["__GLOBAL__sub_I_WebAssemblyPeephole_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_WebAssemblyPeephole.cpp"].apply(null, arguments) };
var __ZNK4llvm6MCExpr4dumpEv = Module["__ZNK4llvm6MCExpr4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm6MCExpr4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopLoadElimination_cpp = Module["__GLOBAL__sub_I_LoopLoadElimination_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopLoadElimination.cpp"].apply(null, arguments) };
var __ZNK4llvm3opt7ArgList4dumpEv = Module["__ZNK4llvm3opt7ArgList4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm3opt7ArgList4dumpEv"].apply(null, arguments) };
var ___growWasmMemory = Module["___growWasmMemory"] = function() { return Module["asm"]["__growWasmMemory"].apply(null, arguments) };
var __ZNK4llvm10sampleprof15FunctionSamples4dumpEv = Module["__ZNK4llvm10sampleprof15FunctionSamples4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm10sampleprof15FunctionSamples4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_TailDuplicator_cpp = Module["__GLOBAL__sub_I_TailDuplicator_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TailDuplicator.cpp"].apply(null, arguments) };
var __ZNK4llvm4Loop4dumpEv = Module["__ZNK4llvm4Loop4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm4Loop4dumpEv"].apply(null, arguments) };
var dynCall_diii = Module["dynCall_diii"] = function() { return Module["asm"]["dynCall_diii"].apply(null, arguments) };
var __GLOBAL__sub_I_ScheduleDAGVLIW_cpp = Module["__GLOBAL__sub_I_ScheduleDAGVLIW_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ScheduleDAGVLIW.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopPredication_cpp = Module["__GLOBAL__sub_I_LoopPredication_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopPredication.cpp"].apply(null, arguments) };
var __ZNK5clang11DeclContext11dumpLookupsEv = Module["__ZNK5clang11DeclContext11dumpLookupsEv"] = function() { return Module["asm"]["_ZNK5clang11DeclContext11dumpLookupsEv"].apply(null, arguments) };
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiiii"].apply(null, arguments) };
var __GLOBAL__sub_I_CodeGenPrepare_cpp = Module["__GLOBAL__sub_I_CodeGenPrepare_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CodeGenPrepare.cpp"].apply(null, arguments) };
var dynCall_iiiiid = Module["dynCall_iiiiid"] = function() { return Module["asm"]["dynCall_iiiiid"].apply(null, arguments) };
var __GLOBAL__sub_I_LICM_cpp = Module["__GLOBAL__sub_I_LICM_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LICM.cpp"].apply(null, arguments) };
var dynCall_iiiiii = Module["dynCall_iiiiii"] = function() { return Module["asm"]["dynCall_iiiiii"].apply(null, arguments) };
var _memcpy = Module["_memcpy"] = function() { return Module["asm"]["memcpy"].apply(null, arguments) };
var __ZNK4llvm8Metadata4dumpEv = Module["__ZNK4llvm8Metadata4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm8Metadata4dumpEv"].apply(null, arguments) };
var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() { return Module["asm"]["dynCall_viiiiii"].apply(null, arguments) };
var __ZNK4llvm8DIEDelta5printERNS_11raw_ostreamE = Module["__ZNK4llvm8DIEDelta5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm8DIEDelta5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_EfficiencySanitizer_cpp = Module["__GLOBAL__sub_I_EfficiencySanitizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_EfficiencySanitizer.cpp"].apply(null, arguments) };
var ___extenddftf2 = Module["___extenddftf2"] = function() { return Module["asm"]["__extenddftf2"].apply(null, arguments) };
var __ZNK4llvm15ValueEnumerator4dumpEv = Module["__ZNK4llvm15ValueEnumerator4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm15ValueEnumerator4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_Debug_cpp = Module["__GLOBAL__sub_I_Debug_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Debug.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_ScheduleDAGSDNodes_cpp = Module["__GLOBAL__sub_I_ScheduleDAGSDNodes_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ScheduleDAGSDNodes.cpp"].apply(null, arguments) };
var __memalign = Module["__memalign"] = function() { return Module["asm"]["_memalign"].apply(null, arguments) };
var __GLOBAL__sub_I_MetadataLoader_cpp = Module["__GLOBAL__sub_I_MetadataLoader_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MetadataLoader.cpp"].apply(null, arguments) };
var __ZNK4llvm7DIEExpr5printERNS_11raw_ostreamE = Module["__ZNK4llvm7DIEExpr5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm7DIEExpr5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __ZNK4llvm11MachineLoop4dumpEv = Module["__ZNK4llvm11MachineLoop4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm11MachineLoop4dumpEv"].apply(null, arguments) };
var ___fixunstfsi = Module["___fixunstfsi"] = function() { return Module["asm"]["__fixunstfsi"].apply(null, arguments) };
var dynCall_iiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiii"] = function() { return Module["asm"]["dynCall_iiiiiiiiiiiii"].apply(null, arguments) };
var __ZNK4llvm18RegPressureTracker4dumpEv = Module["__ZNK4llvm18RegPressureTracker4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm18RegPressureTracker4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_RewriteStatepointsForGC_cpp = Module["__GLOBAL__sub_I_RewriteStatepointsForGC_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RewriteStatepointsForGC.cpp"].apply(null, arguments) };
var __ZNK5clang13HeaderMapImpl4dumpEv = Module["__ZNK5clang13HeaderMapImpl4dumpEv"] = function() { return Module["asm"]["_ZNK5clang13HeaderMapImpl4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_SelectionDAGBuilder_cpp = Module["__GLOBAL__sub_I_SelectionDAGBuilder_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SelectionDAGBuilder.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_BranchFolding_cpp = Module["__GLOBAL__sub_I_BranchFolding_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BranchFolding.cpp"].apply(null, arguments) };
var __ZNK4llvm9SlotIndex4dumpEv = Module["__ZNK4llvm9SlotIndex4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9SlotIndex4dumpEv"].apply(null, arguments) };
var __ZNK4llvm15DIEInlineString5printERNS_11raw_ostreamE = Module["__ZNK4llvm15DIEInlineString5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm15DIEInlineString5printERNS_11raw_ostreamE"].apply(null, arguments) };
var ___cxa_demangle = Module["___cxa_demangle"] = function() { return Module["asm"]["__cxa_demangle"].apply(null, arguments) };
var __ZNK4llvm8MCSymbol4dumpEv = Module["__ZNK4llvm8MCSymbol4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm8MCSymbol4dumpEv"].apply(null, arguments) };
var __ZNK5clang6driver11MultilibSet4dumpEv = Module["__ZNK5clang6driver11MultilibSet4dumpEv"] = function() { return Module["asm"]["_ZNK5clang6driver11MultilibSet4dumpEv"].apply(null, arguments) };
var ____cxa_is_pointer_type = Module["____cxa_is_pointer_type"] = function() { return Module["asm"]["___cxa_is_pointer_type"].apply(null, arguments) };
var __ZNK4llvm4Pass4dumpEv = Module["__ZNK4llvm4Pass4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm4Pass4dumpEv"].apply(null, arguments) };
var __ZNK4llvm13LazyCallGraph3SCC4dumpEv = Module["__ZNK4llvm13LazyCallGraph3SCC4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13LazyCallGraph3SCC4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopIdiomRecognize_cpp = Module["__GLOBAL__sub_I_LoopIdiomRecognize_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopIdiomRecognize.cpp"].apply(null, arguments) };
var dynCall_vi = Module["dynCall_vi"] = function() { return Module["asm"]["dynCall_vi"].apply(null, arguments) };
var __GLOBAL__sub_I_DwarfUnit_cpp = Module["__GLOBAL__sub_I_DwarfUnit_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DwarfUnit.cpp"].apply(null, arguments) };
var __ZNK5clang19NestedNameSpecifier4dumpEv = Module["__ZNK5clang19NestedNameSpecifier4dumpEv"] = function() { return Module["asm"]["_ZNK5clang19NestedNameSpecifier4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_OptBisect_cpp = Module["__GLOBAL__sub_I_OptBisect_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_OptBisect.cpp"].apply(null, arguments) };
var _memalign = Module["_memalign"] = function() { return Module["asm"]["memalign"].apply(null, arguments) };
var __ZNK5clang13FullSourceLoc4dumpEv = Module["__ZNK5clang13FullSourceLoc4dumpEv"] = function() { return Module["asm"]["_ZNK5clang13FullSourceLoc4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_PartialInlining_cpp = Module["__GLOBAL__sub_I_PartialInlining_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PartialInlining.cpp"].apply(null, arguments) };
var __ZNK4llvm11SplitEditor4dumpEv = Module["__ZNK4llvm11SplitEditor4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm11SplitEditor4dumpEv"].apply(null, arguments) };
var __ZNK5clang4Stmt9dumpColorEv = Module["__ZNK5clang4Stmt9dumpColorEv"] = function() { return Module["asm"]["_ZNK5clang4Stmt9dumpColorEv"].apply(null, arguments) };
var __GLOBAL__sub_I_TargetPassConfig_cpp = Module["__GLOBAL__sub_I_TargetPassConfig_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TargetPassConfig.cpp"].apply(null, arguments) };
var __ZNK4llvm9DIEAbbrev5printERNS_11raw_ostreamE = Module["__ZNK4llvm9DIEAbbrev5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm9DIEAbbrev5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __ZNK5clang26StandardConversionSequence4dumpEv = Module["__ZNK5clang26StandardConversionSequence4dumpEv"] = function() { return Module["asm"]["_ZNK5clang26StandardConversionSequence4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_RegAllocGreedy_cpp = Module["__GLOBAL__sub_I_RegAllocGreedy_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegAllocGreedy.cpp"].apply(null, arguments) };
var __ZNK4llvm14RegionInfoPass4dumpEv = Module["__ZNK4llvm14RegionInfoPass4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm14RegionInfoPass4dumpEv"].apply(null, arguments) };
var __ZNK4llvm9DIEString5printERNS_11raw_ostreamE = Module["__ZNK4llvm9DIEString5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm9DIEString5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_DependenceAnalysis_cpp = Module["__GLOBAL__sub_I_DependenceAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DependenceAnalysis.cpp"].apply(null, arguments) };
var __ZNK5clang7APValue4dumpEv = Module["__ZNK5clang7APValue4dumpEv"] = function() { return Module["asm"]["_ZNK5clang7APValue4dumpEv"].apply(null, arguments) };
var __ZNK4llvm4SDep5printERNS_11raw_ostreamEPKNS_18TargetRegisterInfoE = Module["__ZNK4llvm4SDep5printERNS_11raw_ostreamEPKNS_18TargetRegisterInfoE"] = function() { return Module["asm"]["_ZNK4llvm4SDep5printERNS_11raw_ostreamEPKNS_18TargetRegisterInfoE"].apply(null, arguments) };
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() { return Module["asm"]["dynCall_iiiiiii"].apply(null, arguments) };
var __ZNK4llvm16RegisterPressure4dumpEPKNS_18TargetRegisterInfoE = Module["__ZNK4llvm16RegisterPressure4dumpEPKNS_18TargetRegisterInfoE"] = function() { return Module["asm"]["_ZNK4llvm16RegisterPressure4dumpEPKNS_18TargetRegisterInfoE"].apply(null, arguments) };
var __ZNK4llvm12LiveInterval8SubRange4dumpEv = Module["__ZNK4llvm12LiveInterval8SubRange4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12LiveInterval8SubRange4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_ValueTracking_cpp = Module["__GLOBAL__sub_I_ValueTracking_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ValueTracking.cpp"].apply(null, arguments) };
var ___netf2 = Module["___netf2"] = function() { return Module["asm"]["__netf2"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineCombiner_cpp = Module["__GLOBAL__sub_I_MachineCombiner_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineCombiner.cpp"].apply(null, arguments) };
var ___addtf3 = Module["___addtf3"] = function() { return Module["asm"]["__addtf3"].apply(null, arguments) };
var dynCall_iid = Module["dynCall_iid"] = function() { return Module["asm"]["dynCall_iid"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopRerollPass_cpp = Module["__GLOBAL__sub_I_LoopRerollPass_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopRerollPass.cpp"].apply(null, arguments) };
var dynCall_iii = Module["dynCall_iii"] = function() { return Module["asm"]["dynCall_iii"].apply(null, arguments) };
var __ZNK4llvm4Type4dumpEv = Module["__ZNK4llvm4Type4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm4Type4dumpEv"].apply(null, arguments) };
var __ZNK4llvm4Loop11dumpVerboseEv = Module["__ZNK4llvm4Loop11dumpVerboseEv"] = function() { return Module["asm"]["_ZNK4llvm4Loop11dumpVerboseEv"].apply(null, arguments) };
var __GLOBAL__sub_I_BasicTargetTransformInfo_cpp = Module["__GLOBAL__sub_I_BasicTargetTransformInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BasicTargetTransformInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_TypeBasedAliasAnalysis_cpp = Module["__GLOBAL__sub_I_TypeBasedAliasAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TypeBasedAliasAnalysis.cpp"].apply(null, arguments) };
var __ZNK4llvm5APInt4dumpEv = Module["__ZNK4llvm5APInt4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm5APInt4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_ForceFunctionAttrs_cpp = Module["__GLOBAL__sub_I_ForceFunctionAttrs_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ForceFunctionAttrs.cpp"].apply(null, arguments) };
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = function() { return Module["asm"]["dynCall_iiiiiiii"].apply(null, arguments) };
var __ZNK4llvm17MachineBasicBlock4dumpEv = Module["__ZNK4llvm17MachineBasicBlock4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm17MachineBasicBlock4dumpEv"].apply(null, arguments) };
var __ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamERNS_13SourceManagerE = Module["__ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamERNS_13SourceManagerE"] = function() { return Module["asm"]["_ZNK5clang4Stmt4dumpERN4llvm11raw_ostreamERNS_13SourceManagerE"].apply(null, arguments) };
var _compile = Module["_compile"] = function() { return Module["asm"]["compile"].apply(null, arguments) };
var __GLOBAL__sub_I_MemorySSA_cpp = Module["__GLOBAL__sub_I_MemorySSA_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MemorySSA.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_FunctionImport_cpp = Module["__GLOBAL__sub_I_FunctionImport_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_FunctionImport.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopVectorize_cpp = Module["__GLOBAL__sub_I_LoopVectorize_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopVectorize.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_ProfileSummaryInfo_cpp = Module["__GLOBAL__sub_I_ProfileSummaryInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ProfileSummaryInfo.cpp"].apply(null, arguments) };
var __ZNK4llvm8DIEEntry5printERNS_11raw_ostreamE = Module["__ZNK4llvm8DIEEntry5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm8DIEEntry5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_StackColoring_cpp = Module["__GLOBAL__sub_I_StackColoring_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_StackColoring.cpp"].apply(null, arguments) };
var _malloc = Module["_malloc"] = function() { return Module["asm"]["malloc"].apply(null, arguments) };
var __GLOBAL__sub_I_RegisterClassInfo_cpp = Module["__GLOBAL__sub_I_RegisterClassInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegisterClassInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_DAGCombiner_cpp = Module["__GLOBAL__sub_I_DAGCombiner_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DAGCombiner.cpp"].apply(null, arguments) };
var __ZNK4llvm7APFloat4dumpEv = Module["__ZNK4llvm7APFloat4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm7APFloat4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_DiagnosticHandler_cpp = Module["__GLOBAL__sub_I_DiagnosticHandler_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DiagnosticHandler.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LiveIntervals_cpp = Module["__GLOBAL__sub_I_LiveIntervals_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LiveIntervals.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_TargetTransformInfo_cpp = Module["__GLOBAL__sub_I_TargetTransformInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TargetTransformInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_DFAPacketizer_cpp = Module["__GLOBAL__sub_I_DFAPacketizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DFAPacketizer.cpp"].apply(null, arguments) };
var __ZNK5clang8comments7Comment4dumpERKNS_10ASTContextE = Module["__ZNK5clang8comments7Comment4dumpERKNS_10ASTContextE"] = function() { return Module["asm"]["_ZNK5clang8comments7Comment4dumpERKNS_10ASTContextE"].apply(null, arguments) };
var __GLOBAL__sub_I_GCOVProfiling_cpp = Module["__GLOBAL__sub_I_GCOVProfiling_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_GCOVProfiling.cpp"].apply(null, arguments) };
var __ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKNS_11ScheduleDAGE = Module["__ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKNS_11ScheduleDAGE"] = function() { return Module["asm"]["_ZNK4llvm5SUnit5printERNS_11raw_ostreamEPKNS_11ScheduleDAGE"].apply(null, arguments) };
var dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] = function() { return Module["asm"]["dynCall_iiiiiiiiiii"].apply(null, arguments) };
var __GLOBAL__sub_I_TargetLibraryInfo_cpp = Module["__GLOBAL__sub_I_TargetLibraryInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TargetLibraryInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LegalizeTypes_cpp = Module["__GLOBAL__sub_I_LegalizeTypes_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LegalizeTypes.cpp"].apply(null, arguments) };
var __ZNK4llvm13ConstantRange4dumpEv = Module["__ZNK4llvm13ConstantRange4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13ConstantRange4dumpEv"].apply(null, arguments) };
var ____cxa_can_catch = Module["____cxa_can_catch"] = function() { return Module["asm"]["___cxa_can_catch"].apply(null, arguments) };
var __ZNK5clang7CodeGen10ABIArgInfo4dumpEv = Module["__ZNK5clang7CodeGen10ABIArgInfo4dumpEv"] = function() { return Module["asm"]["_ZNK5clang7CodeGen10ABIArgInfo4dumpEv"].apply(null, arguments) };
var ___lttf2 = Module["___lttf2"] = function() { return Module["asm"]["__lttf2"].apply(null, arguments) };
var __GLOBAL__sub_I_BasicAliasAnalysis_cpp = Module["__GLOBAL__sub_I_BasicAliasAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BasicAliasAnalysis.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj_cpp = Module["__GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_WebAssemblyLowerEmscriptenEHSjLj.cpp"].apply(null, arguments) };
var __ZNK4llvm6SDNode5dumprEv = Module["__ZNK4llvm6SDNode5dumprEv"] = function() { return Module["asm"]["_ZNK4llvm6SDNode5dumprEv"].apply(null, arguments) };
var __GLOBAL__sub_I_GVN_cpp = Module["__GLOBAL__sub_I_GVN_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_GVN.cpp"].apply(null, arguments) };
var __ZNK4llvm17SubtargetFeatures4dumpEv = Module["__ZNK4llvm17SubtargetFeatures4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm17SubtargetFeatures4dumpEv"].apply(null, arguments) };
var _fflush = Module["_fflush"] = function() { return Module["asm"]["fflush"].apply(null, arguments) };
var __GLOBAL__sub_I_BoundsChecking_cpp = Module["__GLOBAL__sub_I_BoundsChecking_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BoundsChecking.cpp"].apply(null, arguments) };
var __ZNK4llvm12LexicalScope4dumpEj = Module["__ZNK4llvm12LexicalScope4dumpEj"] = function() { return Module["asm"]["_ZNK4llvm12LexicalScope4dumpEj"].apply(null, arguments) };
var __ZNK4llvm10DIELocList5printERNS_11raw_ostreamE = Module["__ZNK4llvm10DIELocList5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm10DIELocList5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_InlineFunction_cpp = Module["__GLOBAL__sub_I_InlineFunction_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InlineFunction.cpp"].apply(null, arguments) };
var __ZNK4llvm11MCAssembler4dumpEv = Module["__ZNK4llvm11MCAssembler4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm11MCAssembler4dumpEv"].apply(null, arguments) };
var __ZNK4llvm13LiveIntervals10dumpInstrsEv = Module["__ZNK4llvm13LiveIntervals10dumpInstrsEv"] = function() { return Module["asm"]["_ZNK4llvm13LiveIntervals10dumpInstrsEv"].apply(null, arguments) };
var ___letf2 = Module["___letf2"] = function() { return Module["asm"]["__letf2"].apply(null, arguments) };
var ___multi3 = Module["___multi3"] = function() { return Module["asm"]["__multi3"].apply(null, arguments) };
var __ZNK4llvm4SCEV4dumpEv = Module["__ZNK4llvm4SCEV4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm4SCEV4dumpEv"].apply(null, arguments) };
var __ZNK4llvm3DIE5printERNS_11raw_ostreamEj = Module["__ZNK4llvm3DIE5printERNS_11raw_ostreamEj"] = function() { return Module["asm"]["_ZNK4llvm3DIE5printERNS_11raw_ostreamEj"].apply(null, arguments) };
var __GLOBAL__sub_I_PGOMemOPSizeOpt_cpp = Module["__GLOBAL__sub_I_PGOMemOPSizeOpt_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_PGOMemOPSizeOpt.cpp"].apply(null, arguments) };
var ___fixtfsi = Module["___fixtfsi"] = function() { return Module["asm"]["__fixtfsi"].apply(null, arguments) };
var __ZNK5clang8comments7Comment4dumpEv = Module["__ZNK5clang8comments7Comment4dumpEv"] = function() { return Module["asm"]["_ZNK5clang8comments7Comment4dumpEv"].apply(null, arguments) };
var ___getf2 = Module["___getf2"] = function() { return Module["asm"]["__getf2"].apply(null, arguments) };
var dynCall_iiii = Module["dynCall_iiii"] = function() { return Module["asm"]["dynCall_iiii"].apply(null, arguments) };
var __ZNK5clang14MacroDirective4dumpEv = Module["__ZNK5clang14MacroDirective4dumpEv"] = function() { return Module["asm"]["_ZNK5clang14MacroDirective4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopUnrollPeel_cpp = Module["__GLOBAL__sub_I_LoopUnrollPeel_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopUnrollPeel.cpp"].apply(null, arguments) };
var __ZNK5clang4Stmt4dumpERNS_13SourceManagerE = Module["__ZNK5clang4Stmt4dumpERNS_13SourceManagerE"] = function() { return Module["asm"]["_ZNK5clang4Stmt4dumpERNS_13SourceManagerE"].apply(null, arguments) };
var __ZNK4llvm10sampleprof12SampleRecord4dumpEv = Module["__ZNK4llvm10sampleprof12SampleRecord4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm10sampleprof12SampleRecord4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_AliasSetTracker_cpp = Module["__GLOBAL__sub_I_AliasSetTracker_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AliasSetTracker.cpp"].apply(null, arguments) };
var __ZNK4llvm26ScoreboardHazardRecognizer10Scoreboard4dumpEv = Module["__ZNK4llvm26ScoreboardHazardRecognizer10Scoreboard4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm26ScoreboardHazardRecognizer10Scoreboard4dumpEv"].apply(null, arguments) };
var dynCall_viiiii = Module["dynCall_viiiii"] = function() { return Module["asm"]["dynCall_viiiii"].apply(null, arguments) };
var _memmove = Module["_memmove"] = function() { return Module["asm"]["memmove"].apply(null, arguments) };
var __GLOBAL__sub_I_NewGVN_cpp = Module["__GLOBAL__sub_I_NewGVN_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_NewGVN.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineOperand_cpp = Module["__GLOBAL__sub_I_MachineOperand_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineOperand.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_StackMaps_cpp = Module["__GLOBAL__sub_I_StackMaps_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_StackMaps.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_RegionInfo_cpp = Module["__GLOBAL__sub_I_RegionInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegionInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_IndVarSimplify_cpp = Module["__GLOBAL__sub_I_IndVarSimplify_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_IndVarSimplify.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineBlockFrequencyInfo_cpp = Module["__GLOBAL__sub_I_MachineBlockFrequencyInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineBlockFrequencyInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_CodeViewDebug_cpp = Module["__GLOBAL__sub_I_CodeViewDebug_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_CodeViewDebug.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopSink_cpp = Module["__GLOBAL__sub_I_LoopSink_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopSink.cpp"].apply(null, arguments) };
var __ZNK4llvm3opt6Option4dumpEv = Module["__ZNK4llvm3opt6Option4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm3opt6Option4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_SafeStackLayout_cpp = Module["__GLOBAL__sub_I_SafeStackLayout_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SafeStackLayout.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_AggressiveAntiDepBreaker_cpp = Module["__GLOBAL__sub_I_AggressiveAntiDepBreaker_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AggressiveAntiDepBreaker.cpp"].apply(null, arguments) };
var __ZNK4llvm10MCFragment4dumpEv = Module["__ZNK4llvm10MCFragment4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm10MCFragment4dumpEv"].apply(null, arguments) };
var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = function() { return Module["asm"]["dynCall_iiiiiiiiii"].apply(null, arguments) };
var __ZNK5clang8QualType4dumpEv = Module["__ZNK5clang8QualType4dumpEv"] = function() { return Module["asm"]["_ZNK5clang8QualType4dumpEv"].apply(null, arguments) };
var ___gttf2 = Module["___gttf2"] = function() { return Module["asm"]["__gttf2"].apply(null, arguments) };
var __GLOBAL__sub_I_ScalarEvolution_cpp = Module["__GLOBAL__sub_I_ScalarEvolution_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ScalarEvolution.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopInfo_cpp = Module["__GLOBAL__sub_I_LoopInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_SelectionDAGISel_cpp = Module["__GLOBAL__sub_I_SelectionDAGISel_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SelectionDAGISel.cpp"].apply(null, arguments) };
var __ZNK5clang8comments7Comment9dumpColorEv = Module["__ZNK5clang8comments7Comment9dumpColorEv"] = function() { return Module["asm"]["_ZNK5clang8comments7Comment9dumpColorEv"].apply(null, arguments) };
var __ZNK4llvm13AttributeList4dumpEv = Module["__ZNK4llvm13AttributeList4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13AttributeList4dumpEv"].apply(null, arguments) };
var __compile = Module["__compile"] = function() { return Module["asm"]["_compile"].apply(null, arguments) };
var __GLOBAL__sub_I_Dominators_cpp = Module["__GLOBAL__sub_I_Dominators_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Dominators.cpp"].apply(null, arguments) };
var __ZN4llvm9safestack13StackColoring11dumpAllocasEv = Module["__ZN4llvm9safestack13StackColoring11dumpAllocasEv"] = function() { return Module["asm"]["_ZN4llvm9safestack13StackColoring11dumpAllocasEv"].apply(null, arguments) };
var __ZNK4llvm5Twine4dumpEv = Module["__ZNK4llvm5Twine4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm5Twine4dumpEv"].apply(null, arguments) };
var __ZNK4llvm8DIEValue5printERNS_11raw_ostreamE = Module["__ZNK4llvm8DIEValue5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm8DIEValue5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineSink_cpp = Module["__GLOBAL__sub_I_MachineSink_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineSink.cpp"].apply(null, arguments) };
var __ZNK4llvm13CallGraphNode4dumpEv = Module["__ZNK4llvm13CallGraphNode4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13CallGraphNode4dumpEv"].apply(null, arguments) };
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = function() { return Module["asm"]["dynCall_iiiiiiiii"].apply(null, arguments) };
var dynCall_viiii = Module["dynCall_viiii"] = function() { return Module["asm"]["dynCall_viiii"].apply(null, arguments) };
var __GLOBAL__sub_I_SLPVectorizer_cpp = Module["__GLOBAL__sub_I_SLPVectorizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SLPVectorizer.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_ConstantHoisting_cpp = Module["__GLOBAL__sub_I_ConstantHoisting_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ConstantHoisting.cpp"].apply(null, arguments) };
var __ZNK4llvm9MemorySSA4dumpEv = Module["__ZNK4llvm9MemorySSA4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9MemorySSA4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopUnroll_cpp = Module["__GLOBAL__sub_I_LoopUnroll_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopUnroll.cpp"].apply(null, arguments) };
var __ZNK4llvm6SDNode5dumprEPKNS_12SelectionDAGE = Module["__ZNK4llvm6SDNode5dumprEPKNS_12SelectionDAGE"] = function() { return Module["asm"]["_ZNK4llvm6SDNode5dumprEPKNS_12SelectionDAGE"].apply(null, arguments) };
var __ZNK4llvm8AliasSet4dumpEv = Module["__ZNK4llvm8AliasSet4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm8AliasSet4dumpEv"].apply(null, arguments) };
var __ZNK5clang6driver8Multilib4dumpEv = Module["__ZNK5clang6driver8Multilib4dumpEv"] = function() { return Module["asm"]["_ZNK5clang6driver8Multilib4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LegacyPassManager_cpp = Module["__GLOBAL__sub_I_LegacyPassManager_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LegacyPassManager.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_TargetLoweringBase_cpp = Module["__GLOBAL__sub_I_TargetLoweringBase_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TargetLoweringBase.cpp"].apply(null, arguments) };
var __ZNK4llvm12DebugCounter4dumpEv = Module["__ZNK4llvm12DebugCounter4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm12DebugCounter4dumpEv"].apply(null, arguments) };
var __ZNK5clang4Type4dumpERN4llvm11raw_ostreamE = Module["__ZNK5clang4Type4dumpERN4llvm11raw_ostreamE"] = function() { return Module["asm"]["_ZNK5clang4Type4dumpERN4llvm11raw_ostreamE"].apply(null, arguments) };
var __ZNK4llvm13SchedBoundary18dumpScheduledStateEv = Module["__ZNK4llvm13SchedBoundary18dumpScheduledStateEv"] = function() { return Module["asm"]["_ZNK4llvm13SchedBoundary18dumpScheduledStateEv"].apply(null, arguments) };
var __GLOBAL__sub_I_SpeculativeExecution_cpp = Module["__GLOBAL__sub_I_SpeculativeExecution_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SpeculativeExecution.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LowerExpectIntrinsic_cpp = Module["__GLOBAL__sub_I_LowerExpectIntrinsic_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LowerExpectIntrinsic.cpp"].apply(null, arguments) };
var __ZNK5clang8CFGBlock4dumpEv = Module["__ZNK5clang8CFGBlock4dumpEv"] = function() { return Module["asm"]["_ZNK5clang8CFGBlock4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts_cpp = Module["__GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_WebAssemblyFixFunctionBitcasts.cpp"].apply(null, arguments) };
var __ZNK4llvm8Metadata4dumpEPKNS_6ModuleE = Module["__ZNK4llvm8Metadata4dumpEPKNS_6ModuleE"] = function() { return Module["asm"]["_ZNK4llvm8Metadata4dumpEPKNS_6ModuleE"].apply(null, arguments) };
var __ZNK5clang4Decl9dumpColorEv = Module["__ZNK5clang4Decl9dumpColorEv"] = function() { return Module["asm"]["_ZNK5clang4Decl9dumpColorEv"].apply(null, arguments) };
var __ZNK4llvm11SlotIndexes4dumpEv = Module["__ZNK4llvm11SlotIndexes4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm11SlotIndexes4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_TargetInstrInfo_cpp = Module["__GLOBAL__sub_I_TargetInstrInfo_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TargetInstrInfo.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopVersioningLICM_cpp = Module["__GLOBAL__sub_I_LoopVersioningLICM_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopVersioningLICM.cpp"].apply(null, arguments) };
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiii"].apply(null, arguments) };
var __ZNK4llvm9LiveRange7Segment4dumpEv = Module["__ZNK4llvm9LiveRange7Segment4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9LiveRange7Segment4dumpEv"].apply(null, arguments) };
var ___ashlti3 = Module["___ashlti3"] = function() { return Module["asm"]["__ashlti3"].apply(null, arguments) };
var __GLOBAL__sub_I_ResourcePriorityQueue_cpp = Module["__GLOBAL__sub_I_ResourcePriorityQueue_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ResourcePriorityQueue.cpp"].apply(null, arguments) };
var __ZNK4llvm5SUnit7dumpAllEPKNS_11ScheduleDAGE = Module["__ZNK4llvm5SUnit7dumpAllEPKNS_11ScheduleDAGE"] = function() { return Module["asm"]["_ZNK4llvm5SUnit7dumpAllEPKNS_11ScheduleDAGE"].apply(null, arguments) };
var __GLOBAL__sub_I_InstCombineCalls_cpp = Module["__GLOBAL__sub_I_InstCombineCalls_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InstCombineCalls.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_EdgeBundles_cpp = Module["__GLOBAL__sub_I_EdgeBundles_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_EdgeBundles.cpp"].apply(null, arguments) };
var __ZNK4llvm13LiveVariables7VarInfo4dumpEv = Module["__ZNK4llvm13LiveVariables7VarInfo4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13LiveVariables7VarInfo4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_Loads_cpp = Module["__GLOBAL__sub_I_Loads_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Loads.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopVersioning_cpp = Module["__GLOBAL__sub_I_LoopVersioning_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopVersioning.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_WebAssemblyExplicitLocals_cpp = Module["__GLOBAL__sub_I_WebAssemblyExplicitLocals_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_WebAssemblyExplicitLocals.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MachineBlockPlacement_cpp = Module["__GLOBAL__sub_I_MachineBlockPlacement_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachineBlockPlacement.cpp"].apply(null, arguments) };
var __ZNK4llvm19MachineConstantPool4dumpEv = Module["__ZNK4llvm19MachineConstantPool4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm19MachineConstantPool4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_InlineCost_cpp = Module["__GLOBAL__sub_I_InlineCost_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InlineCost.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_DeadStoreElimination_cpp = Module["__GLOBAL__sub_I_DeadStoreElimination_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DeadStoreElimination.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_Float2Int_cpp = Module["__GLOBAL__sub_I_Float2Int_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Float2Int.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_IfConversion_cpp = Module["__GLOBAL__sub_I_IfConversion_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_IfConversion.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_RegAllocFast_cpp = Module["__GLOBAL__sub_I_RegAllocFast_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegAllocFast.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_Internalize_cpp = Module["__GLOBAL__sub_I_Internalize_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_Internalize.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_BitcodeWriter_cpp = Module["__GLOBAL__sub_I_BitcodeWriter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_BitcodeWriter.cpp"].apply(null, arguments) };
var __ZNK5clang6Module4dumpEv = Module["__ZNK5clang6Module4dumpEv"] = function() { return Module["asm"]["_ZNK5clang6Module4dumpEv"].apply(null, arguments) };
var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = function() { return Module["asm"]["dynCall_viiiiiiiiii"].apply(null, arguments) };
var __ZN5clang9ModuleMap4dumpEv = Module["__ZN5clang9ModuleMap4dumpEv"] = function() { return Module["asm"]["_ZN5clang9ModuleMap4dumpEv"].apply(null, arguments) };
var __ZNK4llvm9MCOperand4dumpEv = Module["__ZNK4llvm9MCOperand4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9MCOperand4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopDataPrefetch_cpp = Module["__GLOBAL__sub_I_LoopDataPrefetch_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopDataPrefetch.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_LoopUnrollRuntime_cpp = Module["__GLOBAL__sub_I_LoopUnrollRuntime_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_LoopUnrollRuntime.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_MachinePipeliner_cpp = Module["__GLOBAL__sub_I_MachinePipeliner_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_MachinePipeliner.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_AliasAnalysis_cpp = Module["__GLOBAL__sub_I_AliasAnalysis_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_AliasAnalysis.cpp"].apply(null, arguments) };
var __GLOBAL__sub_I_RegAllocBase_cpp = Module["__GLOBAL__sub_I_RegAllocBase_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_RegAllocBase.cpp"].apply(null, arguments) };
var __ZNK4llvm9DIEAbbrev4dumpEv = Module["__ZNK4llvm9DIEAbbrev4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm9DIEAbbrev4dumpEv"].apply(null, arguments) };
var __ZNK4llvm6SDNode4dumpEPKNS_12SelectionDAGE = Module["__ZNK4llvm6SDNode4dumpEPKNS_12SelectionDAGE"] = function() { return Module["asm"]["_ZNK4llvm6SDNode4dumpEPKNS_12SelectionDAGE"].apply(null, arguments) };
var __ZN4llvm18dumpRegSetPressureENS_8ArrayRefIjEEPKNS_18TargetRegisterInfoE = Module["__ZN4llvm18dumpRegSetPressureENS_8ArrayRefIjEEPKNS_18TargetRegisterInfoE"] = function() { return Module["asm"]["_ZN4llvm18dumpRegSetPressureENS_8ArrayRefIjEEPKNS_18TargetRegisterInfoE"].apply(null, arguments) };
var __ZNK4llvm13GVNExpression10Expression4dumpEv = Module["__ZNK4llvm13GVNExpression10Expression4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm13GVNExpression10Expression4dumpEv"].apply(null, arguments) };
var _fmodl = Module["_fmodl"] = function() { return Module["asm"]["fmodl"].apply(null, arguments) };
var __GLOBAL__sub_I_SymbolRewriter_cpp = Module["__GLOBAL__sub_I_SymbolRewriter_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_SymbolRewriter.cpp"].apply(null, arguments) };
var __ZNK4llvm6DIELoc5printERNS_11raw_ostreamE = Module["__ZNK4llvm6DIELoc5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm6DIELoc5printERNS_11raw_ostreamE"].apply(null, arguments) };
var __GLOBAL__sub_I_ARMAttributeParser_cpp = Module["__GLOBAL__sub_I_ARMAttributeParser_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ARMAttributeParser.cpp"].apply(null, arguments) };
var __ZNK4llvm14MachineOperand4dumpEv = Module["__ZNK4llvm14MachineOperand4dumpEv"] = function() { return Module["asm"]["_ZNK4llvm14MachineOperand4dumpEv"].apply(null, arguments) };
var ___lshrti3 = Module["___lshrti3"] = function() { return Module["asm"]["__lshrti3"].apply(null, arguments) };
var __GLOBAL__sub_I_TypeDumpVisitor_cpp = Module["__GLOBAL__sub_I_TypeDumpVisitor_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_TypeDumpVisitor.cpp"].apply(null, arguments) };
var __ZNK4llvm8DIELabel5printERNS_11raw_ostreamE = Module["__ZNK4llvm8DIELabel5printERNS_11raw_ostreamE"] = function() { return Module["asm"]["_ZNK4llvm8DIELabel5printERNS_11raw_ostreamE"].apply(null, arguments) };
var dynCall_viii = Module["dynCall_viii"] = function() { return Module["asm"]["dynCall_viii"].apply(null, arguments) };
var __GLOBAL__sub_I_InstrProfiling_cpp = Module["__GLOBAL__sub_I_InstrProfiling_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_InstrProfiling.cpp"].apply(null, arguments) };
var __ZNK5clang7CodeGen14CGBitFieldInfo4dumpEv = Module["__ZNK5clang7CodeGen14CGBitFieldInfo4dumpEv"] = function() { return Module["asm"]["_ZNK5clang7CodeGen14CGBitFieldInfo4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_ShrinkWrap_cpp = Module["__GLOBAL__sub_I_ShrinkWrap_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_ShrinkWrap.cpp"].apply(null, arguments) };
var __ZN5clang20LayoutOverrideSource4dumpEv = Module["__ZN5clang20LayoutOverrideSource4dumpEv"] = function() { return Module["asm"]["_ZN5clang20LayoutOverrideSource4dumpEv"].apply(null, arguments) };
var __GLOBAL__sub_I_DataFlowSanitizer_cpp = Module["__GLOBAL__sub_I_DataFlowSanitizer_cpp"] = function() { return Module["asm"]["_GLOBAL__sub_I_DataFlowSanitizer.cpp"].apply(null, arguments) };
;

STACKTOP = STACK_BASE + TOTAL_STACK;
STACK_MAX = STACK_BASE;
HEAP32[1024 >> 2] = STACKTOP;
stackAlloc = Module['_stackAlloc'];
stackSave = Module['_stackSave'];
stackRestore = Module['_stackRestore'];
establishStackSpace = Module['establishStackSpace'];

setTempRet0 = Module['setTempRet0'];
getTempRet0 = Module['getTempRet0'];

function invoke_diii(index,a1,a2,a3) {
  try {
    return Module["dynCall_diii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_fiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_fiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_i(index) {
  try {
    return Module["dynCall_i"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiid(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiid"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    return Module["dynCall_iiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  try {
    return Module["dynCall_iiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  try {
    return Module["dynCall_iiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  try {
    return Module["dynCall_iiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiiij"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_jiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_jiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  try {
    Module["dynCall_viiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15) {
  try {
    Module["dynCall_viiiiiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}



// === Auto-generated postamble setup entry stuff ===

Module['asm'] = asm;

Module["FS"] = FS;
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;

if (!Module["GL"]) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };



// Modularize mode returns a function, which can be called to
// create instances. The instances provide a then() method,
// must like a Promise, that receives a callback. The callback
// is called when the module is ready to run, with the module
// as a parameter. (Like a Promise, it also returns the module
// so you can use the output of .then(..)).
Module['then'] = function(func) {
  // We may already be ready to run code at this time. if
  // so, just queue a call to the callback.
  if (Module['calledRun']) {
    func(Module);
  } else {
    // we are not ready to call then() yet. we must call it
    // at the same time we would call onRuntimeInitialized.
    var old = Module['onRuntimeInitialized'];
    Module['onRuntimeInitialized'] = function() {
      if (old) old();
      func(Module);
    };
  }
  return Module;
};

/**
 * @constructor
 * @extends {Error}
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun']) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString(Module['thisProgram']), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);


  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
      exit(ret, /* implicit = */ true);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      var toLog = e;
      if (e && typeof e === 'object' && e.stack) {
        toLog = [e, e.stack];
      }
      Module.printErr('exception thrown: ' + toLog);
      Module['quit'](1, e);
    }
  } finally {
    calledMain = true;
  }
}




/** @type {function(Array=)} */
function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    return;
  }

  writeStackCookie();

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    if (ABORT) return;

    ensureInitRuntime();

    preMain();

    if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
      Module.printErr('pre-main prep time: ' + (Date.now() - preloadStartTime) + ' ms');
    }

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (Module['_main'] && shouldRunNow) Module['callMain'](args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
  checkStackCookie();
}
Module['run'] = run;

function exit(status, implicit) {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in NO_FILESYSTEM
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var flush = FS.quit;
  if (flush) {
    var print = Module['print'];
    var printErr = Module['printErr'];
    var has = false;
    Module['print'] = Module['printErr'] = function(x) {
      has = true;
    }
    try { // it doesn't matter if it fails
      flush(0);
    } catch(e) {}
    Module['print'] = print;
    Module['printErr'] = printErr;
    if (has) {
      warnOnce('stdio streams had content in them that was not flushed. you should set NO_EXIT_RUNTIME to 0 (see the FAQ), or make sure to emit a newline when you printf etc.');
    }
  }

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && Module['noExitRuntime'] && status === 0) {
    return;
  }

  if (Module['noExitRuntime']) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      Module.printErr('exit(' + status + ') called, but NO_EXIT_RUNTIME is set, so halting execution but not exiting the runtime or preventing further async execution (build with NO_EXIT_RUNTIME=0, if you want a true shutdown)');
    }
  } else {

    ABORT = true;
    EXITSTATUS = status;
    STACKTOP = initialStackTop;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  if (ENVIRONMENT_IS_NODE) {
    process['exit'](status);
  }
  Module['quit'](status, new ExitStatus(status));
}
Module['exit'] = exit;

var abortDecorators = [];

function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  if (what !== undefined) {
    Module.print(what);
    Module.printErr(what);
    what = JSON.stringify(what)
  } else {
    what = '';
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '';

  var output = 'abort(' + what + ') at ' + stackTrace() + extra;
  if (abortDecorators) {
    abortDecorators.forEach(function(decorator) {
      output = decorator(output, what);
    });
  }
  throw output;
}
Module['abort'] = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}

Module["noExitRuntime"] = true;

run();

// {{POST_RUN_ADDITIONS}}





// {{MODULE_ADDITIONS}}





  return Module;
};
if (typeof module === "object" && module.exports) {
  module['exports'] = Module;
};
