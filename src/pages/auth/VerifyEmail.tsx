import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { MailCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const unverifiedUserStr = localStorage.getItem('krrishsec-unverified-user');
  const unverifiedUser = unverifiedUserStr ? JSON.parse(unverifiedUserStr) : null;

  const handleVerification = () => {
    if (!unverifiedUser) {
      navigate('/signup');
      return;
    }
    
    // 1. Add user to the main users list
    const storedUsers = JSON.parse(localStorage.getItem('krrishsec-users') || '{}');
    storedUsers[unverifiedUser.email] = unverifiedUser;
    localStorage.setItem('krrishsec-users', JSON.stringify(storedUsers));
    
    // 2. Log the user in
    login(unverifiedUser as User);

    // 3. Clean up
    localStorage.removeItem('krrishsec-unverified-user');
    
    // 4. Redirect
    navigate('/');
  };

  return (
    <AuthLayout title="Verify Your Email">
      <div className="text-center">
        <MailCheck className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <p className="text-gray-600 mb-6">
          A verification email has been sent to <strong className="text-gray-800">{unverifiedUser?.email || 'your email'}</strong>. 
          In a real application, you would click the link in that email. For this demo, click the button below to continue.
        </p>
        <button
          onClick={handleVerification}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Continue (Simulate Verification)
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
