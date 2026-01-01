
import { useMemo } from 'react';
import { BlogPost } from '../types';
import { useBlogPosts } from './useBlogPosts';

export function useRelatedPosts(currentPostSlug: string, limit: number = 2) {
  const { posts: allPosts, loading, error } = useBlogPosts();

  const relatedPosts = useMemo(() => {
    if (!currentPostSlug || allPosts.length === 0) {
      return [];
    }
    
    const currentPost = allPosts.find(p => p.slug === currentPostSlug);
    if (!currentPost) return [];
    
    const currentTags = new Set(currentPost.tags);

    return allPosts
      .filter(post => post.slug !== currentPostSlug) // Exclude the current post
      .map(post => {
        const commonTags = post.tags.filter(tag => currentTags.has(tag));
        return { post, score: commonTags.length };
      })
      .filter(item => item.score > 0) // Only include posts with at least one common tag
      .sort((a, b) => b.score - a.score) // Sort by most common tags
      .slice(0, limit)
      .map(item => item.post);
  }, [allPosts, currentPostSlug, limit]);

  return { relatedPosts, loading, error };
}
