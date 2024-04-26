// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: [
    '**/*.{cjs,mjs,js,ts,vue}',
  ],
  rules: {
    'vue/multi-word-component-names': 0,
    '@stylistic/brace-style': ['error', '1tbs'],
    '@stylistic/indent': ['error', 2],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'always'],
  },
});
