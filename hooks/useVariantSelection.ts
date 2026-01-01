
import { useState, useMemo, useCallback } from 'react';
import { Product, Variant } from '../types';

export function useVariantSelection(product: Product) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach(opt => {
      initial[opt.name] = opt.values[0];
    });
    return initial;
  });

  const selectedVariant = useMemo(() => {
    return product.variants.find(v => 
      v.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
    ) || product.variants[0];
  }, [product, selectedOptions]);

  const selectOption = useCallback((name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    selectedOptions,
    selectedVariant,
    selectOption
  };
}
