<template>
    <div id="app">
        <v-app id="options">
            <v-toolbar flat dark color="grey darken-4">
                <v-card-title
                        class="headline spacedLetters upperCase ml-2"
                        v-html="getLocale('popupHeadline')"
                />
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        append-icon="search"
                        :label="getLocale('popupSearchLabel')"
                        single-line
                        hide-details
                ></v-text-field>
            </v-toolbar>

            <v-data-table
                    :headers="headers"
                    :items="bookmarks"
                    :loading="loadingBookmarks"
                    :search="search"
                    :rows-per-page-items="[8,10,25,50,75,100,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
                    :disable-initial-sort="true"
                    class="elevation-1 bookmark-list"
            >
                <template slot="items" slot-scope="props" :title="props.item.url">
                    <tr v-if="props.item.name" :title="props.item.name + '\n' + props.item.url" @click="openUrl(props.item.url)">
                        <td class="text-no-wrap">
                            <strong><a :href="props.item.url" target="_blank">{{ props.item.name | truncate(50, '…') }}</a></strong>
                        </td>
                        <td>{{ props.item.url | truncate(50, '…') }}</td>
                    </tr>
                    <tr v-else="props.item.name" :title="props.item.url" @click="openUrl(props.item.url)">
                        <td colspan="2" class="text-no-wrap">
                            <a :href="props.item.url" target="_blank">{{ props.item.url | truncate(100, '…') }}</a>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-app>
    </div>
</template>
<script>
    import * as util from '../scripts/util';
    import * as ws from '../scripts/services/qwebsocket';

    export default {
        methods: {
            getLocale(text) {
                return util.getLocale(text);
            },
            loadBookmarks() {
                this.loadingBookmarks = true;

                const data = {type: "getBookmarks"};
                this.webSocket.send(data, function () {
                    console.log("Loading bookmarks:" + data);
                });
            },
            openUrl(url) {
                chrome.tabs.create({ url: url });
            }
        },
        data() {
            return {
                headers: [
                    { text: 'Name', align: 'left', value: 'name' },
                    { text: 'Url', value: 'url' },
                ],
                bookmarks: [],
                loadingBookmarks: false,
                search: ''
            }
        },
        mounted() {
            let that = this;

            this.webSocket = new ws.QWebSocket(function (event) {
                const data = event.data;

                if (typeof data === 'string' || data instanceof String) {
                    // create a JSON object
                    const jsonObject = JSON.parse(data);
                    const type = jsonObject.type;

                    // console.log("Got a new message: " + data);
                    // console.log("Got a new message: " + jsonObject);
                    // console.log(jsonObject.type);

                    if (type === "bookmarks") {
                        that.bookmarks = jsonObject.data;
                        that.loadingBookmarks = false;
                    }
                }
            });

            this.loadBookmarks();
        },
        watch: {
        }
    };
</script>
<style scoped lang="scss">
    #app {
        min-width: 500px;
    }

    .bookmark-list {
        a {
            color: black;
            text-decoration: none;
        }

        td {
            cursor: pointer;
        }
    }
</style>
