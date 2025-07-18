<script setup lang="ts">
import { prepareBodyDataForChart } from '@/bodyData/aggregations/body-data-chart-preparation';
import type {
  BodyData,
  SingleBodyDataSummarizedByDay,
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
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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

const getSummarizedBodyDataValues = (index: number, seriesIndex: number) => {
  const summarizedBodyData = preparedBodyData.value.result.at(index);
  const bodyDataProperty = bodyDataPropertyBySeriesIndex.get(seriesIndex);
  if (!bodyDataProperty) return null;

  return summarizedBodyData?.values[bodyDataProperty];
};

const getTooltip = (
  value: undefined | number,
  index: number,
  seriesIndex: number,
  name: string,
  color: unknown,
) => {
  const format = (value: number) =>
    seriesIndex === 0 ? n(value, 'weight') : n(value / 100, 'percent');
  const formatted = typeof value === 'number' ? format(value) : value;

  const isSummarizedByDay = preparedBodyData.value.type === 'summarizedByDay';
  const summarizedBodyData = getSummarizedBodyDataValues(index, seriesIndex);
  if (!summarizedBodyData) return '';

  const countInfo = !isSummarizedByDay ? `&nbsp;<span>(${summarizedBodyData.count})</span>` : ``;

  const time = isSummarizedByDay
    ? (preparedBodyData.value.result.at(index) as SingleBodyDataSummarizedByDay).day
    : (preparedBodyData.value.result.at(index) as SingleBodyDataSummarizedByWeek).firstDayOfWeek;

  const timeInfo = !isSummarizedByDay
    ? `<span>${t(MessageKey.calendarWeekShort)} ${getISOWeek(time)}</span><span>${formatDate(time)} - ${formatDate(endOfISOWeek(time))}</span>`
    : `<span>${formatDateTime(time, 'PPPPp')}</span>`;

  return `
        <div class="flex flex-col flex-nowrap items-start justify-center gap-y-1">
          ${timeInfo}
          <span>
            <span style="color:${color}">\u25CF</span>&nbsp;${name}: <b>${formatted}</b>
            ${countInfo}
          </span>
        </div>
        `;
};

const getCategoryLabel = (value: string | number) => {
  if (typeof value === 'number') return value.toString();

  if (isSummarizedByWeek.value) {
    const parsed = parse(value.toString(), 'P', new Date(), {
      locale: dateLocales.getCurrentLocale(),
    });
    return getISOWeek(parsed).toString();
  } else {
    const parsed = parse(value.toString(), 'Pp', new Date(), {
      locale: dateLocales.getCurrentLocale(),
    });
    return formatDate(parsed);
  }
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
      series: {
        states: {
          inactive: {
            enabled: false,
          },
        },
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        return getTooltip(this.y, this.index, this.series.index, this.series.name, this.color);
      },
    },
    xAxis: {
      categories: [...categories.value],
      labels: {
        formatter: function () {
          return getCategoryLabel(this.value);
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
        data: [...weightSeries.value],
        type: 'line',
        color: weigthColor,
        yAxis: 0,
      },
      {
        name: t(MessageKey.muscleMass),
        data: [...muscleMassSeries.value],
        type: 'line',
        color: muscleMassColor,
        visible: false,
        yAxis: 1,
      },
      {
        name: t(MessageKey.bodyFat),
        data: [...bodyFatSeries.value],
        type: 'line',
        color: bodyFatColor,
        visible: false,
        yAxis: 1,
      },
      {
        name: t(MessageKey.water),
        data: [...waterSeries.value],
        type: 'line',
        color: waterColor,
        visible: false,
        yAxis: 1,
      },
    ],
  });
};

const updateChart = () => {
  chart.value?.xAxis[0].setCategories([...categories.value], false);
  chart.value?.series[0].setData([...weightSeries.value], false);
  chart.value?.series[0].update({ type: 'line', name: t(MessageKey.weight) }, false);
  chart.value?.series[1].setData([...muscleMassSeries.value], false);
  chart.value?.series[1].update({ type: 'line', name: t(MessageKey.muscleMass) }, false);
  chart.value?.series[2].setData([...bodyFatSeries.value], false);
  chart.value?.series[2].update({ type: 'line', name: t(MessageKey.bodyFat) }, false);
  chart.value?.series[3].setData([...waterSeries.value], false);
  chart.value?.series[3].update({ type: 'line', name: t(MessageKey.water) }, false);

  chart.value?.redraw(false);
};

watch(localeStore, () => {
  updateChart();
});

watch(
  () => props.bodyData,
  () => {
    updateChart();
  },
);

onMounted(() => renderChart());

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
