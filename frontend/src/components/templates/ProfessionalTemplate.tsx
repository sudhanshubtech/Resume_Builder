import React from 'react';
import type { ResumeData } from '../../types/resume';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe, FaBriefcase, FaGraduationCap, FaCertificate, FaCode } from 'react-icons/fa';

interface TemplateProps {
  data: ResumeData;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="resume-template professional-template">
      <div className="professional-layout">
        {/* Gray Sidebar */}
        <div className="sidebar-professional">
          {/* Name in Sidebar */}
          <div className="name-section-pro">
            <h1 className="name-sidebar-pro">{data.personalInfo.fullName}</h1>
          </div>

          {/* Contact Section */}
          <div className="sidebar-section-pro contact-section-no-title">
            <div className="sidebar-content-pro">
              {data.personalInfo.email && (
                <div className="contact-item-pro">
                  <FaEnvelope className="inline-icon-pro" />
                  <span className="contact-value-pro">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="contact-item-pro">
                  <FaPhone className="inline-icon-pro" />
                  <span className="contact-value-pro">{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="contact-item-pro">
                  <FaMapMarkerAlt className="inline-icon-pro" />
                  <span className="contact-value-pro">{data.personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio) && (
            <div className="sidebar-section-pro">
              <h3 className="sidebar-title-pro">
                <FaGlobe className="section-icon-pro" />
                Links
              </h3>
              <div className="sidebar-content-pro">
                {data.personalInfo.linkedin && (
                  <div className="link-item-pro">
                    <FaLinkedin className="inline-icon-pro" />
                    <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="link-text-pro">
                      LinkedIn
                    </a>
                  </div>
                )}
                {data.personalInfo.github && (
                  <div className="link-item-pro">
                    <FaGithub className="inline-icon-pro" />
                    <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="link-text-pro">
                      GitHub
                    </a>
                  </div>
                )}
                {data.personalInfo.portfolio && (
                  <div className="link-item-pro">
                    <FaGlobe className="inline-icon-pro" />
                    <a href={data.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="link-text-pro">
                      Portfolio
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {data.skills.length > 0 && (
            <div className="sidebar-section-pro">
              <h3 className="sidebar-title-pro">
                <FaCode className="section-icon-pro" />
                Skills
              </h3>
              <div className="sidebar-content-pro">
                <div className="skills-list-pro">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="skill-item-pro">
                      <span className="skill-bullet-pro">•</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Soft Skills in Sidebar */}
          {data.softSkills && data.softSkills.length > 0 && (
            <div className="sidebar-section-pro">
              <h3 className="sidebar-title-pro">
                <FaCode className="section-icon-pro" />
                Soft Skills
              </h3>
              <div className="sidebar-content-pro">
                <div className="skills-list-pro">
                  {data.softSkills.map((skill, index) => (
                    <div key={index} className="skill-item-pro">
                      <span className="skill-bullet-pro">•</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="sidebar-section-pro">
              <h3 className="sidebar-title-pro">
                <FaCertificate className="section-icon-pro" />
                Certifications
              </h3>
              <div className="sidebar-content-pro">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="cert-item-pro">
                    <div className="cert-name-pro">{cert.name}</div>
                    <div className="cert-issuer-pro">{cert.issuer}</div>
                    {cert.date && <div className="cert-date-pro">{cert.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content-professional">
          {/* Professional Summary */}
          {data.summary && (
            <div className="header-professional">
              <div className="summary-box-pro">
                <h2 className="summary-title-pro">Professional Summary</h2>
                <p className="summary-text-pro">{data.summary}</p>
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {data.experience.length > 0 && (
            <div className="section-professional">
              <h2 className="section-title-professional">
                <FaBriefcase className="section-icon-main-pro" />
                Professional Experience
                <div className="title-underline-pro"></div>
              </h2>
              <div className="section-content-professional">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="experience-item-pro">
                    <div className="exp-header-pro">
                      <div className="exp-left-pro">
                        <h3 className="exp-position-pro">{exp.position}</h3>
                        <div className="exp-company-pro">{exp.company}</div>
                      </div>
                      <div className="exp-right-pro">
                        <div className="exp-date-pro">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                        {exp.location && <div className="exp-location-pro">{exp.location}</div>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="exp-description-pro">
                        {exp.description.split('\n').map((line, index) => (
                          <p key={index} className="exp-line-pro">{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="section-professional">
              <h2 className="section-title-professional">
                <FaGraduationCap className="section-icon-main-pro" />
                Education
                <div className="title-underline-pro"></div>
              </h2>
              <div className="section-content-professional">
                {data.education.map((edu) => (
                  <div key={edu.id} className="education-item-pro">
                    <div className="edu-header-pro">
                      <div className="edu-left-pro">
                        <h3 className="edu-degree-pro">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                        <div className="edu-institution-pro">{edu.institution}</div>
                      </div>
                      <div className="edu-right-pro">
                        <div className="edu-date-pro">
                          {edu.startDate} - {edu.endDate}
                        </div>
                        {edu.location && <div className="edu-location-pro">{edu.location}</div>}
                      </div>
                    </div>
                    {edu.gpa && (
                      <div className="edu-gpa-pro">{edu.gpa}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="section-professional">
              <h2 className="section-title-professional">
                <FaCode className="section-icon-main-pro" />
                Projects
                <div className="title-underline-pro"></div>
              </h2>
              <div className="section-content-professional">
                {data.projects.map((project) => (
                  <div key={project.id} className="project-item-pro">
                    <div className="project-header-pro">
                      <h3 className="project-name-pro">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link-pro">
                          View Project
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="project-description-pro">{project.description}</p>
                    )}
                    {project.technologies.length > 0 && (
                      <div className="project-tech-pro">
                        <strong>Technologies:</strong> {project.technologies.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
