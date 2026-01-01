
import { Product, Variant, Collection, Money, BlogPost } from '../types';
import { flattenConnection } from '../utils/flattenConnection';

/**
 * Maps raw Shopify MoneyV2 to internal Money type.
 */
const mapMoney = (raw: any): Money => ({
  amount: typeof raw?.amount === 'string' ? parseFloat(raw.amount) : (raw?.amount || 0),
  currencyCode: raw?.currencyCode || 'USD',
});

/**
 * Optimizes Shopify CDN images for better performance.
 */
const transformImage = (url?: string) => {
  if (!url) return '';
  if (url.includes('cdn.shopify.com') && !url.includes('?')) {
    return `${url}?width=800&format=auto`;
  }
  return url;
};

/**
 * Maps release-specific metafields into internal product flags.
 * Note: Store ISO UTC strings in Shopify (e.g., 2025-12-25T00:00:00Z) 
 * for consistent timezone handling across client deployments.
 */
export function mapArchiveMetafields(node: any) {
  // Metafields can come as array, edges/nodes, or be null/undefined
  let metafields: any[] = [];
  
  if (Array.isArray(node.metafields)) {
    metafields = node.metafields;
  } else if (node.metafields?.edges) {
    metafields = node.metafields.edges.map((e: any) => e.node);
  } else if (node.metafields?.nodes) {
    metafields = node.metafields.nodes;
  }
  
  const releaseDate = metafields.find((m: any) => m?.namespace === 'release' && m?.key === 'release_date')?.value || null;
  const vaultedValue = metafields.find((m: any) => m?.namespace === 'release' && m?.key === 'vaulted')?.value;
  
  const isVaulted = vaultedValue === 'true' || vaultedValue === true;
  const isUpcoming = !!(releaseDate && new Date(releaseDate).getTime() > Date.now());
  
  return { releaseDate, isVaulted, isUpcoming };
}

/**
 * Maps raw Shopify Variant GraphQL node to internal Variant type.
 */
export function mapVariantFromGraphQL(node: any): Variant {
  return {
    gid: node.id,
    title: node.title,
    sku: node.sku,
    available: node.availableForSale ?? true,
    price: mapMoney(node.priceV2 || node.price),
    image: node.image ? { 
      url: transformImage(node.image.url), 
      altText: node.image.altText 
    } : undefined,
    selectedOptions: (node.selectedOptions || []).map((o: any) => ({ 
      name: o.name, 
      value: o.value 
    })),
  };
}

/**
 * Maps raw Shopify Product GraphQL node to internal Product type.
 */
export function mapProductFromGraphQL(node: any): Product {
  const archiveInfo = mapArchiveMetafields(node);

  return {
    gid: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    featuredImage: {
      url: transformImage(node.featuredImage?.url),
      altText: node.featuredImage?.altText,
    },
    images: flattenConnection<any>(node.images).map(img => ({
      ...img,
      url: transformImage(img.url)
    })),
    options: node.options || [],
    variants: flattenConnection(node.variants).map(mapVariantFromGraphQL),
    priceRange: {
      minVariantPrice: mapMoney(node.priceRange?.minVariantPrice),
    },
    category: node.productType || 'Outerwear',
    specs: node.specs || [],
    isNew: node.isNew || false,
    ...archiveInfo
  };
}

/**
 * Maps raw Shopify Collection GraphQL node to internal Collection type.
 */
export function mapCollectionFromGraphQL(node: any): Collection {
  return {
    gid: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    image: { 
      url: transformImage(node.image?.url), 
      altText: node.image?.altText 
    },
    products: flattenConnection(node.products).map(mapProductFromGraphQL),
    series: node.series || 'SS24',
    status: node.status || 'ACTIVE',
    assetCount: node.products?.nodes?.length || 0,
    coordinates: node.coordinates,
    deploymentDate: node.deploymentDate,
    unitsDeployed: node.unitsDeployed,
    rarity: node.rarity,
  };
}

/**
 * Maps raw Shopify Article GraphQL node to internal BlogPost type.
 */
export function mapArticleFromGraphQL(node: any): BlogPost {
  return {
    slug: node.handle,
    title: node.title,
    author: node.authorV2?.name || 'Anonymous',
    date: new Date(node.publishedAt).toISOString().split('T')[0], // "YYYY-MM-DD"
    excerpt: node.excerpt,
    content: node.contentHtml,
    featuredImage: {
      url: transformImage(node.image?.url),
      alt: node.image?.altText || node.title,
    },
    tags: node.tags || [],
  };
}
