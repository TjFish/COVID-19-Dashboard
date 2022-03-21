<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped style="width: 300px;">
      <v-list three-line>
        <div v-if="loading">
          <v-list-item link v-for="i in 20" :key="i">
            <v-list-item-content>
              <v-list-item-title>
                <v-skeleton-loader type="text"></v-skeleton-loader>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-skeleton-loader width="140" type="text"></v-skeleton-loader>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <v-skeleton-loader width="140" type="text"></v-skeleton-loader>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-list-item @click="view(l)" v-else v-for="(l, idx) in locations" :key="idx" link>
          <v-list-item-avatar>
            <v-img :src="l.flag" alt="flag"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ l['CNAME'] }}
              <v-badge color="red" inline :content="'+' + l.today.confirmed" :dark="isDarkTheme">
                <span class="font-weight-bold">
                  <ICountUp class="red--text text--darken-2" :endVal="l.confirmed" />
                </span>
              </v-badge>
            </v-list-item-title>
            <v-list-item-subtitle>
              死亡:
              <ICountUp :endVal="l.death" />
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              治愈:
              <ICountUp :endVal="l.recovered" />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        COVID-19
        <span v-show="$vuetify.breakpoint.smAndUp">Dashboard</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn text value="left" @click="home">
        <v-icon left>mdi-home-variant-outline</v-icon>
        <span class="hidden-sm-and-down">首页</span>
      </v-btn>
      <v-btn text value="center" href="/COVID-19-Dashboard/3d/" target="_Blank">
        <v-icon left>mdi-earth</v-icon>
        <span class="hidden-sm-and-down">3D展示</span>
      </v-btn>

      <v-btn text value="right" @click="chart">
        <!-- chart-bell-curve-cumulative -->
        <v-icon left>mdi-chart-areaspline</v-icon>
        <span class="hidden-sm-and-down">国家对比</span>
      </v-btn>
      <v-btn text value="right" @click="Ranking">
        <!-- chart-bell-curve-cumulative -->
        <v-icon left>mdi-chart-bar</v-icon>
        <span class="hidden-sm-and-down">动态排名</span>
      </v-btn>
      <v-btn text value="right" @click="who">
        <!-- chart-bell-curve-cumulative -->
        <v-icon left>mdi-hospital-box</v-icon>
        <span class="hidden-sm-and-down">疾病知识</span>
      </v-btn>
      <!-- <v-btn value="right">
          <span class="hidden-sm-and-down">搜索</span>

          <v-icon right>mdi-format-align-right</v-icon>
        </v-btn>

        <v-btn value="justify">
          <span class="hidden-sm-and-down">Justify</span>

          <v-icon right>mdi-format-align-justify</v-icon>
        </v-btn> -->
      <v-tooltip bottom :dark="isDarkTheme">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="$refs.searchDialog.dialog = true">
            <v-icon>mdi-map-search</v-icon>
          </v-btn>
        </template>
        <span>搜索</span>
      </v-tooltip>
      <v-tooltip bottom :dark="isDarkTheme">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="TOGGLE_THEME">
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-btn>
        </template>
        <span>风格切换</span>
      </v-tooltip>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row>
          <v-col cols="12">
            <TotalCases
              :infected="cases.total_confirmed"
              :recovered="cases.total_recovered"
              :deaths="cases.total_death"
              :today_confirmed="'+' + cases.today_confirmed"
              :today_recovered="'+' + cases.today_recovered"
              :today_death="'+' + cases.today_death"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card tile style="height: 70vh;" flat>
              <LeafletMap :cases="cases" ref="map" @MARKER_CLICKED="viewDetails" />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card tile style="height: 90vh;" flat>
              <iframe
                :src="`${publicPath}static/China/index.html`"
                scrolling="no"
                style="width: 100%;height:100%;"
                frameborder="0"
                id="ChinaMap"
              ></iframe>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <DailyReport :data="cases.data" />
          </v-col>
          <v-col cols="12" md="6">
            <RecoveredChart :data="cases.data" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <FatalityRateByAge title="死亡率 - 年龄分布" :data="fatalityRate.byAge" />
          </v-col>
          <v-col cols="12" md="6">
            <FatalityRateBySex
              title="死亡率 - 性别分布"
              :data="fatalityRate.bySex"
              :colors="['#152C82', '#DB6395']"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <FatalityRateByComorbidity
              title="死亡率 - 综合症分布"
              :data="fatalityRate.byComorbidity"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <Timeline />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <Reference />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <!-- <iframe src="" width="1200" height="300" frameborder="0" scrolling="auto"></iframe> -->
          </v-col>
        </v-row>
      </v-container>

      <!-- Details -->
      <v-dialog width="500" v-model="dialog" :fullscreen="$vuetify.breakpoint.xsOnly">
        <v-card>
          <v-card-title>
            <span v-show="$vuetify.breakpoint.smAndUp" class="headline"
              >疫情详情: {{ selected.country }}</span
            >
            <span v-show="$vuetify.breakpoint.xsOnly" class="headline">{{ selected.country }}</span>
            <v-spacer></v-spacer>
            <v-btn v-show="$vuetify.breakpoint.xsOnly" @click="dialog = false" icon>
              <span>关闭</span>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div>
              <p>国家/地区: {{ selected['CNAME'] }}</p>
              <p v-show="selected['Province/State']">省份/洲: {{ selected['Province/State'] }}</p>
              <div style="width:49%;float:left">
                <p>
                  累计确诊:
                  <ICountUp class="red--text text--darken-2" :endVal="selected.confirmed" />
                </p>
                <p>
                  累计死亡:
                  <ICountUp :endVal="selected.death" />
                </p>
                <p>
                  累计治愈:
                  <ICountUp class="green--text text--darken-2" :endVal="selected.recovered" />
                </p>
                <p>
                  现存确诊:
                  <ICountUp :endVal="selected.confirmed - selected.death - selected.recovered" />
                </p>
              </div>
              <div style="width:49%;float:right">
                <p>
                  新增确诊:
                  <ICountUp class="red--text text--darken-2" :endVal="selected.today_confirmed" />
                </p>
                <p>
                  新增死亡:
                  <ICountUp :endVal="selected.today_death" />
                </p>
                <p>
                  新增治愈:
                  <ICountUp :endVal="selected.today_recovered" />
                </p>
                <p>死亡率:{{ ((selected.death * 100) / selected.confirmed).toFixed(2) }}%</p>
              </div>
              <div>
                <img :src="selected['flag']" width="250px" />
              </div>
            </div>
          </v-card-text>
          <v-card-actions v-show="$vuetify.breakpoint.smAndUp">
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>

    <v-snackbar v-model="snackbar" bottom right :timeout="0">
      An update is available
      <v-btn dark text @click="reload">Reload</v-btn>
    </v-snackbar>

    <TweetDialog ref="tweetDialog" />

    <SearchDialog ref="searchDialog" :data="cases.data" @PLACE_SELECTED="viewDetails" />

    <!-- <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import ICountUp from 'vue-countup-v2';
import { mapState, mapMutations } from 'vuex';
import axios from 'axios';
import LeafletMap from './components/Map.vue';
import DailyReport from './components/DailyReport.vue';
import RecoveredChart from './components/RecoveredChart.vue';
// import Tweets from './components/Tweets.vue';
import TweetDialog from './components/TweetDialog.vue';
import Timeline from './components/Timeline.vue';
import Reference from './components/Reference.vue';
import SearchDialog from './components/SearchDialog.vue';
import FatalityRateByAge from './components/FatalityRateByAge.vue';
import FatalityRateBySex from './components/FatalityRateBySex.vue';
import FatalityRateByComorbidity from './components/FatalityRateByComorbidity.vue';
import TotalCases from './components/TotalCases.vue';
import API from './API';

export default {
  name: 'Home',
  components: {
    LeafletMap,
    DailyReport,
    RecoveredChart,
    ICountUp,
    // Tweets,
    TweetDialog,
    Timeline,
    Reference,
    SearchDialog,
    FatalityRateByAge,
    FatalityRateBySex,
    FatalityRateByComorbidity,
    TotalCases
  },

  data: () => ({
    publicPath: process.env.BASE_URL,
    drawer: null,
    cases: {
      total_confirmed: 0,
      total_recovered: 0,
      total_death: 0,
      data: []
    },
    chinaData: {},
    selected: {},
    dialog: false,
    loading: false,
    snackbar: false,
    fatalityRate: {
      byAge: [],
      bySex: [],
      byComorbidity: []
    }
  }),

  computed: {
    ...mapState(['isDarkTheme']),
    locations() {
      const data = [];
      this.cases.data.forEach(item => {
        const idx = data.findIndex(i => i['Country/Region'] === item['Country/Region']);
        const { confirmed } = item.dates[item.dates.length - 1];
        const { recovered } = item.dates[item.dates.length - 1];
        const { death } = item.dates[item.dates.length - 1];
        if (idx === -1) {
          const obj = {
            ...item,
            confirmed,
            recovered,
            death
          };
          delete obj['Province/State'];
          delete obj.dates;
          data.push(obj);
        } else {
          data[idx].confirmed += confirmed;
          data[idx].recovered += recovered;
          data[idx].death += death;
        }
      });
      return data.sort((a, b) => b.confirmed - a.confirmed);
    },
    mainlandChinaCases() {
      return this.cases.data.filter(i => i['Country/Region'] === 'Mainland China');
    }
  },

  async created() {
    this.$vuetify.theme.dark = this.isDarkTheme;
    this.loading = true;
    this.cases = await API.getCases();
    this.fatalityRate = await API.getFatalityRate();
    const that = this;
    this.chinaData = await API.getChianData();

    const d = JSON.parse(this.chinaData.data);
    const china = d.areaTree[0];
    window.frames.ChinaMap.contentWindow.updateData(china);
    this.loading = false;
  },

  mounted() {
    document.addEventListener('swUpdated', () => {
      this.snackbar = true;
    });
    const that = this;
  },

  watch: {
    isDarkTheme(val) {
      this.$vuetify.theme.dark = val;
    }
  },

  methods: {
    ...mapMutations(['TOGGLE_THEME']),
    view(location) {
      if (this.$vuetify.breakpoint.smAndDown) {
        this.drawer = false;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      const { Lat, Long } = location;
      // console.log(location);
      this.$refs.map.flyTo(Lat, Long);
    },
    viewDetails(location) {
      this.selected = {
        ...location,
        confirmed: +location.dates[location.dates.length - 1].confirmed,
        death: +location.dates[location.dates.length - 1].death,
        recovered: +location.dates[location.dates.length - 1].recovered,
        today_confirmed: +location.today.confirmed,
        today_recovered: +location.today.recovered,
        today_death: +location.today.death
      };
      this.dialog = true;
    },
    endReached() {
      this.$refs.tweets.loadMore();
    },
    reload() {
      window.location.reload(true);
    },
    chart() {
      this.$router.replace('/Chart');
    },
    home() {
      this.$router.replace('/');
    },
    who() {
      this.$router.replace('/WHO');
    },
    Ranking() {
      this.$router.replace('/Ranking');
    }
  }
};
</script>

<style scoped>
.ps {
  height: 70vh;
}
</style>
