
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPageView } from './BlogPage.view';
import { useBlogPosts } from '../hooks/useBlogPosts';

const BlogPageContainer: React.FC = () => {
  const navigate = useNavigate();
  const { posts, loading, error } = useBlogPosts();

  const handleViewPost = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (loading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center space-y-4 min-h-screen">
        <div className="w-12 h-1 bg-neonRed animate-width-pulse"></div>
        <div className="text-neonRed font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Loading Dispatches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-text-secondary mb-4 italic">Error Loading Dispatches</h3>
        <p className="text-[10px] font-bold text-neonRed uppercase tracking-widest mb-8">{error}</p>
        <button onClick={() => navigate('/')} className="bg-bg-contrast-05 text-text-secondary px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:text-text-primary transition-colors border border-border-color">Return Home</button>
      </div>
    );
  }

  return <BlogPageView posts={posts} onViewPost={handleViewPost} />;
};

export default BlogPageContainer;
