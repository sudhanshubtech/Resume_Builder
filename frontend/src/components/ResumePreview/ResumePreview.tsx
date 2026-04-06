import React from 'react';
import type { ResumeData, TemplateType } from '../../types/resume';
import { ModernTemplate } from '../templates/ModernTemplate';
import { ClassicTemplate } from '../templates/ClassicTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';
import { CreativeTemplate } from '../templates/CreativeTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div className="resume-preview" id="resume-preview">
      {renderTemplate()}
    </div>
  );
};
