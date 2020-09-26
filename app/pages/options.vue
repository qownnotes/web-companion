<template>
    <div id="app">
        <v-app id="options">
            <v-toolbar text dark color="grey darken-4 flex-grow-0">
                <v-card-title
                        class="headline spacedLetters upperCase ml-2"
                        v-html="getLocale('settingsHeadline')"
                />
            </v-toolbar>

            <v-form class="flex-grow-0">
                <v-container>
                    <v-layout row wrap>
                        <v-flex xs12 sm6>
                            <v-text-field
                                    type="number"
                                    v-model.number="socketPort"
                                    :label="getLocale('socketPortLabel')"
                                    clearable
                            >
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-text-field
                                    v-model="password"
                                    :append-icon="showToken ? 'fa-eye' : 'fa-eye-slash'"
                                    @click:append="showToken = !showToken"
                                    :type="showToken ? 'text' : 'password'"
                                    v-model.number="token"
                                    :hint="getLocale('TokenHint')"
                                    :label="getLocale('Token')"
                                    clearable
                                    persistent-hint
                            >
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
        </v-app>
    </div>
</template>
<script>
    import * as util from '../scripts/util';
    const defaultSocketPort = 22222;

    export default {
        methods: {
            getLocale(text) {
                return util.getLocale(text);
            },
            loadSettings() {
                // ES5 workaround to access "this" in the "chrome.storage.sync.get" call
                const that = this;

                // load settings
                chrome.storage.sync.get( function ( data ) {
                    const port = data.socketPort;

                    if (port !== null && !isNaN(port)) {
                        that.socketPort = parseInt(port);
                    }

                    that.token = data.token;
                } );
            }
        },
        data() {
            return {
                socketPort: defaultSocketPort,
                token: "",
                showToken: false
            };
        },
        mounted() {
            this.loadSettings();
        },
        watch: {
            socketPort: function(val, oldVal) {
                if (val === null) {
                    this.socketPort = defaultSocketPort;
                    return;
                }

                let port = parseInt(val);

                if (port === 0 || isNaN(port)) {
                    port = defaultSocketPort;
                }

                chrome.storage.sync.set( {
                    socketPort: port,
                } );
            },
            token: function(val, oldVal) {
                if (val === null) {
                    return;
                }

                chrome.storage.sync.set( {
                    token: val,
                } );
            }
        }
    };
</script>
