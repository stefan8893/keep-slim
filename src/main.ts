import AppVue from '@/App.vue';
import { authConfiguration } from '@/auth/auth.config';
import { ensureFreshTokens } from '@/auth/useAuth';
import i18n from '@/i18n/i18n-config';
import { msalInstanceKey } from '@/injection.types';
import { bodyData } from '@/plugins/body-data.plugin';
import { theming } from '@/plugins/theming.plugin';
import router from '@/router';
import '@/styles/main.css';
import { type AccountInfo, PublicClientApplication } from '@azure/msal-browser';
import 'element-plus/theme-chalk/src/loading.scss';
import 'element-plus/theme-chalk/src/message-box.scss';
import 'element-plus/theme-chalk/src/notification.scss';
import { createPinia } from 'pinia';
import { type App, createApp } from 'vue';

(async () => {
  const app = createApp(AppVue);

  const msalInstance = await initializeAuth(app);

  app.use(router);
  app.use(createPinia());
  app.use(i18n);
  app.use(theming);
  app.use(bodyData, msalInstance);

  app.mount('#app');
})().catch((error) => console.error(error));

async function initializeAuth(app: App<Element>): Promise<PublicClientApplication> {
  const msalInstance = new PublicClientApplication(authConfiguration);
  app.provide(msalInstanceKey, msalInstance);

  await msalInstance.initialize();
  await msalInstance.handleRedirectPromise();

  const accounts = msalInstance.getAllAccounts();
  const isAuthenticated = accounts.length > 0;

  if (!isAuthenticated) {
    return msalInstance;
  }

  await onAuthenticated(accounts, msalInstance);
  return msalInstance;
}

async function onAuthenticated(accounts: AccountInfo[], msalInstance: PublicClientApplication) {
  const account = accounts[0];
  msalInstance.setActiveAccount(account);

  const environment = import.meta.env.MODE;
  if (environment === 'production') await ensureFreshTokens(msalInstance);
}
