import React from 'react';
import { BlogPost } from '../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';
import { Icons } from '../constants';

const PostCard: React.FC<{ post: BlogPost, onClick: () => void, isFeatured?: boolean }> = ({ post, onClick, isFeatured }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  if (isFeatured) {
    return (
      <article 
        onClick={onClick}
        className="lg:col-span-2 group relative cursor-pointer bg-bg-secondary border border-border-color hover:border-neonRed/30 transition-all duration-500 shadow-2xl flex flex-col lg:flex-row"
      >
        <div className="lg:w-1/2 aspect-[4/3] lg:aspect-auto overflow-hidden">
          <img src={post.featuredImage.url} alt={post.featuredImage.alt} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
        </div>
        <div className="lg:w-1/2 p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[9px] font-black tracking-[0.4em] text-neonRed bg-bg-contrast-05 px-3 py-1.5 border border-neonRed/20 italic">
                Latest_Dispatch
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-text-primary group-hover:text-neonRed transition-colors mb-4 italic leading-none">
              {post.title}
            </h2>
            <p className="text-[11px] font-bold text-text-secondary/60 uppercase tracking-widest leading-relaxed mb-8 italic">
              {post.excerpt}
            </p>
          </div>
          <div className="flex justify-between items-end border-t border-border-color pt-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-text-secondary/30 uppercase tracking-[0.3em] mb-1">AUTHOR // {post.author}</span>
              <span className="text-[9px] font-mono font-bold text-text-secondary uppercase tracking-[0.2em]">{formattedDate}</span>
            </div>
            <div className="flex gap-2 items-center text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Read</span>
              <Icons.ArrowRight />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-bg-contrast-05 overflow-hidden">
          <div className="h-full bg-neonRed scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-neon"></div>
        </div>
      </article>
    );
  }

  return (
    <article onClick={onClick} className="group relative cursor-pointer bg-bg-secondary border border-border-color hover:border-neonRed/30 transition-all duration-500 shadow-xl flex flex-col">
      <div className="aspect-[16/9] overflow-hidden border-b border-border-color">
        <img src={post.featuredImage.url} alt={post.featuredImage.alt} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h2 className="text-xl font-black uppercase tracking-tighter text-text-primary group-hover:text-neonRed transition-colors mb-3 italic leading-none">
          {post.title}
        </h2>
        <p className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest leading-relaxed mb-6 flex-1 italic">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center border-t border-border-color pt-5 mt-auto">
          <span className="text-[9px] font-mono font-bold text-text-secondary/50 uppercase tracking-[0.2em]">{formattedDate}</span>
          <div className="text-text-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><Icons.ArrowRight /></div>
        </div>
      </div>
    </article>
  );
};


interface BlogPageViewProps {
  posts: BlogPost[];
  onViewPost: (slug: string) => void;
}

export const BlogPageView: React.FC<BlogPageViewProps> = ({ posts, onViewPost }) => {
  const navigate = useNavigate();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

   if (!posts || posts.length === 0) {
    return (
      <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-3xl mx-auto bg-bg-secondary border border-border-color shadow-2xl p-12 md:p-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-neonRed/10 border border-neonRed/40 flex items-center justify-center text-neonRed">
                <Icons.Bell />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-text-primary mb-4 italic">No Active Blogs</h2>
            <p className="text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] text-text-primary/40 mb-10 leading-relaxed">
              THE DISPATCH FEED IS QUIET. CHECK BACK SOON FOR NEW SIGNALS FROM THE ARCHIVE.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="px-8 py-4 bg-neonRed text-white font-black uppercase tracking-[0.35em] text-[10px] shadow-neon hover:shadow-neon-strong transition-all"
              >
                Return Home
              </button>
              <button
                onClick={() => navigate(ROUTES.SHOP)}
                className="px-8 py-4 bg-bg-primary text-text-primary font-black uppercase tracking-[0.35em] text-[10px] border border-border-color hover:border-neonRed/40 transition-all"
              >
                Browse Gear
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black">THE_DISPATCH</span>
        </nav>

        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
            <span className="text-neonRed text-[11px] font-black uppercase tracking-[0.5em] italic">Network_Intel</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-text-primary mb-8 leading-[0.85] italic">
            The <span className="text-neonRed">Dispatch.</span>
          </h1>
          <p className="text-text-secondary font-bold text-sm md:text-lg uppercase tracking-[0.1em] max-w-2xl leading-relaxed italic">
            A CURATED FEED OF TECHNICAL INSIGHTS, BRAND PHILOSOPHY, AND DEPLOYMENT STORIES FROM THE WICKED WORKS ARCHIVE.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {featuredPost && (
            <PostCard post={featuredPost} onClick={() => onViewPost(featuredPost.slug)} isFeatured />
          )}
          {otherPosts.map(post => (
            <PostCard key={post.slug} post={post} onClick={() => onViewPost(post.slug)} />
          ))}
        </div>
      </div>
    </div>
  );
};