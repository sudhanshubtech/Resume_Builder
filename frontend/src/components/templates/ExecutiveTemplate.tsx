import React from 'react';
import type { ResumeData } from '../../types/resume';
import { getFlattenedSkills } from '../../utils/resumeSkills';

interface TemplateProps {
  data: ResumeData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const groups = data.skillGroups?.filter((g) => g.skills.some((s) => s.trim()));

  const flatSkills = getFlattenedSkills(data);

  return (
    <div className="resume-template executive-template">
      {/* Header — left-aligned, no border */}
      <div className="exec-header">
        <h1 className="exec-name">{data.personalInfo.fullName || 'Your Name'}</h1>
        {data.experience.length > 0 && data.experience[0].position && (
          <p className="exec-title">{data.experience[0].position}</p>
        )}
        <div className="exec-contact-row">
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.email && (
            <span>
              <a href={`mailto:${data.personalInfo.email}`} className="exec-header-link">{data.personalInfo.email}</a>
            </span>
          )}
          {data.personalInfo.linkedin && (
            <span>
              <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="exec-header-link">linkedin.com</a>
            </span>
          )}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.github && (
            <span>
              <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="exec-header-link">GitHub</a>
            </span>
          )}
          {data.personalInfo.portfolio && (
            <span>
              <a href={data.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="exec-header-link">Portfolio</a>
            </span>
          )}
        </div>
      </div>

      {/* Two-column body */}
      <div className="exec-body">
        {/* Left Column — Main Content */}
        <div className="exec-main">
          {data.summary && (
            <div className="exec-section">
              <h2 className="exec-section-title">SUMMARY</h2>
              <p className="exec-summary-text">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="exec-section">
              <h2 className="exec-section-title">EXPERIENCE</h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="exec-exp-item">
                  <div className="exec-exp-row1">
                    <h3 className="exec-exp-position">{exp.position}</h3>
                    <span className="exec-exp-company">{exp.company}</span>
                  </div>
                  <div className="exec-exp-row2">
                    <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <ul className="exec-exp-bullets">
                      {exp.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i}>{line.replace(/^[•\-–]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div className="exec-section">
              <h2 className="exec-section-title">PROJECTS</h2>
              {data.projects.map((project) => (
                <div key={project.id} className="exec-project-item">
                  <div className="exec-project-row1">
                    <h3 className="exec-project-name">{project.name}</h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="exec-project-link">
                        View
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <ul className="exec-exp-bullets">
                      {project.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i}>{line.replace(/^[•\-–]\s*/, '')}</li>
                      ))}
                    </ul>
                  )}
                  {project.technologies.length > 0 && (
                    <p className="exec-project-tech">
                      <strong>Technologies:</strong> {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column — Sidebar */}
        <div className="exec-sidebar">
          {data.education.length > 0 && (
            <div className="exec-section">
              <h2 className="exec-section-title">EDUCATION</h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="exec-edu-item">
                  <h3 className="exec-edu-degree">
                    {edu.degree}{edu.field ? ` (${edu.field})` : ''}
                  </h3>
                  <p className="exec-edu-institution">{edu.institution}</p>
                  <p className="exec-edu-date">
                    {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.gpa && <p className="exec-edu-gpa">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {flatSkills.length > 0 && (
            <div className="exec-section">
              <h2 className="exec-section-title">SKILLS</h2>
              {groups && groups.length > 0 ? (
                <div className="exec-skills-categorized">
                  {groups.map((group) => {
                    const items = group.skills.map((s) => s.trim()).filter(Boolean);
                    if (items.length === 0) return null;
                    const line = items.join(', ');
                    return (
                      <div key={group.id} className="exec-skill-block">
                        {group.category.trim() ? (
                          <p className="exec-skill-category">
                            <strong>{group.category.trim()}:</strong>
                          </p>
                        ) : null}
                        <p className="exec-skill-line">{line}.</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="exec-skill-line">{flatSkills.join(', ')}.</p>
              )}
            </div>
          )}

          {data.softSkills && data.softSkills.length > 0 && (
            <div className="exec-section">
              <h2 className="exec-section-title">SOFT SKILLS</h2>
              <div className="exec-skills-list">
                {data.softSkills.map((skill, index) => (
                  <span key={index} className="exec-skill-item">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div className="exec-section">
              <h2 className="exec-section-title">CERTIFICATIONS</h2>
              {data.certifications.map((cert) => (
                <div key={cert.id} className="exec-cert-item">
                  <h3 className="exec-cert-name">{cert.name}</h3>
                  <p className="exec-cert-issuer">{cert.issuer}</p>
                  {cert.date && <p className="exec-cert-date">{cert.date}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
