import { useState, useEffect } from 'react';
import type { ResumeData, TemplateType } from './types/resume';
import { ResumeEditor } from './components/ResumeEditor/ResumeEditor';
import { ResumePreview } from './components/ResumePreview/ResumePreview';
import { ResumeUpload } from './components/ResumeUpload/ResumeUpload';
import { ATSScoreBanner } from './components/ATSScore/ATSScoreBanner';
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
  softSkills: [],
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
      skillGroups:
        parsedData.skillGroups && parsedData.skillGroups.length > 0
          ? parsedData.skillGroups
          : resumeData.skillGroups,
      softSkills: parsedData.softSkills && parsedData.softSkills.length > 0
        ? parsedData.softSkills
        : resumeData.softSkills,
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
    { value: 'executive', label: 'Executive', description: 'Clean header with right sidebar' },
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

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5;
      const contentWidth = pageWidth - (2 * margin);
      const pageContentHeight = pageHeight - (2 * margin);

      // A4 at 96 DPI = ~794px; render at this width for correct font proportions
      const a4WidthPx = 794;
      const origWidth = element.style.width;
      element.style.width = `${a4WidthPx}px`;

      // Collect all link positions before capture (relative to the element)
      const elementRect = element.getBoundingClientRect();
      const elementScrollH = element.scrollHeight;
      const linkAnchors = Array.from(element.querySelectorAll('a[href]'));
      const linkData = linkAnchors
        .map((a) => {
          const href = a.getAttribute('href') || '';
          if (!href || href.startsWith('#') || href.startsWith('javascript')) return null;
          const rect = a.getBoundingClientRect();
          return {
            href,
            top: rect.top - elementRect.top + element.scrollTop,
            left: rect.left - elementRect.left,
            width: rect.width,
            height: rect.height,
          };
        })
        .filter(Boolean) as { href: string; top: number; left: number; width: number; height: number }[];

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        windowWidth: a4WidthPx,
        windowHeight: element.scrollHeight,
        backgroundColor: '#ffffff',
      });

      element.style.width = origWidth;

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      // Convert link positions from px to mm (relative to PDF content area)
      const pxToMmX = imgWidth / a4WidthPx;
      const pxToMmY = imgHeight / elementScrollH;

      // Collect all potential break points: sections AND individual items
      const breakSelectors = [
        // Section-level breaks
        '.section', '.section-classic', '.section-minimal', '.section-creative',
        '.section-professional', '.exec-section',
        '.header', '.header-classic', '.header-minimal',
        '.creative-layout', '.exec-header', '.header-professional',
        // Item-level breaks (experience, education, project, cert entries)
        '.experience-item', '.education-item', '.project-item', '.certification-item',
        '.item-classic', '.item-minimal',
        '.exp-creative', '.edu-creative', '.project-creative',
        '.experience-item-pro', '.education-item-pro', '.project-item-pro',
        '.exec-exp-item', '.exec-edu-item', '.exec-project-item', '.exec-cert-item',
      ].join(', ');

      const elRect = element.getBoundingClientRect();
      const breakElements = Array.from(element.querySelectorAll(breakSelectors));
      const sectionBreakPoints: number[] = [0];

      breakElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const relativeTop = rect.top - elRect.top + element.scrollTop;
        const yMm = (relativeTop / element.scrollHeight) * imgHeight;
        const tooClose = sectionBreakPoints.some(bp => Math.abs(bp - yMm) < 10);
        if (!tooClose && yMm > 15) {
          sectionBreakPoints.push(yMm);
        }
      });
      sectionBreakPoints.sort((a, b) => a - b);

      const totalPages = Math.ceil(imgHeight / pageContentHeight);
      let fitScale = 1;
      if (totalPages > 3) {
        fitScale = (3 * pageContentHeight) / imgHeight;
        fitScale = Math.max(fitScale, 0.65);
      }

      const scaledWidth = imgWidth * fitScale;
      const scaledHeight = imgHeight * fitScale;

      let yPosition = 0;
      let pageNumber = 0;
      const usedBreakPoints: number[] = [];

      while (yPosition < scaledHeight) {
        if (pageNumber > 0) pdf.addPage();

        let nextYPosition = yPosition + pageContentHeight;

        if (nextYPosition < scaledHeight) {
          // Search backward up to 60mm to find a clean break between items
          const searchRangeStart = (nextYPosition - 60) / fitScale;
          const searchRangeEnd = (nextYPosition + 5) / fitScale;
          const candidateBreaks = sectionBreakPoints.filter(bp =>
            bp > searchRangeStart &&
            bp < searchRangeEnd &&
            bp * fitScale > yPosition + 30 &&
            !usedBreakPoints.includes(bp)
          );
          if (candidateBreaks.length > 0) {
            const bestBreak = candidateBreaks.reduce((prev, curr) =>
              Math.abs(curr * fitScale - nextYPosition) < Math.abs(prev * fitScale - nextYPosition) ? curr : prev
            );
            nextYPosition = bestBreak * fitScale;
            usedBreakPoints.push(bestBreak);
          }
        }

        nextYPosition = Math.min(nextYPosition, scaledHeight);

        const sourceY = yPosition / fitScale;
        const sourceHeight = (nextYPosition - yPosition) / fitScale;

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

          const pageImgData = pageCanvas.toDataURL('image/png');
          const displayHeight = sourceHeight * fitScale;

          pdf.addImage(
            pageImgData,
            'PNG',
            margin,
            margin,
            scaledWidth,
            displayHeight
          );

          // Overlay clickable link annotations for this page
          const pageTopMm = yPosition / fitScale;
          const pageBottomMm = (nextYPosition) / fitScale;

          for (const link of linkData) {
            const linkTopMm = link.top * pxToMmY;
            const linkBottomMm = (link.top + link.height) * pxToMmY;

            if (linkBottomMm < pageTopMm || linkTopMm > pageBottomMm) continue;

            const x = margin + link.left * pxToMmX * fitScale;
            const y = margin + (linkTopMm - pageTopMm) * fitScale;
            const w = link.width * pxToMmX * fitScale;
            const h = link.height * pxToMmY * fitScale;

            pdf.link(x, y, w, h, { url: link.href });
          }
        }

        yPosition = nextYPosition;
        pageNumber++;
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

      <ATSScoreBanner data={resumeData} />

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
