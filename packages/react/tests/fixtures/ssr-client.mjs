import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { SsrApp } from './ssr-app.mjs';

window.__ssrHydrated = false;
window.__ssrRecoverableErrors = [];
hydrateRoot(document.getElementById('root'), React.createElement(SsrApp), {
  onRecoverableError(error) { window.__ssrRecoverableErrors.push(String(error)); },
});
