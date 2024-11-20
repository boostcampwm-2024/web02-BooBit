import React from 'react';
import TabItem from './TabItem';

interface TabItemProps {
  selectedCate: string;
  setSelectedCate: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  width?: string;
}

const Tab: React.FC<TabItemProps> = ({
  selectedCate,
  setSelectedCate,
  categories,
  width = 'w-1/3',
}) => {
  return (
    <div className="w-[100%] h-[3rem] flex border-y-[1px] border-border-default">
      {categories.map((c, i) => {
        return (
          <TabItem
            key={i}
            content={c}
            isSeleted={c === selectedCate}
            handleClick={setSelectedCate}
            width={width}
          />
        );
      })}
    </div>
  );
};

export default Tab;
