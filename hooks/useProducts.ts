
import { useMemo } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';

interface ProductFilters {
  searchQuery?: string;
  categories?: string[];
  sizes?: string[];
  colors?: string[];
}

export function useProducts(filters: ProductFilters) {
  const allProducts = useMemo(() => MOCK_PRODUCTS.map(mapProductFromGraphQL), []);

  const filteredProducts = useMemo(() => {
    const lowercasedQuery = (filters.searchQuery || '').trim().toLowerCase();
    const selectedCategories = filters.categories || [];
    const selectedSizes = filters.sizes || [];
    const selectedColors = filters.colors || [];

    if (!allProducts) return [];
    
    return allProducts.filter(product => {
      const searchMatch = !lowercasedQuery || product.title.toLowerCase().includes(lowercasedQuery) || product.handle.toLowerCase().includes(lowercasedQuery);
      
      const catMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const sizeOption = product.options.find(opt => opt.name.toLowerCase() === 'size');
      const sizeMatch = selectedSizes.length === 0 || (
        sizeOption && sizeOption.values.some(val => selectedSizes.includes(val))
      );
      
      const colorOption = product.options.find(opt => opt.name.toLowerCase() === 'color');
      const colorMatch = selectedColors.length === 0 || (
        colorOption && colorOption.values.some(val => selectedColors.includes(val))
      );

      return searchMatch && catMatch && sizeMatch && colorMatch;
    });
  }, [allProducts, filters]);

  // In a real app, this would be derived from your data fetching library
  const loading = false;
  const error = null;

  return { products: filteredProducts, loading, error };
}
