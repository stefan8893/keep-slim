import { acquireAzureFunctionAppAccessToken } from '@/auth/useAuth';
import { useBodyDataRepository } from '@/bodyData/persistence/useBodyDataRepository';
import { bodyDataRepositoryKey } from '@/injection.types';
import type { PublicClientApplication } from '@azure/msal-browser';
import type { App } from 'vue';

export const bodyData = {
  install: (app: App<Element>, msalInstance: PublicClientApplication) => {
    const acquireToken = () => acquireAzureFunctionAppAccessToken(msalInstance);
    const bodyDataRepository = useBodyDataRepository(acquireToken);

    app.provide(bodyDataRepositoryKey, bodyDataRepository);
  },
};
