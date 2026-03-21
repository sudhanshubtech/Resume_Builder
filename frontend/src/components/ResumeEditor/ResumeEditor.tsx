import React, { useState } from 'react';
import type { ResumeData, Experience, Education, Certification, Project } from '../../types/resume';
import { FaPlus, FaTrash, FaMagic } from 'react-icons/fa';
import axios from 'axios';
import { SkillsInput } from '../SkillsInput/SkillsInput';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onEmailBlur?: () => void;
  onFieldBlur?: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange, onEmailBlur, onFieldBlur }) => {
  const [optimizing, setOptimizing] = useState<string | null>(null);

  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const handleSummaryChange = (value: string) => {
    onChange({ ...data, summary: value });
  };

  const handleSkillsChange = (skills: string[]) => {
    onChange({ ...data, skills });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    onChange({
      ...data,
      experience: data.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id),
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    onChange({ ...data, projects: [...(data.projects || []), newProject] });
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    onChange({
      ...data,
      projects: (data.projects || []).map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: (data.projects || []).filter(proj => proj.id !== id),
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
    };
    onChange({ ...data, certifications: [...(data.certifications || []), newCert] });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      certifications: (data.certifications || []).map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: (data.certifications || []).filter(cert => cert.id !== id),
    });
  };

  const optimizeContent = async (type: string, content: string, callback: (optimized: string) => void) => {
    setOptimizing(type);
    try {
      const response = await axios.post('http://localhost:5000/api/optimize', {
        content,
        type,
      });
      callback(response.data.optimizedContent);
    } catch (error) {
      console.error('Error optimizing content:', error);
      alert('Failed to optimize content. Make sure the backend server is running.');
    } finally {
      setOptimizing(null);
    }
  };

  return (
    <div className="resume-editor">
      <h2 className="editor-title">Resume Builder</h2>

      {/* Personal Information */}
      <section className="editor-section">
        <h3 className="section-header">Personal Information</h3>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Full Name"
            value={data.personalInfo.fullName}
            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            onBlur={onFieldBlur}
            className="form-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={data.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            onBlur={onEmailBlur}
            className="form-input"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={data.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            onBlur={onFieldBlur}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Location"
            value={data.personalInfo.location}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            onBlur={onFieldBlur}
            className="form-input"
          />
          <input
            type="url"
            placeholder="LinkedIn URL (optional)"
            value={data.personalInfo.linkedin || ''}
            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
            onBlur={onFieldBlur}
            className="form-input"
          />
          <input
            type="url"
            placeholder="GitHub URL (optional)"
            value={data.personalInfo.github || ''}
            onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
            onBlur={onFieldBlur}
            className="form-input"
          />
          <input
            type="url"
            placeholder="Portfolio URL (optional)"
            value={data.personalInfo.portfolio || ''}
            onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
            onBlur={onFieldBlur}
            className="form-input full-width"
          />
        </div>
      </section>

      {/* Professional Summary */}
      <section className="editor-section">
        <div className="section-header-with-action">
          <h3 className="section-header">Professional Summary</h3>
          <button
            onClick={() => optimizeContent('summary', data.summary, handleSummaryChange)}
            disabled={optimizing === 'summary' || !data.summary}
            className="optimize-btn"
          >
            <FaMagic /> {optimizing === 'summary' ? 'Optimizing...' : 'Optimize with AI'}
          </button>
        </div>
        <textarea
          placeholder="Write a brief professional summary..."
          value={data.summary}
          onChange={(e) => handleSummaryChange(e.target.value)}
          onBlur={onFieldBlur}
          className="form-textarea"
          rows={4}
        />
      </section>

      {/* Work Experience */}
      <section className="editor-section">
        <h3 className="section-header">Work Experience</h3>
        {data.experience.map((exp) => (
          <div key={exp.id} className="item-card">
            <div className="item-header">
              <h4>Experience Entry</h4>
              <button onClick={() => removeExperience(exp.id)} className="delete-btn">
                <FaTrash />
              </button>
            </div>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Position"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Location"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Start Date (e.g., Jan 2020)"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="End Date (e.g., Dec 2022)"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                className="form-input"
                disabled={exp.current}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                />
                Currently working here
              </label>
            </div>
            <div className="section-header-with-action">
              <label className="textarea-label">Description</label>
              <button
                onClick={() =>
                  optimizeContent('experience', exp.description, (optimized) =>
                    updateExperience(exp.id, 'description', optimized)
                  )
                }
                disabled={optimizing === `exp-${exp.id}` || !exp.description}
                className="optimize-btn-small"
              >
                <FaMagic /> Optimize
              </button>
            </div>
            <textarea
              placeholder="Describe your responsibilities and achievements..."
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>
        ))}
        <button onClick={addExperience} className="add-btn">
          <FaPlus /> Add Experience
        </button>
      </section>

      {/* Education */}
      <section className="editor-section">
        <h3 className="section-header">Education</h3>
        {data.education.map((edu) => (
          <div key={edu.id} className="item-card">
            <div className="item-header">
              <h4>Education Entry</h4>
              <button onClick={() => removeEducation(edu.id)} className="delete-btn">
                <FaTrash />
              </button>
            </div>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Degree (e.g., Bachelor of Science)"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Location"
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Start Date (e.g., 2016)"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="End Date (e.g., 2020)"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        ))}
        <button onClick={addEducation} className="add-btn">
          <FaPlus /> Add Education
        </button>
      </section>

      {/* Skills */}
      <section className="editor-section">
        <h3 className="section-header">Skills</h3>
        <SkillsInput
          skills={data.skills}
          onChange={handleSkillsChange}
          onBlur={onFieldBlur}
        />
      </section>

      {/* Projects */}
      <section className="editor-section">
        <h3 className="section-header">Projects (Optional)</h3>
        {(data.projects || []).map((project) => (
          <div key={project.id} className="item-card">
            <div className="item-header">
              <h4>Project Entry</h4>
              <button onClick={() => removeProject(project.id)} className="delete-btn">
                <FaTrash />
              </button>
            </div>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="form-input"
              />
              <input
                type="url"
                placeholder="Project Link (optional)"
                value={project.link || ''}
                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                className="form-input"
              />
            </div>
            <textarea
              placeholder="Project description..."
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              className="form-textarea"
              rows={2}
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={project.technologies.join(', ')}
              onChange={(e) =>
                updateProject(
                  project.id,
                  'technologies',
                  e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                )
              }
              className="form-input full-width"
            />
          </div>
        ))}
        <button onClick={addProject} className="add-btn">
          <FaPlus /> Add Project
        </button>
      </section>

      {/* Certifications */}
      <section className="editor-section">
        <h3 className="section-header">Certifications (Optional)</h3>
        {(data.certifications || []).map((cert) => (
          <div key={cert.id} className="item-card">
            <div className="item-header">
              <h4>Certification Entry</h4>
              <button onClick={() => removeCertification(cert.id)} className="delete-btn">
                <FaTrash />
              </button>
            </div>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Issuing Organization"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Date (e.g., Jan 2023)"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Credential ID (optional)"
                value={cert.credentialId || ''}
                onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        ))}
        <button onClick={addCertification} className="add-btn">
          <FaPlus /> Add Certification
        </button>
      </section>
    </div>
  );
};
