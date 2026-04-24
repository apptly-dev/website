import tailwindcss from '@tailwindcss/vite';

// isProduction = false
const isProduction = process.env.PRODUCTION === 'production';
// autoFix = true
const autoFix = !isProduction &&
  process.env.VITE_AUTO_FIX !== 'false' &&
  process.env.VITE_AUTO_FIX !== 'no';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
  ],
  components: [
    { path: '~/components/poupe', prefix: 'P', pathPrefix: false },
    '~/components',
  ],
  devtools: { enabled: !isProduction },
  css: ['~/assets/css/main.css'],
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
  },
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

  vite: {
    plugins: [tailwindcss()],
  },
  telemetry: true,
  hooks: {
    'vite:extendConfig'(config) {
      // @nuxtjs/mdc pushes remark/rehype entries into optimizeDeps.include
      // after config merges, but they're unresolvable (server-only deps).
      const include = config.optimizeDeps?.include;
      if (include) {
        config.optimizeDeps!.include = include.filter(
          (entry: string) => !entry.includes('@nuxtjs/mdc >'),
        );
      }
    },
  },

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
