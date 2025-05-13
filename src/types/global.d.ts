// Global type definitions for the application

// Extend the Window interface to include our polyfills
interface Window {
  Buffer: typeof Buffer;
  process: {
    env: Record<string, any>;
    browser: boolean;
    version: string;
    versions: Record<string, any>;
    [key: string]: any;
  };
  global: Window;
  util: any;
}

// Declare global variables
declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: {
      env: Record<string, any>;
      browser: boolean;
      version: string;
      versions: Record<string, any>;
      [key: string]: any;
    };
    global: Window;
    util: any;
  }
}

export {};
