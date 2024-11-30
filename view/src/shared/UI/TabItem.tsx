import React from 'react';

interface TabItemProps {
  content: string;
  isSeleted: boolean;
  handleClick: React.Dispatch<React.SetStateAction<string>>;
  width?: string;
}

const TabItem: React.FC<TabItemProps> = ({ content, isSeleted, handleClick, width }) => {
  const selectedClasses = 'border-b-[2px] border-border-alt text-display-bold-16';

  return (
    <div
      className={`${width} h-[100%] flex items-center justify-center ${isSeleted ? selectedClasses : 'cursor-pointer available-medium-16'}`}
      onClick={() => handleClick(content)}
    >
      {content}
    </div>
  );
};

export default TabItem;
