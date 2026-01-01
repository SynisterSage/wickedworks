
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch, extractNodes } from '../lib/shopify/client';
import { PRODUCTS_QUERY } from '../lib/shopify/queries';

interface ProductFilters {
  searchQuery?: string;
  categories?: string[];
  sizes?: string[];
  colors?: string[];
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useProducts(filters: ProductFilters) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Shopify or use mocks
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        if (USE_MOCKS) {
          // Use mock data
          const products = MOCK_PRODUCTS.map(mapProductFromGraphQL);
          setAllProducts(products);
        } else {
          // Fetch from Shopify
          const response = await shopifyFetch<{ products: { edges: Array<{ node: any }> } }>({
            query: PRODUCTS_QUERY,
            variables: {
              first: 50,
              sortKey: 'CREATED_AT',
              reverse: true,
            },
          });

          if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Failed to fetch products');
          }

          const nodes = extractNodes(response.data?.products);
          const products = nodes.map(mapProductFromGraphQL);
          setAllProducts(products);
        }
      } catch (err) {
        console.error('[useProducts] Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        // Fallback to mocks on error
        setAllProducts(MOCK_PRODUCTS.map(mapProductFromGraphQL));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    const lowercasedQuery = (filters.searchQuery || '').trim().toLowerCase();
    const selectedCategories = filters.categories || [];
    const selectedSizes = filters.sizes || [];
    const selectedColors = filters.colors || [];

    if (!allProducts) return [];
    
    return allProducts.filter(product => {
      const searchMatch = !lowercasedQuery || 
        product.title.toLowerCase().includes(lowercasedQuery) || 
        product.handle.toLowerCase().includes(lowercasedQuery);
      
      const catMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);

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

  return { products: filteredProducts, loading, error };
}
