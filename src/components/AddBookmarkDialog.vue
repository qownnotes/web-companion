<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ getLocale('NewBookmark') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col q-pa-md q-gutter-sm">
            <q-input
              tabindex="1"
              clearable
              @keyup.enter="storeBookmark"
              v-model="editedBookmark.name"
              autofocus
              :label="getLocale('LinkName')"
            >
              <template v-slot:prepend>
                <q-icon name="bookmark" />
              </template>
            </q-input>
          </div>
          <div class="col q-pa-md q-gutter-sm">
            <q-input
              tabindex="3"
              clearable
              @keyup.enter="storeBookmark"
              v-model="editedBookmark.description"
              :label="getLocale('Description')"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col q-pa-md q-gutter-sm">
            <q-input
              tabindex="2"
              clearable
              type="url"
              @keyup.enter="storeBookmark"
              v-model="editedBookmark.url"
              :label="getLocale('URL')"
            >
              <template v-slot:prepend>
                <q-icon name="http" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="getLocale('Cancel')" tabindex="5" v-close-popup @click="$emit('cancel')" />
        <q-btn flat :label="getLocale('Ok')" color="primary" tabindex="4" @click="storeBookmark" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {getLocale} from "src/helpers/utils";
import {defineComponent, reactive, ref} from "vue";
import {QWebSocket} from "src/services/qwebsocket";

export default defineComponent({
  name: "AddBookmarkDialog",
  methods: {getLocale},
  props: {
    model: {
      type: Boolean,
      default: false
    },
    bookmark: {
      type: Object,
      default: () => ({ name: '', description: '', url: '' }),
      required: true
    },
    webSocket: {
      type: QWebSocket,
      required: true
    }
  },
  setup(props, { emit }) {
    const dialog = ref(props.model);
    const editedBookmark = reactive(props.bookmark);

    const storeBookmark = (event) => {
      // // Prevent that pressing Enter to save bookmark triggers a 2nd dialog
      // if (event) {
      //   event.preventDefault();
      // }

      const data = {type: "newBookmarks", data: [editedBookmark]};

      props.webSocket.send(data, function () {
        console.log("Stored bookmark:" + data);
        emit('bookmarkStored');
      });
    };

    return {
      dialog,
      editedBookmark,
      storeBookmark
    };
  },
  emits: ['cancel', 'bookmarkStored']
})
</script>

<style scoped>

</style>
