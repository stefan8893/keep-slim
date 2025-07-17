<script setup lang="ts">
import SingleWidgetSkeleton from '@/components/widget/SingleWidgetSkeleton.vue';
import { MessageKey } from '@/i18n/message-keys.g';
</script>

<template>
  <div class="flex flex-row flex-wrap items-center justify-between gap-y-4">
    <SingleWidgetSkeleton
      :title-message-key="MessageKey.weight"
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
    />
    <SingleWidgetSkeleton
      :title-message-key="MessageKey.muscleMass"
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
    />
    <SingleWidgetSkeleton
      :title-message-key="MessageKey.bodyFat"
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
    />
    <SingleWidgetSkeleton
      :title-message-key="MessageKey.water"
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
    />
  </div>
</template>
