import React from 'react';
import { LayoutProps } from '../../shared/types/LayoutProps';

const Layout: React.FC<LayoutProps> = ({ children, paddingX = 'px-[15rem]' }) => {
  return <div className={`w-screen min-h-64 flex ${paddingX} text-text-light`}>{children}</div>;
};

export default Layout;
