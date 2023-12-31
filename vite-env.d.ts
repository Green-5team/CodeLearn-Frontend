/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CUSTOM_ENV_VARIABLE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
