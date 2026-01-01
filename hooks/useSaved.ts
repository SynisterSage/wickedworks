
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';

export function useSaved() {
  const [savedHandles, setSavedHandles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ww_saved_archive');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse saved items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ww_saved_archive', JSON.stringify(savedHandles));
  }, [savedHandles]);

  const toggleSave = useCallback((handle: string) => {
    setSavedHandles(prev => {
      const isSaved = prev.includes(handle);
      if (isSaved) {
        return prev.filter(h => h !== handle);
      } else {
        return [...prev, handle];
      }
    });
  }, []);

  const savedProducts = useMemo(() => {
    // In a real app, you might fetch these products by their handles.
    // For this mock setup, we filter the global mock list.
    const allProducts = MOCK_PRODUCTS.map(mapProductFromGraphQL);
    return allProducts.filter(p => savedHandles.includes(p.handle));
  }, [savedHandles]);

  // Mocking loading/error states for future real-world implementation
  const loading = false;
  const error = null;

  return {
    savedProducts,
    savedHandles,
    toggleSave,
    loading,
    error,
  };
}
