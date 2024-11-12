import React from 'react';

interface SubmitButtonProps {
  height: string;
  content: string;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ height, content, onClick }) => (
  <button
    className={`w-[100%] ${height} mt-[1rem] mb-[0.5rem] rounded-[5px] text-display-bold-24 text-text-light bg-accent`}
    onClick={onClick}
  >
    {content}
  </button>
);

export default SubmitButton;
