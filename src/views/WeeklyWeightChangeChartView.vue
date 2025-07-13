<script setup lang="ts">
import { calculateChangeOverTime } from '@/bodyData/aggregations/change-over-time';
import type { BodyData } from '@/bodyData/body-data.types';
import { useColors } from '@/colors/useColors';
import { formatDate } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import { useLocaleStore } from '@/stores/localeStore';
import { differenceInCalendarMonths, endOfISOWeek, getISOWeek } from 'date-fns';
import Highcharts from 'highcharts';
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const useMonthlyChangesForMoreThanNMonths = 5;

const { isDark } = inject(themingControlKey) as ThemingControl;
const { n, t } = useI18n();
const chart = ref<Highcharts.Chart | null>(null);
const localeStore = useLocaleStore();
const { weigthColor } = useColors();

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

const changesOverTime = computed(() =>
  useMonthlyChanges.value
    ? calculateChangeOverTime('monthlyExact', 'weight', props.bodyData)
    : calculateChangeOverTime('weeklyExact', 'weight', props.bodyData),
);

const categories = computed(() => {
  return changesOverTime.value.map((d) => {
    return d.interval === 'weeklyExact'
      ? `${t(MessageKey.calendarWeekShort)} ${getISOWeek(d.start)}`
      : formatDate(d.start, 'MMM yyyy');
  });
});

const renderChart = () => {
  chart.value?.destroy();
  chart.value = Highcharts.chart('weekly-weight-change-chart', {
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
    tooltip: {
      useHTML: true,
      formatter: function () {
        const name = this.series.name;
        const category = this.category;
        const color = this.color;
        const formatted = typeof this.y === 'number' ? n(this.y, 'weight') : this.y;

        const bodyDataRecord = changesOverTime.value.at(this.index);

        const timeRangeInfo =
          !!bodyDataRecord && bodyDataRecord.interval === 'weeklyExact'
            ? `<span>${formatDate(bodyDataRecord.start)} - ${formatDate(endOfISOWeek(bodyDataRecord.end))}</span>`
            : '';

        return `
        <div class="flex flex-col flex-nowrap items-start justify-center gap-y-1">
          <span>${category}</span>
          ${timeRangeInfo}
          <span><span style="color:${color}">\u25CF</span>&nbsp;${name}: <b>${formatted}</b></span>
        </div>
        `;
      },
    },
    xAxis: {
      categories: [...categories.value],
      type: 'category',
      title: {},
    },
    yAxis: {
      title: {
        text: t(MessageKey.change),
      },
    },
    series: [
      {
        name: t(MessageKey.weight),
        data: [...changesOverTime.value.map((x) => x.value)],
        type: 'column',
        color: weigthColor,
      },
    ],
  });
};

watch(localeStore, () => {
  renderChart();
});

watch(changesOverTime, () => {
  renderChart();
});

onBeforeUnmount(() => {
  chart.value?.destroy();
});
</script>

<template>
  <el-card>
    <div class="grid-container">
      <div
        id="weekly-weight-change-chart"
        :class="isDark ? 'highcharts-dark' : 'highcharts-light'"
      ></div>
    </div>
  </el-card>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
}

#weekly-weight-change-chart {
  height: 440px;
}
</style>
