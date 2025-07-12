<script setup lang="ts">
import type { WidgetValues } from '@/bodyData/aggregations/widget-values';
import { formatDate, formatTime } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { InfoFilled } from '@element-plus/icons-vue';
import { compareAsc } from 'date-fns';
import { computed } from 'vue';

const props = defineProps<{
  widgetValues: WidgetValues;
}>();

const minDate = new Date(0);

const latestRecordDateTime = computed(() => props.widgetValues.latestRecordDateTime);

const isSameDay = computed(() => props.widgetValues.isSameDay);
const show = computed(() => compareAsc(props.widgetValues.latestRecordDateTime, minDate) !== 0);
</script>

<template>
  <el-tooltip v-if="show" placement="top">
    <el-icon class="info-icon cursor-pointer" size="20"><InfoFilled /></el-icon>
    <template #content>
      <div class="flex max-w-52 flex-col flex-nowrap items-center justify-start">
        <span>{{
          $t(isSameDay ? MessageKey.recordedAt : MessageKey.lastRecordedAt, {
            date: formatDate(latestRecordDateTime, 'PP'),
            time: formatTime(latestRecordDateTime),
          })
        }}</span>
        <span v-show="!isSameDay" class="mt-4">
          {{
            $t(MessageKey.calculationInfo, {
              date: formatDate(props.widgetValues.oldestRecordDateTime, 'PP'),
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
