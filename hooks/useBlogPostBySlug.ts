
import { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { mapArticleFromGraphQL } from '../adapters/shopifyAdapter';
import { shopifyFetch } from '../lib/shopify/client';
import { BLOG_POST_BY_HANDLE_QUERY } from '../lib/shopify/queries';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const BLOG_HANDLE = 'news'; // Default blog handle - update if your Shopify blog has a different handle

export function useBlogPostBySlug(slug: string | null) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchBlogPost() {
      try {
        setLoading(true);

        if (USE_MOCKS) {
          // Use mock data - no blog posts available
          setError('Article not found');
        } else {
          // Fetch from Shopify
          const response = await shopifyFetch<{ blog: { articleByHandle: any } }>({
            query: BLOG_POST_BY_HANDLE_QUERY,
            variables: {
              blogHandle: BLOG_HANDLE,
              articleHandle: slug,
            },
          });

          if (response.errors) {
            throw new Error(response.errors[0]?.message || 'Failed to fetch blog post');
          }

          if (response.data?.blog?.articleByHandle) {
            setPost(mapArticleFromGraphQL(response.data.blog.articleByHandle));
          } else {
            setError('Article not found');
          }
        }
      } catch (err) {
        console.error('[useBlogPostBySlug] Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPost();
  }, [slug]);

  return { post, loading, error };
}
