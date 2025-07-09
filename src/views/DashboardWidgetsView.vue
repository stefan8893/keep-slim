<script setup lang="ts">
import DashboardWidget, { type WidgetOptions } from '@/components/DashboardWidget.vue';
import { MessageKey } from '@/i18n/message-keys.g';

const props = defineProps<{
  weight?: number;
  muscleMass?: number;
  bodyFat?: number;
  water?: number;
}>();

const weightOptions: WidgetOptions = {
  color: 'brown',
  unit: 'KG',
  minValue: 58,
  maxValue: 70,
};

const muscleMassOptions: WidgetOptions = {
  color: 'purple',
  unit: '%',
  minValue: 42,
  maxValue: 50,
};

const bodyFatOptions: WidgetOptions = {
  color: 'orange',
  unit: '%',
  minValue: 8,
  maxValue: 17,
};

const waterOptions: WidgetOptions = {
  color: 'blue',
  unit: '%',
  minValue: 55,
  maxValue: 65,
};
</script>

<template>
  <DashboardWidget
    class="xs:w-1/2 xs:pr-4 w-full pb-4 md:w-1/3 lg:w-1/4"
    :title-message-key="MessageKey.weight"
    :options="weightOptions"
    :value="props.weight"
  />
  <DashboardWidget
    class="xs:w-1/2 w-full pb-4 md:w-1/3 md:pr-4 lg:w-1/4"
    :title-message-key="MessageKey.muscleMass"
    :options="muscleMassOptions"
    :value="props.muscleMass"
  />
  <DashboardWidget
    class="xs:w-1/2 xs:pr-4 w-full pb-4 sm:pr-4 md:w-1/3 md:pr-0 lg:w-1/4 lg:pr-4"
    :title-message-key="MessageKey.bodyFat"
    :options="bodyFatOptions"
    :value="props.bodyFat"
  />
  <DashboardWidget
    class="xs:w-1/2 w-full pb-4 md:w-1/3 md:pr-4 lg:w-1/4 lg:pr-0"
    :title-message-key="MessageKey.water"
    :options="waterOptions"
    :value="props.water"
  />
</template>
