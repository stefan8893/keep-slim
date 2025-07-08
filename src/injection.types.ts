import type { ThemingControl } from '@/plugins/theming.plugin';
import type { PublicClientApplication } from '@azure/msal-browser';
import type { InjectionKey } from 'vue';

export const themingControlKey = Symbol() as InjectionKey<ThemingControl>;

export const msalInstanceKey = Symbol() as InjectionKey<PublicClientApplication>;
