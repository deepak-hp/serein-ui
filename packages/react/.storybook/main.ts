import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { resolve } from 'node:path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)', '../stories/**/*.mdx'],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest', '@storybook/addon-mcp'],
  staticDirs: [{ from: '../ai', to: '/ai' }, { from: '../public', to: '/' }],
  features: { componentsManifest: true },
  typescript: { reactDocgen: 'react-docgen-typescript', reactDocgenTypescriptOptions: {
    propFilter: prop => !prop.parent?.fileName.includes('node_modules') || ['children', 'className', 'style', 'id', 'href', 'target', 'rel', 'title', 'role', 'aria-label'].includes(prop.name),
  } },
  core: { disableTelemetry: true },
  // Extract API metadata from TypeScript, render the actual compiled package.
  viteFinal: async config => mergeConfig(config, {
    // Vite ignores its configured output directory while watching. Storybook's
    // default is `dist`, which is this library's live compiled package.
    build: { outDir: 'storybook-static' },
    optimizeDeps: { include: ['@base-ui/react/accordion', '@base-ui/react/alert-dialog', '@base-ui/react/combobox', '@base-ui/react/menu', '@base-ui/react/number-field', '@base-ui/react/popover', '@base-ui/react/slider', '@base-ui/react/toast', '@base-ui/react/toggle-group', '@base-ui/react/toggle', '@base-ui/react/tooltip'] },
    resolve: { alias: [{ find: '../src/index', replacement: resolve('dist/index.js') }] },
  }),
};
export default config;
