<script setup lang="ts">
import { useElementPlusLocales } from '@/i18n/useLocales';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';

import { useLocaleStore } from './stores/localeStore';

const { locale } = useI18n();

const localeStore = useLocaleStore();

const elPlusLocales = useElementPlusLocales();
const elPlusLocale = ref(elPlusLocales.get(localeStore.language));
watch(
  localeStore,
  () => {
    console.debug(
      'Syncing language in store with element plus config provider. New Language:',
      elPlusLocale.value.name,
    );
    elPlusLocale.value = elPlusLocales.get(localeStore.language);

    console.debug('Syncing locale in store with i18n plugin. New Language:', localeStore.locale);
    locale.value = localeStore.locale;
  },
  { immediate: true },
);
</script>

<template>
  <el-config-provider :locale="elPlusLocale">
    <RouterView />
  </el-config-provider>
</template>
