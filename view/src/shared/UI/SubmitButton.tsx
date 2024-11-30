import React from 'react';

interface SubmitButtonProps {
  height: string;
  content: string;
  amount?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  height,
  content,
  amount = 'true',
  onClick,
}) => {
  const disable = amount === '' || amount === '0';
  const disableStyle = disable
    ? 'bg-surface-hover-light text-text-dark'
    : 'bg-accent text-text-light';
  return (
    <button
      className={`w-[100%] ${height}  mt-[1rem] mb-[0.5rem] rounded-[5px] text-display-bold-24  ${disableStyle}`}
      disabled={disable}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default SubmitButton;
