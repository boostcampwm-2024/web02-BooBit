import React from 'react';
import { LayoutProps } from '../../../shared/types/LayoutProps';

const SubviewLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <nav className={`basis-1/5 min-h-64 px-5 py-16 text-text-light text-available-medium-16`}>
      <ul className="list-disc">{children}</ul>
    </nav>
  );
};

export default SubviewLayout;
