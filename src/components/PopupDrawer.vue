<template>
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item clickable @click="importBrowserBookmarksClicked">
        <q-item-section avatar>
          <q-icon name="save_alt" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ getLocale("ImportBrowserBookmarks") }}</q-item-label>
          <q-item-label caption>{{
            getLocale("ImportBrowserBookmarksCaption")
          }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <DrawerLink v-for="link in linksList" :key="link.title" v-bind="link" />
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label
            ><q-toggle v-model="privateMode" :label="getLocale('PrivateMode')">
              <q-tooltip class="bg-accent">{{
                getLocale("PrivateModeTooltip")
              }}</q-tooltip>
            </q-toggle></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <q-item-label
            ><q-toggle v-model="hideCurrent" :label="getLocale('HideCurrent')">
              <q-tooltip class="bg-accent">{{
                getLocale("HideCurrentTooltip")
              }}</q-tooltip>
            </q-toggle></q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script>
import { getLocale } from "src/helpers/utils";
import { defineComponent, onMounted, ref, watch } from "vue";
import DrawerLink from "components/DrawerLink.vue";

const linksList = [
  {
    title: getLocale("WebClipper"),
    caption: getLocale("WebClipperCaption"),
    icon: "info",
    link: "https://www.qownnotes.org/getting-started/browser-extension.html#web-clipper",
  },
];

export default defineComponent({
  name: "PopupDrawer",
  components: { DrawerLink },
  methods: { getLocale },
  props: {
    model: {
      type: Boolean,
      default: false,
    },
  },
  setup(prop, { emit }) {
    const leftDrawerOpen = ref(prop.model);
    const privateMode = ref(false);
    const hideCurrent = ref(false);

    onMounted(() => {
      chrome.storage.sync.get((data) => {
        privateMode.value = data.privateMode || false;
        hideCurrent.value = data.hideCurrent || false;
      });
    });

    watch(privateMode, (value) => {
      chrome.storage.sync.set({ privateMode: value });
      emit("privateModeChanged", value);
    });

    watch(hideCurrent, (value) => {
      chrome.storage.sync.set({ hideCurrent: value });
      emit("hideCurrentChanged", value);
    });

    const importBrowserBookmarksClicked = () => {
      emit("importBrowserBookmarksClicked");
    };

    // Return variables and methods that you want to expose to the template
    return {
      privateMode,
      hideCurrent,
      leftDrawerOpen,
      linksList,
      importBrowserBookmarksClicked,
    };
  },
  emits: [
    "importBrowserBookmarksClicked",
    "hideCurrentChanged",
    "privateModeChanged",
  ],
});
</script>

<style scoped></style>
