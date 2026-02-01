const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data storage file path
const DATA_FILE = path.join(__dirname, 'resumes.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf8');
}

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
