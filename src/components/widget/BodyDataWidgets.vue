<script setup lang="ts">
import { getBoundaryRecords } from '@/bodyData/aggregations/boundaries';
import { type WidgetValues, calculateWidgetValues } from '@/bodyData/aggregations/widget-values';
import type { BodyData } from '@/bodyData/body-data.types';
import { useColors } from '@/colors/useColors';
import SingleWidget from '@/components/widget/SingleWidget.vue';
import type { WidgetOptions } from '@/components/widget/single-widget.types';
import { MessageKey } from '@/i18n/message-keys.g';
import { type ComputedRef, computed } from 'vue';

const { weigthColor, muscleMassColor, bodyFatColor, waterColor } = useColors();

type WidgetProps = {
  titleMessageKey: MessageKey;
  values: ComputedRef<WidgetValues>;
  options: WidgetOptions;
};

const props = defineProps<{
  bodyData: BodyData[];
}>();

const boundaryRecords = computed(() => {
  const bodyData = props.bodyData;

  return getBoundaryRecords(bodyData);
});

const toPercentage = (widgetValues: WidgetValues): WidgetValues => {
  if (widgetValues.state === 'empty') return widgetValues;

  if (widgetValues.state === 'singleDay') {
    return {
      ...widgetValues,
      value: widgetValues.value / 100,
    };
  } else if (widgetValues.state === 'range') {
    return {
      ...widgetValues,
      latestValue: widgetValues.latestValue / 100,
      change: widgetValues.change / 100,
      averageWeeklyChange: widgetValues.averageWeeklyChange / 100,
      averageMonthlyChange: widgetValues.averageMonthlyChange / 100,
    };
  } else return widgetValues;
};

const widgetProps: WidgetProps[] = [
  {
    titleMessageKey: MessageKey.weight,
    values: computed(() => calculateWidgetValues('weight', boundaryRecords.value)),
    options: {
      color: weigthColor,
      numberFormat: 'weight',
      minValue: 58,
      maxValue: 70,
    },
  },
  {
    titleMessageKey: MessageKey.muscleMass,
    values: computed(() =>
      toPercentage(calculateWidgetValues('muscleMass', boundaryRecords.value)),
    ),
    options: {
      color: muscleMassColor,
      numberFormat: 'percent',
      minValue: 42,
      maxValue: 50,
    },
  },
  {
    titleMessageKey: MessageKey.bodyFat,
    values: computed(() => toPercentage(calculateWidgetValues('bodyFat', boundaryRecords.value))),
    options: {
      color: bodyFatColor,
      numberFormat: 'percent',
      minValue: 8,
      maxValue: 17,
    },
  },
  {
    titleMessageKey: MessageKey.water,
    values: computed(() => toPercentage(calculateWidgetValues('water', boundaryRecords.value))),
    options: {
      color: waterColor,
      numberFormat: 'percent',
      minValue: 55,
      maxValue: 65,
    },
  },
];
</script>

<template>
  <div class="xs:justify-between flex flex-row flex-wrap items-center justify-center gap-y-4">
    <SingleWidget
      v-for="widget in widgetProps"
      :key="widget.titleMessageKey"
      class="xs:w-[calc(50%-0.5rem)] w-[calc(100%-2.75rem)] md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]"
      :title-message-key="widget.titleMessageKey"
      :options="widget.options"
      :values="widget.values.value"
    />
  </div>
</template>
