<template>
  <v-app>
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
      <v-btn text value="center" href="http://localhost:1234" target="_Blank">
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
          <v-btn icon v-on="on" @click="TOGGLE_THEME">
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-btn>
        </template>
        <span>风格切换</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <iframe
        :src="`${publicPath}static/Chart/index.html`"
        scrolling="no"
        style="width: 100%;height:100%;"
        frameborder="0"
        id="Chart"
        @load="checkTheme()"
      ></iframe>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Chart',
  computed: {
    ...mapState(['isDarkTheme'])
  },
  data: () => ({
    publicPath: process.env.BASE_URL
  }),
  watch: {
    isDarkTheme(val) {
      this.$vuetify.theme.dark = val;
      this.checkTheme();
      //   if (val) {
      //     document
      //       .getElementById('Chart')
      //       .contentWindow.document.getElementById('ChartBody')
      //       .setAttribute('style', 'background-color: black;');
      //   } else {
      //     document
      //       .getElementById('Chart')
      //       .contentWindow.document.getElementById('ChartBody')
      //       .setAttribute('style', 'background-color: white;');
      //   }
    }
  },
  methods: {
    ...mapMutations(['TOGGLE_THEME']),
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
    },
    checkTheme() {
      // console.log('mm', this.$vuetify.theme.dark);
      if (this.$vuetify.theme.dark) {
        document
          .getElementById('Chart')
          .contentWindow.document.getElementById('ChartBody')
          .setAttribute('style', 'background-color: black;');
      } else {
        document
          .getElementById('Chart')
          .contentWindow.document.getElementById('ChartBody')
          .setAttribute('style', 'background-color: white;');
      }
    }
  }
};
</script>
