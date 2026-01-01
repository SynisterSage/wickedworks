/**
 * Supabase Edge Function: Notify New Products
 * 
 * Runs every 6 hours to check for new products and send notifications
 * to customers who opted in for "new arrivals" notifications.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SHOPIFY_ADMIN_TOKEN = Deno.env.get('SHOPIFY_ADMIN_API_TOKEN')!;
const SHOPIFY_STORE_DOMAIN = Deno.env.get('SHOPIFY_STORE_DOMAIN') || 'wicked-works-3.myshopify.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FROM_EMAIL = 'notifications@wickedworks.store';

interface Product {
  id: string;
  title: string;
  handle: string;
  createdAt: string;
  featuredImage?: {
    url: string;
  };
}

serve(async (req) => {
  try {
    console.log('Starting new products notification job...');

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Calculate time threshold (6 hours ago)
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

    // Fetch new products from Shopify
    const shopifyResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-04/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query GetNewProducts($createdAt: DateTime!) {
              products(first: 20, query: "created_at:>=$createdAt", sortKey: CREATED_AT, reverse: true) {
                edges {
                  node {
                    id
                    title
                    handle
                    createdAt
                    featuredImage {
                      url
                    }
                  }
                }
              }
            }
          `,
          variables: { createdAt: sixHoursAgo },
        }),
      }
    );

    const shopifyData = await shopifyResponse.json();
    const newProducts: Product[] = shopifyData.data?.products?.edges?.map((e: any) => e.node) || [];

    console.log(`Found ${newProducts.length} new products`);

    if (newProducts.length === 0) {
      return new Response(JSON.stringify({ message: 'No new products found' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get customers who want new arrivals notifications
    const { data: preferences, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('customer_id')
      .eq('notify_new_arrivals', true);

    if (prefsError) throw prefsError;

    console.log(`Found ${preferences?.length || 0} customers to notify`);

    if (!preferences || preferences.length === 0) {
      return new Response(JSON.stringify({ message: 'No customers to notify' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch customer emails from Shopify (in batches)
    const customerIds = preferences.map(p => p.customer_id);
    const emails: string[] = [];

    for (const customerId of customerIds) {
      try {
        const customerResponse = await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-04/customers/${customerId}.json`,
          {
            headers: {
              'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
            },
          }
        );
        const customerData = await customerResponse.json();
        if (customerData.customer?.email) {
          emails.push(customerData.customer.email);
        }
      } catch (err) {
        console.error(`Failed to fetch customer ${customerId}:`, err);
      }
    }

    console.log(`Sending emails to ${emails.length} customers`);

    // Build email HTML
    const productsHtml = newProducts
      .map(
        (p) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        ${p.featuredImage ? `<img src="${p.featuredImage.url}" alt="${p.title}" style="max-width: 200px; border-radius: 4px;" />` : ''}
        <h3 style="margin: 10px 0;">${p.title}</h3>
        <a href="https://wickedworks.store/products/${p.handle}" 
           style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">
          View Product
        </a>
      </div>
    `
      )
      .join('');

    // Send emails via Resend
    const emailPromises = emails.map((email) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: email,
          subject: `🔥 New Drops at Wicked Works`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>New Products Just Dropped</h1>
              <p>Check out the latest additions to our collection:</p>
              ${productsHtml}
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                You're receiving this because you opted in to new product notifications. 
                <a href="https://wickedworks.store/account">Manage preferences</a>
              </p>
            </div>
          `,
        }),
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter((r) => r.status === 'fulfilled').length;

    console.log(`Successfully sent ${successCount}/${emails.length} emails`);

    return new Response(
      JSON.stringify({
        message: 'New products notification completed',
        productsFound: newProducts.length,
        emailsSent: successCount,
        emailsTotal: emails.length,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in notify-new-products:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
