import React from 'react';
import { LayoutProps } from '../../../shared/types/LayoutProps';

const MainviewLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <article
      className={`basis-4/5 min-h-[calc(100vh-80px)] pl-[5vw] pt-14 text-text-light border-border-default border-l-[1px]`}
    >
      {children}
    </article>
  );
};

export default MainviewLayout;
