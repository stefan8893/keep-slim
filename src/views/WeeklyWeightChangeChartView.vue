<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import { useLocaleStore } from '@/stores/localeStore';
import Highcharts from 'highcharts';
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const { isDark } = inject(themingControlKey) as ThemingControl;

const props = defineProps<{
  bodyData: BodyData[];
}>();

console.log('body data change', props.bodyData);

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
