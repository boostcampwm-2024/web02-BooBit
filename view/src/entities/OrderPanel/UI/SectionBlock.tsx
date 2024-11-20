import React, { ReactNode } from 'react';

const SectionBlock: React.FC<{
  title: string;
  subtitle?: string;
  children: ReactNode;
}> = ({ title, subtitle, children }) => {
  return (
    <div className="w-[100%] min-h-10 pb-[1.125rem] flex justify-between text-available-medium-16">
      <div className="basis-1/3 flex items-center">
        <div className="text-text-light text-display-bold-18 mr-2">{title}</div>
        {subtitle && <div className="text-text-dark">({subtitle})</div>}
      </div>
      <div className="flex">{children}</div>
    </div>
  );
};
export default SectionBlock;
