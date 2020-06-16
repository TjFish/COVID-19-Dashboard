<template>
  <div>
    <v-card :key="t.id" outlined v-for="t in items" class="mb-2">
      <v-card-text>
        <p class="font-weight-bold" v-html="$options.filters.URLify(t.full_text)"></p>
        <p class="text-right">{{ t.created_at | fromNow }} · {{ t.user.name }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-icon class="mr-2">mdi-heart</v-icon>
        <span class="subheading mr-2" v-text="t.favorite_count"></span>
        <v-icon class="mr-2">mdi-share-variant</v-icon>
        <span class="subheading" v-text="t.retweet_count"></span>
      </v-card-actions>
    </v-card>

    <div v-if="loading">
      <v-card class="mb-2" outlined v-for="i in 10" :key="i">
        <v-card-text>
          <v-skeleton-loader type="text@4"></v-skeleton-loader>
          <div style="margin-left: 50%;" class="mt-5">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-icon class="mr-2">mdi-heart</v-icon>
          <span class="mr-2">
            <v-skeleton-loader width="50" type="text"></v-skeleton-loader>
          </span>
          <v-icon class="mr-2">mdi-share-variant</v-icon>
          <span>
            <v-skeleton-loader width="50" type="text"></v-skeleton-loader>
          </span>
        </v-card-actions>
      </v-card>
    </div>

    <v-btn v-if="$vuetify.breakpoint.smAndDown" text block @click="SET_TWEET_DIALOG(true)"
      >View More Tweets</v-btn
    >
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import API from '../API';

export default {
  props: ['count'],
  data: () => ({
    items: [],
    loading: false,
    maxId: null,
    endReached: false
  }),
  async mounted() {
    this.loading = true;
    const statuses = await API.getTweets({
      count: this.count || 10,
      screen_name: 'WHO',
      tweet_mode: 'extended'
    });
    this.items = statuses;
    this.maxId = statuses[statuses.length - 1].id;
    this.loading = false;
  },
  methods: {
    async loadMore() {
      if (this.endReached) return;

      if (this.maxId) {
        this.loading = true;
        const statuses = await API.getTweets({
          count: this.count || 10,
          screen_name: 'WHO',
          max_id: this.maxId,
          tweet_mode: 'extended'
        });
        statuses.splice(0, 1);
        this.items = [...this.items, ...statuses];
        if (!statuses.length) {
          this.maxId = null;
        } else {
          this.maxId = statuses[statuses.length - 1].id;
        }
        this.loading = false;
      } else {
        this.endReached = true;
      }
    },
    ...mapMutations(['SET_TWEET_DIALOG'])
  }
};
</script>

<style>
.urlify {
  text-decoration: none;
}
</style>
