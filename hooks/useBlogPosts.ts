
import { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { mapArticleFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch, extractNodes } from '../lib/shopify/client';
import { BLOG_POSTS_QUERY } from '../lib/shopify/queries';
import { handleError } from '../lib/toast';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const BLOG_HANDLE = 'news'; // Default blog handle - update if your Shopify blog has a different handle

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true);

        if (USE_MOCKS) {
          // Use mock data - empty for now
          setPosts([]);
        } else {
          // Fetch from Shopify
          const response = await shopifyFetch<{ blog: { articles: { edges: Array<{ node: any }> } } }>({
            query: BLOG_POSTS_QUERY,
            variables: {
              blogHandle: BLOG_HANDLE,
              first: 50,
            },
          });

          if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Failed to fetch blog posts');
          }

          const nodes = extractNodes(response.data?.blog?.articles);
          setPosts(nodes.map(mapArticleFromGraphQL));
        }
      } catch (err) {
        const message = handleError('[useBlogPosts]', err);
        setError(message);
        // Fallback to empty on error
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return { posts, loading, error };
}
