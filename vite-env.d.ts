/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_DOMAIN: string;
  readonly VITE_STOREFRONT_TOKEN: string;
  readonly VITE_SHOPIFY_API_VERSION: string;
  readonly VITE_USE_MOCKS: string;
  readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
