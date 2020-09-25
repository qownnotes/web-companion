
// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
    // iconfont: 'fa4',
    // icons: {
    //     // 'clear': 'fas fa-times fa-lg',
    //     'clear': 'fa-times',
    // }
}

export default new Vuetify(opts)