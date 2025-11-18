import React from 'react';
import { ShieldCheck } from 'lucide-react';

const WhoisLookup: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        WHOIS Lookup (Premium)
      </h1>
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700">Feature Unlocked!</h2>
        <p className="text-gray-500 mt-2">
          Thank you for your support! The WHOIS Lookup tool is currently under development and will be available here soon.
        </p>
      </div>
    </div>
  );
};

export default WhoisLookup;
