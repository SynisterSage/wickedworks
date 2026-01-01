
import React from 'react';
import { ArchivesPageView } from '../../components/ArchivesPage.view';
import { Product } from '../../types';

export default {
  title: 'Pages/ArchivesPage',
  component: ArchivesPageView,
};

const mockUpcoming: Product[] = [
  {
    gid: 'gid://shopify/Product/100',
    handle: ' upcoming-shell-v4',
    title: 'Upcoming Shell V4',
    description: 'Technical signal staged for FW2025. Industrial grade shielding.',
    featuredImage: { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800' },
    images: [],
    options: [],
    variants: [],
    priceRange: { minVariantPrice: { amount: 350.00, currencyCode: 'USD' } },
    category: 'Outerwear',
    releaseDate: '2025-12-25T00:00:00Z',
    isUpcoming: true
  }
];

const mockVaulted: Product[] = [
  {
    gid: 'gid://shopify/Product/200',
    handle: 'vaulted-runner-legacy',
    title: 'Vaulted Runner Legacy',
    description: 'Archive asset from the SS23 Nexus deployment.',
    featuredImage: { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800' },
    images: [],
    options: [],
    variants: [],
    priceRange: { minVariantPrice: { amount: 185.00, currencyCode: 'USD' } },
    category: 'Footwear',
    isVaulted: true
  }
];

export const Default = () => (
  <ArchivesPageView 
    upcoming={mockUpcoming} 
    vaulted={mockVaulted} 
    onNavigate={() => {}} 
    onNotify={(h) => console.log('Notify for:', h)} 
  />
);
