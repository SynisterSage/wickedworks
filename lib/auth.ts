// Shopify Customer Account API OAuth utilities

const CLIENT_ID = import.meta.env.VITE_CUSTOMER_ACCOUNT_CLIENT_ID;
const AUTH_URL = import.meta.env.VITE_CUSTOMER_ACCOUNT_AUTH_URL;
const TOKEN_URL = import.meta.env.VITE_CUSTOMER_ACCOUNT_TOKEN_URL;
const LOGOUT_URL = import.meta.env.VITE_CUSTOMER_ACCOUNT_LOGOUT_URL;
const APP_URL = import.meta.env.VITE_APP_URL;
const REDIRECT_URI = `${APP_URL}/auth/callback`;

// Extract store ID from auth URL (e.g., "73608003721" from auth URL)
const STORE_ID = AUTH_URL.split('/')[4];
const CUSTOMER_API_URL = `https://shopify.com/${STORE_ID}/account/customer/api/unstable/graphql.json`;

// State name to abbreviation mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY',
  'District of Columbia': 'DC',
};

// Generate random string for state parameter (CSRF protection)
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Generate code verifier for PKCE
function generateCodeVerifier(): string {
  return generateRandomString(128);
}

// Generate code challenge from verifier
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  idToken?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
}

export interface ShopifyOrder {
  id: string;
  name: string; // Order number like "#1001"
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: Array<{
      title: string;
      quantity: number;
      image?: {
        url: string;
      };
      price: {
        amount: string;
        currencyCode: string;
      };
    }>;
  };
}

export interface ShopifyAddress {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

// Redirect to Shopify login
export async function initiateLogin(): Promise<void> {
  const state = generateRandomString(16);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store state and verifier for callback validation
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: 'openid email customer-account-api:full',
    redirect_uri: REDIRECT_URI,
    state,
    response_type: 'code',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${AUTH_URL}?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForToken(code: string, state: string): Promise<AuthTokens> {
  const storedState = sessionStorage.getItem('oauth_state');
  const codeVerifier = sessionStorage.getItem('code_verifier');

  if (state !== storedState) {
    throw new Error('Invalid state parameter');
  }

  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const data = await response.json();

  // Clean up session storage
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('code_verifier');

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
    idToken: data.id_token,
  };
}

// Get customer data from Shopify
export async function fetchCustomer(accessToken: string): Promise<Customer> {
  const query = `
    query {
      customer {
        id
        emailAddress {
          emailAddress
        }
        firstName
        lastName
        displayName
      }
    }
  `;

  const response = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Customer API error:', errorText);
    throw new Error(`Failed to fetch customer data: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  const customer = result.data.customer;

  return {
    id: customer.id,
    email: customer.emailAddress?.emailAddress || '',
    firstName: customer.firstName,
    lastName: customer.lastName,
    displayName: customer.displayName,
  };
}

// Get customer orders from Shopify
export async function fetchCustomerOrders(accessToken: string): Promise<ShopifyOrder[]> {
  const query = `
    query {
      customer {
        orders(first: 25, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              nodes {
                title
                quantity
                image {
                  url
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Orders API error:', errorText);
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    return []; // Return empty array instead of throwing
  }

  return result.data.customer.orders.nodes;
}

// Get customer addresses from Shopify
export async function fetchCustomerAddresses(accessToken: string): Promise<ShopifyAddress[]> {
  const query = `
    query {
      customer {
        addresses(first: 10) {
          nodes {
            id
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
            phoneNumber
          }
        }
        defaultAddress {
          id
        }
      }
    }
  `;

  const response = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Addresses API error:', errorText);
    throw new Error(`Failed to fetch addresses: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    return []; // Return empty array instead of throwing
  }

  const defaultAddressId = result.data.customer.defaultAddress?.id;
  return result.data.customer.addresses.nodes.map((address: any) => ({
    ...address,
    isDefault: address.id === defaultAddressId,
  }));
}

// Create a new address
export async function createCustomerAddress(accessToken: string, address: Partial<ShopifyAddress>): Promise<ShopifyAddress> {
  const mutation = `
    mutation CreateAddress($address: CustomerAddressInput!) {
      customerAddressCreate(address: $address) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phoneNumber
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    address: {
      firstName: address.firstName,
      lastName: address.lastName,
      address1: address.address1,
      city: address.city,
      zip: address.zip,
      ...(address.province && { territoryCode: (STATE_ABBREVIATIONS[address.province] || address.province).toLowerCase() }),
      ...(address.address2 && { address2: address.address2 }),
      ...(address.phoneNumber && { phoneNumber: address.phoneNumber }),
    },
  };

  const response = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create address error:', errorText);
    throw new Error(`Failed to create address: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  if (result.data.customerAddressCreate.userErrors?.length > 0) {
    throw new Error(result.data.customerAddressCreate.userErrors[0].message);
  }

  return result.data.customerAddressCreate.customerAddress;
}

// Update an address
export async function updateCustomerAddress(accessToken: string, addressId: string, address: Partial<ShopifyAddress>): Promise<ShopifyAddress> {
  const mutation = `
    mutation UpdateAddress($id: ID!, $address: CustomerAddressInput!) {
      customerAddressUpdate(id: $id, address: $address) {
        customerAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          zip
          country
          phoneNumber
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: addressId,
    address: {
      firstName: address.firstName,
      lastName: address.lastName,
      address1: address.address1,
      city: address.city,
      zip: address.zip,
      ...(address.province && { territoryCode: (STATE_ABBREVIATIONS[address.province] || address.province).toLowerCase() }),
      ...(address.address2 && { address2: address.address2 }),
      ...(address.phoneNumber && { phoneNumber: address.phoneNumber }),
    },
  };

  const response = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update address error:', errorText);
    throw new Error(`Failed to update address: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  if (result.data.customerAddressUpdate.userErrors?.length > 0) {
    throw new Error(result.data.customerAddressUpdate.userErrors[0].message);
  }

  return result.data.customerAddressUpdate.customerAddress;
}

// Delete an address
export async function deleteCustomerAddress(accessToken: string, addressId: string): Promise<void> {
  const mutation = `
    mutation DeleteAddress($id: ID!) {
      customerAddressDelete(id: $id) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = { id: addressId };

  const response = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete address error:', errorText);
    throw new Error(`Failed to delete address: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  if (result.data.customerAddressDelete.userErrors?.length > 0) {
    throw new Error(result.data.customerAddressDelete.userErrors[0].message);
  }
}

// Set default address
export async function setDefaultCustomerAddress(accessToken: string, addressId: string): Promise<void> {
  const mutation = `
    mutation SetDefaultAddress($addressId: ID!) {
      customerDefaultAddressUpdate(addressId: $addressId) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = { addressId };

  const response = await fetch(CUSTOMER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Set default address error:', errorText);
    throw new Error(`Failed to set default address: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  if (result.data.customerDefaultAddressUpdate.userErrors?.length > 0) {
    throw new Error(result.data.customerDefaultAddressUpdate.userErrors[0].message);
  }
}

// Logout
export function logout(): void {
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('customer');
  window.location.href = `${LOGOUT_URL}?id_token_hint=${localStorage.getItem('id_token')}`;
}

// Store tokens in localStorage
export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  if (tokens.idToken) {
    localStorage.setItem('id_token', tokens.idToken);
  }
}

// Get stored tokens
export function getStoredTokens(): AuthTokens | null {
  const stored = localStorage.getItem('auth_tokens');
  if (!stored) return null;
  return JSON.parse(stored);
}

// Check if tokens are expired
export function isTokenExpired(tokens: AuthTokens): boolean {
  if (!tokens.expiresAt) return false;
  return Date.now() >= tokens.expiresAt;
}
