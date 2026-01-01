
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchResultsPageView } from './SearchResultsPage.view';
import { MOCK_PRODUCTS, Icons } from '../constants';
import { Product } from '../types';
import { mapProductFromGraphQL } from '../adapters/shopifyAdapter';

const CATEGORIES = ['Outerwear', 'Footwear', 'Apparel', 'Accessories'];
const SIZES = ['S', 'M', 'L', 'XL', '8', '9', '10', '11', '30', '32', '34', 'OS'];
const COLORS = ['Onyx', 'Neon Red', 'Slate'];

interface SearchResultsPageContainerProps {
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

const SearchResultsPageContainer: React.FC<SearchResultsPageContainerProps> = ({ onToggleSave, savedHandles }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query || '');

  useEffect(() => {
    if (query !== localQuery) {
      setLocalQuery(query || '');
    }
  }, [query]);

  const searchResults = useMemo(() => {
    const trimmedQuery = localQuery.trim().toLowerCase();
    if (!trimmedQuery) return [];
    return MOCK_PRODUCTS
      .filter(p => 
        p.title.toLowerCase().includes(trimmedQuery) || 
        p.productType?.toLowerCase().includes(trimmedQuery) ||
        p.handle.toLowerCase().includes(trimmedQuery)
      )
      .map(mapProductFromGraphQL);
  }, [localQuery]);

  const filteredProducts = useMemo(() => {
    return searchResults.filter(product => {
      const catMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const sizeOption = product.options.find(opt => opt.name.toLowerCase() === 'size');
      const sizeMatch = selectedSizes.length === 0 || (
        sizeOption && sizeOption.values.some(val => selectedSizes.includes(val))
      );
      const colorOption = product.options.find(opt => opt.name.toLowerCase() === 'color');
      const colorMatch = selectedColors.length === 0 || (
        colorOption && colorOption.values.some(val => selectedColors.includes(val))
      );
      return catMatch && sizeMatch && colorMatch;
    });
  }, [searchResults, selectedCategories, selectedSizes, selectedColors]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim() && localQuery.trim() !== query) {
      navigate(`/search?q=${encodeURIComponent(localQuery)}`);
    }
  };

  const handleViewProduct = (handle: string) => {
    navigate(`/shop/${handle}`);
  };

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };
  
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const FilterGroup: React.FC<{ title: string; options: string[]; current: string[]; setter: (l: string[]) => void }> = ({ title, options, current, setter }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-4 bg-neonRed shadow-neon"></div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary italic">{title}</h4>
      </div>
      <div className="space-y-3.5">
        {options.map(opt => {
          const isActive = current.includes(opt);
          return (
            <button key={opt} onClick={() => toggleFilter(current, setter, opt)} className="group flex items-center w-full gap-4 text-left">
              <div className={`w-3.5 h-3.5 border transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-neonRed border-neonRed shadow-neon' : 'border-border-color group-hover:border-neonRed/50'}`}>
                {isActive && <div className="w-1 h-1 bg-white rotate-45" />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${isActive ? 'text-text-primary' : 'text-text-primary/20 group-hover:text-text-primary/40'}`}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const AllFilters = () => (
    <>
      <FilterGroup title="CLASS_CATEGORY" options={CATEGORIES} current={selectedCategories} setter={setSelectedCategories} />
      <FilterGroup title="SPEC_SIZE" options={SIZES} current={selectedSizes} setter={setSelectedSizes} />
      <FilterGroup title="COLOR_PROTOCOL" options={COLORS} current={selectedColors} setter={setSelectedColors} />
    </>
  );

  return (
    <SearchResultsPageView
      query={query}
      filteredProducts={filteredProducts}
      onViewProduct={handleViewProduct}
      onToggleSave={onToggleSave}
      savedHandles={savedHandles}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      clearFilters={clearFilters}
      FilterGroup={AllFilters}
      filterCounts={{
        categories: selectedCategories.length,
        sizes: selectedSizes.length,
        colors: selectedColors.length,
      }}
      localQuery={localQuery}
      setLocalQuery={setLocalQuery}
      onLocalSearch={handleSearchSubmit}
    />
  );
};

export default SearchResultsPageContainer;
