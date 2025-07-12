<script setup lang="ts">
import type { WidgetValues } from '@/bodyData/aggregations/widget-values';
import SingleWidgetAverageChange from '@/components/widget/SingleWidgetAverageChange.vue';
import InfoIcon from '@/components/widget/SingleWidgetInfoIcon.vue';
import SingleWidgetProgressIndicator from '@/components/widget/SingleWidgetProgressIndicator.vue';
import SingleWidgetTotalChange from '@/components/widget/SingleWidgetTotalChange.vue';
import type { WidgetOptions } from '@/components/widget/single-widget.types';
import { MessageKey } from '@/i18n/message-keys.g';
import { computed } from 'vue';

const props = defineProps<{
  values: WidgetValues;
  titleMessageKey: string;
  options: WidgetOptions;
}>();

const latestValue = computed(() =>
  props.values.state === 'range'
    ? props.values.latestValue
    : props.values.state === 'singleDay'
      ? props.values.value
      : 0,
);
const change = computed(() =>
  props.values.state === 'singleDay'
    ? props.values.value
    : props.values.state === 'range'
      ? props.values.change
      : 0,
);
const averageWeeklyChange = computed(() =>
  props.values.state === 'range' ? props.values.averageWeeklyChange : 0,
);
const averageMonthlyChange = computed(() =>
  props.values.state === 'range' ? props.values.averageMonthlyChange : 0,
);

const showSatistics = computed(() => props.values.state === 'range');
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex flex-row flex-nowrap items-center justify-between">
        <el-text size="large">{{ $t(props.titleMessageKey) }}</el-text>
        <InfoIcon :values="props.values" />
      </div>
    </template>
    <template #default>
      <div class="flex flex-col flex-nowrap items-center justify-start">
        <SingleWidgetProgressIndicator :value="latestValue" :options="props.options" />
      </div>
      <div v-if="showSatistics" class="mt-4 flex flex-col flex-nowrap items-center justify-start">
        <SingleWidgetTotalChange :change="change" :options="props.options" />
        <SingleWidgetAverageChange
          :average-change="averageWeeklyChange"
          :options="props.options"
          :message-key="MessageKey.week"
        />
        <SingleWidgetAverageChange
          :average-change="averageMonthlyChange"
          :options="props.options"
          :message-key="MessageKey.month"
        />
      </div>
    </template>
  </el-card>
</template>
