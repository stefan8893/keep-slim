import type { AcquireAccessTokenFn } from '@/auth/auth.types';
import { acquireAzureFunctionAppAccessToken } from '@/auth/useAuth';
import type {
  BodyDataCsvImportService,
  ClearBodyDataRepositoryCacheFn,
} from '@/bodyData/body-data-persistence.types';
import { DevBodyDataCsvImportService } from '@/bodyData/persistence/body-data-csv-import-dev.service';
import { AzureFunctionsBodyDataCsvImportService } from '@/bodyData/persistence/body-data-csv-import.service';
import { DevBodyDataRepository } from '@/bodyData/persistence/body-data-dev.repository';
import { AzureFunctionsBodyDataRepository } from '@/bodyData/persistence/body-data-repository-az-func';
import { BodyDataRepositoryCacheProxy } from '@/bodyData/persistence/body-data-repository-cache-proxy';
import { bodyDataCsvImportServiceKey, bodyDataRepositoryKey } from '@/injection.types';
import type { Fetch } from '@/types/utils.types';
import type { PublicClientApplication } from '@azure/msal-browser';
import type { App } from 'vue';

function createFetchWithToken(acquireAccessToken: AcquireAccessTokenFn): Fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const accessToken = await acquireAccessToken();

    return window.fetch(input, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
}

function useBodyDataRepository(
  acquireAccessToken: AcquireAccessTokenFn,
): AzureFunctionsBodyDataRepository {
  const functionsAppBaseUrl: string = import.meta.env.VITE_KEEP_SLIM_FUNCTION_APP_BASE_URL;
  const fetch = createFetchWithToken(acquireAccessToken);

  return new AzureFunctionsBodyDataRepository(functionsAppBaseUrl, fetch);
}

function useCsvImportService(
  acquireAccessToken: AcquireAccessTokenFn,
  clearCache: ClearBodyDataRepositoryCacheFn,
): BodyDataCsvImportService {
  const functionsAppBaseUrl: string = import.meta.env.VITE_KEEP_SLIM_FUNCTION_APP_BASE_URL;
  const fetch = createFetchWithToken(acquireAccessToken);

  return new AzureFunctionsBodyDataCsvImportService(functionsAppBaseUrl, fetch, clearCache);
}

export const bodyData = {
  install: (app: App<Element>, msalInstance: PublicClientApplication) => {
    const isDev = import.meta.env.DEV;

    if (isDev) {
      console.log('Use Development Body Data Plugin');

      const devBodyDataRepository = new DevBodyDataRepository();
      const devBodyDataCsvImportService = new DevBodyDataCsvImportService(devBodyDataRepository);

      app.provide(bodyDataRepositoryKey, devBodyDataRepository);
      app.provide(bodyDataCsvImportServiceKey, devBodyDataCsvImportService);

      return;
    }

    const acquireToken = () => acquireAzureFunctionAppAccessToken(msalInstance);

    const bodyDataRepository = useBodyDataRepository(acquireToken);
    const bodyDataCachedRepository = new BodyDataRepositoryCacheProxy(bodyDataRepository);
    app.provide(bodyDataRepositoryKey, bodyDataCachedRepository);

    const csvImportService = useCsvImportService(acquireToken, bodyDataCachedRepository.clearCache);
    app.provide(bodyDataCsvImportServiceKey, csvImportService);
  },
};
