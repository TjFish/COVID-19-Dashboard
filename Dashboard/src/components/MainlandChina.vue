<template>
  <v-card tile flat>
    <v-card-text>
      <apexcharts ref="chart" :options="chartOptions" :series="series"></apexcharts>
    </v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import { mapState } from 'vuex';

export default {
  name: 'MainlandChina',
  props: ['data'],
  components: {
    apexcharts: VueApexCharts
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'mainland-china',
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        animations: {
          enabled: true
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
        markers: {
          size: 5,
          strokeColor: '#fff',
          strokeWidth: 2
        },
        colors: ['#FEAA00'],
        title: {
          text: 'Confirmed Cases in Mainland China',
          align: 'left'
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
      const categories = val.map(i => i['Province/State']);
      this.$refs.chart.updateOptions({
        xaxis: {
          categories
        }
      });
      const series = val.map(i => i.dates[i.dates.length - 1].confirmed);
      this.$refs.chart.updateSeries([
        {
          name: 'Total Cases',
          data: series
        }
      ]);
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
