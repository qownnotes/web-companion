<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-indigo-9">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ getLocale("popupHeadline") }}
        </q-toolbar-title>

        <div class="row header-search-bar">
          <div class="col">
            <q-select
              v-model="selectedNoteFolderId"
              emit-value
              map-options
              :loading="loadingBookmarks"
              accesskey="f"
              dark
              color="white"
              dense
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
              dense
              clearable
              dark
              color="white"
              v-model="search"
              ref="searchInput"
              accesskey="s"
              tabindex="1"
              autofocus
              :label="getLocale('popupSearchLabel')"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <PopupDrawer
      v-model="leftDrawerOpen"
      @importBrowserBookmarksClicked="importBrowserBookmarksDialog = true"
      @hideCurrentChanged="onHideCurrentChanged"
      @privateModeChanged="onPrivateModeChanged"
    />
    <q-page-container>
      <q-page v-if="!inputTokenDialog" class="flex bookmarks-page">
        <div class="q-pa-sm">
          <div class="row">
            <div class="col"></div>
            <div class="col"></div>
          </div>
          <div class="row">
            <div class="col q-pa-sm q-gutter-sm">
              <q-select
                v-model="selectedTags"
                multiple
                dense
                use-chips
                use-input
                clearable
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
            <div class="col q-pa-sm q-gutter-sm text-right">
              <q-btn
                size="sm"
                round
                color="secondary"
                icon="open_in_new"
                @click="openFilteredBookmarks"
                accesskey="o"
              >
                <q-tooltip class="bg-accent">{{
                  getLocale("OpenAllBookmarks")
                }}</q-tooltip>
              </q-btn>
              <q-btn
                size="sm"
                round
                color="secondary"
                icon="bookmarks"
                @click="bookmarkAllTabsDialog = true"
                accesskey="b"
              >
                <q-tooltip class="bg-accent">{{
                  getLocale("BookmarkAllTabs")
                }}</q-tooltip>
              </q-btn>
              <q-btn
                size="sm"
                round
                color="primary"
                icon="bookmark_add"
                @click="addBookmarkDialog = true"
                accesskey="a"
              >
                <q-tooltip class="bg-accent">{{
                  getLocale("AddBookmark")
                }}</q-tooltip>
              </q-btn>
            </div>
          </div>
          <q-separator />

          <q-table
            flat
            dense
            :rows="filteredBookmarks"
            :columns="columns"
            :loading="loadingBookmarks"
            row-key="name"
            v-model:pagination="pagination"
            class="bookmark-list"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <template v-if="props.row.name">
                  <q-td
                    key="name"
                    :props="props"
                    @click="openUrl(props.row.url)"
                    class="click"
                  >
                    <div>
                      <a
                        class="column-name"
                        :href="props.row.url"
                        @click="openUrl(props.row.url, $event)"
                        tabindex="2"
                        :accesskey="props.rowIndex + 1"
                        @keyup.enter="openUrl(props.row.url)"
                        >{{ truncateText(props.row.name, 40) }}</a
                      >
                      <q-tooltip>
                        <div class="column-name" v-if="props.row.name">
                          {{ props.row.name }}
                        </div>
                        <div>{{ props.row.url }}</div>
                        <code>{{ props.row.markdown }}</code>
                        <div
                          class="column-description"
                          v-if="props.row.description"
                        >
                          {{ props.row.description }}
                        </div>
                      </q-tooltip>
                    </div>
                  </q-td>
                  <q-td
                    key="url"
                    :props="props"
                    @click="openUrl(props.row.url)"
                    class="click"
                  >
                    <div>
                      {{ truncateText(props.row.url, 40) }}
                    </div>
                  </q-td>
                </template>
                <template v-else>
                  <q-td
                    colspan="2"
                    key="url"
                    :props="props"
                    @click="openUrl(props.row.url)"
                    class="click"
                  >
                    <div>
                      <a
                        class="column-name"
                        tabindex="2"
                        :href="props.row.url"
                        @click="openUrl(props.row.url, $event)"
                        :accesskey="props.rowIndex + 1"
                        :title="props.row.url"
                        >{{ truncateText(props.row.url, 80) }}</a
                      >
                    </div>
                  </q-td>
                </template>
                <q-td key="tags" :props="props">
                  <div class="column-tags">
                    <q-badge
                      v-for="tag in props.row.tags"
                      :key="tag"
                      :label="tag"
                    />
                  </div>
                </q-td>
                <q-td key="toolbar" :props="props" class="row-buttons">
                  <q-btn
                    v-if="props.row.markdown"
                    size="xs"
                    round
                    color="secondary"
                    icon="delete"
                    @click="deleteBookmark(props.row.markdown)"
                  >
                    <q-tooltip class="bg-accent">{{
                      getLocale("DeleteBookmark")
                    }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="props.row.markdown"
                    size="xs"
                    round
                    color="secondary"
                    icon="edit"
                    @click="editBookmark(props.row.markdown)"
                  >
                    <q-tooltip class="bg-accent">{{
                      getLocale("EditBookmark")
                    }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-page>
      <InputTokenDialog
        v-if="inputTokenDialog"
        @token-stored="closeWindow"
        @cancel="closeWindow"
      />
      <AddBookmarkDialog
        v-model="addBookmarkDialog"
        :bookmark="editedBookmark"
        :webSocket="webSocket"
        @bookmark-stored="onBookmarkStored"
      />
      <EditBookmarkDialog
        v-model="editBookmarkDialog"
        :markdown="editBookmarkMarkdown"
        :webSocket="webSocket"
        @bookmark-edited="onBookmarkEdited"
      />
      <BookmarkAllTabsDialog
        v-model="bookmarkAllTabsDialog"
        :webSocket="webSocket"
        @bookmarksStored="onBookmarksStored"
      />
      <ImportBrowserBookmarksDialog
        v-model="importBrowserBookmarksDialog"
        :webSocket="webSocket"
        @bookmarksImported="onBookmarksImported"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { getLocale, openPrivateUrl, truncateText } from "../helpers/utils";
import { QWebSocket } from "../services/qwebsocket";
import InputTokenDialog from "../components/InputTokenDialog.vue";
import AddBookmarkDialog from "components/AddBookmarkDialog.vue";
import EditBookmarkDialog from "components/EditBookmarkDialog.vue";
import { Notify, useQuasar } from "quasar";
import BookmarkAllTabsDialog from "components/BookmarkAllTabsDialog.vue";
import ImportBrowserBookmarksDialog from "components/ImportBrowserBookmarksDialog.vue";
import PopupDrawer from "components/PopupDrawer.vue";

const columns = [
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  { name: "url", align: "left", label: "Url", field: "url", sortable: true },
  { name: "tags", align: "left", label: "Tags", field: "tags", sortable: true },
  { name: "toolbar", align: "left" },
];

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const privateMode = ref(false);
    const hideCurrent = ref(false);
    let bookmarks = ref([]);
    let loadingBookmarks = ref(false);
    let search = ref("");
    let noteFolderName = ref("");
    let noteFolders = ref([]);
    let selectedNoteFolderId = ref(null);
    let selectedNoteFolderIdWatchEnabled = true;
    let addBookmarkDialog = ref(false);
    let editBookmarkDialog = ref(false);
    let bookmarkAllTabsDialog = ref(false);
    let editBookmarkMarkdown = ref("");
    const pagination = ref({
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 10,
      initialSetup: true,
    });
    const editedBookmark = reactive({
      name: "",
      url: "",
      description: "",
    });
    const defaultBookmark = reactive({
      name: "",
      url: "",
      description: "",
    });
    let selectedTags = ref([]);
    let webSocket = ref(new QWebSocket());
    const importBrowserBookmarksDialog = ref(false);
    // import { defineProps } from 'vue';
    // const { foo } = defineProps(['foo']);
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
      if (selectedTags.value && selectedTags.value.length > 0) {
        filteredBookmarks1 = filteredBookmarks1.filter((bookmark) => {
          return selectedTags.value.every((elem) =>
            bookmark.tags.includes(elem),
          );
        });
      }

      let filteredBookmarks2 = filteredBookmarks1;

      // filter by all parts of the search text
      if (search.value !== undefined && search.value !== null) {
        filteredBookmarks2 = [];
        const searchParts = search.value.toLowerCase().trim().split(" ");
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
        const needle = val.toLocaleLowerCase();

        filteredTags.value = allTags.value.filter(
          (v) => v.toLocaleLowerCase().indexOf(needle) > -1,
        );
      });
    };

    const openFilteredBookmarks = () => {
      filteredBookmarks.value.forEach((item) => {
        if (item.url) {
          openUrl(item.url);
        }
      });
    };

    const onBookmarkStored = () => {
      addBookmarkDialog.value = false;
      loadBookmarks();
    };

    const onBookmarkEdited = () => {
      editBookmarkDialog.value = false;
      loadBookmarks();
    };

    const onBookmarksStored = () => {
      bookmarkAllTabsDialog.value = false;
      loadBookmarks();
    };

    const onBookmarksImported = () => {
      importBrowserBookmarksDialog.value = false;
      loadBookmarks();
    };

    const onHideCurrentChanged = (value) => {
      hideCurrent.value = value;
      loadBookmarks();
    };

    const onPrivateModeChanged = (value) => {
      privateMode.value = value;
    };

    const deleteBookmark = (markdown) => {
      $q.dialog({
        title: getLocale("DeleteBookmarkConfirmTitle"),
        message: `${getLocale("DeleteBookmarkConfirmMessage")}<br><br><code style="display: block; overflow-x: auto">${markdown}</code>`,
        html: true,
        cancel: true,
        persistent: true,
      }).onOk(() => {
        const data = { type: "deleteBookmark", data: { markdown: markdown } };
        webSocket.value.send(data, function () {
          console.log("Deleting bookmark:" + data);
          loadBookmarks();
        });
      });
    };

    const editBookmark = (markdown) => {
      console.log("markdown", markdown);
      editBookmarkMarkdown.value = markdown;
      editBookmarkDialog.value = true;
    };

    const openUrl = (url, event) => {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }

      if (privateMode.value) {
        openPrivateUrl(url);
      } else {
        chrome.tabs.create({ url });
      }
    };

    const searchInput = ref(null);

    onMounted(() => {
      chrome.storage.sync.get((data) => {
        search.value = data.search || "";
        privateMode.value = data.privateMode || false;
        hideCurrent.value = data.hideCurrent || false;
        loadBookmarks();

        // Select the text in the search input field after it was updated by the data from the storage
        nextTick(() => searchInput.value.select());
      });

      webSocket.value = new QWebSocket((event) => {
        const data = event.data;

        if (typeof data === "string" || data instanceof String) {
          // create a JSON object
          const jsonObject = JSON.parse(data);
          const type = jsonObject.type;

          console.log("Got a new message: " + jsonObject);
          console.log("type", type);

          if (type === "bookmarks") {
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
              console.log("data.pagination", data.pagination);
              if (data.pagination) {
                pagination.value = data.pagination;
                pagination.value.page = 1;
              }

              let localSelectedTags = [];
              const tags = allTags.value;
              const dataSelectedTags = Object.values(data.selectedTags || []);

              // check if we can add stored selected tags
              if (
                data.selectedTags !== undefined &&
                dataSelectedTags.length > 0 &&
                tags.length > 0
              ) {
                dataSelectedTags.forEach((tag) => {
                  if (tags.indexOf(tag) > -1) {
                    localSelectedTags.push(tag);
                  }
                });
              }

              selectedTags.value = localSelectedTags;
            });
          } else if (type === "switchedNoteFolder") {
            if (jsonObject.data === false) {
              loadingBookmarks.value = false;
            }
          } else if (type === "flashMessage") {
            Notify.create(jsonObject.message);
          } else if (type === "tokenQuery") {
            inputTokenDialog.value = true;
          }
        }
      });

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
        const data = {
          type: "switchNoteFolder",
          data: newFolderId,
          hideCurrent: hideCurrent.value,
        };
        webSocket.value.send(data, function () {
          console.log("Switching to note folder:" + data);
        });
      });
    });

    watch(pagination, (newPagination, oldPagination) => {
      // Ignore the first change of pagination, because it was done by the reference initialization
      if (newPagination && newPagination.initialSetup) {
        newPagination.initialSetup = false;
        return;
      }

      chrome.storage.sync.set({
        pagination: newPagination,
      });
      // console.log("newPagination", newPagination);
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

      const data = { type: "getBookmarks", hideCurrent: hideCurrent.value };
      webSocket.value.send(data, function () {
        console.log("Loading bookmarks:" + data);
      });
    };

    const closeWindow = () => {
      window.close();
    };

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    // Return the variables that you want to use in the template
    return {
      leftDrawerOpen,
      privateMode,
      hideCurrent,
      toggleLeftDrawer,
      columns,
      bookmarks,
      loadingBookmarks,
      search,
      searchInput,
      noteFolderName,
      noteFolders,
      selectedNoteFolderId,
      addBookmarkDialog,
      editBookmarkDialog,
      bookmarkAllTabsDialog,
      onBookmarkStored,
      onBookmarkEdited,
      onBookmarksStored,
      onBookmarksImported,
      onHideCurrentChanged,
      onPrivateModeChanged,
      editedBookmark,
      editBookmarkMarkdown,
      defaultBookmark,
      pagination,
      selectedTags,
      webSocket,
      importBrowserBookmarksDialog,
      inputTokenDialog,
      allTags,
      filteredBookmarks,
      openUrl,
      deleteBookmark,
      editBookmark,
      loadBookmarks,
      closeWindow,
      tagFilterFn,
      filteredTags,
      openFilteredBookmarks,
    };
  },
  components: {
    PopupDrawer,
    AddBookmarkDialog,
    EditBookmarkDialog,
    BookmarkAllTabsDialog,
    ImportBrowserBookmarksDialog,
    InputTokenDialog,
  },
  methods: { getLocale, truncateText },
});

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
.header-search-bar {
  margin-top: 10px;
  display: flex;
  gap: 20px;
}

.bookmarks-page {
  min-width: 550px;
  min-height: 300px;

  > div {
    width: 100%;
  }
}

.bookmark-list {
  font-size: 1.5em;
  td.click {
    cursor: pointer;
  }
  a {
    color: black;
  }
}

.q-table tbody td {
  //font-size: 14px;
}

.column-name {
  font-weight: bold;
  text-decoration: none;
}

.column-description {
  font-style: italic;
}

.column-tags {
  display: flex;
  gap: 5px;
}

code.scroll {
  overflow: auto;
  display: block;
  white-space: pre;
  word-wrap: break-word;
}

.row-buttons {
  display: flex;
  gap: 5px;
}
</style>
