// resolveTaistampHandler turns a secret string into a signed
// (or unsigned) Taistamp fetch handler.
//
// The secret is one or more `selector:base64-seed` Ed25519
// entries separated by whitespace or punctuation. An empty
// secret yields an unsigned handler so smoke tests work out
// of the box; a configured-but-empty value (whitespace-only,
// punctuation-only) is treated as non-empty intent rather
// than silently falling back. Parsing runs in lenient mode —
// malformed entries are skipped so one bad new key in a
// rotation set doesn't kill the whole secret — but a secret
// that yields zero valid entries throws so the
// misconfiguration surfaces. Among valid entries, splitLast
// picks the last (by convention) for signing new responses.

import { parseSecretsToKeys, splitLast } from '@kagal/ed25519-secret';
import { newTaistampHandler } from '@kagal/taistamp';

export async function resolveTaistampHandler(secret: string) {
  if (!secret) {
    return newTaistampHandler();
  }
  const keys = await parseSecretsToKeys(secret, false);
  const { last } = splitLast(keys);
  if (!last) {
    throw new TypeError(
      'secret contains no valid selector:base64-seed entries',
    );
  }
  return newTaistampHandler({ selector: last.selector, signer: last.signer });
}
