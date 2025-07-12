<script setup lang="ts">
import { calculateChangeOverTime } from '@/bodyData/aggregations/change-over-time';
import type { BodyData } from '@/bodyData/body-data.types';
import { formatDate } from '@/i18n/date-utils';
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import { useLocaleStore } from '@/stores/localeStore';
import { differenceInCalendarMonths, getISOWeek } from 'date-fns';
import Highcharts from 'highcharts';
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { isDark } = inject(themingControlKey) as ThemingControl;
const { n } = useI18n();

const useMonthlyChangesForMoreThanNMonths = 6;

const chart = ref<Highcharts.Chart | null>(null);
const localeStore = useLocaleStore();

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

const changesOverWeeks = computed(() =>
  useMonthlyChanges.value
    ? calculateChangeOverTime('monthlyExact', 'weight', props.bodyData)
    : calculateChangeOverTime('weeklyExact', 'weight', props.bodyData),
);

const categories = computed(() => {
  return changesOverWeeks.value.map((d) => {
    return d.interval === 'weeklyExact'
      ? `KW ${getISOWeek(d.start)}`
      : formatDate(d.start, 'MMM yyyy');
  });
});

const renderChart = () => {
  chart.value?.destroy();
  chart.value = Highcharts.chart('chart', {
    lang: {
      locale: localeStore.locale,
    },
    chart: {
      type: 'column',
    },
    title: {
      text: '',
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return typeof this.y === 'number' ? n(this.y, 'weight') : this.y;
          },
        },
      },
    },
    xAxis: {
      categories: categories.value,
      title: {
        text: 'FooBar',
      },
    },
    yAxis: {},
    series: [
      {
        name: 'Gewicht',
        data: changesOverWeeks.value.map((x) => x.value),
        type: 'column',
      },
    ],
  });
};

watch(localeStore, () => {
  renderChart();
});

watch(changesOverWeeks, () => {
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
      <div id="chart" :class="isDark ? 'highcharts-dark' : 'highcharts-light'"></div>
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
