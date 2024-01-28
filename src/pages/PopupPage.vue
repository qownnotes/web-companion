<template>
  <q-page v-if="!inputTokenDialog" class="flex bookmarks-page">
    <div class="q-pa-md">
      <div class="row">
        <div class="col">
          <q-select
            v-model="selectedNoteFolderId"
            emit-value
            map-options
            :loading="loadingBookmarks"
            accesskey="f"
            option-value="value"
            option-label="text"
            :options="noteFolders"
            :label="getLocale('NoteFolder')"
          >
            <template v-slot:prepend>
              <q-icon name="folder" />
            </template>
          </q-select>
        </div>
        <div class="col">
          <q-input
            bottom-slots
            dense clearable
            v-model="search"
            accesskey="s"
            autofocus
            :label="getLocale('popupSearchLabel')"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-select
            v-model="selectedTags"
            multiple
            use-chips
            use-input
            input-debounce="100"
            @filter="tagFilterFn"
            @input-value="allTags"
            accesskey="t"
            :loading="loadingBookmarks"
            :options="filteredTags"
            :label="getLocale('Tags')"
          >
            <template v-slot:prepend>
              <q-icon name="tag" />
            </template>
          </q-select>
        </div>
        <div class="col">

        </div>
      </div>

      <q-table
        flat bordered
        :rows="filteredBookmarks"
        :columns="columns"
        :loading="loadingBookmarks"
        row-key="name"
        class="bookmark-list"
      >
        <template v-slot:body="props">
          <q-tr :props="props" @click="openUrl(props.row.url)">
            <q-td v-if="props.row.name" key="name" :props="props">
              <div>
                <div class="column-name">{{ truncateText( props.row.name, 40 ) }}</div>
                <q-tooltip>
                  <div class="column-name" v-if="props.row.name">{{ props.row.name }}</div>
                  <div>{{ props.row.url }}</div>
                  <div class="column-description" v-if="props.row.description">{{ props.row.description }}</div>
                </q-tooltip>
              </div>
            </q-td>
            <q-td v-if="props.row.name" key="url" :props="props">
              <div>
                {{ truncateText( props.row.url, 40 ) }}
              </div>
            </q-td>
            <q-td v-if="props.row.name === ''" colspan="2" key="url" :props="props">
              <div>
                <a tabindex="2" :href="props.row.url" @click="$event.stopPropagation()" :accesskey="props.rowIndex + 1" target="_blank" :title="props.row.url">{{ truncateText( props.row.url, 80 ) }}</a>
              </div>
            </q-td>
            <q-td key="tags" :props="props">
              <div class="column-tags">
                <q-badge color="purple" v-for="tag in props.row.tags" :key="tag" :label="tag" />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
  <InputTokenDialog v-if="inputTokenDialog" @token-stored="closeWindow" @cancel="closeWindow" />
</template>

<script>
import {computed, defineComponent, onMounted, reactive, ref, watch} from 'vue'
import { getLocale, openUrl, truncateText } from '../helpers/utils'
import * as ws from '../services/qwebsocket'
import InputTokenDialog from '../components/InputTokenDialog.vue'

const columns = [
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'url', align: 'left', label: 'Url', field: 'url', sortable: true },
  { name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true }
]

export default defineComponent({
  setup () {
    let bookmarks = ref([]);
    let loadingBookmarks = ref(false);
    let search = ref('');
    let noteFolderName = ref('');
    let noteFolders = ref([]);
    let selectedNoteFolderId = ref(null);
    let selectedNoteFolderIdWatchEnabled = true;
    const bookmarkEditDialog = ref(false);
    const editedBookmark = reactive({
      name: '',
      url: '',
      description: ''
    });
    const defaultBookmark = reactive({
      name: '',
      url: '',
      description: ''
    });
    const tableOptions = reactive({
      itemsPerPage: 10
    });
    let selectedTags = ref([]);
    let webSocket = null;
    const snackbar = ref(false);
    const snackbarText = ref('');
    const menuDrawer = ref(null);
    const importBrowserBookmarksDialog = ref(false);
    // const drawerItems = reactive([
    //   {
    //     title: this.getLocale('ImportBrowserBookmarks'),
    //     icon: 'fa-download',
    //     dialog: this.toggleImportBrowserBookmarksDialog
    //   },
    //   {
    //     title: this.getLocale('WebClipper'),
    //     icon: 'fa-info-circle',
    //     dialog: this.openWebClipperDocumentation
    //   }
    // ]);
    const inputTokenDialog = ref(false);

    // Creates a list of all tags of bookmarks
    // Returns a sorted list of all tags
    const allTags = computed(() => {
      let tags = [];

      bookmarks.value.forEach((bookmark) => {
        bookmark.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      });

      return tags.sort();
    });

    let filteredTags = ref(allTags.value);

    // Creates a list of all bookmarks filtered by the selected tags
    const filteredBookmarks = computed(() => {
      let filteredBookmarks1 = bookmarks.value.slice(); // Copy bookmarks array

      // filter by tags
      if (selectedTags.value.length > 0) {
        filteredBookmarks1 = filteredBookmarks1.filter((bookmark) => {
          return selectedTags.value.every((elem) => bookmark.tags.includes(elem));
        });
      }

      let filteredBookmarks2 = filteredBookmarks1;

      // filter by all parts of the search text
      if (search.value !== undefined && search.value !== null) {
        filteredBookmarks2 = [];
        const searchParts = search.value.toLowerCase().trim().split(' ');
        const searchPartsLength = searchParts.length;

        filteredBookmarks1.forEach((bookmark) => {
          let searchCount = 0;

          searchParts.forEach((searchPart) => {
            if (
              bookmark.name.toLowerCase().includes(searchPart) ||
              bookmark.url.toLowerCase().includes(searchPart) ||
              bookmark.description.toLowerCase().includes(searchPart)
            ) {
              searchCount++;
            }
          });

          if (searchCount === searchPartsLength) {
            filteredBookmarks2.push(bookmark);
          }
        });
      }

      return filteredBookmarks2;
    });

    const tagFilterFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase()

        filteredTags.value = allTags.value.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
      })
    };

    onMounted(() => {
      // let that = this;
      // this.$refs.searchText.focus();

      chrome.storage.sync.get((data) => {
        search.value = data.search;

        // select all the text to be able to overwrite it easily
        // that.$nextTick(() => document.querySelector("#searchText").select());
      });

      webSocket = new ws.QWebSocket((event) => {
        const data = event.data;

        if (typeof data === 'string' || data instanceof String) {
          // create a JSON object
          const jsonObject = JSON.parse(data);
          const type = jsonObject.type;

          console.log("Got a new message: " + jsonObject);
          console.log("type", type);

          if (type === 'bookmarks') {
            bookmarks.value = jsonObject.data;
            console.log("bookmarks", bookmarks);
            noteFolderName.value = jsonObject.noteFolderName;
            noteFolders.value = jsonObject.noteFolders;
            selectedNoteFolderIdWatchEnabled = false;
            selectedNoteFolderId.value = jsonObject.noteFolderId;
            selectedNoteFolderIdWatchEnabled = true;
            loadingBookmarks.value = false;

            chrome.storage.sync.get((data) => {
              // console.log("after load");
              // console.log(that.tableOptions.page);
              // tableOptions.page = data.tableOptions.page;
              let localSelectedTags = [];
              const tags = allTags.value;
              const dataSelectedTags = Object.values(data.selectedTags);

              // check if we can add stored selected tags
              if (data.selectedTags !== undefined && dataSelectedTags.length > 0 && tags.length > 0) {
                dataSelectedTags.forEach((tag) => {
                  if (tags.indexOf(tag) > -1) {
                    localSelectedTags.push(tag);
                  }
                });
              }

              selectedTags.value = localSelectedTags;
            });
          } else if (type === 'switchedNoteFolder') {
            if (jsonObject.data === false) {
              loadingBookmarks.value = false;
            }
          } else if (type === 'flashMessage') {
            snackbar.value = true;
            snackbarText.value = jsonObject.message;
          } else if (type === 'tokenQuery') {
            inputTokenDialog.value = true;
          }
        }
      });

      loadBookmarks();

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        defaultBookmark.name = tabs[0].title;
        editedBookmark.name = tabs[0].title;
        defaultBookmark.url = tabs[0].url;
        editedBookmark.url = tabs[0].url;
      });

      // Watch for changes in selectedNoteFolderId
      watch(selectedNoteFolderId, (newFolderId, oldFolderId) => {
        if (!selectedNoteFolderIdWatchEnabled) {
          return;
        }

        loadingBookmarks.value = true;
        const data = {type: "switchNoteFolder", data: newFolderId};
        webSocket.send(data, function () {
          console.log("Switching to note folder:" + data);
        });
      });
    });

    watch(search, (newSearch, oldSearch) => {
      chrome.storage.sync.set({ search: newSearch });
    });

    watch(selectedTags, (newSelectedTags, oldSelectedTags) => {
      chrome.storage.sync.set({ selectedTags: newSelectedTags });
      console.log("selectedTags stored", newSelectedTags);
    });

    const loadBookmarks = () => {
      loadingBookmarks.value = true;

      const data = {type: "getBookmarks"};
      webSocket.send(data, function () {
        console.log("Loading bookmarks:" + data);
      });
    }

    const closeWindow = () => {
      window.close();
    }

    // Return the variables that you want to use in the template
    return {
      columns,
      getLocale,
      bookmarks,
      loadingBookmarks,
      search,
      noteFolderName,
      noteFolders,
      selectedNoteFolderId,
      bookmarkEditDialog,
      editedBookmark,
      defaultBookmark,
      tableOptions,
      selectedTags,
      webSocket,
      snackbar,
      snackbarText,
      menuDrawer,
      importBrowserBookmarksDialog,
      // drawerItems,
      inputTokenDialog,
      allTags,
      filteredBookmarks,
      truncateText,
      openUrl,
      loadBookmarks,
      closeWindow,
      tagFilterFn,
      filteredTags
    };
  },
  components: {
    // BookmarkAllTabsButton: BookmarkAllTabsButton,
    // ImportBrowserBookmarksDialog: ImportBrowserBookmarksDialog,
    InputTokenDialog
  }
})

// export default defineComponent({
//   name: 'IndexPage',
//   columns: columns,
//   filteredBookmarks: () => {
//     return [ {
//       name: 'Treats',
//       calories: 296,
//       fat: 16,
//       carbs: 24,
//       protein: 4,
//     } ];
//   },
// })
</script>

<style scoped>
.bookmarks-page {
  min-width: 500px;

  > div {
    width: 100%;
  }
}

.bookmark-list tr {
  cursor: pointer;
}

.column-name {
  font-weight: bold;
}

.column-description {
  font-style: italic;
}

.column-tags {
  display: flex;
  gap: 5px;
}
</style>
