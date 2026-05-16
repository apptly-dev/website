// Fast-path dispatcher in front of Nitro.
//
// Simple endpoints bypass Nitro's request pipeline.
// Everything else delegates to Nitro's emitted module handler.
//
// `export *` propagates any named exports Nitro emits (Durable Object
// classes, Workflow classes) through the bundled entry so wrangler can
// resolve them at runtime; the dispatcher's own default overrides the
// re-exported one.

import nitro from './nitro-entry.mjs';

import { TAISTAMP_PATH, taistampHandler } from './taistamp.ts';

export * from './nitro-entry.mjs';

const nitroHandler = nitro as ExportedHandler<Env>;
const nitroFetch = nitroHandler.fetch;
if (!nitroFetch) {
  throw new TypeError('Nitro handler exports no fetch');
}

const handler: ExportedHandler<Env> = {
  ...nitroHandler,
  fetch(request, env, context) {
    if (new URL(request.url).pathname === TAISTAMP_PATH) {
      return taistampHandler(request, env);
    }
    return nitroFetch(request, env, context);
  },
};

export default handler;
