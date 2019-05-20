<template>
    <v-dialog v-model="showDialog" @keydown.esc="closeDialog" @keydown.enter="importBookmarks" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ getLocale('ImportBrowserBookmarks') }}</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 sm12>
                            {{ getLocale('ImportAllBrowserBookmarks') }}
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="closeDialog">{{ getLocale('Cancel') }}</v-btn>
                <v-btn color="blue darken-1" flat @click="importBookmarks">{{ getLocale('Import') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script>
    import * as util from '../scripts/util';

    export default {
        name: "ImportBrowserBookmarksDialog",
        props: ['webSocket', 'showDialog'],
        data() {
            return {
                showDialog: false
            }
        },
        methods: {
            getLocale(text) {
                return util.getLocale(text);
            },
            closeDialog () {
                this.showDialog = false;
                console.log("close!");
            },
            importBookmarks () {
                let that = this;
                chrome.tabs.query({currentWindow: true}, function (tabs) {
                    let bookmarks = [];
                    tabs.forEach(function (tab) {
                        bookmarks.push({"name": tab.title, "url": tab.url, "description": that.editedBookmark.description});
                    });
                    const data = {type: "newBookmarks", data: bookmarks};

                    // that.webSocket.send(data, function () {
                    //     console.log("Storing bookmarks:" + data);
                    // });

                    that.closeDialog()
                });
            }
        },
        mounted() {
            function makeIndent(indentLength) {
                return ".".repeat(indentLength);
            }

            function logItems(bookmarkItem, indent) {
                console.log(bookmarkItem);
                if (bookmarkItem.url) {
                    console.log(makeIndent(indent) + bookmarkItem.url);
                } else {
                    console.log(makeIndent(indent) + "Folder");
                    indent++;
                }
                if (bookmarkItem.children) {
                    let child;
                    for (child of bookmarkItem.children) {
                        logItems(child, indent);
                    }
                }
                indent--;
            }

            function logTree(bookmarkItems) {
                logItems(bookmarkItems[0], 0);
            }

            function onRejected(error) {
                console.log(`An error: ${error}`);
            }

            var gettingTree = browser.bookmarks.getTree();
            gettingTree.then(logTree, onRejected);
        }
    }
</script>

<style scoped>

</style>