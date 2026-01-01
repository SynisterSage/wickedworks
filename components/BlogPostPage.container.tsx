
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPostPageView } from './BlogPostPage.view';
import { useBlogPostBySlug } from '../hooks/useBlogPostBySlug';
import { Icons } from '../constants';
import { useRelatedPosts } from '../hooks/useRelatedPosts';

const BlogPostPageContainer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading, error } = useBlogPostBySlug(slug || null);
  const { relatedPosts } = useRelatedPosts(slug || '', 2);

  useEffect(() => {
    if (!slug) {
      navigate('/blog');
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | The Dispatch`;
    }
    return () => { document.title = 'Wicked Works Storefront'; };
  }, [post]);

  if (loading) {
    return (
     <div className="pt-40 flex flex-col items-center justify-center space-y-4 min-h-screen">
       <div className="w-12 h-1 bg-neonRed animate-width-pulse"></div>
       <div className="text-neonRed font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Accessing Dispatch...</div>
     </div>
   );
 }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-[12rem] md:text-[20rem] font-black text-text-primary/5 leading-none select-none tracking-tighter">404</h1>
        <div className="absolute">
          <span className="text-neonRed font-black text-sm uppercase tracking-[0.5em] mb-4">Signal Lost</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-text-primary">Dispatch Not Found</h2>
        </div>
        <p className="text-text-secondary font-bold uppercase tracking-widest text-xs md:text-sm max-w-md mt-12 mb-12 leading-loose">
          {error || 'The requested dispatch does not exist in the archive. The signal may have been corrupted or decommissioned.'}
        </p>
        <button 
          onClick={() => navigate('/blog')}
          className="bg-neonRed text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all flex items-center gap-3 active:scale-95"
        >
          <Icons.ArrowLeft /> Return to Dispatch
        </button>
      </div>
    );
  }

  return <BlogPostPageView post={post} relatedPosts={relatedPosts} />;
};

export default BlogPostPageContainer;
