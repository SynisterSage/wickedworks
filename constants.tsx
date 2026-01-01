
import React from 'react';
import { NavItem, Order, Product, Collection, BlogPost } from './types';

// Helper to simulate Shopify's GID
const gid = (type: string, id: string) => `gid://shopify/${type}/${id}`;

/**
 * Raw MOCK_PRODUCTS representing the un-parsed Shopify GraphQL response.
 * Includes metafields for 'release' namespace to simulate canonical archive data.
 */
export const MOCK_PRODUCTS: any[] = [
  {
    id: gid('Product', '1'),
    handle: 'neon-catalyst-jacket',
    title: 'Neon Catalyst Jacket',
    description: 'A technical layering piece designed for maximum mobility in harsh urban environments.',
    productType: 'Outerwear',
    isNew: true,
    featuredImage: { url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800' },
    images: { nodes: [{ url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800' }] },
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Onyx', 'Neon Red'] }
    ],
    priceRange: { minVariantPrice: { amount: '249.00', currencyCode: 'USD' } },
    variants: { 
      nodes: [
        { id: gid('ProductVariant', '101'), title: 'Onyx / S', availableForSale: true, price: { amount: '249.00' }, selectedOptions: [{name: 'Size', value: 'S'}, {name: 'Color', value: 'Onyx'}] }
      ] 
    },
    metafields: { nodes: [{ namespace: 'release', key: 'vaulted', value: 'false' }] }
  },
  {
    id: gid('Product', '100'),
    handle: 'upcoming-shell-v4',
    title: 'Upcoming Shell V4',
    description: 'Proto-type technical shell. Staged for future deployment.',
    productType: 'Outerwear',
    featuredImage: { url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800' },
    images: { nodes: [{ url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800' }] },
    options: [
      { name: 'Size', values: ['M', 'L'] },
      { name: 'Color', values: ['Slate'] }
    ],
    priceRange: { minVariantPrice: { amount: '350.00', currencyCode: 'USD' } },
    variants: { nodes: [{ id: gid('ProductVariant', '401'), title: 'Prototype', availableForSale: true, price: { amount: '350.00' }, selectedOptions: [{name: 'Size', value: 'M'}, {name: 'Color', value: 'Slate'}] }] },
    metafields: { 
      nodes: [
        { namespace: 'release', key: 'release_date', value: '2025-12-25T00:00:00Z' },
        { namespace: 'release', key: 'vaulted', value: 'false' }
      ] 
    }
  },
  {
    id: gid('Product', '200'),
    handle: 'vaulted-runner-legacy',
    title: 'Vaulted Runner Legacy',
    description: 'Retired industrial footwear. No longer available for procurement.',
    productType: 'Footwear',
    featuredImage: { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800' },
    images: { nodes: [{ url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800' }] },
    options: [
      { name: 'Size', values: ['8', '9', '10'] }
    ],
    priceRange: { minVariantPrice: { amount: '185.00', currencyCode: 'USD' } },
    variants: { nodes: [{ id: gid('ProductVariant', '201'), title: '8', availableForSale: false, price: { amount: '185.00' }, selectedOptions: [{name: 'Size', value: '8'}] }] },
    metafields: { 
      nodes: [
        { namespace: 'release', key: 'vaulted', value: 'true' }
      ] 
    }
  }
];

export const MOCK_COLLECTIONS: any[] = [
  {
    id: gid('Collection', '1'),
    handle: 'origin-series',
    title: 'Origin Series',
    description: 'The foundation of technical urban utility.',
    image: { url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800' },
    series: 'SS25',
    status: 'ACTIVE',
    products: { nodes: MOCK_PRODUCTS }
  }
];

export const RAW_MOCK_ARTICLES: any[] = [
  {
    id: gid('Article', '1'),
    handle: 'constructing-the-grid',
    title: 'Constructing the Grid: Building the Wicked Works Digital Storefront',
    authorV2: { name: 'The Archive' },
    publishedAt: '2025-07-15T12:00:00Z',
    excerpt: 'A digital space should be more than a store; it should be an experience. We approached our online presence not as a simple marketplace, but as a digital terminal—an extension of our brand’s core philosophy.',
    image: {
      url: 'https://images.unsplash.com/photo-1559523161-0d0b0903a0d7?q=80&w=1635',
      altText: 'A clean, modern desk setup with multiple monitors showing code.'
    },
    tags: ['Design', 'Digital', 'Brand'],
    contentHtml: `
      <p>A digital space should be more than a store; it should be an experience. We approached our online presence not as a simple marketplace, but as a digital terminal—an extension of our brand’s core philosophy. The goal was to translate the tangible, tactile nature of our apparel into a fluid, interactive grid.</p>
      <p>Our aesthetic—dark glass, deep charcoal, and piercing neon red—isn't arbitrary. It reflects the urban environments our gear is designed for: the low-light of a city at midnight, the sharp glow of a digital billboard, the raw structure of industrial architecture. Every button, every transition, every font choice is calibrated to immerse you in the Wicked Works universe.</p>
      <blockquote>We didn't just build a website. We deployed a system. An interface that is as intuitive and high-performance as the apparel it showcases.</blockquote>
      <p>Speed, clarity, and precision were our guiding principles. The user journey is designed to be seamless, whether you're scanning the archives or accessing detailed schematics on a specific product. This is our digital manifesto: zero fluff, maximum impact.</p>
    `
  },
  {
    id: gid('Article', '2'),
    handle: 'beyond-the-hype-manifesto',
    title: 'Beyond the Hype: Our Manifesto on Technical Apparel',
    authorV2: { name: 'The Archive' },
    publishedAt: '2025-07-01T12:00:00Z',
    excerpt: 'In a world saturated with fleeting trends, we anchor ourselves to a different principle: longevity. Our design philosophy is simple—build for the long haul. We create technical apparatus, not fashion items.',
    image: {
      url: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=1287',
      altText: 'A single neon light tube glowing in a dark, atmospheric room.'
    },
    tags: ['Philosophy', 'Apparel', 'Design'],
    contentHtml: `
      <p>In a world saturated with fleeting trends, we anchor ourselves to a different principle: longevity. Our design philosophy is simple—build for the long haul. We create technical apparatus, not fashion items. Each piece is an investment in utility, a tool designed to perform under pressure in the urban sprawl.</p>
      <p>The term "technical" has been diluted. For us, it's not a marketing buzzword. It's a commitment. It means stress-tested materials, function-first construction, and a brutalist approach to aesthetics where nothing is superfluous. If a feature doesn't serve a purpose, it's eliminated.</p>
      <p>We source materials that withstand abrasion, repel the elements, and adapt to changing environments. Our patterns are engineered for movement, allowing for a full range of motion without compromise. This is gear for the operatives of the everyday—individuals who navigate the complexities of the modern city and demand more from what they wear.</p>
      <blockquote>We're not just making clothes. We're building a system for urban survival.</blockquote>
      <p>This is our promise: every stitch, every seam, and every silhouette is a deliberate choice made in the pursuit of performance. The hype fades. Utility endures.</p>
    `
  },
  {
    id: gid('Article', '3'),
    handle: 'signal-and-noise-identity',
    title: 'Signal & Noise: Crafting the Wicked Works Identity',
    authorV2: { name: 'The Archive' },
    publishedAt: '2025-06-20T12:00:00Z',
    excerpt: 'In the endless static of digital media, a clear signal is everything. The Wicked Works identity is our signal—sharp, focused, and intentional. It’s more than a logo; it’s a broadcast.',
    image: {
      url: 'https://images.unsplash.com/photo-1581345352372-cfd33b28b79b?q=80&w=1287',
      altText: 'An abstract, close-up shot of red and blue neon lights creating a glitch effect.'
    },
    tags: ['Branding', 'Socials', 'Identity'],
    contentHtml: `
      <p>In the endless static of digital media, a clear signal is everything. The Wicked Works identity is our signal—sharp, focused, and intentional. It’s more than a logo; it’s a broadcast, a visual language that communicates our core values without a single word.</p>
      <p>Our color palette is deliberate. The deep, near-absolute black represents the unknown, the urban canvas. The neon red is the pulse, the signal cutting through the noise—the heartbeat of the city and the brand. It’s a color of warning, of energy, of life.</p>
      <p>Our social media channels are not just marketing tools; they are our broadcast stations. We use them to transmit our worldview, to showcase our products in their intended environment, and to tell the stories of the operatives who use them. We focus on creating a narrative, a world that you can step into. We prioritize mood and atmosphere over hard sells and empty promotions.</p>
      <blockquote>We don't chase followers. We broadcast a signal, and those who are tuned to the right frequency will find us.</blockquote>
      <p>This is how we cut through the noise. By being unapologetically ourselves and by building a brand that has a point of view. It’s not just about what you see; it’s about what you feel. That’s our signal.</p>
    `
  },
];


export const UPCOMING_COLLECTIONS: any[] = [];
export const ARCHIVED_COLLECTIONS: any[] = [];

export const NAV_ITEMS: NavItem[] = [
  { 
    label: 'Shop All', 
    path: '/shop',
    dropdownContent: {
      categories: [
        { title: 'Apparel', links: ['Jackets', 'T-Shirts', 'Trousers', 'Mid-layers'] },
        { title: 'Footwear', links: ['Runners', 'Boots', 'Technical Socks'] }
      ],
      featured: [
        { title: 'Core Shell V2', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800', tag: 'RESTOCK' }
      ]
    }
  },
  { 
    label: 'Collections', 
    path: '/collections',
    dropdownContent: {
      categories: [
        { title: 'Series', links: ['Origin SS25'] }
      ],
      featured: [
        { title: 'Origin Drop', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800', tag: 'ACTIVE' }
      ]
    }
  },
  { label: 'Archives', path: '/archives' }
];

export const MOCK_ORDERS: Order[] = [];

export const Icons = {
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  Cart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Heart: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Adjustments: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a2 2 0 100-4 2 2 0 000 4zM4 8h10m4 0h2M8 16a2 2 0 100-4 2 2 0 000 4zM4 16h2m4 0h8" />
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  ),
  ViewGrid: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
  ),
  ViewList: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Monitor: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
  Sun: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  Moon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
    </svg>
  )
};