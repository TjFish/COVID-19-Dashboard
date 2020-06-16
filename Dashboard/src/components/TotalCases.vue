<template>
  <v-row>
    <v-col cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <v-badge inline color="red" :content="today_confirmed">
        <span :class="[count]"><ICountUp :endVal="infected"/></span>
      </v-badge>

      <span :class="[title]">确诊</span>
    </v-col>
    <v-col cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <v-badge inline color="green" :content="today_recovered">
        <span :class="[count]"><ICountUp :endVal="recovered"/></span>
      </v-badge>

      <span :class="[title]">治愈</span>
    </v-col>
    <v-col cols="12" md="4" class="d-flex flex-column justify-center align-center">
      <v-badge inline color="pink" :content="today_death">
        <span :class="[count]"><ICountUp :endVal="deaths"/></span>
      </v-badge>
      <span :class="[title]">死亡</span>
    </v-col>
  </v-row>
</template>

<script>
import ICountUp from 'vue-countup-v2';

export default {
  props: ['infected', 'recovered', 'deaths', 'today_confirmed', 'today_recovered', 'today_death'],
  components: {
    ICountUp
  },
  computed: {
    count() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 'display-2 font-weight-bold';
      }

      return 'display-1 font-weight-bold';
    },
    title() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 'mt-4 title';
      }

      return 'mt-4 subtitle-1';
    }
  }
};
</script>
