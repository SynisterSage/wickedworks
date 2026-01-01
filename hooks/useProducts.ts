
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
  intent?: string;
  sort?: 'new' | 'best' | 'featured' | 'price-asc' | 'price-desc';
  priceMin?: number;
  priceMax?: number;
}

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export function useProducts(filters: ProductFilters) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availablePriceRange, setAvailablePriceRange] = useState<{ min: number; max: number } | null>(null);

  // Build derived facets from product catalog
  const hydrateFacets = (products: Product[]) => {
    const colorSet = new Set<string>();
    let min = Number.POSITIVE_INFINITY;
    let max = 0;

    products.forEach((p) => {
      const colorOpt = p.options.find((o) => o.name.toLowerCase() === 'color');
      colorOpt?.values.forEach((val) => colorSet.add(val));

      const amount = Number(p.priceRange?.minVariantPrice?.amount || 0);
      if (!Number.isNaN(amount)) {
        min = Math.min(min, amount);
        max = Math.max(max, amount);
      }
    });

    setAvailableColors(Array.from(colorSet));
    if (min !== Number.POSITIVE_INFINITY) {
      setAvailablePriceRange({ min, max });
    }
  };

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
          hydrateFacets(products);
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
          hydrateFacets(products);
        }
      } catch (err) {
        console.error('[useProducts] Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        // Fallback to mocks on error
        const products = MOCK_PRODUCTS.map(mapProductFromGraphQL);
        setAllProducts(products);
        hydrateFacets(products);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    const lowercasedQuery = (filters.searchQuery || '').trim().toLowerCase();
    const selectedCategories = filters.categories?.map(c => c.toLowerCase()) || [];
    const selectedSizes = filters.sizes || [];
    const selectedColors = filters.colors || [];
    const intent = filters.intent?.toLowerCase();
    const priceMin = typeof filters.priceMin === 'number' ? filters.priceMin : undefined;
    const priceMax = typeof filters.priceMax === 'number' ? filters.priceMax : undefined;

    if (!allProducts) return [];
    const intentKeywords: Record<string, string[]> = {
      commute: ['commute', 'urban', 'city', 'everyday', 'daily'],
      travel: ['travel', 'carry', 'pack', 'flight', 'airport'],
      cold: ['cold', 'winter', 'thermal', 'insulated', 'heated'],
      run: ['run', 'runner', 'jog', 'sprint'],
      training: ['train', 'gym', 'workout'],
    };
    
    const base = allProducts.filter(product => {
      const searchMatch = !lowercasedQuery || 
        product.title.toLowerCase().includes(lowercasedQuery) || 
        product.handle.toLowerCase().includes(lowercasedQuery);
      
      const catLower = (product.category || '').toLowerCase();
      const titleLower = product.title?.toLowerCase() || '';
      const tagsLower = (product.tags || []).map(t => t.toLowerCase());

      const matchesCategory = (cat: string) => {
        const c = cat.toLowerCase();
        if (c === 'outerwear') {
          return catLower.includes('outer') ||
            ['jacket', 'coat', 'vest', 'thermal', 'heated'].some(k => titleLower.includes(k) || tagsLower.some(t => t.includes(k))) ||
            tagsLower.some(t => t.includes('outer'));
        }
        if (c === 'bags' || c === 'bag') {
          return catLower.includes('bag') ||
            ['bag', 'chest', 'sling', 'pack'].some(k => titleLower.includes(k) || tagsLower.some(t => t.includes(k)));
        }
        if (c === 'accessories' || c === 'accessory') {
          return catLower.includes('accessor') || tagsLower.some(t => t.includes('accessor')) || titleLower.includes('usb') || tagsLower.some(t => t.includes('usb'));
        }
        if (c === 'apparel' || c === 'clothing') {
          return catLower.includes('cloth') || catLower.includes('apparel') || tagsLower.some(t => t.includes('cloth') || t.includes('apparel') || t.includes('wear'));
        }
        if (c === 'footwear' || c === 'shoes') {
          return catLower.includes('foot') ||
            ['shoe', 'boot', 'sneaker'].some(k => titleLower.includes(k) || tagsLower.some(t => t.includes(k)));
        }
        return catLower.includes(c) || titleLower.includes(c) || tagsLower.some(t => t.includes(c));
      };

      const catMatch = selectedCategories.length === 0 || selectedCategories.some(matchesCategory);

      const sizeOption = product.options.find(opt => opt.name.toLowerCase() === 'size');
      const sizeMatch = selectedSizes.length === 0 || (
        sizeOption && sizeOption.values.some(val => selectedSizes.includes(val))
      );
      
      const colorOption = product.options.find(opt => opt.name.toLowerCase() === 'color');
      const colorMatch = selectedColors.length === 0 || (
        colorOption && colorOption.values.some(val => selectedColors.includes(val))
      );

      const matchesIntent = (intentValue: string) => {
        const keywords = intentKeywords[intentValue] || [intentValue];
        return keywords.some(k =>
          tagsLower.some(t => t.includes(k)) ||
          titleLower.includes(k) ||
          catLower.includes(k) ||
          (product.description || '').toLowerCase().includes(k)
        );
      };

      const intentMatch = !intent || matchesIntent(intent);

      const priceAmount = Number(product.priceRange?.minVariantPrice?.amount || 0);
      const priceMatch = (
        (priceMin === undefined || priceAmount >= priceMin) &&
        (priceMax === undefined || priceAmount <= priceMax)
      );

      return searchMatch && catMatch && sizeMatch && colorMatch && intentMatch && priceMatch;
    });

    // Sorting
    const sorted = [...base];
    switch (filters.sort) {
      case 'price-asc':
        sorted.sort((a, b) => (a.priceRange.minVariantPrice.amount || 0) - (b.priceRange.minVariantPrice.amount || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.priceRange.minVariantPrice.amount || 0) - (a.priceRange.minVariantPrice.amount || 0));
        break;
      case 'new':
        sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'best':
      case 'featured':
      default:
        break;
    }
    return sorted;
  }, [allProducts, filters]);

  return { products: filteredProducts, loading, error, facets: { colors: availableColors, priceRange: availablePriceRange } };
}
