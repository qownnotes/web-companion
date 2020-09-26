<template>
  <v-dialog v-model="bookmarkEditDialog" max-width="500px" @keydown.esc="closeBookmarkDialog"
            @keydown.enter="saveBookmarks">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" accesskey="b" color="primary" icon text :title="getLocale('BookmarkAllTabs')"
             @click="openBookmarkDialog">
        <v-icon>fa-arrow-circle-o-down fa-lg</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ getLocale('BookmarkAllTabs') }}</span>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex sm12 xs12>
              <v-text-field id="editedBookmarkDescription" ref="editedBookmarkDescription" v-model="editedBookmark.description"
                            clearable label="Description" tabindex="10"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeBookmarkDialog">{{ getLocale('Cancel') }}</v-btn>
        <v-btn color="blue darken-1" text @click="saveBookmarks">{{ getLocale('Save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as util from '../scripts/util';

export default {
  name: "BookmarkAllTabsButton",
  props: ['webSocket'],
  data() {
    return {
      bookmarkEditDialog: false,
      editedBookmark: {
        description: ''
      },
      defaultBookmark: {
        description: ''
      }
    }
  },
  methods: {
    getLocale(text) {
      return util.getLocale(text);
    },
    openBookmarkDialog() {
      // focus and select all the text to be able to overwrite it easily
      this.$nextTick(() => {
        const elem = document.querySelector("#editedBookmarkDescription");
        // elem.focus();
        this.$refs.editedBookmarkDescription.focus();
        elem.select();
      });
    },
    closeBookmarkDialog() {
      this.bookmarkEditDialog = false;

      // reset the dialog form
      this.$nextTick(() => this.editedBookmark = Object.assign({}, this.defaultBookmark));
    },
    saveBookmarks() {
      let that = this;
      chrome.tabs.query({currentWindow: true}, function (tabs) {
        let bookmarks = [];
        tabs.forEach(function (tab) {
          bookmarks.push({"name": tab.title, "url": tab.url, "description": that.editedBookmark.description});
        });
        const data = {type: "newBookmarks", data: bookmarks};

        that.webSocket.send(data, function () {
          console.log("Storing bookmarks:" + data);
        });

        that.closeBookmarkDialog()
      });
    }
  }
}
</script>

<style scoped>

</style>