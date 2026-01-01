/**
 * Supabase Edge Function: Notify Back In Stock
 * 
 * Runs every 2 hours to check for products that are back in stock
 * and notify customers who are subscribed to those specific products.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SHOPIFY_ADMIN_TOKEN = Deno.env.get('SHOPIFY_ADMIN_API_TOKEN')!;
const SHOPIFY_STORE_DOMAIN = Deno.env.get('SHOPIFY_STORE_DOMAIN') || 'wicked-works-3.myshopify.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const FROM_EMAIL = 'notifications@wickedworks.store';

serve(async (req) => {
  try {
    console.log('Starting back-in-stock notification job...');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get all active product notification subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('product_notifications')
      .select('*')
      .eq('is_enabled', true);

    if (subsError) throw subsError;

    console.log(`Found ${subscriptions?.length || 0} active subscriptions`);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No active subscriptions' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Group by product handle
    const productHandles = [...new Set(subscriptions.map(s => s.product_handle))];
    const notificationsToSend: Array<{ email: string; productHandle: string; productTitle: string; productImage?: string }> = [];

    // Check inventory for each product
    for (const handle of productHandles) {
      try {
        const productResponse = await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-04/graphql.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
            },
            body: JSON.stringify({
              query: `
                query GetProduct($handle: String!) {
                  productByHandle(handle: $handle) {
                    id
                    title
                    handle
                    featuredImage {
                      url
                    }
                    totalInventory
                  }
                }
              `,
              variables: { handle },
            }),
          }
        );

        const productData = await productResponse.json();
        const product = productData.data?.productByHandle;

        // If product is in stock, notify subscribers
        if (product && product.totalInventory > 0) {
          const subscribedCustomers = subscriptions.filter(s => s.product_handle === handle);

          for (const sub of subscribedCustomers) {
            try {
              // Fetch customer email
              const customerResponse = await fetch(
                `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-04/customers/${sub.customer_id}.json`,
                {
                  headers: {
                    'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
                  },
                }
              );
              const customerData = await customerResponse.json();

              if (customerData.customer?.email) {
                notificationsToSend.push({
                  email: customerData.customer.email,
                  productHandle: handle,
                  productTitle: product.title,
                  productImage: product.featuredImage?.url,
                });

                // Disable the notification (one-time alert)
                await supabase
                  .from('product_notifications')
                  .update({ is_enabled: false, updated_at: new Date().toISOString() })
                  .eq('id', sub.id);
              }
            } catch (err) {
              console.error(`Failed to process customer ${sub.customer_id}:`, err);
            }
          }
        }
      } catch (err) {
        console.error(`Failed to check product ${handle}:`, err);
      }
    }

    console.log(`Sending ${notificationsToSend.length} back-in-stock notifications`);

    // Send emails via Resend
    const emailPromises = notificationsToSend.map((notification) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: notification.email,
          subject: `🎉 ${notification.productTitle} is Back in Stock!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>Great News!</h1>
              <p><strong>${notification.productTitle}</strong> is back in stock at Wicked Works.</p>
              ${notification.productImage ? `<img src="${notification.productImage}" alt="${notification.productTitle}" style="max-width: 300px; border-radius: 8px; margin: 20px 0;" />` : ''}
              <a href="https://wickedworks.store/products/${notification.productHandle}" 
                 style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
                Shop Now
              </a>
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                You requested to be notified when this product came back in stock. This is a one-time notification.
              </p>
            </div>
          `,
        }),
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter((r) => r.status === 'fulfilled').length;

    console.log(`Successfully sent ${successCount}/${notificationsToSend.length} emails`);

    return new Response(
      JSON.stringify({
        message: 'Back-in-stock notification completed',
        notificationsSent: successCount,
        notificationsTotal: notificationsToSend.length,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in notify-back-in-stock:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
