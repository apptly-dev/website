// @ts-check
import { GLOB_CSS, withPoupe } from '@poupe/eslint-config';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withPoupe(withNuxt(), {
  // Repo scratch directory — analysis dumps, draft prose, captured
  // command output. Never committed; not source.
  ignores: ['.tmp/**'],
}, {
  // Scoped Vue <style> blocks and standalone .css files pull
  // theme tokens from @poupe/tailwindcss via `@reference`; the
  // static linter can't follow that resolution.
  files: [GLOB_CSS],
  rules: {
    'css/no-invalid-properties': ['error', { allowUnknownVariables: true }],
  },
});
