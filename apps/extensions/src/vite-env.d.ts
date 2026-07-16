/// <reference types="vite/client" />
/// <reference types="chrome" />

interface ImportMetaEnv {
  readonly EXTENSION_NAME: string;
  readonly EXTENSION_ID: string;
}

interface Import {
  readonly env: ImportMetaEnv;
}
