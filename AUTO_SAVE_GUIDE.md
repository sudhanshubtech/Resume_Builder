# Auto-Save & Auto-Load Feature 💾

## Overview
The Resume Builder now automatically saves and loads resume data based on email address. No manual save button needed!

## How It Works

### 🔄 Auto-Save
- **Primary Trigger**: When you exit any text field (onBlur)
- **Backup Trigger**: 30 seconds after you stop typing (debounced)
- **Requirement**: Valid email address entered (must contain @)
- **Storage**: Data is stored in `backend/resumes.json` with email as the key
- **Status Indicator**: Shows "Saving..." → "Saved" in the preview panel

### 📥 Auto-Load
- **Triggers**: Automatically loads when you exit the email field (onBlur)
- **Detection**: Activates when email contains @ symbol and you click/tab away
- **Behavior**: Fills all form fields with previously saved data
- **Smart Loading**: Only loads once per unique email (avoids duplicate API calls)
- **Sequential**: On email blur: Load first, then save (to preserve any pending changes)
- **Silent**: Loads in background without interrupting your workflow

## Features

### ✅ What Gets Saved
- Personal Information (name, email, phone, location, links)
- Professional Summary
- Work Experience (all entries)
- Education (all entries)
- Skills
- Projects (optional)
- Certifications (optional)
- Last Modified timestamp

### 🎯 Key Benefits
1. **No Data Loss**: Your work is automatically preserved
2. **Multi-Device**: Access your resume from any device (same network)
3. **Version Control**: Always works with the latest version
4. **Email-Based**: No login required, just use your email

## Usage Instructions

### Creating a New Resume
1. Enter your email address in the Personal Information section
2. **Tab out or click away** from the email field to trigger save
3. Fill in your resume details
4. **Click outside each field** when done to save immediately
5. Or just keep typing - backup auto-save triggers after 30 seconds
6. Watch for the "Saved" indicator to confirm

### Loading an Existing Resume
1. Enter the same email address you used before
2. **Click outside the email field** or press Tab
3. System will:
   - First: Load your existing resume data
   - Then: Save any changes you had made
4. All fields automatically populate
5. Continue editing - saves on field exit or after 30 seconds

### Using Multiple Resumes
- Use different email addresses for different resumes
- Example:
  - `john@tech.com` - Technical resume
  - `john@creative.com` - Creative resume
  - `john+freelance@email.com` - Freelance resume

## API Endpoints

### Save Resume
```
POST /api/resume/save
Body: {
  email: string,
  data: ResumeData
}
```

### Load Resume
```
GET /api/resume/load/:email
```

### Delete Resume (Advanced)
```
DELETE /api/resume/delete/:email
```

## Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| 💾 (spinning) | Saving... | Data is being saved to server |
| ✅ | Saved | Data successfully saved |
| ❌ | Failed to save | Error occurred (check console) |

## Data Storage

### Location
- File: `backend/resumes.json`
- Format: JSON
- Structure:
```json
{
  "user@example.com": {
    "personalInfo": { ... },
    "summary": "...",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "lastModified": "2026-01-27T..."
  }
}
```

### Privacy & Security
- ⚠️ **Local Storage Only**: Data is stored locally on your server
- 🔒 **Not Encrypted**: Sensitive data should not be used in production
- 📁 **File-Based**: Simple JSON file for easy access and backup
- 🚫 **Not Git-Tracked**: `resumes.json` is in `.gitignore`

## Troubleshooting

### Data Not Saving
1. Check if backend server is running (`http://localhost:5000`)
2. Verify email contains @ symbol
3. Check browser console for errors
4. Ensure `backend/resumes.json` file exists (created automatically)

### Data Not Loading
1. Verify exact email address (case-insensitive)
2. Check if data was previously saved for that email
3. Backend server must be running
4. Check network tab in DevTools for API errors

### Manual Data Recovery
If needed, you can manually access the data:
```bash
cd backend
cat resumes.json
# Pretty print
node -e "console.log(JSON.stringify(require('./resumes.json'), null, 2))"
```

### Backup Your Data
```bash
# Create backup
cp backend/resumes.json backend/resumes.backup.json

# Restore from backup
cp backend/resumes.backup.json backend/resumes.json
```

## Development Notes

### Auto-Save Debounce
- Primary: Save on field blur (immediate when exiting field)
- Backup: 30 seconds after last change (if you don't exit field)
- Modify in `App.tsx` line ~40 if needed

### Email Field Special Behavior
- On blur: Load resume FIRST, then save
- Ensures data integrity when switching between resumes
- Prevents data loss from unsaved changes

### Email Validation
- Simple check: contains @
- Case-insensitive storage
- Modify validation as needed

### Extending Storage
Want to use a database instead?
1. Replace file operations in `backend/server.js`
2. Use MongoDB, PostgreSQL, or other DB
3. Keep API endpoints the same
4. Frontend requires no changes!

## Production Recommendations

For production deployment:
1. ✅ Use a proper database (MongoDB, PostgreSQL)
2. ✅ Add authentication (JWT tokens)
3. ✅ Encrypt sensitive data
4. ✅ Add rate limiting
5. ✅ Implement user accounts
6. ✅ Add data validation
7. ✅ Use HTTPS
8. ✅ Add backup system

## Advanced Features (Future)

Possible enhancements:
- [ ] Multiple versions per email
- [ ] Export/Import JSON
- [ ] Collaborative editing
- [ ] Cloud storage integration
- [ ] Email verification
- [ ] Share resume via link
- [ ] Revision history

---

**Note**: This is a local development feature. For production use, implement proper authentication and database storage.
