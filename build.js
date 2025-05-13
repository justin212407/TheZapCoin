// Build script for Zapcoin
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  }
};

// Helper function to log with colors
function log(message, color = colors.fg.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to execute commands
function execute(command, options = {}) {
  try {
    log(`Executing: ${command}`, colors.fg.cyan);
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    log(`Error executing command: ${command}`, colors.fg.red);
    log(error.message, colors.fg.red);
    return false;
  }
}

// Main build function
async function build() {
  log('Starting build process for Zapcoin...', colors.fg.green);
  
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    log('Installing dependencies...', colors.fg.yellow);
    if (!execute('npm install')) {
      log('Failed to install dependencies. Exiting.', colors.fg.red);
      process.exit(1);
    }
  }
  
  // Build the Solana program
  log('Building Solana program...', colors.fg.yellow);
  if (!execute('npm run build:program')) {
    log('Failed to build Solana program. Continuing with frontend build...', colors.fg.yellow);
  }
  
  // Build the frontend
  log('Building frontend...', colors.fg.yellow);
  if (!execute('npm run build')) {
    log('Failed to build frontend. Exiting.', colors.fg.red);
    process.exit(1);
  }
  
  // Check if the build was successful
  if (fs.existsSync('dist') && fs.readdirSync('dist').length > 0) {
    log('Build completed successfully!', colors.fg.green);
    log('The build output is in the dist directory.', colors.fg.green);
    log('To deploy to Netlify, run: netlify deploy --prod', colors.fg.cyan);
  } else {
    log('Build failed. The dist directory is empty or does not exist.', colors.fg.red);
    process.exit(1);
  }
}

// Run the build
build().catch(error => {
  log(`Unhandled error: ${error.message}`, colors.fg.red);
  process.exit(1);
});
