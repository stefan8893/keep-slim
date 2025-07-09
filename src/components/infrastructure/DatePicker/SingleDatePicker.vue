<script setup lang="ts">
import { useElementPlusLocales } from '@/i18n/useLocales';
import { useLocaleStore } from '@/stores/localeStore';
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});
const localeStore = useLocaleStore();
const { getDateFormatString } = useElementPlusLocales();

const model = defineModel<Date | undefined>();

const dateFormat = computed(() => getDateFormatString(localeStore.locale));
</script>

<template>
  <el-date-picker v-model="model" type="date" v-bind="$attrs" :format="dateFormat" />
</template>

<style scoped>
.date-picker-width {
  width: 160px !important;
}
</style>
