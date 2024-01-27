<template>
  <q-page class="flex flex-center" style="min-width: 400px; min-height: 300px">
    <q-card flat class="">
      <q-card-section>
        <div class="text-h6">{{ getLocale('InputToken') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="token" autofocus @keyup.enter="storeToken" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="getLocale('Cancel')" @click="cancelClicked" />
        <q-btn flat :label="getLocale('Ok')" type="submit" @click="storeToken" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import {getLocale} from "src/helpers/utils";
import {defineComponent, onMounted, ref, watch} from "vue";
import {QWebSocket} from "src/services/qwebsocket";

export default defineComponent({
  name: "InputTokenDialog",
  setup(_, { emit }) {
    const token = ref('');

    chrome.storage.sync.get(['token'], (result) => {
      token.value = result.token;
    });

    const storeToken = () => {
      chrome.storage.sync.set({ token: token.value }, () => {
        // Assuming you want to emit an event in Vue 3
        // The setup function doesn't have access to `this`
        // Consider using a custom event to communicate with the parent component
        // You may also use the Composition API's provide/inject for parent-child communication
        // Alternatively, you can use a ref to track the parent component instance
        // and then use ref.value.$emit('input') to emit the event

        console.log("token.value", token.value);
        emit('tokenStored');
      });
    };

    const cancelClicked = () => {
      emit('cancel');
    };

    // Return variables and methods that you want to expose to the template
    return {
      token,
      getLocale,
      storeToken,
      cancelClicked
    };
  },
  emits: ['tokenStored', 'cancel']
})
</script>

<style scoped>

</style>
