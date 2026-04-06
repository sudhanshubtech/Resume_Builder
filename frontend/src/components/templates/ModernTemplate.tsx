import React from 'react';
import type { ResumeData } from '../../types/resume';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="resume-template modern-template">
      {/* Header */}
      <div className="header">
        <h1 className="name">{data.personalInfo.fullName}</h1>
        <div className="contact-info">
          {data.personalInfo.email && (
            <span><FaEnvelope /> {data.personalInfo.email}</span>
          )}
          {data.personalInfo.phone && (
            <span><FaPhone /> {data.personalInfo.phone}</span>
          )}
          {data.personalInfo.location && (
            <span><FaMapMarkerAlt /> {data.personalInfo.location}</span>
          )}
        </div>
        <div className="social-links">
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin /> LinkedIn
            </a>
          )}
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer">
              <FaGithub /> GitHub
            </a>
          )}
          {data.personalInfo.portfolio && (
            <a href={data.personalInfo.portfolio} target="_blank" rel="noopener noreferrer">
              <FaGlobe /> Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="section">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-list">
            {data.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Soft Skills */}
      {data.softSkills && data.softSkills.length > 0 && (
        <section className="section">
          <h2 className="section-title">Soft Skills</h2>
          <div className="skills-list">
            {data.softSkills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="section">
          <h2 className="section-title">Work Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="experience-item">
              <div className="exp-header">
                <div>
                  <h3 className="position">{exp.position}</h3>
                  <p className="company">{exp.company} • {exp.location}</p>
                </div>
                <p className="date">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              <p className="description">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="section">
          <h2 className="section-title">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="education-item">
              <div className="edu-header">
                <div>
                  <h3 className="degree">{edu.degree} in {edu.field}</h3>
                  <p className="institution">{edu.institution} • {edu.location}</p>
                </div>
                <p className="date">{edu.startDate} - {edu.endDate}</p>
              </div>
              {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="section">
          <h2 className="section-title">Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id} className="project-item">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              {project.link && (
                <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="section">
          <h2 className="section-title">Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="certification-item">
              <h3 className="cert-name">{cert.name}</h3>
              <p className="cert-issuer">{cert.issuer} • {cert.date}</p>
              {cert.credentialId && <p className="cert-id">ID: {cert.credentialId}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
