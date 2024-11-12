import React from 'react';
import TabItem from './TabItem';
import CATEGORY from '../consts/category';

const Tab: React.FC<{
  selectedCate: string;
  setSelectedCate: React.Dispatch<React.SetStateAction<string>>;
}> = ({ selectedCate, setSelectedCate }) => {
  return (
    <div className="w-[100%] h-[3rem] flex border-y-[1px] border-border-default">
      {CATEGORY.map((c, i) => {
        return (
          <TabItem
            key={i}
            content={c}
            isSeleted={c === selectedCate}
            handleClick={setSelectedCate}
          />
        );
      })}
    </div>
  );
};

export default Tab;
