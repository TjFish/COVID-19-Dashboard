<template>
  <div>
    <!-- 留坑，非常重要 -->
    <router-view></router-view>
  </div>
</template>

<script>
// import ICountUp from 'vue-countup-v2';
// import { mapState, mapMutations } from 'vuex';
// import LeafletMap from './components/Map.vue';
// import DailyReport from './components/DailyReport.vue';
// import RecoveredChart from './components/RecoveredChart.vue';
// // import Tweets from './components/Tweets.vue';
// import TweetDialog from './components/TweetDialog.vue';
// import Timeline from './components/Timeline.vue';
// import Reference from './components/Reference.vue';
// import SearchDialog from './components/SearchDialog.vue';
// import FatalityRateByAge from './components/FatalityRateByAge.vue';
// import FatalityRateBySex from './components/FatalityRateBySex.vue';
// import FatalityRateByComorbidity from './components/FatalityRateByComorbidity.vue';
// import TotalCases from './components/TotalCases.vue';
// import API from './API';

export default {
  name: 'App',

  // components: {
  //   LeafletMap,
  //   DailyReport,
  //   RecoveredChart,
  //   ICountUp,
  //   // Tweets,
  //   TweetDialog,
  //   Timeline,
  //   Reference,
  //   SearchDialog,
  //   FatalityRateByAge,
  //   FatalityRateBySex,
  //   FatalityRateByComorbidity,
  //   TotalCases
  // },

  data: () => ({
    // drawer: null,
    // cases: {
    //   total_confirmed: 0,
    //   total_recovered: 0,
    //   total_death: 0,
    //   data: []
    // },
    // selected: {},
    // dialog: false,
    // loading: false,
    // snackbar: false,
    // fatalityRate: {
    //   byAge: [],
    //   bySex: [],
    //   byComorbidity: []
    // }
  })

  //   computed: {
  //     ...mapState(['isDarkTheme']),
  //     locations() {
  //       const data = [];
  //       this.cases.data.forEach(item => {
  //         const idx = data.findIndex(i => i['Country/Region'] === item['Country/Region']);
  //         const { confirmed } = item.dates[item.dates.length - 1];
  //         const { recovered } = item.dates[item.dates.length - 1];
  //         const { death } = item.dates[item.dates.length - 1];
  //         if (idx === -1) {
  //           const obj = {
  //             ...item,
  //             confirmed,
  //             recovered,
  //             death
  //           };
  //           delete obj['Province/State'];
  //           delete obj.dates;
  //           data.push(obj);
  //         } else {
  //           data[idx].confirmed += confirmed;
  //           data[idx].recovered += recovered;
  //           data[idx].death += death;
  //         }
  //       });
  //       return data.sort((a, b) => b.confirmed - a.confirmed);
  //     },
  //     mainlandChinaCases() {
  //       return this.cases.data.filter(i => i['Country/Region'] === 'Mainland China');
  //     }
  //   },

  //   async created() {
  //     this.$vuetify.theme.dark = this.isDarkTheme;
  //     this.loading = true;
  //     this.cases = await API.getCases();
  //     this.fatalityRate = await API.getFatalityRate();
  //     this.loading = false;
  //   },

  //   mounted() {
  //     document.addEventListener('swUpdated', () => {
  //       this.snackbar = true;
  //     });
  //   },

  //   watch: {
  //     isDarkTheme(val) {
  //       this.$vuetify.theme.dark = val;
  //     }
  //   },

  //   methods: {
  //     ...mapMutations(['TOGGLE_THEME']),
  //     view(location) {
  //       if (this.$vuetify.breakpoint.smAndDown) {
  //         this.drawer = false;
  //       }

  //       window.scrollTo({ top: 0, behavior: 'smooth' });
  //       const { Lat, Long } = location;
  //       this.$refs.map.flyTo(Lat, Long);
  //     },
  //     viewDetails(location) {
  //       this.selected = {
  //         ...location,
  //         confirmed: +location.dates[location.dates.length - 1].confirmed,
  //         death: +location.dates[location.dates.length - 1].death,
  //         recovered: +location.dates[location.dates.length - 1].recovered
  //       };
  //       this.dialog = true;
  //     },
  //     endReached() {
  //       this.$refs.tweets.loadMore();
  //     },
  //     reload() {
  //       window.location.reload(true);
  //     }
  //   }
};
</script>
