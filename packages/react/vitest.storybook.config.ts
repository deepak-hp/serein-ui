import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { resolve } from 'node:path';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve('.playwright');

export default defineConfig({
  plugins: [storybookTest({ configDir: '.storybook' })],
  test: {
    name: 'storybook',
    browser: { enabled: true, provider: playwright({ contextOptions: { reducedMotion: process.env.VITE_TEST_REDUCED_MOTION === 'reduce' ? 'reduce' : 'no-preference' } }), headless: true, instances: [{ browser: 'chromium' }] },
    setupFiles: ['./.storybook/vitest.setup.ts'],
  },
});
