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
import { getFlattenedSkills } from './resumeSkills';

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
        case 'executive':
          return { primary: '111111', secondary: '333333', accent: '0070C0' }; // Black/Blue
        default:
          return { primary: '3B82F6', secondary: '1E40AF', accent: 'EF4444' };
      }
    };

    const colors = getTemplateColors(template);
    console.log('Applied colors:', colors);

    // Executive template — left-aligned header with two-column body
    if (template === 'executive') {
      const headerChildren: Paragraph[] = [];

      // Name
      headerChildren.push(new Paragraph({
        children: [new TextRun({ text: data.personalInfo.fullName, bold: true, size: 36, color: '111111', font: 'Calibri' })],
        spacing: { after: 40 },
      }));

      // Title from latest experience
      if (data.experience.length > 0 && data.experience[0].position) {
        headerChildren.push(new Paragraph({
          children: [new TextRun({ text: data.experience[0].position, bold: true, size: 24, color: '0070C0', font: 'Calibri' })],
          spacing: { after: 60 },
        }));
      }

      // Contact row
      const contactPieces: TextRun[] = [];
      const addContact = (text: string, isLink = false) => {
        if (contactPieces.length > 0) {
          contactPieces.push(new TextRun({ text: ' | ', size: 20, color: '999999', font: 'Calibri' }));
        }
        contactPieces.push(new TextRun({
          text,
          size: 20,
          color: isLink ? '0070C0' : '333333',
          underline: isLink ? {} : undefined,
          font: 'Calibri',
        }));
      };
      if (data.personalInfo.phone) addContact(data.personalInfo.phone);
      if (data.personalInfo.email) addContact(data.personalInfo.email, true);
      if (data.personalInfo.linkedin) addContact('linkedin.com', true);
      if (data.personalInfo.location) addContact(data.personalInfo.location);
      if (data.personalInfo.github) addContact('GitHub', true);
      if (data.personalInfo.portfolio) addContact('Portfolio', true);

      if (contactPieces.length > 0) {
        headerChildren.push(new Paragraph({ children: contactPieces, spacing: { after: 200 } }));
      }

      // Left column content (Summary, Experience, Projects)
      const leftChildren: Paragraph[] = [];
      const execSectionTitle = (text: string) => new Paragraph({
        children: [new TextRun({ text, bold: true, size: 22, color: '111111', font: 'Calibri' })],
        spacing: { before: 200, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC', space: 2 } },
      });

      if (data.summary) {
        leftChildren.push(execSectionTitle('SUMMARY'));
        leftChildren.push(new Paragraph({
          children: [new TextRun({ text: data.summary, size: 21, color: '333333', font: 'Calibri' })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 100 },
        }));
      }

      if (data.experience.length > 0) {
        leftChildren.push(execSectionTitle('EXPERIENCE'));
        data.experience.forEach((exp, i) => {
          leftChildren.push(new Paragraph({
            children: [
              new TextRun({ text: exp.position, bold: true, size: 23, color: '111111', font: 'Calibri' }),
              new TextRun({ text: `\t${exp.company}`, bold: true, size: 23, color: '111111', font: 'Calibri' }),
            ],
            spacing: { before: i > 0 ? 160 : 0, after: 30 },
            tabStops: [{ type: 'right' as const, position: 4800 }],
          }));
          const meta: string[] = [];
          if (exp.startDate || exp.endDate) meta.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
          if (exp.location) meta.push(exp.location);
          if (meta.length > 0) {
            leftChildren.push(new Paragraph({
              children: [
                new TextRun({ text: meta[0], size: 20, color: '555555', font: 'Calibri' }),
                ...(meta[1] ? [new TextRun({ text: `\t${meta[1]}`, size: 20, color: '555555', font: 'Calibri' })] : []),
              ],
              spacing: { after: 50 },
              tabStops: [{ type: 'right' as const, position: 4800 }],
            }));
          }
          if (exp.description) {
            exp.description.split('\n').filter(Boolean).forEach((line) => {
              leftChildren.push(new Paragraph({
                children: [new TextRun({ text: line.replace(/^[•\-–]\s*/, ''), size: 21, color: '333333', font: 'Calibri' })],
                bullet: { level: 0 },
                spacing: { after: 30 },
              }));
            });
          }
        });
      }

      if (data.projects && data.projects.length > 0) {
        leftChildren.push(execSectionTitle('PROJECTS'));
        data.projects.forEach((project, i) => {
          leftChildren.push(new Paragraph({
            children: [new TextRun({ text: project.name, bold: true, size: 22, color: '111111', font: 'Calibri' })],
            spacing: { before: i > 0 ? 120 : 0, after: 30 },
          }));
          if (project.description) {
            project.description.split('\n').filter(Boolean).forEach((line) => {
              leftChildren.push(new Paragraph({
                children: [new TextRun({ text: line.replace(/^[•\-–]\s*/, ''), size: 21, color: '333333', font: 'Calibri' })],
                bullet: { level: 0 },
                spacing: { after: 30 },
              }));
            });
          }
          if (project.technologies.length > 0) {
            leftChildren.push(new Paragraph({
              children: [
                new TextRun({ text: 'Technologies: ', bold: true, size: 19, color: '333333', font: 'Calibri' }),
                new TextRun({ text: project.technologies.join(', '), size: 19, color: '555555', font: 'Calibri' }),
              ],
              spacing: { after: 60 },
            }));
          }
        });
      }

      // Right column content (Education, Skills, Certifications)
      const rightChildren: Paragraph[] = [];

      if (data.education.length > 0) {
        rightChildren.push(execSectionTitle('EDUCATION'));
        data.education.forEach((edu) => {
          rightChildren.push(new Paragraph({
            children: [new TextRun({ text: `${edu.degree}${edu.field ? ` (${edu.field})` : ''}`, bold: true, size: 21, color: '111111', font: 'Calibri' })],
            spacing: { after: 20 },
          }));
          rightChildren.push(new Paragraph({
            children: [new TextRun({ text: edu.institution, size: 20, color: '444444', font: 'Calibri' })],
            spacing: { after: 20 },
          }));
          rightChildren.push(new Paragraph({
            children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 19, color: '666666', font: 'Calibri' })],
            spacing: { after: 80 },
          }));
        });
      }

      const execSkillsFlat = getFlattenedSkills(data);
      if (execSkillsFlat.length > 0) {
        rightChildren.push(execSectionTitle('SKILLS'));
        const execGroups = data.skillGroups?.filter((g) =>
          g.skills.some((s) => s.trim())
        );
        if (execGroups && execGroups.length > 0) {
          execGroups.forEach((group, gi) => {
            const items = group.skills.map((s) => s.trim()).filter(Boolean);
            if (items.length === 0) return;
            if (group.category.trim()) {
              rightChildren.push(new Paragraph({
                children: [
                  new TextRun({
                    text: `${group.category.trim()}:`,
                    bold: true,
                    size: 20,
                    color: '111111',
                    font: 'Calibri',
                  }),
                ],
                spacing: { before: gi === 0 ? 0 : 120, after: 40 },
              }));
            }
            if (items.length > 0) {
              rightChildren.push(new Paragraph({
                children: [
                  new TextRun({
                    text: `${items.join(', ')}.`,
                    size: 20,
                    color: '333333',
                    font: 'Calibri',
                  }),
                ],
                spacing: { after: 80 },
              }));
            }
          });
        } else {
          rightChildren.push(new Paragraph({
            children: [
              new TextRun({
                text: `${execSkillsFlat.join(', ')}.`,
                size: 20,
                color: '333333',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 80 },
          }));
        }
      }

      if (data.softSkills && data.softSkills.length > 0) {
        rightChildren.push(execSectionTitle('SOFT SKILLS'));
        data.softSkills.forEach((skill) => {
          rightChildren.push(new Paragraph({
            children: [new TextRun({ text: skill, size: 20, color: '333333', font: 'Calibri' })],
            bullet: { level: 0 },
            spacing: { after: 20 },
          }));
        });
      }

      if (data.certifications && data.certifications.length > 0) {
        rightChildren.push(execSectionTitle('CERTIFICATIONS'));
        data.certifications.forEach((cert) => {
          rightChildren.push(new Paragraph({
            children: [new TextRun({ text: cert.name, bold: true, size: 21, color: '111111', font: 'Calibri' })],
            spacing: { after: 15 },
          }));
          rightChildren.push(new Paragraph({
            children: [new TextRun({ text: `${cert.issuer}${cert.date ? ` (${cert.date})` : ''}`, size: 19, color: '444444', font: 'Calibri' })],
            spacing: { after: 60 },
          }));
        });
      }

      // Build two-column table for the body
      const bodyTable = new Table({
        rows: [new TableRow({
          children: [
            new TableCell({
              children: leftChildren,
              width: { size: 60, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.TOP,
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                right: { style: BorderStyle.SINGLE, size: 4, color: 'D0D0D0' },
              },
              margins: { right: 180 },
            }),
            new TableCell({
              children: rightChildren,
              width: { size: 40, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.TOP,
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              },
              margins: { left: 180 },
            }),
          ],
        })],
        width: { size: 100, type: WidthType.PERCENTAGE },
      });

      const doc = new Document({
        sections: [{
          properties: {
            page: { margin: { top: 500, right: 600, bottom: 500, left: 600 } },
          },
          children: [...headerChildren, bodyTable],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${data.personalInfo.fullName || 'Resume'}_Executive.docx`);
      return;
    }

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

    // Soft Skills
    if (data.softSkills && data.softSkills.length > 0) {
      sections.push(createSectionHeading('SOFT SKILLS'));
      sections.push(
        new Paragraph({
          text: data.softSkills.join(', '),
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
