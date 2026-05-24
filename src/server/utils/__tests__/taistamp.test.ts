import { decodeBase64, newKeys } from '@kagal/ed25519-secret';
import {
  asNonce,
  composeSignaturePayload,
  extractLeapSeconds,
  readLabel,
} from '@kagal/taistamp';
import { describe, expect, it } from 'vitest';

import { resolveTaistampHandler } from '../taistamp';

const TEST_SELECTOR = 'test';
// 32 zero bytes, RFC 4648 §4 base64 (43 'A' + 1 '=').
const TEST_SEED_B64 = `${'A'.repeat(43)}=`;
const TEST_SECRET = `${TEST_SELECTOR}:${TEST_SEED_B64}`;

const TEST_URL = 'https://example.com/.well-known/taistamp';
const NONCE_HEADER = ':dGVzdC1ub25jZQ==:';

describe('resolveTaistampHandler', () => {
  it('returns an unsigned handler when secret is empty', async () => {
    const handler = await resolveTaistampHandler('');
    const response = await handler(new Request(TEST_URL));

    expect(response.status).toBe(200);
    expect(response.headers.get('tai-key-selector')).toBeNull();
    expect(response.headers.get('tai-signature')).toBeNull();
  });

  it('returns a signed handler for a valid selector:seed entry', async () => {
    const handler = await resolveTaistampHandler(TEST_SECRET);
    const response = await handler(
      new Request(TEST_URL, { headers: { 'TAI-Nonce': NONCE_HEADER } }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('TAI-Key-Selector')).toBe(TEST_SELECTOR);
    expect(response.headers.get('TAI-Signature')).not.toBeNull();
  });

  it('omits signature headers when the request carries no TAI-Nonce', async () => {
    const handler = await resolveTaistampHandler(TEST_SECRET);
    const response = await handler(new Request(TEST_URL));

    expect(response.status).toBe(200);
    expect(response.headers.get('TAI-Key-Selector')).toBeNull();
    expect(response.headers.get('TAI-Signature')).toBeNull();
  });

  it('produces a verifiable Ed25519 signature', async () => {
    const handler = await resolveTaistampHandler(TEST_SECRET);
    const response = await handler(
      new Request(TEST_URL, { headers: { 'TAI-Nonce': NONCE_HEADER } }),
    );

    const label = await readLabel(response);
    const leapSeconds = extractLeapSeconds(response.headers);
    const selector = response.headers.get('TAI-Key-Selector');
    const sigHeader = response.headers.get('TAI-Signature');
    const nonce = asNonce(NONCE_HEADER);

    expect(leapSeconds).toBeDefined();
    expect(selector).toBe(TEST_SELECTOR);
    expect(sigHeader).toMatch(/^:.+:$/);
    expect(nonce).toBeDefined();

    // sf-binary on the wire is `:<base64>:`; strip the wrapping.
    const sigBytes = decodeBase64(sigHeader!.slice(1, -1));
    const payload = composeSignaturePayload(
      label,
      leapSeconds!,
      selector!,
      nonce!,
    );

    const { publicKey } = await newKeys(TEST_SEED_B64);
    const ok = await crypto.subtle.verify(
      'Ed25519',
      publicKey,
      sigBytes,
      payload,
    );
    expect(ok).toBe(true);
  });

  it('signs with the last entry when given a multi-secret string', async () => {
    const previousSelector = 'old';
    const currentSelector = 'new';
    const multi = [
      `${previousSelector}:${TEST_SEED_B64}`,
      `${currentSelector}:${TEST_SEED_B64}`,
    ].join(' ');

    const handler = await resolveTaistampHandler(multi);
    const response = await handler(
      new Request(TEST_URL, { headers: { 'TAI-Nonce': NONCE_HEADER } }),
    );

    expect(response.headers.get('TAI-Key-Selector')).toBe(currentSelector);
  });

  it('skips malformed entries (lenient parse) and signs with a valid one', async () => {
    // 'bad:AAA=' tokenises as one entry but decodes to 2 bytes, not 32 —
    // parser rejects. Strict mode would throw; lenient skips and the
    // remaining valid entry signs.
    const handler = await resolveTaistampHandler(`bad:AAA= ${TEST_SECRET}`);
    const response = await handler(
      new Request(TEST_URL, { headers: { 'TAI-Nonce': NONCE_HEADER } }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('TAI-Key-Selector')).toBe(TEST_SELECTOR);
    expect(response.headers.get('TAI-Signature')).not.toBeNull();
  });

  it('throws TypeError when secret contains no valid entries', async () => {
    const rejection = resolveTaistampHandler('   ,,,  ');
    await expect(rejection).rejects.toThrow(TypeError);
    await expect(rejection).rejects.toThrow(
      'no valid selector:base64-seed entries',
    );
  });
});
