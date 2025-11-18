import React, { useState } from 'react';
import InputSection from '../components/InputSection';
import ResultsSection from '../components/ResultsSection';
import HistorySection from '../components/HistorySection';
import { DomainResult, HistoryEntry } from '../types';
import { normalizeUrl, extractDomain } from '../utils/urlNormalizer';
import { fetchPageContent } from '../utils/fetchPageContent';
import { extractSocialLinks } from '../utils/linkExtractor';
import { AlertCircle, FileText, Loader2, Search, Upload, History as HistoryIcon } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useUsage } from '../contexts/UsageContext';

type View = 'single' | 'file' | 'history';

const SocialMediaFinder: React.FC = () => {
  const [results, setResults] = useState<DomainResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('single');
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('social-media-history', []);
  const [scanningCount, setScanningCount] = useState(0);
  const { checkAndIncrementScan, checkAndIncrementFileUpload } = useUsage();

  const handleExtract = async (domains: string[], isFileUpload: boolean) => {
    if (isFileUpload) {
      if (!checkAndIncrementFileUpload()) return;
    } else {
      if (!checkAndIncrementScan()) return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);
    setScanningCount(domains.length);

    const processDomain = async (domain: string): Promise<DomainResult> => {
      const domainName = extractDomain(domain);
      try {
        const normalizedUrl = normalizeUrl(domain);
        const html = await fetchPageContent(normalizedUrl);
        const links = extractSocialLinks(html, normalizedUrl);
        return { domain: domainName, links };
      } catch (err) {
        return {
          domain: domainName,
          links: [],
          error: err instanceof Error ? err.message : 'Unknown error occurred',
        };
      }
    };

    const newResults = await Promise.all(domains.map(processDomain));

    if (newResults.length > 0) {
      const newHistoryEntry: HistoryEntry = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        results: newResults,
      };
      setHistory([newHistoryEntry, ...history]);
    }

    setResults(newResults);
    setLoading(false);
    setScanningCount(0);
  };

  const renderView = () => {
    switch (view) {
      case 'history':
        return <HistorySection history={history} setHistory={setHistory} />;
      case 'single':
      case 'file':
        return (
          <>
            <InputSection onExtract={handleExtract} loading={loading} activeTab={view} setActiveTab={setView} />
            {error && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-4 my-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-semibold">An error occurred</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200 mt-8">
                <div className="max-w-md mx-auto">
                  <div className="text-blue-600 mx-auto mb-4">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Extracting Links...</h3>
                  <p className="text-gray-600">
                    Scanning {scanningCount > 1 ? `${scanningCount} websites` : 'a website'} in parallel. This may take a moment.
                  </p>
                </div>
              </div>
            )}
            {!loading && results.length > 0 && <div className="mt-8"><ResultsSection results={results} /></div>}
            {!loading && results.length === 0 && view !== 'history' && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200 mt-8">
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Scan</h3>
                  <p className="text-gray-600">Enter a domain or upload a .txt file to start extracting social media links.</p>
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Social Media Finder</h1>
        <p className="text-gray-600 mb-8">Extract all social media links from any domain or upload a .txt file.</p>

        <div className="bg-white rounded-lg shadow-md p-2 mb-8 border border-gray-200">
          <div className="flex gap-2">
            <NavButton icon={<Search />} label="Single Domain" active={view === 'single'} onClick={() => setView('single')} />
            <NavButton icon={<Upload />} label="File Upload" active={view === 'file'} onClick={() => setView('file')} />
            <NavButton icon={<HistoryIcon />} label="History" active={view === 'history'} onClick={() => setView('history')} />
          </div>
        </div>
        
        {renderView()}
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
      active
        ? 'bg-blue-600 text-white shadow'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default SocialMediaFinder;
