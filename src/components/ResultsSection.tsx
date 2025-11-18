import React from 'react';
import { DomainResult } from '../types';
import { ExternalLink, AlertCircle, CheckCircle, Copy, BarChart, Link, AlertTriangle } from 'lucide-react';
import SocialIcon from './SocialIcon';

interface ResultsSectionProps {
  results: DomainResult[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results }) => {
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.warn('Clipboard API failed, falling back to execCommand.', err);
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (fallbackErr) {
        console.error('Fallback copy method also failed:', fallbackErr);
        alert('Failed to copy link to clipboard.');
        return; // Exit if fallback fails
      }
    }
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (results.length === 0) {
    return null;
  }

  const totalLinks = results.reduce((sum, r) => sum + r.links.length, 0);
  const successfulScans = results.filter(r => !r.error).length;
  const errorScans = results.length - successfulScans;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Extraction Results</h2>
      
      {results.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={<BarChart />} label="Domains Scanned" value={results.length} color="blue" />
            <StatCard icon={<Link />} label="Total Links Found" value={totalLinks} color="green" />
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
            {result.links.length > 0 && (
              <span className="text-sm font-medium text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
                {result.links.length} {result.links.length > 1 ? 'links' : 'link'} found
              </span>
            )}
          </div>

          <div className="p-6">
            {result.error ? (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error extracting links</p>
                  <p className="text-red-600 text-sm mt-1">{result.error}</p>
                </div>
              </div>
            ) : result.links.length === 0 ? (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">No social media links found</p>
                  <p className="text-yellow-600 text-sm mt-1">This domain appears to have no detectable social media profiles.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {result.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-6 text-center">
                        <SocialIcon iconName={link.icon} size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{link.platform}</p>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm truncate block">{link.url}</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <button onClick={() => copyToClipboard(link.url)} className="p-2 hover:bg-gray-200 rounded-full transition-colors" title="Copy link">
                        {copiedUrl === link.url ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
                      </button>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded-full transition-colors" title="Open link">
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

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

export default ResultsSection;
