
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchives } from '../hooks/useArchives';
import { ArchivesPageView } from './ArchivesPage.view';

const ArchivesPageContainer: React.FC = () => {
  const navigate = useNavigate();
  const { upcoming, vaulted, loading, error } = useArchives();

  const handleNotify = (handle: string) => {
    console.log(`Notification request established for: ${handle}`);
    // Real implementation would trigger a subscription mutation or Klaviyo event.
    alert(`Uplink established. You will be notified of ${handle} deployment.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-bg-primary">
        <div className="w-12 h-1 bg-neonRed animate-width-pulse"></div>
        <div className="text-neonRed font-black uppercase tracking-[0.4em] text-[10px] animate-pulse italic">Accessing Archives...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg-primary">
        <h2 className="text-text-secondary uppercase font-black tracking-widest text-4xl mb-4 italic leading-none">Access_Denied.</h2>
        <p className="text-neonRed/60 text-[10px] font-black uppercase tracking-widest mb-10">{error}</p>
        <button onClick={() => navigate('/')} className="text-[10px] font-black text-text-primary border border-white/10 px-8 py-4 hover:bg-neonRed hover:text-white transition-all uppercase tracking-widest">Return to Root</button>
      </div>
    );
  }

  const handleViewProduct = (handle: string) => {
    navigate(`/shop/${handle}`);
  };

  return (
    <ArchivesPageView 
      upcoming={upcoming}
      vaulted={vaulted}
      onNotify={handleNotify}
    />
  );
};

export default ArchivesPageContainer;
