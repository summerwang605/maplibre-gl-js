//
// Our custom intro provides a specialized "define()" function, called by the
// AMD modules below, that sets up the worker blob URL and then executes the
// main module, storing its exported value as 'amapgl'

// The three "chunks" imported here are produced by a first Rollup pass,
// which outputs them as AMD modules.

// Shared dependencies
import '../../staging/amapgl/shared';

// Worker and its unique dependencies
// When this wrapper function is passed to our custom define() in build/rollup/bundle_prelude.js,
// it gets stringified, together with the shared wrapper (using
// Function.toString()), and the resulting string of code is made into a
// Blob URL that gets used by the main module to create the web workers.
import '../../staging/amapgl/worker';

// Main module and its dependencies
import '../../staging/amapgl/index';

export default amapgl;
