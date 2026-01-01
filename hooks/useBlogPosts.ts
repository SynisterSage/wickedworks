
import { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { shopifyClient } from '../lib/shopifyClient';
import { mapArticleFromGraphQL } from '../adapters/shopifyAdapter';
import { flattenConnection } from '../utils/flattenConnection';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    shopifyClient.fetchBlogPosts()
      .then(res => {
        const nodes = flattenConnection<any>(res.data.blog?.articles);
        setPosts(nodes.map(mapArticleFromGraphQL));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { posts, loading, error };
}
