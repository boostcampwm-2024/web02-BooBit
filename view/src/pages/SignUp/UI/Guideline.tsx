import React from 'react';

interface GuidelineProps {
  content: string;
}

const Guideline: React.FC<GuidelineProps> = ({ content }) => {
  return <div className="text-available-medium-16 text-text-dark">🗨️ {content}</div>;
};

export default Guideline;
