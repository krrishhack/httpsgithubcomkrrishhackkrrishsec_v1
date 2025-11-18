import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn } from 'lucide-react';
import PremiumGate from './PremiumGate';
import { useUsage } from '../contexts/UsageContext';

interface UsageLimitModalProps {
  type: 'login' | 'paywall';
  onClose: () => void;
}

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({ type, onClose }) => {
  const navigate = useNavigate();
  const { unlockPremium } = useUsage();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const renderContent = () => {
    if (type === 'login') {
      return (
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-6 shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Free Limit Reached</h2>
          <p className="text-gray-600 mb-6">
            You've used all your free scans. Please log in or create an account to continue using the tools.
          </p>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleLogin} className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              Log In / Sign Up
            </button>
          </div>
        </div>
      );
    }

    if (type === 'paywall') {
      return <PremiumGate onUnlock={unlockPremium} />;
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      {renderContent()}
    </div>
  );
};

export default UsageLimitModal;
