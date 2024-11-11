import React from 'react';

const TabItem: React.FC<{
  content: string;
  isSeleted: boolean;
  handleClick: React.Dispatch<React.SetStateAction<string>>;
}> = ({ content, isSeleted, handleClick }) => {
  return (
    <div
      className={`w-1/3 h-[100%] flex items-center justify-center  ${isSeleted ? 'border-b-[2px] border-border-alt text-display-bold-16' : 'available-medium-16'}`}
      onClick={() => handleClick(content)}
    >
      {content}
    </div>
  );
};

export default TabItem;
