import React from 'react';
import { Link, Construction } from 'lucide-react';

const UrlExtractor: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
        <Link className="w-8 h-8" />
        URL Extractor
      </h1>
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
        <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-10 h-10 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700">Coming Soon!</h2>
        <p className="text-gray-500 mt-2">This tool will extract all URLs from a given webpage.</p>
      </div>
    </div>
  );
};

export default UrlExtractor;
