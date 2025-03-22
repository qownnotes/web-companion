<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="consent-page">
        <q-card>
          <q-card-section class="section">
            <h1 class="q-mb-md text-h6">{{ getLocale("ConsentHeadline") }}</h1>
            <p class="q-mb-md">
              {{ getLocale("appDescription") }}
            </p>
            <p class="q-mb-md">
              {{ getLocale("ConsentIntro") }}
            </p>
            <q-list>
              <q-item v-for="(data, index) in consentData" :key="index">
                <q-item-section>
                  <q-item-label>{{ data }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <p class="q-mt-md">
              {{ getLocale("ConsentFooter") }}
            </p>
          </q-card-section>
          <q-card-actions class="actions" align="right">
            <q-btn flat color="primary" @click="doConsent">
              {{ getLocale("ConsentButton") }}
            </q-btn>
            <q-btn flat color="secondary" @click="doUninstall">
              {{ getLocale("UninstallButton") }}
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent } from "vue";
import { getLocale } from "src/helpers/utils";

export default defineComponent({
  methods: { getLocale },
  setup() {
    const consentData = [
      getLocale("ConsentData1"),
      getLocale("ConsentData2"),
      getLocale("ConsentData3"),
      getLocale("ConsentData4"),
    ];
    const doConsent = () => {
      chrome.storage.sync.set({ consent: true }, () => {
        chrome.storage.sync.set({
          userDataConsent: true,
        });

        window.close();
      });
    };

    const doUninstall = () => {
      chrome.management.uninstallSelf();
    };

    return {
      consentData,
      doConsent,
      doUninstall,
    };
  },
});
</script>
<style scoped>
.consent-page {
  min-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    margin: 12px 0 8px 0;
  }

  .section {
    padding: 0 16px;
  }

  .actions {
    padding-top: 0;
  }
}
</style>
