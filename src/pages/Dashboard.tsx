import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Network, Link as LinkIcon, Instagram, Heart, ShieldCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to KrrishSec Tools</h1>
      <p className="text-lg text-gray-600 mb-8">Your all-in-one open-source intelligence toolkit.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Access Tools */}
        <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ToolCard 
                    icon={<Share2 />}
                    title="Social Media Finder"
                    description="Extract social links from any domain."
                    onClick={() => navigate('/social')}
                />
                <ToolCard 
                    icon={<Network />}
                    title="Subdomain Finder"
                    description="Discover subdomains and check their status."
                    onClick={() => navigate('/subdomain')}
                />
            </div>
        </div>

        {/* Support & Community */}
        <div className="lg:row-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-0">Support & Community</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center flex-1">
                <Heart className="w-12 h-12 text-red-500 mb-3" />
                <h3 className="text-lg font-bold text-gray-800">Support Future Updates</h3>
                <p className="text-sm text-gray-600 mt-1 mb-4">Your donations help keep these tools free and actively developed. Scan to donate via UPI.</p>
                <div className="w-48 h-48 p-2 bg-white rounded-lg flex items-center justify-center mb-4 border">
                    <img src="https://i.ibb.co/G08f1Z5/paytm-qr.jpg" alt="UPI QR Code" className="w-full h-full object-contain rounded-md" />
                </div>
                <p className="text-sm text-gray-500 mb-1">UPI ID:</p>
                <p className="text-2xl font-bold font-mono text-blue-700 bg-blue-100 px-4 py-2 rounded-lg">9818012911@ptsbi</p>
            </div>
            <a href="https://www.instagram.com/krrish_hack" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg flex items-center gap-4 transition-transform hover:scale-105">
                <Instagram className="w-10 h-10" />
                <div>
                    <h3 className="text-lg font-bold">Follow on Instagram</h3>
                    <p className="text-sm opacity-90">Get updates and join the community.</p>
                </div>
            </a>
        </div>

        {/* More Tools */}
        <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">More Tools</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ToolCard 
                    icon={<LinkIcon />}
                    title="URL Extractor"
                    description="Extract all URLs from a webpage."
                    onClick={() => navigate('/url')}
                    isComingSoon={true}
                />
                <ToolCard 
                    icon={<ShieldCheck />}
                    title="WHOIS Lookup"
                    description="Get registration data for a domain."
                    onClick={() => navigate('/whois')}
                    isPremium={true}
                />
            </div>
        </div>

      </div>
    </div>
  );
};

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    isComingSoon?: boolean;
    isPremium?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, onClick, isComingSoon, isPremium }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isPremium && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">PREMIUM</div>}
        <div className="relative z-10">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            {isComingSoon && <div className="absolute bottom-4 right-4 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">Coming Soon</div>}
        </div>
    </button>
);


export default Dashboard;
