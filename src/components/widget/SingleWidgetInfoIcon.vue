<script setup lang="ts">
import { formatDate, formatDateTime, formatTime } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { InfoFilled } from '@element-plus/icons-vue';
import { computed } from 'vue';

const props = defineProps<{
  latestRecordDateTime?: Date;
}>();

const latestRecordDateTime = computed(() => props.latestRecordDateTime ?? new Date());
</script>

<template>
  <el-tooltip placement="top">
    <el-icon class="info-icon cursor-pointer" size="20"><InfoFilled /></el-icon>
    <template #content>
      <div class="flex flex-row flex-nowrap items-center justify-start">
        <span>{{
          $t(MessageKey.recordedAt, {
            date: formatDate(latestRecordDateTime, 'PP'),
            time: formatTime(latestRecordDateTime),
          })
        }}</span>
      </div>
    </template>
  </el-tooltip>
</template>

<style scoped>
html:not(.dark) .info-icon {
  color: var(--el-color-info);
}
</style>
