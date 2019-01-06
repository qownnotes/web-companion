<template>
    <div id="app">
        <v-app id="options">
            <v-toolbar flat dark class="transparent mt-3">
                <v-dialog max-width="940">
                    <v-card>
                        <v-toolbar flat dark color="grey darken-4">
                            <v-card-title
                                    class="headline spacedLetters upperCase ml-2"
                                    v-html="getLocale('settingsHeadline')"
                            />
                        </v-toolbar>
                    </v-card>
                </v-dialog>
            </v-toolbar>

            <v-form>
                <v-container>
                    <v-layout row wrap>

                        <v-flex xs12 sm6>

                            <v-text-field
                                    label="Socket server port"
                                    v-model="socketPort"
                            ></v-text-field>
                            <p>Message is: {{ socketPort }}</p>

                            <input v-model="message" placeholder="edit me">
                            <p>Message is: {{ message }}</p>

                        </v-flex>

                    </v-layout>
                </v-container>
            </v-form>
        </v-app>
    </div>
</template>
<script>
    import * as util from '../scripts/util';

    export default {
        methods: {
            getLocale(text) {
                return util.getLocale(text);
            },
        },
        data() {
            return {
                socketPort: 22222,
                message: "All right!"
            };
        },
    };
</script>
