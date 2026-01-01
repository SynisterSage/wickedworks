/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_DOMAIN: string;
  readonly VITE_STOREFRONT_TOKEN: string;
  readonly VITE_SHOPIFY_API_VERSION: string;
  readonly VITE_USE_MOCKS: string;
  readonly VITE_CUSTOMER_ACCOUNT_CLIENT_ID: string;
  readonly VITE_CUSTOMER_ACCOUNT_AUTH_URL: string;
  readonly VITE_CUSTOMER_ACCOUNT_TOKEN_URL: string;
  readonly VITE_CUSTOMER_ACCOUNT_LOGOUT_URL: string;
  readonly VITE_APP_URL: string;
  readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
