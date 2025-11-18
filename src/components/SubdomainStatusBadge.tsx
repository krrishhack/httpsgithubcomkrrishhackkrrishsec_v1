import React from 'react';

interface SubdomainStatusBadgeProps {
  status: number | 'error' | 'unchecked';
}

const SubdomainStatusBadge: React.FC<SubdomainStatusBadgeProps> = ({ status }) => {
  if (status === 'unchecked') {
    return null; // Don't render anything if status is unchecked
  }
  
  let colorClasses = '';
  let text: string;

  if (status === 'error') {
    colorClasses = 'bg-gray-200 text-gray-700';
    text = 'Error';
  } else if (typeof status === 'number') {
    text = status.toString();
    if (status >= 200 && status < 300) {
      colorClasses = 'bg-green-100 text-green-800';
    } else if (status >= 300 && status < 400) {
      colorClasses = 'bg-yellow-100 text-yellow-800';
    } else if (status >= 400 && status < 500) {
      colorClasses = 'bg-orange-100 text-orange-800';
    } else if (status >= 500 && status < 600) {
      colorClasses = 'bg-red-100 text-red-800';
    } else {
      colorClasses = 'bg-gray-200 text-gray-700';
    }
  } else {
    colorClasses = 'bg-gray-200 text-gray-700';
    text = 'N/A';
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-full ${colorClasses}`}>
      {text}
    </span>
  );
};

export default SubdomainStatusBadge;
