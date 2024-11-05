import React, { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return <div className="w-screen h-screen px-[36vw]">{children}</div>;
};

export default AuthLayout;
