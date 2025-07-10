<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';

const props = defineProps<{
  averageWeeklyChange: number;
}>();
</script>

<template>
  <el-text>{{ $t(MessageKey.weekly) }}</el-text>
  <el-text class="avg-sign">&#x2300;</el-text>
  <el-text size="large">
    <i18n-n tag="span" :value="props.averageWeeklyChange" format="weight" scope="global">
      <template #unit="slotProps">
        <span class="text-sm">{{ slotProps.unit }}</span>
      </template>
    </i18n-n>
  </el-text>
</template>
