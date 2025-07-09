import type { AcquireAccessTokenFn } from '@/auth/auth.types';
import { BodyDataRepository } from '@/bodyData/persistence/body-data.repository';
import type { AccessToken, TokenCredential } from '@azure/core-auth';
import { TableClient } from '@azure/data-tables';

export function useBodyDataRepository(acquireAccessToken: AcquireAccessTokenFn) {
  const tokenAdapter: TokenCredential = {
    getToken: async (): Promise<AccessToken | null> => {
      const accessTokenResult = await acquireAccessToken();

      return {
        token: accessTokenResult.accessToken,
        expiresOnTimestamp: accessTokenResult.expiresOn?.getTime() ?? Date.now() + 60 * 60 * 1000,
      };
    },
  };

  const tableClient = new TableClient(
    import.meta.env.VITE_KEEP_SLIM_STORAGE_ACCOUNT_URL,
    import.meta.env.VITE_KEEP_SLIM_STORAGE_ACCOUNT_TABLE_NAME,
    tokenAdapter,
  );

  return new BodyDataRepository(tableClient);
}
