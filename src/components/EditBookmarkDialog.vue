<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ getLocale("EditBookmark") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col q-pa-md q-gutter-sm">
            <q-input
              tabindex="1"
              @keyup.enter="storeBookmark"
              v-model="newMarkdown"
              autofocus
              autogrow
              input-style="min-width: 460px;"
              :label="getLocale('BookmarkText')"
            ></q-input>
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
          @click="storeBookmark"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getLocale } from "src/helpers/utils";
import { computed, defineComponent, ref } from "vue";
import { QWebSocket } from "src/services/qwebsocket";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "EditBookmarkDialog",
  methods: { getLocale },
  props: {
    model: {
      type: Boolean,
      default: false,
    },
    markdown: {
      type: String,
      default: "",
      required: true,
    },
    webSocket: {
      type: QWebSocket,
      required: true,
    },
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const dialog = ref(props.model);
    let markdownToStore = "";

    const newMarkdown = computed({
      get: () => props.markdown,
      set: (value) => {
        markdownToStore = value;
      },
    });

    const storeBookmark = () => {
      const data = {
        type: "editBookmark",
        data: { markdown: props.markdown, newMarkdown: markdownToStore },
      };

      $q.dialog({
        title: getLocale("EditBookmarkConfirmTitle"),
        message: `
            ${getLocale("EditBookmarkConfirmMessage")}<br><br>
            <code style="display: block; overflow-x: auto">${data.data.markdown}</code><br>
            ${getLocale("EditBookmarkConfirmMessage2")}<br><br>
            <code style="display: block; overflow-x: auto">${data.data.newMarkdown}</code>`,
        html: true,
        cancel: true,
        persistent: true,
      }).onOk(() => {
        props.webSocket.send(data, () => {
          console.log("Edited bookmark:" + data);
          emit("bookmarkEdited");
        });
      });
    };

    return {
      dialog,
      newMarkdown,
      storeBookmark,
    };
  },
  emits: ["cancel", "bookmarkEdited"],
});
</script>

<style scoped></style>
