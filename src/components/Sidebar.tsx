import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Share2, Network, Link as LinkIcon, Instagram, ShieldCheck, Lock, User, LogOut } from 'lucide-react';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { isPremium } = usePremium();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-16 sm:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
      <div className="p-4 border-b border-gray-200 flex items-center justify-center sm:justify-start gap-3">
        <img src="https://drive.google.com/uc?export=view&id=1xMF-sFJbOwLk6QHkrchImQL4gvUtUaTb" alt="KrrishSec Logo" className="w-8 h-8 flex-shrink-0"/>
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">KrrishSec Tools</h1>
      </div>
      <nav className="flex-1 p-2 sm:p-4 space-y-2">
        <NavItem icon={<LayoutDashboard />} label="Dashboard" to="/" />
        <h2 className="px-2 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:block">Tools</h2>
        <NavItem icon={<Share2 />} label="Social Media Finder" to="/social" />
        <NavItem icon={<Network />} label="Subdomain Finder" to="/subdomain" />
        <NavItem icon={<LinkIcon />} label="URL Extractor" to="/url" />
        <NavItem 
          icon={<ShieldCheck />} 
          label="WHOIS Lookup" 
          to="/whois"
          isPremium={true}
          isUnlocked={isPremium}
        />
      </nav>
      <div className="p-2 sm:p-4 border-t border-gray-200 space-y-2">
        <NavItem icon={<User />} label="About Me" to="/about" />
        <a 
          href="https://www.instagram.com/krrish_hack" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center sm:justify-start gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors w-full"
        >
          <Instagram className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium hidden sm:block">Follow on Instagram</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center sm:justify-start gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="hidden sm:block text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isPremium?: boolean;
  isUnlocked?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isPremium, isUnlocked }) => {
  return (
    <NavLink
      to={to}
      title={label}
      end
      className={({ isActive }) => `
        w-full flex items-center justify-center sm:justify-start gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors 
        ${isActive 
          ? 'bg-blue-600 text-white shadow' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
      `}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 flex-shrink-0' })}
      <span className="hidden sm:block flex-1 text-left">{label}</span>
      {isPremium && !isUnlocked && <Lock className="w-4 h-4 flex-shrink-0 text-yellow-500" />}
    </NavLink>
  );
};

export default Sidebar;
