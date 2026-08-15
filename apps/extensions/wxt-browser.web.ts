/**
 * Vite web builds cannot load `wxt/browser` (webextension-polyfill throws
 * outside an extension). AppRouter still imports extension-routing, which
 * uses this stub so the SPA treats runtime APIs as unavailable.
 */
export const browser = {
  runtime: undefined,
  storage: undefined,
  tabs: undefined,
};
