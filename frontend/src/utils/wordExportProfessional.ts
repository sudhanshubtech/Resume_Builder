import { 
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
import type { ResumeData } from '../types/resume';

export const generateProfessionalLayout = (data: ResumeData, colors: any) => {
  const sections: (Paragraph | Table)[] = [];

  // Create two-column table for sidebar layout
  const sidebarCells: Paragraph[] = [];
  const mainCells: Paragraph[] = [];

  // SIDEBAR CONTENT (Left Column)
  
  // Name in sidebar
  sidebarCells.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.personalInfo.fullName,
          bold: true,
          size: 32,
          color: 'FFFFFF',
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // Contact Info
  if (data.personalInfo.email || data.personalInfo.phone || data.personalInfo.location) {
    sidebarCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'CONTACT',
            bold: true,
            size: 20,
            color: colors.accent,
          }),
        ],
        spacing: { before: 200, after: 150 },
      })
    );

    if (data.personalInfo.email) {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `✉ ${data.personalInfo.email}`,
              size: 18,
              color: 'FFFFFF',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    if (data.personalInfo.phone) {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `☎ ${data.personalInfo.phone}`,
              size: 18,
              color: 'FFFFFF',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    if (data.personalInfo.location) {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `📍 ${data.personalInfo.location}`,
              size: 18,
              color: 'FFFFFF',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    }
  }

  // Links
  if (data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio) {
    sidebarCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'LINKS',
            bold: true,
            size: 20,
            color: colors.accent,
          }),
        ],
        spacing: { before: 200, after: 150 },
      })
    );

    if (data.personalInfo.linkedin) {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.personalInfo.linkedin.replace(/^https?:\/\//, ''),
              size: 16,
              color: 'E0E0E0',
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }

    if (data.personalInfo.github) {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.personalInfo.github.replace(/^https?:\/\//, ''),
              size: 16,
              color: 'E0E0E0',
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }

    if (data.personalInfo.portfolio) {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.personalInfo.portfolio.replace(/^https?:\/\//, ''),
              size: 16,
              color: 'E0E0E0',
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    sidebarCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'SKILLS',
            bold: true,
            size: 20,
            color: colors.accent,
          }),
        ],
        spacing: { before: 200, after: 150 },
      })
    );

    data.skills.forEach((skill) => {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${skill}`,
              size: 18,
              color: 'FFFFFF',
            }),
          ],
          spacing: { after: 80 },
        })
      );
    });
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    sidebarCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'CERTIFICATIONS',
            bold: true,
            size: 20,
            color: colors.accent,
          }),
        ],
        spacing: { before: 200, after: 150 },
      })
    );

    data.certifications.forEach((cert) => {
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name,
              size: 16,
              color: 'FFFFFF',
              bold: true,
            }),
          ],
          spacing: { after: 50 },
        })
      );
      sidebarCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.issuer,
              size: 14,
              color: 'E0E0E0',
            }),
          ],
          spacing: { after: 100 },
        })
      );
    });
  }

  // MAIN CONTENT (Right Column)
  
  // Professional Summary
  if (data.summary) {
    mainCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'PROFESSIONAL SUMMARY',
            bold: true,
            size: 22,
            color: colors.primary,
          }),
        ],
        spacing: { after: 150 },
        border: {
          bottom: {
            color: colors.primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 15,
          },
        },
      })
    );

    mainCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.summary,
            size: 20,
          }),
        ],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 250 },
      })
    );
  }

  // Professional Experience
  if (data.experience && data.experience.length > 0) {
    mainCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'PROFESSIONAL EXPERIENCE',
            bold: true,
            size: 22,
            color: colors.primary,
          }),
        ],
        spacing: { before: 200, after: 150 },
        border: {
          bottom: {
            color: colors.primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 15,
          },
        },
      })
    );

    data.experience.forEach((exp, index) => {
      // Position and Company
      mainCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 20,
            }),
            new TextRun({
              text: ` | ${exp.company}`,
              size: 20,
            }),
          ],
          spacing: { before: index > 0 ? 200 : 0, after: 80 },
        })
      );

      // Date and Location
      mainCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
              italics: true,
              size: 18,
              color: colors.secondary,
            }),
            exp.location ? new TextRun({
              text: ` | ${exp.location}`,
              italics: true,
              size: 18,
              color: colors.secondary,
            }) : new TextRun({ text: '' }),
          ],
          spacing: { after: 120 },
        })
      );

      // Description
      if (exp.description) {
        const lines = exp.description.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          mainCells.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line.startsWith('•') ? line : `• ${line}`,
                  size: 18,
                }),
              ],
              spacing: { after: 60 },
              indent: { left: 360 },
            })
          );
        });
      }
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    mainCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'EDUCATION',
            bold: true,
            size: 22,
            color: colors.primary,
          }),
        ],
        spacing: { before: 300, after: 150 },
        border: {
          bottom: {
            color: colors.primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 15,
          },
        },
      })
    );

    data.education.forEach((edu, index) => {
      mainCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
              bold: true,
              size: 20,
            }),
          ],
          spacing: { before: index > 0 ? 180 : 0, after: 80 },
        })
      );

      mainCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.institution,
              size: 18,
            }),
          ],
          spacing: { after: 80 },
        })
      );

      const eduDetails: string[] = [];
      if (edu.startDate || edu.endDate) eduDetails.push(`${edu.startDate} - ${edu.endDate}`);
      if (edu.location) eduDetails.push(edu.location);
      if (edu.gpa) eduDetails.push(edu.gpa);

      if (eduDetails.length > 0) {
        mainCells.push(
          new Paragraph({
            children: [
              new TextRun({
                text: eduDetails.join(' | '),
                italics: true,
                size: 18,
                color: colors.secondary,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    mainCells.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'PROJECTS',
            bold: true,
            size: 22,
            color: colors.primary,
          }),
        ],
        spacing: { before: 300, after: 150 },
        border: {
          bottom: {
            color: colors.primary,
            space: 1,
            style: BorderStyle.SINGLE,
            size: 15,
          },
        },
      })
    );

    data.projects.forEach((project, index) => {
      mainCells.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: 20,
            }),
          ],
          spacing: { before: index > 0 ? 180 : 0, after: 80 },
        })
      );

      if (project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0) {
        mainCells.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Technologies: ${project.technologies.join(', ')}`,
                italics: true,
                size: 16,
                color: colors.secondary,
              }),
            ],
            spacing: { after: 80 },
          })
        );
      }

      if (project.description) {
        mainCells.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.description,
                size: 18,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    });
  }

  // Create the two-column table
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: [
      new TableRow({
        children: [
          // Sidebar cell (35% width)
          new TableCell({
            children: sidebarCells,
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: {
              fill: colors.primary,
              type: ShadingType.SOLID,
              color: colors.primary,
            },
            margins: {
              top: 400,
              bottom: 400,
              left: 300,
              right: 300,
            },
            verticalAlign: VerticalAlign.TOP,
          }),
          // Main content cell (65% width)
          new TableCell({
            children: mainCells,
            width: { size: 65, type: WidthType.PERCENTAGE },
            margins: {
              top: 400,
              bottom: 400,
              left: 400,
              right: 300,
            },
            verticalAlign: VerticalAlign.TOP,
          }),
        ],
      }),
    ],
  });

  sections.push(table);
  return sections;
};
