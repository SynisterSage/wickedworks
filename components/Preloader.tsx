
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-preloader flex flex-col items-center justify-center bg-bg-primary transition-opacity duration-500 overflow-hidden">
      <div className="relative flex flex-col items-center gap-6">
        <h1 className="text-4xl font-black uppercase tracking-[-0.05em] text-text-primary leading-none italic animate-fade-in-out">
          Wicked
          <span className="text-neonRed not-italic">
            Works
          </span>
        </h1>
        <div className="w-32 h-1 bg-bg-contrast-05 relative overflow-hidden mt-2">
           <div className="absolute top-0 left-0 h-full w-1/3 bg-neonRed animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
