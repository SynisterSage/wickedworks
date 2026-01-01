import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/routeHelpers';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: "Data Collection",
      content: "When you visit Wicked Works, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. This includes personal identifiers such as name, billing address, shipping address, payment information, and email address."
    },
    {
      title: "How We Use Your Data",
      content: "We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers."
    },
    {
      title: "Sharing Personal Information",
      content: "We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you. For example, we use Shopify to power our online store. You can read more about how Shopify uses your Personal Information here: https://www.shopify.com/legal/privacy."
    },
    {
      title: "Your Rights",
      content: "Depending on your location, you may have rights regarding your personal information, such as the right to access, correct, or delete the data we hold about you. You may also have the right to object to certain processing activities."
    },
    {
      title: "Cookie Policy",
      content: "A cookie is a small amount of information that’s downloaded to your computer or device when you visit our Site. We use a number of different cookies, including functional, performance, advertising, and social media or content cookies. Cookies make your browsing experience better by allowing the website to remember your actions and preferences (such as login and region selection)."
    },
    {
      title: "Cookie Management",
      content: "Most browsers automatically accept cookies, but you can choose whether or not to accept cookies through your browser controls, often found in your browser’s “Tools” or “Preferences” menu. For more information on how to modify your browser settings or how to block, manage or filter cookies can be found in your browser’s help file."
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
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em]">Last Updated: April 2025</p>
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