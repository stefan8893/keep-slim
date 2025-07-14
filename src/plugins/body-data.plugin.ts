import { acquireAccessToken } from '@/auth/useAuth';
import type { BodyDataRepositoryCacheProxy } from '@/bodyData/persistence/body-data-repository-cache-proxy';
import { useBodyDataRepository } from '@/bodyData/persistence/useBodyDataRepository';
import { bodyDataRepositoryCacheProxyKey, bodyDataRepositoryKey } from '@/injection.types';
import type { PublicClientApplication } from '@azure/msal-browser';
import type { App } from 'vue';

export const bodyData = {
  install: (app: App<Element>, msalInstance: PublicClientApplication) => {
    const acquireToken = () => acquireAccessToken(msalInstance);
    const bodyDataRepository: BodyDataRepositoryCacheProxy = useBodyDataRepository(acquireToken);

    app.provide(bodyDataRepositoryKey, bodyDataRepository);
    app.provide(bodyDataRepositoryCacheProxyKey, bodyDataRepository);
  },
};
