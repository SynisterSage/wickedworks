import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '../types';
import { Icons } from '../constants';
import { ROUTES } from '../utils/routeHelpers';

interface BlogPostPageViewProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export const BlogPostPageView: React.FC<BlogPostPageViewProps> = ({ post, relatedPosts }) => {
  const navigate = useNavigate();
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="flex items-center gap-3 mb-16 overflow-x-auto whitespace-nowrap no-scrollbar border-b border-border-color pb-4">
          <button onClick={() => navigate(ROUTES.HOME)} className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors">ROOT</button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <button onClick={() => navigate(ROUTES.BLOG)} className="text-[9px] font-mono text-text-secondary tracking-tighter uppercase hover:text-neonRed transition-colors">THE_DISPATCH</button>
          <span className="text-[9px] font-mono text-neonRed font-black">/</span>
          <span className="text-[9px] font-mono text-text-primary tracking-widest uppercase font-black truncate">{post.slug}</span>
        </nav>

        <article className="max-w-4xl mx-auto">
          <header className="mb-16 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              {post.tags.map(tag => (
                <span key={tag} className="text-[9px] font-black tracking-[0.4em] text-neonRed bg-bg-contrast-05 px-3 py-1.5 border border-neonRed/20 italic">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-text-primary mb-8 leading-[0.95] italic">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
              <span>BY // {post.author}</span>
              <span className="w-1.5 h-1.5 bg-neonRed shadow-neon rotate-45"></span>
              <span>{formattedDate}</span>
            </div>
          </header>

          <div className="aspect-[16/9] bg-bg-secondary border border-border-color mb-16 overflow-hidden group">
            <img src={post.featuredImage.url} alt={post.featuredImage.alt} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
          </div>

          <div 
            className="prose-styles"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-24 pt-16 border-t border-border-color flex flex-col items-center text-center">
             <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/50 mb-8 max-w-lg leading-loose italic">
               END OF TRANSMISSION. RETURN TO THE DISPATCH DIRECTORY TO VIEW OTHER SIGNALS FROM THE WICKED WORKS ARCHIVE.
             </p>
             <button
               onClick={() => navigate(ROUTES.BLOG)}
               className="inline-flex items-center gap-4 bg-bg-contrast-05 text-text-secondary px-12 py-6 font-black uppercase tracking-[0.4em] text-[10px] border border-border-color hover:border-neonRed/30 hover:text-neonRed transition-all active:scale-95 group/btn relative overflow-hidden"
             >
               <span className="relative z-10 flex items-center gap-4">
                 <Icons.ArrowLeft />
                 Back to Dispatch
               </span>
             </button>
          </footer>
          
          {relatedPosts.length > 0 && (
            <div className="mt-32 pt-24 border-t border-border-color">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-5 w-1.5 bg-neonRed shadow-neon"></div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-text-primary italic">Related_Signals</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map(p => (
                   <div key={p.slug} onClick={() => navigate(ROUTES.BLOG_POST(p.slug))} className="group relative cursor-pointer bg-bg-secondary border border-border-color hover:border-neonRed/30 transition-all duration-500 shadow-xl flex flex-col">
                    <div className="aspect-[16/9] overflow-hidden border-b border-border-color">
                      <img src={p.featuredImage.url} alt={p.featuredImage.alt} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-lg font-black uppercase tracking-tighter text-text-primary group-hover:text-neonRed transition-colors mb-2 italic leading-none">
                        {p.title}
                      </h2>
                      <div className="flex justify-between items-center border-t border-border-color pt-4 mt-auto">
                        <span className="text-[9px] font-mono font-bold text-text-secondary/50 uppercase tracking-[0.2em]">{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <div className="text-text-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><Icons.ArrowRight /></div>
                      </div>
                    </div>
                   </div>
                ))}
              </div>
            </div>
          )}

        </article>
      </div>
      <style>{`
        .prose-styles p {
          font-size: 1rem;
          line-height: 1.625;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-style: italic;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .prose-styles p {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
        }
        .prose-styles h2 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          color: var(--text-primary);
          margin-top: 3rem;
          margin-bottom: 3rem;
          font-style: italic;
        }
        @media (min-width: 768px) {
          .prose-styles h2 {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
        }
        .prose-styles blockquote {
          margin-top: 3rem;
          margin-bottom: 3rem;
          padding-left: 2rem;
          padding-right: 2rem;
          padding-top: 1px;
          padding-bottom: 1px;
          border-left: 4px solid #ff003c;
          background-color: var(--bg-contrast-02);
          box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
        }
        .prose-styles blockquote p {
          font-size: 1.125rem !important;
          font-weight: 900 !important;
          color: #ff003c !important;
          letter-spacing: -0.025em !important;
          line-height: 1.375 !important;
          margin: 0 !important;
        }
        @media (min-width: 768px) {
          .prose-styles blockquote p {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};