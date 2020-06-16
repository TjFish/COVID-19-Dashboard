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
  props: ['title', 'data'],
  components: {
    apexcharts: VueApexCharts
  },

  computed: {
    ...mapState(['isDarkTheme']),
    chartOptions() {
      let labels = [];

      if (this.data.length) {
        labels = this.data.map(i => i[Object.keys(this.data[0])[0]]);
        labels = ['男性', '女性'];
      }

      return {
        chart: {
          id: 'sex-rate-chart',
          type: 'donut',
          toolbar: {
            show: false
          }
        },
        labels,
        tooltip: {
          theme: 'dark'
        },
        dataLabels: {
          enabled: false,
          formatter(val) {
            return `${val}%`;
          }
        },
        title: {
          text: this.title,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: 'gray'
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter(val) {
              return `${val}%`;
            }
          }
        },
        colors: ['#008FFB', '#DB6395'],
        legend: {
          position: 'top'
        }
      };
    },
    series() {
      return this.data.map(i => +i.rate.replace('%', ''));
    }
  },

  watch: {
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
