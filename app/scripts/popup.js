import Vue from 'vue';
import Vuetify from 'vuetify';
import VueTruncate from 'vue-truncate-filter';
import Popup from '../pages/popup.vue'
// import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'vuetify/dist/vuetify.min.css'
import '../styles/popup.css';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { fas } from '@fortawesome/free-solid-svg-icons'
// import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader

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

    Vue.use(Vuetify, {
        iconfont: 'fa4',
        icons: {
            // 'clear': 'fas fa-times fa-lg',
            'clear': 'fa-times',
        }
    });
    Vue.use(VueTruncate);

    new Vue({
        el: '#app',
        render: (h) => h(Popup)
    });
}

initPopup();
