
import { http, HttpResponse } from 'msw';
import { MOCK_PRODUCTS } from '../../constants';

export const handlers = [
  // Intercept Shopify all products query
  http.post('*/api/*/graphql.json', async ({ request }) => {
    const body: any = await request.json();
    
    if (body.query.includes('products')) {
      return HttpResponse.json({
        data: {
          products: {
            nodes: MOCK_PRODUCTS,
            pageInfo: { hasNextPage: false }
          }
        }
      });
    }

    return HttpResponse.json({ data: {} });
  }),
];
