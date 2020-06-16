<template>
  <v-card tile flat>
    <v-card-title>
      <span class="title font-weight-light"
        >实时热点
        <v-btn text href="https://news.qq.com/zt2020/page/feiyan.htm#/global" target="_Blank"
          ><v-icon>mdi-format-align-justify</v-icon>更多</v-btn
        >
      </span>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :items-per-page="10">
      <template v-slot:item.source="{ item }">
        <a target="_BLANK" style="text-decoration: none;" :href="item.source">
          原文
        </a>
      </template>
      <template v-slot:item.datetime="{ item }">
        {{ item.datetime | toDate }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from 'moment';
import API from '../API';

export default {
  data: () => ({
    items: [],
    tab: null,
    loading: false,
    headers: [
      { text: '时间', value: 'datetime' },
      { text: '简略描述', value: 'description', width: '50%', sortable: false },
      { text: '新闻原文', value: 'source', sortable: false }
    ]
  }),
  async mounted() {
    this.loading = true;
    const data = await API.getMyTime();
    const news = data.data.FAutoNewsArticleList;
    // console.log(news);
    this.items = [];
    news.forEach(item => {
      let { desc } = item;
      desc = desc.replace('详情', '');
      desc = desc.replace('>>', '');
      const times = {
        datetime: moment(item.publish_time).format('YYYY-MM-DD HH:mm:ss'),
        source: item.url,
        description: desc
      };
      this.items.push(times);
    });
    this.loading = false;
  },
  filters: {
    toDate(val) {
      return moment(val)
        .locale('zh-cn')
        .format('MMMM DD HH:mm');
    }
  }
};
</script>

<style scoped>
.v-tab--active {
  color: #fff;
}
</style>
