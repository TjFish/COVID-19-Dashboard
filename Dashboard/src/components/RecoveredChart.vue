<template>
  <v-card tile flat>
    <v-card-text>
      <apexcharts height="300" ref="chart" :options="chartOptions" :series="series"></apexcharts>
    </v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import { mapState } from 'vuex';

export default {
  name: 'DailyReport',
  props: ['data'],
  components: {
    apexcharts: VueApexCharts
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'daily-report',
          type: 'radar',
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: []
        },
        tooltip: {
          theme: 'dark'
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#00897B'],
        title: {
          text: '新增治愈人数',
          align: 'left',
          color: 'green',
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: 'gray'
          }
        }
      },
      series: []
    };
  },

  computed: {
    ...mapState(['isDarkTheme'])
  },

  watch: {
    data(val) {
      const datesCombined = val.map(i => i.dates).flat(1);
      const uniqueDates = [...new Set(datesCombined.map(i => i.date))];
      const categories = uniqueDates.slice(Math.max(uniqueDates.length - 10, 1));
      const categories11 = uniqueDates.slice(Math.max(uniqueDates.length - 11, 1));
      this.$refs.chart.updateOptions({
        xaxis: {
          categories
        }
      });
      const series = [
        {
          name: '新增治愈',
          data: Array(categories11.length).fill(0)
        }
      ];
      datesCombined.forEach(item => {
        const categoryIdx = categories11.indexOf(item.date);
        series[0].data[categoryIdx] += item.recovered;
      });
      for (let i = categories11.length - 1; i > 0; i -= 1) {
        series[0].data[i] -= series[0].data[i - 1];
      }
      series[0].data = series[0].data.slice(1, 11);
      this.$refs.chart.updateSeries(series);
    },
    isDarkTheme(val) {
      this.$refs.chart.updateOptions({
        tooltip: {
          theme: val ? 'dark' : 'light'
        }
      });
    }
  }
};
</script>
