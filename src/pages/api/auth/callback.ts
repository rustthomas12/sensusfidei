// Step 2 of the /admin GitHub sign-in. GitHub redirects here with a `code`
// after you approve the login. This exchanges that code for an access
// token (server-side, using the OAuth app's client secret — never exposed
// to the browser) and hands the token back to the CMS popup via the
// postMessage handshake Decap/Sveltia CMS expects.
import type { APIRoute } from 'astro';

export const prerender = false;

function resultPage(success: boolean, payload: Record<string, unknown>) {
  const message = `authorization:github:${success ? 'success' : 'error'}:${JSON.stringify(payload)}`;
  // JSON.stringify-ing the whole message (not just the payload) safely
  // embeds it as a single JS string literal, closing off any way stray
  // quotes or `</script>` sequences could break out of the inline script.
  const safeMessage = JSON.stringify(message);

  return `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(${safeMessage}, e.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}

export const GET: APIRoute = async ({ url }) => {
  const clientId = import.meta.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('GitHub OAuth is not configured on the server.', { status: 500 });
  }

  const code = url.searchParams.get('code');

  if (!code) {
    return new Response(resultPage(false, { message: 'Missing authorization code.' }), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL('/api/auth/callback', url.origin).toString(),
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
    return new Response(
      resultPage(false, {
        message: tokenData.error_description || 'GitHub token exchange failed.',
      }),
      { status: 400, headers: { 'Content-Type': 'text/html' } },
    );
  }

  return new Response(resultPage(true, { token: tokenData.access_token, provider: 'github' }), {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};
