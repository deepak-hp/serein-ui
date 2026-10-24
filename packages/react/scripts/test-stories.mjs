import { spawnSync } from 'node:child_process';
for (const theme of ['light', 'dark']) {
 for (const motion of ['no-preference', 'reduce']) {
  console.log(`\nStorybook interaction and accessibility checks: ${theme}, motion=${motion}`);
  const run = spawnSync(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--config', 'vitest.storybook.config.ts'], {
    stdio: 'inherit', env: { ...process.env, VITE_TEST_THEME: theme, VITE_TEST_REDUCED_MOTION: motion },
  });
  if (run.status !== 0) process.exit(run.status || 1);
 }
}
