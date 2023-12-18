
// src/plugins/vuetify.js

// import '@mdi/font/css/materialdesignicons.css'
import 'font-awesome/css/font-awesome.min.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

import af from 'vuetify/lib/locale/af';
import ar from 'vuetify/lib/locale/ar';
import ca from 'vuetify/lib/locale/ca';
import cs from 'vuetify/lib/locale/cs';
import de from 'vuetify/lib/locale/de';
import el from 'vuetify/lib/locale/el';
import en from 'vuetify/lib/locale/en';
import es from 'vuetify/lib/locale/es';
import et from 'vuetify/lib/locale/et';
import fa from 'vuetify/lib/locale/fa';
import fi from 'vuetify/lib/locale/fi';
import fr from 'vuetify/lib/locale/fr';
import he from 'vuetify/lib/locale/he';
import hr from 'vuetify/lib/locale/hr';
import hu from 'vuetify/lib/locale/hu';
import id from 'vuetify/lib/locale/id';
import it from 'vuetify/lib/locale/it';
import ja from 'vuetify/lib/locale/ja';
import ko from 'vuetify/lib/locale/ko';
import lt from 'vuetify/lib/locale/lt';
import lv from 'vuetify/lib/locale/lv';
import nl from 'vuetify/lib/locale/nl';
import no from 'vuetify/lib/locale/no';
import pl from 'vuetify/lib/locale/pl';
import pt from 'vuetify/lib/locale/pt';
import ro from 'vuetify/lib/locale/ro';
import ru from 'vuetify/lib/locale/ru';
import sk from 'vuetify/lib/locale/sk';
import sl from 'vuetify/lib/locale/sl';
import srCyrl from 'vuetify/lib/locale/sr-Cyrl';
import sv from 'vuetify/lib/locale/sv';
import th from 'vuetify/lib/locale/th';
import tr from 'vuetify/lib/locale/tr';
import uk from 'vuetify/lib/locale/uk';
import zhHans from 'vuetify/lib/locale/zh-Hans';
import zhHant from 'vuetify/lib/locale/zh-Hant';

// https://fontawesome.com/v4.7.0/icons/
const opts = {
    icons: {
        iconfont: 'fa4',
        values: {
            // 'clear': 'fas fa-times fa-lg',
            'clear': 'fa-times',
        }
    },
    lang: {
        locales: { af, ar, ca, cs, de, el, en, es, et, fa, fi, fr, he, hr, hu, id, it, ja, ko, lt, lv, nl, no, pl, pt, ro, ru, sk, sl, srCyrl, sv, th, tr, uk, zhHans, zhHant },
        current: chrome.i18n.getUILanguage(),
    },
}

// Omit all the 'Translation key xxx not found, falling back to default' messages
Vuetify.config.silent = true;

export default new Vuetify(opts)