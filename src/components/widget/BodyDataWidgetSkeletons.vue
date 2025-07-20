<script setup lang="ts">
import SingleWidgetSkeleton from '@/components/widget/SingleWidgetSkeleton.vue';
import { MessageKey } from '@/i18n/message-keys.g';

const widgets: MessageKey[] = [
  MessageKey.weight,
  MessageKey.muscleMass,
  MessageKey.bodyFat,
  MessageKey.water,
];
</script>

<template>
  <div class="xs:justify-between flex flex-row flex-wrap items-center justify-center gap-y-4">
    <SingleWidgetSkeleton
      v-for="title in widgets"
      :key="title"
      :title-message-key="title"
      class="xs:w-[calc(50%-0.5rem)] w-[calc(100%-2.75rem)] md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
    />
  </div>
</template>
