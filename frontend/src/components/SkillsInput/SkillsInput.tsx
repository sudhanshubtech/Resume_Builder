import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  onBlur?: () => void;
}

const SUGGESTED_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
  'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Dart', 'Lua', 'Shell Scripting',
  'Objective-C', 'Visual Basic .NET', 'Assembly Language', 'Haskell', 'Elixir', 'Clojure',

  // Frontend
  'React', 'React.js', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte', 'HTML5', 'CSS3',
  'Tailwind CSS', 'Bootstrap', 'Material UI', 'Sass/SCSS', 'jQuery', 'Redux', 'Zustand',
  'Webpack', 'Vite', 'Responsive Design', 'Web Accessibility (WCAG)', 'Progressive Web Apps',
  'Single Page Applications', 'Server-Side Rendering', 'GraphQL Client',

  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET Core', 'Ruby on Rails',
  'FastAPI', 'NestJS', 'Laravel', 'Gin', 'Fiber', 'REST API Design', 'GraphQL',
  'Microservices Architecture', 'Event-Driven Architecture', 'Message Queues',

  // Databases & Data
  'SQL', 'NoSQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle Database',
  'SQL Server', 'Microsoft SQL Server', 'T-SQL', 'PL/SQL', 'DynamoDB', 'Cassandra',
  'Elasticsearch', 'Neo4j', 'Firebase Realtime Database', 'Firestore', 'CouchDB',
  'MariaDB', 'InfluxDB', 'Amazon RDS', 'Amazon Redshift', 'Azure SQL Database',
  'Google BigQuery', 'Snowflake', 'Apache Hive', 'Apache HBase', 'Memcached',
  'Database Design', 'Database Administration', 'Query Optimization',
  'Stored Procedures', 'Database Migration', 'Data Modeling', 'ORM',
  'Sequelize', 'Prisma', 'TypeORM', 'Hibernate', 'SQLAlchemy', 'Mongoose',

  // Cloud & DevOps
  'AWS', 'Amazon Web Services', 'Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes',
  'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'CircleCI',
  'AWS Lambda', 'Azure Functions', 'Cloud Architecture', 'Infrastructure as Code',
  'Linux Administration', 'Nginx', 'Apache', 'Serverless Architecture',
  'Helm', 'OpenShift', 'Red Hat OpenShift', 'Istio', 'ArgoCD', 'FluxCD',
  'Rancher', 'Podman', 'Docker Compose', 'Docker Swarm', 'Vagrant', 'Packer',
  'Consul', 'Vault (HashiCorp)', 'Pulumi', 'CloudFormation', 'AWS CDK',
  'Azure DevOps', 'AWS ECS', 'AWS EKS', 'Azure AKS', 'Google GKE',
  'Kustomize', 'Skaffold', 'Tekton', 'Spinnaker', 'Harbor',
  'Chef', 'Puppet', 'SaltStack', 'Bamboo', 'TeamCity', 'Travis CI',
  'Nexus Repository', 'JFrog Artifactory', 'SonarQube', 'Trivy',

  // Data & AI/ML
  'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Analysis',
  'Data Visualization', 'Tableau', 'Power BI', 'Apache Spark', 'Hadoop',
  'ETL Pipelines', 'Data Warehousing', 'Big Data', 'Statistical Modeling',
  'A/B Testing', 'Feature Engineering',

  // Generative AI & Prompt Engineering
  'Prompt Engineering', 'Generative AI', 'Large Language Models', 'ChatGPT', 'GPT-4',
  'Claude', 'Google Gemini', 'LangChain', 'LlamaIndex', 'OpenAI API',
  'Retrieval-Augmented Generation (RAG)', 'Fine-Tuning LLMs', 'Vector Databases',
  'Hugging Face Transformers', 'Stable Diffusion', 'Midjourney', 'DALL-E',
  'AI Agents', 'Autonomous AI Systems', 'Conversational AI', 'Chatbot Development',
  'AI Ethics & Responsible AI', 'MLOps', 'Model Deployment', 'AI-Powered Automation',
  'Copilot Integration', 'Semantic Search', 'Embeddings', 'Pinecone', 'Weaviate',
  'ChromaDB', 'Prompt Optimization', 'Chain-of-Thought Prompting', 'Few-Shot Learning',
  'Transfer Learning', 'Reinforcement Learning', 'Reinforcement Learning from Human Feedback',

  // Mobile
  'React Native', 'Flutter', 'iOS Development', 'Android Development', 'SwiftUI',
  'Jetpack Compose', 'Xamarin', 'Ionic', 'Mobile UI/UX Design',

  // Tools & Practices
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Agile/Scrum',
  'Test-Driven Development', 'CI/CD', 'Unit Testing', 'Integration Testing',
  'Jest', 'Mocha', 'Cypress', 'Selenium', 'Playwright', 'JUnit', 'pytest',
  'Code Review', 'Pair Programming', 'Design Patterns',

  // Security
  'Cybersecurity', 'OWASP', 'Penetration Testing', 'OAuth 2.0', 'JWT Authentication',
  'SSL/TLS', 'Encryption', 'Identity & Access Management', 'Security Auditing',

  // Soft Skills
  'Team Leadership', 'Project Management', 'Communication Skills', 'Problem Solving',
  'Critical Thinking', 'Time Management', 'Stakeholder Management', 'Mentoring',
  'Cross-functional Collaboration', 'Technical Writing', 'Public Speaking',
  'Strategic Planning', 'Conflict Resolution', 'Decision Making',

  // Design
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Adobe Photoshop', 'Adobe Illustrator',
  'Wireframing', 'Prototyping', 'User Research', 'Design Systems',

  // Business & Analytics
  'Business Analysis', 'Product Management', 'Requirements Gathering', 'Process Improvement',
  'KPI Tracking', 'Financial Modeling', 'Market Research', 'Customer Success',
  'CRM (Salesforce)', 'SAP', 'ERP Systems', 'Supply Chain Management',

  // Blockchain & Web3
  'Blockchain', 'Solidity', 'Smart Contracts', 'Ethereum', 'Web3.js', 'DeFi',
  'NFT Development', 'Cryptocurrency',

  // IoT & Embedded
  'Internet of Things (IoT)', 'Embedded Systems', 'Arduino', 'Raspberry Pi',
  'MQTT', 'Edge Computing',

  // Low-Code / No-Code
  'Power Automate', 'Power Apps', 'Zapier', 'Airtable', 'Retool', 'Bubble',
  'ServiceNow', 'Salesforce Development',

  // Data Engineering & Observability
  'Apache Kafka', 'Apache Airflow', 'dbt', 'Snowflake', 'Databricks',
  'Grafana', 'Prometheus', 'Datadog', 'Splunk', 'New Relic',
  'OpenTelemetry', 'Log Management',

  // Certifications & Frameworks
  'AWS Certified Solutions Architect', 'Azure Certified', 'Google Cloud Certified',
  'PMP', 'Scrum Master', 'Six Sigma', 'ITIL', 'CompTIA Security+',
  'Certified Kubernetes Administrator',
];

export const SkillsInput: React.FC<SkillsInputProps> = ({ skills, onChange, onBlur }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = inputValue.trim()
    ? SUGGESTED_SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(inputValue.toLowerCase()) &&
          !skills.some((s) => s.toLowerCase() === skill.toLowerCase())
      ).slice(0, 8)
    : [];

  const addSkill = useCallback((skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...skills, trimmed]);
    }
    setInputValue('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, [skills, onChange]);

  const removeSkill = useCallback((index: number) => {
    onChange(skills.filter((_, i) => i !== index));
    inputRef.current?.focus();
  }, [skills, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        addSkill(filteredSuggestions[highlightedIndex]);
      } else if (inputValue.trim()) {
        addSkill(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Tab' && showSuggestions && filteredSuggestions.length > 0) {
      e.preventDefault();
      const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
      addSkill(filteredSuggestions[idx]);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const highlighted = suggestionsRef.current.children[highlightedIndex] as HTMLElement;
      highlighted?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [inputValue]);

  return (
    <div className="skills-input-container" ref={containerRef}>
      <div
        className="skills-input-wrapper"
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill, index) => (
          <span key={`${skill}-${index}`} className="skill-chip">
            <span className="skill-chip-text">{skill}</span>
            <button
              type="button"
              className="skill-chip-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(index);
              }}
              aria-label={`Remove ${skill}`}
            >
              <FaTimes />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="skills-text-input"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              if (inputValue.trim()) {
                addSkill(inputValue);
              }
              setShowSuggestions(false);
              onBlur?.();
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter...' : 'Add more skills...'}
          autoComplete="off"
        />
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="skills-suggestions" ref={suggestionsRef}>
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`skills-suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                addSkill(suggestion);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {highlightMatchedText(suggestion, inputValue)}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="skills-count">{skills.length} skill{skills.length !== 1 ? 's' : ''} added</div>
      )}
    </div>
  );
};

function highlightMatchedText(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <strong>{text.slice(index, index + query.length)}</strong>
      {text.slice(index + query.length)}
    </>
  );
}
