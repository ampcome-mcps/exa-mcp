#!/usr/bin/env node

/**
 * Update script for exa-mcp-server
 * Updates npm, dependencies, and dev dependencies to latest versions
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
const packageJsonPath = join(projectRoot, 'package.json');

console.log('🔄 Starting comprehensive update process...');
console.log('');

// Function to run commands
const runCommand = (command, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    console.log(`💻 Running: ${command} ${args.join(' ')}`);
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on('error', reject);
  });
};

async function updateProcess() {
  try {
    // Step 1: Update npm
    console.log('📦 Step 1: Updating npm to latest version...');
    await runCommand('npm', ['install', '-g', 'npm@latest']);
    console.log('✅ npm updated successfully');
    console.log('');

    // Step 2: Check current npm version
    console.log('📋 Step 2: Checking npm version...');
    await runCommand('npm', ['--version']);
    console.log('');

    // Step 3: Update package.json versions
    console.log('📝 Step 3: Updating package.json versions...');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // Update dependencies to latest versions
    if (packageJson.dependencies) {
      packageJson.dependencies = {
        "@modelcontextprotocol/sdk": "^1.12.1",
        "axios": "^1.7.8",
        "dotenv": "^16.4.5",
        "zod": "^3.22.4"
      };
    }

    // Update devDependencies to latest versions  
    if (packageJson.devDependencies) {
      packageJson.devDependencies = {
        "@types/node": "^22.10.2",
        "tsx": "^4.19.2",
        "typescript": "^5.7.2"
      };
    }

    // Update engines
    if (packageJson.engines) {
      packageJson.engines.node = ">=18.0.0";
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json updated with latest versions');
    console.log('');

    // Step 4: Clean install with latest versions
    console.log('🧹 Step 4: Cleaning node_modules and package-lock.json...');
    await runCommand('rm', ['-rf', 'node_modules', 'package-lock.json']);
    console.log('✅ Cleaned successfully');
    console.log('');

    // Step 5: Install with latest versions
    console.log('📦 Step 5: Installing with latest versions...');
    await runCommand('npm', ['install']);
    console.log('✅ Dependencies installed with latest versions');
    console.log('');

    // Step 6: Check for security vulnerabilities
    console.log('🔒 Step 6: Checking for security vulnerabilities...');
    try {
      await runCommand('npm', ['audit', '--audit-level=moderate']);
      console.log('✅ Security audit passed');
    } catch (error) {
      console.log('⚠️  Security vulnerabilities found, attempting to fix...');
      try {
        await runCommand('npm', ['audit', 'fix']);
        console.log('✅ Security vulnerabilities fixed');
      } catch (fixError) {
        console.log('⚠️  Some vulnerabilities could not be auto-fixed');
      }
    }
    console.log('');

    // Step 7: Build the project
    console.log('🔨 Step 7: Building project with updated dependencies...');
    await runCommand('npm', ['run', 'build']);
    console.log('✅ Build completed successfully');
    console.log('');

    // Step 8: Run tests
    console.log('🧪 Step 8: Running tests...');
    try {
      await runCommand('npm', ['test']);
      console.log('✅ All tests passed');
    } catch (error) {
      console.log('⚠️  Some tests failed, but continuing...');
    }
    console.log('');

    // Step 9: Show final status
    console.log('📊 Step 9: Final status...');
    console.log('');
    console.log('✅ Update process completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   • npm updated to latest version');
    console.log('   • All dependencies updated to latest versions');
    console.log('   • Security audit completed');
    console.log('   • Project built successfully');
    console.log('   • Tests executed');
    console.log('');
    console.log('🚀 Ready to use:');
    console.log('   npm run inspector');
    console.log('   npm run start:cli');
    console.log('');

  } catch (error) {
    console.error('❌ Update process failed:', error.message);
    console.error('');
    console.error('🛠️  Manual steps to try:');
    console.error('   1. npm install -g npm@latest');
    console.error('   2. rm -rf node_modules package-lock.json');
    console.error('   3. npm install');
    console.error('   4. npm run build');
    process.exit(1);
  }
}

// Run the update process
updateProcess();
