import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

const FREE_SCAN_LIMIT = 5;
const FREE_FILE_UPLOAD_LIMIT = 20;

interface UsageData {
  scanCount: number;
  fileUploadCount: number;
  isPremium: boolean;
}

interface UsageContextType {
  usage: UsageData;
  setUsage: (usage: UsageData) => void;
  checkAndIncrementScan: () => boolean;
  checkAndIncrementFileUpload: () => boolean;
  unlockPremium: () => void;
  showLoginModal: boolean;
  showPaywallModal: boolean;
  closeModals: () => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userKey = user ? `usage-${user.email}` : 'usage-guest';
  const [usage, setUsage] = useLocalStorage<UsageData>(userKey, {
    scanCount: 0,
    fileUploadCount: 0,
    isPremium: false,
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  const closeModals = () => {
    setShowLoginModal(false);
    setShowPaywallModal(false);
  };
  
  const unlockPremium = () => {
    setUsage({ ...usage, isPremium: true });
    closeModals();
  };

  const checkAndIncrementScan = useCallback(() => {
    if (!isAuthenticated && usage.scanCount >= FREE_SCAN_LIMIT) {
      setShowLoginModal(true);
      return false;
    }
    setUsage(prev => ({ ...prev, scanCount: prev.scanCount + 1 }));
    return true;
  }, [isAuthenticated, usage.scanCount, setUsage]);

  const checkAndIncrementFileUpload = useCallback(() => {
    if (!isAuthenticated) {
        setShowLoginModal(true);
        return false;
    }
    if (!usage.isPremium && usage.fileUploadCount >= FREE_FILE_UPLOAD_LIMIT) {
      setShowPaywallModal(true);
      return false;
    }
    setUsage(prev => ({ ...prev, fileUploadCount: prev.fileUploadCount + 1 }));
    return true;
  }, [isAuthenticated, usage.isPremium, usage.fileUploadCount, setUsage]);

  return (
    <UsageContext.Provider value={{ usage, setUsage, checkAndIncrementScan, checkAndIncrementFileUpload, unlockPremium, showLoginModal, showPaywallModal, closeModals }}>
      {children}
    </UsageContext.Provider>
  );
};

export const useUsage = (): UsageContextType => {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
};
