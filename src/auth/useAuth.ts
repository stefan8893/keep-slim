import { azFunctionAppScope, loginScopes } from '@/auth/auth.config';
import type { AuthContext } from '@/auth/auth.types';
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
    console.error('Error while ensuring fresh token', error);
    msalInstance.loginRedirect({ scopes: loginScopes });
  }
};

export const acquireAzureFunctionAppAccessToken = async (
  msalInstance: PublicClientApplication,
): Promise<string> => {
  try {
    const authResult = await msalInstance.acquireTokenSilent({
      scopes: azFunctionAppScope,
    });

    return authResult.accessToken;
  } catch (error) {
    console.error(error);

    if (error instanceof InteractionRequiredAuthError) {
      msalInstance.acquireTokenRedirect({
        scopes: azFunctionAppScope,
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
