// Polyfills for Node.js built-in modules in the browser environment

console.log('[POLYFILLS] Starting to load polyfills...');

// Import Buffer at the top level
import { Buffer } from 'buffer';

// Add Buffer to window
console.log('[POLYFILLS] Loading Buffer polyfill...');
try {
  window.Buffer = Buffer;
  console.log('[POLYFILLS] Buffer polyfill loaded successfully');
} catch (error) {
  console.error('[POLYFILLS] Error loading Buffer polyfill:', error);
}

// Add process to window
console.log('[POLYFILLS] Loading process polyfill...');
try {
  if (typeof window.process === 'undefined') {
    console.log('[POLYFILLS] Creating process object');
    window.process = {} as any;
  } else {
    console.log('[POLYFILLS] Process object already exists');
  }

  window.process.env = window.process.env || {};
  window.process.browser = true;
  window.process.version = '';
  window.process.versions = {};

  // Add nextTick function
  window.process.nextTick = function(callback: Function, ...args: any[]) {
    setTimeout(() => callback(...args), 0);
  };

  console.log('[POLYFILLS] Process polyfill loaded successfully');
} catch (error) {
  console.error('[POLYFILLS] Error loading process polyfill:', error);
}

// Add global to window
console.log('[POLYFILLS] Loading global polyfill...');
try {
  window.global = window.global || window;
  console.log('[POLYFILLS] Global polyfill loaded successfully');
} catch (error) {
  console.error('[POLYFILLS] Error loading global polyfill:', error);
}

// Add util polyfill
console.log('[POLYFILLS] Loading util polyfill...');
try {
  window.util = window.util || {
    inherits: function(ctor: any, superCtor: any) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
  console.log('[POLYFILLS] Util polyfill loaded successfully');
} catch (error) {
  console.error('[POLYFILLS] Error loading util polyfill:', error);
}

// Console log that polyfills are loaded
console.log('[POLYFILLS] All Node.js polyfills loaded for browser environment');
