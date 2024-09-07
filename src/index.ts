import * as auth0 from 'auth0-js';

import {
  AUTH_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_LOGIN_REDIRECT_URL,
  AUTH0_LOGIN_RESPONSE_TYPE,
  AUTH0_USER_SCOPE,
} from './config.dev';
// It should be loaded asynchronously so it doesn't affect page load times.
const init = async () => {
  const authClient = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH_CLIENT_ID,
    scope: AUTH0_USER_SCOPE,
    redirectUri: AUTH0_LOGIN_REDIRECT_URL,
    responseType: AUTH0_LOGIN_RESPONSE_TYPE,
  });

  const loginButton = document.getElementById('authLogin');

  const getIsAuthenticated = async () => {
    if (localStorage.getItem('expires_at')) {
      const expire_At = localStorage.getItem('expires_at');
      const expiresAt = expire_At ? JSON.parse(localStorage.getItem('expires_at') ?? '{}') : 0;
      return new Date().getTime() < expiresAt;
    }
    return false;
  };

  window.Webflow ||= [];
  window.Webflow.push(async () => {
    if (loginButton) {
      const isAuthenticated = await getIsAuthenticated();
      if (isAuthenticated) {
        loginButton.innerHTML = 'Profile';
      }
      loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (await getIsAuthenticated()) {
          window.location.href = AUTH0_LOGIN_REDIRECT_URL;
        }

        authClient.authorize({
          nonce: '',
          state: '',
        });
      });
    }
  });
};

init();
