
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: "Introduction",
      content: "These Terms & Conditions govern your use of the Wicked Works website and the purchase of any products from us. By using this website, you agree to follow and be bound by these terms. We reserve the right to update these terms at any time without prior notice."
    },
    {
      title: "Product Information & Availability",
      content: "We make every effort to display the colors and features of our products accurately. However, actual colors may vary depending on your monitor settings. All products are subject to availability, and we reserve the right to limit the quantity of products we supply or to discontinue any product at any time."
    },
    {
      title: "Orders & Payments",
      content: "By placing an order, you are offering to purchase a product subject to these terms. All orders are subject to availability and confirmation of the order price. We accept major credit cards and other secure payment methods through our Shopify-integrated checkout. We reserve the right to refuse any order."
    },
    {
      title: "Shipping & Delivery",
      content: "Shipping times and costs are calculated at checkout. While we aim to meet estimated delivery dates, these are not guaranteed. Risk of loss and title for items purchased from us pass to you upon delivery of the items to the carrier."
    },
    {
      title: "Returns & Exchanges",
      content: "We offer a 30-day return policy for items in their original, unworn, and unwashed condition with all tags attached. Please visit our Returns page for specific instructions on how to initiate a return. Customers are responsible for return shipping costs unless the item is faulty."
    },
    {
      title: "Intellectual Property",
      content: "All content on this website, including designs, text, graphics, logos, and images, is the property of Wicked Works or its content suppliers and is protected by international copyright laws. Unauthorized use of this content is strictly prohibited."
    },
    {
      title: "Limitation of Liability",
      content: "Wicked Works shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if Wicked Works has been advised of the possibility of such damages."
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
            <p className="text-[10px] font-bold text-charcoal/40 dark:text-white/40 uppercase tracking-[0.3em]">Last Updated: April 2025</p>
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
