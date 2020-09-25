<template>
    <v-dialog :value="value" @input="$emit('input')" max-width="500px">
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
                <v-btn color="blue darken-1" text @click.native="$emit('input')">{{ getLocale('Cancel') }}</v-btn>
                <v-btn color="blue darken-1" text @click="importBookmarks">{{ getLocale('Import') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script>
    import * as util from '../scripts/util';

    export default {
        name: "ImportBrowserBookmarksDialog",
        props: ['webSocket', 'value'],
        methods: {
            getLocale(text) {
                return util.getLocale(text);
            },
            importBookmarks () {
                let that = this;
                let bookmarks = [];

                function addBookmark(bookmarkItem) {
                    // Chrome has no bookmarkItem.type
                    if (bookmarkItem.url && (bookmarkItem.type === 'bookmark' || !bookmarkItem.type)) {
                        bookmarks.push({"name": bookmarkItem.title, "url": bookmarkItem.url, "description": ""});
                    }

                    if (bookmarkItem.children) {
                        let child;
                        for (child of bookmarkItem.children) {
                            addBookmark(child);
                        }
                    }
                }

                function addBookmarks(bookmarkItems) {
                    addBookmark(bookmarkItems[0]);

                    const data = {type: "newBookmarks", data: bookmarks};

                    that.webSocket.send(data, function () {
                        console.log("Storing imported bookmarks...");
                        that.$emit('input');
                    });
                }

                function onRejected(error) {
                    console.warn(`An error: ${error}`);
                    that.$emit('input');
                }

                const gettingTree = browser.bookmarks.getTree();
                gettingTree.then(addBookmarks, onRejected);
            }
        }
    }
</script>

<style scoped>

</style>