/**
 * Matrix federation server discovery.
 *
 * @see {@link https://spec.matrix.org/v1.13/server-server-api/#getwell-knownmatrixserver}
 */
export default defineEventHandler(() => ({
  'm.server': 'matrix.apptly.co:443',
}));
