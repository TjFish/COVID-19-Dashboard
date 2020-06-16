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
      <v-btn-toggle
        v-model="text"
        tile
        color="deep-purple accent-3"
        group
        style="margin-left:150px"
      >
        <v-btn value="left" @click="ncov_wuhan">
          <span class="hidden-sm-and-down">湖北疫情</span>
        </v-btn>
        <v-btn value="center" @click="ncov_china">
          <span class="hidden-sm-and-down">中国疫情</span>
        </v-btn>

        <v-btn value="right" @click="ncov_world" selected>
          <span class="hidden-sm-and-down">世界疫情</span>
        </v-btn>
        <v-hover v-slot:default="{ hover }" open-delay="200">
          <v-btn value="justify" @click="pickFile">
            <v-icon left>mdi-file-plus-outline</v-icon>
            <span class="hidden-sm-and-down">自定义数据</span>
            <input type="file" style="display: none" ref="file" @change="getFile" />
            <v-expand-transition>
              <dialog
                v-if="hover"
                class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal"
                style="margin-top:60px"
              >
                数据格式要求如下：<br />
                name type value date<br />
                名称1 类型1 值1 日期1<br />
                名称2 类型2 值2 日期2
              </dialog>
            </v-expand-transition>
          </v-btn>
        </v-hover>
      </v-btn-toggle>

      <iframe
        :src="`${publicPath}static/Ranking/index.html`"
        scrolling="no"
        style="width: 100%;height: 100%;"
        frameborder="0"
        id="Ranking"
        ref="iframe"
        @load="ncov_world()"
      ></iframe>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import * as d3 from 'd3';
import axios from 'axios';
// import API from './API';

export default {
  name: 'Ranking',
  computed: {
    ...mapState(['isDarkTheme'])
  },
  watch: {
    isDarkTheme(val) {
      this.$vuetify.theme.dark = val;
      this.checkTheme();
    }
  },
  data: () => ({
    cases: {},
    text: 'right',
    publicPath: process.env.BASE_URL
  }),
  mounted() {
    // this.cases = await API.getCases();
  },
  methods: {
    ...mapMutations(['TOGGLE_THEME']),
    setData(data) {
      // console.log(window.frames);
      const obj1 = window.frames.Ranking; // 获得对应iframe的window对象
      // console.log(obj1);
      obj1.wpsData = '设置的数据';
    },
    play(result) {
      const data = d3.csvParse(result);
      try {
        window.frames.Ranking.contentWindow.clear();
        window.frames.Ranking.contentWindow.draw(data);
      } catch (error) {
        alert(error);
      }
    },
    pickFile() {
      this.$refs.file.click();
    },
    getFile(e) {
      // console.log(e);
      const { files } = e.target;
      const r = new FileReader();
      r.readAsText(files[0], 'UTF-8');
      const that = this;
      // console.log(e);
      r.onload = function() {
        // 读取完成后，数据保存在对象的result属性中
        that.play(this.result);
      };
    },
    ncov_world() {
      const that = this;

      axios.get(`${this.publicPath}static/Ranking/nCov_world_0516.csv`).then(res => {
        that.play(res.data);
      });
    },
    ncov_china() {
      const that = this;
      axios.get(`${this.publicPath}static/Ranking/nCov_china_0319.csv`).then(res => {
        const data = d3.csvParse(res.data);
        // console.log(data);
        const map = new Map();
        const array = [];
        for (let i = 0; i < data.length; i += 1) {
          if (map.has(data[i].name + data[i].date)) {
            // 如果有该key值
          } else {
            map.set(data[i].name + data[i].date, true); // 如果没有该key值
            array.push(data[i]);
          }
        }
        try {
          window.frames.Ranking.contentWindow.clear();
          window.frames.Ranking.contentWindow.draw(array);
        } catch (error) {
          alert(error);
        }
      });
    },
    ncov_wuhan() {
      const that = this;
      axios.get(`${this.publicPath}static/Ranking/nCov_wuhan_0319.csv`).then(res => {
        that.play(res.data);
      });
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
    },
    checkTheme() {
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
