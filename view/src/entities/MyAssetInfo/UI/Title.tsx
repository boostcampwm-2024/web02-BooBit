import React from 'react';

const Title: React.FC<{ content: string }> = ({ content }) => {
  return <div className="m-8 text-display-bold-20">{content}</div>;
};

export default Title;
