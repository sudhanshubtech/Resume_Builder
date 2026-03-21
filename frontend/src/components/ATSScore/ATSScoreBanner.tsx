import { useMemo, useState } from 'react';
import type { ResumeData } from '../../types/resume';
import { calculateATSScore } from '../../utils/atsScore';
import type { ATSBreakdown } from '../../utils/atsScore';
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaLightbulb } from 'react-icons/fa';
import './ATSScoreBanner.css';

interface ATSScoreBannerProps {
  data: ResumeData;
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 25) return 'Needs Work';
  return 'Low';
}

function getScoreIcon(score: number) {
  if (score >= 75) return <FaCheckCircle />;
  if (score >= 50) return <FaExclamationTriangle />;
  return <FaTimesCircle />;
}

function CategoryBar({ item }: { item: ATSBreakdown }) {
  const pct = item.maxScore > 0 ? (item.score / item.maxScore) * 100 : 0;
  const color = getScoreColor(pct);

  return (
    <div className="ats-category">
      <div className="ats-category-header">
        <span className="ats-category-label">{item.label}</span>
        <span className="ats-category-score" style={{ color }}>
          {item.score}/{item.maxScore}
        </span>
      </div>
      <div className="ats-category-bar-bg">
        <div
          className="ats-category-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {item.tips.length > 0 && (
        <ul className="ats-category-tips">
          {item.tips.map((tip, i) => (
            <li key={i}>
              <FaLightbulb className="tip-icon" />
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const ATSScoreBanner: React.FC<ATSScoreBannerProps> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const result = useMemo(() => calculateATSScore(data), [data]);
  const { totalScore, breakdown } = result;

  const color = getScoreColor(totalScore);
  const label = getScoreLabel(totalScore);
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  const topTips = breakdown
    .flatMap((b) => b.tips)
    .slice(0, 3);

  return (
    <div className="ats-banner">
      <div className="ats-banner-main" onClick={() => setExpanded(!expanded)}>
        <div className="ats-gauge-wrapper">
          <svg className="ats-gauge" viewBox="0 0 100 100">
            <circle
              className="ats-gauge-bg"
              cx="50"
              cy="50"
              r="42"
              strokeWidth="8"
              fill="none"
            />
            <circle
              className="ats-gauge-fill"
              cx="50"
              cy="50"
              r="42"
              strokeWidth="8"
              fill="none"
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="ats-gauge-text">
            <span className="ats-gauge-number" style={{ color }}>{totalScore}</span>
          </div>
        </div>

        <div className="ats-banner-info">
          <div className="ats-banner-title">
            <span className="ats-score-icon" style={{ color }}>
              {getScoreIcon(totalScore)}
            </span>
            <h2>ATS Score: <span style={{ color }}>{label}</span></h2>
          </div>
          {!expanded && topTips.length > 0 && (
            <p className="ats-banner-hint">
              <FaLightbulb className="hint-icon" />
              {topTips[0]}
            </p>
          )}
        </div>

        <button className="ats-expand-btn" aria-label={expanded ? 'Collapse' : 'Expand'}>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
          <span>{expanded ? 'Less' : 'Details'}</span>
        </button>
      </div>

      {expanded && (
        <div className="ats-banner-details">
          <div className="ats-breakdown-grid">
            {breakdown.map((item) => (
              <CategoryBar key={item.label} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
