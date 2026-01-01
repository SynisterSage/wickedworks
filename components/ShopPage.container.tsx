
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopPageView } from './ShopPage.view';
import { useProducts } from '../hooks/useProducts';

const CATEGORIES = ['Outerwear', 'Footwear', 'Apparel', 'Accessories'];
const SIZES = ['S', 'M', 'L', 'XL', '8', '9', '10', '11', '30', '32', '34', 'OS'];
const COLORS = ['Onyx', 'Neon Red', 'Slate'];

interface ShopPageContainerProps {
  onToggleSave: (handle: string) => void;
  savedHandles: string[];
}

const ShopPageContainer: React.FC<ShopPageContainerProps> = ({ 
  onToggleSave, savedHandles
}) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { products, loading, error } = useProducts({
    searchQuery,
    categories: selectedCategories,
    sizes: selectedSizes,
    colors: selectedColors,
  });
  
  const handleFilterChange = useCallback((type: 'categories' | 'sizes' | 'colors', value: string) => {
    const setters = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
    };
    const setter = setters[type];
    setter(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  }, []);

  const handleClearFiltersAndSearch = useCallback(() => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
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
      
      filterOptions={{ categories: CATEGORIES, sizes: SIZES, colors: COLORS }}
      selectedFilters={{ categories: selectedCategories, sizes: selectedSizes, colors: selectedColors }}
      onFilterChange={handleFilterChange}
      clearFiltersAndSearch={handleClearFiltersAndSearch}
      
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
    />
  );
};

export default ShopPageContainer;
