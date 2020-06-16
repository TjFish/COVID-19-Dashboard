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
  props: ['chartId', 'labelName', 'title', 'data', 'colors'],
  components: {
    apexcharts: VueApexCharts
  },

  computed: {
    ...mapState(['isDarkTheme']),
    chartOptions() {
      let labels = [];

      if (this.data.length) {
        labels = this.data.map(i => i[Object.keys(this.data[0])[0]].replace(' years old', ''));
      }

      return {
        chart: {
          id: 'rate-by-age',
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top'
            }
          }
        },
        xaxis: {
          categories: labels,
          labels: {
            style: {
              colors: 'gray',
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-xaxis-label'
            }
          }
        },
        tooltip: {
          theme: 'dark'
        },
        dataLabels: {
          enabled: false
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
        colors: ['#00897B']
      };
    },
    series() {
      return [
        {
          name: '死亡率',
          data: this.data.map(i => {
            if (i.rate.toLowerCase() === 'no fatalities') {
              return 0;
            }

            return +i.rate.replace('%', '');
          })
        }
      ];
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
