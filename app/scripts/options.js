import Vue from 'vue';
import vuetify from './plugins/vuetify'
import Options from '../pages/options.vue'
// import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// import 'font-awesome/css/font-awesome.min.css' // Ensure you are using css-loader
// import 'vuetify/dist/vuetify.min.css'
// import '../styles/options.css';

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
    // Vue.use(Vuetify, {
    //     iconfont: 'fa4',
    //     icons: {
    //         'clear': 'fa-times',
    //     }
    // });

    new Vue({
        vuetify,
        components: { Options },
        render: (h) => h(Options)
    }).$mount('#app');
}

initOptions();
