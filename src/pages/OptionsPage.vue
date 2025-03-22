<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ getLocale("settingsHeadline") }}</div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input
            filled
            type="number"
            v-model="socketPort"
            :label="getLocale('socketPortLabel')"
          />
          <q-input
            filled
            :type="isPwd ? 'password' : 'text'"
            v-model="token"
            :label="getLocale('Token')"
            :hint="getLocale('TokenHint')"
            hide-bottom-space
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { getLocale } from "src/helpers/utils";
import { defineComponent, onMounted, ref, watch } from "vue";

export default defineComponent({
  methods: { getLocale },
  setup() {
    const defaultSocketPort = 22222;
    let socketPort = ref(defaultSocketPort);
    let token = ref("");
    const isPwd = ref(true);

    const loadSettings = () => {
      // Load settings
      chrome.storage.sync.get(function (data) {
        const port = data.socketPort;

        if (port !== null && !isNaN(port)) {
          socketPort.value = parseInt(port);
        }

        token.value = data.token;
      });
    };

    onMounted(() => {
      loadSettings();
    });

    watch(socketPort, (newValue) => {
      if (newValue === null) {
        socketPort.value = defaultSocketPort;
        return;
      }

      if (newValue === 0 || isNaN(newValue)) {
        newValue = defaultSocketPort;
      }

      chrome.storage.sync.set({ socketPort: newValue });
    });

    watch(token, (newValue) => {
      if (newValue === null) {
        return;
      }

      chrome.storage.sync.set({ token: newValue });
    });

    return {
      token,
      isPwd,
      socketPort,
    };
  },
});
</script>
