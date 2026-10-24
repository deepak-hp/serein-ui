import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans';
import '@serein-ui/react/styles.css';
import App from './App';
import { applyTheme, readTheme } from './theme';
import './app.css';

applyTheme(readTheme());
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
