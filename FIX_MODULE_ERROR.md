# URGENT FIX - Module Export Error

## Error Message
```
Uncaught SyntaxError: The requested module '/src/types/resume.ts' does not provide an export named 'Certification'
```

## Root Cause
This is a **Vite dev server caching issue**. The exports exist but Vite's cache is stale.

## Solution - Run These Commands

### Option 1: Clear Vite Cache (RECOMMENDED)
```bash
# Stop the dev server first (Ctrl+C)
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Option 2: Complete Clean Restart
```bash
# Stop the dev server first (Ctrl+C)
cd frontend
rm -rf node_modules/.vite dist
npm run dev
```

### Option 3: Force Clear Browser Cache
After restarting server:
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## What This Does
- Deletes Vite's module cache in `node_modules/.vite`
- Forces Vite to re-analyze all TypeScript exports
- Rebuilds the module dependency graph

## Verification
After running the commands, you should see:
- No errors in browser console
- Resume builder app loads properly
- All form fields visible

## If Still Not Working
Try a nuclear option:
```bash
cd frontend
rm -rf node_modules node_modules/.vite dist package-lock.json
npm install
npm run dev
```

This completely reinstalls everything fresh.
