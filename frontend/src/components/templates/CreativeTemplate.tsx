import React from 'react';
import type { ResumeData } from '../../types/resume';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

interface TemplateProps {
  data: ResumeData;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="resume-template creative-template">
      <div className="creative-layout">
        {/* Sidebar */}
        <div className="sidebar-creative">
          <div className="profile-section">
            <h1 className="name-creative">{data.personalInfo.fullName}</h1>
          </div>

          {/* Contact */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Contact</h3>
            <div className="contact-list">
              {data.personalInfo.email && (
                <div className="contact-item">
                  <FaEnvelope className="icon" />
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="contact-item">
                  <FaPhone className="icon" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="contact-item">
                  <FaMapMarkerAlt className="icon" />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio) && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Links</h3>
              <div className="links-list">
                {data.personalInfo.linkedin && (
                  <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="link-item" style={{color: 'inherit', textDecoration: 'none'}}>
                    <FaLinkedin className="icon" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {data.personalInfo.github && (
                  <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="link-item" style={{color: 'inherit', textDecoration: 'none'}}>
                    <FaGithub className="icon" />
                    <span>GitHub</span>
                  </a>
                )}
                {data.personalInfo.portfolio && (
                  <a href={data.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="link-item" style={{color: 'inherit', textDecoration: 'none'}}>
                    <FaGlobe className="icon" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Skills</h3>
              <div className="skills-creative">
                {data.skills.map((skill, index) => (
                  <div key={index} className="skill-badge">{skill}</div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {data.softSkills && data.softSkills.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Soft Skills</h3>
              <div className="skills-creative">
                {data.softSkills.map((skill, index) => (
                  <div key={index} className="skill-badge">{skill}</div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Certifications</h3>
              {data.certifications.map((cert) => (
                <div key={cert.id} className="cert-creative">
                  <div className="cert-name-creative">{cert.name}</div>
                  <div className="cert-issuer-creative">{cert.issuer}</div>
                  <div className="cert-date-creative">{cert.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content-creative">
          {/* Summary */}
          {data.summary && (
            <section className="section-creative">
              <h2 className="section-title-creative">Profile</h2>
              <p className="summary-creative">{data.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="section-creative">
              <h2 className="section-title-creative">Experience</h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="exp-creative">
                  <div className="exp-header-creative">
                    <h3 className="position-creative">{exp.position}</h3>
                    <span className="date-creative">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="company-creative">{exp.company} • {exp.location}</div>
                  <p className="description-creative">{exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <section className="section-creative">
              <h2 className="section-title-creative">Education</h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="edu-creative">
                  <div className="edu-header-creative">
                    <h3 className="degree-creative">{edu.degree} in {edu.field}</h3>
                    <span className="date-creative">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="institution-creative">{edu.institution} • {edu.location}</div>
                  {edu.gpa && <div className="gpa-creative">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="section-creative">
              <h2 className="section-title-creative">Projects</h2>
              {data.projects.map((project) => (
                <div key={project.id} className="project-creative">
                  <h3 className="project-name-creative">{project.name}</h3>
                  <p className="project-desc-creative">{project.description}</p>
                  <div className="project-tech-creative">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-badge-creative">{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-color)', textDecoration: 'none', display: 'block', marginTop: '0.5rem'}}>
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
