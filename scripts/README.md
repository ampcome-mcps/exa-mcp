# Build Scripts

This directory contains build and validation scripts for the exa-mcp-server project.

## validate-build.js

Validates that the TypeScript build was successful by checking:

- ✅ All required files exist in `dist/`
- ✅ Files are not empty
- ✅ Proper directory structure
- ✅ Build statistics and file sizes

### Usage

```bash
# Run validation after build
npm run validate

# Or run directly
node scripts/validate-build.js
```

### What it checks

1. **Main entry point**: `dist/index.js` and `dist/index.d.ts`
2. **Authentication**: `dist/auth/nango.js`
3. **Tools**: All 8 tool files in `dist/tools/`
4. **Utilities**: `dist/utils/logger.js`
5. **File integrity**: Ensures files are not empty
6. **Build size**: Reports total build size

### Output

```
🔍 Validating build...
✅ Build validation successful!
📦 Build size: 45.67 KB
📁 Generated files:
   - dist/index.js (12.34 KB)
   - dist/index.d.ts (2.45 KB)
   - dist/auth/nango.js (3.21 KB)
   - dist/tools/ (9 files)
   - dist/utils/ (logger.js)

🚀 Ready to run:
   npm start              (Run compiled server)
   npm run dev            (Run in development mode)
```

## Adding New Scripts

To add new build scripts:

1. Create the script file in this directory
2. Make it executable: `chmod +x script-name.js`
3. Add to package.json scripts section
4. Document in this README
