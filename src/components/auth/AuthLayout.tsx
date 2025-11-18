import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src="https://drive.google.com/uc?export=view&id=1xMF-sFJbOwLk6QHkrchImQL4gvUtUaTb" alt="KrrishSec Logo" className="w-16 h-16 mx-auto mb-4"/>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
