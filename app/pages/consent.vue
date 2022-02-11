<template>
  <div id="app">
    <v-app id="popup">
      <v-app-bar class="flex-grow-0" dark height="56">
        <v-card-title
            style="white-space: nowrap"
        >QOwnNotes Web Companion</v-card-title>
      </v-app-bar>

      <v-sheet
          class="overflow-y-auto"
          max-height="480"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ getLocale('ConsentHeadline') }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex sm12 xs12>
                  <p>
                    {{ getLocale('appDescription') }}
                  </p>
                  <p>
                    {{ getLocale('ConsentIntro') }}
                  </p>
                  <ul>
                    <li>{{ getLocale('ConsentData1') }}</li>
                    <li>{{ getLocale('ConsentData2') }}</li>
                    <li>{{ getLocale('ConsentData3') }}</li>
                    <li>{{ getLocale('ConsentData4') }}</li>
                  </ul>
                  <p>
                    {{ getLocale('ConsentFooter') }}
                  </p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="doConsent">{{ getLocale('ConsentButton') }}</v-btn>
            <v-btn color="blue darken-1" text @click="doUninstall">{{ getLocale('UninstallButton') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-app>
  </div>
</template>
<script>
import * as util from '../scripts/util';

export default {
  methods: {
    getLocale(text) {
      return util.getLocale(text);
    },
    doConsent() {
      chrome.storage.sync.set({
        userDataConsent: true,
      });

      window.close();
    },
    doUninstall() {
      chrome.management.uninstallSelf({
        showConfirmDialog: true
      });
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  watch: {

  },
  computed: {

  }
};
</script>
<style scoped>
#app {
  min-width: 650px;
  min-height: 500px;
}

ul {
  margin: 20px 0;
}
</style>
