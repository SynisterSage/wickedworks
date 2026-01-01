
export interface Image {
  url: string;
  altText?: string;
}

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ShopifyConnection<T> {
  nodes: T[];
  edges?: { node: T; cursor?: string }[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Variant {
  gid: string; // gid://shopify/ProductVariant/...
  title: string;
  sku?: string;
  price: Money;
  available: boolean;
  image?: Image;
  selectedOptions: SelectedOption[];
}

export interface Product {
  gid: string; // gid://shopify/Product/...
  handle: string; // unique slug used for routing
  title: string;
  description: string;
  descriptionHtml?: string;
  featuredImage: Image;
  images: Image[];
  options: ProductOption[];
  variants: Variant[];
  priceRange: {
    minVariantPrice: Money;
  };
  category: string;
  specs?: string[];
  isNew?: boolean;
  tags?: string[];
  availableForSale?: boolean;
  createdAt?: string;
  // Archive Properties
  releaseDate?: string | null;
  isVaulted?: boolean;
  isUpcoming?: boolean;
}

export interface Collection {
  gid: string;
  title: string;
  handle: string;
  description: string;
  image: Image;
  products: Product[];
  series?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'UPCOMING';
  assetCount?: number;
  coordinates?: string;
  deploymentDate?: string;
  unitsDeployed?: string;
  rarity?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'STAGED' | 'IN_TRANSIT' | 'DEPLOYED';
  total: string;
  items: OrderItem[];
}

export interface NavItem {
  label: string;
  path: string; // Route path like '/shop' or '/collections'
  dropdownContent?: {
    categories?: {
      title: string;
      links: string[];
    }[];
    featured?: {
      title: string;
      image: string;
      tag: string;
    }[];
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string; // ISO 8601 format: "YYYY-MM-DD"
  excerpt: string;
  content: string; // HTML content
  featuredImage: {
    url: string;
    alt: string;
  };
  tags: string[];
}


export type ViewMode = 'HOME' | 'SHOP_ALL' | 'COLLECTIONS' | 'ARCHIVES' | 'ACCOUNT' | 'SAVED' | 'PRODUCT_DETAIL' | 'ABOUT' | 'SIZING' | 'CONTACT' | 'RETURNS' | 'PRIVACY' | 'TERMS' | 'SEARCH_RESULTS' | 'CART' | 'BLOG' | 'BLOG_POST';
export type AccountSection = 'DETAILS' | 'ORDERS' | 'ADDRESSES' | 'NOTIFICATIONS' | 'SUPPORT';