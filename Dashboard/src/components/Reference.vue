<template>
  <div>
    <v-card tile flat>
      <v-card-text class="d-flex justify-space-between">
        <v-row>
          <v-col cols="12" :class="[$vuetify.breakpoint.mdAndUp ? 'text-left' : 'text-center']">
            本项目是2020Web系统技术期末作业-<a href="https://github.com/TjFish">1753112-欧阳桥梁</a
            >&nbsp;&nbsp;&nbsp;&nbsp;<br />
            数据来源：
            <a
              class="no-decoration"
              href="https://github.com/CSSEGISandData/COVID-19"
              target="_BLANK"
              >霍普金斯大学数据</a
            >
            -
            <a
              class="no-decoration"
              href="https://www.who.int/zh/emergencies/diseases/novel-coronavirus-2019/advice-for-public"
              target="_BLANK"
              >世卫组织WHO</a
            >
            -
            <a class="no-decoration" href="https://3g.dxy.cn/newh5/view/pneumonia" target="_BLANK"
              >丁香园实时数据</a
            >
            -
            <a
              class="no-decoration"
              href="https://github.com/bumbeishvili/covid19-daily-data"
              target="_BLANK"
              >Covid-Data</a
            >
            -
            <a class="no-decoration" href="https://corona.lmao.ninja/" target="_BLANK">国旗图片</a>
            -
            <a
              class="no-decoration"
              href="https://news.qq.com/zt2020/page/feiyan.htm#/global"
              target="_BLANK"
              >腾讯新闻</a
            >
            <br />
            参考项目：
            <a class="no-decoration" href="https://vuetifyjs.com/en/" target="_BLANK">Vuetify</a>
            -
            <a class="no-decoration" href="https://apexcharts.com/" target="_BLANK">Apexchart</a>
            -
            <a class="no-decoration" href="https://leafletjs.com/" target="_BLANK">Leaflet</a>
            -
            <a class="no-decoration" href="https://d3js.org/" target="_BLANK">D3js</a>

            -
            <a class="no-decoration" href="https://github.com/vasturiano/globe.gl" target="_BLANK"
              >Globe.gl</a
            >
            -
            <a class="no-decoration" href="https://expressjs.com/zh-cn/" target="_BLANK"
              >NodeExpress</a
            >
            -
            <a class="no-decoration" href="https://materialdesignicons.com/" target="_BLANK"
              >Material Design Icons</a
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar bottom v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn color="red" text @click="snackbar.show = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['isDarkTheme'])
  },
  data: () => ({
    snackbar: {
      show: false,
      text: null
    }
  }),
  methods: {
    async share() {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'the2019ncov.com',
            text: 'Map, data and timeline of coronavirus (COVID-19)',
            url: 'https://the2019ncov.com'
          });
          this.snackbar.text = 'Shared successfully.';
          this.snackbar.show = true;
        } catch (e) {
          // share cancelled
        }
      } else {
        this.snackbar.text = 'Unsupported.';
        this.snackbar.show = true;
      }
    }
  }
};
</script>

<style scoped>
.no-decoration {
  text-decoration: none;
}
</style>
