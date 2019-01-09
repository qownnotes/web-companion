import Vue from 'vue';
// import Vue from 'vue/dist/vue.js';
import Vuetify from 'vuetify';
import Options from '../pages/options.vue'
import "material-design-icons-iconfont/dist/material-design-icons.css"
import 'vuetify/dist/vuetify.css'
import '../styles/options.css';

console.log("QOwnNotes options page");

/*
 * Initialize Options
 */
function initOptions() {
    try {
        initVue();
    } catch (e) {
        throw new Error(`Error Initializing Options | ${e}`);
    }
}

/*
 * Initialize Vue
 */
function initVue() {
    Vue.use(Vuetify, {});

    new Vue({
        el: '#app',
        render: (h) => h(Options)
    });
}

initOptions();
