import { loginScopes, storageAccountScopes } from '@/auth/auth.config';
import type { AccessTokenResult, AuthContext } from '@/auth/auth.types';
import { msalInstanceKey } from '@/injection.types';
import { InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { inject } from 'vue';

export const ensureFreshTokens = async (msalInstance: PublicClientApplication) => {
  try {
    await msalInstance.acquireTokenSilent({
      scopes: loginScopes,
      forceRefresh: true,
      refreshTokenExpirationOffsetSeconds: 12 * 60 * 60,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof InteractionRequiredAuthError) {
      msalInstance.acquireTokenRedirect({
        scopes: loginScopes,
      });
    }

    throw error;
  }
};

export const acquireAccessToken = async (
  msalInstance: PublicClientApplication,
): Promise<AccessTokenResult> => {
  try {
    const authResult = await msalInstance.acquireTokenSilent({
      scopes: storageAccountScopes,
    });

    return {
      accessToken: authResult.accessToken,
      expiresOn: authResult.expiresOn,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof InteractionRequiredAuthError) {
      msalInstance.acquireTokenRedirect({
        scopes: storageAccountScopes,
      });
    }

    throw error;
  }
};

export function useAuth(): AuthContext {
  const msalInstance = inject(msalInstanceKey) as PublicClientApplication;

  const isAuthenticated = () => {
    return !!msalInstance.getActiveAccount();
  };

  const getName = () => {
    if (!isAuthenticated()) return '';

    const idToken = msalInstance.getActiveAccount()?.idTokenClaims;

    return idToken?.name ?? '';
  };

  const getEmail = () => {
    if (!isAuthenticated()) return '';

    const idToken = msalInstance.getActiveAccount()?.idTokenClaims;

    return (idToken?.preferred_username ?? '') as string;
  };

  const getInitials = () => {
    if (!isAuthenticated()) return '';

    return getName()
      .split(' ')
      .map((x) => x[0])
      .join('')
      .toUpperCase();
  };

  const login = () => msalInstance.loginRedirect({ scopes: loginScopes });

  const logout = () => {
    return msalInstance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  return {
    isAuthenticated,
    getName,
    getEmail,
    getInitials,
    login,
    logout,
  };
}
