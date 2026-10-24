import { useLayoutEffect, type ReactNode } from 'react';
import type { Preview } from '@storybook/react-vite';
import '@fontsource-variable/plus-jakarta-sans';
import '../dist/styles.css';
import './preview.css';

function ThemeFrame({ children, theme, motion }: { children: ReactNode; theme: string; motion: string }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.dpTheme = theme;
    document.documentElement.lang = 'en';
    document.body.classList.add('dp-theme');
    document.body.dataset.motionPreview = motion;
  }, [theme, motion]);
  return <div className="story-frame">{children}</div>;
}

const preview: Preview = {
  globalTypes: {
    theme: { description: 'Library theme', toolbar: { title: 'Theme', icon: 'circlehollow', items: ['light', 'dark'], dynamicTitle: true } },
    motion: { description: 'System preference or explicit animation preview', toolbar: { title: 'Motion', icon: 'play', items: [{ value: 'system', title: 'System motion preference' }, { value: 'full', title: 'Preview animations' }], dynamicTitle: true } },
  },
  initialGlobals: { theme: import.meta.env.VITE_TEST_THEME || 'light', motion: 'system' },
  decorators: [(Story, context) => <ThemeFrame theme={context.globals.theme} motion={context.globals.motion}><Story /></ThemeFrame>],
  parameters: {
    options: { storySort: { order: ['Start here', ['Catalogue', 'Integration', 'Agent API', 'Accessibility'], 'Components', 'Patterns'] } },
    layout: 'padded',
    controls: { expanded: true },
    a11y: {
      test: 'error',
      options: { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } },
    },
    docs: { codePanel: true },
  },
};
export default preview;
