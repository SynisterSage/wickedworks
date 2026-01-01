import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: "What We Collect",
      content: "We collect identifiers (name, email, addresses), order and payment details (via Shopify’s checkout), device data (IP, browser, analytics), and account data you choose to provide. Newsletter signups and notification preferences are stored in Supabase."
    },
    {
      title: "How We Use It",
      content: "To process and ship orders, provide customer support, remember your preferences, send transactional emails, and (when you opt in) marketing updates and product notifications. We minimize retention and keep only what’s needed for these purposes."
    },
    {
      title: "Platforms & Sharing",
      content: "Commerce runs on Shopify; see https://www.shopify.com/legal/privacy. Data we store (subscriptions, notification prefs) lives in Supabase (U.S./EU hosting). Email is sent via Resend. We do not sell your data. Vendors only receive what they need to perform their service."
    },
    {
      title: "Cookies & Tracking",
      content: "We use essential cookies for security/session, preference cookies (e.g., theme), and performance/analytics. You can control cookies in your browser; blocking some may impact site function."
    },
    {
      title: "Your Rights",
      content: "Depending on where you live (e.g., GDPR/UK GDPR, CCPA/CPRA, other local laws), you may access, correct, delete, or port your data, and opt out of marketing. To exercise rights or request deletion, contact us via the support portal."
    },
    {
      title: "Data Security & Retention",
      content: "We use TLS in transit and vendor security defaults at rest. We retain order records to meet legal/tax requirements; marketing preferences are kept until you opt out or request deletion."
    }
  ];

  return (
    <div className="pt-12 md:pt-32 pb-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-12 border-b border-border-color pb-4">
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="text-[10px] font-bold text-text-secondary hover:text-neonRed transition-colors uppercase tracking-widest"
          >
            Home
          </button>
          <span className="text-neonRed text-[10px] font-bold">/</span>
          <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">
            Privacy Notice
          </span>
        </nav>

        <div className="max-w-6xl mx-auto">
          <header className="mb-16">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-text-primary mb-6 italic leading-none">
              Privacy <span className="text-neonRed">& Cookies.</span>
            </h1>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">Last Updated: January 2026</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Quick Nav */}
            <aside className="hidden md:block md:col-span-3">
              <nav className="sticky top-32 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neonRed mb-6 border-l-2 border-neonRed pl-3 italic">Manifesto</h4>
                {sections.map((sec, idx) => (
                  <a 
                    key={idx} 
                    href={`#privacy-section-${idx}`}
                    className="block text-[10px] font-bold text-text-secondary hover:text-neonRed transition-colors uppercase tracking-widest"
                  >
                    {idx + 1}. {sec.title}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <main className="md:col-span-9">
              <div className="space-y-16">
                {sections.map((sec, idx) => (
                  <section key={idx} id={`privacy-section-${idx}`} className="animate-in slide-in-from-bottom-2 duration-500 scroll-mt-32">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-text-primary mb-4 italic">
                      <span className="text-neonRed mr-3">{String(idx + 1).padStart(2, '0')}</span>
                      {sec.title}
                    </h2>
                    <p className="text-sm md:text-base font-medium text-text-secondary leading-relaxed uppercase tracking-tight italic">
                      {sec.content}
                    </p>
                  </section>
                ))}
              </div>

              <footer className="mt-24 pt-12 border-t border-border-color">
                <p className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest leading-loose italic">
                  We respect your data privacy as much as our technical standards. For specific data removal requests, please contact us via the support portal.
                </p>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;