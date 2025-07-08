<script setup lang="ts">
import { useElementPlusLocales } from '@/i18n/useLocales';
import { useLanguageStore } from '@/stores/languageStore';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';

const languageStore = useLanguageStore();

const { locale } = useI18n();

const elPlusLocales = useElementPlusLocales();
const elPlusLocale = ref(elPlusLocales.get(languageStore.language));
watch(
  languageStore,
  () => {
    console.debug(
      'Syncing language in store with element plus config provider. New Language:',
      elPlusLocale.value.name,
    );
    elPlusLocale.value = elPlusLocales.get(languageStore.language);

    console.debug(
      'Syncing language in store with i18n plugin. New Language:',
      languageStore.language,
    );
    locale.value = languageStore.language;
  },
  { immediate: true },
);
</script>

<template>
  <el-config-provider :locale="elPlusLocale">
    <RouterView />
  </el-config-provider>
</template>
