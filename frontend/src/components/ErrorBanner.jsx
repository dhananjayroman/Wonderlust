import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorBanner = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <span className="font-medium text-sm md:text-base">{message || 'Something went wrong.'}</span>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 text-sm font-semibold bg-white px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
