<template>
    <div id="app">
        <v-app id="options">
            <v-toolbar flat dark color="grey darken-4">
                <v-card-title
                        class="headline spacedLetters upperCase ml-2"
                        v-html="getLocale('popupHeadline')"
                />
            </v-toolbar>

            <v-data-table
                    :headers="headers"
                    :items="bookmarks"
                    class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td class="text-no-wrap">{{ props.item.name }}</td>
                    <td>{{ props.item.url }}</td>
                    <!--<td><a href="{{ props.item.url }}">{{ props.item.name }}</a></td>-->
                    <!--<td class="text-xs-right"><a href="{{ props.item.url }}">{{ props.item.url }}</a></td>-->
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
                console.log("send test");

                const data = {type: "getBookmarks"};
                this.webSocket.send(data, function () {
                    console.log("Message was sent:" + data);
                });
            }
        },
        data() {
            return {
                headers: [
                    { text: 'Name', align: 'left', value: 'name' },
                    { text: 'Url', value: 'url' },
                ],
                bookmarks: [
                    {
                        value: false,
                        name: 'QOwnNotes',
                        url: 'https://www.qownnotes.org',
                    },
                    {
                        value: false,
                        name: 'Getting Started Tutorial',
                        url: 'https://developer.chrome.com/extensions/getstarted',
                    },
                    {
                        value: false,
                        name: 'Test',
                        url: '123',
                    },
                ]
            }
        },
        mounted() {
            let that = this;

            this.webSocket = new ws.QWebSocket(function (event) {
                const data = event.data;

                if (typeof data === 'string' || data instanceof String) {
                    // create a JSON object
                    const jsonObject = JSON.parse(data);

                    console.log("Got a new message: " + data);
                    console.log("Got a new message: " + jsonObject);
                    console.log(jsonObject.type);
                    const type = jsonObject.type;

                    if (type === "bookmarks") {
                        that.bookmarks = jsonObject.data;
                    }
                }
            });

            this.loadBookmarks();
        },
        watch: {
        }
    };
</script>
