<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" max-width="400" v-model="dialog">
    <v-card>
      <v-card-title>
        <span class="title font-weight-light">
          <div class="headline">搜索国家或地区</div>
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field
          @keyup="change"
          v-model="search"
          label="输入..."
          append-icon="mdi-magnify"
          clearable
        ></v-text-field>
        <v-list two-line v-if="result.length">
          <v-list-item
            @click="$emit('PLACE_SELECTED', item)"
            v-for="(item, idx) in result"
            :key="idx"
          >
            <v-list-item-content>
              <v-list-item-title>
                <span v-if="item['Province/State']">
                  {{ item['Province/State'] }}
                </span>
                <span v-else>
                  {item['CNAME'] }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle v-show="item['Province/State']">
                {{ item['CNAME'] }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div v-else>
          {{ resultText }}
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue2Filters from 'vue2-filters';

export default {
  props: ['data'],
  data: () => ({
    dialog: false,
    search: null,
    result: [],
    resultText: '结果将显示在下面.'
  }),
  methods: {
    change($e) {
      const { value } = $e.target;

      if (!value) return;
      // if (value.length < 2) return;
      this.result = this.filterBy(
        this.data,
        $e.target.value,
        'CNAME',
        'Country/Region',
        'Province/State'
      );

      if (!this.result.length) {
        this.resultText = 'No country/region or province/state found.';
      }
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.result = [];
        this.resultText = '结果将显示在下面.';
        this.search = null;
      }
    },
    search(val) {
      if (!val) {
        this.result = [];
        this.resultText = '结果将显示在下面.';
      }
    }
  },
  mixins: [Vue2Filters.mixin]
};
</script>
