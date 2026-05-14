// @ts-check
import { defineConfig } from '@poupe/eslint-config';

export default defineConfig({
  ignores: ['dist', '.wrangler', 'worker-configuration.d.ts'],
});
