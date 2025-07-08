import { themingControlKey } from '@/injection.types';
import { type BasicColorSchema, useColorMode } from '@vueuse/core';
import { type App, type ComputedRef, type Ref, computed } from 'vue';

export type ThemingControl = {
  isDark: ComputedRef<boolean>;
  colorScheme: Ref<BasicColorSchema>;
};

export const theming = {
  install: (app: App<Element>) => {
    const { store, system } = useColorMode({
      storageKey: 'theme',
      storage: localStorage,
    });

    const isDark = computed(() =>
      store.value === 'auto' ? system.value === 'dark' : store.value === 'dark',
    );

    app.provide(themingControlKey, {
      isDark,
      colorScheme: store,
    } satisfies ThemingControl);
  },
};
