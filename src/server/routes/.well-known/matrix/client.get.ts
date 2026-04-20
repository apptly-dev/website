/**
 * Matrix client homeserver discovery.
 *
 * @see {@link https://spec.matrix.org/v1.13/client-server-api/#getwell-knownmatrixclient}
 */
export default defineEventHandler(() => ({
  'm.homeserver': { base_url: 'https://matrix.apptly.co' },
}));
