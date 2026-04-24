import { defineCollection, defineContentConfig } from '@nuxt/content';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const resolve = (...segments: string[]) =>
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ...segments);

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        cwd: resolve('src/content'),
      },
    }),
  },
});
