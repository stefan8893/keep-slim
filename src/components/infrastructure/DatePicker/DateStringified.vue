<script setup lang="ts">
import { formatDate } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { useElementPlusLocales } from '@/i18n/useLocales';
import { useLocaleStore } from '@/stores/localeStore';
import { isToday } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { getDateFormatString } = useElementPlusLocales();
const localeStore = useLocaleStore();
const { t } = useI18n();

const props = defineProps<{
  date?: Date;
  placeholder?: string;
  formatString?: string;
}>();

const isDateToday = computed(() => !!props.date && isToday(props.date));

const displayValue = computed(() => {
  if (!props.date) return props.placeholder ?? getDateFormatString(localeStore.locale);

  return isDateToday.value
    ? t(MessageKey.today)
    : formatDate(props.date, props.formatString ?? 'P');
});
</script>

<template>
  <el-text type="info" :class="{ 'font-semibold': !isDateToday }">{{ displayValue }}</el-text>
</template>
