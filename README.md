# Professional Resume Builder 🚀

A modern, feature-rich resume builder with AI-powered content optimization, multiple professional templates, real-time preview, and PDF export capabilities.

![Resume Builder](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)

## ✨ Features

### 📤 Resume Upload & Auto-Fill (NEW!)
- **Upload Existing Resumes**: Import your current resume in PDF or Word format
- **Intelligent Parsing**: Automatically extracts personal info, experience, education, skills, and more
- **AI-Powered Option**: Use OpenAI for highly accurate parsing (optional)
- **Drag & Drop**: Beautiful drag-and-drop interface with visual feedback
- **Time Saver**: Skip manual data entry - just upload and edit

### 📥 Multiple Export Formats (NEW!)
- **PDF Export**: Generate professional PDF resumes with optimized layouts
- **Word Export**: Download as .docx format for easy manual editing
- **Page Break Control**: Ensures sections don't split awkwardly across pages
- **Manual Editing**: Word format allows you to fix any layout issues manually

### 🔄 Auto-Save & Auto-Load
- **Automatic Saving**: Your resume saves when you exit each field
- **Backup Save**: Also saves 30 seconds after you stop typing
- **Email-Based**: Data is saved and loaded using your email address
- **No Login Required**: Just enter your email and your data persists
- **Visual Feedback**: Real-time save status indicator

### 🎨 Multiple Professional Templates
- **Modern**: Clean and contemporary design with vibrant colors
- **Classic**: Traditional professional layout for conservative industries
- **Minimal**: Simple and elegant typography-focused design
- **Creative**: Unique sidebar layout with gradient styling
- **Professional**: Two-column layout with gray sidebar (NEW!)

### 🤖 AI-Powered Optimization
- Optimize professional summary with AI
- Enhance work experience descriptions
- Improve content clarity and impact
- Make achievements more quantifiable

### 📝 Comprehensive Resume Sections
- Personal Information (with social links)
- Professional Summary
- Work Experience (with current position tracking)
- Education (with GPA)
- Skills (tag-based display)
- Projects (optional, with tech stack)
- Certifications (optional, with credential IDs)

### 👁️ Real-Time Preview
- Live preview of your resume as you type
- Switch between templates instantly
- See exactly how your resume will look

### 📥 PDF Export
- High-quality PDF generation
- Professional formatting preserved
- Ready to send to employers

### 💎 Modern UI/UX
- Beautiful gradient header
- Intuitive form interface
- Responsive design
- Smooth animations and transitions
- Auto-save status indicators

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Icons** for beautiful icons
- **jsPDF & html2canvas** for PDF generation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **OpenAI API** integration (optional)
- **CORS** enabled for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Clone the Repository
```bash
git clone <your-repo-url>
cd Resume_Builder
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Install Backend Dependencies
```bash
cd ../backend
npm install
```

## 🚀 Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Open in Browser
Navigate to `http://localhost:5173` to use the application.

## ⚙️ Configuration

### AI Optimization (Optional)

To enable real AI-powered content optimization:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)

2. Create a `.env` file in the `backend` directory:
```env
PORT=5000
OPENAI_API_KEY=your_api_key_here
```

3. Uncomment the OpenAI integration code in `backend/server.js` (lines 22-54)

**Note**: The application works without an API key using mock optimization for demonstration purposes.

## 📖 Usage Guide

### 1. Upload Existing Resume (Optional)
- **NEW!** Upload your current resume in PDF or Word format
- Drag and drop or click to select your resume file
- The app will automatically extract and fill in your information
- Review and edit the auto-filled data as needed
- See [UPLOAD_FEATURE_GUIDE.md](./UPLOAD_FEATURE_GUIDE.md) for details

### 2. Enter Personal Information
- Fill in your name, email, phone, and location
- **Important**: Enter a valid email address to enable auto-save
- Add optional links (LinkedIn, GitHub, Portfolio)
- Your data will automatically save and load based on your email

### 3. Write Professional Summary
- Craft a compelling summary of your professional background
- Click "Optimize with AI" to enhance it

### 4. Add Work Experience
- Click "Add Experience" to create entries
- Fill in position, company, dates, and description
- Use the optimize button for each description
- Check "Currently working here" for current roles

### 5. Add Education
- Include your degrees, institutions, and dates
- Optionally add GPA

### 6. List Skills
- Enter comma-separated skills
- They'll appear as professional tags

### 7. Add Projects & Certifications (Optional)
- Showcase relevant projects with tech stacks
- Include professional certifications

### 8. Choose Template
- Select from 4 professional templates
- Preview updates in real-time

### 9. Download Your Resume
- **PDF Format**: Click "Download as PDF" for a professional PDF version
- **Word Format**: Click "Download as Word" for an editable .docx file
- **Word format benefits**:
  - Easy manual editing and formatting adjustments
  - Compatible with all word processors (MS Word, Google Docs, etc.)
  - Full control over page breaks and section placement
  - Can be further customized to your specific needs
- High-quality exports generated instantly

### 10. Resume Persistence
- Your resume automatically saves as you type
- Return anytime - just enter the same email
- Data persists between sessions
- See [AUTO_SAVE_GUIDE.md](./AUTO_SAVE_GUIDE.md) for details

## 🎯 Tips for Best Results

### Content Writing
- Use action verbs (achieved, led, developed, implemented)
- Include quantifiable results (increased by 30%, reduced time by 50%)
- Be specific about technologies and tools used
- Keep descriptions concise but impactful

### Template Selection
- **Modern**: Tech industry, startups, creative roles
- **Classic**: Finance, law, academic positions
- **Minimal**: Design, writing, consulting
- **Creative**: Marketing, UX/UI, project management
- **Professional**: Corporate, executive, business development

## 📁 Project Structure

```
Resume_Builder/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ResumeEditor/
│   │   │   │   └── ResumeEditor.tsx
│   │   │   ├── ResumePreview/
│   │   │   │   └── ResumePreview.tsx
│   │   │   └── templates/
│   │   │       ├── ModernTemplate.tsx
│   │   │       ├── ClassicTemplate.tsx
│   │   │       ├── MinimalTemplate.tsx
│   │   │       └── CreativeTemplate.tsx
│   │   ├── types/
│   │   │   └── resume.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
│
└── backend/
    ├── server.js
    └── package.json
```

## 🔧 Customization

### Adding New Templates
1. Create a new template component in `frontend/src/components/templates/`
2. Import it in `ResumePreview.tsx`
3. Add the template to the switch statement
4. Add CSS styles in `App.css`
5. Update the template selector in `App.tsx`

### Styling
- All styles are in `App.css` with CSS variables for easy theming
- Modify CSS variables at the root to change the color scheme
- Each template has its own scoped styles

## 🐛 Troubleshooting

### Backend won't start
- Ensure port 5000 is not in use
- Check Node.js version (18+ required)
- Run `npm install` in backend directory

### Frontend won't start
- Ensure port 5173 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### PDF not generating
- Check browser console for errors
- Ensure resume has content before downloading
- Try a different browser (Chrome/Edge recommended)

### AI optimization not working
- Verify backend server is running
- Check backend URL in frontend code (default: localhost:5000)
- If using real AI, verify OpenAI API key is valid

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Add Procfile: web: node server.js
# Deploy to your platform of choice
```

### Environment Variables
Remember to set these in production:
- `OPENAI_API_KEY` (if using real AI)
- `PORT` (backend)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for helping professionals create amazing resumes.

## 🌟 Features Roadmap

- [x] Auto-save & auto-load resume data
- [x] Resume upload & auto-fill (PDF and Word formats)
- [ ] Multiple resume versions per email
- [ ] Export/Import JSON data
- [ ] More template options
- [ ] Custom color schemes
- [ ] Export to Word format
- [ ] Resume analytics and ATS optimization
- [ ] Multi-language support
- [ ] Cover letter generator
- [ ] Cloud storage integration

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Resume Building! 🎉**
