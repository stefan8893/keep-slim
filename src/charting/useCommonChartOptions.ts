import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import 'highcharts/themes/adaptive';

export function useCommonChartOptions() {
  Highcharts.setOptions({
    chart: {
      backgroundColor: 'transparent',
      reflow: true,
    },
    responsive: {
      rules: [],
    },
    tooltip: {
      backgroundColor: 'var(--el-text-color-primary)',
      style: {
        color: 'var(--el-bg-color)',
        borderRadius: 4,
      },
    },
  });
}
