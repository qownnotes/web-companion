<template>
  <div id="app">
    <v-app id="popup">
      <v-navigation-drawer
          v-model="menuDrawer"
          absolute
          dark
          clipped
          temporary
          width="280"
      >
        <v-list>
          <v-list-item tag="div">
            <v-list-item-content>
              <v-list-item-title>{{ getLocale('Menu') }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click.stop="menuDrawer = !menuDrawer">
                <v-icon>fa-chevron-left</v-icon>
                <!--<font-awesome-icon icon="fa-chevron-left" />-->
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-list dense>
          <v-divider light></v-divider>

          <v-list-item
              v-for="item in drawerItems"
              :key="item.title"
              @click.stop="item.dialog"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar class="flex-grow-0" dark height="56">
        <v-app-bar-nav-icon @click.stop="menuDrawer = !menuDrawer"></v-app-bar-nav-icon>
        <v-card-title
            style="white-space: nowrap"
            v-html="getLocale('popupHeadline')"
        />
        <v-select
            accesskey="f"
            v-model="selectedNoteFolderId"
            :items="noteFolders"
            :label="getLocale('NoteFolder')"
            style="padding-right: 20px; margin-top: 21px;"
            single-line
        ></v-select>
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            ref="searchText"
            id="searchText"
            tabindex="1"
            append-icon="fa-search"
            accesskey="s"
            :label="getLocale('popupSearchLabel')"
            single-line
            hide-details
            clearable
        ></v-text-field>
      </v-app-bar>

      <v-toolbar class="flex-grow-0" text color="white">
        <v-autocomplete
            v-model="selectedTags"
            accesskey="t"
            :items="allTags"
            multiple
            small-chips
            single-line
            hide-details
            deletable-chips
            clearable
            :label="getLocale('Tags')"
        >
        </v-autocomplete>
        <v-snackbar
            v-model="snackbar"
            color="success"
            top
        >
          {{ snackbarText }}
          <v-btn
              text
              @click="snackbar = false"
          >
            {{ getLocale('Close') }}
          </v-btn>
        </v-snackbar>
        <!--<v-toolbar-title>name</v-toolbar-title>-->
        <!--<v-divider-->
        <!--class="mx-2"-->
        <!--inset-->
        <!--vertical-->
        <!--&gt;</v-divider>-->
        <v-spacer></v-spacer>
        <v-btn @click="openAllVisibleBookmarks" accesskey="o" color="primary" text icon
               :title="getLocale('OpenAllBookmarks')">
          <v-icon>fa-external-link fa-lg</v-icon>
        </v-btn>
        <BookmarkAllTabsButton @bookmarksCreated="loadBookmarks" v-bind:webSocket="this.webSocket"></BookmarkAllTabsButton>
        <v-dialog v-model="bookmarkEditDialog" @keydown.esc="closeBookmarkDialog" @keydown.enter="saveBookmark"
                  max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-on="on" v-bind="attrs" accesskey="a" color="primary" text icon
                   :title="getLocale('AddBookmark')">
              <v-icon>fa-plus fa-lg</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ getLocale('NewBookmark') }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-text-field ref="editedBookmarkName" id="editedBookmarkName" tabindex="10"
                                  v-model="editedBookmark.name" :label="getLocale('LinkName')" clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field tabindex="12" v-model="editedBookmark.description" :label="getLocale('Description')"
                                  clearable></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12>
                    <v-text-field tabindex="11" v-model="editedBookmark.url" :label="getLocale('URL')" clearable></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeBookmarkDialog">{{ getLocale('Cancel') }}</v-btn>
              <v-btn color="blue darken-1" text @click="saveBookmark">{{ getLocale('Save') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <v-data-table
          :headers="headers"
          :items="filteredBookmarks"
          :loading="loadingBookmarks"
          :options.sync="tableOptions"
          :footer-props="{'items-per-page-options': [10,25,50,75,100,-1], showFirstLastPage: true}"
          id="bookmark-list"
          class="elevation-1 bookmark-list flex-grow-1"
          dense
      >
        <template v-slot:item="props">
          <tr @click="openUrl(props.item.url)">
            <td v-if="props.item.name" class="text-no-wrap">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <strong v-bind="attrs" v-on="on">
                    <a tabindex="2" :href="props.item.url" :accesskey="props.index + 1" target="_blank"
                       @click="$event.stopPropagation()">{{ props.item.name | truncate(40, '…') }}</a>
                  </strong>
                </template>
                <span>
                  <template v-if="props.item.name"><strong>{{ props.item.name }}</strong><br/></template>
                  {{ props.item.url }}
                  <template v-if="props.item.description"><br/><em>{{ props.item.description }}</em></template>
                </span>
              </v-tooltip>
            </td>
            <td v-if="props.item.name">{{ props.item.url | truncate(40, '…') }}</td>
            <td v-if="props.item.name === ''" colspan="2" class="text-no-wrap">
              <a tabindex="2" @click="$event.stopPropagation()" :accesskey="props.index + 1" :href="props.item.url"
                 target="_blank" :title="props.item.url">{{ props.item.url | truncate(80, '…') }}</a>
            </td>
            <td class="link-tags">
              <span class="tag" v-for="tag in props.item.tags">{{ tag }}</span>
            </td>
          </tr>
        </template>
      </v-data-table>

      <ImportBrowserBookmarksDialog v-model="importBrowserBookmarksDialog"
                                    v-bind:webSocket="this.webSocket"></ImportBrowserBookmarksDialog>
      <InputTokenDialog v-model="inputTokenDialog" v-bind:webSocket="this.webSocket"
                        v-on:input="onInputTokenDialogClose"></InputTokenDialog>
    </v-app>
  </div>
</template>
<script>
import * as util from '../scripts/util';
import * as ws from '../scripts/services/qwebsocket';
import BookmarkAllTabsButton from '../components/bookmark-all-tabs-button'
import ImportBrowserBookmarksDialog from '../components/import-browser-bookmarks-dialog'
import InputTokenDialog from '../components/input-token-dialog'

export default {
  components: {
    BookmarkAllTabsButton: BookmarkAllTabsButton,
    ImportBrowserBookmarksDialog: ImportBrowserBookmarksDialog,
    InputTokenDialog: InputTokenDialog
  },
  methods: {
    toggleImportBrowserBookmarksDialog() {
      this.importBrowserBookmarksDialog = !this.importBrowserBookmarksDialog;
    },
    getLocale(text) {
      return util.getLocale(text);
    },
    loadBookmarks() {
      this.loadingBookmarks = true;

      const data = {type: "getBookmarks"};
      this.webSocket.send(data, function () {
        console.log("Loading bookmarks:" + data);
      });
    },
    openUrl(url) {
      chrome.tabs.create({url: url});
    },
    openAllVisibleBookmarks() {
      document.querySelectorAll("#bookmark-list tr a").forEach((item) => {
        this.openUrl(item.getAttribute("href"));
      });
    },
    closeBookmarkDialog() {
      this.bookmarkEditDialog = false;

      // reset the dialog form
      this.$nextTick(() => this.editedBookmark = Object.assign({}, this.defaultBookmark));
    },
    saveBookmark() {
      const data = {type: "newBookmarks", data: [this.editedBookmark]};
      const that = this;
      this.webSocket.send(data, function () {
        console.log("Storing bookmark:" + data);
        that.loadBookmarks();
      });
      this.closeBookmarkDialog()
    },
    onInputTokenDialogClose() {
      window.close();
    }
  },
  data() {
    return {
      headers: [
        {text: 'Name', align: 'left', value: 'name'},
        {text: 'Url', align: 'left', value: 'url'},
        {text: 'Tags', value: 'tags'},
      ],
      bookmarks: [],
      loadingBookmarks: false,
      search: '',
      noteFolderName: '',
      noteFolders: [],
      selectedNoteFolderId: null,
      selectedNoteFolderIdWatchEnabled: true,
      bookmarkEditDialog: false,
      editedBookmark: {
        name: '',
        url: '',
        description: ''
      },
      defaultBookmark: {
        name: '',
        url: '',
        description: ''
      },
      tableOptions: {
        itemsPerPage: 10
      },
      selectedTags: [],
      webSocket: null,
      snackbar: false,
      snackbarText: '',
      menuDrawer: null,
      importBrowserBookmarksDialog: false,
      drawerItems: [
        {
          title: this.getLocale('ImportBrowserBookmarks'),
          icon: 'fa-download',
          dialog: this.toggleImportBrowserBookmarksDialog
        }
      ],
      inputTokenDialog: false
    }
  },
  mounted() {
    let that = this;
    this.$refs.searchText.focus();

    chrome.storage.sync.get(function (data) {
      that.search = data.search;

      // select all the text to be able to overwrite it easily
      that.$nextTick(() => document.querySelector("#searchText").select());
    });

    this.webSocket = new ws.QWebSocket(function (event) {
      const data = event.data;

      if (typeof data === 'string' || data instanceof String) {
        // create a JSON object
        const jsonObject = JSON.parse(data);
        const type = jsonObject.type;

        // console.log("Got a new message: " + data);
        // console.log("Got a new message: " + jsonObject);
        // console.log(jsonObject.type);

        if (type === "bookmarks") {
          that.bookmarks = jsonObject.data;
          that.noteFolderName = jsonObject.noteFolderName;
          that.noteFolders = jsonObject.noteFolders;
          that.selectedNoteFolderIdWatchEnabled = false;
          that.selectedNoteFolderId = jsonObject.noteFolderId;
          that.selectedNoteFolderIdWatchEnabled = true;
          that.loadingBookmarks = false;

          chrome.storage.sync.get(function (data) {
            // console.log("after load");
            // console.log(that.tableOptions.page);
            that.tableOptions.page = data.tableOptions.page;
            that.selectedTags = [];
            const tags = that.allTags;

            // check if we can add stored selected tags
            if (data.selectedTags !== undefined && data.selectedTags.length > 0 && tags.length > 0) {
              data.selectedTags.forEach(function (tag) {
                if (tags.indexOf(tag) > -1) {
                  that.selectedTags.push(tag);
                }
              });
            }
          });
        } else if (type === "switchedNoteFolder") {
          if (jsonObject.data === false) {
            that.loadingBookmarks = false;
          }
        } else if (type === "flashMessage") {
          that.snackbar = true;
          that.snackbarText = jsonObject.message;
        } else if (type === "tokenQuery") {
          that.inputTokenDialog = true;
        }
      }
    });

    this.loadBookmarks();

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      that.defaultBookmark.name = tabs[0].title;
      that.editedBookmark.name = tabs[0].title;
      that.defaultBookmark.url = tabs[0].url;
      that.editedBookmark.url = tabs[0].url;
    });
  },
  watch: {
    search: function (val, oldVal) {
      chrome.storage.sync.set({
        search: val
      });
    },
    selectedTags: function (val, oldVal) {
      chrome.storage.sync.set({
        selectedTags: val
      });
    },
    // this seems to be also executed when the popup disappears and reset the values that way
    tableOptions: function (val, oldVal) {
      // console.log("tableOptions watch");
      // console.log(val.page);
      chrome.storage.sync.set({
        tableOptions: val
      });
    },
    bookmarkEditDialog(val) {
      if (val) {
        this.$nextTick(() => {
          // doesn't seem to work
          this.$refs.editedBookmarkName.focus();
          document.querySelector("#editedBookmarkName").select();
        });
      }

      val || this.closeBookmarkDialog()
    },
    selectedNoteFolderId(val) {
      if (!this.selectedNoteFolderIdWatchEnabled) {
        return;
      }

      const data = {type: "switchNoteFolder", data: val};
      this.loadingBookmarks = true;
      this.webSocket.send(data, function () {
        console.log("Switching to note folder:" + data);
      });
    }
  },
  computed: {
    // creates a list of all tags of bookmarks
    allTags: function () {
      let allTags = [];

      this.bookmarks.forEach(function (bookmark) {
        bookmark.tags.forEach(function (tag) {
          if (allTags.indexOf(tag) === -1) {
            allTags.push(tag);
          }
        });
      });

      return allTags.sort();
    },
    // creates a list of all bookmarks filtered by selectedBookmarks
    filteredBookmarks: function () {
      let filteredBookmarks = this.bookmarks;
      let that = this;

      // filter by tags
      if (this.selectedTags.length > 0) {
        filteredBookmarks = [];

        this.bookmarks.forEach(function (bookmark) {
          if (that.selectedTags.every(elem => bookmark.tags.indexOf(elem) > -1)) {
            filteredBookmarks.push(bookmark);
          }
        });
      }

      let filteredBookmarks2 = filteredBookmarks;

      // filter by all parts of the search text
      if (this.search !== undefined && this.search !== null && this.search !== '') {
        filteredBookmarks2 = [];
        const search = this.search.toLocaleLowerCase().trim();
        const searchParts = search.split(' ');
        const searchPartsLength = searchParts.length;
        let searchCount;

        filteredBookmarks.forEach((bookmark) => {
          searchCount = 0;

          searchParts.forEach((searchPart) => {
            if (bookmark.name.toLowerCase().indexOf(searchPart) !== -1 ||
                bookmark.url.toLowerCase().indexOf(searchPart) !== -1 ||
                bookmark.description.toLowerCase().indexOf(searchPart) !== -1) {
              searchCount++;
            }
          });

          if (searchCount === searchPartsLength) {
            filteredBookmarks2.push(bookmark);
          }
        });
      }

      return filteredBookmarks2;
    }
  }
};
</script>
<style scoped>
#app {
  min-width: 650px;
  min-height: 500px;
}

.bookmark-list {
  margin-top: 18px;
}

.bookmark-list a {
  color: black;
  text-decoration: none;
}

.bookmark-list td {
  cursor: pointer;
}

.bookmark-list span.tag {
  background: #444;
  padding: 3px;
  color: white;
  border-radius: 5px;
  margin: 1px;
  display: inline-block;
  font-size: 0.8em;
}

.bookmark-list table.v-table tr {
  height: 30px;
}

.bookmark-list table.v-table tbody td, .bookmark-list table.v-table tbody th, .bookmark-list table.v-table thead th, .bookmark-list table.v-table tbody td:first-child, .bookmark-list table.v-table thead th:first-child {
  height: 30px;
  padding: 0 10px;
}

.bookmark-list table.v-table tbody td span, .bookmark-list table.v-table tbody th span, .bookmark-list table.v-table thead th span, .bookmark-list table.v-table tbody td:first-child span, .bookmark-list table.v-table thead th:first-child span {
  line-height: 3em;
  display: inline-block;
}

.bookmark-list table.v-table tbody td.link-tags {
  white-space: nowrap;
}

.bookmark-list table.v-table tbody td.link-tags span {
  line-height: inherit;
}

.bookmark-list table.v-table tbody td.link-tags span::first-letter {
  /*display: none;*/
  /*color: red;*/
}
</style>
