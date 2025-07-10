<script setup lang="ts">
import { useElementPlusLocales } from '@/i18n/useLocales';
import { dayjs } from 'element-plus';
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

    console.debug('Syncing locale in store with i18n plugin. New locale:', localeStore.locale);
    locale.value = localeStore.locale;

    try {
      const dayjsConfig = dayjs as unknown as Record<'en', { weekStart: number }>;

      if (localeStore.locale === 'en-US') dayjsConfig.en.weekStart = 0;
      if (localeStore.locale === 'de-AT') dayjsConfig.en.weekStart = 1;
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true },
);
</script>

<template>
  <el-config-provider :locale="elPlusLocale">
    <RouterView />
  </el-config-provider>
</template>
