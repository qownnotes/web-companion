import Vue from 'vue';
// import Vue from 'vue/dist/vue.js';
import Vuetify from 'vuetify';
import Options from '../pages/options.vue'
import '../styles/options.css';


console.log("Go!");

// var app = new Vue(vmApp).$mount('#app');
// app.data({message: 'Hello Vue!'});


/*
 * Initialize Options
 */
function initOptions() {
    try {
        initVue();
    } catch (e) {
        throw new Error(`?? Error Initializing Options | ${e}`);
    }
}


/*
 * Initialize Vue
 */
function initVue() {
    Vue.use(Vuetify, {
        // iconfont: 'feather',
        // icons: {
        //     // Extension card icon
        //     box: 'feather-box',
        //     link: 'feather-link',
        //     refresh: 'feather-refresh-cw',
        //     trash: 'feather-trash-2',
        //
        //     // Toolbar icons
        //     store: 'feather-shopping-cart',
        //     search: 'feather-search',
        //     info: 'feather-info',
        //     settings: 'feather-sliders',
        //
        //     // Modal icons
        //     twitter: 'feather-twitter',
        //     website: 'feather-globe',
        //     github: 'feather-github',
        //     download: 'feather-download',
        //     chrome: 'feather-chrome',
        //     users: 'feather-users',
        //     grid: 'feather-grid',
        //
        //     // Misc Icons
        //     x: 'feather-x',
        //     x_circle: 'feather-x-circle',
        //     tick: 'feather-check',
        //     tick_circle: 'feather-check-circle',
        //     add: 'feather-plus',
        //     warning: 'feather-alert-triangle',
        // },
    });

    new Vue({
        el: '#app',
        render: (h) => h(Options),
        data: {
            socketPort: 22222,
            message: "All right!"
        }
    });
}

initOptions();


$(function () {

    console.log(`'Allo 'Allo! Options`);

    // $("#socket-port").change(function () {
    //
    // });
    //
    // $("#sport").click(function () {
    //     console.log("Port!!!!");
    // });

    // var Vue = require('vue');

    // var app = new Vue({
    //     el: '#app',
    //     data: {
    //         message: 'Hello Vue!'
    //     }
    // })
});
//
// let socketPort = 22222;
//
// function resetSettings() {
//     chrome.storage.sync.clear();
//     socketPort = 22222;
// }
//
// /**
//  *
//  * @param info
//  * @param tab
//  */
// function setSocketPort(info, tab) {
//     const portText = prompt("Please enter the QOwnNotes socket port", socketPort);
//
//     if (portText === null) {
//
//         return;
//     }
//
//     const port = parseInt(portText);
//
//     if (port === 0) {
//         return;
//     }
//
//     console.log(port);
//
//     socketPort = port;
//     close();
//
//     chrome.storage.sync.set( {
//         socketPort: port,
//     } );
// }
//
// document.getElementById("sport").addEventListener("click", setSocketPort);
// document.getElementById("rsettings").addEventListener("click", resetSettings);
