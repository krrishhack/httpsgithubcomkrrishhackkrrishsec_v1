import React from 'react';
import { Lock } from 'lucide-react';

interface PremiumGateProps {
  onUnlock: () => void;
  isPage?: boolean;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ onUnlock, isPage = false }) => {
  const content = (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center border border-gray-200 transform hover:scale-105 transition-transform duration-300">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-6 shadow-lg">
        <Lock className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Unlock Premium Feature</h2>
      <p className="text-gray-600 mb-6">
        This is a premium feature. To gain access, please make a donation to support the development of these tools.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Donate via UPI</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">Scan the QR code with any UPI app or use the UPI ID below.</p>
          
          <div className="flex justify-center mb-4">
              <div className="w-48 h-48 p-2 bg-white rounded-lg flex items-center justify-center border">
                  <img src="https://i.ibb.co/G08f1Z5/paytm-qr.jpg" alt="UPI QR Code" className="w-full h-full object-contain rounded-md" />
              </div>
          </div>

          <p className="text-sm text-gray-600 mb-1">UPI ID:</p>
          <p className="text-xl font-bold font-mono text-blue-700 bg-blue-100 px-4 py-2 rounded-lg inline-block">
              9818012911@ptsbi
          </p>
      </div>

      <button
        onClick={onUnlock}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
      >
        I have paid, Unlock Now!
      </button>
      <p className="text-xs text-gray-400 mt-4">
          Note: This is a simulated process. Clicking the button will grant immediate access.
      </p>
    </div>
  );

  if (isPage) {
    return (
      <div className="flex items-center justify-center h-full animate-fade-in">
        {content}
      </div>
    );
  }

  return content;
};

export default PremiumGate;
