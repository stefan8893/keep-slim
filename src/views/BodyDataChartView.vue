<script setup lang="ts">
import { prepareBodyDataForChart } from '@/bodyData/aggregations/body-data-chart-preparation';
import type {
  BodyData,
  SingleBodyDataSummarizedByWeek,
  SummarizedBodyDataProperty,
} from '@/bodyData/body-data.types';
import { useColors } from '@/colors/useColors';
import { formatDate, formatDateTime } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { useDateLocales } from '@/i18n/useLocales';
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import { useLocaleStore } from '@/stores/localeStore';
import { endOfISOWeek, getISOWeek, parse } from 'date-fns';
import Highcharts from 'highcharts';
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { isDark } = inject(themingControlKey) as ThemingControl;
const { n, t } = useI18n();
const chart = ref<Highcharts.Chart | null>(null);
const localeStore = useLocaleStore();
const dateLocales = useDateLocales();
const { weigthColor, muscleMassColor, bodyFatColor, waterColor } = useColors();

const props = defineProps<{
  bodyData: BodyData[];
}>();

const preparedBodyData = computed(() => prepareBodyDataForChart(props.bodyData));

const categories = computed(() => {
  if (preparedBodyData.value.type === 'summarizedByDay') {
    return preparedBodyData.value.result.map((x) => formatDateTime(x.day));
  } else {
    return preparedBodyData.value.result.map((x) => formatDate(x.firstDayOfWeek));
  }
});
const weightSeries = computed(() =>
  preparedBodyData.value.result.map((x) => x.values.weight.value),
);
const muscleMassSeries = computed(() =>
  preparedBodyData.value.result.map((x) => x.values.muscleMass.value),
);
const bodyFatSeries = computed(() =>
  preparedBodyData.value.result.map((x) => x.values.bodyFat.value),
);
const waterSeries = computed(() => preparedBodyData.value.result.map((x) => x.values.water.value));

const bodyDataPropertyBySeriesIndex: Map<number, SummarizedBodyDataProperty> = new Map([
  [0, 'weight'],
  [1, 'muscleMass'],
  [2, 'bodyFat'],
  [3, 'water'],
]);

const isSummarizedByWeek = computed(() => preparedBodyData.value.type === 'summarizedByWeek');

const getSummarizedByWeek = (index: number, seriesIndex: number) => {
  if (!isSummarizedByWeek.value) return null;

  const summarizedByWeek = preparedBodyData.value.result.at(
    index,
  ) as SingleBodyDataSummarizedByWeek;
  const bodyDataProperty = bodyDataPropertyBySeriesIndex.get(seriesIndex);
  if (!bodyDataProperty) return null;

  return {
    firstDayOfWeek: summarizedByWeek.firstDayOfWeek,
    value: summarizedByWeek.values[bodyDataProperty],
  };
};

const renderChart = () => {
  chart.value?.destroy();
  chart.value = Highcharts.chart('body-data-chart', {
    lang: {
      locale: localeStore.locale,
    },
    chart: {
      type: 'line',
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
        const format = (value: number) =>
          this.series.index === 0 ? n(value, 'weight') : n(value / 100, 'percent');
        const formatted = typeof this.y === 'number' ? format(this.y) : this.y;

        const summarizedByWeek = getSummarizedByWeek(this.index, this.series.index);

        const countInfomation = !!summarizedByWeek
          ? `&nbsp;<span>(${summarizedByWeek.value.count})</span>`
          : ``;

        const firstDayOfWeek = summarizedByWeek?.firstDayOfWeek;
        const timeRangeInfo = !!firstDayOfWeek
          ? `<span>${t(MessageKey.calendarWeekShort)} ${getISOWeek(firstDayOfWeek)}</span><span>${formatDate(firstDayOfWeek)} - ${formatDate(endOfISOWeek(firstDayOfWeek))}</span>`
          : `<span>${category}</span>`;

        return `
        <div class="flex flex-col flex-nowrap items-start justify-center gap-y-1">
          ${timeRangeInfo}
          <span><span style="color:${color}">\u25CF</span>&nbsp;${name}: <b>${formatted}</b>${countInfomation}</span>
        </div>
        `;
      },
    },
    xAxis: {
      categories: categories.value,
      labels: {
        formatter: function () {
          if (isSummarizedByWeek.value) {
            const parsed = parse(this.value.toString(), 'P', new Date(), {
              locale: dateLocales.getCurrentLocale(),
            });
            return getISOWeek(parsed).toString();
          } else return this.value.toString();
        },
      },
    },
    yAxis: [
      {
        title: {
          text: '',
        },
        labels: {
          format: '{value} kg',
        },
        opposite: false,
      },
      {
        title: {
          text: '',
        },
        labels: {
          format: '{value} %',
        },
        opposite: true,
      },
    ],
    series: [
      {
        name: t(MessageKey.weight),
        data: weightSeries.value,
        type: 'line',
        color: weigthColor,
        yAxis: 0,
      },
      {
        name: t(MessageKey.muscleMass),
        data: muscleMassSeries.value,
        type: 'line',
        color: muscleMassColor,
        visible: false,
        yAxis: 1,
      },
      {
        name: t(MessageKey.bodyData),
        data: bodyFatSeries.value,
        type: 'line',
        color: bodyFatColor,
        visible: false,
        yAxis: 1,
      },
      {
        name: t(MessageKey.water),
        data: waterSeries.value,
        type: 'line',
        color: waterColor,
        visible: false,
        yAxis: 1,
      },
    ],
  });
};

watch(localeStore, () => {
  renderChart();
});

watch(
  () => props.bodyData,
  () => {
    renderChart();
  },
);

onBeforeUnmount(() => {
  chart.value?.destroy();
});
</script>

<template>
  <el-card>
    <div class="grid-container">
      <div id="body-data-chart" :class="isDark ? 'highcharts-dark' : 'highcharts-light'"></div>
    </div>
  </el-card>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
}

#body-data-chart {
  height: 440px;
}
</style>
