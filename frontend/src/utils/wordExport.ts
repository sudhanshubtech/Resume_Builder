import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  ShadingType
} from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData, TemplateType } from '../types/resume';

import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  ShadingType
} from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData, TemplateType } from '../types/resume';
import { generateProfessionalLayout } from './wordExportProfessional';

/**
 * Generates a Word document (.docx) from resume data
 * @param data - Resume data to export
 * @param template - Template name (affects styling and layout)
 */
export const generateWordDocument = async (data: ResumeData, template: TemplateType = 'modern'): Promise<void> => {
  try {
    console.log('Generating Word document with template:', template);
    
    // Get template-specific colors
    const getTemplateColors = (template: TemplateType) => {
      switch (template) {
        case 'modern':
          return { primary: '3B82F6', secondary: '1E40AF', accent: 'EF4444' }; // Blue
        case 'classic':
          return { primary: '1F2937', secondary: '374151', accent: '1F2937' }; // Gray/Black
        case 'minimal':
          return { primary: '000000', secondary: '4B5563', accent: '000000' }; // Black
        case 'creative':
          return { primary: '8B5CF6', secondary: 'A78BFA', accent: 'EC4899' }; // Purple/Pink
        case 'professional':
          return { primary: '4A5568', secondary: '2D3748', accent: 'FBBF24' }; // Gray/Gold
        default:
          return { primary: '3B82F6', secondary: '1E40AF', accent: 'EF4444' };
      }
    };

    const colors = getTemplateColors(template);
    console.log('Applied colors:', colors);

    // Use Professional layout for Professional template
    if (template === 'professional') {
      const sections = generateProfessionalLayout(data, colors);
      
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                },
              },
            },
            children: sections,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const templateName = template.charAt(0).toUpperCase() + template.slice(1);
      const fileName = `${data.personalInfo.fullName || 'Resume'}_${templateName}.docx`;
      saveAs(blob, fileName);
      return;
    }

    // Default single-column layout for other templates
    const sections: Paragraph[] = [];

    // Helper function to create section heading with template-specific styling
    const createSectionHeading = (text: string) => {
      return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 200,
        },
        border: {
          bottom: {
            color: colors.primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: template === 'minimal' ? 3 : 6,
          },
        },
      });
    };

    // Add template name indicator at the very top
    const templateName = template.charAt(0).toUpperCase() + template.slice(1);
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Template: ${templateName}`,
            size: 16,
            color: colors.secondary,
            italics: true,
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: {
          after: 100,
        },
      })
    );

    // Header - Personal Info with template-specific alignment
    const headerAlignment = template === 'classic' || template === 'modern' 
      ? AlignmentType.CENTER 
      : AlignmentType.LEFT;

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.personalInfo.fullName,
            bold: true,
            size: template === 'minimal' ? 36 : 40,
            color: colors.primary,
          }),
        ],
        alignment: headerAlignment,
        spacing: {
          after: 150,
        },
      })
    );

    // Contact Information
    const contactParts: string[] = [];
    if (data.personalInfo.email) contactParts.push(data.personalInfo.email);
    if (data.personalInfo.phone) contactParts.push(data.personalInfo.phone);
    if (data.personalInfo.location) contactParts.push(data.personalInfo.location);

    if (contactParts.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactParts.join(' | '),
              size: 20,
              color: colors.secondary,
            }),
          ],
          alignment: headerAlignment,
          spacing: {
            after: 100,
          },
        })
      );
    }

    // Links
    const linkParts: string[] = [];
    if (data.personalInfo.linkedin) linkParts.push(`LinkedIn: ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) linkParts.push(`GitHub: ${data.personalInfo.github}`);
    if (data.personalInfo.portfolio) linkParts.push(`Portfolio: ${data.personalInfo.portfolio}`);

    if (linkParts.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: linkParts.join(' | '),
              size: 20,
              color: colors.secondary,
            }),
          ],
          alignment: headerAlignment,
          spacing: {
            after: 250,
          },
        })
      );
    }

    // Professional Summary
    if (data.summary) {
      sections.push(createSectionHeading('PROFESSIONAL SUMMARY'));
      sections.push(
        new Paragraph({
          text: data.summary,
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            after: 200,
          },
        })
      );
    }

    // Professional Experience
    if (data.experience && data.experience.length > 0) {
      sections.push(createSectionHeading('PROFESSIONAL EXPERIENCE'));
      
      data.experience.forEach((exp, index) => {
        // Position and Company
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position,
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: ` | ${exp.company}`,
                size: 24,
              }),
            ],
            spacing: {
              before: index > 0 ? 200 : 0,
              after: 50,
            },
          })
        );

        // Date and Location
        const dateLocation: string[] = [];
        if (exp.startDate || exp.endDate) {
          dateLocation.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
        }
        if (exp.location) {
          dateLocation.push(exp.location);
        }

        if (dateLocation.length > 0) {
          sections.push(
            new Paragraph({
              text: dateLocation.join(' | '),
              italics: true,
              spacing: {
                after: 100,
              },
            })
          );
        }

        // Description
        if (exp.description) {
          const lines = exp.description.split('\n').filter(line => line.trim());
          lines.forEach(line => {
            sections.push(
              new Paragraph({
                text: line.startsWith('•') ? line : `• ${line}`,
                spacing: {
                  after: 50,
                },
                indent: {
                  left: 360,
                },
              })
            );
          });
        }
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      sections.push(createSectionHeading('EDUCATION'));
      
      data.education.forEach((edu, index) => {
        // Degree and Field
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: index > 0 ? 200 : 0,
              after: 50,
            },
          })
        );

        // Institution
        sections.push(
          new Paragraph({
            text: edu.institution,
            spacing: {
              after: 50,
            },
          })
        );

        // Date, Location, GPA
        const eduDetails: string[] = [];
        if (edu.startDate || edu.endDate) {
          eduDetails.push(`${edu.startDate} - ${edu.endDate}`);
        }
        if (edu.location) {
          eduDetails.push(edu.location);
        }
        if (edu.gpa) {
          eduDetails.push(`GPA: ${edu.gpa}`);
        }

        if (eduDetails.length > 0) {
          sections.push(
            new Paragraph({
              text: eduDetails.join(' | '),
              italics: true,
              spacing: {
                after: 100,
              },
            })
          );
        }
      });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      sections.push(createSectionHeading('SKILLS'));
      
      // Skills are just an array of strings
      sections.push(
        new Paragraph({
          text: data.skills.join(', '),
          spacing: {
            after: 100,
          },
        })
      );
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      sections.push(createSectionHeading('PROJECTS'));
      
      data.projects.forEach((project, index) => {
        // Project Name
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name,
                bold: true,
                size: 24,
              }),
            ],
            spacing: {
              before: index > 0 ? 200 : 0,
              after: 50,
            },
          })
        );

        // Technologies
        if (project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0) {
          sections.push(
            new Paragraph({
              text: `Technologies: ${project.technologies.join(', ')}`,
              italics: true,
              spacing: {
                after: 100,
              },
            })
          );
        }

        // Description
        if (project.description) {
          sections.push(
            new Paragraph({
              text: project.description,
              spacing: {
                after: 50,
              },
            })
          );
        }

        // Link
        if (project.link) {
          sections.push(
            new Paragraph({
              text: `Link: ${project.link}`,
              spacing: {
                after: 100,
              },
            })
          );
        }
      });
    }

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      sections.push(createSectionHeading('CERTIFICATIONS'));
      
      data.certifications.forEach((cert) => {
        const certParts: string[] = [cert.name];
        if (cert.issuer) certParts.push(`- ${cert.issuer}`);
        if (cert.date) certParts.push(`(${cert.date})`);

        sections.push(
          new Paragraph({
            text: certParts.join(' '),
            spacing: {
              after: 100,
            },
          })
        );
      });
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const fileName = `${data.personalInfo.fullName || 'Resume'}_${templateName}.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
};
