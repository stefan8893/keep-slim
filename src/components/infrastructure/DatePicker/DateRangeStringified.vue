<script setup lang="ts">
import type { DateRange } from '@/components/infrastructure/DatePicker/DateRange';
import DateStringified from '@/components/infrastructure/DatePicker/DateStringified.vue';
import { MessageKey } from '@/i18n/message-keys.g';
import { isSameDay, isToday } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  start?: Date;
  end?: Date;
}>();

const prefix = computed(() => {
  if (!props.start || !props.end) return '';

  if (isSameDay(props.start, props.end)) return '';

  const fromToday = !!props.start && isToday(props.start) ? 1 : 2;
  return t(MessageKey.dateFromCapitalized, fromToday);
});

const startDate = computed(() => {
  return props.start;
});

const separator = computed(() => {
  if (!props.start || !props.end) return '';

  if (isSameDay(props.start, props.end)) return '';

  return t(MessageKey.dateTo);
});

const endDate = computed(() => {
  if (!!props.start && !!props.end && isSameDay(props.start, props.end)) return undefined;

  return props.end;
});

const bothDatesMissing = computed(() => !startDate.value && !endDate.value);
</script>

<template>
  <div v-if="!bothDatesMissing" class="flex flex-row flex-nowrap gap-x-1.5">
    <el-text type="info">{{ prefix }}</el-text>
    <DateStringified :date="startDate" placeholder="" format-string="PP" />
    <el-text type="info">{{ separator }}</el-text>
    <DateStringified :date="endDate" placeholder="" format-string="PP" />
  </div>
</template>
