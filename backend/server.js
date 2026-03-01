const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

// Data storage file path
const DATA_FILE = path.join(__dirname, 'resumes.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf8');
}

// Upload and parse resume endpoint
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let extractedText = '';
    
    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await PDFParse(req.file.buffer);
      extractedText = pdfData.text;
    } else if (
      req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      req.file.mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = result.value;
    }

    // Parse the extracted text into structured data
    const parsedData = process.env.OPENAI_API_KEY 
      ? await parseResumeWithAI(extractedText)
      : parseResumeText(extractedText);
    
    res.json({ 
      success: true, 
      data: parsedData
    });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to parse resume', details: error.message });
  }
});

// AI Optimization endpoint
app.post('/api/optimize', async (req, res) => {
  try {
    const { content, type } = req.body;
    
    // Mock AI optimization (replace with actual OpenAI API call if you have a key)
    const optimizedContent = await optimizeContent(content, type);
    
    res.json({ optimizedContent });
  } catch (error) {
    console.error('Error optimizing content:', error);
    res.status(500).json({ error: 'Failed to optimize content' });
  }
});

// Save resume data endpoint
app.post('/api/resume/save', async (req, res) => {
  try {
    const { email, data } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Read existing data
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const resumes = JSON.parse(fileContent);
    
    // Save resume with email as key
    resumes[email.toLowerCase()] = {
      ...data,
      lastModified: new Date().toISOString()
    };
    
    // Write back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(resumes, null, 2), 'utf8');
    
    res.json({ success: true, message: 'Resume saved successfully' });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Load resume data endpoint
app.get('/api/resume/load/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Read existing data
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const resumes = JSON.parse(fileContent);
    
    const resumeData = resumes[email.toLowerCase()];
    
    if (resumeData) {
      res.json({ success: true, data: resumeData });
    } else {
      res.json({ success: false, message: 'No resume found for this email' });
    }
  } catch (error) {
    console.error('Error loading resume:', error);
    res.status(500).json({ error: 'Failed to load resume' });
  }
});

// Delete resume data endpoint (optional)
app.delete('/api/resume/delete/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Read existing data
    const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
    const resumes = JSON.parse(fileContent);
    
    if (resumes[email.toLowerCase()]) {
      delete resumes[email.toLowerCase()];
      fs.writeFileSync(DATA_FILE, JSON.stringify(resumes, null, 2), 'utf8');
      res.json({ success: true, message: 'Resume deleted successfully' });
    } else {
      res.json({ success: false, message: 'No resume found for this email' });
    }
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// Mock optimization function
async function optimizeContent(content, type) {
  // If you have an OpenAI API key, uncomment this section:
  /*
  const { OpenAI } = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompts = {
    summary: 'Rewrite this professional summary to be more impactful and concise, highlighting key strengths and achievements:',
    experience: 'Improve this work experience description to be more achievement-focused and quantifiable:',
    skills: 'Organize and enhance this skills list to be more professional and relevant:',
    education: 'Refine this education entry to highlight key achievements and relevant coursework:'
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a professional resume writer helping to optimize resume content.'
      },
      {
        role: 'user',
        content: `${prompts[type] || prompts.summary}\n\n${content}`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content;
  */

  // Mock optimization for demo purposes
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const optimizations = {
    summary: `${content}\n\nEnhanced with strong action verbs and quantifiable achievements. Results-driven professional with proven track record of exceeding expectations.`,
    experience: `• ${content}\n• Achieved measurable results through strategic planning and execution\n• Collaborated with cross-functional teams to drive innovation`,
    skills: content.split(',').map(s => s.trim()).filter(Boolean).join(' • '),
    education: `${content}\n• Relevant coursework aligned with industry standards\n• Demonstrated academic excellence and leadership`
  };

  return optimizations[type] || `Optimized: ${content}`;
}

// Resume parsing function using pattern matching
function parseResumeText(text) {
  const resumeData = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: []
  };

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) resumeData.personalInfo.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) resumeData.personalInfo.phone = phoneMatch[0];

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) resumeData.personalInfo.linkedin = 'https://' + linkedinMatch[0];

  // Extract GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) resumeData.personalInfo.github = 'https://' + githubMatch[0];

  // Extract portfolio/website
  const portfolioMatch = text.match(/(?:portfolio|website)[:\s]+([^\s\n]+)/i);
  if (portfolioMatch) resumeData.personalInfo.portfolio = portfolioMatch[1];

  // Extract name (first line, typically)
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Skip if first line looks like a header or contains common keywords
    if (firstLine.length < 50 && !firstLine.toLowerCase().includes('resume') && !firstLine.toLowerCase().includes('curriculum')) {
      resumeData.personalInfo.fullName = firstLine;
    }
  }

  // Extract location (common patterns)
  const locationMatch = text.match(/(?:Address|Location)[:\s]+([^\n]+)/i) || 
                        text.match(/([A-Z][a-z]+,\s*[A-Z]{2}\s*\d{5})/);
  if (locationMatch) resumeData.personalInfo.location = locationMatch[1].trim();

  // Extract skills (look for common skills section headers)
  const skillsMatch = text.match(/(?:Skills|Technical Skills|Core Competencies|Expertise)[:\s]+([^\n]*(?:\n(?!\n|[A-Z][a-z]+:)[^\n]*)*)/i);
  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    const skills = skillsText
      .split(/[,•|·\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 50 && !s.toLowerCase().includes('experience') && !s.toLowerCase().includes('education'));
    resumeData.skills = [...new Set(skills)].slice(0, 20); // Remove duplicates, limit to 20
  }

  // Extract summary/objective
  const summaryMatch = text.match(/(?:Summary|Professional Summary|Objective|Profile|About)[:\s]+([^\n]*(?:\n(?!\n|[A-Z][a-z]+:)[^\n]*){0,5})/i);
  if (summaryMatch) {
    resumeData.summary = summaryMatch[1].trim().replace(/\s+/g, ' ');
  }

  // Extract experience (basic pattern matching)
  const experienceSection = text.match(/(?:Experience|Work Experience|Professional Experience|Employment)[:\s]+([^\n]*(?:\n(?!(?:Education|Skills|Projects|Certifications)[:\s])[^\n]*)*)/i);
  if (experienceSection) {
    const expText = experienceSection[1];
    // Try to identify job entries by date patterns
    const datePattern = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|Present|Current|\d{4})/gi;
    const dates = [...expText.matchAll(datePattern)];
    
    if (dates.length > 0) {
      dates.forEach((dateMatch, index) => {
        const startIdx = dateMatch.index;
        const endIdx = dates[index + 1] ? dates[index + 1].index : expText.length;
        const entry = expText.substring(startIdx, endIdx).trim();
        
        if (entry) {
          const lines = entry.split('\n').filter(l => l.trim());
          const dateStr = dateMatch[0];
          const position = lines[0] ? lines[0].replace(dateStr, '').trim() : '';
          const company = lines[1] ? lines[1].trim() : '';
          const description = lines.slice(2).join('\n').trim();
          
          resumeData.experience.push({
            id: Date.now().toString() + index,
            company: company,
            position: position,
            location: '',
            startDate: '',
            endDate: '',
            current: dateStr.toLowerCase().includes('present') || dateStr.toLowerCase().includes('current'),
            description: description || entry
          });
        }
      });
    } else {
      // Fallback: split by double newlines
      const entries = expText.split(/\n\s*\n/).filter(e => e.trim());
      entries.forEach((entry, index) => {
        if (entry.trim() && entry.length > 10) {
          resumeData.experience.push({
            id: Date.now().toString() + index,
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: entry.trim()
          });
        }
      });
    }
  }

  // Extract education
  const educationSection = text.match(/(?:Education|Academic Background)[:\s]+([^\n]*(?:\n(?!(?:Experience|Skills|Projects|Certifications)[:\s])[^\n]*)*)/i);
  if (educationSection) {
    const eduText = educationSection[1];
    const datePattern = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|Present|Current|\d{4})/gi;
    const dates = [...eduText.matchAll(datePattern)];
    
    if (dates.length > 0) {
      dates.forEach((dateMatch, index) => {
        const startIdx = dateMatch.index;
        const endIdx = dates[index + 1] ? dates[index + 1].index : eduText.length;
        const entry = eduText.substring(startIdx, endIdx).trim();
        
        if (entry) {
          const lines = entry.split('\n').filter(l => l.trim());
          const degree = lines[0] ? lines[0].replace(dateMatch[0], '').trim() : '';
          const institution = lines[1] ? lines[1].trim() : '';
          
          // Try to extract GPA
          const gpaMatch = entry.match(/GPA[:\s]+([0-9.]+)/i);
          
          resumeData.education.push({
            id: Date.now().toString() + index,
            institution: institution,
            degree: degree,
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: gpaMatch ? gpaMatch[1] : ''
          });
        }
      });
    }
  }

  // Extract certifications
  const certificationsSection = text.match(/(?:Certifications|Certificates|Professional Certifications)[:\s]+([^\n]*(?:\n(?!(?:Experience|Education|Skills|Projects)[:\s])[^\n]*)*)/i);
  if (certificationsSection) {
    const certText = certificationsSection[1];
    const entries = certText.split(/\n/).filter(e => e.trim() && e.length > 5);
    
    entries.forEach((entry, index) => {
      const dateMatch = entry.match(/\d{4}/);
      const name = entry.replace(/\d{4}/, '').replace(/[-–—,]/, '').trim();
      
      if (name) {
        resumeData.certifications.push({
          id: Date.now().toString() + index,
          name: name,
          issuer: '',
          date: dateMatch ? dateMatch[0] : '',
          credentialId: ''
        });
      }
    });
  }

  // Extract projects
  const projectsSection = text.match(/(?:Projects|Personal Projects|Portfolio)[:\s]+([^\n]*(?:\n(?!(?:Experience|Education|Skills|Certifications)[:\s])[^\n]*)*)/i);
  if (projectsSection) {
    const projText = projectsSection[1];
    const entries = projText.split(/\n\s*\n/).filter(e => e.trim());
    
    entries.forEach((entry, index) => {
      const lines = entry.split('\n').filter(l => l.trim());
      const name = lines[0] ? lines[0].trim() : '';
      const description = lines.slice(1).join(' ').trim();
      
      // Try to extract technologies
      const techMatch = entry.match(/(?:Technologies|Tech Stack|Built with)[:\s]+([^\n]+)/i);
      const technologies = techMatch 
        ? techMatch[1].split(/[,|]/).map(t => t.trim()).filter(t => t)
        : [];
      
      if (name) {
        resumeData.projects.push({
          id: Date.now().toString() + index,
          name: name,
          description: description,
          technologies: technologies,
          link: ''
        });
      }
    });
  }

  return resumeData;
}

// AI-based resume parsing (optional, requires OpenAI API key)
async function parseResumeWithAI(text) {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `Parse the following resume text and extract structured information in JSON format. Return ONLY valid JSON with this exact structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "portfolio": "",
    "github": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY",
      "gpa": ""
    }
  ],
  "skills": [],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "credentialId": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "link": ""
    }
  ]
}

Resume text:
${text}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a resume parsing assistant. Extract structured data from resumes and return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    
    // Add IDs to arrays
    if (parsed.experience) {
      parsed.experience = parsed.experience.map((exp, i) => ({
        ...exp,
        id: Date.now().toString() + i,
        current: exp.endDate?.toLowerCase() === 'present' || exp.endDate?.toLowerCase() === 'current'
      }));
    }
    
    if (parsed.education) {
      parsed.education = parsed.education.map((edu, i) => ({
        ...edu,
        id: Date.now().toString() + i
      }));
    }
    
    if (parsed.certifications) {
      parsed.certifications = parsed.certifications.map((cert, i) => ({
        ...cert,
        id: Date.now().toString() + i
      }));
    }
    
    if (parsed.projects) {
      parsed.projects = parsed.projects.map((proj, i) => ({
        ...proj,
        id: Date.now().toString() + i
      }));
    }

    return parsed;
  } catch (error) {
    console.error('AI parsing failed, falling back to regex parsing:', error);
    // Fallback to regex parsing if AI fails
    return parseResumeText(text);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
