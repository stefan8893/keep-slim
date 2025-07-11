<script setup lang="ts">
import { getBoundaryRecords } from '@/bodyData/aggregations/boundaries';
import { type WidgetValues, calculateWidgetValues } from '@/bodyData/aggregations/widget-values';
import type { BodyData } from '@/bodyData/body-data.types';
import { useColors } from '@/colors/useColors';
import SingleWidget from '@/components/widget/SingleWidget.vue';
import type { WidgetOptions } from '@/components/widget/single-widget.types';
import { MessageKey } from '@/i18n/message-keys.g';
import { computed } from 'vue';

const { weigthColor, muscleMassColor, bodyFatColor, waterColor } = useColors();

const props = defineProps<{
  bodyData: BodyData[];
}>();

const boundaryRecords = computed(() => {
  const bodyData = props.bodyData;

  return getBoundaryRecords(bodyData);
});

const weightOptions: WidgetOptions = {
  color: weigthColor,
  numberFormat: 'weight',
  minValue: 58,
  maxValue: 70,
};

const weightValues = computed(() => calculateWidgetValues('weight', boundaryRecords.value));

const muscleMassOptions: WidgetOptions = {
  color: muscleMassColor,
  numberFormat: 'percent',
  minValue: 42,
  maxValue: 50,
};

const toPercentage = (widgetValues: WidgetValues): WidgetValues => {
  return {
    oldestRecordDateTime: widgetValues.oldestRecordDateTime,
    latestRecordDateTime: widgetValues.latestRecordDateTime,
    latestValue: widgetValues.latestValue / 100,
    change: !widgetValues.change ? widgetValues.change : widgetValues.change / 100,
    averageWeeklyChange: !widgetValues.averageWeeklyChange
      ? widgetValues.averageWeeklyChange
      : widgetValues.averageWeeklyChange / 100,
    averageMonthlyChange: !widgetValues.averageMonthlyChange
      ? widgetValues.averageMonthlyChange
      : widgetValues.averageMonthlyChange / 100,
  };
};

const muscleMassValues = computed(() =>
  toPercentage(calculateWidgetValues('muscleMass', boundaryRecords.value)),
);

const bodyFatOptions: WidgetOptions = {
  color: bodyFatColor,
  numberFormat: 'percent',
  minValue: 8,
  maxValue: 17,
};

const bodyFatValues = computed(() =>
  toPercentage(calculateWidgetValues('bodyFat', boundaryRecords.value)),
);

const waterOptions: WidgetOptions = {
  color: waterColor,
  numberFormat: 'percent',
  minValue: 55,
  maxValue: 65,
};

const waterValues = computed(() =>
  toPercentage(calculateWidgetValues('water', boundaryRecords.value)),
);
</script>

<template>
  <div class="flex flex-row flex-wrap items-center justify-between gap-y-4">
    <SingleWidget
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
      :title-message-key="MessageKey.weight"
      :options="weightOptions"
      :values="weightValues"
    />
    <SingleWidget
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
      :title-message-key="MessageKey.muscleMass"
      :options="muscleMassOptions"
      :values="muscleMassValues"
    />
    <SingleWidget
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
      :title-message-key="MessageKey.bodyFat"
      :options="bodyFatOptions"
      :values="bodyFatValues"
    />
    <SingleWidget
      class="xs:w-[calc(50%-0.5rem)] w-full md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
      :title-message-key="MessageKey.water"
      :options="waterOptions"
      :values="waterValues"
    />
  </div>
</template>

<style scoped></style>
