import React, { useState, useEffect } from 'react';
import InputSection from '../components/InputSection';
import SubdomainResultsSection from '../components/SubdomainResultsSection';
import SubdomainHistorySection from '../components/SubdomainHistorySection';
import { SubdomainResult, SubdomainHistoryEntry, SubdomainWithStatus } from '../types';
import { extractDomain } from '../utils/urlNormalizer';
import { fetchSubdomains } from '../utils/subdomainFetcher';
import { AlertCircle, Loader2, Search, Upload, History as HistoryIcon, Network } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useUsage } from '../contexts/UsageContext';

type View = 'single' | 'file' | 'history';

const SubdomainFinder: React.FC = () => {
  const [results, setResults] = useState<SubdomainResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('single');
  const [history, setHistory] = useLocalStorage<SubdomainHistoryEntry[]>('subdomain-history', []);
  const [progressMessage, setProgressMessage] = useState('');
  const { checkAndIncrementScan, checkAndIncrementFileUpload } = useUsage();

  useEffect(() => {
    if (view === 'history') {
      setResults([]);
    }
  }, [view]);

  const handleExtract = async (domains: string[], isFileUpload: boolean) => {
    if (isFileUpload) {
      if (!checkAndIncrementFileUpload()) return;
    } else {
      if (!checkAndIncrementScan()) return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setProgressMessage('');
    if (view === 'history') {
      setView('single');
    }

    const processDomain = async (domain: string): Promise<SubdomainResult> => {
      const domainName = extractDomain(domain);
      try {
        const subdomains = await fetchSubdomains(
          domainName,
          (message) => setProgressMessage(message)
        );
        const subdomainsWithStatus: SubdomainWithStatus[] = subdomains.map(name => ({ name, status: 'unchecked' }));
        return { domain: domainName, subdomains: subdomainsWithStatus };
      } catch (err) {
        return {
          domain: domainName,
          subdomains: [],
          error: err instanceof Error ? err.message : 'Unknown error occurred',
        };
      }
    };

    const newResults = await Promise.all(domains.map(processDomain));

    if (newResults.some(r => !r.error && r.subdomains.length > 0)) {
      const newHistoryEntry: SubdomainHistoryEntry = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        results: newResults,
      };
      setHistory([newHistoryEntry, ...history]);
    }

    setResults(newResults);
    setLoading(false);
  };
  
  const renderLoadingState = () => (
    <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200 mt-8">
      <div className="max-w-md mx-auto">
        <div className="text-blue-600 mx-auto mb-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Finding Subdomains...</h3>
        <p className="text-gray-600 min-h-[2rem]">
          {progressMessage || 'Aggregating results from multiple sources...'}
        </p>
      </div>
    </div>
  );

  const renderInitialState = () => (
     <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200 mt-8">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Network className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Scan</h3>
          <p className="text-gray-600">Enter a domain or upload a .txt file to start finding subdomains.</p>
        </div>
      </div>
  );

  const renderContent = () => {
    if (view === 'history') {
      return <SubdomainHistorySection history={history} setHistory={setHistory} />;
    }
    if (loading) {
      return renderLoadingState();
    }
    if (results.length > 0) {
      return <SubdomainResultsSection results={results} />;
    }
    if (error) {
       return (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 my-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">An error occurred</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        );
    }
    return renderInitialState();
  };

  return (
    <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Network className="w-8 h-8" />
          Subdomain Finder
        </h1>
        <p className="text-gray-600 mb-8">Discover subdomains for any domain and check their live HTTP status on-demand.</p>

        <div className="bg-white rounded-lg shadow-md p-2 mb-8 border border-gray-200">
          <div className="flex gap-2">
            <NavButton icon={<Search />} label="Single Domain" active={view === 'single'} onClick={() => setView('single')} />
            <NavButton icon={<Upload />} label="File Upload" active={view === 'file'} onClick={() => setView('file')} />
            <NavButton icon={<HistoryIcon />} label="History" active={view === 'history'} onClick={() => setView('history')} />
          </div>
        </div>

        {view !== 'history' && <InputSection onExtract={(domains, isFile) => handleExtract(domains, isFile)} loading={loading} activeTab={view} setActiveTab={setView} />}
        
        <div className="mt-8">
          {renderContent()}
        </div>
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

export default SubdomainFinder;
