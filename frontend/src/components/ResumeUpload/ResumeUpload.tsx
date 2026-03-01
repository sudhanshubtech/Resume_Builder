import React, { useState, useRef } from 'react';
import { FaUpload, FaFileAlt, FaSpinner, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import type { ResumeData } from '../../types/resume';

interface ResumeUploadProps {
  onDataParsed: (data: ResumeData) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onDataParsed }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document (.pdf, .docx, .doc)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onDataParsed(response.data.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to parse resume. Please try again.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="resume-upload-container">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''} ${success ? 'success' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <>
            <FaSpinner className="upload-icon spinning" />
            <div>
              <p>Parsing your resume...</p>
            </div>
          </>
        ) : success ? (
          <>
            <FaFileAlt className="upload-icon success-icon" />
            <div>
              <p>Resume uploaded successfully!</p>
            </div>
          </>
        ) : (
          <>
            <FaUpload className="upload-icon" />
            <div>
              <p>Upload your existing resume - Drag & drop or click to select <span className="upload-formats">(PDF, DOCX)</span></p>
            </div>
          </>
        )}
      </div>
      
      {error && (
        <div className="upload-error">
          <FaFileAlt /> 
          <span>{error}</span>
          <button onClick={clearError} className="error-close">
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};
