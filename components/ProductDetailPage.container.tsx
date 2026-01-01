
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductByHandle } from '../hooks/useProductByHandle';
import { ProductDetailPageView } from './ProductDetailPage.view';
import { Variant, Product } from '../types';
import { useCollection } from '../hooks/useCollection';

interface ProductDetailPageContainerProps {
  onAddToCart: (variant: Variant, product: Product) => void;
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

const ProductDetailPageContainer: React.FC<ProductDetailPageContainerProps> = ({ 
  onAddToCart, 
  onToggleSave,
  savedHandles
}) => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { data, loading, error, selectedVariant, selectVariant } = useProductByHandle(handle || null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Collection context can be passed via location state if needed
  // const { data: collectionData } = useCollection(...);

  // SEO: Update page title
  useEffect(() => {
    if (data) {
      document.title = `${data.title} | Wicked Works Technical Archive`;
    }
    return () => {
      document.title = 'Wicked Works Storefront';
    };
  }, [data]);

  // Initialize options once product data arrives
  useEffect(() => {
    if (data && Object.keys(selectedOptions).length === 0) {
      const initial: Record<string, string> = {};
      data.options.forEach(opt => {
        initial[opt.name] = opt.values[0];
      });
      setSelectedOptions(initial);
    }
  }, [data, selectedOptions]);

  const handleSelectOption = (name: string, value: string) => {
    const nextOptions = { ...selectedOptions, [name]: value };
    setSelectedOptions(nextOptions);

    // Find the variant matching all current options
    if (data) {
      const variant = data.variants.find(v => 
        v.selectedOptions.every(so => nextOptions[so.name] === so.value)
      );
      if (variant) selectVariant(variant.gid);
    }
  };

  if (loading) return (
    <div className="pt-40 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-1 bg-neonRed animate-width-pulse"></div>
      <div className="text-neonRed font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Establishing Uplink...</div>
    </div>
  );
  
  if (error || !data) return (
    <div className="pt-40 text-center">
      <h2 className="text-white/20 uppercase font-black tracking-widest text-4xl mb-4">Signal Lost</h2>
      <button 
        onClick={() => navigate('/shop')}
        className="text-[10px] font-black text-neonRed uppercase tracking-widest border border-neonRed/20 px-6 py-3 hover:bg-neonRed hover:text-white transition-all"
      >
        Return to Directory
      </button>
    </div>
  );

  const isSaved = handle ? savedHandles.includes(handle) : false;

  if (!handle) {
    navigate('/shop');
    return null;
  }

  return (
    <ProductDetailPageView 
      product={data}
      selectedVariant={selectedVariant}
      selectedOptions={selectedOptions}
      onSelectOption={handleSelectOption}
      onAddToCart={(variant) => onAddToCart(variant, data)}
      isSaved={isSaved}
      onToggleSave={() => onToggleSave(handle)}
    />
  );
};

export default ProductDetailPageContainer;
