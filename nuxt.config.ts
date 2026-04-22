// isProduction = false
const isProduction = process.env.PRODUCTION === 'production';
// autoFix = true
const autoFix = !isProduction &&
  process.env.VITE_AUTO_FIX !== 'false' &&
  process.env.VITE_AUTO_FIX !== 'no';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/ui',
  ],
  devtools: { enabled: !isProduction },
  srcDir: 'src',
  serverDir: 'src/server',

  compatibilityDate: '2026-04-20',
  nitro: {
    preset: 'cloudflare-module',
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
  telemetry: true,

  eslint: {
    checker: {
      lintOnStart: autoFix,
      fix: autoFix,
    },
    config: {
      stylistic: true,
    },
  },
});
