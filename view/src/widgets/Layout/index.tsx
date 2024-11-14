import React from 'react';
import { LayoutProps } from '../../shared/types/LayoutProps';

const Layout: React.FC<LayoutProps> = ({ children, paddingX = 'px-[15rem]', flex = true }) => {
  return (
    <div className={`w-screen min-h-64 ${flex ? 'flex' : ''} ${paddingX} text-text-light`}>
      {children}
    </div>
  );
};

export default Layout;
