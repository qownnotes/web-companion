<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ getLocale("BookmarkAllTabs") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col q-pa-md q-gutter-sm">
            <q-input
              tabindex="1"
              clearable
              @keyup.enter="storeBookmarks"
              v-model="description"
              :label="getLocale('Description')"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="getLocale('Cancel')"
          tabindex="3"
          v-close-popup
          @click="$emit('cancel')"
        />
        <q-btn
          flat
          :label="getLocale('Ok')"
          color="primary"
          tabindex="2"
          @click="storeBookmarks"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getLocale } from "src/helpers/utils";
import { defineComponent, reactive, ref } from "vue";
import { QWebSocket } from "src/services/qwebsocket";

export default defineComponent({
  name: "BookmarkAllTabsDialog",
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
    const description = ref("");

    const storeBookmarks = () => {
      chrome.tabs.query({ currentWindow: true }, function (tabs) {
        let bookmarks = [];
        tabs.forEach(function (tab) {
          bookmarks.push({
            name: tab.title,
            url: tab.url,
            description: description.value,
          });
        });
        const data = { type: "newBookmarks", data: bookmarks };

        props.webSocket.send(data, function () {
          console.log("Storing bookmarks:" + data);
          emit("bookmarksStored");
        });

        dialog.value = false;
      });
    };

    return {
      dialog,
      description,
      storeBookmarks,
    };
  },
  emits: ["cancel", "bookmarksStored"],
});
</script>

<style scoped></style>
