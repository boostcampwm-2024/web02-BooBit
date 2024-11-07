import React from 'react';

interface TitleProps {
  content: string;
}

const Title: React.FC<TitleProps> = ({ content }) => {
  return <div className="text-display-bold-24 mb-6">{content}</div>;
};

export default Title;
