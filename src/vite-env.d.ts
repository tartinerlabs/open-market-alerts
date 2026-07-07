/// <reference types="vite/client" />
/// <reference types="chrome" />

interface ImportMetaEnv {
  readonly EXTENSION_NAME: string;
  readonly EXTENSION_ID: string;
  readonly WEB_APP_URL: string;
}

interface Import {
  readonly env: ImportMetaEnv;
}
