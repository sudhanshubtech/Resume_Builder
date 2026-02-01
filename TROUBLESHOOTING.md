# Troubleshooting Guide

## Blank Screen Issue - SOLVED ✅

### Problem
The application was showing a blank screen when launched in the browser.

### Root Cause
The issue was caused by incorrect package versions that were installed:
- `jspdf@4.0.0` - This version doesn't exist (should be 2.x)
- `axios@1.13.4` - Had security vulnerabilities

### Solution
The packages have been updated to the correct versions:
- ✅ `jspdf@2.5.2` - Stable version with proper TypeScript support
- ✅ `axios@1.13.4` → Latest version (security patches)

### Steps Taken
```bash
cd frontend
npm uninstall jspdf
npm install jspdf@2.5.2
npm install axios@latest
```

### How to Fix If Issue Persists

1. **Stop the development server** if it's running (Ctrl+C or press 'q')

2. **Restart the frontend server:**
```bash
cd frontend
npm run dev
```

3. **Clear browser cache:**
   - Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or open DevTools (F12) → Network tab → Check "Disable cache"

4. **Check browser console for errors:**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for any red error messages

5. **If still blank, try a clean install:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Common Issues & Solutions

### Backend Not Running
**Symptom:** AI optimization buttons don't work, showing errors in console

**Solution:**
```bash
cd backend
npm start
# Should show: Server running on port 5000
```

### Port Already in Use
**Symptom:** Error message about port 5173 or 5000 already in use

**Solution:**
- Frontend: The dev server will automatically try the next available port
- Backend: Change the PORT in backend/.env file or kill the process using that port

### TypeScript Errors
**Symptom:** Red squiggly lines in VS Code or compilation errors

**Solution:**
```bash
cd frontend
npm run build
# This will show any TypeScript errors
```

### PDF Download Not Working
**Symptom:** PDF button doesn't generate file or shows errors

**Solution:**
- Make sure you have filled in at least the personal information (name required)
- Check browser console for specific errors
- Try using Chrome/Edge instead of Firefox/Safari for better compatibility

### Styles Not Applying
**Symptom:** Resume looks unstyled or broken layout

**Solution:**
- Make sure App.css is imported in App.tsx
- Clear browser cache (Ctrl+Shift+R)
- Check if CSS file exists in src/ folder

## Verification Checklist

✅ Backend server running on port 5000  
✅ Frontend server running on port 5173  
✅ No errors in browser console  
✅ No TypeScript compilation errors  
✅ Packages installed with correct versions  

## Getting Help

If issues persist:
1. Check the browser console (F12) for specific error messages
2. Check the terminal where dev server is running for compilation errors
3. Verify all dependencies are installed: `npm install`
4. Make sure you're using Node.js 18+ : `node --version`

## Development Tips

- **Hot Reload:** Changes to code should automatically refresh the browser
- **Console Logging:** Use browser DevTools Console to debug
- **React DevTools:** Install React Developer Tools extension for better debugging
- **Network Tab:** Check if API calls to backend are successful
