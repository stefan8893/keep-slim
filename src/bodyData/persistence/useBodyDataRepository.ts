import type { AcquireAccessTokenFn } from '@/auth/auth.types';
import { AzureFunctionsBodyDataRepository } from '@/bodyData/persistence/body-data-repository-az-func';
import { BodyDataRepositoryCacheProxy } from '@/bodyData/persistence/body-data-repository-cache-proxy';
import type { BodyDataRepository } from '@/bodyData/persistence/body-data-repository.types';

export function useBodyDataRepository(
  acquireAccessToken: AcquireAccessTokenFn,
): BodyDataRepository {
  const functionsAppBaseUrl: string = import.meta.env.VITE_KEEP_SLIM_FUNCTION_APP_BASE_URL;

  const azureFunctionAppBodyDataRepository = new AzureFunctionsBodyDataRepository(
    functionsAppBaseUrl,
    acquireAccessToken,
  );

  return new BodyDataRepositoryCacheProxy(azureFunctionAppBodyDataRepository);
}
