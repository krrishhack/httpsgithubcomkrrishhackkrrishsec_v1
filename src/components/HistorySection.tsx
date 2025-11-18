import React from 'react';
import { HistoryEntry } from '../types';
import ResultsSection from './ResultsSection';
import { Calendar, Trash2, ChevronDown, Database } from 'lucide-react';

interface HistorySectionProps {
  history: HistoryEntry[];
  setHistory: (history: HistoryEntry[]) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ history, setHistory }) => {
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire scan history? This action cannot be undone.')) {
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No History Yet</h3>
          <p className="text-gray-600">Your past scan results will appear here once you perform an extraction.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-2 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Scan History</h2>
        <button
          onClick={handleClearHistory}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {history.map((entry) => (
          <details key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 group">
            <summary className="p-4 flex justify-between items-center cursor-pointer list-none hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-800">
                    Scan of {entry.results.length} domain{entry.results.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-4 border-t border-gray-200">
              <ResultsSection results={entry.results} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
