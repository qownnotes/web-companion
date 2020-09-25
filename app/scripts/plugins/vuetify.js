
// src/plugins/vuetify.js

// import '@mdi/font/css/materialdesignicons.css'
import 'font-awesome/css/font-awesome.min.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
    icons: {
        iconfont: 'fa4',
        values: {
            // 'clear': 'fas fa-times fa-lg',
            'clear': 'fa-times',
        }
    },
}

export default new Vuetify(opts)