// TAI clock endpoint — returns a TAI64N label in the response body.
//
// Precision: millisecond only. Cloudflare Workers deliberately freezes
// Date.now() at the last I/O boundary as a Spectre mitigation;
// performance.now() is identical. No sub-millisecond clock source is
// available in this runtime, so the nanosecond field is always a whole
// multiple of 1,000,000 (last six decimal digits always zero). True
// nanosecond resolution is not achievable here.

// TAI - UTC leap second offset; last updated 2017-01-01, valid through at
// least 2026 but probably leap seconds will be discontinued.
const TAI_OFFSET = 37;
// Upper 32 bits of the TAI64 epoch (2^62 = 0x4000000000000000); lower 32
// bits are the TAI seconds since 1970, which fit comfortably in a UInt32
// until year 2106.
const TAI64_EPOCH_HI = 0x40_00_00_00;
const TAI64_LABEL_PREFIX = '@' + TAI64_EPOCH_HI.toString(16);
const CONTENT_TYPE = 'application/vnd.djb.tai64n';

export const TAICLOCK_PATH = '/.well-known/taiclock';

export function taiclockHandler(request: Request): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(undefined, {
      status: 405,
      statusText: 'Method Not Allowed',
      headers: { Allow: 'GET, HEAD' },
    });
  }

  const nowMs = Date.now();
  const taiSec = Math.trunc(nowMs / 1000) + TAI_OFFSET;
  const nanos = (nowMs % 1000) * 1_000_000;
  const tai64nLabel = TAI64_LABEL_PREFIX +
    taiSec.toString(16).padStart(8, '0') +
    nanos.toString(16).padStart(8, '0');

  const body = request.method === 'HEAD' ? undefined : tai64nLabel;
  return new Response(body, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': CONTENT_TYPE,
      'TAI-Leap-Seconds': String(TAI_OFFSET),
    },
  });
}
