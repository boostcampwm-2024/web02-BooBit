import React from 'react';
import { LayoutProps } from '../../../shared/types/LayoutProps';

const BoxContainer: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`w-100% h-48 mb-10 bg-surface-default border-border-default border-[1px]`}>
      {children}
    </div>
  );
};

export default BoxContainer;
