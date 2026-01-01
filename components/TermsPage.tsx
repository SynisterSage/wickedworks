
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: "Scope & Updates",
      content: "These Terms govern your use of Wicked Works and purchases made through our Shopify-powered store. We may update terms as laws or services change; continued use means acceptance of the current terms."
    },
    {
      title: "Commerce Platform",
      content: "Checkout, payments, and order management run on Shopify. Your use of checkout is also subject to Shopify’s terms and privacy: https://www.shopify.com/legal/terms and https://www.shopify.com/legal/privacy."
    },
    {
      title: "Orders & Payments",
      content: "Placing an order is an offer to buy. We may reject or cancel for fraud, errors, or availability. Prices and shipping costs are shown at checkout. Risk of loss passes to you when the carrier takes possession."
    },
    {
      title: "Product Info & Availability",
      content: "We aim for accurate imagery and descriptions; color may vary by display. Inventory can change quickly; we may limit quantities or discontinue items."
    },
    {
      title: "Returns",
      content: "Eligible items can be returned within 30 days in original condition with tags. Faulty items are covered under applicable consumer laws. See Returns for workflow details."
    },
    {
      title: "Privacy, Cookies & Supabase",
      content: "See our Privacy & Cookies notice for how we process data, including use of Supabase for subscriptions/notification preferences and Resend for email. By using the site you consent to necessary cookies; optional cookies can be controlled in your browser."
    },
    {
      title: "Intellectual Property",
      content: "All site content and designs are owned by Wicked Works or licensors. No reproduction or derivative use without written consent."
    },
    {
      title: "Limitation of Liability",
      content: "To the extent allowed by law, we are not liable for indirect or consequential damages. Nothing here limits rights you have under mandatory consumer law."
    }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-12 border-b border-black/5 dark:border-white/5 pb-4">
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            className="text-[10px] font-bold text-charcoal/40 dark:text-white/30 uppercase tracking-widest hover:text-neonRed transition-colors"
          >
            Home
          </button>
          <span className="text-neonRed text-[10px] font-bold">/</span>
          <span className="text-[10px] font-bold text-charcoal dark:text-white uppercase tracking-widest">
            Terms & Conditions
          </span>
        </nav>

        <div className="max-w-6xl mx-auto">
          <header className="mb-16">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-charcoal dark:text-white mb-6">
              Terms of <span className="text-neonRed">Service</span>
            </h1>
            <p className="text-[10px] font-bold text-charcoal/40 dark:text-white/40 uppercase tracking-[0.3em]">Last Updated: January 2026</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Quick Nav */}
            <aside className="hidden md:block md:col-span-3">
              <nav className="sticky top-32 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neonRed mb-6 border-l-2 border-neonRed pl-3">Sections</h4>
                {sections.map((sec, idx) => (
                  <a 
                    key={idx} 
                    href={`#section-${idx}`}
                    className="block text-[10px] font-bold text-charcoal/40 dark:text-white/30 uppercase tracking-widest hover:text-neonRed transition-colors"
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
                  <section key={idx} id={`section-${idx}`} className="animate-in slide-in-from-bottom-2 scroll-mt-32">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-charcoal dark:text-white mb-4">
                      <span className="text-neonRed mr-3">{String(idx + 1).padStart(2, '0')}</span>
                      {sec.title}
                    </h2>
                    <p className="text-sm md:text-base font-medium text-charcoal/70 dark:text-white/40 leading-relaxed uppercase tracking-tight">
                      {sec.content}
                    </p>
                  </section>
                ))}
              </div>

              <footer className="mt-24 pt-12 border-t border-black/5 dark:border-white/5">
                <p className="text-[10px] font-bold text-charcoal/30 dark:text-white/20 uppercase tracking-widest leading-loose">
                  If you have any questions regarding these terms, please contact our support team through the account portal.
                </p>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
