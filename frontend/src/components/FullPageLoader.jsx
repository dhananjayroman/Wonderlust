import React from 'react';
import { Compass, Loader2 } from 'lucide-react';

const FullPageLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Compass className="w-10 h-10 text-primary animate-spin-slow" style={{ animationDuration: '3s' }} />
        </div>
        <h2 className="text-2xl font-bold text-secondary tracking-tight">Wonderlust</h2>
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    </div>
  );
};

export default FullPageLoader;
