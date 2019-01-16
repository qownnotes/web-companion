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
                        clearable
                ></v-text-field>
            </v-toolbar>

            <v-data-table
                    :headers="headers"
                    :items="bookmarks"
                    :loading="loadingBookmarks"
                    :search="search"
                    :rows-per-page-items="[10,25,50,75,100,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
                    :disable-initial-sort="true"
                    class="elevation-1 bookmark-list"
            >
                <template slot="items" slot-scope="props">
                        <tr @click="openUrl(props.item.url)">
                            <td v-if="props.item.name" class="text-no-wrap">
                                <v-tooltip bottom>
                                    <strong slot="activator"><a :href="props.item.url" target="_blank" @click="$event.stopPropagation()">{{ props.item.name | truncate(50, '…') }}</a></strong>
                                    <span>
                                        <template v-if="props.item.name"><strong>{{ props.item.name }}</strong><br /></template>
                                        {{ props.item.url }}
                                        <template v-if="props.item.description"><br /><em>{{ props.item.description }}</em></template>
                                    </span>
                                </v-tooltip>
                            </td>
                            <td v-if="props.item.name">{{ props.item.url | truncate(50, '…') }}</td>
                            <td v-if="props.item.name === ''" colspan="2" class="text-no-wrap">
                                <a @click="$event.stopPropagation()" :href="props.item.url" target="_blank" :title="props.item.url">{{ props.item.url | truncate(100, '…') }}</a>
                            </td>
                            <td class="link-tags">
                                <span class="tag" v-for="tag in props.item.tags">{{ tag }}</span>
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
                    { text: 'Url', align: 'left', value: 'url' },
                    { text: 'Tags', value: 'tags' },
                ],
                bookmarks: [],
                loadingBookmarks: false,
                search: ''
            }
        },
        mounted() {
            let that = this;

            chrome.storage.sync.get( function ( data ) {
                that.search = data.search;
            } );

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
            search: function (val, oldVal) {
                chrome.storage.sync.set( {
                    search: val
                } );
            }
        }
    };
</script>
<style lang="scss">
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

        span.tag {
            background: #444;
            padding: 3px;
            color: white;
            border-radius: 5px;
            margin: 1px;
            display: inline-block;
            font-size: 0.8em;
        }

        table.v-table {
            tr {
                height: 30px;
            }

            tbody td, tbody th, thead th, tbody td:first-child, thead th:first-child {
                height: 30px;
                padding: 0 10px;

                span {
                    line-height: 3em;
                    display: inline-block;
                }
            }

            tbody td.link-tags {
                white-space: nowrap;

                span {
                    line-height: inherit;
                }

                span::first-letter {
                    /*display: none;*/
                    /*color: red;*/
                }
            }
        }
    }
</style>
