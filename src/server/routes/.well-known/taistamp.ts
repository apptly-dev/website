// Signed TAI64N timestamp endpoint at /.well-known/taistamp,
// resolving the signing key set from process.env.TAISTAMP_SECRET
// via resolveTaistampHandler in ../../utils/taistamp.
//
// Local dev reads the secret from `.dev.vars` via `pnpm preview`
// (wrangler dev); production binds it as a script-level secret
// via `wrangler secret put` or as a secret-typed build variable
// in the Workers Builds dashboard. Once at script level it flows
// into every uploaded version.
//
// With no secret bound the route still serves unsigned TAI64N
// labels so smoke tests work out of the box. Malformed entries
// inside an otherwise-valid secret are skipped (lenient parse);
// a secret that yields no valid entries at all — every entry
// malformed, or the value is whitespace/punctuation only —
// returns a generic plain-text 500. The parser error is logged
// via console.error with an `init failed` / `request failed`
// phase prefix so wrangler tail and the CF dashboard surface
// the cause. Fixing a misconfigured secret requires a Worker
// redeploy — the resolved handler is memoised for the isolate
// lifetime.

import { toWebRequest } from 'h3';

import { resolveTaistampHandler } from '../../utils/taistamp';

type Handler = Awaited<ReturnType<typeof resolveTaistampHandler>>;

const errorResponse = (): Response =>
  new Response('taistamp: internal error\n', {
    status: 500,
    statusText: 'Internal Server Error',
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

// Sentinel installed when the resolver rejects — every
// subsequent request gets the same plain-text 500 with
// no further log noise. Misconfiguration is terminal for the
// isolate; redeploy to retry.
const initFailHandler: Handler = async () => errorResponse();

// Cache the in-flight promise, not the resolved handler:
// `??=` runs before any await, so concurrent first-requests
// share the same resolution. `.catch()` folds rejection into
// `initFailHandler` so the cached promise never holds a
// rejection — one resolver call per isolate cold start, one
// log line on failure even under burst.
let handlerPromise: Promise<Handler> | undefined;

export default defineEventHandler(async (event) => {
  handlerPromise ??= resolveTaistampHandler(process.env.TAISTAMP_SECRET ?? '')
    .catch((error) => {
      console.error('[taistamp] init failed:', error);
      return initFailHandler;
    });
  const handler = await handlerPromise;
  try {
    return await handler(toWebRequest(event));
  } catch (error) {
    console.error('[taistamp] request failed:', error);
    return errorResponse();
  }
});
