import React from 'react';

interface SubmitButtonProps {
  content: string;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ content, onClick }) => (
  <button
    className="w-[100%] h-[4rem] mt-[1rem] mb-[0.5rem] rounded-[5px] text-display-bold-24 text-text-light bg-accent"
    onClick={onClick}
  >
    {content}
  </button>
);

export default SubmitButton;
