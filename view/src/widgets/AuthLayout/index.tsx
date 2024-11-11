import React from 'react';
import { LayoutProps } from '../../shared/types/LayoutProps';

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center px-[38vw]">
      {children}
    </div>
  );
};

export default AuthLayout;
