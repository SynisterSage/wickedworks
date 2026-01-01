
/* eslint-disable no-undef */
declare var describe: any;
declare var it: any;
declare var expect: any;

import { mapProductFromGraphQL, mapArticleFromGraphQL } from '../../adapters/shopifyAdapter';

const mockRawProduct = {
  id: 'gid://shopify/Product/1',
  handle: 'test-jacket',
  title: 'Test Jacket',
  description: 'A description',
  productType: 'Outerwear',
  images: { nodes: [{ url: 'img.jpg' }] },
  priceRange: { minVariantPrice: { amount: '249.0', currencyCode: 'USD' } },
  variants: {
    nodes: [{
      id: 'gid://shopify/ProductVariant/101',
      title: 'Onyx / S',
      price: { amount: '249.0', currencyCode: 'USD' },
      selectedOptions: [{ name: 'Size', value: 'S' }]
    }]
  }
};

describe('mapProductFromGraphQL', () => {
  it('maps raw GraphQL product to internal Product type correctly', () => {
    const product = mapProductFromGraphQL(mockRawProduct);
    expect(product.handle).toBe('test-jacket');
    expect(product.variants[0].gid).toContain('ProductVariant');
    expect(product.priceRange.minVariantPrice.amount).toBe(249);
    expect(Array.isArray(product.images)).toBe(true);
  });
});

const mockRawArticle = {
  id: 'gid://shopify/Article/1',
  handle: 'test-article',
  title: 'Test Article',
  authorV2: { name: 'The Author' },
  publishedAt: '2025-07-20T10:00:00Z',
  excerpt: 'This is an excerpt.',
  image: { url: 'article.jpg', altText: 'Article Image' },
  tags: ['Testing', 'Adapter'],
  contentHtml: '<p>Hello world</p>',
};

describe('mapArticleFromGraphQL', () => {
  it('maps a raw GraphQL article to the internal BlogPost type correctly', () => {
    const post = mapArticleFromGraphQL(mockRawArticle);
    expect(post.slug).toBe('test-article');
    expect(post.author).toBe('The Author');
    expect(post.date).toBe('2025-07-20');
    expect(post.tags).toEqual(['Testing', 'Adapter']);
    expect(post.content).toBe('<p>Hello world</p>');
    expect(post.featuredImage.alt).toBe('Article Image');
  });
});
