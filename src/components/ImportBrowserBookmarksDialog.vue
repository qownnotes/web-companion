<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ getLocale("ImportBrowserBookmarks") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ getLocale("ImportAllBrowserBookmarks") }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="getLocale('Cancel')"
          tabindex="2"
          v-close-popup
          @click="$emit('cancel')"
        />
        <q-btn
          flat
          :label="getLocale('Import')"
          color="primary"
          tabindex="1"
          @click="importBookmarks"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getLocale } from "src/helpers/utils";
import { defineComponent, ref } from "vue";
import { QWebSocket } from "src/services/qwebsocket";
import { Notify } from "quasar";

export default defineComponent({
  name: "ImportBrowserBookmarksDialog",
  methods: { getLocale },
  props: {
    model: {
      type: Boolean,
      default: false,
    },
    webSocket: {
      type: QWebSocket,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dialog = ref(props.model);

    const importBookmarks = () => {
      let bookmarks = [];

      const addBookmark = (bookmarkItem) => {
        // Chrome has no bookmarkItem.type
        if (
          bookmarkItem.url &&
          (bookmarkItem.type === "bookmark" || !bookmarkItem.type)
        ) {
          bookmarks.push({
            name: bookmarkItem.title,
            url: bookmarkItem.url,
            description: "",
          });
        }

        if (bookmarkItem.children) {
          let child;
          for (child of bookmarkItem.children) {
            addBookmark(child);
          }
        }
      };

      const addBookmarks = (bookmarkItems) => {
        addBookmark(bookmarkItems[0]);

        const data = { type: "newBookmarks", data: bookmarks };

        props.webSocket.send(data, function () {
          console.log("Storing imported bookmarks...");
          emit("bookmarksImported");
        });
      };

      const onRejected = (error) => {
        console.warn(`An error: ${error}`);
        Notify.create({
          type: "negative",
          message: error,
        });
        emit("cancel");
      };

      const browserApi = typeof browser !== "undefined" ? browser : chrome;
      const gettingTree = browserApi.bookmarks.getTree();
      gettingTree.then(addBookmarks, onRejected);
    };

    return {
      dialog,
      importBookmarks,
    };
  },
  emits: ["cancel", "bookmarksImported"],
});
</script>

<style scoped></style>
