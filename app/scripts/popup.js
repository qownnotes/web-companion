import Vue from 'vue';
// import Vuetify from 'vuetify/lib'
import vuetify from './plugins/vuetify'
import VueTruncate from 'vue-truncate-filter';
import Popup from '../pages/popup.vue'
import Consent from '../pages/consent.vue'

// import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// import 'vuetify/dist/vuetify.min.css'
// import '../styles/popup.css';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { fas } from '@fortawesome/free-solid-svg-icons'
// import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
// import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader

console.log("QOwnNotes popup page");

/*
 * Initialize Popup
 */
function initPopup() {
    try {
        initVue();
    } catch (e) {
        throw new Error(`Error Initializing Popup | ${e}`);
    }
}

/*
 * Initialize Vue
 */
function initVue() {
    // Vue.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
    // library.add(fas) // Include needed icons.

    // Vue.use(Vuetify, {
    //     iconfont: 'fa4',
    //     icons: {
    //         // 'clear': 'fas fa-times fa-lg',
    //         'clear': 'fa-times',
    //     }
    // });

    // const vuetifyOpts = {
    //     iconfont: 'fa4',
    //     icons: {
    //         // 'clear': 'fas fa-times fa-lg',
    //         'clear': 'fa-times',
    //     }
    // }

    Vue.use(VueTruncate);

    // DEBUG: remove userDataConsent
    // chrome.storage.sync.remove(["userDataConsent"]);

    chrome.storage.sync.get(function (data) {
        if (data.userDataConsent === true) {
            /* eslint-disable no-new */
            new Vue({
                vuetify,
                components: {Popup},
                render: h => h(Popup),
            }).$mount('#app');
        } else {
            /* eslint-disable no-new */
            new Vue({
                vuetify,
                components: {Consent},
                render: h => h(Consent),
            }).$mount('#app');
        }
    });
}

initPopup();
