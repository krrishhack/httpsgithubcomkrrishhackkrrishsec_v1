import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SocialMediaFinder from './pages/SocialMediaFinder';
import SubdomainFinder from './pages/SubdomainFinder';
import UrlExtractor from './pages/UrlExtractor';
import WhoisLookup from './pages/WhoisLookup';
import AboutMe from './pages/AboutMe';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { usePremium } from './hooks/usePremium';
import PremiumGate from './components/PremiumGate';
import UsageLimitModal from './components/UsageLimitModal';
import { useUsage } from './contexts/UsageContext';

function App() {
  const { isPremium } = usePremium();
  const { showLoginModal, showPaywallModal, closeModals } = useUsage();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="social" element={<SocialMediaFinder />} />
          <Route path="subdomain" element={<SubdomainFinder />} />
          <Route path="url" element={<UrlExtractor />} />
          <Route path="whois" element={isPremium ? <WhoisLookup /> : <PremiumGate onUnlock={() => {}} isPage={true} />} />
          <Route path="about" element={<AboutMe />} />
        </Route>
      </Routes>
      
      {showLoginModal && <UsageLimitModal type="login" onClose={closeModals} />}
      {showPaywallModal && <UsageLimitModal type="paywall" onClose={closeModals} />}
    </>
  );
}

export default App;
