
import React from 'react';
import { MegaMenuView } from './MegaMenu.view';
import { NavItem } from '../types';
import { useArchives } from '../hooks/useArchives';
import { useCollections } from '../hooks/useCollections';
import { useProducts } from '../hooks/useProducts';

interface MegaMenuContainerProps {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (handle?: string) => void;
}

const MegaMenuContainer: React.FC<MegaMenuContainerProps> = (props) => {
  const isArchives = props.item.label.toLowerCase() === 'archives';
  const isShopAll = props.item.label.toLowerCase() === 'shop all';
  const { upcoming, vaulted, loading } = useArchives();
  const { collections, loading: collectionsLoading } = useCollections();
  const { products, loading: productsLoading } = useProducts({});

  const shopAllCategories = isShopAll
    ? [
        {
          title: 'Shop by Category',
          links: [
            { label: 'Bags', path: '/shop?category=bags' },
            { label: 'Outerwear', path: '/shop?category=outerwear' },
            { label: 'Accessories', path: '/shop?category=accessories' },
          ],
        },
        {
          title: 'Shop by Intent',
          links: [
            { label: 'Commute / Urban Ops', path: '/shop?intent=commute' },
            { label: 'Cold Weather', path: '/shop?intent=cold' },
            { label: 'Travel / Carry', path: '/shop?intent=travel' },
          ],
        },
        {
          title: 'Featured',
          links: [
            { label: 'New Arrivals', path: '/shop?sort=new' },
            { label: 'Best Sellers', path: '/shop?sort=best' },
            { label: 'Staff Picks', path: '/shop?sort=featured' },
          ],
        },
        {
          title: 'Signals',
          links: [
            { label: 'Future Signals', path: '/archives#future' },
            { label: 'Legacy Vault', path: '/archives#vault' },
          ],
        },
      ]
    : undefined;

  const shopAllFeatured = isShopAll ? products.slice(0, 2) : undefined;

  return (
    <MegaMenuView 
      {...props} 
      archiveData={isArchives ? { upcoming, vaulted, loading } : undefined}
      collectionData={!isArchives ? { collections, loading: collectionsLoading } : undefined}
      shopAllData={isShopAll ? { categories: shopAllCategories, featuredProducts: shopAllFeatured, loading: productsLoading } : undefined}
    />
  );
};

export default MegaMenuContainer;
