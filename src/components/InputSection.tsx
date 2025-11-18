import React, { useState } from 'react';
import { Search, Upload, Loader2 } from 'lucide-react';

type View = 'single' | 'file' | 'history';

interface InputSectionProps {
  onExtract: (domains: string[], isFileUpload: boolean) => void;
  loading: boolean;
  activeTab: View;
  setActiveTab: (view: View) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onExtract, loading, activeTab }) => {
  const [singleDomain, setSingleDomain] = useState('');

  const handleSingleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleDomain.trim()) {
      onExtract([singleDomain.trim()], false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const domains = content
          .split(/[\n\r]+/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        
        if (domains.length > 0) {
          onExtract(domains, true);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = ''; // Reset file input
  };

  return (
    <div>
      {activeTab === 'single' && (
        <form onSubmit={handleSingleDomainSubmit}>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={singleDomain}
              onChange={(e) => setSingleDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !singleDomain.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Start Scan
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'file' && (
        <div>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
              <p className="text-base text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500 mt-1">
                .txt file with one domain per line
              </p>
            </div>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>File Format:</strong> Each domain should be on a new line.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              e.g., example.com<br/>
              subdomain.example.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSection;
