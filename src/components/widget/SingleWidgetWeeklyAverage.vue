<script setup lang="ts">
import type { WidgetOptions } from '@/components/widget/single-widget.types';
import { MessageKey } from '@/i18n/message-keys.g';

const props = defineProps<{
  averageWeeklyChange: number;
  options: WidgetOptions;
}>();
</script>

<template>
  <div class="mt-2 flex flex-row flex-nowrap items-center justify-start gap-x-1">
    <el-text>{{ $t(MessageKey.weekly) }}</el-text>
    <el-text class="avg-sign">&#x2300;</el-text>
    <el-text size="large">
      <i18n-n
        tag="span"
        :value="props.averageWeeklyChange"
        :format="options.numberFormat"
        scope="global"
      >
        <template #unit="slotProps">
          <span class="text-sm">{{ slotProps.unit }}</span>
        </template>
      </i18n-n>
    </el-text>
  </div>
</template>

<style scoped>
.avg-sign {
  font-size: 20px;
  margin-right: 4px;
}
</style>
