<script setup lang="ts">
import type { WidgetValues } from '@/bodyData/aggregations/widget-values';
import { formatDate, formatTime } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { InfoFilled } from '@element-plus/icons-vue';
import { computed } from 'vue';

const props = defineProps<{
  values: WidgetValues;
}>();

const latestRecordDateTime = computed(() =>
  props.values.state === 'range'
    ? props.values.latestRecordDateTime
    : props.values.state === 'singleDay'
      ? props.values.recordedAt
      : new Date(0),
);

const oldestRecordDateTime = computed(() =>
  props.values.state === 'range' ? props.values.oldestRecordDateTime : new Date(0),
);

const isSingleDay = computed(() => props.values.state === 'singleDay');
const isEmpty = computed(() => props.values.state === 'empty');
</script>

<template>
  <el-tooltip v-if="!isEmpty" placement="top">
    <el-icon class="info-icon cursor-pointer" size="20"><InfoFilled /></el-icon>
    <template #content>
      <div class="flex max-w-52 flex-col flex-nowrap items-center justify-start">
        <span>{{
          $t(isSingleDay ? MessageKey.recordedAt : MessageKey.lastRecordedAt, {
            date: formatDate(latestRecordDateTime, 'PP'),
            time: formatTime(latestRecordDateTime),
          })
        }}</span>
        <span v-show="!isSingleDay" class="mt-4">
          {{
            $t(MessageKey.calculationInfo, {
              date: formatDate(oldestRecordDateTime, 'PP'),
            })
          }}
        </span>
      </div>
    </template>
  </el-tooltip>
</template>

<style scoped>
html:not(.dark) .info-icon {
  color: var(--el-color-info);
}
</style>
