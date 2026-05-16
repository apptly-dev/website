// Signed TAI64N timestamp endpoint at /.well-known/taistamp,
// wired to the in-package handler from @kagal/taistamp.
//
// env.TAISTAMP_SECRET is an Ed25519 secret in the
// `selector:base64` format @kagal/ed25519-secret accepts.
// Local dev reads it from apps/worker/.dev.vars; production
// sets it via `wrangler secret put`, gated by `[secrets]` in
// wrangler.toml. An empty value falls through to unsigned
// labels — reachable in `wrangler dev` without .dev.vars.

import { parseSecretToKey } from '@kagal/ed25519-secret';
import { newTaistampHandler } from '@kagal/taistamp';

type TaistampFetch = (request: Request) => Promise<Response>;

function makeTaistampHandler() {
  let handler: Promise<TaistampFetch> | undefined;
  return async (request: Request, env: Env): Promise<Response> => {
    handler ??= buildHandler(env.TAISTAMP_SECRET);
    return (await handler)(request);
  };
}

async function buildHandler(secret: string): Promise<TaistampFetch> {
  if (!secret) return newTaistampHandler();
  try {
    const { selector, signer } = await parseSecretToKey(secret);
    return newTaistampHandler({ selector, signer });
  } catch (error) {
    // Surface init failure to `wrangler tail` without putting the
    // parser's message in the response body. The rejection stays
    // cached for the isolate's lifetime, so this logs once per
    // bad isolate; clients see the runtime's default 500.
    console.error('taistamp init failed:', error);
    throw error;
  }
}

export const taistampHandler = makeTaistampHandler();

export { TAISTAMP_PATH } from '@kagal/taistamp';
