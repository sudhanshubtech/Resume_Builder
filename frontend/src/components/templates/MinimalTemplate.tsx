import React from 'react';
import type { ResumeData } from '../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="resume-template minimal-template">
      {/* Header */}
      <div className="header-minimal">
        <h1 className="name-minimal">{data.personalInfo.fullName}</h1>
        <div className="contact-minimal">
          {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio) && (
          <div className="links-minimal">
            {data.personalInfo.linkedin && (
              <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                LinkedIn
              </a>
            )}
            {data.personalInfo.linkedin && (data.personalInfo.github || data.personalInfo.portfolio) && <span> • </span>}
            {data.personalInfo.github && (
              <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                GitHub
              </a>
            )}
            {data.personalInfo.github && data.personalInfo.portfolio && <span> • </span>}
            {data.personalInfo.portfolio && (
              <a href={data.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="section-minimal">
          <p className="summary-minimal">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="section-minimal">
          <h2 className="section-title-minimal">Skills</h2>
          <p className="skills-minimal">{data.skills.join(', ')}</p>
        </section>
      )}

      {/* Soft Skills */}
      {data.softSkills && data.softSkills.length > 0 && (
        <section className="section-minimal">
          <h2 className="section-title-minimal">Soft Skills</h2>
          <p className="skills-minimal">{data.softSkills.join(', ')}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="section-minimal">
          <h2 className="section-title-minimal">Experience</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="item-minimal">
              <div className="flex-between">
                <div>
                  <strong>{exp.position}</strong> — {exp.company}
                </div>
                <div className="date-minimal">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              <div className="location-minimal">{exp.location}</div>
              <p className="description-minimal">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="section-minimal">
          <h2 className="section-title-minimal">Education</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="item-minimal">
              <div className="flex-between">
                <div>
                  <strong>{edu.degree}</strong> — {edu.field}
                </div>
                <div className="date-minimal">
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
              <div>{edu.institution}, {edu.location}</div>
              {edu.gpa && <div className="gpa-minimal">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="section-minimal">
          <h2 className="section-title-minimal">Projects</h2>
          {data.projects.map((project) => (
            <div key={project.id} className="item-minimal">
              <strong>{project.name}</strong>
              <p className="description-minimal">{project.description}</p>
              <div className="tech-minimal">{project.technologies.join(', ')}</div>
              {project.link && (
                <div className="link-minimal">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>
                    View Project
                  </a>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="section-minimal">
          <h2 className="section-title-minimal">Certifications</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="item-minimal">
              <div className="flex-between">
                <strong>{cert.name}</strong>
                <span className="date-minimal">{cert.date}</span>
              </div>
              <div>{cert.issuer}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
