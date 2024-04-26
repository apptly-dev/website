// isProduction = false
const isProduction = process.env.PRODUCTION === 'production';
// autoFix = true
const autoFix = !isProduction
  && process.env.VITE_AUTO_FIX !== 'false'
  && process.env.VITE_AUTO_FIX !== 'no';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  telemetry: true,
  devtools: { enabled: !isProduction },

  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/ui',
    'nitro-cloudflare-dev',
  ],

  eslint: {
    checker: {
      lintOnStart: autoFix,
      fix: autoFix,
    },
    config: {
      stylistic: true,
    },
  },

  nitro: {
    preset: 'cloudflare-pages',
  },
});
