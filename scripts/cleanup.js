#!/usr/bin/env node

/**
 * Cleanup script for exa-mcp-server
 * Removes unwanted files and optimizes the codebase
 */

import { unlink, rmdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

console.log('🧹 Starting cleanup process...');

const filesToRemove = [
  // Obsolete files
  'smithery-example.json',
  'smithery.yaml',
  'Dockerfile',
  'scripts/test-direct-api.js',
  'scripts/post-install.js',
  
  // Build artifacts (will be regenerated)
  'build.sh',
  'build.bat',
  
  // Documentation that's no longer needed
  'CHANGES.md',
  'DIST_SETUP.md',
  'MIGRATION.md',
  'DEVELOPMENT.md',
  'NANGO_SETUP.md'
];

const directoriesToClean = [
  '.smithery',
  'build'
];

async function removeFile(filePath) {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`✅ Removed: ${filePath}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not remove ${filePath}: ${error.message}`);
  }
}

async function removeDirectory(dirPath) {
  try {
    if (existsSync(dirPath)) {
      await rmdir(dirPath, { recursive: true });
      console.log(`✅ Removed directory: ${dirPath}`);
    }
  } catch (error) {
    console.log(`⚠️  Could not remove directory ${dirPath}: ${error.message}`);
  }
}

async function cleanup() {
  console.log('🗑️  Removing obsolete files...');
  
  for (const file of filesToRemove) {
    await removeFile(file);
  }
  
  console.log('🗑️  Removing obsolete directories...');
  
  for (const dir of directoriesToClean) {
    await removeDirectory(dir);
  }
  
  console.log('');
  console.log('✅ Cleanup completed!');
  console.log('');
  console.log('📁 Project structure is now optimized:');
  console.log('   • Removed obsolete configuration files');
  console.log('   • Removed unnecessary build scripts');
  console.log('   • Removed redundant documentation');
  console.log('   • Kept essential files only');
  console.log('');
  console.log('🚀 Ready to use:');
  console.log('   npm run build');
  console.log('   npm run inspector');
}

cleanup().catch(console.error);
