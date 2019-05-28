<template>
    <div id="app">
        <v-app id="options">
            <v-toolbar flat dark color="grey darken-4">
                <v-card-title
                        class="headline spacedLetters upperCase ml-2"
                        v-html="getLocale('settingsHeadline')"
                />
            </v-toolbar>

            <v-form>
                <v-container>
                    <v-layout row wrap>
                        <v-flex xs12 sm6>
                            <v-text-field
                                    type="number"
                                    v-model.number="socketPort"
                                    clearable
                            >
                                <template slot="label">
                                    {{ getLocale('socketPortLabel') }}
                                </template>
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                            <v-text-field
                                    type="text"
                                    v-model.number="token"
                                    clearable
                            >
                                <template slot="label">
                                    {{ getLocale('Token') }}
                                </template>
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
                socketPortLabel: "Socket server port",
                token: ""
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
