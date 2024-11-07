import React from 'react';
import { LayoutProps } from '../../shared/types/LayoutProps';

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="w-screen h-screen px-[36vw]">{children}</div>;
};

export default AuthLayout;
