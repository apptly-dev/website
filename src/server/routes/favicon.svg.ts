const lightColours = '--start-colour: #9e1f63; --stop-colour: #00a4ca';
const darkColours = '--start-colour: #ff1f63; --stop-colour: #00ffff';

const themeStyle = `<style>
:root { ${lightColours} }
@media (prefers-color-scheme: dark) {
  :root { ${darkColours} }
}
</style>`;

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') {
    setHeader(event, 'Allow', 'GET, HEAD');
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  const logo = await useStorage('assets:public').getItem<string>('img/logo-no-text.svg');
  if (typeof logo !== 'string') {
    throw createError({ statusCode: 500, statusMessage: 'Favicon source SVG missing' });
  }

  setHeader(event, 'Content-Type', 'image/svg+xml');
  setHeader(event, 'Cache-Control', 'public, max-age=86400');
  const themedLogo = logo.replace(/<defs(\s[^>]*)?>/i, `<defs$1>${themeStyle}`);
  if (themedLogo === logo) {
    throw createError({ statusCode: 500, statusMessage: 'Favicon SVG missing <defs>' });
  }
  return themedLogo;
});
