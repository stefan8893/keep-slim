<script setup lang="ts">
import { calculateChangeOverTime } from '@/bodyData/aggregations/change-over-time';
import type { BodyData } from '@/bodyData/body-data.types';
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import { useLocaleStore } from '@/stores/localeStore';
import { differenceInCalendarMonths } from 'date-fns';
import Highcharts from 'highcharts';
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const { isDark } = inject(themingControlKey) as ThemingControl;

const useMonthlyChangesForMoreThanNMonths = 6;

const props = defineProps<{
  bodyData: BodyData[];
}>();

const useMonthlyChanges = computed(
  () =>
    props.bodyData.length > 1 &&
    Math.abs(
      differenceInCalendarMonths(props.bodyData[0].recordedAt, props.bodyData.at(-1)!.recordedAt),
    ) > useMonthlyChangesForMoreThanNMonths,
);

const changeOverWeeks = computed(() =>
  useMonthlyChanges.value
    ? calculateChangeOverTime('monthlyExact', 'weight', props.bodyData)
    : calculateChangeOverTime('weeklyExact', 'weight', props.bodyData),
);

watch(changeOverWeeks, () => {
  console.log(changeOverWeeks.value);
});

const chart = ref<Highcharts.Chart | null>(null);
const localeStore = useLocaleStore();

const renderChart = () => {
  chart.value?.destroy();
  chart.value = Highcharts.chart('chart', {
    lang: {
      locale: localeStore.locale,
    },
    chart: {
      type: 'bar',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'März', 'Apr'],
    },
    series: [
      {
        name: 'Beispielreihe',
        data: [1, 3.3, 2, 4],
        type: 'bar',
      },
    ],
  });
};

watch(localeStore, () => {
  renderChart();
});

onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  chart.value?.destroy();
});
</script>

<template>
  <el-card>
    <div class="grid-container">
      <div class="block" id="chart" :class="isDark ? 'highcharts-dark' : 'highcharts-light'"></div>
    </div>
  </el-card>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
}
</style>
