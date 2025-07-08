import * as msal from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

export const loginScopes = ['openid', 'email', 'offline_access'];
export const storageAccountScopes = ['offline_access', import.meta.env.VITE_STORAGE_ACCOUNT_SCOPE];

export const authConfiguration: msal.Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
    authority: import.meta.env.VITE_AUTH_AUTHORITY,
    navigateToLoginRequestUrl: false,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: import.meta.env.VITE_AUTH_CACHE_LOCATION,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};
