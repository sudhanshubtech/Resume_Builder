import { useState, useEffect } from 'react';
import type { ResumeData, TemplateType } from './types/resume';
import { ResumeEditor } from './components/ResumeEditor/ResumeEditor';
import { ResumePreview } from './components/ResumePreview/ResumePreview';
import { ResumeUpload } from './components/ResumeUpload/ResumeUpload';
import { FaDownload, FaFileAlt, FaSave, FaCheckCircle, FaFileWord } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { generateWordDocument } from './utils/wordExport';
import './App.css';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
};

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [downloading, setDownloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastLoadedEmail, setLastLoadedEmail] = useState<string>('');

  // Auto-save after changes (debounced) - backup mechanism
  useEffect(() => {
    const email = resumeData.personalInfo.email;
    
    if (email && email.includes('@')) {
      const timer = setTimeout(() => {
        saveResume();
      }, 30000); // Save 30 seconds after last change as backup

      return () => clearTimeout(timer);
    }
  }, [resumeData]);

  const saveResume = async () => {
    const email = resumeData.personalInfo.email;
    
    if (!email || !email.includes('@')) {
      return;
    }

    setSaveStatus('saving');

    try {
      await axios.post('http://localhost:5000/api/resume/save', {
        email,
        data: resumeData,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const loadResume = async (email: string) => {
    // Don't load if it's the same email we just loaded
    if (email === lastLoadedEmail) {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/resume/load/${encodeURIComponent(email)}`);
      
      if (response.data.success && response.data.data) {
        const loadedData = response.data.data;
        // Remove lastModified before setting state
        const { lastModified, ...resumeDataOnly } = loadedData;
        setResumeData(resumeDataOnly);
        setLastLoadedEmail(email);
        console.log('Resume loaded successfully for:', email);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleEmailBlur = async () => {
    const email = resumeData.personalInfo.email;
    if (email && email.includes('@')) {
      // First, load resume if it's a different email
      if (email !== lastLoadedEmail) {
        await loadResume(email);
      }
      // Then save the current state
      await saveResume();
    }
  };

  const handleFieldBlur = () => {
    // Save when exiting any field (if email is valid)
    const email = resumeData.personalInfo.email;
    if (email && email.includes('@')) {
      saveResume();
    }
  };

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleUploadedData = (parsedData: ResumeData) => {
    // Merge parsed data with existing data, giving preference to parsed data
    setResumeData({
      personalInfo: {
        ...resumeData.personalInfo,
        ...parsedData.personalInfo,
      },
      summary: parsedData.summary || resumeData.summary,
      experience: parsedData.experience.length > 0 ? parsedData.experience : resumeData.experience,
      education: parsedData.education.length > 0 ? parsedData.education : resumeData.education,
      skills: parsedData.skills.length > 0 ? parsedData.skills : resumeData.skills,
      certifications: parsedData.certifications && parsedData.certifications.length > 0 
        ? parsedData.certifications 
        : resumeData.certifications,
      projects: parsedData.projects && parsedData.projects.length > 0 
        ? parsedData.projects 
        : resumeData.projects,
    });
  };

  const templates: { value: TemplateType; label: string; description: string }[] = [
    { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
    { value: 'classic', label: 'Classic', description: 'Traditional professional layout' },
    { value: 'minimal', label: 'Minimal', description: 'Simple and elegant' },
    { value: 'creative', label: 'Creative', description: 'Unique sidebar layout' },
    { value: 'professional', label: 'Professional', description: 'Two-column with gray sidebar' },
  ];

  const handleDownloadWord = async () => {
    setDownloading(true);
    try {
      await generateWordDocument(resumeData, selectedTemplate);
    } catch (error) {
      console.error('Error generating Word document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to generate Word document: ${errorMessage}\n\nPlease check the browser console for details.`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('resume-preview');
      if (!element) return;

      // PDF dimensions (A4)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true, // Enable PDF compression
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10; // margin in mm
      const contentWidth = pageWidth - (2 * margin);
      const pageContentHeight = pageHeight - (2 * margin);
      
      // Capture the entire resume with optimized settings for smaller file size
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size while maintaining quality
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        backgroundColor: '#ffffff', // Ensure white background
      });

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      // Get all sections to identify good break points
      const sections = Array.from(element.querySelectorAll('.section, .section-classic, .section-minimal, .section-creative, .header, .header-classic, .header-minimal, .creative-layout'));
      const sectionBreakPoints: number[] = [0]; // Start of document
      
      // Calculate the Y position of each section in mm
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = rect.top - elementRect.top + element.scrollTop;
        const sectionYInMm = (relativeTop / element.scrollHeight) * imgHeight;
        
        // Only add if it's not too close to an existing break point (at least 30mm apart)
        const tooCloseToExisting = sectionBreakPoints.some(bp => Math.abs(bp - sectionYInMm) < 30);
        if (!tooCloseToExisting && sectionYInMm > 20) { // Skip very early sections
          sectionBreakPoints.push(sectionYInMm);
        }
      });
      
      sectionBreakPoints.sort((a, b) => a - b);
      
      // Try to fit in 2-3 pages by scaling if needed
      const totalPages = Math.ceil(imgHeight / pageContentHeight);
      let scale = 1;
      
      // If more than 3 pages, try to compress
      if (totalPages > 3) {
        scale = (3 * pageContentHeight) / imgHeight;
        // Don't scale below 0.65 to maintain readability
        scale = Math.max(scale, 0.65);
      }

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      const scaledContentHeight = pageContentHeight;
      
      let yPosition = 0;
      let pageNumber = 0;
      const usedBreakPoints: number[] = [];

      while (yPosition < scaledHeight) {
        if (pageNumber > 0) {
          pdf.addPage();
        }

        // Calculate the ideal next break point
        let nextYPosition = yPosition + scaledContentHeight;
        
        // If not the last page, try to find a good section break point
        if (nextYPosition < scaledHeight) {
          // Find section break points within a reasonable range of the ideal break
          const searchRangeStart = (nextYPosition - 40) / scale; // 40mm before ideal
          const searchRangeEnd = (nextYPosition + 10) / scale;   // 10mm after ideal
          
          const candidateBreaks = sectionBreakPoints.filter(bp => 
            bp > searchRangeStart && 
            bp < searchRangeEnd && 
            bp * scale > yPosition + 50 && // At least 50mm of content
            !usedBreakPoints.includes(bp)
          );
          
          if (candidateBreaks.length > 0) {
            // Use the break point closest to the ideal position
            const bestBreak = candidateBreaks.reduce((prev, curr) => 
              Math.abs(curr * scale - nextYPosition) < Math.abs(prev * scale - nextYPosition) ? curr : prev
            );
            nextYPosition = bestBreak * scale;
            usedBreakPoints.push(bestBreak);
          }
        }
        
        // Ensure we don't exceed the total height
        nextYPosition = Math.min(nextYPosition, scaledHeight);
        
        const sourceY = yPosition / scale;
        const sourceHeight = (nextYPosition - yPosition) / scale;
        
        // Create a temporary canvas for this page section
        const pageCanvas = document.createElement('canvas');
        const pageContext = pageCanvas.getContext('2d');
        
        const sourceWidthPx = canvas.width;
        const sourceHeightPx = (sourceHeight / imgHeight) * canvas.height;
        const sourceYPx = (sourceY / imgHeight) * canvas.height;
        
        pageCanvas.width = sourceWidthPx;
        pageCanvas.height = sourceHeightPx;
        
        if (pageContext) {
          pageContext.drawImage(
            canvas,
            0, sourceYPx,
            sourceWidthPx, sourceHeightPx,
            0, 0,
            sourceWidthPx, sourceHeightPx
          );
          
          // Use JPEG with compression instead of PNG for much smaller file size
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.85); // 0.85 quality provides good balance
          const displayHeight = sourceHeight * scale;
          
          pdf.addImage(
            pageImgData,
            'JPEG',
            margin,
            margin,
            scaledWidth,
            displayHeight,
            undefined,
            'FAST' // Use FAST compression for smaller file size
          );
        }

        yPosition = nextYPosition;
        pageNumber++;
        
        // Safety limit
        if (pageNumber >= 5) break;
      }

      pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <FaFileAlt className="logo-icon" />
            <h1>Professional Resume Builder</h1>
          </div>
          <p className="tagline">Create stunning resumes with AI-powered optimization</p>
        </div>
      </header>

      {/* Template Selector at Top */}
      <div className="top-template-selector">
        <div className="template-selector-wrapper">
          <label className="control-label">Choose Template:</label>
          <div className="template-grid">
            {templates.map((template) => (
              <button
                key={template.value}
                onClick={() => setSelectedTemplate(template.value)}
                className={`template-btn ${selectedTemplate === template.value ? 'active' : ''}`}
              >
                <strong>{template.label}</strong>
                <span className="template-desc">{template.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="app-container">
        <div className="editor-panel">
          <ResumeUpload onDataParsed={handleUploadedData} />
          <ResumeEditor 
            data={resumeData} 
            onChange={handleDataChange} 
            onEmailBlur={handleEmailBlur}
            onFieldBlur={handleFieldBlur}
          />
        </div>

        <div className="preview-panel">
          <div className="preview-controls">
            {/* Save Status Indicator */}
            {resumeData.personalInfo.email && resumeData.personalInfo.email.includes('@') && (
              <div className="save-status">
                {saveStatus === 'saving' && (
                  <span className="status-saving">
                    <FaSave className="spinner" /> Saving...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="status-saved">
                    <FaCheckCircle /> Saved
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="status-error">
                    Failed to save
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleDownloadPDF}
              disabled={downloading || !resumeData.personalInfo.fullName}
              className="download-btn"
            >
              <FaDownload />
              {downloading ? 'Generating PDF...' : 'Download as PDF'}
            </button>

            <button
              onClick={handleDownloadWord}
              disabled={downloading || !resumeData.personalInfo.fullName}
              className="download-btn download-word-btn"
            >
              <FaFileWord />
              {downloading ? 'Generating Word...' : 'Download as Word'}
            </button>
          </div>

          <div className="preview-wrapper">
            <ResumePreview data={resumeData} template={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
