#!/usr/bin/env node

/**
 * Build validation script
 * Checks if the build was successful and all required files are present
 */

import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = dirname(__dirname);
const isPostInstall = process.argv.includes('--post-install');

console.log('🔍 Validating build...');

// Check if dist directory exists
const distPath = join(projectRoot, 'dist');
if (!existsSync(distPath)) {
  console.error('❌ dist/ directory not found.');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the dist directory');
    process.exit(0); // Don't fail post-install
  } else {
    console.error('   Run "npm run build" first.');
    process.exit(1);
  }
}

// Check if main entry point exists
const mainEntry = join(distPath, 'index.js');
if (!existsSync(mainEntry)) {
  console.error('❌ Main entry point dist/index.js not found.');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the entry point');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check if CLI entry point exists
const cliEntry = join(distPath, 'cli.js');
if (!existsSync(cliEntry)) {
  console.error('❌ CLI entry point dist/cli.js not found.');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the CLI entry point');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check if type definitions exist
const typeDefinitions = join(distPath, 'index.d.ts');
if (!existsSync(typeDefinitions)) {
  console.error('❌ Type definitions dist/index.d.ts not found.');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create type definitions');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check if all tool files exist
const toolsPath = join(distPath, 'tools');
if (!existsSync(toolsPath)) {
  console.error('❌ tools/ directory not found in dist/.');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the tools directory');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

const expectedTools = [
  'webSearch.js',
  'researchPaperSearch.js',
  'companyResearch.js',
  'crawling.js',
  'competitorFinder.js',
  'linkedInSearch.js',
  'wikipediaSearch.js',
  'githubSearch.js',
  'config.js'
];

const missingTools = expectedTools.filter(tool => !existsSync(join(toolsPath, tool)));
if (missingTools.length > 0) {
  console.error('❌ Missing tool files:', missingTools.join(', '));
  if (isPostInstall) {
    console.log('   Run "npm run build" to create all tool files');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check if auth directory exists
const authPath = join(distPath, 'auth');
if (!existsSync(authPath)) {
  console.error('❌ auth/ directory not found in dist/.');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the auth directory');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check if nango auth file exists
const nangoAuth = join(authPath, 'nango.js');
if (!existsSync(nangoAuth)) {
  console.error('❌ Nango authentication file not found: dist/auth/nango.js');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the auth files');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check if utils directory exists
const utilsPath = join(distPath, 'utils');
if (!existsSync(utilsPath)) {
  console.error('❌ utils/ directory not found in dist/.');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the utils directory');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check if logger utility exists
const loggerUtil = join(utilsPath, 'logger.js');
if (!existsSync(loggerUtil)) {
  console.error('❌ Logger utility not found: dist/utils/logger.js');
  if (isPostInstall) {
    console.log('   Run "npm run build" to create the logger utility');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// Check file sizes to ensure they're not empty
const criticalFiles = [
  { path: mainEntry, name: 'index.js' },
  { path: cliEntry, name: 'cli.js' },
  { path: nangoAuth, name: 'auth/nango.js' },
  { path: join(toolsPath, 'webSearch.js'), name: 'tools/webSearch.js' }
];

for (const file of criticalFiles) {
  const stats = statSync(file.path);
  if (stats.size === 0) {
    console.error(`❌ ${file.name} is empty. Build may have failed.`);
    if (isPostInstall) {
      console.log('   Run "npm run build" to rebuild the project');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

// Calculate total build size
const calculateDirSize = (dirPath) => {
  let totalSize = 0;
  const files = readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = join(dirPath, file.name);
    if (file.isDirectory()) {
      totalSize += calculateDirSize(filePath);
    } else {
      totalSize += statSync(filePath).size;
    }
  }
  
  return totalSize;
};

const distSize = calculateDirSize(distPath);
const formattedSize = (distSize / 1024).toFixed(2);

console.log('✅ Build validation successful!');
console.log(`📦 Build size: ${formattedSize} KB`);
console.log('📁 Generated files:');
console.log(`   - dist/index.js (${(statSync(mainEntry).size / 1024).toFixed(2)} KB)`);
console.log(`   - dist/cli.js (${(statSync(cliEntry).size / 1024).toFixed(2)} KB)`);
console.log(`   - dist/index.d.ts (${(statSync(typeDefinitions).size / 1024).toFixed(2)} KB)`);
console.log(`   - dist/auth/nango.js (${(statSync(nangoAuth).size / 1024).toFixed(2)} KB)`);
console.log(`   - dist/tools/ (${expectedTools.length} files)`);
console.log(`   - dist/utils/ (logger.js)`);

console.log('');
console.log('🚀 Ready to run:');
console.log('   npm start              (Run server function directly)');
console.log('   npm run start:cli      (Run CLI with MCP transport)');
console.log('   npm run inspector      (Run with MCP inspector)');
console.log('   exa-mcp-server         (Run globally installed CLI)');
console.log('');
console.log('📝 Next steps:');
console.log('   1. Configure your .env file with Nango credentials');
console.log('   2. Run: npm run inspector (for MCP inspector)');
console.log('   3. Or run: npm run start:cli (for CLI mode)');
