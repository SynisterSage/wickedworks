// Shopify Customer Account API OAuth utilities

const CLIENT_ID = import.meta.env.VITE_CUSTOMER_ACCOUNT_CLIENT_ID;
const AUTH_URL = import.meta.env.VITE_CUSTOMER_ACCOUNT_AUTH_URL;
const TOKEN_URL = import.meta.env.VITE_CUSTOMER_ACCOUNT_TOKEN_URL;
const LOGOUT_URL = import.meta.env.VITE_CUSTOMER_ACCOUNT_LOGOUT_URL;
const APP_URL = import.meta.env.VITE_APP_URL;
const REDIRECT_URI = `${APP_URL}/auth/callback`;

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
    query getCustomer {
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

  const response = await fetch(`https://shopify.com/authentication/73608003721/customer/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch customer data');
  }

  const { data } = await response.json();
  const customer = data.customer;

  return {
    id: customer.id,
    email: customer.emailAddress?.emailAddress || '',
    firstName: customer.firstName,
    lastName: customer.lastName,
    displayName: customer.displayName,
  };
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
