<template>
    <div id="app">
        <v-app id="options">
            <v-toolbar flat dark color="grey darken-4">
                <v-card-title
                        class="headline spacedLetters upperCase ml-2"
                        v-html="getLocale('popupHeadline')"
                />
                <v-card-title
                        class="subheading"
                        v-html="noteFolderName"
                        title="current note folder"
                />
                <v-spacer></v-spacer>
                <v-text-field
                        v-model="search"
                        ref="searchText"
                        id="searchText"
                        tabindex="1"
                        append-icon="search"
                        accesskey="s"
                        :label="getLocale('popupSearchLabel')"
                        single-line
                        hide-details
                        clearable
                ></v-text-field>
            </v-toolbar>

            <v-toolbar flat color="white">
                <v-autocomplete
                        v-model="selectedTags"
                        accesskey="t"
                        :items="allTags"
                        multiple
                        small-chips
                        single-line
                        deletable-chips
                        clearable
                        label="Tags"
                >
                </v-autocomplete>
                <!--<v-toolbar-title>name</v-toolbar-title>-->
                <!--<v-divider-->
                        <!--class="mx-2"-->
                        <!--inset-->
                        <!--vertical-->
                <!--&gt;</v-divider>-->
                <v-spacer></v-spacer>
                <v-btn @click="openAllVisibleBookmarks" accesskey="o" color="primary" flat icon title="Open all bookmarks in new tabs"><v-icon>open_in_new</v-icon></v-btn>
                <BookmarkAllTabsButton v-bind:webSocket="this.webSocket"></BookmarkAllTabsButton>
                <v-dialog v-model="bookmarkEditDialog" @keydown.esc="closeBookmarkDialog" @keydown.enter="saveBookmark" max-width="500px">
                    <v-btn slot="activator" @click="openBookmarkDialog" accesskey="a" color="primary" flat icon title="Add bookmark"><v-icon>add</v-icon></v-btn>
                    <v-card>
                        <v-card-title>
                            <span class="headline">New bookmark</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6>
                                        <v-text-field ref="editedBookmarkName" id="editedBookmarkName" tabindex="10" v-model="editedBookmark.name" label="Link name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field tabindex="12" v-model="editedBookmark.description" label="Description"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12>
                                        <v-text-field tabindex="11" v-model="editedBookmark.url" label="URL"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="closeBookmarkDialog">Cancel</v-btn>
                            <v-btn color="blue darken-1" flat @click="saveBookmark">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>

            <v-data-table
                    :headers="headers"
                    :items="filteredBookmarks"
                    :loading="loadingBookmarks"
                    :search="search"
                    :pagination.sync="pagination"
                    :rows-per-page-items="[10,25,50,75,100,{'text':'$vuetify.dataIterator.rowsPerPageAll','value':-1}]"
                    :disable-initial-sort="true"
                    id="bookmark-list"
                    class="elevation-1 bookmark-list"
            >
                <template slot="items" slot-scope="props">
                    <tr @click="openUrl(props.item.url)">
                        <td v-if="props.item.name" class="text-no-wrap">
                            <v-tooltip bottom>
                                <strong slot="activator"><a tabindex="2" :href="props.item.url" :accesskey="props.index + 1" target="_blank" @click="$event.stopPropagation()">{{ props.item.name | truncate(50, '…') }}</a></strong>
                                <span>
                                    <template v-if="props.item.name"><strong>{{ props.item.name }}</strong><br /></template>
                                    {{ props.item.url }}
                                    <template v-if="props.item.description"><br /><em>{{ props.item.description }}</em></template>
                                </span>
                            </v-tooltip>
                        </td>
                        <td v-if="props.item.name">{{ props.item.url | truncate(50, '…') }}</td>
                        <td v-if="props.item.name === ''" colspan="2" class="text-no-wrap">
                            <a tabindex="2" @click="$event.stopPropagation()" :accesskey="props.index + 1" :href="props.item.url" target="_blank" :title="props.item.url">{{ props.item.url | truncate(80, '…') }}</a>
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
    import BookmarkAllTabsButton from '../components/bookmark-all-tabs-button'

    export default {
        components: {
            BookmarkAllTabsButton: BookmarkAllTabsButton
        },
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
            },
            openAllVisibleBookmarks() {
                let that = this;
                $("#bookmark-list tr a").each(function () {
                    that.openUrl($(this).attr("href"));
                });
            },
            openBookmarkDialog () {
                this.bookmarkEditDialog = true;
                // focus and select all the text to be able to overwrite it easily
                this.$nextTick(() => this.$refs.editedBookmarkName.focus());
                this.$nextTick(() => $("#editedBookmarkName").select());
            },
            closeBookmarkDialog () {
                this.bookmarkEditDialog = false;

                // reset the dialog form
                this.$nextTick(() => this.editedBookmark = Object.assign({}, this.defaultBookmark));
            },
            saveBookmark () {
                const data = {type: "newBookmarks", data: [this.editedBookmark]};
                this.webSocket.send(data, function () {
                    console.log("Storing bookmark:" + data);
                });
                this.closeBookmarkDialog()
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
                search: '',
                noteFolderName: '',
                bookmarkEditDialog: false,
                editedBookmark: {
                    name: '',
                    url: '',
                    description: ''
                },
                defaultBookmark: {
                    name: '',
                    url: '',
                    description: ''
                },
                pagination: {
                    rowsPerPage: 10
                },
                selectedTags: [],
                webSocket: null
            }
        },
        mounted() {
            let that = this;
            this.$refs.searchText.focus();

            chrome.storage.sync.get( function ( data ) {
                that.search = data.search;

                // select all the text to be able to overwrite it easily
                that.$nextTick(() => $("#searchText").select());
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
                        that.noteFolderName = jsonObject.noteFolderName;
                        that.loadingBookmarks = false;

                        chrome.storage.sync.get( function ( data ) {
                            // console.log("after load");
                            // console.log(that.pagination.page);
                            that.pagination.page = data.pagination.page;
                            that.selectedTags = data.selectedTags;
                        } );
                    }
                }
            });

            this.loadBookmarks();

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                that.defaultBookmark.name = tabs[0].title;
                that.editedBookmark.name = tabs[0].title;
                that.defaultBookmark.url = tabs[0].url;
                that.editedBookmark.url = tabs[0].url;
            });
        },
        watch: {
            search: function (val, oldVal) {
                chrome.storage.sync.set( {
                    search: val
                } );
            },
            selectedTags: function (val, oldVal) {
                chrome.storage.sync.set( {
                    selectedTags: val
                } );
            },
            // this seems to be also executed when the popup disappears and reset the values that way
            pagination: function (val, oldVal) {
                // console.log("pagination watch");
                // console.log(val.page);
                chrome.storage.sync.set( {
                    pagination: val
                } );
            },
            bookmarkEditDialog (val) {
                this.$refs.editedBookmarkName.focus();

                val || this.closeBookmarkDialog()
            }
        },
        computed: {
            // creates a list of all tags of bookmarks
            allTags: function () {
                let allTags = [];

                this.bookmarks.forEach(function(bookmark) {
                    bookmark.tags.forEach(function(tag) {
                        if (allTags.indexOf(tag) === -1) {
                            allTags.push(tag);
                        }
                    });
                });

                return allTags.sort();
            },
            // creates a list of all bookmarks filtered by selectedBookmarks
            filteredBookmarks: function () {
                if (this.selectedTags.length === 0) {
                    return this.bookmarks;
                }

                let filteredBookmarks = [];
                let that = this;

                this.bookmarks.forEach(function(bookmark) {
                    if (that.selectedTags.every(elem => bookmark.tags.indexOf(elem) > -1)) {
                        filteredBookmarks.push(bookmark);
                    }
                });

                return filteredBookmarks;
            }
        }
    };
</script>
<style lang="scss">
    #app {
        min-width: 600px;
        min-height: 500px;
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
