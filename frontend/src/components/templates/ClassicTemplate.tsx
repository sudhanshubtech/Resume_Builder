import React from 'react';
import type { ResumeData } from '../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="resume-template classic-template">
      {/* Header */}
      <div className="header-classic">
        <h1 className="name-classic">{data.personalInfo.fullName}</h1>
        <div className="contact-classic">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio) && (
          <div className="links-classic">
            {data.personalInfo.linkedin && (
              <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                LinkedIn
              </a>
            )}
            {data.personalInfo.github && (
              <>
                {data.personalInfo.linkedin && <span> | </span>}
                <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                  GitHub
                </a>
              </>
            )}
            {data.personalInfo.portfolio && (
              <>
                {(data.personalInfo.linkedin || data.personalInfo.github) && <span> | </span>}
                <a href={data.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>
                  Portfolio
                </a>
              </>
            )}
          </div>
        )}
      </div>

      <hr className="divider" />

      {/* Summary */}
      {data.summary && (
        <section className="section-classic">
          <h2 className="section-title-classic">PROFESSIONAL SUMMARY</h2>
          <p className="summary-classic">{data.summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="section-classic">
          <h2 className="section-title-classic">SKILLS</h2>
          <p className="skills-classic">{data.skills.join(' • ')}</p>
        </section>
      )}

      {/* Soft Skills */}
      {data.softSkills && data.softSkills.length > 0 && (
        <section className="section-classic">
          <h2 className="section-title-classic">SOFT SKILLS</h2>
          <p className="skills-classic">{data.softSkills.join(' • ')}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="section-classic">
          <h2 className="section-title-classic">PROFESSIONAL EXPERIENCE</h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="item-classic">
              <div className="item-header-classic">
                <strong>{exp.position}</strong>
                <span>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="item-subheader-classic">
                <em>{exp.company}</em>
                <span>{exp.location}</span>
              </div>
              <p className="item-description-classic">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="section-classic">
          <h2 className="section-title-classic">EDUCATION</h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="item-classic">
              <div className="item-header-classic">
                <strong>{edu.degree} in {edu.field}</strong>
                <span>{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="item-subheader-classic">
                <em>{edu.institution}</em>
                <span>{edu.location}</span>
              </div>
              {edu.gpa && <p className="gpa-classic">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="section-classic">
          <h2 className="section-title-classic">PROJECTS</h2>
          {data.projects.map((project) => (
            <div key={project.id} className="item-classic">
              <strong>{project.name}</strong>
              <p className="item-description-classic">{project.description}</p>
              <p className="tech-classic">Technologies: {project.technologies.join(', ')}</p>
              {project.link && (
                <p className="link-classic">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>
                    View Project
                  </a>
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="section-classic">
          <h2 className="section-title-classic">CERTIFICATIONS</h2>
          {data.certifications.map((cert) => (
            <div key={cert.id} className="item-classic">
              <div className="item-header-classic">
                <strong>{cert.name}</strong>
                <span>{cert.date}</span>
              </div>
              <em>{cert.issuer}</em>
              {cert.credentialId && <p className="cert-id-classic">Credential ID: {cert.credentialId}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
