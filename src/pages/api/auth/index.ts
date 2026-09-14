// Step 1 of the /admin GitHub sign-in. Sveltia CMS opens this URL in a
// popup when you click "Login with GitHub"; it just forwards you to
// GitHub's own authorize screen and asks GitHub to send the result to our
// callback route below. Needs GITHUB_OAUTH_CLIENT_ID set as a Vercel
// environment variable — see docs/admin-setup.md for how that's created.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ redirect, url }) => {
  const clientId = import.meta.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return new Response('GITHUB_OAUTH_CLIENT_ID is not configured.', { status: 500 });
  }

  const redirectUri = new URL('/api/auth/callback', url.origin);
  const state = crypto.randomUUID();

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri.toString());
  authorizeUrl.searchParams.set('scope', 'repo,user');
  authorizeUrl.searchParams.set('state', state);

  return redirect(authorizeUrl.toString());
};
