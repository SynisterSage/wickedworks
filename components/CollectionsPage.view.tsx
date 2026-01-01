import React, { useState } from 'react';
import { Collection, Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';
import { Icons } from '../constants';
import GlassCardContainer from './GlassCard.container';

const CollectionCard: React.FC<{ collection: Collection; onClick: () => void; isFeatured?: boolean }> = ({ collection, onClick, isFeatured }) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = collection.image?.url 
    || collection.products?.[0]?.featuredImage?.url 
    || collection.products?.[0]?.images?.[0]?.url 
    || 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  const seriesLabel = collection.series || collection.title || 'ACTIVE SERIES';
  const statusLabel = collection.status || 'ACTIVE';
  const description = collection.description || 'Awaiting deployment description.';
  const assetCount = collection.assetCount ?? collection.products?.length ?? 0;

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden transition-all duration-700 cursor-pointer bg-bg-secondary border border-border-color hover:border-neonRed/30 ${
        isFeatured ? 'h-[500px] md:h-[700px]' : 'aspect-[4/5] md:aspect-[3/4]'
      }`}
    >
      <div className="absolute inset-0">
        <img 
          src={imageUrl}
          alt={collection.title}
          className={`h-full w-full object-cover transition-all duration-[1500ms] ${
            isHovered ? 'scale-105 grayscale-0' : 'scale-100 grayscale opacity-40'
          }`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-70'}`}></div>
      </div>

      <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
        <div className="max-w-xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[9px] font-black tracking-[0.4em] text-neonRed bg-black/60 backdrop-blur-md px-3 py-1.5 border border-neonRed/20 italic">
              {seriesLabel}
            </span>
            <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase italic">
              {statusLabel}
            </span>
          </div>

          <h3 className={`font-black uppercase tracking-tighter transition-all duration-500 mb-4 italic leading-none ${
            isFeatured ? 'text-5xl md:text-8xl' : 'text-3xl md:text-4xl'
          } ${isHovered ? 'text-neonRed drop-shadow-neon' : 'text-white'}`}>
            {collection.title}
          </h3>

          <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${isHovered ? 'grid-rows-[1fr] opacity-100 mb-8' : 'grid-rows-[0fr] opacity-0'}`}>
            <p className="min-h-0 text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] leading-relaxed pr-12 italic">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              {assetCount} ASSETS_STAGED
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 flex items-center gap-3 italic ${
              isHovered ? 'text-white opacity-100 translate-x-0' : 'text-white opacity-0 -translate-x-4'
            }`}>
              INITIALIZE <Icons.ArrowRight />
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
        <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
      </div>
    </div>
  );
};

interface CollectionsPageViewProps {
  collections: Collection[];
  selectedCollection: Collection | null;
  collectionProducts: Product[];
  onSelectCollection: (collection: Collection) => void;
  onClearCollection: () => void;
  onViewProduct: (handle: string, context: { sourceView: 'COLLECTIONS'; sourceHandle: string; }) => void;
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

export const CollectionsPageView: React.FC<CollectionsPageViewProps> = ({
  collections,
  selectedCollection,
  collectionProducts,
  onSelectCollection,
  onClearCollection,
  onViewProduct,
  onToggleSave,
  savedHandles,
}) => {
  const navigate = useNavigate();
  if (selectedCollection) {
    return (
      <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
          <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
            <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-primary/20 tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
            <span className="text-[9px] text-neonRed font-black">/</span>
            <button onClick={onClearCollection} className="text-[9px] font-bold text-text-primary/20 tracking-[0.2em] uppercase hover:text-neonRed transition-colors">COLLECTIONS</button>
            <span className="text-[9px] text-neonRed font-black">/</span>
            <span className="text-[9px] font-black text-text-primary tracking-[0.2em] uppercase italic">{selectedCollection.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 items-end mb-24">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-6">
                <div className="h-8 w-1.5 bg-neonRed shadow-neon"></div>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
                  {selectedCollection.title}.
                </h2>
              </div>
            </div>
            <div className="max-w-md lg:text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-primary/30 leading-relaxed mb-8 italic">
                {selectedCollection.description}
              </p>
              <div className="flex lg:justify-end gap-12">
                <div className="text-right">
                  <span className="block text-[8px] font-black text-text-primary/10 uppercase tracking-[0.4em] mb-1">SERIES_REF</span>
                  <span className="text-sm font-black text-neonRed uppercase tracking-tight italic">{selectedCollection.series}</span>
                </div>
                <div className="text-right">
                   <span className="block text-[8px] font-black text-text-primary/10 uppercase tracking-[0.4em] mb-1">PAYLOAD_SIZE</span>
                   <span className="text-sm font-black text-text-primary uppercase tracking-tight italic">{collectionProducts.length} Units</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {collectionProducts.map((product) => (
              <GlassCardContainer 
                key={product.gid} 
                product={product} 
                onViewProduct={(handle) => onViewProduct(handle, { sourceView: 'COLLECTIONS', sourceHandle: selectedCollection.handle })}
                isSaved={savedHandles.includes(product.handle)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>

          <div className="mt-32 flex justify-center">
             <button 
               onClick={onClearCollection}
               className="flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.5em] text-text-primary/40 hover:text-neonRed transition-all px-12 py-6 bg-bg-contrast-02 border border-border-color hover:border-neonRed/30 italic shadow-2xl"
             >
               <Icons.ArrowLeft /> Back_To_Directory
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-primary/20 tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
          <span className="text-[9px] text-neonRed font-black">/</span>
          <span className="text-[9px] font-black text-text-primary tracking-[0.2em] uppercase italic">COLLECTION_DIRECTORY</span>
          <div className="ml-auto flex items-center gap-4 pl-6">
            <span className="text-[9px] font-mono text-text-primary/10 uppercase tracking-widest hidden md:block italic">Active_Deployments: {collections.length.toString().padStart(2, '0')}</span>
            <span className="text-[9px] font-mono text-neonRed font-black uppercase tracking-widest animate-pulse">SYSTEM: ONLINE</span>
          </div>
        </nav>

        <div className="mb-20">
          <div className="flex items-center gap-8 mb-8">
             <div className="h-10 w-1.5 bg-neonRed shadow-neon"></div>
             <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-text-primary leading-none italic">
              Active <span className="text-neonRed">Collections.</span>
            </h2>
          </div>
          <p className="text-text-primary/30 font-bold text-sm md:text-lg uppercase tracking-[0.15em] max-w-2xl leading-relaxed italic">
            A CURATED DIRECTORY OF ACTIVE TECHNICAL DEPLOYMENTS. EACH SERIES IS ENGINEERED FOR A SPECIFIC URBAN PROTOCOL.
          </p>
        </div>

        {collections.length > 0 && (
          <div className="mb-12">
            <CollectionCard 
              collection={collections[0]} 
              isFeatured 
              onClick={() => onSelectCollection(collections[0])} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {collections.slice(1).map((col) => (
            <CollectionCard 
              key={col.gid} 
              collection={col} 
              onClick={() => onSelectCollection(col)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};