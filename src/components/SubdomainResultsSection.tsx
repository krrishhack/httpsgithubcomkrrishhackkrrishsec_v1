import React, { useState } from 'react';
import { SubdomainResult, SubdomainWithStatus } from '../types';
import { ExternalLink, AlertCircle, Copy, CheckCircle, ClipboardList, BarChart, AlertTriangle, Loader2 } from 'lucide-react';
import SubdomainStatusBadge from './SubdomainStatusBadge';
import { checkUrlStatus } from '../utils/checkUrlStatus';

interface SubdomainResultsSectionProps {
  results: SubdomainResult[];
}

const SubdomainResultsSection: React.FC<SubdomainResultsSectionProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  const allSubdomains = results.flatMap(r => r.subdomains);
  const totalSubdomains = allSubdomains.length;
  const successfulScans = results.filter(r => !r.error).length;
  const errorScans = results.length - successfulScans;

  const copyAllToClipboard = async () => {
    if (totalSubdomains === 0) return;
    const textToCopy = allSubdomains.map(s => s.name).join('\n');
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert(`${totalSubdomains} subdomains copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy list: ", err);
      alert("Could not copy to clipboard.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">Scan Results</h2>
        {totalSubdomains > 0 && (
          <button
            onClick={copyAllToClipboard}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            Copy All Results
          </button>
        )}
      </div>
      
      {results.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={<BarChart />} label="Domains Scanned" value={results.length} color="blue" />
            <StatCard icon={<ClipboardList />} label="Total Subdomains Found" value={totalSubdomains} color="green" />
            <StatCard icon={<AlertTriangle />} label="Scans with Errors" value={errorScans} color="red" />
        </div>
      )}

      {results.map((result, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
            <h3 className="text-gray-800 font-semibold text-lg flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-gray-500" />
              {result.domain}
            </h3>
            {result.subdomains.length > 0 && (
              <span className="text-sm font-medium text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
                {result.subdomains.length} {result.subdomains.length > 1 ? 'subdomains' : 'subdomain'} found
              </span>
            )}
          </div>

          <div className="p-6">
            {result.error ? (
              <ErrorDisplay message={result.error} />
            ) : result.subdomains.length === 0 ? (
              <NoResultsDisplay />
            ) : (
              <SubdomainList subdomains={result.subdomains} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const SubdomainList: React.FC<{ subdomains: SubdomainWithStatus[] }> = ({ subdomains }) => {
  return (
    <div className="max-h-[40rem] overflow-y-auto pr-2 space-y-2">
      {subdomains.map((sub, subIndex) => (
        <SubdomainItem key={subIndex} initialSubdomain={sub} />
      ))}
    </div>
  );
};

const SubdomainItem: React.FC<{ initialSubdomain: SubdomainWithStatus }> = ({ initialSubdomain }) => {
  const [subdomain, setSubdomain] = useState(initialSubdomain);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCheckStatus = async () => {
    if (isLoading || subdomain.status !== 'unchecked') return;
    setIsLoading(true);
    const newStatus = await checkUrlStatus(subdomain.name);
    setSubdomain({ ...subdomain, status: newStatus });
    setIsLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy item: ", err);
    }
  };

  return (
    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-28 text-center flex-shrink-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          ) : subdomain.status === 'unchecked' ? (
            <button 
              onClick={handleCheckStatus}
              className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
            >
              Check Status
            </button>
          ) : (
            <SubdomainStatusBadge status={subdomain.status} />
          )}
        </div>
        <a 
          href={`https://${subdomain.name}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-mono text-gray-800 hover:text-blue-600 truncate"
        >
          {subdomain.name}
        </a>
      </div>
      <div className="flex items-center flex-shrink-0">
        <button onClick={() => copyToClipboard(subdomain.name)} className="p-1.5 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" disabled={copied} title="Copy subdomain">
          {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
        </button>
        <a href={`https://${subdomain.name}`} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="Open in new tab">
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </a>
      </div>
    </div>
  );
};

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-red-800 font-medium">Error finding subdomains</p>
      <p className="text-red-600 text-sm mt-1">{message}</p>
    </div>
  </div>
);

const NoResultsDisplay = () => (
  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-yellow-800 font-medium">No subdomains found</p>
      <p className="text-yellow-600 text-sm mt-1">Our sources could not find any subdomains for this domain.</p>
    </div>
  </div>
);

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: 'blue' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-600 bg-green-100',
        red: 'text-red-600 bg-red-100',
    }
    return (
        <div className="bg-white p-4 rounded-lg border flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[color]}`}>
                {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    )
}

export default SubdomainResultsSection;
