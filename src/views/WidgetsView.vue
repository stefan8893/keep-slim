<script setup lang="ts">
import SingleWidget from '@/components/widget/SingleWidget.vue';
import type { WidgetOptions, WidgetValues } from '@/components/widget/single-widget.types';
import { MessageKey } from '@/i18n/message-keys.g';
import { parseISO } from 'date-fns';

const styles = getComputedStyle(document.documentElement);
const weigthColor = styles.getPropertyValue('--color-teal-400');
const muscleMassColor = styles.getPropertyValue('--color-violet-400');
const bodyFatColor = styles.getPropertyValue('--color-yellow-400');
const waterColor = styles.getPropertyValue('--color-sky-400');

const weightOptions: WidgetOptions = {
  color: weigthColor,
  numberFormat: 'weight',
  minValue: 58,
  maxValue: 70,
};

const weightValues: WidgetValues = {
  latestRecordDateTime: parseISO('2025-07-01T06:30'),
  latestValue: 64.1,
  changeInSelectedTimeRange: 3,
  weeklyAverageChange: 0.4,
};

const muscleMassOptions: WidgetOptions = {
  color: muscleMassColor,
  numberFormat: 'percent',
  minValue: 42,
  maxValue: 50,
};

const muscleMassValues: WidgetValues = {
  latestRecordDateTime: parseISO('2025-07-01T06:30'),
  latestValue: 45.2 / 100,
  changeInSelectedTimeRange: 1 / 100,
  weeklyAverageChange: 0.01 / 100,
};

const bodyFatOptions: WidgetOptions = {
  color: bodyFatColor,
  numberFormat: 'percent',
  minValue: 8,
  maxValue: 17,
};

const bodyFatValues: WidgetValues = {
  latestRecordDateTime: parseISO('2025-07-01T06:30'),
  latestValue: 13 / 100,
  changeInSelectedTimeRange: -0.7 / 100,
  weeklyAverageChange: 0.3 / 100,
};

const waterOptions: WidgetOptions = {
  color: waterColor,
  numberFormat: 'percent',
  minValue: 55,
  maxValue: 65,
};

const waterValues: WidgetValues = {
  latestRecordDateTime: parseISO('2025-07-01T06:30'),
  latestValue: 60.2 / 100,
  changeInSelectedTimeRange: 0.5 / 100,
  weeklyAverageChange: 0.03 / 100,
};
</script>

<template>
  <SingleWidget
    class="xs:w-1/2 xs:pr-4 w-full pb-4 md:w-1/3 lg:w-1/4 lg:pb-0"
    :title-message-key="MessageKey.weight"
    :options="weightOptions"
    :values="weightValues"
  />
  <SingleWidget
    class="xs:w-1/2 w-full pb-4 md:w-1/3 md:pr-4 lg:w-1/4 lg:pb-0"
    :title-message-key="MessageKey.muscleMass"
    :options="muscleMassOptions"
    :values="muscleMassValues"
  />
  <SingleWidget
    class="xs:w-1/2 xs:pr-4 w-full pb-4 sm:pr-4 md:w-1/3 md:pr-0 lg:w-1/4 lg:pr-4 lg:pb-0"
    :title-message-key="MessageKey.bodyFat"
    :options="bodyFatOptions"
    :values="bodyFatValues"
  />
  <SingleWidget
    class="xs:w-1/2 w-full pb-4 md:w-1/3 md:pr-4 lg:w-1/4 lg:pr-0 lg:pb-0"
    :title-message-key="MessageKey.water"
    :options="waterOptions"
    :values="waterValues"
  />
</template>
