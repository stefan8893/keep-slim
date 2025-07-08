<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';
import { useElementPlusLocales } from '@/i18n/useLocales';
import { useLocaleStore } from '@/stores/localeStore';
import { computed, ref, watch } from 'vue';

const localeStore = useLocaleStore();
const { getDateFormatString } = useElementPlusLocales();
const dateFormat = computed(() => getDateFormatString(localeStore.locale));
const dateRange = ref<Date[]>([]);

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

watch(dateRange, () => console.log(dateRange.value));
</script>

<template>
  <div class="filter">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      size="default"
      :start-placeholder="$t(MessageKey.startDate)"
      :range-separator="$t(MessageKey.dateTo)"
      :end-placeholder="$t(MessageKey.endDate)"
      :shortcuts="shortcuts"
      :format="dateFormat"
    />
  </div>
</template>
