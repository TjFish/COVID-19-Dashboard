import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tweetDialog: false,
    isDarkTheme: true
  },
  mutations: {
    SET_TWEET_DIALOG(state, payload) {
      state.tweetDialog = payload;
    },
    TOGGLE_THEME(state) {
      state.isDarkTheme = !state.isDarkTheme;
    }
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()]
});
