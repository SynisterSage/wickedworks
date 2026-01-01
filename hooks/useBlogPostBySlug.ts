
import { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { shopifyClient } from '../lib/shopifyClient';
import { mapArticleFromGraphQL } from '../adapters/shopifyAdapter';

export function useBlogPostBySlug(slug: string | null) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    setLoading(true);
    shopifyClient.fetchBlogPostBySlug(slug)
      .then(res => {
        if (res.data.blog?.articleByHandle) {
          setPost(mapArticleFromGraphQL(res.data.blog.articleByHandle));
        } else {
          setError('Article not found');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error };
}
