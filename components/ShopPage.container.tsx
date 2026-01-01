
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopPageView } from './ShopPage.view';
import { useProducts } from '../hooks/useProducts';

const CATEGORIES = ['Outerwear', 'Apparel', 'Bags', 'Accessories'];
const SIZES = ['S', 'M', 'L', 'XL', '8', '9', '10', '11', '30', '32', '34', 'OS'];
const FALLBACK_COLORS = ['Onyx', 'Neon Red', 'Slate'];

interface ShopPageContainerProps {
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

const ShopPageContainer: React.FC<ShopPageContainerProps> = ({ 
  onToggleSave, savedHandles
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [intent, setIntent] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<'new' | 'best' | 'featured' | 'price-asc' | 'price-desc' | undefined>(undefined);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');

  const applyPriceFilters = useCallback((min: string, max: string) => {
    setPriceMin(min);
    setPriceMax(max);
  }, []);

  // Hydrate from query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const intentParam = searchParams.get('intent');
    const sortParam = searchParams.get('sort') as typeof sort;
    const queryParam = searchParams.get('q');

    // Reset all filters, then hydrate from URL (so mega menu clicks don’t accumulate old state)
    setSelectedCategories(categoryParam ? [categoryParam] : []);
    setSelectedSizes([]);
    setSelectedColors([]);
    setIntent(intentParam || undefined);
    setSort(sortParam || undefined);
    setSearchQuery(queryParam || '');
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');
    setPriceMin(priceMinParam || '');
    setPriceMax(priceMaxParam || '');
  }, [searchParams]);
  
  const { products, loading, error, facets } = useProducts({
    searchQuery,
    categories: selectedCategories,
    sizes: selectedSizes,
    colors: selectedColors,
    intent,
    sort,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
  });

  const colorOptions = facets?.colors?.length ? facets.colors : FALLBACK_COLORS;
  
  const handleFilterChange = useCallback((type: 'categories' | 'sizes' | 'colors', value: string) => {
    const setters = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
    };
    const setter = setters[type];
    setter(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  }, []);

  // Update URL when filters change (basic sync for category/intent/sort/search)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedCategories[0]) params.set('category', selectedCategories[0]); else params.delete('category');
    if (intent) params.set('intent', intent); else params.delete('intent');
    if (sort) params.set('sort', sort); else params.delete('sort');
    if (searchQuery) params.set('q', searchQuery); else params.delete('q');
    setSearchParams(params, { replace: true, preventScrollReset: true });
  }, [selectedCategories, intent, sort, searchQuery, setSearchParams]);

  const handleClearFiltersAndSearch = useCallback(() => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
    setIntent(undefined);
    setSort(undefined);
    setPriceMin('');
    setPriceMax('');
  }, []);

  const handleViewProduct = (handle: string) => {
    navigate(`/shop/${handle}`);
  };

  return (
    <ShopPageView
      products={products}
      onViewProduct={handleViewProduct}
      onToggleSave={onToggleSave}
      savedHandles={savedHandles}
      
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sort={sort}
      onSortChange={setSort}
      
      filterOptions={{ categories: CATEGORIES, sizes: SIZES, colors: colorOptions, price: facets?.priceRange }}
      selectedFilters={{ categories: selectedCategories, sizes: selectedSizes, colors: selectedColors, priceMin, priceMax }}
      onPriceApply={applyPriceFilters}
      onFilterChange={handleFilterChange}
      clearFiltersAndSearch={handleClearFiltersAndSearch}
      
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
    />
  );
};

export default ShopPageContainer;
