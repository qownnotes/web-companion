import Vue from 'vue';
import Vuetify from 'vuetify';
import VueTruncate from 'vue-truncate-filter';
import Popup from '../pages/popup.vue'
import "material-design-icons-iconfont/dist/material-design-icons.css"
import 'vuetify/dist/vuetify.css'
import '../styles/popup.css';

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
    Vue.use(Vuetify);
    Vue.use(VueTruncate);

    new Vue({
        el: '#app',
        render: (h) => h(Popup)
    });
}

initPopup();
