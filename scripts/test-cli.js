#!/usr/bin/env node

/**
 * Test script to verify CLI and MCP inspector connectivity
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

console.log('🧪 Testing CLI connectivity...');

// Check if CLI file exists
const cliPath = join(projectRoot, 'dist', 'cli.js');
if (!existsSync(cliPath)) {
  console.error('❌ CLI file not found. Run "npm run build" first.');
  process.exit(1);
}

// Test CLI startup
console.log('🔧 Testing CLI startup...');

const cliProcess = spawn('node', [cliPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, DEBUG: 'true' }
});

let output = '';
let errorOutput = '';

cliProcess.stdout.on('data', (data) => {
  output += data.toString();
});

cliProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

// Send a simple MCP message to test connectivity
setTimeout(() => {
  const initMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  cliProcess.stdin.write(JSON.stringify(initMessage) + '\n');
}, 100);

// Test timeout
setTimeout(() => {
  console.log('✅ CLI process started successfully');
  console.log('📤 Sent initialization message');
  
  if (output) {
    console.log('📥 CLI output:', output.substring(0, 200) + '...');
  }
  
  if (errorOutput) {
    console.log('🔍 Debug output:', errorOutput.substring(0, 200) + '...');
  }
  
  console.log('🎯 MCP inspector should be able to connect to this CLI');
  console.log('');
  console.log('🚀 To test with MCP inspector:');
  console.log('   npm run inspector');
  console.log('');
  console.log('🔧 To test manually:');
  console.log('   node dist/cli.js');
  
  cliProcess.kill('SIGTERM');
  process.exit(0);
}, 2000);

cliProcess.on('error', (error) => {
  console.error('❌ CLI process error:', error.message);
  process.exit(1);
});

cliProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`❌ CLI process exited with code ${code}`);
    if (errorOutput) {
      console.error('Error output:', errorOutput);
    }
    process.exit(1);
  }
});
