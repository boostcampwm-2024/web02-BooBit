import React from 'react';
import { LayoutProps } from '../../../shared/types/LayoutProps';

const MainviewLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <article className={`basis-4/5 min-h-64 pl-[6vw] pt-14 text-text-light`}>{children}</article>
  );
};

export default MainviewLayout;
